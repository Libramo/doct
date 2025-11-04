// db/schema/enums.ts
import { InferSelectModel } from "drizzle-orm";
import { pgEnum } from "drizzle-orm/pg-core";

// Translates Prisma 'enum Role'
export const roleEnumValues = [
  "ADMIN",
  "CLINIC",
  "DOCTOR",
  "PATIENT",
  "NURSE",
  "LAB_TECH",
] as const;

export const appointmentStatusEnumValues = [
  "PENDING",
  "CONFIRMED",
  "CANCELLED",
  "COMPLETED",
] as const;

// Translates Prisma 'enum AppointmentStatus'
export const appointmentStatusEnum = pgEnum(
  "appointment_status",
  appointmentStatusEnumValues
);

export const roleEnum = pgEnum("Role", roleEnumValues);

export type Role = (typeof roleEnumValues)[number];
export type AppointmentStatus = (typeof appointmentStatusEnumValues)[number];
