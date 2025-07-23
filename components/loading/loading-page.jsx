import React from 'react';
import styles from './loading.module.css';
import AnimatedBlips from '../animated-lights/animated-blips';
import Image from 'next/image';

const LoadingPage = ({text = 'Loading'}) => {
    return (
        <main className={`${styles.loadingPage} main-offset`}>
            <div className={styles.loadingText}>
                <h1>{text}</h1>
                <div className={styles.dot}></div><div className={styles.dot}></div><div className={styles.dot}></div>
            </div>
            
                <div className={styles.radarCircle}>
                    <AnimatedBlips speed={750}/>
                    <Image src='/mapcompress.png' alt='Background Image' className={styles.backgroundImage} priorty='true' quality={10} width={1000} height={790}/>
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