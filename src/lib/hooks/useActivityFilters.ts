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
        
        // Filter activities by type first if a specific type is selected
        const typeFilteredActivities = selectedType === 'all' 
            ? activities 
            : activities.filter(activity => activity.type.toLowerCase() === selectedType.toLowerCase());
        
        // Then get unique repositories from the filtered activities
        const repositories = new Set(typeFilteredActivities.map(activity => activity.repository));
        return Array.from(repositories).sort();
    };

    // When type changes, we may need to reset the repository selection
    // if the currently selected repository is not available in the new type filter
    const setSelectedTypeAndUpdateRepo = (type: string) => {
        setSelectedType(type);
        
        // Only need to check if a specific repository is selected
        if (selectedRepository !== 'all') {
            // Filter activities by the new type
            const filteredActivitiesByNewType = type === 'all'
                ? activities || []
                : (activities || []).filter(activity => activity.type.toLowerCase() === type.toLowerCase());
            
            // Get repositories available for the new type
            const reposForNewType = new Set(filteredActivitiesByNewType.map(activity => activity.repository));
            
            // If current repository is not available in the new type filter, reset to 'all'
            if (!reposForNewType.has(selectedRepository)) {
                setSelectedRepository('all');
            }
        }
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
        selectedType === 'all' ? true : activity.type.toLowerCase() === selectedType.toLowerCase()
    ) || [];

    const repositoryFilteredActivities = selectedRepository === 'all' 
        ? typeFilteredActivities 
        : typeFilteredActivities.filter(activity => activity.repository === selectedRepository);

    const filteredActivities = filterActivitiesByPeriod(repositoryFilteredActivities, selectedPeriod);

    return {
        selectedType,
        selectedPeriod,
        selectedYear,
        selectedRepository,
        setSelectedType: setSelectedTypeAndUpdateRepo,
        setSelectedPeriod,
        setSelectedYear,
        setSelectedRepository,
        filteredActivities,
        availableYears: getAvailableYears(),
        availableRepositories: getAvailableRepositories(),
    };
}; 