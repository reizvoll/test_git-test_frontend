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

export interface Activity {
  type: string;
  repository: string;
  createdAt: string;
  title: string;
}

export interface ActivityResponse {
  activities: Activity[];
} 