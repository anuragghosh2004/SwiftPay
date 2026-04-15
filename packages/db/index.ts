export * from "@prisma/adapter-pg";
export * from "@prisma/client";
export * from "pg"



import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
dotenv.config({ path: "../../.env" });
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing! Make sure your .env file is loaded.");
}
// Initialize everything INSIDE the package
const pool = new Pool({
  // Make sure your root .env file has this exact variable
  connectionString: process.env.DATABASE_URL
});

const adapter = new PrismaPg(pool as any);

// Export the ready-to-use instance
export const client = new PrismaClient({ adapter });