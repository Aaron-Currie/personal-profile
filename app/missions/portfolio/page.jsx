'use client';
import Briefing from "@/components/briefing/briefing";
import styles from "./page.module.css";
import React, { useEffect, useState } from "react";
import useScreenSize from "@/hooks/screen-size";
import Success from "@/components/mission-components/success-animation/success";
import LoadingScan from "@/components/loading/loading-scan";
import GridButton from "@/components/mission-components/grid-button/grid-button";
import Button from "@/components/button/button";
import generateRandomArray from "./utils/generate-grid";
import Failure from "@/components/mission-components/failed-overlay/failed-overlay";

export default function PortfolioMission() {
  const [briefing, setBriefing] = useState(true);
  const [complete, setComplete] = useState(false);
  const [failed, setFailed] = useState(false);
  const [counter, setCounter] = useState(0);
  const [grid, setGrid] = useState(null);
  const [energy, setEnergy] = useState(100);
  const { mobile } = useScreenSize()


  useEffect(() => {
    setGrid(generateRandomArray());
  }, []);

  useEffect(() => {
    if (counter === 9) {
      setComplete(true);
    }
  }, [counter]);

  useEffect(() => {
    if (energy === 0) {
      setFailed(true);
    }
  }, [energy]);

  useEffect(() => {
    if(!mobile) {
      setBriefing(true);
    }
  }, [mobile])

  const handleBriefingClick = () => {
    setBriefing(!briefing);
  }

  const resetMission = () => {
    setGrid(null);
    setCounter(0);
    setEnergy(100);
    setFailed(false);
    setComplete(false);
    setTimeout(() => {
      setGrid(generateRandomArray());
    }, 1600);
  }

  return (
    <main className={styles.main}>
      <section className={styles.section}>
        {complete && <Success page='/portfolio'></Success>}
        <div className={`briefing-offset`}>
          <Briefing handleClick={handleBriefingClick} briefing={briefing}>
            <h3>Mission: Locker Crack</h3>
            <p>Agent AC1178 successfully intercepted and secured a cache of highly sensitive technologies critical to our operation. However, during extraction, the data was encrypted and locked inside a cryptographically sealed vault.
To regain access, we need you to decrypt the vault by matching the corresponding cipher keys. Time is of the essence — the mission depends on your precision.</p>
            <p><strong>How to play:</strong> Select tiles in the grid to reveal hidden cipher keys. Match identical pairs to unlock sections of the vault. Continue until all pairs have been revealed and the vault is fully decrypted.</p>
          </Briefing>
          <div className={styles.energyContainer}>
            <div className={`${styles.energyBar} ${failed && styles.failed}`}>
              <div className={styles.energyFill} style={{width: `${energy}%`}}></div>
            </div>
            <p>Remaing Energy: {energy}%</p>
          </div>
          <div className={styles.missionGrid}>
            {failed && <Failure reset={resetMission}/>}
            {!grid? <LoadingScan/> : grid.map((item, index) => {
              return <GridButton setCounter={setCounter} energy={energy} setEnergy={setEnergy} item={item}/>
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
