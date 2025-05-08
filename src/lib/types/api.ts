export interface ApiResponse<T> {
    success?: boolean;
    data?: T;
    error?: {
        message: string;
        code: string;
    };
}

export interface GitHubActivity {
    id: string;
    type: 'commit' | 'pull_request' | 'issue';
    repository: string;
    title: string;
    url: string;
    createdAt: Date;
}

export interface UserProfile {
    id: string;
    githubId: string;
    username: string;
    name?: string;
    email?: string;
    image?: string;
}

export interface ActivityStats {
    totalCommits: number;
    totalPullRequests: number;
    totalIssues: number;
    repositories: string[];
} 