'use client';
import Briefing from "@/components/briefing/briefing";
import styles from "./page.module.css";
import React, { use, useEffect, useState } from "react";
import { missionData } from "./mission-data";
import FlipCard from "./flip-card";

export default function Home() {
  const [briefing, setBriefing] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [missionDataState, setMissionDataState] = useState(null);

  useEffect(() => {
    const shuffledData = [...missionData].sort(() => Math.random() - 0.5);
    setMissionDataState(shuffledData);
  }, []);

  const handleBriefingClick = () => {
    setBriefing(!briefing);
  }

  // const FlipCard = ({ mission, selectedItem, setSelectedItem, setMissionDataState }) => {
  //   const [isFlipped, setIsFlipped] = useState(false);

  //   const handleItemClick = (id, matchId) => {
  //     setIsFlipped(!isFlipped);
  //     console.log('Item Clicked', isFlipped);
  //     if (!selectedItem) {
  //       setSelectedItem({id, matchId});
  //     } else if (selectedItem.matchId === matchId) {
  //       console.log('Selected Item is matched');
  //       const updatedMissionData = missionDataState.map((item) =>
  //         item.matchId === matchId ? { ...item, matched: true } : item
  //       );
  //       setMissionDataState(updatedMissionData);
  //       setSelectedItem(null);
  //     } else {
  //       console.log('Selected Item is not matched');
  //       setSelectedItem(null);
  //     }
  //   }

  //   return (
  //       <button
  //           disabled={mission.id === selectedItem?.id || mission.matched}
  //           className={`${styles.flipCard}`}
  //           onClick={()=> handleItemClick(mission.id, mission.matchId)}
  //       >
  //           <div className={styles.flipCardItemFront}>
  //               <img src='/question.png' className={`${styles.gridImg} ${styles.questionMark}`} />
  //           </div>
  //           <div className={styles.flipCardItemBack}>
  //               <img src={mission.icon} className={styles.gridImg} />
  //           </div>
  //       </button>
  //   );
  // };

  return (
    <main className={styles.main}>
      <section className={styles.section}>
      <img src="/apartment.png" className={styles.map} />
        <div className={`${styles.overlay} briefing-offset`}>
          <Briefing handleClick={handleBriefingClick} briefing={briefing}>
            <h3>Profile: AARON CURRIE</h3>
            <p>Welcome to the profile, your mission is to do research and reconsience on the target in question, to asses if they are what we need for the next msision. Complete the tasks to build a dossier on the target.</p>
            <p>Click the quick access button to skip the missions to assess the portfolio immediately.</p>
          </Briefing>
          <div className={styles.missionGrid}>
            
            {!missionDataState? <p>Loading</p> : missionDataState.map((mission, index) => {
              return (
                <FlipCard index={index} mission={mission} key={index} selectedItem={selectedItem} setSelectedItem={setSelectedItem} setMissionDataState={setMissionDataState} missionDataState={missionDataState} />
              )
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
