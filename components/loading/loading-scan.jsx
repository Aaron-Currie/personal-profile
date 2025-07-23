import React from 'react';
import styles from './loading.module.css';
import AnimatedBlips from '../animated-lights/animated-blips';

const LoadingScan = ({text=null}) => {
    return (
        <div className={styles.scanContainer}>
            <AnimatedBlips/>
            {text && <p>{text}</p>}
            <div className={styles.scan}></div>
        </div>
    );
};

export default LoadingScan;