import Button from "../button/button";
import styles from "./modals.module.css";
import React from "react";

const MissionModal = ({closeModal, children, pages, currentMission}) => {
    const completed = pages.find((page) => page.link === `${currentMission.link}`)?.completed;

    return (
        <div className={styles.modalOverlay} onClick={closeModal}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                {children}
                <Button type='a' href={`/missions${currentMission.link}`} label={completed?'Replay Mission' : 'Launch Mission'} />
                {completed && <Button type='a' href={`${currentMission.link}`} label={'Visit Page'} />}
            </div>
        </div>
    );
}

const Modal = ({children, closeModal}) => {
    return (
        <div className={styles.modalOverlay} onClick={closeModal}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
}

const ModalOverlay = ({children, closeModal}) => {
    return (
        <div className={styles.modalOverlay} onClick={closeModal}>
            {children}
        </div>
    );
}

export {MissionModal, Modal, ModalOverlay};