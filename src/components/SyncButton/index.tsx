'use client';

import { SyncButtonProps } from '@/lib/types/button';
import { useEffect, useState } from 'react';
import styles from './styles.module.scss';

export const SyncButton = ({ onClick, isSyncing, lastSyncTime }: SyncButtonProps) => {
    const [timeAgo, setTimeAgo] = useState<string>('');

    useEffect(() => {
        if (lastSyncTime) {
            const updateTimeAgo = () => {
                const seconds = Math.floor((new Date().getTime() - lastSyncTime.getTime()) / 1000);
                
                if (seconds < 60) {
                    setTimeAgo('just now');
                } else if (seconds < 3600) {
                    const minutes = Math.floor(seconds / 60);
                    setTimeAgo(`${minutes}m ago`);
                } else if (seconds < 86400) {
                    const hours = Math.floor(seconds / 3600);
                    setTimeAgo(`${hours}h ago`);
                } else {
                    const days = Math.floor(seconds / 86400);
                    setTimeAgo(`${days}d ago`);
                }
            };

            updateTimeAgo();
            const interval = setInterval(updateTimeAgo, 60000);
            return () => clearInterval(interval);
        }
    }, [lastSyncTime]);

    return (
        <button
            onClick={onClick}
            disabled={isSyncing}
            className={`${styles.syncButton} ${isSyncing ? styles.syncing : ''}`}
        >
            {isSyncing ? (
                <>
                    <span className={styles.spinner}></span>
                    Syncing...
                </>
            ) : (
                <>
                    <span className={styles.icon}>🔄</span>
                    Sync Now
                    {lastSyncTime && <span className={styles.timeAgo}>{timeAgo}</span>}
                </>
            )}
        </button>
    );
}; 