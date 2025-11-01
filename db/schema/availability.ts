import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { doctor } from "./doctor";
import { relations } from "drizzle-orm";
// --- Availability (Prisma Model) ---
export const availability = pgTable(
  "Availability",
  {
    id: text("id").primaryKey(),
    doctorId: text("doctorId")
      .notNull()
      .references(() => doctor.id),
    dayOfWeek: integer("dayOfWeek").notNull(), // 0-6
    startTime: timestamp("startTime", { withTimezone: true }).notNull(),
    endTime: timestamp("endTime", { withTimezone: true }).notNull(),
    // ... timestamps
  },
  (table) => ({
    doctorDayIdx: index("availability_doctor_id_day_of_week_idx").on(
      table.doctorId,
      table.dayOfWeek
    ),
  })
);

export const availabilitiesRelations = relations(availability, ({ one }) => ({
  doctor: one(doctor, {
    fields: [availability.doctorId],
    references: [doctor.id],
  }),
}));
