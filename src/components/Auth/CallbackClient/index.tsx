'use client';

import { useAuthStore } from '@/lib/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import styles from './styles.module.scss';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function CallbackClient({ error }: { error?: string }) {
    const router = useRouter();
    const { checkAuth } = useAuthStore();
    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        if (error) {
            router.push(`/error?message=${encodeURIComponent(error)}`);
            return;
        }

        checkAuth().then(() => {
            router.push('/');
        }).catch((err) => {
            console.error('CheckAuth error:', err);
            router.push(`/error?message=${encodeURIComponent('Failed to check auth')}`);
        });
    }, [error, router, checkAuth]);

    return (
        <div className={styles.content}>
            <div className={styles.authContainer}>
                <h1 className={styles.title}>Processing authentication...</h1>
                <div className={styles.spinnerBox}>
                    <LoadingSpinner size="lg" />
                </div>
            </div>
        </div>
    );
}