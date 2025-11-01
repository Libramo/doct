import { relations } from "drizzle-orm";
import { boolean, index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./user";
import { clinic } from "./clinic";

// --- Organization ---
export const organization = pgTable("organization", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  // Correctly uses text() to reference your user.id
  ownerUserId: text("ownerUserId").references(() => user.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("createdAt", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  deletedAt: timestamp("deletedAt", { withTimezone: true }),
});

export const organizationsRelations = relations(
  organization,
  ({ one, many }) => ({
    owner: one(user, {
      fields: [organization.ownerUserId],
      references: [user.id],
    }),
    clinics: many(clinic),
  })
);
