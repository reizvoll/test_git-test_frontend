'use client';

import { useAnalyticsHandlers } from '@/lib/hooks/useAnalyticsHandlers';
import { formatDate, HISTORY_COL_SETTINGS, HistoryTableProps } from '@/lib/types/table';
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.min.css';
import { registerAllModules } from 'handsontable/registry';
import { useRef, useState } from 'react';
import styles from './styles.module.scss';

// Register all Handsontable modules
registerAllModules();

export const HistoryTable = ({
    analytics,
    isPending,
    error,
}: HistoryTableProps) => {
    const { period, selectedYear, handlePeriodChange, handleYearChange } = useAnalyticsHandlers();
    const hotRef = useRef<any>(null);
    const [currentSortOrder, setCurrentSortOrder] = useState<'asc' | 'desc' | null>(null);
    const [currentSortColumn, setCurrentSortColumn] = useState<number | null>(null);

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

    if (isPending) return <div className={styles.loading}>Loading...</div>;
    if (error) return <div className={styles.error}>{error}</div>;
    if (!analytics) return null;

    const data = analytics.timeline
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .map(item => ({
            type: 'Contribution',
            repository: 'GitHub',
            createdAt: formatDate(item.date),
            contributionCount: item.count,
        })) || [];

    return (
        <div className={styles.container}>
            <div className={styles.selectors}>
                <select value={period} onChange={handlePeriodChange}>
                    <option value="day">Today</option>
                    <option value="week">Week</option>
                    <option value="month">Month</option>
                    <option value="year">Year</option>
                    <option value="all">All</option>
                </select>
                {period === 'year' && analytics.availableYears && (
                    <select 
                        value={selectedYear} 
                        onChange={handleYearChange}
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
                    dataSchema={HISTORY_COL_SETTINGS.schema}
                    colHeaders={HISTORY_COL_SETTINGS.headers}
                    columns={HISTORY_COL_SETTINGS.columns}
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