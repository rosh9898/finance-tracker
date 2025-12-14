// Script to import bank transactions
// Run with: npx ts-node --compiler-options '{"module":"commonjs"}' scripts/import-transactions.ts

import { prisma } from '../lib/prisma'

const transactions = [
    // === Image 1 (Dec 11 - Dec 8) ===
    { type: 'EXPENSE', amount: 610.00, date: '2025-12-11', category: 'Shopping & Personal Care', note: 'POS LAUGFS SUPER MA' },
    { type: 'INCOME', amount: 280.00, date: '2025-12-11', category: 'Other Income', note: 'gayan - Transfer' },
    { type: 'EXPENSE', amount: 180.00, date: '2025-12-10', category: 'Shopping & Personal Care', note: 'POS LAUGFS SUPER MA' },
    { type: 'EXPENSE', amount: 400.00, date: '2025-12-09', category: 'Food & Groceries', note: 'POS CARAVAN - BOREL' },
    { type: 'EXPENSE', amount: 5.00, date: '2025-12-09', category: 'Work & Professional', note: 'ATM SERVICE CHARGE' },
    { type: 'EXPENSE', amount: 1900.00, date: '2025-12-09', category: 'Other / Miscellaneous', note: 'ATM CASHWDL KOTHALAWALA DEF' },
    { type: 'EXPENSE', amount: 180.00, date: '2025-12-08', category: 'Shopping & Personal Care', note: 'POS LAUGFS SUPER MA' },

    // === Image 2 (Dec 8 - Dec 5) ===
    { type: 'EXPENSE', amount: 220.00, date: '2025-12-08', category: 'Shopping & Personal Care', note: 'POS LAUGFS SUPER MA' },
    { type: 'EXPENSE', amount: 330.00, date: '2025-12-08', category: 'Other / Miscellaneous', note: 'rodda - Transfer' },
    { type: 'EXPENSE', amount: 350.00, date: '2025-12-08', category: 'Shopping & Personal Care', note: 'POS LAUGFS SUPER MA' },
    { type: 'INCOME', amount: 300.00, date: '2025-12-08', category: 'Other Income', note: 'gayan - Transfer' },
    { type: 'INCOME', amount: 200.00, date: '2025-12-05', category: 'Other Income', note: 'amila - Transfer' },
    { type: 'EXPENSE', amount: 98.00, date: '2025-12-05', category: 'Other / Miscellaneous', note: '0704351424 - Mobile' },
    { type: 'EXPENSE', amount: 1488.57, date: '2025-12-05', category: 'Food & Groceries', note: 'ECOMMERCE UBER EATS' },

    // === Image 3 (Dec 5 - Dec 1) ===
    { type: 'EXPENSE', amount: 59.90, date: '2025-12-05', category: 'Transport & Fuel', note: 'ECOMMERCE UBER' },
    { type: 'EXPENSE', amount: 5.00, date: '2025-12-05', category: 'Work & Professional', note: 'ATM SERVICE CHARGE' },
    { type: 'EXPENSE', amount: 2900.00, date: '2025-12-05', category: 'Other / Miscellaneous', note: 'ATM CASHWDL KOTHALAWALA DEF' },
    { type: 'INCOME', amount: 78.90, date: '2025-12-02', category: 'Other Income', note: 'ECOMMERCE UBER - Refund' },
    { type: 'EXPENSE', amount: 463.00, date: '2025-12-02', category: 'Transport & Fuel', note: 'POS LAUGFS SUPER MA - Fuel' },
    { type: 'EXPENSE', amount: 78.90, date: '2025-12-02', category: 'Transport & Fuel', note: 'ECOMMERCE UBER' },
    { type: 'EXPENSE', amount: 98.00, date: '2025-12-01', category: 'Other / Miscellaneous', note: '0704351424 - Mobile' },

    // === Image 4 (Dec 1) ===
    { type: 'EXPENSE', amount: 555.00, date: '2025-12-01', category: 'Entertainment & Leisure', note: 'ECOMMERCE Google YouTube Premium' },
    { type: 'EXPENSE', amount: 98.00, date: '2025-12-01', category: 'Other / Miscellaneous', note: '0704351424 - Mobile' },
    { type: 'EXPENSE', amount: 20.00, date: '2025-12-01', category: 'Other / Miscellaneous', note: '0704351424 - Mobile' },
    { type: 'EXPENSE', amount: 160.00, date: '2025-12-01', category: 'Other / Miscellaneous', note: '0704351424 - Mobile' },
    { type: 'INCOME', amount: 500.00, date: '2025-12-01', category: 'Other Income', note: 'Rodda - Transfer' },
    { type: 'EXPENSE', amount: 10025.00, date: '2025-12-01', category: 'Other / Miscellaneous', note: 'Roshan - Transfer' },

    // === Image 5 (Nov 28) ===
    { type: 'EXPENSE', amount: 3.23, date: '2025-11-28', category: 'Work & Professional', note: 'INTEREST WITHHELD' },
    { type: 'INCOME', amount: 32.31, date: '2025-11-28', category: 'Investments', note: 'INTEREST PAY SYS-GEN' },
    { type: 'EXPENSE', amount: 3000.00, date: '2025-11-28', category: 'Other / Miscellaneous', note: '5156852000093760 - Transfer' },
    { type: 'EXPENSE', amount: 98.00, date: '2025-11-28', category: 'Other / Miscellaneous', note: '0704351424 - Mobile' },
    { type: 'EXPENSE', amount: 390.00, date: '2025-11-28', category: 'Food & Groceries', note: 'POS CRIMSON' },
    { type: 'EXPENSE', amount: 5.00, date: '2025-11-28', category: 'Work & Professional', note: 'ATM SERVICE CHARGE' },
] as const

async function importTransactions() {
    console.log(`Importing ${transactions.length} transactions...`)

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
            console.log(`✅ Income: LKR ${t.amount} - ${t.note}`)
        } else {
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
    }

    console.log(`\n🎉 Successfully imported ${transactions.length} transactions!`)
}

importTransactions()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
