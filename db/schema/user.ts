// "use server";
import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { roleEnum } from "./enums";
import { InferSelectModel, relations } from "drizzle-orm";
import { doctor } from "./doctor";
import { nurse } from "./nurse";
import { organization } from "./organization";
import { labTech } from "./labTech";
import { patient } from "./patient";
import { clinic } from "./clinic";
import { message } from "./message";

export const user = pgTable("User", {
  id: uuid("id").defaultRandom().notNull().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  role: roleEnum("role").default("PATIENT").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  username: text("username").unique(),
  displayUsername: text("display_username"),
});

// --- USER RELATIONS ---
//
// We define the relations *from* your auth 'user' table
// *to* our new application tables.
//
export const userRelations = relations(user, ({ one, many }) => ({
  // 1-to-1 profile relations
  doctor: one(doctor, { fields: [user.id], references: [doctor.userId] }),
  nurse: one(nurse, { fields: [user.id], references: [nurse.userId] }),
  labTech: one(labTech, { fields: [user.id], references: [labTech.userId] }),
  patient: one(patient, { fields: [user.id], references: [patient.userId] }),
  clinic: one(clinic, { fields: [user.id], references: [clinic.userId] }), // For clinic admins

  // 1-to-many relations
  organizationsOwned: many(organization),
  messagesSent: many(message, { relationName: "messagesSent" }),
  messagesReceived: many(message, { relationName: "messagesReceived" }),
}));

export type UserType = InferSelectModel<typeof user>;
