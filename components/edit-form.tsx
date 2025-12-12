"use client"

import { useState } from "react"
import { updateTransaction } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useRouter } from "next/navigation"

const CATEGORIES = {
    expense: ["Food & Groceries", "Transport & Fuel", "Housing & Utilities", "Health & Medical", "Shopping & Personal Care", "Entertainment & Leisure", "Education & Courses", "Work & Professional", "Family & Gifts", "Other / Miscellaneous"],
    income: ["Salary", "Business / Freelance", "Investments", "Gifts / Allowances", "Other Income"],
    debt: ["Credit Card", "Loan", "Borrowed Money", "Other Debt"]
}

interface EditFormProps {
    transaction: any
    type: "INCOME" | "EXPENSE" | "DEBT"
    id: string
}

export function EditForm({ transaction, type, id }: EditFormProps) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        try {
            await updateTransaction(id, type, formData)
            toast.success("Updated successfully!")
            router.push("/history")
            router.refresh()
        } catch (e) {
            toast.error("Error updating: " + e)
        } finally {
            setLoading(false)
        }
    }

    // Format date for datetime-local input (YYYY-MM-DDTHH:mm)
    const defaultDate = transaction.timestamp ? new Date(transaction.timestamp).toISOString().slice(0, 16) : ""

    return (
        <Card>
            <CardHeader>
                <CardTitle>Edit {type.charAt(0) + type.slice(1).toLowerCase()}</CardTitle>
                <CardDescription>Update transaction details</CardDescription>
            </CardHeader>
            <CardContent>
                <form action={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Amount (LKR)</label>
                        <Input
                            name="amount"
                            type="number"
                            step="0.01"
                            defaultValue={transaction.amount || transaction.initialAmount}
                            required
                            className="text-lg"
                        />
                    </div>

                    {type !== 'DEBT' && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Category</label>
                            <select
                                name="category"
                                defaultValue={transaction.category}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            >
                                {CATEGORIES[type.toLowerCase() as 'expense' | 'income'].map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {type === 'DEBT' && (
                        <>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Type</label>
                                <select
                                    name="type"
                                    defaultValue={transaction.type}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                >
                                    {CATEGORIES.debt.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Lender / Source</label>
                                <Input
                                    name="lender"
                                    type="text"
                                    defaultValue={transaction.lender}
                                    required
                                />
                            </div>
                        </>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Date</label>
                        <Input
                            name="date"
                            type="datetime-local"
                            defaultValue={defaultDate}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Note</label>
                        <Input
                            name="note"
                            type="text"
                            defaultValue={transaction.note || ""}
                            placeholder="Optional description"
                        />
                    </div>

                    <div className="flex gap-2">
                        <Button type="button" variant="outline" className="flex-1" onClick={() => router.back()}>Cancel</Button>
                        <Button type="submit" className="flex-1" disabled={loading}>
                            {loading ? "Updating..." : "Update Transaction"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
