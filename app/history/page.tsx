import { getHistory, getDashboardData } from "@/lib/actions"
import { TransactionItem } from "@/components/transaction-item"
import { Inbox, ArrowUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"

export default async function HistoryPage() {
    const transactions = await getHistory()
    const { totals } = await getDashboardData()

    return (
        <div className="space-y-6 pt-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">History</h1>
                {/* Total Income moved here */}
                <div className="text-right">
                    <p className="text-xs text-muted-foreground">Total Earned</p>
                    <p className="text-lg font-bold text-[#00f2ff]">{formatCurrency(totals.income)}</p>
                </div>
            </div>

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
