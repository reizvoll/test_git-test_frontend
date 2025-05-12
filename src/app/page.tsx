'use client';

import { ActivityTable } from '@/components/ActivityTable';
import { Alert } from '@/components/Alert';
import { Header } from '@/components/Header';
import { SyncButton } from '@/components/SyncButton';
import { useActivities } from '@/lib/hooks/useActivities';
import { useActivityFilters } from '@/lib/hooks/useActivityFilters';
import { useAuthStore } from '@/lib/store/authStore';
import { useEffect } from 'react';
import styles from './styles.module.scss';
import { LoadingSpinner } from '@/components/LoadingSpinner';

const Home = () => {
    const { user, isPending } = useAuthStore();
    const { fetchActivities, syncActivities, isLoading, activities, alert, clearAlert } = useActivities();
    const {
        selectedType,
        selectedPeriod,
        selectedYear,
        selectedRepository,
        setSelectedType,
        setSelectedPeriod,
        setSelectedYear,
        setSelectedRepository,
        filteredActivities,
        availableYears,
        availableRepositories,
    } = useActivityFilters({ activities });

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
                    <div className={styles.loadingContainer}>
                        <LoadingSpinner size="lg" />
                    </div>
                ) : user && (
                    <div className={styles.actions}>
                        <div className={styles.buttonGroup}>
                            <select 
                                value={selectedType} 
                                onChange={(e) => setSelectedType(e.target.value)}
                                className={styles.typeSelector}
                            >
                                <option value="all">All Activities</option>
                                <option value="contribution">Contributions</option>
                                <option value="commit">Commits</option>
                                <option value="pull_request">Pull Requests</option>
                            </select>
                            <select 
                                value={selectedPeriod} 
                                onChange={(e) => setSelectedPeriod(e.target.value)}
                                className={styles.periodSelector}
                            >
                                <option value="all">All</option>
                                <option value="day">Today</option>
                                <option value="week">Week</option>
                                <option value="month">Month</option>
                                <option value="year">Year</option>
                            </select>
                            {selectedPeriod === 'year' && (
                                <select
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                    className={styles.yearSelector}
                                >
                                    {availableYears.map(year => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    ))}
                                </select>
                            )}
                            <select
                                value={selectedRepository}
                                onChange={(e) => setSelectedRepository(e.target.value)}
                                className={styles.repositorySelector}
                            >
                                <option value="all">All Repositories</option>
                                {availableRepositories.map(repo => (
                                    <option key={repo} value={repo}>
                                        {repo}
                                    </option>
                                ))}
                            </select>
                            <SyncButton
                                onClick={syncActivities}
                                isSyncing={isLoading}
                                lastSyncTime={activities?.[0]?.createdAt ? new Date(activities[0].createdAt) : undefined}
                            />
                        </div>
                        <ActivityTable activities={filteredActivities} />
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

export default Home;