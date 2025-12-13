import { getHistory } from "@/lib/actions"
import { TransactionItem } from "@/components/transaction-item"
import { Inbox } from "lucide-react"

export default async function HistoryPage() {
    const transactions = await getHistory()

    return (
        <div className="space-y-6 pt-6">
            <h1 className="text-3xl font-bold tracking-tight">Transaction History</h1>

            <div className="space-y-4">
                {transactions.map((t) => (
                    <TransactionItem key={t.id + t.type} transaction={t} />
                ))}
                {transactions.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground opacity-50">
                        <Inbox className="w-16 h-16 mb-4" />
                        <p>No transactions found yet.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
