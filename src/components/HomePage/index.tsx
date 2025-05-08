'use client';

import { ActivityTable } from '@/components/ActivityTable';
import { Header } from '@/components/Header';
import { SyncButton } from '@/components/SyncButton';
import { useActivities } from '@/lib/hooks/useActivities';
import { useAuthStore } from '@/lib/store/authStore';
import { useEffect } from 'react';
import styles from './styles.module.scss';

export const HomePage = () => {
    const { user, isPending } = useAuthStore();
    const { fetchActivities, syncActivities, isLoading, activities } = useActivities();

    useEffect(() => {
        if (user) {
            fetchActivities();
        }
    }, [user, fetchActivities]);

    return (
        <div className={styles.container}>
            <Header />
            <main className={styles.main}>
                <section className={styles.hero}>
                    <h1>Track Your GitHub Activities</h1>
                    <p className={styles.subtitle}>
                        Monitor your GitHub contributions, analyze your coding patterns, and improve your development workflow.
                    </p>
                </section>

                {isPending ? (
                    <div>Loading...</div>
                ) : user && (
                    <div className={styles.actions}>
                        <SyncButton
                            onClick={syncActivities}
                            isSyncing={isLoading}
                            lastSyncTime={activities?.[0]?.createdAt ? new Date(activities[0].createdAt) : undefined}
                        />
                        <ActivityTable activities={activities} />
                    </div>
                )}

                <section className={styles.features}>
                    <div className={styles.feature}>
                        <h2>📊 Activity Analytics</h2>
                        <p>Get detailed insights into your GitHub activities and contribution patterns.</p>
                    </div>
                    <div className={styles.feature}>
                        <h2>🔄 Real-time Updates</h2>
                        <p>Stay updated with your latest GitHub activities in real-time.</p>
                    </div>
                    <div className={styles.feature}>
                        <h2>📈 Progress Tracking</h2>
                        <p>Track your progress and set goals for your GitHub contributions.</p>
                    </div>
                </section>

                {!user && (
                    <section className={styles.cta}>
                        <h2>Ready to get started?</h2>
                        <p>Sign in with your GitHub account to begin tracking your activities.</p>
                    </section>
                )}
            </main>
        </div>
    );
}; 