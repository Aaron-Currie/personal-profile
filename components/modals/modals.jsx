import Button from "../button/button";
import styles from "./modals.module.css";
import React from "react";

const MissionModal = ({closeModal, children}) => {
    return (
        <div className={styles.modalOverlay} onClick={closeModal}>
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            {children}
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