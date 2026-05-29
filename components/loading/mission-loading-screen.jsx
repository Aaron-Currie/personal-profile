'use client';
import React, { useEffect, useState } from 'react';
import styles from './mission-loading-screen.module.css';
import Button from '@/components/button/button';

const SEGMENT_COUNT = 20;
const MIN_DURATION = 1000;

function getStatusMessage(progress) {
  if (progress >= 100) return 'SYSTEMS READY';
  if (progress >= 76) return 'VERIFYING INTEL...';
  if (progress >= 51) return 'DECRYPTING DATA...';
  if (progress >= 26) return 'LOADING ASSETS...';
  return 'INITIALIZING SYSTEMS...';
}

export default function MissionLoadingScreen({ images = [], buttonText = 'Accept Mission', onComplete, children, title = 'CLASSIFIED MISSION BRIEFING' }) {
  const [progress, setProgress] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [timerDone, setTimerDone] = useState(false);
  const ready = imagesLoaded && timerDone;

  useEffect(() => {
    if (images.length === 0) {
      setProgress(100);
      setImagesLoaded(true);
      return;
    }
    let loaded = 0;
    const total = images.length;
    images.forEach(url => {
      const img = new window.Image();
      img.onload = img.onerror = () => {
        loaded++;
        setProgress(Math.round((loaded / total) * 100));
        if (loaded === total) setImagesLoaded(true);
      };
      img.src = url;
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setTimerDone(true), MIN_DURATION);
    return () => clearTimeout(timer);
  }, []);

  const filledCount = Math.floor((progress / 100) * SEGMENT_COUNT);
  const statusMessage = getStatusMessage(progress);
  const childrenArray = React.Children.toArray(children);

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <header className={styles.header}>
          <span className={styles.diamond}>◈</span>
          <span className={styles.headerText}>{title}</span>
          <span className={styles.diamond}>◈</span>
        </header>

        <div className={styles.divider} />

        <div className={styles.briefingArea}>
            {children}
        </div>

        <div className={styles.divider} />

        <div className={styles.barButtonContainer}>
          <div className={`${styles.barState} ${ready ? styles.barHidden : ''}`}>
            <div className={styles.segmentRow}>
              {Array.from({ length: SEGMENT_COUNT }).map((_, i) => (
                <div
                  key={i}
                  className={`${styles.segment} ${i < filledCount ? styles.segmentFilled : ''}`}
                />
              ))}
              <div className={styles.scanLine} />
            </div>
            <div className={styles.statusRow}>
              <span className={styles.statusText}>{statusMessage}</span>
              <span className={styles.percentage}>{progress}%</span>
            </div>
          </div>

          <div className={`${styles.buttonState} ${ready ? styles.buttonVisible : ''}`}>
            <Button label={buttonText} action={onComplete} />
          </div>
        </div>
      </div>
    </div>
  );
}
