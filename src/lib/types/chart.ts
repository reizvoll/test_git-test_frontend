import { Dispatch, SetStateAction } from 'react';
import type { AnalyticsData } from "./api";

export const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

export interface AnalyticsChartProps {
    analytics: AnalyticsData | null;
    isPending: boolean;
    error: string | null;
    period: 'day' | 'week' | 'month' | 'year' | 'all';
    selectedYear: number;
    onPeriodChange: Dispatch<SetStateAction<'day' | 'week' | 'month' | 'year' | 'all'>>;
    onYearChange: Dispatch<SetStateAction<number>>;
}