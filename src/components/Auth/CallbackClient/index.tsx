'use client';

import { useAuthStore } from '@/lib/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import styles from './styles.module.scss';

export default function CallbackClient({ token, error }: { token?: string; error?: string }) {
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

    if (!token) {
      router.push(`/error?message=${encodeURIComponent('No token received')}`);
      return;
    }

    localStorage.setItem('auth_token', token);
    checkAuth().then(() => {
      router.push('/');
    }).catch((err) => {
      console.error('CheckAuth error:', err);
      router.push(`/error?message=${encodeURIComponent('Failed to check auth')}`);
    });
  }, [token, error, router, checkAuth]);

  return (
    <div className={styles.content}>
      <h1 className={styles.title}>Processing authentication...</h1>
      <div className={styles.spinner}></div>
    </div>
  );
}