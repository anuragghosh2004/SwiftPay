import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";   
import bcrypt from "bcrypt";

dotenv.config({ path: "../../.env" });
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing! Make sure your .env file is loaded.");
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

const adapter = new PrismaPg(pool as any);
export const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedAlicePassword = await bcrypt.hash('alice', 10);
  const hashedBobPassword = await bcrypt.hash('bob', 10);

  const alice = await prisma.user.upsert({
    where: { number: '9999999999' },
    update: {},
    create: {
      number: '9999999999',
      password: hashedAlicePassword,
      name: 'alice',
      // ✅ Added Alice's Balance!
      balance: {
        create: {
            amount: 20000,
            locked: 0
        }
      },
      onRampTransactions: {
        create: {
          startTime: new Date(),
          status: "Success",
          amount: 20000,
          token: "122",
          provider: "HDFC Bank",
        },
      },
    },
  })
  
  const bob = await prisma.user.upsert({
    where: { number: '9999999998' },
    update: {},
    create: {
      number: '9999999998',
      password: hashedBobPassword,
      name: 'bob',
      // ✅ Added Bob's Balance!
      balance: {
        create: {
            amount: 2000,
            locked: 0
        }
      },
      onRampTransactions: {
        create: {
          startTime: new Date(),
          status: "Failure",
          amount: 2000,
          token: "123",
          provider: "HDFC Bank",
        },
      },
    },
  })
  console.log({ alice, bob })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })