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
import Button from "@/components/button/button";

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
        <MissionModal currentMission={currentMission} closeModal={handleMissionClick}>
            <h2>Mission: {currentMission.missionTitle}</h2>
            <h3>Section: {currentMission.section}</h3>
            <p>{currentMission.description}</p>
            <Button type='a' href={`/missions/${currentMission.link}`} label='Launch Mission' />
        </MissionModal>)}
      <section className={styles.section}>
      <img src="/globetactical.png" className={styles.map} />
        <div className={styles.overlay}>
          <Briefing handleClick={handleBriefingClick} briefing={briefing}>
            <h3>Profile: AARON CURRIE</h3>
            <p>Welcome to the profile, your mission is to do research and reconsience on the target in question, to asses if they are what we need for the next msision. Complete the tasks to build a dossier on the target.</p>
            <p>Click the quick access button to skip the missions to assess the portfolio immediately.</p>
          </Briefing>
          {missions.map((mission) => {
            const completed = pages.find((page) => page.link === `/${mission.link}`)?.completed;
            return <MissionPin key={mission.id} handleClick={handleMissionClick} mission={mission} completed={completed} />
          })}
          <AnimatedLights />
        </div>
      </section>
    </main>
  );
}
