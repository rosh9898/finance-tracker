import { Suspense } from "react"
import { getDebts, deleteTransaction } from "@/lib/actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { CreditCard, Trash2, Edit2, Plus } from "lucide-react"
import Link from "next/link"
import { DeleteDebtButton } from "@/components/debt/delete-button" // We'll make this small component or inline it

export default async function DebtsPage() {
    const debts = await getDebts()

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Debt Management</h1>
                <Link href="/add?type=debt">
                    <Button size="icon" className="rounded-full h-10 w-10">
                        <Plus className="h-5 w-5" />
                    </Button>
                </Link>
            </div>

            {debts.length === 0 ? (
                <Card className="glass-card p-8 text-center text-muted-foreground border-dashed">
                    <p>You are debt free! 🎉</p>
                    <Link href="/add?type=debt" className="text-primary underline mt-2 block">
                        Add a loan record if needed
                    </Link>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {debts.map((debt: any) => (
                        <DebtCard key={debt.id} debt={debt} />
                    ))}
                </div>
            )}
        </div>
    )
}

function DebtCard({ debt }: { debt: any }) {
    const progress = ((debt.initialAmount - debt.currentBalance) / debt.initialAmount) * 100

    return (
        <Card className="glass-card overflow-hidden ring-1 ring-white/5">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-500/10 rounded-lg text-red-500">
                        <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                        <CardTitle className="text-base font-bold">{debt.lender}</CardTitle>
                        <p className="text-xs text-muted-foreground">{debt.type}</p>
                    </div>
                </div>
                <Link href={`/edit/debt/${debt.id}`}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                        <Edit2 className="h-4 w-4" />
                    </Button>
                </Link>
            </CardHeader>
            <CardContent>
                <div className="flex justify-between items-end mb-2">
                    <div>
                        <p className="text-xs text-muted-foreground mb-0.5">Remaining</p>
                        <p className="text-2xl font-bold text-red-500">{formatCurrency(debt.currentBalance)}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-muted-foreground mb-0.5">Total</p>
                        <p className="text-sm font-medium">{formatCurrency(debt.initialAmount)}</p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden mb-4">
                    <div
                        className="h-full bg-red-500 transition-all duration-500"
                        style={{ width: `${Math.max(5, Math.min(100, 100 - progress))}%` }}
                    />
                </div>

                <div className="flex gap-2">
                    <Link href={`/add?type=repayment&debtId=${debt.id}&lender=${debt.lender}`} className="flex-1">
                        <Button className="w-full" variant="outline">
                            Repay
                        </Button>
                    </Link>

                    <DeleteDebtButton id={debt.id} />
                </div>
            </CardContent>
        </Card>
    )
}
