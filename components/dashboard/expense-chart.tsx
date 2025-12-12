
"use client";
import React from "react";
import { AreaChart, Area, XAxis, ResponsiveContainer, Tooltip } from "recharts";

const data = [
    { name: "Jan", uv: 4000 },
    { name: "Feb", uv: 3000 },
    { name: "Mar", uv: 2000 },
    { name: "Apr", uv: 6780, active: true }, // The spike
    { name: "May", uv: 1890 },
    { name: "Jun", uv: 2390 },
    { name: "Jul", uv: 3490 },
    { name: "Aug", uv: 2000 },
    { name: "Sep", uv: 3490 },
    { name: "Oct", uv: 2890 },
    { name: "Nov", uv: 4590 },
    { name: "Dec", uv: 3400 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white text-surface p-3 rounded-xl shadow-[0_4px_20px_rgba(227,86,250,0.3)]">
                <p className="text-xs font-bold mb-1 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-secondary"></span>
                    Outcome
                </p>
                <p className="text-lg font-bold text-surface">${payload[0].value.toLocaleString()}</p>
                <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white rotate-45"></span>
            </div>
        );
    }
    return null;
};

export function ExpenseLineChart() {
    return (
        <div className="w-full bg-surface rounded-[30px] p-6 relative">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white">Expenses</h3>
            </div>

            <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#E356FA" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#E356FA" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="uv"
                            stroke="#E356FA"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorUv)"
                        />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#808191", fontSize: 12, marginTop: 10 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
