import { GitHubActivity } from '@/lib/types/api';
import { useState } from 'react';

interface UseActivityFiltersProps {
    activities: GitHubActivity[] | undefined;
}

interface UseActivityFiltersReturn {
    selectedType: string;
    selectedPeriod: string;
    selectedYear: string;
    selectedRepository: string;
    setSelectedType: (type: string) => void;
    setSelectedPeriod: (period: string) => void;
    setSelectedYear: (year: string) => void;
    setSelectedRepository: (repository: string) => void;
    filteredActivities: GitHubActivity[];
    availableYears: number[];
    availableRepositories: string[];
}

export const useActivityFilters = ({ activities }: UseActivityFiltersProps): UseActivityFiltersReturn => {
    const [selectedType, setSelectedType] = useState<string>('all');
    const [selectedPeriod, setSelectedPeriod] = useState<string>('day');
    const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
    const [selectedRepository, setSelectedRepository] = useState<string>('all');

    const getAvailableYears = () => {
        if (!activities) return [];
        const years = new Set(activities.map(activity => 
            new Date(activity.createdAt).getFullYear()
        ));
        return Array.from(years).sort((a, b) => b - a);
    };

    const getAvailableRepositories = () => {
        if (!activities) return [];
        const repositories = new Set(activities.map(activity => activity.repository));
        return Array.from(repositories).sort();
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

    const typeFilteredActivities = activities?.filter(activity => {
        if (selectedType === 'all') return true;
        if (selectedType === 'contribution') return activity.type === 'Contribution';
        if (selectedType === 'commit') return activity.type === 'Commit';
        if (selectedType === 'pull_request') return activity.type === 'PullRequest';
        return true;
    }) || [];

    const repositoryFilteredActivities = selectedRepository === 'all' 
        ? typeFilteredActivities 
        : typeFilteredActivities.filter(activity => activity.repository === selectedRepository);

    const filteredActivities = filterActivitiesByPeriod(repositoryFilteredActivities, selectedPeriod);

    return {
        selectedType,
        selectedPeriod,
        selectedYear,
        selectedRepository,
        setSelectedType,
        setSelectedPeriod,
        setSelectedYear,
        setSelectedRepository,
        filteredActivities,
        availableYears: getAvailableYears(),
        availableRepositories: getAvailableRepositories(),
    };
}; 