import type { ApiResponse, GitHubActivity } from '@/lib/types/api';
import { NextResponse } from 'next/server';
import { API } from './api';

// GitHub 활동 조회
export async function getGitHubActivities() {
    try {
        const response = await API.get<ApiResponse<GitHubActivity[]>>('/api/activities');
        
        if (!response.data.success) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            );
        }

        return NextResponse.json(response.data.data);
    } catch (error) {
        console.error('Error fetching GitHub activities:', error);
        return NextResponse.json(
            { error: 'Failed to fetch activities' },
            { status: 500 }
        );
    }
}