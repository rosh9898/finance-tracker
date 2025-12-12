
"use client";
import React from "react";
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell, Tooltip } from "recharts";

const data = [
    { name: "Jan", income: 4000, color: "#00D09C" },
    { name: "Feb", income: 3000, color: "#E356FA" },
    { name: "Mar", income: 2000, color: "#00D09C" },
    { name: "Apr", income: 2780, color: "#E356FA" },
    { name: "May", income: 1890, color: "#00D09C" },
    { name: "Jun", income: 2390, color: "#E356FA" },
    { name: "Jul", income: 3490, color: "#00D09C" },
    { name: "Aug", income: 2000, color: "#E356FA" },
    { name: "Sep", income: 2780, color: "#00D09C" },
    { name: "Oct", income: 1890, color: "#E356FA" },
    { name: "Nov", income: 3590, color: "#00D09C" },
    { name: "Dec", income: 2400, color: "#E356FA" }, // Alternate as per visual request (or split into Income/Outcome keys)
];
// Note: Reference image shows distinct bars with different colors, seemingly indicating mixed data or just aesthetic. 
// I will map colors directly.

export function StatsBarChart() {
    return (
        <div className="w-full h-[220px] bg-surface rounded-[30px] p-6 flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-white">Graph</h3>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-xs text-muted">Income</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-secondary" />
                        <span className="text-xs text-muted">Outcome</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} barSize={12}>
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#808191", fontSize: 10 }}
                        />
                        <Tooltip
                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            contentStyle={{ backgroundColor: '#13151D', borderColor: '#2D3047', borderRadius: '10px' }}
                        />
                        <Bar dataKey="income" radius={[4, 4, 0, 0]}>
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
