import type { UserProfile } from './api';

export interface AuthState {
    user: UserProfile | null;
    isPending: boolean;
    error: string | null;
    login: () => void;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}
