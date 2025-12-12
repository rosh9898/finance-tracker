"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { parseTransaction, getFinancialInsights, scanForSubscriptions } from "./gemini"

export async function addIncome(formData: FormData) {
    const amount = parseFloat(formData.get("amount") as string)
    const category = formData.get("category") as string
    const note = formData.get("note") as string
    const date = new Date(formData.get("date") as string || Date.now())

    await prisma.income.create({
        data: {
            amount,
            category,
            note,
            timestamp: date,
        },
    })
    revalidatePath("/")
    revalidatePath("/history")
}

export async function addExpense(formData: FormData) {
    const amount = parseFloat(formData.get("amount") as string)
    const category = formData.get("category") as string
    const note = formData.get("note") as string
    const date = new Date(formData.get("date") as string || Date.now())

    await prisma.expense.create({
        data: {
            amount,
            category,
            note,
            timestamp: date,
        },
    })
    revalidatePath("/")
    revalidatePath("/history")
}

export async function addDebt(formData: FormData) {
    const type = formData.get("type") as string
    const lender = formData.get("lender") as string
    const amount = parseFloat(formData.get("amount") as string)
    const note = formData.get("note") as string

    await prisma.debt.create({
        data: {
            type,
            lender,
            initialAmount: amount,
            currentBalance: amount,
            note,
        },
    })
    revalidatePath("/")
    await prisma.debt.create({
        data: {
            type,
            lender,
            initialAmount: amount,
            currentBalance: amount,
            note,
        },
    })
    revalidatePath("/")
}

export async function addRepayment(formData: FormData) {
    const amount = parseFloat(formData.get("amount") as string)
    const category = formData.get("category") as string
    const note = formData.get("note") as string
    const date = new Date(formData.get("date") as string || Date.now())

    // 1. Record as an Expense so it shows in history/charts and reduces wallet balance
    await prisma.expense.create({
        data: {
            amount,
            category: "Repayment: " + category,
            note,
            timestamp: date,
        },
    })

    // 2. Try to find a matching debt to reduce its balance
    // This is a "smart" guess. In a full app, we'd ask the user to select the debt.
    const matchingDebt = await prisma.debt.findFirst({
        where: {
            OR: [
                { type: { contains: category } },
                { lender: { contains: category } }
            ]
        }
    })

    if (matchingDebt) {
        await prisma.debt.update({
            where: { id: matchingDebt.id },
            data: {
                currentBalance: { decrement: amount }
            }
        })

        // Optionally record the formal Repayment relation
        await prisma.repayment.create({
            data: {
                amount,
                debtId: matchingDebt.id,
                timestamp: date,
                note
            }
        })
    }

    revalidatePath("/")
    revalidatePath("/history")
}


import { startOfWeek, endOfWeek, subWeeks, format, startOfDay, endOfDay } from "date-fns"

export async function getDashboardData() {
    const today = new Date();

    // 1. Parallelize initial unrelated queries
    const [recentIncome, recentExpense, totalIncome, totalExpense, totalDebt] = await Promise.all([
        prisma.income.findMany({ orderBy: { timestamp: 'desc' }, take: 5 }),
        prisma.expense.findMany({ orderBy: { timestamp: 'desc' }, take: 5 }),
        prisma.income.aggregate({ _sum: { amount: true } }),
        prisma.expense.aggregate({ _sum: { amount: true } }),
        prisma.debt.aggregate({ _sum: { currentBalance: true } })
    ]);

    // 2. Parallelize Chart Data aggregation
    const chartWeeks = [];
    for (let i = 3; i >= 0; i--) {
        const weekStart = startOfWeek(subWeeks(today, i), { weekStartsOn: 1 });
        const weekEnd = endOfWeek(subWeeks(today, i), { weekStartsOn: 1 });
        chartWeeks.push({ weekStart, weekEnd, label: `Week ${4 - i} (${format(weekStart, 'd/M')})` });
    }

    // Run all 8 aggregate queries (4 weeks * 2 types) in parallel
    const chartResults = await Promise.all(
        chartWeeks.flatMap(week => [
            prisma.income.aggregate({
                _sum: { amount: true },
                where: { timestamp: { gte: startOfDay(week.weekStart), lte: endOfDay(week.weekEnd) } }
            }),
            prisma.expense.aggregate({
                _sum: { amount: true },
                where: { timestamp: { gte: startOfDay(week.weekStart), lte: endOfDay(week.weekEnd) } }
            })
        ])
    );

    // Reconstruct chart data from flat results
    const chartData = {
        labels: chartWeeks.map(w => w.label),
        income: [] as number[],
        expense: [] as number[]
    };

    for (let i = 0; i < chartWeeks.length; i++) {
        // Pairs of [Income, Expense]
        chartData.income.push(chartResults[i * 2]._sum.amount || 0);
        chartData.expense.push(chartResults[i * 2 + 1]._sum.amount || 0);
    }

    // Combine recent transactions
    const recent = [
        ...recentIncome.map(i => ({ ...i, type: 'income' })),
        ...recentExpense.map(e => ({ ...e, type: 'expense' }))
    ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 5)

    return {
        recent,
        totals: {
            income: totalIncome._sum.amount || 0,
            expense: totalExpense._sum.amount || 0,
            debt: totalDebt._sum.currentBalance || 0,
            balance: (totalIncome._sum.amount || 0) - (totalExpense._sum.amount || 0)
        },
        chart: chartData
    }
}

export async function processSmartAdd(input: string) {
    return await parseTransaction(input);
}

export async function generateInsights() {
    const data = await getDashboardData();
    const summary = `Total Balance: ${data.totals.balance}. Income: ${data.totals.income}, Expense: ${data.totals.expense}. Weekly Spending Trend: ${data.chart.expense.join(', ')}. Debt: ${data.totals.debt}.`;
    return await getFinancialInsights(summary);
}

export async function getHistory() {
    const incomes = await prisma.income.findMany({ orderBy: { timestamp: 'desc' }, take: 50 })
    const expenses = await prisma.expense.findMany({ orderBy: { timestamp: 'desc' }, take: 50 })

    const all = [
        ...incomes.map(i => ({ ...i, type: 'INCOME' })),
        ...expenses.map(e => ({ ...e, type: 'EXPENSE' }))
    ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())


    return all
}

export async function deleteTransaction(id: string, type: 'INCOME' | 'EXPENSE' | 'DEBT') {
    if (type === 'INCOME') await prisma.income.delete({ where: { id } })
    else if (type === 'EXPENSE') await prisma.expense.delete({ where: { id } })
    else await prisma.debt.delete({ where: { id } })
    revalidatePath("/")
    revalidatePath("/history")
}

export async function getTransaction(id: string, type: string) {
    if (type === 'INCOME') return await prisma.income.findUnique({ where: { id } })
    if (type === 'EXPENSE') return await prisma.expense.findUnique({ where: { id } })
    if (type === 'DEBT') return await prisma.debt.findUnique({ where: { id } })
    return null
}

export async function updateTransaction(id: string, type: string, formData: FormData) {
    const amount = parseFloat(formData.get("amount") as string)
    const category = formData.get("category") as string
    const note = formData.get("note") as string

    const dateStr = formData.get("date") as string
    const date = dateStr ? new Date(dateStr) : undefined

    if (type === 'INCOME') {
        await prisma.income.update({
            where: { id },
            data: { amount, category, note, ...(date && { timestamp: date }) }
        })
    } else if (type === 'EXPENSE') {
        await prisma.expense.update({
            where: { id },
            data: { amount, category, note, ...(date && { timestamp: date }) }
        })
    } else if (type === 'DEBT') {
        const lender = formData.get("lender") as string
        const debtType = formData.get("type") as string

        await prisma.debt.update({
            where: { id },
            data: {
                initialAmount: amount,
                type: debtType,
                lender,
                note
            }
        })
    }
    revalidatePath("/")
    revalidatePath("/history")
}

// --- Subscription Actions ---

export async function getSubscriptions() {
    try {
        // @ts-ignore
        const subs = await prisma.subscription.findMany({
            orderBy: { nextDueDate: 'asc' }
        })
        return subs
    } catch (e) {
        console.error("Subscription table might not exist yet", e)
        return []
    }
}

export async function addSubscription(formData: FormData) {
    const name = formData.get("name") as string
    const amount = parseFloat(formData.get("amount") as string)
    const category = formData.get("category") as string
    const frequency = formData.get("frequency") as string
    const nextDueDate = new Date(formData.get("nextDueDate") as string)
    const provider = formData.get("provider") as string

    // @ts-ignore
    await prisma.subscription.create({
        data: {
            name,
            amount,
            category,
            frequency,
            nextDueDate,
            provider,
            status: "ACTIVE"
        }
    })
    revalidatePath("/subscriptions")
}

export async function detectRecurringExpenses() {
    // 1. Get recent expenses
    const expenses = await prisma.expense.findMany({
        orderBy: { timestamp: 'desc' },
        take: 100 // Look at last 100 transactions
    })

    // 2. Prepare data for summary analysis
    const summary = expenses.map(e =>
        `Date: ${e.timestamp.toISOString().split('T')[0]}, Amount: ${e.amount}, Category: ${e.category}, Note: ${e.note}`
    ).join('\n')

    // 3. Ask Gemini to find patterns
    const detected = await scanForSubscriptions(summary)

    return detected; // Returns array of potential subscriptions
}

// --- Goal Actions ---

export async function getGoals() {
    try {
        // @ts-ignore
        const goals = await prisma.goal.findMany({
            orderBy: { createdAt: 'desc' }
        })
        return goals
    } catch (e) {
        console.error("Goals table error", e)
        return []
    }
}

export async function addGoal(formData: FormData) {
    const name = formData.get("name") as string
    const targetAmount = parseFloat(formData.get("targetAmount") as string)
    const initialAmount = parseFloat(formData.get("initialAmount") as string || "0")

    // Check if deadline is present
    const deadlineStr = formData.get("deadline") as string
    const deadline = deadlineStr ? new Date(deadlineStr) : null

    // @ts-ignore
    await prisma.goal.create({
        data: {
            name,
            targetAmount,
            currentAmount: initialAmount,
            deadline,
            status: "ACTIVE"
        }
    })
    revalidatePath("/goals")
}

export async function contributeToGoal(id: string, amount: number) {
    // 1. Get goal to verify 
    // @ts-ignore
    const goal = await prisma.goal.findUnique({ where: { id } })
    if (!goal) throw new Error("Goal not found")

    // 2. Update Goal Balance
    // @ts-ignore
    await prisma.goal.update({
        where: { id },
        data: { currentAmount: { increment: amount } }
    })

    // 3. Record as Expense (Transfer) so wallet balance decreases
    // This is "simulating" the money leaving the liquid wallet to the goal jar.
    await prisma.expense.create({
        data: {
            amount,
            category: "Savings Goal: " + goal.name,
            note: "Contribution to goal",
            timestamp: new Date()
        }
    })

    revalidatePath("/goals")
    revalidatePath("/")
}

export async function deleteGoal(id: string) {
    // @ts-ignore
    await prisma.goal.delete({ where: { id } })
    revalidatePath("/goals")
}
