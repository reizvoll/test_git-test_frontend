export interface ButtonProps {
    onClick: () => void;
    disabled?: boolean;
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'danger';
    size?: 'sm' | 'md' | 'lg';
}

export interface SyncButtonProps {
    onClick: () => void;
    isSyncing: boolean;
    lastSyncTime?: Date;
} 