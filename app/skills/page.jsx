'use client';
import React from 'react';
import styles from './page.module.css';
import { tech } from '@/constants/tech';
import CollapsableSection from '@/components/collapsable-section/collapsable-section';
import FlipGrid from '@/components/flip-grid/flip-grid';
import Cards from '@/components/cards/cards';
import AnimatedLights from '@/components/animated-lights/animated-lights';

const SkillsPage = () => {
    return (
        <main className={`flex-col flex-center main-offset ${styles.container}`}>
            <h1>Skills</h1>
            <CollapsableSection title="Tech At A Glance">
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
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Tech Stacks</h2>
                <CollapsableSection title="Frontend">
                    <h3>React, Next.js, JavaScript, TypeScript, HTML, CSS, SCSS, Styled Components</h3>
                    <p>Agent developed frontend skills through intensive project work while self learning with code academy and during the Northcoders bootcamp. They continue to sharpen these skills at there role with Sky, where they architect reusable UI components and design responsive, accessible interfaces. React and Next.js is used on a daily basis to build performant web applications, with CSS, SCSS and Styled Components to streamline styling.</p>
                </CollapsableSection>
                <CollapsableSection title="Backend">
                    <h3>Node.js, Express, Koa, REST APIs</h3>
                    <p>Agents backend experience began during full-stack bootcamp projects, building RESTful APIs and integrating databases. At Sky, they expanded their skills working on ingestion pipelines and backend services using Node.js, GCP and KOA. Recently they have implemented user authentication, data validation, and built backend logic across personal and professional projects.</p>
                </CollapsableSection>
                <CollapsableSection title="DevOps & Cloud">
                    <h3>Google Cloud Platform, AWS, Docker, Terraform, Octopus Deploy, Circle CI</h3>
                    <p>As a google certified Associate Cloud Engineer, the agent has deployed services using GCP and AWS, highlighting their working around building an ingestion pipeline using webhooks, cloud functions, pub sub and api gateways. At Sky, they manage infrastructure using Terraform and Octopus, and have containerized applications with Docker. They are tasked with maintaining and improving the CI/CD pipelines to automate testing and deployments, ensuring smooth and reliable releases.</p>
                </CollapsableSection>
                <CollapsableSection title="Other Technologies">
                    <h3>Git, GitHub, Jest, React Testing Library, Cypress, Insomnia, Postman, Docker, Len - Kubernetes dashboard, Husky</h3>
                    <p>Agent uses a broad range of supporting technologies to ensure software quality, maintainability, and collaboration. Git and GitHub are used daily for version control, managing branches and pull requests in team environments. Jest and React Testing Library are used extenstively to write effective unit and integration tests, while Cypress supports end-to-end testing of complex user flows. Tools like Insomnia and Postman are essential for API testing and validation during backend development.</p>
                    <p>The agent has used Docker to containerize apps for local development and deployment, and Lens to monitor Kubernetes clusters and troubleshoot deployed services. These tools enable testable code and support robust, well-monitored software throughout the development lifecycle.</p>
                </CollapsableSection>
            </section>
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Skills</h2>
                <Cards>
                    <Cards.Item size='md'>
                        <img src="/skills/coms.png" />
                        <div className={styles.cardContent}>
                            <h3>Communication</h3>
                            <p>Clear and confident communicator across both technical and non-technical audiences. The agent regularly presents ideas, contributes to team discussions, working with designers and product owners enabling shared understanding and smooth collaboration.</p>
                        </div>
                    </Cards.Item>
                    <Cards.Item size='md'>
                        <img src="/skills/leadership.png" />
                        <div className={styles.cardContent}>
                            <h3>Leadership</h3>
                            <p>In previous management roles, The agent led teams of up to 20 people, balancing operations, training, and motivation. They now apply those leadership skills in tech by mentoring juniors, taking ownership of features, and driving improvement in team workflows.</p>
                        </div>
                    </Cards.Item>
                    <Cards.Item size='md'>
                        <img src="/skills/learning.png" />
                        <div className={styles.cardContent}>
                            <h3>Self-Learning</h3>
                            <p>Starting out as a self learner with front-end development to completing a full-stack bootcamp, The agent has shown take ownership of learning and development and are able to pick up new skills quickly. They enjoy experimenting with new tech and building side projects.</p>
                        </div>
                    </Cards.Item>
                    <Cards.Item size='md'>
                        <img src="/skills/teamwork.png" />
                        <div className={styles.cardContent}>
                            <h3>Teamwork</h3>
                            <p>Having worked in high-pressure team environments—from software teams to managing hospitality staff, they thrive when working with others. They are proactive about supporting teammates, resolving conflicts, and sharing knowledge to help everyone succeed.</p>
                        </div>
                    </Cards.Item>
                    <Cards.Item size='md'>
                        <img src="/skills/problem.png" />
                        <div className={styles.cardContent}>
                            <h3>Problem Solving</h3>
                            <p>Whether debugging code or streamlining a customer-facing process, The agent brings a logical, curious, and solution-focused mindset. They thrive when dissecting complex problems and building clean, reliable solutions.</p>
                        </div>
                    </Cards.Item>
                    <Cards.Item size='md'>
                        <img src="/skills/adaptability.png" />
                        <div className={styles.cardContent}>
                            <h3>Adaptability</h3>
                            <p>Having transitioned careers, worked internationally, and navigated fast-paced environments. The agent has proven they can adapt quickly to new tools, teams, and challenges—remaining calm and effective under pressure.</p>
                        </div>
                    </Cards.Item>
                </Cards>
            </section>
            <AnimatedLights />
        </main>
    );
};

export default SkillsPage;