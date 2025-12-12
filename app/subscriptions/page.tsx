import { getSubscriptions } from "@/lib/actions"
import { SubscriptionDashboard } from "@/components/subscriptions/subscription-dashboard"

export default async function SubscriptionsPage() {
    const rawSubs = await getSubscriptions()
    const subscriptions = rawSubs.map((sub: any) => ({
        ...sub,
        nextDueDate: sub.nextDueDate.toISOString(), // Serialize Date
        createdAt: sub.createdAt.toISOString(),
        updatedAt: sub.updatedAt.toISOString(),
    }))

    return <SubscriptionDashboard initialSubscriptions={subscriptions} />
}
