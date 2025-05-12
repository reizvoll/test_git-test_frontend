'use client';

import { useAuthStore } from '@/lib/store/authStore';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import styles from './styles.module.scss';
import { LoadingSpinner } from '../LoadingSpinner';

export const Header = () => {
    const { user, login, logout, checkAuth, isPending } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const initAuth = async () => {
            await checkAuth();
        };
        initAuth();
    }, [checkAuth]); // checkAuth를 의존성 배열에 추가

    useEffect(() => {
    }, [user]);

    const handleProfileClick = () => {
        if (pathname !== '/mypage') {
            router.push('/mypage');
        }
    };

    const handleLogoClick = () => {
        router.push('/');
    };

    return (
        <header className={styles.header}>
            <div className={styles.logo} onClick={handleLogoClick}>
                <h1>GitHub Activity Tracker</h1>
            </div>
            <div className={styles.auth}>
                {isPending ? (
                    <LoadingSpinner size="sm" />
                ) : user ? (
                    <div 
                        className={`${styles.profile} ${pathname === '/mypage' ? styles.active : ''}`}
                        onClick={handleProfileClick}
                    >
                        {user.image && (
                            <Image
                                src={user.image}
                                alt={user.username || 'Profile'}
                                width={32}
                                height={32}
                                className={styles.avatar}
                                unoptimized={false}
                                priority
                            />
                        )}
                        <span className={styles.username}>{user.username}</span>
                        <button onClick={(e) => {
                            e.stopPropagation();
                            logout();
                        }} className={styles.logoutButton}>
                            Logout
                        </button>
                    </div>
                ) : (
                    <button onClick={login} className={styles.loginButton}>
                        Login with GitHub
                    </button>
                )}
            </div>
        </header>
    );
}; 