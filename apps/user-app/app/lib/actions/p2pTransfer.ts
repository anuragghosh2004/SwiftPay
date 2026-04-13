"use server"
import { getServerSession } from "next-auth";
import { auth_Options } from "../auth";
import { client } from "@repo/db/client";

export async function p2pTransfer(to: string, amount: number) {
    const session = await getServerSession(auth_Options);
    const from = (session?.user as any)?.id;
    if (!from) {
        return {
            message: "Error while sending"
        }
    }

    const toUser = await client.user.findFirst({
        where: {
            number: to
        }
    });

    if (!toUser) {
        return {
            message: "User not found"
        }
    }

    await client.$transaction(async (tx) => {
        await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${Number(from)} FOR UPDATE`;// way to lock the database row

        const fromBalance = await tx.balance.findUnique({
            where: { userId: Number(from) },
        });
        //console.log("before");
        //await new Promise(resolve => setTimeout(resolve, 5000));
        //console.log("after");

        if (!fromBalance || fromBalance.amount < amount) {
            throw new Error('Insufficient funds');
        }

        await tx.balance.update({
            where: { userId: Number(from) },
            data: { amount: { decrement: amount } },
        });

        await tx.balance.update({
            where: { userId: toUser.id },
            data: { amount: { increment: amount } },
        });
        await tx.p2PTransfer.create({
            data: {
                amount,
                fromUserId: Number(from),
                toUserId: toUser.id,
                timestamp: new Date()
            }
        })

    }, {
        maxWait: 5000,
        timeout: 10000
    })
}