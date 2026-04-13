import { Card } from "@repo/ui/card"

export const OnRampTransactions = ({
    transactions
}: {
    transactions: {
        time: string,
        amount: number,
        
        status: "Success" | "Failure" | "Processing",
        provider: string
    }[]
}) => {
    if (!transactions.length) {
        return <Card title="Recent Transactions">
            <div className="text-center pb-8 pt-8">
                No Recent transactions
            </div>
        </Card>
    }
    return <Card title="Recent Transactions">
        <div className="pt-2">
            {/* ✅ Added the missing 'key' prop using the array index (i) */}
            {transactions.map((t, i) => <div key={i} className="flex justify-between border-b border-slate-200 py-2">
                <div>
                    <div className="text-sm">
                        Received INR
                    </div>
                    <div className="text-slate-600 text-xs">
                        {t.time}
                    </div>
                </div>
                <div className="flex flex-col justify-center">
                    + Rs {t.amount / 100}
                </div>
            </div>)}
        </div>
    </Card>
}