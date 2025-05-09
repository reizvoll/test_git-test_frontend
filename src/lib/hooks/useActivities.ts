import { githubApi } from '@/api/api';
import { useAuthStore } from '@/lib/store/authStore';
import { useCallback, useEffect, useState } from 'react';
import { ActivityStats, GitHubActivity } from '../types/api';

interface AlertState {
    message: string;
}

export const useActivities = () => {
    const { user } = useAuthStore();
    const [activities, setActivities] = useState<GitHubActivity[]>([]);
    const [stats, setStats] = useState<ActivityStats | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [alert, setAlert] = useState<AlertState | null>(null);

    const showAlert = useCallback((message: string) => {
        setAlert({ message });
        setTimeout(() => setAlert(null), 5000);
    }, []);

    // 자동 동기화 설정
    const setupAutoSync = useCallback(async () => {
        try {
            const response = await githubApi.setAutoSync(true);
            if (response.status === 429) {
                showAlert(response.data.data?.message || 'Too many requests. Please try again later.');
            }
        } catch (err: any) {
            if (err.response?.status === 429) {
                showAlert(err.response.data.message);
            } else {
                console.error('Failed to set auto sync:', err);
            }
        }
    }, [showAlert]);

    // 페이지 로드 시 자동 동기화 설정
    useEffect(() => {
        if (user) {
            setupAutoSync();
        }
    }, [user, setupAutoSync]);

    // GitHub 활동 내역 조회
    const fetchActivities = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await githubApi.getActivities();
            const activitiesData = response.data.data || response.data;

            if (!Array.isArray(activitiesData)) {
                console.error('Invalid response format:', activitiesData);
                setError('Invalid response format from server');
                return;
            }

            setActivities(activitiesData);
        } catch (err) {
            console.error('Failed to fetch activities:', err);
            setError(err instanceof Error ? err.message : 'Activity data fetching failed.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // GitHub 활동 동기화(최신화)
    const syncActivities = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await githubApi.syncActivities();
            if (response.status === 429) {
                showAlert(response.data.data?.message || 'Too many requests. Please try again later.');
                return;
            }

            if (response.data.success && response.data.data?.activities) {
                setActivities(response.data.data.activities);
            } else {
                await fetchActivities();
            }
        } catch (err: any) {
            if (err.response?.status === 429) {
                showAlert(err.response.data.message,);
            } else {
                console.error('Sync failed:', err);
                setError(err instanceof Error ? err.message : 'Sync failed.');
            }
        } finally {
            setIsLoading(false);
        }
    }, [fetchActivities, showAlert]);

    const fetchStats = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await githubApi.getStats();
            setStats(response.data.data || null);
        } catch (err) {
            console.error('Failed to fetch stats:', err);
            setError(err instanceof Error ? err.message : 'Statistics data fetching failed.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        activities,
        stats,
        isLoading,
        error,
        alert,
        clearAlert: () => setAlert(null),
        fetchActivities,
        fetchStats,
        syncActivities,
    };
};