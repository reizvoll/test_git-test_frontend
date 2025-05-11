import { githubApi } from '@/api/api';
import { Dispatch, SetStateAction } from 'react';
import { create } from 'zustand';
import { AnalyticsData } from '../types/api';

interface AnalyticsState {
  // UI State
  period: 'day' | 'week' | 'month' | 'year' | 'all';
  selectedYear: number;
  setPeriod: Dispatch<SetStateAction<'day' | 'week' | 'month' | 'year' | 'all'>>;
  setSelectedYear: Dispatch<SetStateAction<number>>;

  // Data State
  analytics: AnalyticsData | null;
  isPending: boolean;
  error: string | null;

  // Actions
  fetchAnalytics: (params?: { period?: 'day' | 'week' | 'month' | 'year' | 'all'; year?: number }) => Promise<void>;
}

export const useAnalyticsStore = create<AnalyticsState>((set, get) => ({
  // UI State
  period: 'week',
  selectedYear: new Date().getFullYear(),
  setPeriod: (period) => set((state) => ({ 
    period: typeof period === 'function' ? period(state.period) : period 
  })),
  setSelectedYear: (year) => set((state) => ({ 
    selectedYear: typeof year === 'function' ? year(state.selectedYear) : year 
  })),

  // Data State
  analytics: null,
  isPending: false,
  error: null,

  // Actions
  fetchAnalytics: async (params) => {
    set({ isPending: true, error: null });

    try {
      const response = await githubApi.getAnalytics(params);
      
      if (!response.data) {
        set({ error: 'No data received from server' });
        return;
      }

      // Check for error response
      if ('error' in response.data) {
        set({ error: response.data.error?.message || 'Unknown error occurred' });
        return;
      }

      // Handle success response with data
      if ('success' in response.data && response.data.success && response.data.data) {
        const analyticsData = response.data.data;
        if (isValidAnalyticsData(analyticsData)) {
          set({ analytics: analyticsData });
          return;
        }
      }

      // Handle direct data response
      if (isValidAnalyticsData(response.data)) {
        set({ analytics: response.data });
        return;
      }
      
      set({ error: 'Invalid analytics data format received' });
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
      set({ error: err instanceof Error ? err.message : 'Analytics data fetching failed' });
    } finally {
      set({ isPending: false });
    }
  },
}));

const isValidAnalyticsData = (data: any): data is AnalyticsData => {
  return (
    data &&
    Array.isArray(data.timeline) &&
    Array.isArray(data.repositoryDistribution) &&
    Array.isArray(data.timePattern) &&
    Array.isArray(data.availableYears) &&
    data.timeline.every((item: any) => 
      typeof item.date === 'string' && 
      typeof item.count === 'number'
    )
  );
}; 