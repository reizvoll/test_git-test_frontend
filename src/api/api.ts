import type { ActivityStats, ApiResponse, GitHubActivity, UserProfile } from '@/lib/types/api';
import axios from "axios";
import Router from "next/router";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const API = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    withCredentials: true,
    validateStatus: status => status < 500,
    headers: {
        "Content-Type": "application/json",
    },
});

// 인증 관련 API
export const authApi = {
    signInWithGithub: () => {
        window.location.href = `${BASE_URL}/api/auth/github`;
    },
    signOut: () => 
        API.post('/api/auth/signout').then(response => {
            localStorage.removeItem('auth_token');
            return response;
        }),
    getSession: async () => {
        console.log('Fetching session...'); // 디버깅용 로그
        const response = await API.get<ApiResponse<UserProfile>>('/api/auth/session');
        console.log('Raw session response:', response); // 원본 응답 로깅
        
        // 응답 데이터 구조 확인 및 변환
        if (response.data) {
            // ApiResponse 형태인 경우
            if ('data' in response.data) {
                return response;
            }
            // 직접 UserProfile 형태인 경우
            const userData = response.data as unknown as UserProfile;
            if (userData.id && userData.githubId && userData.username) {
                return {
                    data: {
                        success: true,
                        data: userData
                    }
                };
            }
        }
        
        console.log('Invalid session response format:', response.data);
        return {
            data: {
                success: false,
                error: {
                    message: 'Invalid session data format',
                    code: 'INVALID_FORMAT'
                }
            }
        };
    },
};

// GitHub 활동 관련 API
export const githubApi = {
    getActivities: () => 
        API.get<ApiResponse<GitHubActivity[]>>('/api/activities'),
    getStats: () => 
        API.get<ApiResponse<ActivityStats>>('/api/users/stats'),
};

// 사용자 관련 API
export const userApi = {
    getProfile: () => 
        API.get<ApiResponse<UserProfile>>('/api/users/profile'),
};

// 요청 인터셉터 - 토큰 추가
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// 응답 인터셉터 - 에러 처리
API.interceptors.response.use(
    (response) => {
        console.log('Response:', response.status, response.config.url);
        return response;
    },
    (error) => {
        console.error('Response error:', error);
        if (error.response?.status === 401) {
            localStorage.removeItem('auth_token');
            Router.push('/');
        }
        return Promise.reject(error);
    }
);

export default API;