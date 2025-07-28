'use client';
import React from "react";
import styles from "./page.module.css";
import Button from "@/components/button/button";
import Radar from "@/components/animations/radar";
import Typewriter from "@/components/animations/typewriter";

const CVPage = () => {
    const handleDownload = () => {
        // TODO replace with actual CV file path once updated
        const link = document.createElement("a");
        link.href = "/cv.pdf";
        link.download = "My_CV.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const tempClick = () => {
        alert("This feature is under construction. Please check back later!");
    };

    return (
        <main className={'main-offset'}>
            <div className={styles.screenContainer}>
                <div className={styles.screen}>
                    <div className={styles.opacity}>
                        <div style={{top: '60%', left: '50%'}} className={`${styles.positioner} ${styles.cv}`}>
                            <img className={styles.cvImage} src='/cv-image.png'/>
                        </div>
                        {/* <div style={{bottom: '-35vw', left: '5%'}} className={`${styles.positioner} ${styles.radar}`}>
                            <Radar />
                        </div> */}
                    </div>
                    <div style={{top: '2.5%', left: '2.5%'}} className={` ${styles.analyiser}`}>
                        <h2>Analysing Data</h2>
                        <div className={styles.profileContainer}>
                            <img className={styles.profilePic} src='/profilepic.png'/>
                            <div className={styles.details}>
                                <Typewriter speed={60} pause={1000}>
                                    <p>Aaron Currie - Full Stack Developer</p>
                                    <p>Experience: 2.5 years</p>
                                    <p>Current Employer: Sky UK</p>
                                    <p>Skills: React, Node.js, Next.js, TypeScript</p>
                                    <p>Certifications: GCP Associate Cloud Engineer</p>
                                    <p>Interests: Snowboarding, Mountain Biking, Hiking</p>
                                </Typewriter>
                            </div>
                        </div>
                    </div>
                    <div className={styles.scannerContainer}>
                        <div className={styles.scannerBox}></div>
                    </div>
                    <div style={{bottom: '5%', left: '50%'}} className={`${styles.positioner}`}>
                        <Button action={tempClick} label='Download CV' />
                    </div>
                </div>
            </div>
            
        </main>
    );
};

export default CVPage;