'use client';
import React from 'react';
import styles from './page.module.css';
import { tech } from '@/constants/tech';
import CollapsableSection from '@/components/collapsable-section/collapsable-section';
import FlipGrid from '@/components/flip-grid/flip-grid';

const SkillsPage = () => {
    return (
        <main className={`flex-col flex-center main-offset ${styles.container}`}>
            <h1>Skills</h1>
            <p>An insight into the agent’s primary tools, frameworks, and skills acquired through field operations and cross-disciplinary training.</p>
            <br></br>
            <CollapsableSection title="Skills At A Glance">
            <FlipGrid>
                {tech.map((item, index) => {
                    return <FlipGrid.Item key={index}>
                        <FlipGrid.ItemFront>
                            <img src={item.icon} alt="Skills Icon" className={styles.logo} />
                        </FlipGrid.ItemFront>
                        <FlipGrid.ItemBack>
                            <h3>{item.name}</h3>
                            <p>{item.description}</p>
                        </FlipGrid.ItemBack>
                    </FlipGrid.Item>
                })}
            </FlipGrid>
            </CollapsableSection>
            <CollapsableSection title="Frontend">
                <p>Proficient in crafting dynamic and responsive user interfaces using modern web technologies.</p>
            </CollapsableSection>
            <CollapsableSection title="Backend">
                <p>Experienced in building robust backend systems, ensuring data integrity and security.</p>
            </CollapsableSection>
            <CollapsableSection title="DevOps & Cloud">
                <p>Skilled in deploying and managing applications in cloud environments, with a focus on automation and scalability.</p>
            </CollapsableSection>
            <CollapsableSection title="Testing & Quality Assurance">
                <p>Committed to delivering high-quality software through rigorous testing and continuous integration practices.</p>
            </CollapsableSection>
            <CollapsableSection title="Other Skills">
                <p>Strong communication and collaboration skills, with a focus on teamwork and problem-solving.</p>
            </CollapsableSection>
        </main>
    );
};

export default SkillsPage;