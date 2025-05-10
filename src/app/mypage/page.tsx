'use client';

import { AnalyticsChart } from '@/components/AnalyticsChart';
import { Header } from '@/components/Header';
import { HistoryTable } from '@/components/HistoryTable';
import styles from './styles.module.scss';

export default function MyPage() {
  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <section className={styles.section}>
          <h2>📊 Contribution Analytics</h2>
          <AnalyticsChart />
        </section>

        <section className={styles.section}>
          <h2>📈 Contribution History</h2>
          <HistoryTable />
        </section>
      </main>
    </div>
  );
} 