'use client';
import styles from "./page.module.css";
import React, { useEffect, useState } from "react";
import{ missions } from "../constants/missions";
import {MissionModal} from "../components/modals/modals";
import MissionPin from "../components/mission-pin/mission-pin";
import Briefing from "../components/briefing/briefing";
import AnimatedLights from "../components/animated-lights/animated-lights";
import useScreenSize from "../hooks/screen-size";
import { useUserContext } from "@/context/user";

export default function Home() {
  const [currentMission, setCurrentMission] = useState(null);
  const [briefing, setBriefing] = useState(true);
  const { mobile } = useScreenSize()

  const { pages, updatePageStatus } = useUserContext();

  useEffect(() => {
    if(!mobile) {
      setBriefing(true);
    } else if(pages.find((page) => page.link === '/').completed && mobile) {
      setBriefing(false);
    } 
  }, [mobile])

  useEffect(() => {
    updatePageStatus('/', true, false);
  }, [])

  const handleMissionClick = (mission) => {
    if(currentMission) {
      setCurrentMission(null)
    } else {
      setCurrentMission(mission);
    }
  }

  const handleBriefingClick = () => {
    setBriefing(!briefing);
  }

  return (
    <main className={styles.main}>
      {currentMission && (
        <MissionModal currentMission={currentMission} closeModal={handleMissionClick} pages={pages}>
        </MissionModal>)}
      <section className={styles.section}>
      <img src="/globetactical.png" className={styles.map} />
        <div className={styles.overlay}>
          <Briefing handleClick={handleBriefingClick} briefing={briefing}>
            <h3>Profile: AARON CURRIE</h3>
            <p>Welcome, Operative. Your mission is to conduct reconnaissance on the subject known as Agent AC1178. We must determine their suitability for a high-priority assignment.</p>
            <p>To complete your assessment, navigate through a series of encrypted dossiers. Each page contains intel on the agent’s background, skills, experience, and capabilities — but access is restricted. Complete the missions on the map below to unlock each file and build a full profile.</p>
            <p>If time is limited, use the <strong>Quick Access</strong> override button to bypass security protocols and review all pages immediately.</p>
          </Briefing>
          {missions.map((mission) => {
            const completed = pages.find((page) => page.link === `${mission.link}`)?.completed;
            return <MissionPin key={mission.id} handleClick={handleMissionClick} mission={mission} completed={completed} />
          })}
          <AnimatedLights />
        </div>
      </section>
    </main>
  );
}
