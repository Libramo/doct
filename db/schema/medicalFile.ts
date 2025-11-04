import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { medicalRecord } from "./medicalRecord";
import { relations } from "drizzle-orm";

// --- MedicalFile ---
export const medicalFile = pgTable(
  "MedicalFile",
  {
    id: uuid("id").defaultRandom().notNull().primaryKey(),

    // Link back to the MedicalRecord that this file is part of
    recordId: uuid("record_id")
      .notNull()
      .references(() => medicalRecord.id, { onDelete: "cascade" }), // If the record is deleted, delete the file reference

    // The unique identifier/path in the external storage (e.g., S3 Key)
    storageKey: text("storage_key").notNull(),

    // The friendly name the user sees (e.g., "Lab_Results_05_2024.pdf")
    fileName: text("file_name").notNull(),

    // What type of document is this (PDF, JPEG, etc.)
    mimeType: text("mime_type"),

    // Optional: A description of the file's content
    description: text("description"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [index("medical_file_record_id_idx").on(table.recordId)]
);

export const medicalFilesRelations = relations(medicalFile, ({ one }) => ({
  medicalRecord: one(medicalRecord, {
    fields: [medicalFile.recordId],
    references: [medicalRecord.id],
  }),
}));
