import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./user";
import { clinic } from "./clinic";
import { relations } from "drizzle-orm";

// --- LabTech Profile ---
export const labTech = pgTable(
  "LabTech",
  {
    id: text("id").notNull().primaryKey(),
    userId: text("userId")
      .notNull()
      .unique()
      .references(() => user.id, { onDelete: "cascade" }),
    clinicId: text("clinicId").references(() => clinic.id, {
      onDelete: "set null",
    }),
    labName: text("labName"),
    qualifications: text("qualifications"),
    createdAt: timestamp("createdAt", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updatedAt", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    clinicIdx: index("lab_tech_clinic_id_idx").on(table.clinicId),
  })
);

export const labTechsRelations = relations(labTech, ({ one }) => ({
  user: one(user, { fields: [labTech.userId], references: [user.id] }),
  clinic: one(clinic, { fields: [labTech.clinicId], references: [clinic.id] }),
}));
