'use client';

import { ACTIVITY_COL_SETTINGS, formatDate } from '@/lib/types/activity';
import { GitHubActivity } from '@/lib/types/api';
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.min.css';
import { registerAllModules } from 'handsontable/registry';
import { useRef, useState } from 'react';
import styles from './styles.module.scss';

// register Handsontable's modules
registerAllModules();

interface ActivityTableProps {
    activities: GitHubActivity[];
}

export const ActivityTable = ({ activities }: ActivityTableProps) => {
    const hotRef = useRef<any>(null);
    const [currentSortOrder, setCurrentSortOrder] = useState<'asc' | 'desc' | null>(null);
    const [currentSortColumn, setCurrentSortColumn] = useState<number | null>(null);

    const data = activities?.map(activity => ({
        type: activity.type,
        repository: activity.repository,
        createdAt: formatDate(activity.createdAt),
        title: activity.title,
    })) || [];

    const handleBeforeColumnSort = (currentSortConfig: any, destinationSortConfigs: any[]) => {
        if (destinationSortConfigs.length > 0) {
            const clickedColumn = destinationSortConfigs[0].column;

            // Same column clicked
            if (clickedColumn === currentSortColumn) {
                destinationSortConfigs[0].sortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
            } else {
                // Different column clicked, start with 'asc'
                destinationSortConfigs[0].sortOrder = 'asc';
            }
        }

        // Enable client-side sorting
        setCurrentSortOrder(destinationSortConfigs[0]?.sortOrder || null);
        setCurrentSortColumn(destinationSortConfigs[0]?.column || null);
        return true; // Enable internal sorting logic
    };

    return (
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
    );
}; 