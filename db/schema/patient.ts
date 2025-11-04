import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "./user";
import { InferSelectModel, relations } from "drizzle-orm";
import { appointment } from "./appointment";
import { medicalRecord } from "./medicalRecord";
// --- Patient Profile ---
export const patient = pgTable(
  "Patient",
  {
    id: uuid("id").defaultRandom().notNull().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .unique()
      .references(() => user.id, { onDelete: "cascade" }), // 🔑 Perfect: Cascade delete ensures patient profile is removed if the core user is deleted.
    dateOfBirth: timestamp("date_of_birth", { withTimezone: true }),
    gender: text("gender"),
    phone: text("phone"),
    address: text("address"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    // 🚨 Improvement: Add an index on the phone number if you ever search for patients by phone.
    phoneIdx: index("patient_phone_idx").on(table.phone),
    // You could also add a partial index on address if needed for geo-searching.
  })
);

export const patientsRelations = relations(patient, ({ one, many }) => ({
  // 🔑 Perfect: Defines the 1-to-1 link back to the core user identity.
  user: one(user, { fields: [patient.userId], references: [user.id] }),
  // 🔑 Perfect: Defines the 1-to-many link to appointments and medical records.
  appointments: many(appointment),
  records: many(medicalRecord),
}));

export type PatientType = InferSelectModel<typeof patient>;
