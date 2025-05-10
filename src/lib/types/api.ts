export interface ApiResponse<T> {
    success?: boolean;
    data?: T;
    error?: {
        message: string;
        code: string;
    };
}

export interface GitHubActivity {
    userId: string;
    type: 'Contribution' | 'Commit' | 'PullRequest';
    repository: string;
    title: string;
    url: string;
    eventId: string;
    createdAt: Date;
    contributionCount: number;
    description?: string | null;
    state?: 'MERGED' | 'CLOSED';
    mergedAt?: Date | null;
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