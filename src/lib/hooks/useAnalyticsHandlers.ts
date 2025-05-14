import { useAnalyticsStore } from '@/lib/store/analyticsStore';
import { ChangeEvent } from 'react';

export const useAnalyticsHandlers = () => {
    const { period, selectedYear, setPeriod, setSelectedYear, fetchAnalytics } = useAnalyticsStore();

    const handlePeriodChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const newPeriod = e.target.value as 'day' | 'week' | 'month' | 'year' | 'all';
        setPeriod(newPeriod);
        if (newPeriod === 'year') {
            fetchAnalytics({ period: newPeriod, year: selectedYear });
        } else {
            fetchAnalytics({ period: newPeriod });
        }
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