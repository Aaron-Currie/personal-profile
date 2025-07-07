'use client';
import React, { useEffect, useState } from 'react';
import styles from './button.module.css';

const QuickAccessButton = ({pages, updatePageStatus}) => {

    const [allUnlocked, setAllUnlocked] = useState(false);

    const quickAccess = () => {
        setAllUnlocked(true);
        pages.filter((page) => !page.complete).forEach((page) => {
          updatePageStatus(page.link, true, true);
        });
    }

    useEffect(() => {
        const allCompleted = pages.every((page) => page.completed);
        console.log(allCompleted,'All Completed');
        setAllUnlocked(allCompleted);
    }, [pages]);
    

    return (
        <button
            className={`${styles.button} ${styles.defaultButton} ${allUnlocked && styles.fadeOut}`}
            onClick={quickAccess}
        >
            Quick Access
        </button>
    );
};

export default QuickAccessButton;