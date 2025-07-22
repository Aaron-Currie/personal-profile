import React from 'react';
import styles from './loading.module.css';
import AnimatedBlips from '../animated-lights/animated-blips';

const LoadingPage = () => {
    return (
        <main className={`${styles.loadingPage} main-offset`}>
            <div className={styles.loadingText}>
                <h1>Aquiring Target</h1>
                <div className={styles.dot}></div><div className={styles.dot}></div><div className={styles.dot}></div>
            </div>
                <div className={styles.radarCircle}>
                    <AnimatedBlips speed={750}/>
                    <div className={`${styles.radarCircleInner} ${styles.inner75}`}></div>
                    <div className={`${styles.radarCircleInner} ${styles.inner50}`}></div>
                    <div className={`${styles.radarCircleInner} ${styles.inner25}`}></div>
                    <div className={`${styles.radarLine} ${styles.left}`}></div>
                    <div className={`${styles.radarLine} ${styles.right}`}></div>
                    <div className={`${styles.radarLine} ${styles.up}`}></div>
                    <div className={`${styles.radarLine} ${styles.down}`}></div>
                    <div className={`${styles.radarLine} ${styles.spin}`}></div>
                </div>
        </main>
    );
};

export default LoadingPage;