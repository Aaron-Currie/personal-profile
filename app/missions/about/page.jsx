'use client';
import Briefing from "@/components/briefing/briefing";
import styles from "./page.module.css";
import React, { use, useEffect, useState } from "react";
import { missionData } from "./mission-data";
import FlipCard from "../../../components/mission-components/flip-card/flip-card";
import useScreenSize from "@/hooks/screen-size";
import Success from "@/components/mission-components/success-animation/success";
import Cards from "@/components/cards/cards";
import Button from "@/components/button/button";

export default function Home() {
  const [briefing, setBriefing] = useState(true);
  const [complete, setComplete] = useState(false);
    const [missionDataState, setMissionDataState] = useState(null);

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
    const shuffledMissionData = Object.keys(missionData)
    .sort(() => Math.random() - 0.5)
    .reduce((acc, key) => {
        acc[key] = missionData[key];
        return acc;
    }, {});
    setMissionDataState(shuffledMissionData)
}

const selectAgent = (key) => {
    if (key === 'agent3') {
        setComplete(true);
    } else if (selectedAgent.length > 1) {
        setMissionDataState(null);
        setTimeout(() => {
            shuffleMissionData(); 
        }, 1000);
        setSelectedAgent([]);
    } else {
        setSelectedAgent([...selectedAgent, key]);
    }
}

const classProvider = (agent, trait, answer, selected) => {
    if (!selected) {
        return ''
    } else if (trait === 'interests') {
        return answer.includes(agent) ? styles.correctData : styles.incorrectData;
    } else if (agent[trait] === answer) {
        return styles.correctData;
    } else {
        return styles.incorrectData;
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
          <div className={styles.cardScroll}>
            <Cards>
                {!missionDataState? <p>Accquiring fresh safe house data</p> : Object.keys(missionDataState).map((key, index) => {
                    const agent = missionData[key];
                    const isSelected = selectedAgent.includes(key);
                    return (
                    <Cards.Item key={index} size='sm'>
                        <img src={agent.image}/>
                        <div className={styles.cardContent}>
                            <p className={classProvider(agent, 'base', 'Leeds', isSelected)} >Base: {agent.base}</p>
                            <p className={classProvider(agent, 'experience', 2.5, isSelected)}>Experience: {agent.experience} years</p>
                            <p className={classProvider(agent, 'training', 'Bootcamp', isSelected)} >Training: {agent.training}</p>
                            <p className={classProvider(agent, 'certifications', 'Google Cloud Certified', isSelected)}>Certifications: {agent.certifications}</p>
                            <p>Interests: </p>
                            <ul>
                                {agent.interests.map((interest, index) => (
                                    <li className={classProvider(interest, 'interests',['Hiking', 'Snowboarding', 'Mountain Biking'] , isSelected)} key={index}>{interest}</li>
                                ))}
                            </ul>
                        </div>
                        <Button disabled={selectedAgent.includes(key)} label='Select Agent' type='button' action={() => selectAgent(key)}/>
                    </Cards.Item>)
                })}
            </Cards>
          </div>


        </div>
      </section>
    </main>
  );
}
