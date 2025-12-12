import { getGoals } from "@/lib/actions"
import { GoalsDashboard } from "@/components/goals/goals-dashboard"

export default async function GoalsPage() {
    const rawGoals = await getGoals()
    const goals = rawGoals.map((g: any) => ({
        ...g,
        deadline: g.deadline ? g.deadline.toISOString() : null,
        createdAt: g.createdAt.toISOString(),
        updatedAt: g.updatedAt.toISOString(),
    }))

    return <GoalsDashboard initialGoals={goals} />
}
