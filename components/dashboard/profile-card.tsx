
"use client";
import React from "react";
import { ArrowUp, ArrowDown, Bell } from "lucide-react";

export function ProfileCard() {
    return (
        <div className="relative overflow-hidden rounded-[30px] p-8 h-full min-h-[220px] flex flex-col justify-between group">
            {/* Complex Glass Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#2D3047] via-[#1F1B2E] to-[#13151D] z-0" />

            {/* Blur/Mesh Effects */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary/20 rounded-full blur-[50px] animate-pulse" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-[50px] animate-pulse delay-700" />
            <div className="absolute inset-0 backdrop-blur-[10px] z-0" />

            {/* Content */}
            <div className="relative z-10 flex justify-between items-start">
                <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-16 h-16 rounded-full border-2 border-white/20 p-1">
                        <div className="w-full h-full rounded-full bg-surface bg-[url('https://api.dicebear.com/7.x/avataaars/svg?seed=Ferra')] bg-cover" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Ferra Alexandra</h2>
                        <p className="text-muted text-sm">UIX Designer</p>
                    </div>
                </div>
            </div>

            {/* Stats Blocks */}
            <div className="relative z-10 grid grid-cols-2 gap-4 mt-6">
                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/5 transition-colors hover:bg-white/10">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-xs text-muted">Income</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-white">$39,730</span>
                        <ArrowUp className="w-4 h-4 text-primary" />
                    </div>
                </div>

                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/5 transition-colors hover:bg-white/10">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                        <span className="text-xs text-muted">Outcome</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-white">$6,300</span>
                        <ArrowDown className="w-4 h-4 text-secondary" />
                    </div>
                </div>
            </div>
        </div>
    );
}
