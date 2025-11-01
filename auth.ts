import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { customSession, username } from "better-auth/plugins";
import { db, AllTables } from "./db";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    // debugLogs: true,
    // schema: AllTables,
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
    // customSession(async ({ user, session }) => {
    //   const dbUser = await db.user.findUnique({
    //     where: { id: user.id },
    //     select: { role: true },
    //   });
    //   return {
    //     user: {
    //       ...user,
    //       role: dbUser?.role ?? "PATIENT",
    //     },
    //     session: {
    //       ...session,
    //       role: dbUser?.role ?? "PATIENT",
    //     },
    //   };
    // }),
    username(),
  ],
});
