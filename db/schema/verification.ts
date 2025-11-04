import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const verification = pgTable("Verification", {
  id: uuid("id").defaultRandom().notNull().primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});
