// Script to import additional bank transactions (Nov 21 - Nov 28)
// Run with: npx tsx scripts/import-transactions-2.ts

import { prisma } from '../lib/prisma'

const transactions = [
    // === Image 1 (Nov 28 - Nov 24) ===
    { type: 'EXPENSE', amount: 3900.00, date: '2025-11-28', category: 'Other / Miscellaneous', note: 'ATM CASHWDL KOTHALAWALA DEF' },
    { type: 'EXPENSE', amount: 98.00, date: '2025-11-27', category: 'Other / Miscellaneous', note: '0704351424 - Mobile' },
    { type: 'EXPENSE', amount: 500.00, date: '2025-11-27', category: 'Shopping & Personal Care', note: 'POS LAUGFS SUPER MA' },
    { type: 'EXPENSE', amount: 98.00, date: '2025-11-26', category: 'Other / Miscellaneous', note: '0704351424 - Mobile' },
    { type: 'EXPENSE', amount: 98.00, date: '2025-11-25', category: 'Other / Miscellaneous', note: '0704351424 - Mobile' },
    { type: 'EXPENSE', amount: 260.00, date: '2025-11-25', category: 'Shopping & Personal Care', note: 'POS LAUGFS SUPER MA' },
    { type: 'EXPENSE', amount: 98.00, date: '2025-11-24', category: 'Other / Miscellaneous', note: '0704351424 - Mobile' },

    // === Image 2 (Nov 24) ===
    { type: 'EXPENSE', amount: 850.00, date: '2025-11-24', category: 'Food & Groceries', note: 'POS SOFTLOGIC RESTA' },
    { type: 'EXPENSE', amount: 770.00, date: '2025-11-24', category: 'Shopping & Personal Care', note: 'POS SOFTLOGIC SUPER' },
    { type: 'EXPENSE', amount: 2385.00, date: '2025-11-24', category: 'Shopping & Personal Care', note: 'POS ODEL PLC' },
    { type: 'EXPENSE', amount: 3025.00, date: '2025-11-24', category: 'Food & Groceries', note: 'POS SUGAR BISTRO' },
    { type: 'EXPENSE', amount: 98.00, date: '2025-11-24', category: 'Other / Miscellaneous', note: '0704351424 - Mobile' },
    { type: 'EXPENSE', amount: 98.00, date: '2025-11-24', category: 'Other / Miscellaneous', note: '0704351424 - Mobile' },
    { type: 'EXPENSE', amount: 276.00, date: '2025-11-24', category: 'Shopping & Personal Care', note: 'POS LAUGFS SUPER MA' },

    // === Image 3 (Nov 24 - Nov 21) ===
    { type: 'EXPENSE', amount: 98.00, date: '2025-11-24', category: 'Other / Miscellaneous', note: '0704351424 - Mobile' },
    { type: 'EXPENSE', amount: 7025.00, date: '2025-11-24', category: 'Other / Miscellaneous', note: 'Roshan - Transfer' },
    { type: 'EXPENSE', amount: 5.00, date: '2025-11-21', category: 'Work & Professional', note: 'ATM SERVICE CHARGE' },
    { type: 'EXPENSE', amount: 3900.00, date: '2025-11-21', category: 'Other / Miscellaneous', note: 'ATM CASHWDL KOTHALAWALA DEF' },
    { type: 'EXPENSE', amount: 936.85, date: '2025-11-21', category: 'Food & Groceries', note: 'ECOMMERCE UBER EATS' },
    { type: 'EXPENSE', amount: 15000.00, date: '2025-11-21', category: 'Other / Miscellaneous', note: '5156852000093760 - Transfer' },
    { type: 'EXPENSE', amount: 4306.78, date: '2025-11-21', category: 'Other / Miscellaneous', note: '312603_cc3c63e9dea146aca4 - Transfer' },
] as const

async function importTransactions() {
    console.log(`Importing ${transactions.length} additional transactions...`)

    for (const t of transactions) {
        await prisma.expense.create({
            data: {
                amount: t.amount,
                category: t.category,
                timestamp: new Date(t.date),
                note: t.note
            }
        })
        console.log(`✅ Expense: LKR ${t.amount} - ${t.note}`)
    }

    console.log(`\n🎉 Successfully imported ${transactions.length} transactions!`)
}

importTransactions()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
