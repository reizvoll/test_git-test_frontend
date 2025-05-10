'use client';

import { useActivities } from '@/lib/hooks/useActivities';
import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from 'chart.js';
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import styles from './styles.module.scss';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
};

export const AnalyticsChart = () => {
    const { analytics, fetchAnalytics, isLoading, error } = useActivities();
    const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'year' | 'all'>('week');
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

    useEffect(() => {
        const params: { period: typeof period; year?: number } = { period };
        
        if (period === 'year') {
            params.year = selectedYear;
        }
        
        fetchAnalytics(params);
    }, [period, selectedYear, fetchAnalytics]);

    if (isLoading) return <div className={styles.loading}>Loading...</div>;
    if (error) return <div className={styles.error}>{error}</div>;
    if (!analytics) return null;

    const timelineData = {
        labels: analytics.timeline.map(item => formatDate(item.date)),
        datasets: [
            {
                label: 'Contributions',
                data: analytics.timeline.map(item => item.count),
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
                fill: true,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'GitHub Contribution Analytics',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                },
            },
        },
    };

    return (
        <div className={styles.container}>
            <div className={styles.selectors}>
                <select value={period} onChange={(e) => setPeriod(e.target.value as any)}>
                    <option value="day">Today</option>
                    <option value="week">Week</option>
                    <option value="month">Month</option>
                    <option value="year">Year</option>
                    <option value="all">All</option>
                </select>
                {period === 'year' && analytics.availableYears && (
                    <select 
                        value={selectedYear} 
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                    >
                        {analytics.availableYears.map(year => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                )}
            </div>
            <div className={styles.charts}>
                <div className={styles.chart}>
                    <h3>Contribution Timeline</h3>
                    <Line data={timelineData} options={chartOptions} />
                </div>
            </div>
        </div>
    );
}; 