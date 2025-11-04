import {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "./user";
import { clinic } from "./clinic";
import { InferSelectModel, relations } from "drizzle-orm";
import { appointment } from "./appointment";
import { availability } from "./availability";
import { medicalRecord } from "./medicalRecord";

// --- Doctor Profile ---
export const doctor = pgTable(
  "Doctor",
  {
    id: uuid("id").defaultRandom().notNull().primaryKey(),
    // 1-to-1 link to the auth user table.
    userId: uuid("user_id")
      .notNull()
      .unique()
      .references(() => user.id, { onDelete: "cascade" }),
    clinicId: uuid("clinic_id").references(() => clinic.id, {
      onDelete: "set null",
    }),
    specialty: text("specialty"),
    bio: text("bio"),
    verified: boolean("verified").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("doctor_clinic_id_idx").on(table.clinicId)]
);

export const doctorsRelations = relations(doctor, ({ one, many }) => ({
  user: one(user, { fields: [doctor.userId], references: [user.id] }),
  clinic: one(clinic, {
    fields: [doctor.clinicId],
    references: [clinic.id],
  }),
  appointments: many(appointment),
  availabilities: many(availability),
  records: many(medicalRecord),
}));

export type DoctorType = InferSelectModel<typeof doctor>;
