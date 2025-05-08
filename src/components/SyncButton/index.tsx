'use client';

import { SyncButtonProps } from '@/lib/types/button';
import { useEffect, useState } from 'react';
import styles from './styles.module.scss';

export const SyncButton = ({ onClick, isSyncing, lastSyncTime: initialLastSyncTime }: SyncButtonProps) => {
    const [timeAgo, setTimeAgo] = useState<string>('');
    const [lastSyncTime, setLastSyncTime] = useState<Date | null>(initialLastSyncTime || null);

    const calculateTimeAgo = (lastSyncTime: Date) => {
        const seconds = Math.floor((new Date().getTime() - lastSyncTime.getTime()) / 1000);
        
        if (seconds < 60) {
            return 'just now';
        } else if (seconds < 3600) {
            const minutes = Math.floor(seconds / 60);
            return `${minutes}m ago`;
        } else if (seconds < 86400) {
            const hours = Math.floor(seconds / 3600);
            return `${hours}h ago`;
        } else {
            const days = Math.floor(seconds / 86400);
            return `${days}d ago`;
        }
    };

    useEffect(() => {
        if (lastSyncTime) {
            setTimeAgo(calculateTimeAgo(lastSyncTime));
            const interval = setInterval(() => {
                setTimeAgo(calculateTimeAgo(lastSyncTime));
            }, 60000);
            return () => clearInterval(interval);
        }
    }, [lastSyncTime]);

    const handleClick = async () => {
        const now = new Date();
        setLastSyncTime(now);
        await onClick();
    };

    return (
        <button
            onClick={handleClick}
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