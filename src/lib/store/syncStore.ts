import { SyncState } from '@/lib/types/store';
import { create } from 'zustand';

export const useSyncStore = create<SyncState>((set) => ({
    isSyncing: false,
    setSyncing: (syncing) => set({ isSyncing: syncing }),
    lastSyncTime: null,
    setLastSyncTime: (time) => set({ lastSyncTime: time }),
})); 