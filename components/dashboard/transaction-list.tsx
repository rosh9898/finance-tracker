
"use client";
import React from "react";
import { Film, Zap, ShoppingCart } from "lucide-react";

const transactions = [
    { id: 1, title: "Cinema XXI", date: "21 Sept 2024", amount: "-$20", icon: Film, color: "bg-red-500/10 text-red-500" },
    { id: 2, title: "Electricity", date: "22 Sept 2024", amount: "-$140", icon: Zap, color: "bg-yellow-500/10 text-yellow-500" },
    { id: 3, title: "Groceries", date: "23 Sept 2024", amount: "-$85", icon: ShoppingCart, color: "bg-green-500/10 text-green-500" },
];

export function TransactionList() {
    return (
        <div className="bg-surface rounded-[30px] p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-white">Transactions</h3>
                {/* Simple Menu Dots */}
                <div className="flex gap-1">
                    <div className="w-1 h-1 bg-muted rounded-full" />
                    <div className="w-1 h-1 bg-muted rounded-full" />
                </div>
            </div>

            <div className="space-y-6">
                {transactions.map((t) => (
                    <div key={t.id} className="flex items-center justify-between group cursor-pointer">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl transition-colors ${t.color} group-hover:bg-white/10`}>
                                <t.icon className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-medium text-white text-sm">{t.title}</h4>
                                <p className="text-xs text-muted">{t.date}</p>
                            </div>
                        </div>
                        <span className="font-bold text-white">{t.amount}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
