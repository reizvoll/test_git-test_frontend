'use client';

import { useAnalyticsHandlers } from '@/lib/hooks/useAnalyticsHandlers';
import { AnalyticsChartProps, formatDate } from '@/lib/types/chart';
import {
    CategoryScale,
    Chart as ChartJS,
    Filler,
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
    Legend,
    Filler
);

export const AnalyticsChart = ({
    analytics,
    isPending,
    error,
}: Omit<AnalyticsChartProps, 'period' | 'selectedYear' | 'onPeriodChange' | 'onYearChange'>) => {
    const { period, selectedYear, handlePeriodChange, handleYearChange } = useAnalyticsHandlers();

    // Responsive font size and chart height
    const [fontSize, setFontSize] = useState(14);
    const [chartHeight, setChartHeight] = useState(240);
    
    useEffect(() => {
        const handleResize = () => {
            const isMobile = window.innerWidth <= 480;
            setFontSize(isMobile ? 10 : 14);
            setChartHeight(isMobile ? 180 : 240);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (isPending) return <div className={styles.loading}>Loading...</div>;
    if (error) return <div className={styles.error}>{error}</div>;
    if (!analytics) return null;

    const sortedTimeline = [...analytics.timeline].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const timelineData = {
        labels: sortedTimeline.map(item => formatDate(item.date)),
        datasets: [
            {
                label: 'Contributions',
                data: sortedTimeline.map(item => item.count),
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
                fill: true,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    font: {
                        size: fontSize
                    }
                }
            },
            title: {
                display: true,
                text: 'GitHub Contribution Analytics',
                font: {
                    size: fontSize + 2
                }
            },
        },
        scales: {
            x: {
                ticks: {
                    font: {
                        size: fontSize - 2
                    },
                    maxRotation: 45,
                    minRotation: 0,
                }
            },
            y: {
                ticks: {
                    font: {
                        size: fontSize - 2
                    }
                }
            }
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.selectors}>
                <select value={period} onChange={handlePeriodChange}>
                    <option value="day">Today</option>
                    <option value="week">Week</option>
                    <option value="month">Month</option>
                    <option value="year">Year</option>
                    <option value="all">All</option>
                </select>
                {period === 'year' && analytics.availableYears && (
                    <select 
                        value={selectedYear} 
                        onChange={handleYearChange}
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
                    <div style={{width: '100%', height: chartHeight}}>
                        <Line data={timelineData} options={chartOptions} />
                    </div>
                </div>
            </div>
        </div>
    );
}; 