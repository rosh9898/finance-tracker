import { getTransaction } from "@/lib/actions"
import { EditForm } from "@/components/edit-form"
import { notFound } from "next/navigation"

export default async function EditPage({ params }: { params: { type: string, id: string } }) {
    // Decode type (URL might be lowercase)
    const type = params.type.toUpperCase() as 'INCOME' | 'EXPENSE' | 'DEBT'
    const id = params.id

    try {
        const transaction = await getTransaction(id, type)

        if (!transaction) {
            return notFound()
        }

        return (
            <div className="max-w-md mx-auto pt-10">
                <EditForm transaction={transaction} type={type} id={id} />
            </div>
        )
    } catch (e) {
        return <div>Error loading transaction. Invalid ID or Type.</div>
    }
}
