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
        income: number[];
        expense: number[];
    }
}

export function OverviewChart({ data: serverData }: OverviewChartProps) {
    const { theme } = useTheme();

    const chartData = {
        labels: serverData.labels,
        datasets: [
            {
                label: 'Income',
                data: serverData.income,
                backgroundColor: 'rgba(0, 242, 255, 0.2)', // Neon Cyan
                borderColor: '#00f2ff',
                borderWidth: 2,
                tension: 0.4, // Smooth curves like the reference image
                fill: true,
            },
            {
                label: 'Expense',
                data: serverData.expense,
                backgroundColor: 'rgba(189, 0, 255, 0.2)', // Neon Purple
                borderColor: '#bd00ff',
                borderWidth: 2,
                tension: 0.4,
                fill: true,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    color: '#e0fcfd', // Always light text
                    font: {
                        family: 'system-ui',
                        size: 12
                    }
                }
            },
            title: {
                display: false,
            },
        },
        scales: {
            y: {
                ticks: { color: '#94a3b8' },
                grid: { color: 'rgba(255,255,255,0.05)' },
                border: { display: false }
            },
            x: {
                ticks: { color: '#94a3b8' },
                grid: { display: false },
                border: { display: false }
            }
        }
    };

    return <Line options={options} data={chartData} />;

}
