'use client';

import { useActivities } from '@/lib/hooks/useActivities';
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.min.css';
import { registerAllModules } from 'handsontable/registry';
import { useEffect, useRef, useState } from 'react';
import styles from './styles.module.scss';

// Register all Handsontable modules
registerAllModules();

const ACTIVITY_COL_SETTINGS = {
    headers: ['Type', 'Repository', 'Date', 'Title'],
    columns: [
        { data: 'type', type: 'text' },
        { data: 'repository', type: 'text' },
        { data: 'createdAt', type: 'text' },
        { data: 'title', type: 'text' }
    ],
    schema: {
        type: null,
        repository: null,
        createdAt: null,
        title: null
    }
};

const formatDate = (dateString: string | Date): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', { 
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

export const HistoryTable = () => {
    const { activities, fetchActivities, fetchAnalytics, analytics, isLoading, error } = useActivities();
    const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'year' | 'all'>('week');
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const hotRef = useRef<any>(null);
    const [currentSortOrder, setCurrentSortOrder] = useState<'asc' | 'desc' | null>(null);
    const [currentSortColumn, setCurrentSortColumn] = useState<number | null>(null);

    useEffect(() => {
        const params: { period: typeof period; year?: number; type?: string } = { 
            period,
            type: 'contribution'
        };
        
        if (period === 'year') {
            params.year = selectedYear;
        }
        
        fetchActivities(params);
        fetchAnalytics(params);
    }, [period, selectedYear, fetchActivities, fetchAnalytics]);

    const handleBeforeColumnSort = (currentSortConfig: any, destinationSortConfigs: any[]) => {
        if (destinationSortConfigs.length > 0) {
            const clickedColumn = destinationSortConfigs[0].column;

            if (clickedColumn === currentSortColumn) {
                destinationSortConfigs[0].sortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
            } else {
                destinationSortConfigs[0].sortOrder = 'asc';
            }
        }

        setCurrentSortOrder(destinationSortConfigs[0]?.sortOrder || null);
        setCurrentSortColumn(destinationSortConfigs[0]?.column || null);
        return true;
    };

    if (isLoading) return <div className={styles.loading}>Loading...</div>;
    if (error) return <div className={styles.error}>{error}</div>;

    const data = activities?.map(activity => ({
        type: activity.type,
        repository: activity.repository,
        createdAt: formatDate(activity.createdAt),
        title: activity.title,
    })) || [];

    return (
        <div className={styles.container}>
            <div className={styles.selectors}>
                <select value={period} onChange={(e) => setPeriod(e.target.value as any)}>
                    <option value="day">Today</option>
                    <option value="week">Week</option>
                    <option value="month">Month</option>
                    <option value="year">Year</option>
                    <option value="all">All</option>
                </select>
                {period === 'year' && analytics?.availableYears && (
                    <select 
                        value={selectedYear} 
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                    >
                        {analytics.availableYears.map(year => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                )}
            </div>
            <div className={styles.tableContainer}>
                <HotTable
                    data={data}
                    ref={hotRef}
                    dataSchema={ACTIVITY_COL_SETTINGS.schema}
                    colHeaders={ACTIVITY_COL_SETTINGS.headers}
                    columns={ACTIVITY_COL_SETTINGS.columns}
                    rowHeaders={true}
                    contextMenu={true}
                    manualColumnResize={true}
                    filters={true}
                    dropdownMenu={[
                        'alignment',
                        'filter_by_condition',
                        'filter_by_value',
                        'filter_action_bar',
                    ]}
                    columnSorting={{
                        indicator: true,
                        sortEmptyCells: true,
                        headerAction: true,
                    }}
                    autoWrapRow={true}
                    autoWrapCol={true}
                    outsideClickDeselects={false}
                    width="100%"
                    height="auto"
                    stretchH="all"
                    licenseKey="non-commercial-and-evaluation"
                    beforeColumnSort={handleBeforeColumnSort}
                />
            </div>
        </div>
    );
}; 