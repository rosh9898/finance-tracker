
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
        <div className="hidden md:flex w-[250px] bg-[#13151D] h-screen fixed left-0 top-0 border-r border-[#1F2128] flex-col p-6 z-40">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-10">
                <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center transform rotate-3 shadow-[0_0_15px_rgba(227,86,250,0.3)]">
                    <span className="text-white font-bold text-xl">C</span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-white">Casflow</h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2">
                {navItems.map((item) => (
                    <div
                        key={item.label}
                        className={`flex items-center gap-4 px-4 py-3 rounded-2xl cursor-pointer transition-all duration-300 relative group
              ${item.active ? "text-secondary bg-white/5" : "text-muted hover:text-white hover:bg-white/5"}
            `}
                    >
                        {item.active && (
                            <motion.div
                                layoutId="active-nav"
                                className="absolute left-0 w-1 h-6 bg-secondary rounded-r-lg shadow-[0_0_10px_#E356FA]"
                            />
                        )}
                        <item.icon className={`w-5 h-5 ${item.active ? "drop-shadow-[0_0_8px_rgba(227,86,250,0.6)]" : ""}`} />
                        <span className="font-medium text-sm tracking-wide">{item.label}</span>
                    </div>
                ))}
            </nav>

            {/* Bottom Actions */}
            <div className="space-y-2 mt-auto border-t border-white/5 pt-6">
                <div className="flex items-center gap-4 px-4 py-3 text-muted hover:text-white cursor-pointer rounded-2xl hover:bg-white/5 transition-colors">
                    <Settings className="w-5 h-5" />
                    <span className="font-medium text-sm">Settings</span>
                </div>
                <div className="flex items-center gap-4 px-4 py-3 text-red-400 hover:text-red-300 cursor-pointer rounded-2xl hover:bg-white/5 transition-colors">
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium text-sm">Logout</span>
                </div>
            </div>
        </div>
    );
}
