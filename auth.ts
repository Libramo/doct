import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { customSession, username } from "better-auth/plugins";
import { db, AllTables } from "./db";
import { eq } from "drizzle-orm";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    // debugLogs: true,
    // schema: AllTables,
  }),
  advanced: {
    database: {
      generateId: false,
    },
  },

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
      // 1. Fetch the full user data from the database
      const dbUser = await db.query.user.findFirst({
        where: eq(AllTables.user.id, user.id), // 🚨 FIX: Match the database user ID with the session user ID
        columns: {
          role: true, // Only select the role column for efficiency
        },
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
