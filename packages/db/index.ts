export  * from "@prisma/adapter-pg";
export * from "@prisma/client";
export * from "pg"

 import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";   
dotenv.config({ path: "../../.env" });
const connectionString = process.env.DATABASE_URL || "postgresql://dummy:dummy@localhost:5432/postgres";

if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL is missing! Make sure your .env file is loaded. Using a dummy connection string for now.");
}

// Initialize everything INSIDE the package
const pool = new Pool({
    // Make sure your root .env file has this exact variable
    connectionString: connectionString
});

const adapter = new PrismaPg(pool as any);

// Export the ready-to-use instance
export const client = new PrismaClient({ adapter });