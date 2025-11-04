import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "./user";
import { clinic } from "./clinic";
import { relations } from "drizzle-orm";

// --- LabTech Profile ---
export const labTech = pgTable(
  "LabTech",
  {
    id: uuid("id").defaultRandom().notNull().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .unique()
      .references(() => user.id, { onDelete: "cascade" }),
    clinicId: uuid("clinic_id").references(() => clinic.id, {
      onDelete: "set null",
    }),
    labName: text("labName"),
    qualifications: text("qualifications"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("lab_tech_clinic_id_idx").on(table.clinicId)]
);

export const labTechsRelations = relations(labTech, ({ one }) => ({
  user: one(user, { fields: [labTech.userId], references: [user.id] }),
  clinic: one(clinic, { fields: [labTech.clinicId], references: [clinic.id] }),
}));
