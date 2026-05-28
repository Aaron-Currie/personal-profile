import React from 'react';
import styles from './button.module.css';
import Link from 'next/link';
import StatusIndicator from '@/components/hud/status-indicator';

const Button = ({ label, action, href, type = 'button', disabled=false, recentUnlock=false}) => {
    const isIcon = type === 'icon';
    const sharedClass = `${styles.button} ${type === 'icon' ? styles.iconButton : styles.defaultButton} ${disabled ? styles.disabled : ''} ${!disabled && recentUnlock ? styles.unlockAnimation : ''}`;

    const inner = (
        <span className={`${styles.inner} ${isIcon ? styles.iconInner : ''}`}>
            {!isIcon && (
                <span className={styles.topRow}>
                    <StatusIndicator
                        status={disabled ? 'locked' : 'active'}
                        label={disabled ? 'LOCKED' : 'READY'}
                    />
                </span>
            )}
            <span className={styles.label}>{label}</span>
            <span className={styles.scanline} />
            <span className={`${styles.corner} ${styles.tl}`} />
            <span className={`${styles.corner} ${styles.tr}`} />
            <span className={`${styles.corner} ${styles.bl}`} />
            <span className={`${styles.corner} ${styles.br}`} />
        </span>
    );

    if(type === 'a' && !disabled) {
        return (
            <Link href={href} onClick={action} className={`${sharedClass} ${styles.linkFill}`}>
                {inner}
            </Link>
        );
    }

    return (
        <button
            className={sharedClass}
            onClick={disabled ? undefined : action}
            disabled={disabled}
        >
            {inner}
        </button>
    );
};

export default Button;