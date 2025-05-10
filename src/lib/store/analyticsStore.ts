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
      
      if (response.data) {
        if ('success' in response.data) {
          if (response.data.success && response.data.data) {
            set({ analytics: response.data.data as AnalyticsData });
            return;
          }
        }

        if ('timeline' in response.data && 'repositoryDistribution' in response.data && 'timePattern' in response.data) {
          set({ analytics: response.data as AnalyticsData });
          return;
        }
      }
      
      set({ error: 'Failed to fetch analytics data' });
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
      set({ error: err instanceof Error ? err.message : 'Analytics data fetching failed' });
    } finally {
      set({ isPending: false });
    }
  },
})); 