import { client } from "@repo/db/client";
import { AddMoney } from "../../components/AddMoneyCard";
import { BalanceCard } from "../../components/BalanceCard";
import { OnRampTransactions } from "../../components/OnRampTransaction";
import { getServerSession } from "next-auth";
import { auth_Options } from "../../lib/auth";

async function getBalance() {
    const session = await getServerSession(auth_Options);
    console.log("CURRENT SESSION ID:", session?.user ? (session.user as any).id : "NO USER LOGGED IN");
    // 1. SAFETY CHECK: Prevent Prisma crash if user is not logged in
    if (!session?.user) {
        return { amount: 0, locked: 0 };
    }

    const balance = await client.balance.findFirst({
        where: {
            // 2. TYPESCRIPT FIX: Use "as any" to force TypeScript to accept the 'id'
            userId: Number((session.user as any).id)
        }
    });
    console.log("PRISMA BALANCE RESULT:", balance);
    return {
        amount: balance?.amount || 0,
        locked: balance?.locked || 0
    }
}

async function getOnRampTransactions() {
    const session = await getServerSession(auth_Options);
    
    // 1. SAFETY CHECK
    if (!session?.user) {
        return [];
    }

    const txns = await client.onRampTransaction.findMany({
        where: {
            // 2. TYPESCRIPT FIX
            userId: Number((session.user as any).id)
        }
    });
    return txns.map(t => ({
        time: t.startTime.toDateString(),
        amount: t.amount,
        status: t.status,
        provider: t.provider
    }))
}

export default async function TransferPage() {
    const balance = await getBalance();
    const transactions = await getOnRampTransactions();

    return (
        <div className="w-screen">
            <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
                Transfer
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
                <div>
                    <AddMoney />
                </div>
                <div>
                    <BalanceCard amount={balance.amount} locked={balance.locked} />
                    <div className="pt-4">
                        <OnRampTransactions transactions={transactions} />
                    </div>
                </div>
            </div>
        </div>
    );
}
