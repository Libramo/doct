import {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "./user";
import { relations } from "drizzle-orm";
// --- Message (Prisma Model) ---
export const message = pgTable(
  "Message",
  {
    id: uuid("id").defaultRandom().notNull().primaryKey(),
    senderId: uuid("sender_id")
      .notNull()
      .references(() => user.id),
    receiverId: uuid("receiver_id")
      .notNull()
      .references(() => user.id),
    content: text("content").notNull(),
    read: boolean("read").default(false).notNull(),
    // ... timestamps
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("message_sender_receiver_read_idx").on(
      table.senderId,
      table.receiverId,
      table.read
    ),
  ]
);

export const messagesRelations = relations(message, ({ one }) => ({
  sender: one(user, {
    fields: [message.senderId],
    references: [user.id],
    relationName: "messagesSent",
  }),
  receiver: one(user, {
    fields: [message.receiverId],
    references: [user.id],
    relationName: "messagesReceived",
  }),
}));
