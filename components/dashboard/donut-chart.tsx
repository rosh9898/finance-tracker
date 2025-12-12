
"use client";
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

const data = [
    { name: "Utility", value: 30, color: "#3B82F6" },
    { name: "Entertainment", value: 20, color: "#E356FA" }, // Neon Purple
    { name: "Groceries", value: 50, color: "#00D09C" },    // Neon Green
];

export function DonutChart() {
    return (
        <div className="bg-surface rounded-[30px] p-6 h-full flex flex-col relative">
            {/* Centered Total */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8 pl-8">
                <span className="text-2xl font-bold text-white">$1,200</span>
                <span className="text-xs text-muted">Utility</span>
            </div>

            <div className="w-full h-full min-h-[160px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={0}
                            dataKey="value"
                            stroke="none"
                            cornerRadius={10}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Legend
                            layout="vertical"
                            verticalAlign="middle"
                            align="right"
                            iconType="circle"
                            formatter={(value, entry: any) => (
                                <span className="text-muted text-xs ml-2">{value} {entry.payload.value}%</span>
                            )}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
