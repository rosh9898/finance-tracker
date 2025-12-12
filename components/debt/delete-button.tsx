"use client"

import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { deleteTransaction } from "@/lib/actions"
import { useTransition } from "react"
import { toast } from "sonner"

export function DeleteDebtButton({ id }: { id: string }) {
    const [isPending, startTransition] = useTransition()

    function handleDelete() {
        if (!confirm("Are you sure you want to delete this debt record?")) return

        startTransition(async () => {
            await deleteTransaction(id, 'DEBT')
            toast.success("Debt record deleted")
        })
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:bg-destructive/10"
            onClick={handleDelete}
            disabled={isPending}
        >
            <Trash2 className="h-4 w-4" />
        </Button>
    )
}
