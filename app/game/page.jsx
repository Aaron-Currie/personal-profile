'use client';
import styles from "./page.module.css";
import React, { useEffect, useState } from "react";
import { missions } from "@/constants/missions";
import Briefing from "@/components/briefing/briefing";
import AnimatedLights from "@/components/animations/animated-lights";
import { useUserContext } from "@/context/user";
import MissionLoadingScreen from "@/components/loading/mission-loading-screen";
import dynamic from "next/dynamic";

const MissionGlobe = dynamic(() => import("@/components/globe/mission-globe"), {
  ssr: false,
});

export default function Home() {
  const { briefing, setBriefing } = useUserContext();
  const [loading, setLoading] = useState(true);

  const { pages, updatePageStatus } = useUserContext();

  useEffect(() => {
    const home = pages.find((page) => page.link === '/');
    if(home && home.completed && !home.recentUnlock) {
      setBriefing({...briefing, display: false, hidden: false});
    }  else {
      setBriefing({...briefing, display: true, hidden: false});
    }
  }, [])
  const handleLoadingComplete = () => {
    const home = pages.find((page) => page.link === '/');
    setLoading(false);
    if(home && home.completed) {
      updatePageStatus('/', true, false);
    } else {
      updatePageStatus('/', true, true);
    }
  };

  const handleBriefingClick = () => {
    setBriefing(!briefing);
  }

  return (
    <>
      {loading && (
        <MissionLoadingScreen
          images={['/globetactical.png', 'profilepic.png']}
          onComplete={handleLoadingComplete}
        >
          <h3>Briefing</h3>
          <p>Welcome, Operative. Your mission is to track down Agent AC1178 who has gone dark.</p>
          <p>Last known contact was made during an undercover operation. Intel suggests they may be compromised — or deeper undercover than we anticipated. Your mission is to track down AC1178 by revisiting their last known operational sites.</p>
          <p>We must search each site and retrace our agents steps to uncover clues to the agents whereabouts and identity.</p>
          <p>Time is of the essence. Good luck.</p>
        </MissionLoadingScreen>
      )}
      <main className={styles.main}>
      <section className={styles.section}>
        <MissionGlobe missions={missions} pages={pages} />
        <div className={styles.overlay}>
          <div className={styles.briefingLayer}>
            <Briefing handleClick={handleBriefingClick} briefing={briefing} exitable={true} sections={[{title: 'Briefing', content: (
            <>
              <h3>Briefing</h3>
              <p>Welcome, Operative. Your mission is to track down Agent AC1178 who has gone dark.</p>
              <p>Last known contact was made during an undercover operation. Intel suggests they may be compromised — or deeper undercover than we anticipated. Your mission is to track down AC1178 by revisiting their last known operational sites.</p>
              <p>We must search each site and retrace our agents steps to uncover clues to the agents whereabouts and identity.</p>
              <p>Time is of the essence. Good luck.</p>
            </>)
            }]}/>
          </div>
          <div className={styles.decorLayer}>
            <AnimatedLights />
          </div>
        </div>
      </section>
    </main>
    </>
  );
}
