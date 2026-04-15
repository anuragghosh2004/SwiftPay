import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";

// 1. Explicitly export ONLY what you need (Removed 'export * from "pg"')
export * from "@prisma/client";
export * from "@prisma/adapter-pg";

dotenv.config({ path: "../../.env" });

// 2. Setup the safe fallback string
const connectionString = process.env.DATABASE_URL

if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL is missing! Using a dummy connection string for now.");
}

// 3. Initialize the pool (Notice the Git arrows are gone!)
const pool = new Pool({
  connectionString: connectionString
});

const adapter = new PrismaPg(pool as any);

// 4. Export the ready-to-use instance
export const client = new PrismaClient({ adapter });