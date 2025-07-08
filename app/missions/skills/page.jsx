'use client';
import Briefing from "@/components/briefing/briefing";
import styles from "./page.module.css";
import React, { useEffect, useState } from "react";
import { missionData } from "./mission-data";
import FlipCard from "../../../components/mission-components/flip-card/flip-card";
import useScreenSize from "@/hooks/screen-size";
import Success from "@/components/mission-components/success-animation/success";

export default function Home() {
  const [briefing, setBriefing] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [missionDataState, setMissionDataState] = useState(null);
  const [complete, setComplete] = useState(false);
  const { mobile } = useScreenSize()


  useEffect(() => {
    const shuffledData = [...missionData].sort(() => Math.random() - 0.5);
    setMissionDataState(shuffledData);
  }, []);

  useEffect(() => {
    if(!mobile) {
      setBriefing(true);
    }
  }, [mobile])

  useEffect(() => {
    if(missionDataState && missionDataState.every((mission) => mission.matched)) {
      setComplete(true);
    }
  }, [missionDataState]);

  const handleBriefingClick = () => {
    setBriefing(!briefing);
  }

  return (
    <main className={styles.main}>
      <section className={styles.section}>
        {complete && <Success page='/skills'></Success>}
        <div className={`briefing-offset`}>
          <Briefing handleClick={handleBriefingClick} briefing={briefing}>
            <h3>Mission: Obtain Technology</h3>
            <p>Agent AC1178 successfully intercepted and secured a cache of highly sensitive technologies critical to our operation. However, during extraction, the data was encrypted and locked inside a cryptographically sealed vault.

To regain access, we need you to decrypt the vault by matching the corresponding cipher keys. Time is of the essence — the mission depends on your precision.</p>
            <p><strong>How to play:</strong> Select tiles in the grid to reveal hidden cipher keys. Match identical pairs to unlock sections of the vault. Continue until all pairs have been revealed and the vault is fully decrypted.</p>
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
