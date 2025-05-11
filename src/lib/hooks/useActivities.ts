import { githubApi } from '@/api/api';
import { useAuthStore } from '@/lib/store/authStore';
import { useCallback, useEffect, useState } from 'react';
import { ActivityStats, AnalyticsData, GitHubActivity } from '../types/api';

interface AlertState {
    message: string;
}

export const useActivities = () => {
    const { user } = useAuthStore();
    const [activities, setActivities] = useState<GitHubActivity[]>([]);
    const [selectedActivity, setSelectedActivity] = useState<GitHubActivity | null>(null);
    const [stats, setStats] = useState<ActivityStats | null>(null);
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
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
    const fetchActivities = useCallback(async (params?: { 
        period?: 'day' | 'week' | 'month' | 'year' | 'all';
        year?: number;
        type?: 'contribution' | 'commit' | 'pull_request';
        repository?: string;
    }) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await githubApi.getActivities(params);
            const activitiesData = response.data.data || response.data;

            if (!Array.isArray(activitiesData)) {
                console.error('Invalid response format:', activitiesData);
                setError('Invalid response format from server');
                return;
            }

            // 데이터 필터링
            let filteredActivities = activitiesData;
            
            // type 필터링
            if (params?.type === 'contribution') {
                filteredActivities = filteredActivities.filter(activity => 
                    activity.type === 'Contribution'
                );
            }

            // year 필터링 (period가 year일 때)
            if (params?.period === 'year' && params?.year) {
                filteredActivities = filteredActivities.filter(activity => {
                    const activityYear = new Date(activity.createdAt).getFullYear();
                    return activityYear === params.year;
                });
            }

            setActivities(filteredActivities);
        } catch (err) {
            console.error('Failed to fetch activities:', err);
            setError(err instanceof Error ? err.message : 'Activity data fetching failed.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // 활동 상세 조회
    const fetchActivityById = useCallback(async (id: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await githubApi.getActivityById(id);
            if (response.data.success && response.data.data) {
                setSelectedActivity(response.data.data);
            } else {
                setError('Activity not found');
            }
        } catch (err) {
            console.error('Failed to fetch activity details:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch activity details');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchStats = useCallback(async (params?: { period?: 'day' | 'week' | 'month' | 'year' }) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await githubApi.getStats(params);
            setStats(response.data.data || null);
        } catch (err) {
            console.error('Failed to fetch stats:', err);
            setError(err instanceof Error ? err.message : 'Statistics data fetching failed.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // 활동 분석 데이터 조회
    const fetchAnalytics = useCallback(async (params?: { period?: 'day' | 'week' | 'month' | 'year' | 'all' }) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await githubApi.getAnalytics(params);
            
            // 응답 데이터 구조 확인 및 변환
            if (response.data) {
                // ApiResponse 형태인 경우
                if ('success' in response.data) {
                    if (response.data.success && response.data.data) {
                        setAnalytics(response.data.data as AnalyticsData);
                        return;
                    }
                }
                // 직접 데이터 형태인 경우
                if ('timeline' in response.data && 'repositoryDistribution' in response.data && 'timePattern' in response.data) {
                    setAnalytics(response.data as AnalyticsData);
                    return;
                }
            }
            
            setError('Failed to fetch analytics data');
        } catch (err) {
            console.error('Failed to fetch analytics:', err);
            setError(err instanceof Error ? err.message : 'Analytics data fetching failed');
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

    return {
        activities,
        selectedActivity,
        stats,
        analytics,
        isLoading,
        error,
        alert,
        clearAlert: () => setAlert(null),
        fetchActivities,
        fetchActivityById,
        fetchStats,
        fetchAnalytics,
        syncActivities,
    };
};