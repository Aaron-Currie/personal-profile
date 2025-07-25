'use client';
import Briefing from "@/components/briefing/briefing";
import styles from "./page.module.css";
import React, { use, useEffect, useState } from "react";
import { missionData } from "./mission-data";
import useScreenSize from "@/hooks/screen-size";
import Success from "@/components/mission-components/success-animation/success";
import CarouselWrapper from "@/components/carousel-wrapper/carousel-wrapper";
import AgentCard from "@/components/mission-components/agent-card/agent-card";
import LoadingPage from "@/components/loading/loading-page";

export default function AboutMission() {
  const [briefing, setBriefing] = useState(true);
  const [complete, setComplete] = useState(false);
  const [missionDataState, setMissionDataState] = useState(missionData);
  const [loading, setLoading] = useState(true);

  const [selectedAgent, setSelectedAgent] = useState([]);
  const { mobile } = useScreenSize()


  useEffect(() => {
    if(!mobile) {
      setBriefing(true);
    }
  }, [mobile])

  useEffect(() => {
    shuffleMissionData();
  }, []);

  const handleBriefingClick = () => {
    setBriefing(!briefing);
  }

  const shuffleMissionData = () => {
    setLoading(true);
    const shuffledMissionData = Object.keys(missionData)
    .sort(() => Math.random() - 0.5)
    .reduce((acc, key) => {
        acc[key] = missionData[key];
        return acc;
    }, {});
      setMissionDataState(shuffledMissionData)
    setTimeout(() => {
      setLoading(false)
    }, 1600);
    
}

const selectAgent = (key) => {
    if (key === 'agent3') {
        setComplete(true);
    } else if (selectedAgent.length > 1) {
        setSelectedAgent([...selectedAgent, key]);
        setTimeout(() => {
            shuffleMissionData(); 
            setSelectedAgent([]);
        }, 500);
    } else {
        setSelectedAgent([...selectedAgent, key]);
    }
}
  return (
    <main className={styles.main}>
      <section className={styles.section}>
        {complete && <Success page='/about'></Success>}
        <div className={`briefing-offset`}>
          <Briefing handleClick={handleBriefingClick} briefing={briefing}>
            <h3>Mission: Identify Agent</h3>
            <p>Agent AC1178 has successfully gone to ground in one of our secure safe houses. Your task is to identify their current location using a dossier of potential agents. Each suspect shares traits with our man, but only one is our operative.</p>
            <p><strong>How to play:</strong> Select agents to reveal which traits they share with AC1178. Use this intel to eliminate false leads and zero in on the target.</p>
            <p><strong>⚠️ Caution:</strong> After three incorrect identifications, the agents will be alerted. AC1178 will relocate, and all revealed intel will be lost. Proceed with precision.</p>
          </Briefing>
            <CarouselWrapper border={false} size='medium'>
                 {Object.keys(missionDataState).map((key, index) => {
                    return <AgentCard key={index} loading={loading} agent={missionDataState[key]} agentName={key} action={selectAgent} selectedAgent={selectedAgent} />
                })}
            </CarouselWrapper>
        </div>
      </section>
    </main>
  );
}
