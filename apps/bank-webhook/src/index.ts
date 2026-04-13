import express from "express";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

import * as dotenv from "dotenv";
import * as path from "path";

// Load the root monorepo .env (two levels up from apps/bank-webhook)
// __dirname in compiled output = apps/bank-webhook/dist → go 3 levels up to monorepo root
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is missing! Make sure the root .env file is loaded.");
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool as any);
const client = new PrismaClient({ adapter } as any);

const app = express();
app.use(express.json());

app.post("/webhook", async (req, res) => {
    console.log("What Express parsed:", req.body);


    if (!req.body || !req.body.token) {
        return res.status(400).json({
            message: "Invalid request: Missing body or token"
        });
    }

    const paymentInformation = {
        token: req.body.token,
        userId: req.body.user_identifier,
        amount: req.body.amount
    };

    try {
        const existingTransaction = await client.onRampTransaction.findUnique({
            where: {
                token: paymentInformation.token
            }
        });

        // 2. Handle cases where the transaction doesn't exist
        if (!existingTransaction) {
            return res.status(404).json({
                message: "Transaction not found"
            });
        }

        // 3. Now you can check the status on the fetched record
        if (existingTransaction.status === "Success") {
            return res.status(400).json({
                message: "Transaction already processed"
            });
        }
        await client.$transaction([
            client.balance.updateMany({
                where: {
                    userId: paymentInformation.userId
                },
                data: {
                    amount: {
                        increment: paymentInformation.amount
                    }
                }
            }),
            client.onRampTransaction.updateMany({
                where: {
                    token: paymentInformation.token
                },
                data: {
                    status: "Success",
                }
            })
        ]);

        console.log("✅ Transaction successful for userId:", paymentInformation.userId);
        res.json({
            message: "Captured"
        });
    } catch (e) {
        console.error("❌ Transaction failed:", e);
        res.status(411).json({
            message: "Error while processing webhook"
        });
    }
});

app.listen(3003, () => {
    console.log("🚀 Bank webhook server running on port 3003");
});