
"use client";
import React from "react";
import { LayoutGrid, TrendingUp, TrendingDown, PieChart, Settings, LogOut } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
    { icon: LayoutGrid, label: "Dashboard", active: true },
    { icon: TrendingUp, label: "Income", active: false },
    { icon: TrendingDown, label: "Outcome", active: false },
    { icon: PieChart, label: "Analytics", active: false },
];

export function Sidebar() {
    return (
        <div className="w-[250px] bg-[#13151D] h-screen fixed left-0 top-0 border-r border-[#1F2128] flex flex-col p-6 z-50">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-10">
                <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center transform rotate-3">
                    <span className="text-white font-bold text-xl">C</span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight">Casflow</h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2">
                {navItems.map((item) => (
                    <div
                        key={item.label}
                        className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 relative group
              ${item.active ? "text-secondary" : "text-muted hover:text-white hover:bg-white/5"}
            `}
                    >
                        {item.active && (
                            <motion.div
                                layoutId="active-nav"
                                className="absolute left-0 w-1 h-6 bg-secondary rounded-r-lg shadow-[0_0_10px_#E356FA]"
                            />
                        )}
                        <item.icon className={`w-5 h-5 ${item.active ? "drop-shadow-[0_0_5px_rgba(227,86,250,0.5)]" : ""}`} />
                        <span className="font-medium">{item.label}</span>
                    </div>
                ))}
            </nav>

            {/* Bottom Actions */}
            <div className="space-y-2 mt-auto">
                <div className="flex items-center gap-4 px-4 py-3 text-muted hover:text-white cursor-pointer rounded-xl hover:bg-white/5">
                    <Settings className="w-5 h-5" />
                    <span className="font-medium">Settings</span>
                </div>
                <div className="flex items-center gap-4 px-4 py-3 text-red-400 hover:text-red-300 cursor-pointer rounded-xl hover:bg-white/5">
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                </div>
            </div>
        </div>
    );
}
