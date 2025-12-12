
"use client"

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface OverviewChartProps {
    data: {
        labels: string[];
        income: number[];
        expense: number[];
    }
}

// 1. Income vs Outcome Bar Chart (Top Right)
export function IncomeOutcomeChart({ data: serverData }: OverviewChartProps) {
    const chartData = {
        labels: serverData.labels,
        datasets: [
            {
                label: 'Income',
                data: serverData.income,
                backgroundColor: '#00D09C', // Neon Green
                borderRadius: 4,
                barThickness: 8,
            },
            {
                label: 'Outcome',
                data: serverData.expense,
                backgroundColor: '#E356FA', // Neon Purple
                borderRadius: 4,
                barThickness: 8,
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
                labels: { color: '#fff', usePointStyle: true, boxWidth: 6, font: { size: 10 } }
            },
            title: { display: false },
        },
        scales: {
            y: {
                display: false,
                beginAtZero: true
            },
            x: {
                ticks: { color: '#64748b', font: { size: 10 } },
                grid: { display: false },
                border: { display: false }
            }
        }
    };

    return <Bar options={options} data={chartData} />;
}

// 2. Expenses Line Graph (Spline) - Middle
export function OverviewChart({ data: serverData }: OverviewChartProps) {
    const chartData = {
        labels: serverData.labels,
        datasets: [
            {
                label: 'Expenses',
                data: serverData.expense,
                borderColor: '#E356FA', // Neon Purple
                backgroundColor: (context: any) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                    gradient.addColorStop(0, 'rgba(227, 86, 250, 0.5)');
                    gradient.addColorStop(1, 'rgba(227, 86, 250, 0)');
                    return gradient;
                },
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointRadius: 0,
                pointHoverRadius: 6,
                pointBackgroundColor: '#fff',
            }
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#fff',
                titleColor: '#000',
                bodyColor: '#000',
                displayColors: false,
                padding: 10,
                cornerRadius: 8,
                callbacks: {
                    label: (context: any) => `LKR ${context.parsed.y.toLocaleString()}`
                }
            }
        },
        scales: {
            y: { display: false },
            x: {
                ticks: { color: '#64748b' },
                grid: { display: false },
                border: { display: false }
            }
        }
    };

    return <Line options={options} data={chartData} />;
}

// 3. Utility Donut Chart
export function UtilityDonutChart() {
    // Mock data for breakdown
    const data = {
        labels: ['Utility', 'Entertainment', 'Groceries'],
        datasets: [
            {
                data: [1200, 800, 2000],
                backgroundColor: [
                    '#3b82f6', // Blue (Utility)
                    '#a855f7', // Purple (Entertainment)
                    '#10b981', // Green (Groceries)
                ],
                borderWidth: 0,
                cutout: '75%',
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
        }
    };

    return <Doughnut data={data} options={options} />;
}
