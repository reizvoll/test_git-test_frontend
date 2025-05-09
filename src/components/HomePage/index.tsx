'use client';

import { ActivityTable } from '@/components/ActivityTable';
import { Alert } from '@/components/Alert';
import { Header } from '@/components/Header';
import { SyncButton } from '@/components/SyncButton';
import { useActivities } from '@/lib/hooks/useActivities';
import { useAuthStore } from '@/lib/store/authStore';
import { useEffect } from 'react';
import styles from './styles.module.scss';

export const HomePage = () => {
    const { user, isPending } = useAuthStore();
    const { fetchActivities, syncActivities, isLoading, activities, alert, clearAlert } = useActivities();

    useEffect(() => {
        if (user) {
            fetchActivities();
        }
    }, [user, fetchActivities]);

    return (
        <div className={styles.container}>
            <Header />
            {alert && (
                <Alert
                    message={alert.message}
                    onClose={clearAlert}
                />
            )}
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
                        <div className={styles.buttonGroup}>
                            <SyncButton
                                onClick={syncActivities}
                                isSyncing={isLoading}
                                lastSyncTime={activities?.[0]?.createdAt ? new Date(activities[0].createdAt) : undefined}
                            />
                        </div>
                        <ActivityTable activities={activities} />
                    </div>
                )}

                <section className={styles.features}>
                    <div className={styles.feature}>
                        <h2>📊 Contribution Analytics</h2>
                        <p>Track your GitHub contributions with detailed statistics and period-based analysis.</p>
                    </div>
                    <div className={styles.feature}>
                        <h2>🔄 Real-time Updates</h2>
                        <p>Stay updated with your latest GitHub contributions through automatic synchronization.</p>
                    </div>
                    <div className={styles.feature}>
                        <h2>📈 Contribution History</h2>
                        <p>View your contribution history and track your progress over time.</p>
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