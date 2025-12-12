"use client"

import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { Trash2, Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { deleteTransaction } from "@/lib/actions"
import { toast } from "sonner"
import { useTransition } from "react"
import Link from "next/link"

interface TransactionItemProps {
    transaction: {
        id: string
        type: string
        amount: number
        category: string
        note: string | null
        timestamp: Date
        lender?: string | null
    }
}

export function TransactionItem({ transaction: t }: TransactionItemProps) {
    const [isPending, startTransition] = useTransition()

    function handleDelete() {
        startTransition(async () => {
            try {
                await deleteTransaction(t.id, t.type as 'INCOME' | 'EXPENSE' | 'DEBT')
                toast.success("Transaction deleted")
            } catch (error) {
                toast.error("Failed to delete")
                console.error(error)
            }
        })
    }

    return (
        <Card className={`glass-card border-l-4 ${t.type === 'INCOME' ? 'border-l-green-500/50' : t.type === 'EXPENSE' ? 'border-l-red-500/50' : 'border-l-orange-500/50'} group ring-1 ring-white/5`}>
            <CardContent className="flex items-center justify-between p-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${t.type === 'INCOME' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'}`}>
                            {t.type}
                        </span>
                        <span className="font-medium text-lg">{t.category}</span>
                        {t.lender && <span className="text-xs text-muted-foreground">({t.lender})</span>}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                        {new Date(t.timestamp).toLocaleDateString()} &bull; {t.note || "No note"}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <div className={`text-lg font-bold ${t.type === 'INCOME' ? 'text-green-600' : 'text-red-600'} mr-2`}>
                        {t.type === 'INCOME' ? '+' : '-'} {formatCurrency(t.amount)}
                    </div>

                    <Link href={`/edit/${t.type.toLowerCase()}/${t.id}`}>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
                        >
                            <Edit2 className="w-4 h-4" />
                            <span className="sr-only">Edit</span>
                        </Button>
                    </Link>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleDelete}
                        disabled={isPending}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                        <Trash2 className="w-4 h-4" />
                        <span className="sr-only">Delete</span>
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
