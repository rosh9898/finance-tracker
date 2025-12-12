
"use client";
import React from "react";
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell, Tooltip } from "recharts";

const data = [
    { name: "Jan", income: 4000, color: "#00D09C" },
    { name: "Feb", income: 3000, color: "#E356FA" }, // Purple
    { name: "Mar", income: 2000, color: "#00D09C" },
    { name: "Apr", income: 2780, color: "#E356FA" },
    { name: "May", income: 1890, color: "#00D09C" },
    { name: "Jun", income: 2390, color: "#E356FA" },
    { name: "Jul", income: 3490, color: "#00D09C" },
    { name: "Aug", income: 2000, color: "#E356FA" },
];

export function StatsBarChart() {
    return (
        <div className="w-full h-full min-h-[220px] bg-[#1F2128] rounded-[24px] p-6 flex flex-col border border-white/5 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150px] h-[150px] bg-secondary/5 blur-[60px] rounded-full pointer-events-none" />

            <div className="relative z-10 flex justify-between items-center mb-6">
                <h3 className="font-bold text-white text-lg tracking-tight">Analytics</h3>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-[10px] text-muted font-bold uppercase">Income</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-secondary" />
                        <span className="text-[10px] text-muted font-bold uppercase">Outcome</span>
                    </div>
                </div>
            </div>

            <div className="relative z-10 flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} barSize={14}>
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#808191", fontSize: 11, fontWeight: 500 }}
                            dy={10}
                        />
                        <Tooltip
                            cursor={{ fill: 'white', opacity: 0.05, radius: 4 }}
                            contentStyle={{
                                backgroundColor: '#1F2128',
                                borderColor: 'rgba(255,255,255,0.1)',
                                borderRadius: '12px',
                                boxShadow: '0 10px 40px -10px rgba(0,0,0,0.5)'
                            }}
                            itemStyle={{ fontSize: '12px', fontWeight: 600, color: '#fff' }}
                        />
                        <Bar dataKey="income" radius={[6, 6, 6, 6]}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
