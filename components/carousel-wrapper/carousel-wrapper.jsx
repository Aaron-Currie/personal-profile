"use client"
import React, { useState } from 'react';
import styles from './carousel-wrapper.module.css';

const CarouselWrapper = ({ children }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    console.log(children, 'CHILDREN IN CAROUSEL WRAPPER');

    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? children.length - 1 : prevIndex - 1
        );
    };

    const nextSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === children.length - 1 ? 0 : prevIndex + 1
        );
    };

    const handleTouchStart = (e) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const swipeDistance = touchStart - touchEnd;
        const minSwipeDistance = 50;

        if (swipeDistance > minSwipeDistance) {
            prevSlide();
        } else if (swipeDistance < -minSwipeDistance) {
            nextSlide();
        }
        setTouchStart(null);
        setTouchEnd(null);
    };

    return (
        <div className={styles.carousel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        >
            <button className={styles.navButton} onClick={prevSlide}>
                &#8249;
            </button>
            <div className={styles.imagesContainer}>
                {children.map((child, index) => {
                    let position;
                    if (index === currentIndex) {
                        position = 'center';
                    } else if (index === (currentIndex - 1 + children.length) % children.length) {
                        position = 'left';
                    } else if (index === (currentIndex + 1) % children.length) {
                        position = 'right';
                    } else if (index === (currentIndex - 2 + children.length) % children.length) {
                        position = 'hiddenLeft';
                    }else if (index === (currentIndex + 2) % children.length) {
                        position = 'hiddenRight';
                    } else {
                        position = 'hidden';
                    }

                    return (
                        <div key={index} className={`${styles.imageContainer} ${styles[position]}`}>
                            {child}
                        </div>
                    );
                })}
            </div>
            <button className={styles.navButton} onClick={nextSlide}>
                &#8250;
            </button>
        </div>
    );
};

export default CarouselWrapper;