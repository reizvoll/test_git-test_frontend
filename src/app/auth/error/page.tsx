'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import styles from './styles.module.scss';

export default function AuthError() {
    const searchParams = useSearchParams();
    const error = searchParams?.get('error');

    const getErrorMessage = (errorCode: string | null | undefined) => {
        switch (errorCode) {
            case 'OAuthSignin':
                return 'GitHub login error occurred.';
            case 'OAuthCallback':
                return 'GitHub authentication callback processing error occurred.';
            case 'OAuthCreateAccount':
                return 'Account creation error occurred.';
            case 'EmailCreateAccount':
                return 'Email account creation error occurred.';
            case 'Callback':
                return 'Authentication callback processing error occurred.';
            case 'OAuthAccountNotLinked':
                return 'Email already exists.';
            case 'EmailSignin':
                return 'Email sending error occurred.';
            case 'CredentialsSignin':
                return 'Invalid login information.';
            case 'SessionRequired':
                return 'Login is required.';
            default:
                return 'Authentication error occurred.';
        }
    };

    return (
        <div className={styles.container}>
            <h1>Authentication Error</h1>
            <p className={styles.error}>{getErrorMessage(error)}</p>
            <Link href="/" className={styles.link}>
                Go to MainPage
            </Link>
        </div>
    );
} 