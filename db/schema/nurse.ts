import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "./user";
import { clinic } from "./clinic";
import { relations } from "drizzle-orm";

// --- Nurse Profile ---
export const nurse = pgTable(
  "Nurse",
  {
    id: uuid("id").defaultRandom().notNull().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .unique()
      .references(() => user.id, { onDelete: "cascade" }),
    clinicId: uuid("clinic_id").references(() => clinic.id, {
      onDelete: "set null",
    }),
    title: text("title"),
    bio: text("bio"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("nurse_clinic_id_idx").on(table.clinicId)]
);

export const nursesRelations = relations(nurse, ({ one }) => ({
  user: one(user, { fields: [nurse.userId], references: [user.id] }),
  clinic: one(clinic, { fields: [nurse.clinicId], references: [clinic.id] }),
}));
