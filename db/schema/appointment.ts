import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { appointmentStatusEnum } from "./enums";
import { doctor } from "./doctor";
import { patient } from "./patient";
import { clinic } from "./clinic";
import { relations } from "drizzle-orm";

// --- Appointment (Prisma Model) ---
export const appointment = pgTable(
  "Appointment",
  {
    id: text("id").notNull().primaryKey(),
    doctorId: text("doctorId")
      .notNull()
      .references(() => doctor.id),
    patientId: text("patientId")
      .notNull()
      .references(() => patient.id),
    clinicId: text("clinicId").references(() => clinic.id),
    date: timestamp("date", { withTimezone: true }).notNull(),
    status: appointmentStatusEnum("status").default("PENDING").notNull(),
    reason: text("reason"),
    // ... timestamps
  },
  (table) => ({
    doctorDateIdx: index("appointment_doctor_id_date_idx").on(
      table.doctorId,
      table.date
    ),
    patientStatusIdx: index("appointment_patient_id_status_idx").on(
      table.patientId,
      table.status
    ),
  })
);

export const appointmentsRelations = relations(appointment, ({ one }) => ({
  doctor: one(doctor, {
    fields: [appointment.doctorId],
    references: [doctor.id],
  }),
  patient: one(patient, {
    fields: [appointment.patientId],
    references: [patient.id],
  }),
  clinic: one(clinic, {
    fields: [appointment.clinicId],
    references: [clinic.id],
  }),
}));
