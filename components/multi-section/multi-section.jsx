import React, { useState } from 'react';
import styles from './multi-section.module.css';
import Button from '../button/button';
import AnimatedBlips from '../animations/animated-blips';
import LoadingScan from '../loading/loading-scan';

const MultiSection = ({ children }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [animationState, setAnimationState] = useState('');

    const changeSection = (newIndex) => {
        setAnimationState('scanning');
        setTimeout(() => {
            setTimeout(() => {
                setAnimationState('')
            }, 900);
            setCurrentIndex(newIndex);
        }, 900);
    };

    const nextSection = () => {
        const newIndex = currentIndex < children.length - 1 ? currentIndex + 1 : 0;
        changeSection(newIndex);
    };

    const prevSection = () => {
        const newIndex = currentIndex > 0 ? currentIndex - 1 : children.length - 1;
        changeSection(newIndex);
    };


    return (
        <section className={styles.section}>
            {animationState === 'scanning' && (
                <LoadingScan />
            )}
            {/* <h3>{children[currentIndex]?.props.sectionTitle}</h3> */}
                {children[currentIndex]}
            <div className={styles.controls}>
                <Button action={prevSection} disabled={currentIndex === 0} label={`← ${children[currentIndex - 1]?.props.sectionTitle || 'Details'}`} />
                <Button action={nextSection} disabled={currentIndex === children.length - 1} label={`${children[currentIndex + 1]?.props.sectionTitle || 'Images'} →`}/>
            </div>
        </section>
    );
};

MultiSection.Section = ({ children, sectionTitle }) => {
    return (
        <div className={`${styles.sectionContent}`}>
            {children}
        </div>
    );
}

export default MultiSection;