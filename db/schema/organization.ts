import { relations } from "drizzle-orm";
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

// --- Organization ---
export const organization = pgTable("Organization", {
  id: uuid("id").defaultRandom().notNull().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  // Correctly uses text() to reference your user.id
  ownerUserId: uuid("owner_user_at").references(() => user.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
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
