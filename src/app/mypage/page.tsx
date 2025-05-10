'use client';

import { AnalyticsChart } from '@/components/AnalyticsChart';
import { Header } from '@/components/Header';
import { HistoryTable } from '@/components/HistoryTable';
import { useAnalyticsStore } from '@/lib/store/analyticsStore';
import styles from './styles.module.scss';

export default function MyPage() {
  const { analytics, isPending, error } = useAnalyticsStore();

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <section className={styles.section}>
          <h2>📊 Contribution Analytics</h2>
          <AnalyticsChart 
            analytics={analytics}
            isPending={isPending}
            error={error}
          />
        </section>

        <section className={styles.section}>
          <h2>📈 Contribution History</h2>
          <HistoryTable 
            analytics={analytics}
            isPending={isPending}
            error={error}
          />
        </section>
      </main>
    </div>
  );
} 