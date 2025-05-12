import { useAnalyticsStore } from '@/lib/store/analyticsStore';
import { ChangeEvent } from 'react';

export const useAnalyticsHandlers = () => {
    const { period, selectedYear, setPeriod, setSelectedYear, fetchAnalytics } = useAnalyticsStore();

    const handlePeriodChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const newPeriod = e.target.value as 'day' | 'week' | 'month' | 'year' | 'all';
        setPeriod(newPeriod);
        const params: { period: typeof newPeriod; year?: number } = { period: newPeriod };
        if (newPeriod === 'year') {
            params.year = selectedYear;
        }
        fetchAnalytics(params);
    };

    const handleYearChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const newYear = Number(e.target.value);
        setSelectedYear(newYear);
        fetchAnalytics({ period, year: newYear });
    };

    return {
        period,
        selectedYear,
        handlePeriodChange,
        handleYearChange
    };
}; 