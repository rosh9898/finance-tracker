"use client"

import { useState, useTransition } from "react"
import { updateTransaction } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface EditFormProps {
    id: string
    type: string
    initialData: any
}

export function EditForm({ id, type, initialData }: EditFormProps) {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    // Normalize type to ensure consistent checks (it comes as uppercase from page params usually)
    const normalizedType = type.toLowerCase()

    if (!initialData) return <div>Transaction not found</div>

    async function handleSubmit(formData: FormData) {
        startTransition(async () => {
            try {
                await updateTransaction(id, normalizedType, formData)
                toast.success("Transaction updated")
                router.push("/history")
            } catch (error) {
                toast.error("Failed to update")
            }
        })
    }

    return (
        <form action={handleSubmit} className="space-y-4 max-w-lg mx-auto p-4 border rounded-lg bg-card">
            <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                    id="amount"
                    name="amount"
                    type="number"
                    step="0.01"
                    defaultValue={normalizedType === 'debt' ? initialData.initialAmount : initialData.amount}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="category">
                    {normalizedType === 'debt' ? 'Type (Credit Card, Loan)' : 'Category'}
                </Label>
                <Input
                    id="category"
                    name="category"
                    defaultValue={normalizedType === 'debt' ? initialData.type : initialData.category}
                    required
                />
            </div>

            {normalizedType === 'debt' && (
                <div className="space-y-2">
                    <Label htmlFor="lender">Lender / Source</Label>
                    <Input
                        id="lender"
                        name="lender"
                        defaultValue={initialData.lender}
                        required
                    />
                </div>
            )}

            <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                    id="date"
                    name="date"
                    type="datetime-local"
                    defaultValue={(() => {
                        const val = normalizedType === 'debt' ? initialData.createdAt : initialData.timestamp;
                        const d = val ? new Date(val) : new Date();
                        return !isNaN(d.getTime()) ? d.toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16);
                    })()}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="note">Note</Label>
                <Input
                    id="note"
                    name="note"
                    defaultValue={initialData.note || ""}
                />
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Updating..." : "Update Transaction"}
            </Button>
        </form>
    )
}
