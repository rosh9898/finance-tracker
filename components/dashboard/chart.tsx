"use client"

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useTheme } from 'next-themes';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface OverviewChartProps {
    data: {
        labels: string[];
        balance: number[];
        expense: number[];
        debt: number[];
    }
}

export function OverviewChart({ data: serverData }: OverviewChartProps) {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === 'dark';
    const textColor = isDark ? '#94a3b8' : '#475569';
    const gridColor = isDark ? 'rgba(51, 65, 85, 0.3)' : 'rgba(203, 213, 225, 0.5)';

    const chartData = {
        labels: serverData.labels,
        datasets: [
            {
                label: '  Balance', // Added spaces for legend spacing
                data: serverData.balance,
                borderColor: '#6366F1', // Indigo-500
                backgroundColor: 'rgba(99, 102, 241, 0.1)', // Subtle fill
                tension: 0.4, // Smooth curve
                pointRadius: 0,
                pointHoverRadius: 6,
                pointBackgroundColor: '#6366F1',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                fill: true,
                borderWidth: 2,
            },
            {
                label: '  Expenses',
                data: serverData.expense,
                borderColor: '#D946EF', // Neon Magenta (Fuchsia-500)
                backgroundColor: 'rgba(217, 70, 239, 0.1)', // Subtle fill
                tension: 0.4, // Smooth curve
                pointRadius: 0,
                pointHoverRadius: 6,
                pointBackgroundColor: '#D946EF',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                fill: true,
                borderWidth: 2,
            },
            {
                label: '  Debt',
                data: serverData.debt,
                borderColor: '#F59E0B', // Neon Amber (Amber-500)
                backgroundColor: 'rgba(245, 158, 11, 0.1)', // Subtle fill
                tension: 0.4, // Smooth curve
                pointRadius: 0,
                pointHoverRadius: 6,
                pointBackgroundColor: '#F59E0B',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                fill: true,
                borderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                align: 'end' as const,
                labels: {
                    color: textColor, // Adaptive
                    usePointStyle: true,
                    pointStyle: 'circle',
                    boxWidth: 8,
                    padding: 30, // Increased spacing between items
                    font: {
                        family: 'Inter, sans-serif',
                        size: 12,
                        weight: 500
                    }
                }
            },
            tooltip: {
                backgroundColor: isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                titleColor: isDark ? '#fff' : '#0f172a',
                bodyColor: isDark ? '#e2e8f0' : '#334155',
                borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                borderWidth: 1,
                padding: 12,
                displayColors: true,
                usePointStyle: true,
                cornerRadius: 8,
                titleFont: { family: 'Inter, sans-serif', size: 13, weight: '600' },
                bodyFont: { family: 'Inter, sans-serif', size: 12 },
                callbacks: {
                    label: function (context: any) {
                        let label = context.dataset.label || '';
                        label = label.trim(); // Remove the spacing for the tooltip
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'LKR' }).format(context.parsed.y);
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            y: {
                border: { display: false },
                ticks: {
                    color: textColor,
                    font: { size: 10, family: 'Inter, sans-serif' },
                    callback: function (value: any) {
                        if (value >= 1000) return (value / 1000) + 'k';
                        return value;
                    }
                },
                grid: {
                    color: gridColor,
                    drawBorder: false,
                }
            },
            x: {
                border: { display: false },
                ticks: {
                    color: textColor,
                    font: { size: 10, family: 'Inter, sans-serif' },
                    maxTicksLimit: 10, // Avoid cluttering day labels
                },
                grid: { display: false }
            }
        },
        interaction: {
            mode: 'index' as const,
            intersect: false,
        },
    };

    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">Daily Cash Flow</h3>

            </div>
            <div className="flex-1 min-h-0">
                {/* @ts-ignore */}
                <Line options={options} data={chartData} />
            </div>
        </div>
    );
}
