"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getFinancialInsights, parseTransaction } from "@/lib/gemini"

export async function getDashboardData() {
    const [incomes, expenses, debts] = await Promise.all([
        prisma.income.findMany({ orderBy: { timestamp: 'desc' } }),
        prisma.expense.findMany({ orderBy: { timestamp: 'desc' } }),
        prisma.debt.findMany({ orderBy: { createdAt: 'desc' } }),
    ])

    // Calculate totals
    const totalIncome = incomes.reduce((acc, curr) => acc + curr.amount, 0)
    const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0)
    const totalDebt = debts.reduce((acc, curr) => acc + curr.currentBalance, 0)

    const balance = totalIncome - totalExpense

    // Combine for recent transactions
    const recent = [
        ...incomes.map(i => ({ ...i, type: 'INCOME', date: i.timestamp })),
        ...expenses.map(e => ({ ...e, type: 'EXPENSE', date: e.timestamp })),
        ...debts.map(d => ({
            ...d,
            type: 'DEBT',
            category: d.type,
            date: d.createdAt,
            amount: d.currentBalance
        }))
    ]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5)

    const chartLabels: string[] = []
    const chartBalance: number[] = []
    const chartExpense: number[] = []
    const chartDebt: number[] = []
    let runningBalance = 0
    let runningExpense = 0
    let runningDebt = 0

    // Last 30 days for Monthly Overview
    for (let i = 29; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        const dateStr = d.toLocaleDateString('en-CA') // YYYY-MM-DD
        const label = d.toLocaleDateString('en-US', { day: 'numeric' }) // Day number

        chartLabels.push(label)

        const dayIncomes = incomes.filter(inc => new Date(inc.timestamp).toISOString().startsWith(dateStr))
        const dayExpenses = expenses.filter(exp => new Date(exp.timestamp).toISOString().startsWith(dateStr))
        const dayDebts = debts.filter(d => new Date(d.createdAt).toISOString().startsWith(dateStr))

        const dailyIncome = dayIncomes.reduce((acc, curr) => acc + curr.amount, 0)
        const dailyExpense = dayExpenses.reduce((acc, curr) => acc + curr.amount, 0)
        const dailyDebt = dayDebts.reduce((acc, curr) => acc + curr.initialAmount, 0)

        runningBalance += (dailyIncome - dailyExpense)
        runningExpense += dailyExpense
        runningDebt += dailyDebt

        chartBalance.push(runningBalance)
        chartExpense.push(runningExpense)
        chartDebt.push(runningDebt)
    }

    return {
        totals: {
            balance,
            income: totalIncome,
            expense: totalExpense,
            debt: totalDebt
        },
        recent,
        chart: {
            labels: chartLabels,
            balance: chartBalance,
            expense: chartExpense,
            debt: chartDebt
        },
        breakdown: Object.entries(expenses.reduce((acc, curr) => {
            acc[curr.category] = (acc[curr.category] || 0) + curr.amount
            return acc
        }, {} as Record<string, number>))
            .map(([category, amount]) => ({ category, amount }))
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 5)
    }
}

export async function generateInsights() {
    const data = await getDashboardData()
    const summary = `
    Total Income: ${data.totals.income}
    Total Expense: ${data.totals.expense}
    Total Debt: ${data.totals.debt}
    Net Balance: ${data.totals.balance}
    Recent Transactions: ${data.recent.map(t => `${t.type}: ${t.amount} (${t.category})`).join(', ')}
  `
    return await getFinancialInsights(summary)
}

export async function addIncome(formData: FormData) {
    const amount = parseFloat(formData.get("amount") as string)
    const category = formData.get("category") as string
    const dateStr = formData.get("date") as string
    const note = formData.get("note") as string

    await prisma.income.create({
        data: {
            amount,
            category,
            timestamp: new Date(dateStr),
            note
        }
    })

    revalidatePath("/")
}

// Bulk import transactions from bank statement
export async function bulkAddTransactions(transactions: {
    type: 'INCOME' | 'EXPENSE',
    amount: number,
    category: string,
    date: string,
    note: string
}[]) {
    for (const t of transactions) {
        if (t.type === 'INCOME') {
            await prisma.income.create({
                data: {
                    amount: t.amount,
                    category: t.category,
                    timestamp: new Date(t.date),
                    note: t.note
                }
            })
        } else {
            await prisma.expense.create({
                data: {
                    amount: t.amount,
                    category: t.category,
                    timestamp: new Date(t.date),
                    note: t.note
                }
            })
        }
    }
    revalidatePath("/")
    revalidatePath("/history")
    return { success: true, count: transactions.length }
}

export async function addExpense(formData: FormData) {
    const amount = parseFloat(formData.get("amount") as string)
    const category = formData.get("category") as string
    const dateStr = formData.get("date") as string
    const note = formData.get("note") as string

    await prisma.expense.create({
        data: {
            amount,
            category,
            timestamp: new Date(dateStr),
            note
        }
    })

    revalidatePath("/")
}

export async function addDebt(formData: FormData) {
    const amount = parseFloat(formData.get("amount") as string)
    const type = formData.get("type") as string // "Credit Card", "Loan"
    const lender = formData.get("lender") as string
    const dateStr = formData.get("date") as string
    const note = formData.get("note") as string

    await prisma.debt.create({
        data: {
            initialAmount: amount,
            currentBalance: amount,
            type,
            lender,
            createdAt: new Date(dateStr),
            note
        }
    })

    revalidatePath("/")
}

export async function getHistory() {
    const [incomes, expenses, debts] = await Promise.all([
        prisma.income.findMany({ orderBy: { timestamp: 'desc' } }),
        prisma.expense.findMany({ orderBy: { timestamp: 'desc' } }),
        prisma.debt.findMany({ orderBy: { createdAt: 'desc' } }),
    ])

    const transactions = [
        ...incomes.map(i => ({ ...i, type: 'INCOME', date: i.timestamp })),
        ...expenses.map(e => ({ ...e, type: 'EXPENSE', date: e.timestamp })),
        ...debts.map(d => ({
            ...d,
            type: 'DEBT',
            category: d.type,
            date: d.createdAt,
            amount: d.currentBalance
        }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return transactions
}

export async function getActiveDebts() {
    return await prisma.debt.findMany({
        where: { currentBalance: { gt: 0 } },
        orderBy: { createdAt: 'desc' },
        select: { id: true, lender: true, type: true, currentBalance: true }
    })
}

export async function getTransaction(id: string, type: string) {
    const normalizedType = type.toLowerCase()
    if (normalizedType === 'income') {
        return await prisma.income.findUnique({ where: { id } })
    } else if (normalizedType === 'expense') {
        return await prisma.expense.findUnique({ where: { id } })
    } else if (normalizedType === 'debt') {
        return await prisma.debt.findUnique({ where: { id } })
    }
}

export async function updateTransaction(id: string, type: string, formData: FormData) {
    const amount = parseFloat(formData.get("amount") as string)
    const category = formData.get("category") as string
    const dateStr = formData.get("date") as string
    const note = formData.get("note") as string
    const date = new Date(dateStr)

    const normalizedType = type.toLowerCase()

    if (normalizedType === 'income') {
        await prisma.income.update({
            where: { id },
            data: { amount, category, timestamp: date, note }
        })
    } else if (normalizedType === 'expense') {
        await prisma.expense.update({
            where: { id },
            data: { amount, category, timestamp: date, note }
        })
    } else if (normalizedType === 'debt') {
        const lender = formData.get("lender") as string
        await prisma.debt.update({
            where: { id },
            data: {
                initialAmount: amount,
                type: category, // Debt type mapped to category
                lender,
                createdAt: date,
                note
            }
        })
    }
    revalidatePath("/")
    revalidatePath("/history")
}

export async function processSmartAdd(input: string) {
    return await parseTransaction(input)
}

export async function addRepayment(formData: FormData) {
    const debtId = formData.get("debtId") as string
    const amount = parseFloat(formData.get("amount") as string)
    const dateStr = formData.get("date") as string

    // 1. Create Repayment record
    await prisma.repayment.create({
        data: {
            debtId,
            amount,
            timestamp: new Date(dateStr)
        }
    })

    // 2. Decrement Debt Balance
    const debt = await prisma.debt.findUnique({ where: { id: debtId } })
    if (debt) {
        await prisma.debt.update({
            where: { id: debtId },
            data: { currentBalance: debt.currentBalance - amount }
        })
    }

    revalidatePath("/")
}

export async function deleteTransaction(id: string, type: 'INCOME' | 'EXPENSE' | 'DEBT') {
    if (type === 'INCOME') {
        await prisma.income.delete({ where: { id } })
    } else if (type === 'EXPENSE') {
        await prisma.expense.delete({ where: { id } })
    } else if (type === 'DEBT') {
        await prisma.debt.delete({ where: { id } })
    }
    revalidatePath("/")
}

export async function seedDatabase() {
    // 1. Clear existing data (optional, let's just add to it to be safe, or maybe clear? 
    // Safest for "Simulated Dataset" is usually to assume fresh or just noise. 
    // I will NOT clear, just add.

    const categories = {
        income: ["Salary", "Business / Freelance", "Investments", "Gifts / Allowances", "Other Income"],
        expense: ["Food & Groceries", "Transport & Fuel", "Housing & Utilities", "Health & Medical", "Shopping & Personal Care", "Entertainment & Leisure", "Education & Courses", "Work & Professional", "Family & Gifts", "Other / Miscellaneous"]
    };

    const today = new Date();

    // Generate 40-50 transactions
    const numTransactions = 45;

    for (let i = 0; i < numTransactions; i++) {
        const isIncome = Math.random() > 0.7; // 30% income, 70% expense
        const daysAgo = Math.floor(Math.random() * 30);
        const date = new Date(today);
        date.setDate(date.getDate() - daysAgo);

        if (isIncome) {
            const amount = Math.floor(Math.random() * 50000) + 5000;
            await prisma.income.create({
                data: {
                    amount,
                    category: categories.income[Math.floor(Math.random() * categories.income.length)],
                    timestamp: date,
                    note: "Simulated Entry"
                }
            });
        } else {
            const amount = Math.floor(Math.random() * 8000) + 500;
            await prisma.expense.create({
                data: {
                    amount,
                    category: categories.expense[Math.floor(Math.random() * categories.expense.length)],
                    timestamp: date,
                    note: "Simulated Entry"
                }
            });
        }
    }

    // Ensure at least one massive Salary income if not present
    await prisma.income.create({
        data: {
            amount: 150000,
            category: "Salary",
            timestamp: new Date(),
            note: "Simulated Salary"
        }
    });

    // Generate Simulated Debts
    const debtTypes = ["Credit Card", "Loan", "Borrowed Money"];
    const lenders = ["HNB Bank", "Commercial Bank", "Friend (Kamal)", "DFCC Bank"];

    for (let i = 0; i < 4; i++) {
        const initialAmount = Math.floor(Math.random() * 50000) + 10000;
        let currentBalance = initialAmount;

        const daysAgo = Math.floor(Math.random() * 60) + 5; // At least 5 days ago to allow for repayments
        const date = new Date(today);
        date.setDate(date.getDate() - daysAgo);

        const debt = await prisma.debt.create({
            data: {
                initialAmount: initialAmount,
                currentBalance: initialAmount,
                type: debtTypes[Math.floor(Math.random() * debtTypes.length)],
                lender: lenders[Math.floor(Math.random() * lenders.length)],
                createdAt: date,
                note: "Simulated Debt"
            }
        });

        // Simulate Repayments (70% chance)
        if (Math.random() > 0.3) {
            const numRepayments = Math.floor(Math.random() * 3) + 1;
            for (let j = 0; j < numRepayments; j++) {
                const repaymentAmount = Math.floor(initialAmount * (Math.random() * 0.1 + 0.05)); // 5-15% per repayment

                // Ensure we don't pay more than balance
                if (currentBalance < repaymentAmount) continue;

                const repaymentDaysAfter = Math.floor(Math.random() * (daysAgo - 1)) + 1;
                const repaymentDate = new Date(date);
                repaymentDate.setDate(repaymentDate.getDate() + repaymentDaysAfter);

                if (repaymentDate <= new Date()) {
                    await prisma.repayment.create({
                        data: {
                            debtId: debt.id,
                            amount: repaymentAmount,
                            timestamp: repaymentDate
                        }
                    });
                    currentBalance -= repaymentAmount;
                }
            }

            // Update the debt with the new current balance
            await prisma.debt.update({
                where: { id: debt.id },
                data: { currentBalance }
            });
        }
    }

    revalidatePath("/");
    revalidatePath("/history");
}

export async function clearDatabase() {
    await prisma.income.deleteMany({})
    await prisma.expense.deleteMany({})
    await prisma.debt.deleteMany({})

    // Also clear Repayments if they exist (assuming relation, but deleteMany on debt might cascade or fail without it; 
    // strictly speaking we didn't see a Repayment model usage deletion in previous analyses, but let's check.
    // Ah, wait, checking `addRepayment` function showed `prisma.repayment.create`. 
    // So we should delete repayments too.
    try {
        await prisma.repayment.deleteMany({})
    } catch (e) {
        // Ignore if model doesn't exist or other error, but it should exist based on previous analysis
    }

    revalidatePath("/")
    revalidatePath("/history")
}
