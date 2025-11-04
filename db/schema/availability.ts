import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { doctor } from "./doctor";
import { relations } from "drizzle-orm";
// --- Availability (Prisma Model) ---
export const availability = pgTable(
  "Availability",
  {
    id: uuid("id").defaultRandom().notNull().primaryKey(),
    doctorId: uuid("doctor_id")
      .notNull()
      .references(() => doctor.id),
    dayOfWeek: integer("day_of_Week").notNull(), // 0-6
    startTime: timestamp("start_time", { withTimezone: true }).notNull(),
    endTime: timestamp("end_time", { withTimezone: true }).notNull(),
    // ... timestamps
  },
  (table) => [
    index("availability_doctor_id_day_of_week_idx").on(
      table.doctorId,
      table.dayOfWeek
    ),
  ]
);

export const availabilitiesRelations = relations(availability, ({ one }) => ({
  doctor: one(doctor, {
    fields: [availability.doctorId],
    references: [doctor.id],
  }),
}));
