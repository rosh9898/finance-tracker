"use client"

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useTheme } from 'next-themes';

ChartJS.register(ArcElement, Tooltip, Legend);

interface BreakdownChartProps {
    data: {
        category: string;
        amount: number;
    }[]
}

export function BreakdownChart({ data }: BreakdownChartProps) {
    const { theme } = useTheme();

    // Palette for Categories (Neon/Dark theme friendly)
    const colors = [
        '#EC4899', // Pink-500
        '#10B981', // Emerald-500
        '#8B5CF6', // Violet-500
        '#F59E0B', // Amber-500
        '#3B82F6', // Blue-500
    ];

    const chartData = {
        labels: data.map(d => d.category),
        datasets: [
            {
                data: data.map(d => d.amount),
                backgroundColor: colors,
                borderColor: '#1f2937', // Dark border (matches bg)
                borderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false, // We will build a custom legend
            },
            tooltip: {
                backgroundColor: '#1f2937',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
                callbacks: {
                    label: function (context: any) {
                        return ` ${context.label}: LKR ${context.raw.toLocaleString()}`;
                    }
                }
            }
        },
        cutout: '75%', // Thinner ring
    };

    return (
        <div className="w-full">
            <div className="relative h-[200px] w-full flex items-center justify-center">
                {/* @ts-ignore */}
                <Doughnut data={chartData} options={options} />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-xs font-bold text-gray-500">Analytics</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
                {data.map((item, index) => (
                    <div key={item.category} className="flex items-center gap-2">
                        <div
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: colors[index % colors.length] }}
                        />
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-xs text-gray-600 dark:text-gray-400 truncate w-full">{item.category}</span>
                            <span className="text-xs font-bold text-gray-900 dark:text-white">LKR {item.amount.toLocaleString()}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
