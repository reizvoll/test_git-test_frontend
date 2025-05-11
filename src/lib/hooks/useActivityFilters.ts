import { GitHubActivity } from '@/lib/types/api';
import { useState } from 'react';

interface UseActivityFiltersProps {
    activities: GitHubActivity[] | undefined;
}

interface UseActivityFiltersReturn {
    selectedType: string;
    selectedPeriod: string;
    selectedYear: string;
    setSelectedType: (type: string) => void;
    setSelectedPeriod: (period: string) => void;
    setSelectedYear: (year: string) => void;
    filteredActivities: GitHubActivity[];
    availableYears: number[];
}

export const useActivityFilters = ({ activities }: UseActivityFiltersProps): UseActivityFiltersReturn => {
    const [selectedType, setSelectedType] = useState<string>('all');
    const [selectedPeriod, setSelectedPeriod] = useState<string>('day');
    const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());

    const getAvailableYears = () => {
        if (!activities) return [];
        const years = new Set(activities.map(activity => 
            new Date(activity.createdAt).getFullYear()
        ));
        return Array.from(years).sort((a, b) => b - a);
    };

    const filterActivitiesByPeriod = (activities: GitHubActivity[], period: string) => {
        if (period === 'all') return activities;
        
        const now = new Date();
        const periodStart = new Date();
        
        switch (period) {
            case 'day':
                periodStart.setHours(0, 0, 0, 0);
                break;
            case 'week':
                periodStart.setDate(now.getDate() - 7);
                break;
            case 'month':
                periodStart.setMonth(now.getMonth() - 1);
                break;
            case 'year':
                periodStart.setFullYear(parseInt(selectedYear));
                periodStart.setMonth(0, 1);
                const periodEnd = new Date(periodStart);
                periodEnd.setFullYear(parseInt(selectedYear) + 1);
                return activities.filter(activity => {
                    const activityDate = new Date(activity.createdAt);
                    return activityDate >= periodStart && activityDate < periodEnd;
                });
            default:
                return activities;
        }
        
        return activities.filter(activity => 
            new Date(activity.createdAt) >= periodStart
        );
    };

    const typeFilteredActivities = activities?.filter(activity => 
        selectedType === 'all' ? true : activity.type === selectedType
    ) || [];

    const filteredActivities = filterActivitiesByPeriod(typeFilteredActivities, selectedPeriod);

    return {
        selectedType,
        selectedPeriod,
        selectedYear,
        setSelectedType,
        setSelectedPeriod,
        setSelectedYear,
        filteredActivities,
        availableYears: getAvailableYears(),
    };
}; 