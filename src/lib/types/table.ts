import type { AnalyticsData } from "./api";

export const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Seoul'
    });
};

// For ActivityTable types
export interface Activity {
    type: string;
    repository: string;
    createdAt: string;
    title: string;
}

export interface ActivityResponse {
    activities: Activity[];
} 

export const ACTIVITY_COL_SETTINGS = {
    schema: {
        type: null,
        repository: null,
        createdAt: null,
        title: null,
    },
    headers: ['Type', 'Repository', 'Created At', 'Description'],
    columns: [
        { data: 'type', readOnly: true },
        { data: 'repository', readOnly: true },
        { data: 'createdAt', readOnly: true },
        { data: 'title', readOnly: true },
    ]
};

// For HistoryTable types
export interface HistoryTableProps {
    analytics: AnalyticsData | null;
    isPending: boolean;
    error: string | null;
}

export const HISTORY_COL_SETTINGS = {
    headers: ['Type', 'Repository', 'Date', 'Contributions'],
    columns: [
        { data: 'type', type: 'text' },
        { data: 'repository', type: 'text' },
        { data: 'createdAt', type: 'text' },
        { data: 'contributionCount', type: 'numeric' }
    ],
    schema: {
        type: null,
        repository: null,
        createdAt: null,
        contributionCount: null
    }
};

