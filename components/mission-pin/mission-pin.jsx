import styles from "./mission-pin.module.css";
import React from "react";

const MissionPin = ({handleClick, mission, completed}) => {
    
    return (
        <button className={styles.mission} style={{top: mission.top, left: mission.left }} onClick={() => handleClick(mission)}>
            <div className={`${styles.pin} ${completed? styles.completed : styles.incomplete}`}>{completed && '✔'}</div>
            <p>{mission.missionTitle}</p>
        </button>
    )
}

export default MissionPin;