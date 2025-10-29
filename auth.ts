import { betterAuth } from "better-auth";
import prisma from "./lib/prisma";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { customSession, username } from "better-auth/plugins";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  session: {
    cookieCache: {
      enabled: true,
    },
  },
  plugins: [
    customSession(async ({ user, session }) => {
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { role: true },
      });
      return {
        user: {
          ...user,
          role: dbUser?.role ?? "PATIENT",
        },
        session: {
          ...session,
          role: dbUser?.role ?? "PATIENT",
        },
      };
    }),
    username(),
  ],
});
