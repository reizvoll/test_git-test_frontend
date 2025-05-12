'use client';

import styles from './styles.module.scss';

type SpinnerSize = 'sm' | 'md' | 'lg';

interface LoadingSpinnerProps {
    size?: SpinnerSize;
}

export const LoadingSpinner = ({ size = 'md' }: LoadingSpinnerProps) => {
    return (
        <div className={styles.spinnerContainer}>
            <div className={`${styles.spinner} ${styles[size]}`}></div>
        </div>
    );
}; 