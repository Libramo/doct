import {
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { appointmentStatusEnum } from "./enums";
import { doctor } from "./doctor";
import { patient } from "./patient";
import { clinic } from "./clinic";
import { InferSelectModel, relations } from "drizzle-orm";

// --- Appointment (Prisma Model) ---
export const appointment = pgTable(
  "Appointment",
  {
    id: uuid("id").defaultRandom().notNull().primaryKey(),
    title: text("title"),
    doctorId: uuid("doctor_id")
      .notNull()
      .references(() => doctor.id),
    patientId: uuid("patient_id")
      .notNull()
      .references(() => patient.id),
    clinicId: uuid("clinic_id").references(() => clinic.id),

    // 🚨 IMPROVEMENT: Replaced 'date' with 'start' and 'end'
    start: timestamp("start", { withTimezone: true }).notNull(),
    end: timestamp("end", { withTimezone: true }).notNull(),

    status: appointmentStatusEnum("status").default("PENDING").notNull(),
    description: text("description"),
    // ... timestamps
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    // 🚨 IMPROVEMENT: Updated unique index to use 'start' instead of 'date'
    // This prevents a single doctor from being booked at the exact same START time.
    uniqueIndex("appointment_doctor_start_unique_idx").on(
      table.doctorId,
      table.start
    ),

    // Updated general index for doctor schedule lookups
    index("appointment_doctor_id_start_idx").on(table.doctorId, table.start),

    index("appointment_patient_id_status_idx").on(
      table.patientId,
      table.status
    ),

    // Optional: Indexing the end time might be useful for resource checks
    index("appointment_end_idx").on(table.end),
  ]
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

export type AppointmentType = InferSelectModel<typeof appointment>;
