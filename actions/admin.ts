"use server";

import prisma from "@/lib/prisma";

export const getDoctors = async () => {
  try {
    const doctors = await prisma.doctor.findMany({
      include: {
        clinic: true,
        user: true,
      },
    });
    return doctors;
  } catch (error) {
    console.log(error);
  }
  return [];
};
