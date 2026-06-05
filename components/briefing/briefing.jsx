import React from 'react';
import styles from './briefing.module.css';
import Button from '../button/button';
import { ModalContent, ModalOverlay } from '../modals/modals';

const Briefing = ({handleClick, briefing, children}) => {
    if (!briefing) {
        return <div className={styles.briefingButton}><Button label={'Briefing'} action={handleClick}/></div>
    }
    return (
        <ModalOverlay closeModal={handleClick} className={styles.briefingOverlay}>
            <ModalContent closeModal={handleClick} className={styles.briefing}>
                <div className={styles.briefingHeader}>
                    <img src='/profilepic.png' alt="Profile" className={styles.profilePic} />
                </div>
                <div className={styles.briefingContent}>
                    {children}
                </div>
            </ModalContent>
        </ModalOverlay>
    );
};

export default Briefing;