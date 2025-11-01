import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { user } from "./user";
import { relations } from "drizzle-orm";
import { appointment } from "./appointment";
import { medicalRecord } from "./medicalRecord";
// --- Patient Profile ---
export const patient = pgTable("Patient", {
  id: text("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),
  dateOfBirth: timestamp("dateOfBirth", { withTimezone: true }),
  gender: text("gender"),
  phone: text("phone"),
  address: text("address"),
  createdAt: timestamp("createdAt", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const patientsRelations = relations(patient, ({ one, many }) => ({
  user: one(user, { fields: [patient.userId], references: [user.id] }),
  appointments: many(appointment),
  records: many(medicalRecord),
}));
