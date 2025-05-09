import { useEffect } from 'react';
import styles from './styles.module.scss';

interface AlertProps {
    message: string;
    type?: 'error' | 'warning' | 'info';
    onClose?: () => void;
    duration?: number;
}

export const Alert = ({ message, type = 'error', onClose, duration = 5000 }: AlertProps) => {
    useEffect(() => {
        if (duration && onClose) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    return (
        <div className={`${styles.toast} ${styles[type]}`}>
            <div className={styles.clickBox}></div>
            <p className={styles.message}>{message}</p>
            {onClose && (
                <button onClick={onClose} className={styles.closeButton}>
                    ×
                </button>
            )}
        </div>
    );
}; 