"use server";

import { db } from "@/db";
import { user } from "@/db/schema/user";

export const getDoctors = async () => {
  try {
    const doctors = await db.select().from(user);
    return doctors;
  } catch (error) {
    console.log(error);
  }
  return [];
};
