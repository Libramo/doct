import { boolean, index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./user";
import { organization } from "./organization";
import { relations } from "drizzle-orm";
import { doctor } from "./doctor";
import { nurse } from "./nurse";
import { labTech } from "./labTech";
import { appointment } from "./appointment";

// --- Clinic ---
export const clinic = pgTable(
  "clinic",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    address: text("address"),
    phone: text("phone"),
    verified: boolean("verified").default(false).notNull(),
    // A clinic can be managed by a user account
    userId: text("userId")
      .unique()
      .references(() => user.id, { onDelete: "set null" }),
    organizationId: text("organizationId").references(() => organization.id, {
      onDelete: "cascade",
    }),
    createdAt: timestamp("createdAt", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updatedAt", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    deletedAt: timestamp("deletedAt", { withTimezone: true }),
  },
  (table) => ({
    organizationIdx: index("clinic_organization_id_idx").on(
      table.organizationId
    ),
    userIdx: index("clinic_user_id_idx").on(table.userId),
  })
);

export const clinicsRelations = relations(clinic, ({ one, many }) => ({
  user: one(user, { fields: [clinic.userId], references: [user.id] }),
  organization: one(organization, {
    fields: [clinic.organizationId],
    references: [organization.id],
  }),
  doctor: many(doctor),
  nurses: many(nurse),
  labTechs: many(labTech),
  appointments: many(appointment),
}));
