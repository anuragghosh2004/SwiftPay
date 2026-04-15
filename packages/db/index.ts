import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";

// Explicitly export ONLY what you need
export * from "@prisma/client";
export * from "@prisma/adapter-pg";

dotenv.config({ path: "../../.env" });

// Setup the safe fallback string for your CI/CD workflow
const connectionString = process.env.DATABASE_URL || "postgresql://dummy:dummy@localhost:5432/postgres";

if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL is missing! Using a dummy connection string for the build.");
}

// Initialize the pool
const pool = new Pool({
  connectionString: connectionString
});

const adapter = new PrismaPg(pool as any);

// Export the ready-to-use instance
export const client = new PrismaClient({ adapter });