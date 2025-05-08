'use client';

import { useAuthStore } from '@/lib/store/authStore';
import Image from 'next/image';
import { useEffect } from 'react';
import styles from './styles.module.scss';

export const Header = () => {
    const { user, login, logout, checkAuth } = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    return (
        <header className={styles.header}>
            <div className={styles.logo}>
                <h1>GitHub Activity Tracker</h1>
            </div>
            <div className={styles.auth}>
                {user ? (
                    <div className={styles.profile}>
                        {user.image && (
                            <Image
                                src={user.image}
                                alt={user.name || 'Profile'}
                                width={32}
                                height={32}
                                className={styles.avatar}
                            />
                        )}
                        <span className={styles.username}>{user.name}</span>
                        <button onClick={logout} className={styles.logoutButton}>
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