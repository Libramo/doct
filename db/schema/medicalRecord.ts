import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { patient } from "./patient";
import { doctor } from "./doctor";
import { relations } from "drizzle-orm";

// --- MedicalRecord (Prisma Model) ---
export const medicalRecord = pgTable(
  "MedicalRecord",
  {
    id: text("id").primaryKey(),
    patientId: text("patientId")
      .notNull()
      .references(() => patient.id),
    doctorId: text("doctorId").references(() => doctor.id),
    description: text("description").notNull(),
    meta: jsonb("meta"),
    // ... timestamps
  },
  (table) => ({
    patientIdx: index("medical_record_patient_id_idx").on(table.patientId),
  })
);

export const medicalRecordsRelations = relations(medicalRecord, ({ one }) => ({
  patient: one(patient, {
    fields: [medicalRecord.patientId],
    references: [patient.id],
  }),
  doctor: one(doctor, {
    fields: [medicalRecord.doctorId],
    references: [doctor.id],
  }),
}));
