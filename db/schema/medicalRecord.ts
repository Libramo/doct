import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { patient } from "./patient";
import { doctor } from "./doctor";
import { relations } from "drizzle-orm";
import { medicalFile } from "./medicalFile";

// --- MedicalRecord (Prisma Model) ---
export const medicalRecord = pgTable(
  "MedicalRecord",
  {
    id: uuid("id").defaultRandom().notNull().primaryKey(),
    patientId: uuid("patient_id")
      .notNull()
      .references(() => patient.id),
    doctorId: uuid("doctor_id").references(() => doctor.id),
    description: text("description").notNull(),
    meta: jsonb("meta"),
    // ... timestamps
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("medical_record_patient_id_idx").on(table.patientId)]
);

export const medicalRecordsRelations = relations(
  medicalRecord,
  ({ one, many }) => ({
    patient: one(patient, {
      fields: [medicalRecord.patientId],
      references: [patient.id],
    }),
    doctor: one(doctor, {
      fields: [medicalRecord.doctorId],
      references: [doctor.id],
    }),
    files: many(medicalFile),
  })
);
