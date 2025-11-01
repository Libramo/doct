import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./user";
import { clinic } from "./clinic";
import { relations } from "drizzle-orm";

// --- Nurse Profile ---
export const nurse = pgTable(
  "nurse",
  {
    id: text("id").notNull().primaryKey(),
    userId: text("userId")
      .notNull()
      .unique()
      .references(() => user.id, { onDelete: "cascade" }),
    clinicId: text("clinicId").references(() => clinic.id, {
      onDelete: "set null",
    }),
    title: text("title"),
    bio: text("bio"),
    createdAt: timestamp("createdAt", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updatedAt", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    clinicIdx: index("nurse_clinic_id_idx").on(table.clinicId),
  })
);

export const nursesRelations = relations(nurse, ({ one }) => ({
  user: one(user, { fields: [nurse.userId], references: [user.id] }),
  clinic: one(clinic, { fields: [nurse.clinicId], references: [clinic.id] }),
}));
