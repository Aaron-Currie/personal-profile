'use client'
import React, { useEffect } from 'react';
import styles from './success.module.css';
import { ModalHudChrome, ModalOverlay } from '@/components/modals/modals';
import Button from '@/components/button/button';
import { useUserContext } from '@/context/user';
import LiveReadout from '@/components/hud/live-readout';
import DataStreams from '@/components/animations/data-streams';
import DataTicker from '@/components/hud/data-ticker';
import StatusIndicator from '@/components/hud/status-indicator';

const Success = ({page}) => {
    const {updatePageStatus} = useUserContext()
    useEffect(() => {
        updatePageStatus(page, true, true)
    }, [])
    return (
        <ModalOverlay>
            <div className={styles.content}>
                <ModalHudChrome/>
                <h1>Mission Complete!</h1>
                <Button label='Proceed to Page' type='a' href={`/game${page}`}/>
            </div>
        </ModalOverlay>

    );
};

export default Success;