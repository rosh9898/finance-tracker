"use client"

import { useState } from "react"
import { addIncome, addExpense, addDebt } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const CATEGORIES = {
    expense: ["Food & Groceries", "Transport & Fuel", "Housing & Utilities", "Health & Medical", "Shopping & Personal Care", "Entertainment & Leisure", "Education & Courses", "Work & Professional", "Family & Gifts", "Other / Miscellaneous"],
    income: ["Salary", "Business / Freelance", "Investments", "Gifts / Allowances", "Other Income"],
    debt: ["Credit Card", "Loan", "Borrowed Money", "Other Debt"]
}

export default function AddPage() {
    const [type, setType] = useState<"income" | "expense" | "debt">("expense")
    const [loading, setLoading] = useState(false)

    // Use simple form action for now, or client side handler. 
    // Client side allows better feedback.

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        try {
            if (type === 'income') await addIncome(formData)
            else if (type === 'expense') await addExpense(formData)
            else await addDebt(formData)
            toast.success("Saved successfully!")
            // reset form?
        } catch (e) {
            toast.error("Error saving: " + e)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-md mx-auto space-y-6 pt-4">
            <div className="flex space-x-2 bg-muted p-1 rounded-lg">
                {["expense", "income", "debt"].map((t) => (
                    <button
                        key={t}
                        onClick={() => setType(t as any)}
                        className={cn(
                            "flex-1 py-2 text-sm font-medium rounded-md transition-all capitalize",
                            type === t ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {t}
                    </button>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Add {type.charAt(0).toUpperCase() + type.slice(1)}</CardTitle>
                    <CardDescription>Enter the details below</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={handleSubmit} className="space-y-4">
                        {/* hidden type field if needed, but we handle in JS */}

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Amount (LKR)</label>
                            <Input name="amount" type="number" step="0.01" placeholder="0.00" required className="text-lg" />
                        </div>

                        {type !== 'debt' && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Category</label>
                                <select name="category" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                                    {CATEGORIES[type as 'expense' | 'income'].map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {type === 'debt' && (
                            <>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Type</label>
                                    <select name="type" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                                        {CATEGORIES.debt.map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Lender / Source</label>
                                    <Input name="lender" type="text" placeholder="e.g. Bank, Friend" required />
                                </div>
                            </>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Date</label>
                            <Input name="date" type="datetime-local" defaultValue={new Date().toISOString().slice(0, 16)} />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Note</label>
                            <Input name="note" type="text" placeholder="Optional description" />
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Saving..." : "Save Transaction"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
