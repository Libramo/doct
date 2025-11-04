"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import {
  appointment,
  AppointmentType,
  doctor,
  DoctorType,
  patient,
  PatientType,
} from "@/db/schema";
import { user } from "@/db/schema/user";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

// export const getDoctorAppointments = async () => {
//   try {
//     const doctors = await db.select().from(user);
//     return doctors;
//   } catch (error) {
//     console.log(error);
//   }
//   return [];
// };

/**
 * Fetches all necessary dashboard data for an authenticated user.
 */
export async function getDashboardData(userId: string) {
  // 1. Fetch Core User Info (Name, Email, etc.)
  const coreUser = await db.query.user.findFirst({
    where: eq(user.id, userId),
    // columns: {
    //   name: true,
    //   email: true,
    //   role: true,
    //   emailVerified: true,
    //   image: true,
    //   username: true,

    //   // ... any other common fields
    // },
  });

  if (!coreUser) {
    throw new Error("Core user data not found.");
  }

  // Use the role retrieved from the database
  const userRole = coreUser.role; // This is your RoleEnum value

  let profileData: DoctorType | PatientType | undefined = undefined;
  let appointments: AppointmentType[] = [];

  switch (userRole) {
    case "ADMIN":
      break;
    case "DOCTOR":
      // Fetch Doctor's profile
      profileData = await db.query.doctor.findFirst({
        where: eq(doctor.userId, userId),
      });
      // Fetch appointments
      appointments = await db.query.appointment.findMany({
        where: eq(appointment.doctorId, userId),
        orderBy: [appointment.start],
      });
      break;
    case "PATIENT":
      // Fetch Doctor's profile
      profileData = await db.query.patient.findFirst({
        where: eq(patient.userId, userId),
      });
      // Fetch appointments
      appointments = await db.query.appointment.findMany({
        where: eq(appointment.doctorId, userId),
        orderBy: [appointment.start],
      });
      break;
    case "LAB_TECH":
      break;
    case "NURSE":
      break;
    default:
      break;
  }

  // 3. Bundle the results
  return {
    user: coreUser,
    profile: profileData,
    appointments: appointments,
    // ... other data (e.g., unreadCount)
  };
}
