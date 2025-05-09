import { API } from '@/api/api';
import { useCallback, useState } from 'react';
import { ActivityStats, GitHubActivity } from '../types/api';

export const useActivities = () => {
    const [activities, setActivities] = useState<GitHubActivity[]>([]);
    const [stats, setStats] = useState<ActivityStats | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // GitHub 활동 내역 조회
    const fetchActivities = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await API.get('/api/activities');
            console.log('Full API Response:', response);
            console.log('Response Data:', response.data);
            console.log('Response Data Type:', typeof response.data);
            console.log('Is Array?', Array.isArray(response.data));

            // response.data.data가 있는지 확인
            const activitiesData = response.data.data || response.data;
            console.log('Activities Data:', activitiesData);

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
            // 1. 동기화 요청
            const syncResponse = await API.post('/api/activities/sync');
            console.log('Sync API Response:', syncResponse.data);

            // 2. 동기화 성공 후 활동 내역 새로고침
            await fetchActivities();
        } catch (err) {
            console.error('Sync failed:', err);
            setError(err instanceof Error ? err.message : 'Sync failed.');
        } finally {
            setIsLoading(false);
        }
    }, [fetchActivities]);

    const fetchStats = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await API.get('/api/users/stats');
            console.log('Stats API Response:', response.data);
            setStats(response.data.data || null);
        } catch (err) {
            console.error('Failed to fetch stats:', err);
            setError(err instanceof Error ? err.message : 'Statistics data fetching failed.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const deleteActivities = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            await API.delete('/api/activities');
            setActivities([]); // Clear activities after successful deletion
        } catch (err) {
            console.error('Failed to delete activities:', err);
            setError(err instanceof Error ? err.message : 'Failed to delete activities.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        activities,
        stats,
        isLoading,
        error,
        fetchActivities,
        fetchStats,
        syncActivities,
        deleteActivities,
    };
};