'use client';

import { useAuthStore } from '@/lib/store/authStore';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import styles from './styles.module.scss';

export default function CallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { checkAuth } = useAuthStore();
  const hasRun = useRef(false); // 중복 실행 방지

  useEffect(() => {
    if (hasRun.current) return; // 이미 실행됐으면 스킵
    hasRun.current = true;

    const token = searchParams.get('token');
    const error = searchParams.get('error');

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
    }, [searchParams, router, checkAuth]);

  return (
      <div className={styles.content}>
        <h1 className={styles.title}>Processing authentication...</h1>
        <div className={styles.spinner}></div>
      </div>
  );
}