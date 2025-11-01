import { boolean, index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./user";
import { relations } from "drizzle-orm";
// --- Message (Prisma Model) ---
export const message = pgTable(
  "Message",
  {
    id: text("id").notNull().primaryKey(),
    senderId: text("senderId")
      .notNull()
      .references(() => user.id),
    receiverId: text("receiverId")
      .notNull()
      .references(() => user.id),
    content: text("content").notNull(),
    read: boolean("read").default(false).notNull(),
    // ... timestamps
  },
  (table) => ({
    senderReceiverReadIdx: index("message_sender_receiver_read_idx").on(
      table.senderId,
      table.receiverId,
      table.read
    ),
  })
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
