import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as AllTables from "./schema/index";
// import { config } from "dotenv";

// config({ path: ".env" });

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql, schema: AllTables });

export { AllTables };
