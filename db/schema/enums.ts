// db/schema/enums.ts
import { pgEnum } from "drizzle-orm/pg-core";

// Translates Prisma 'enum Role'
export const roleEnum = pgEnum("role", [
  "ADMIN",
  "CLINIC",
  "DOCTOR",
  "PATIENT",
  "NURSE",
  "LAB_TECH",
]);

// Translates Prisma 'enum AppointmentStatus'
export const appointmentStatusEnum = pgEnum("appointment_status", [
  "PENDING",
  "CONFIRMED",
  "CANCELLED",
  "COMPLETED",
]);

// // Translates Prisma 'enum AuditSeverity'
// export const auditSeverityEnum = pgEnum('audit_severity', [
//   'INFO',
//   'WARN',
//   'ERROR',
//   'CRITICAL',
// ]);

// // Translates Prisma 'enum NotificationChannel'
// export const notificationChannelEnum = pgEnum('notification_channel', [
//   'IN_APP',
//   'EMAIL',
//   'PUSH',
//   'SMS',
// ]);
