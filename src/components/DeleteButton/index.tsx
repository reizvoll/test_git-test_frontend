'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './styles.module.scss';

interface DeleteButtonProps {
    onClick: () => Promise<void>;
    isDeleting: boolean;
}

export const DeleteButton = ({ onClick, isDeleting }: DeleteButtonProps) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && showConfirm) {
                setShowConfirm(false);
            }
        };

        const handleClickOutside = (event: MouseEvent) => {
            if (buttonRef.current && !buttonRef.current.contains(event.target as Node) && showConfirm) {
                setShowConfirm(false);
            }
        };

        document.addEventListener('keydown', handleEscape);
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showConfirm]);

    const handleClick = async () => {
        if (!showConfirm) {
            setShowConfirm(true);
            return;
        }

        try {
            await onClick();
            setShowConfirm(false);
        } catch (error) {
            console.error('Failed to delete activities:', error);
        }
    };

    return (
        <button
            ref={buttonRef}
            onClick={handleClick}
            disabled={isDeleting}
            className={`${styles.deleteButton} ${isDeleting ? styles.deleting : ''} ${showConfirm ? styles.confirm : ''}`}
        >
            {isDeleting ? (
                <>
                    <span className={styles.spinner}></span>
                    Deleting...
                </>
            ) : showConfirm ? (
                <>
                    <span className={styles.icon}>⚠️</span>
                    Are you sure?
                </>
            ) : (
                <>
                    <span className={styles.icon}>🗑️</span>
                    Delete All Activities
                </>
            )}
        </button>
    );
}; 