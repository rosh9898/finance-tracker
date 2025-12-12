
"use client";
import React from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

export function ProfileCard() {
    return (
        <div className="relative overflow-hidden rounded-[24px] p-8 h-full min-h-[220px] flex flex-col justify-between group border border-white/5 bg-[#1F2128]">
            {/* Subtle Mesh Gradient */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-secondary/5 blur-[80px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-primary/5 blur-[60px] rounded-full pointer-events-none" />

            {/* Header Content */}
            <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start gap-6">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="w-16 h-16 rounded-full border-2 border-white/10 p-1">
                            <div className="w-full h-full rounded-full bg-[#13151D] bg-[url('https://api.dicebear.com/7.x/avataaars/svg?seed=Ferra')] bg-cover" />
                        </div>
                        <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-[#1F2128]" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">Ferra Alexandra</h2>
                        <p className="text-muted text-sm font-medium">UIX Designer</p>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-muted uppercase tracking-wider font-bold">Pro Account</span>
                        </div>
                    </div>
                </div>

                {/* Quick Balance (Optional styling choice) */}
                <div className="hidden sm:block text-right">
                    <p className="text-muted text-xs font-medium uppercase tracking-wide">Total Balance</p>
                    <p className="text-3xl font-bold text-white mt-1">$48,390.00</p>
                </div>
            </div>

            {/* Stats Blocks */}
            <div className="relative z-10 grid grid-cols-2 gap-4 mt-8">
                <div className="bg-[#13151D]/50 backdrop-blur-sm rounded-xl p-4 border border-white/5 group-hover:border-white/10 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                            <ArrowUp className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] text-muted font-bold uppercase tracking-wider">Income</span>
                    </div>
                    <span className="text-xl font-bold text-white tracking-tight">$39,730</span>
                </div>

                <div className="bg-[#13151D]/50 backdrop-blur-sm rounded-xl p-4 border border-white/5 group-hover:border-white/10 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-1.5 rounded-lg bg-secondary/10 text-secondary">
                            <ArrowDown className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] text-muted font-bold uppercase tracking-wider">Outcome</span>
                    </div>
                    <span className="text-xl font-bold text-white tracking-tight">$6,300</span>
                </div>
            </div>
        </div>
    );
}
