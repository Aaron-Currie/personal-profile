import React from 'react';
import styles from './cards.module.css';

const Cards = ({ children }) => {
    return (
        <div className={styles.cards}>
            {children}
        </div>
    );
};

Cards.Item = ({ children, size='md' }) => {
    return (
        <div
            className={`${styles.cardItem} ${styles[size]}`}
        >
            {children}
        </div>
    );
};


export default Cards;