'use client';
import styles from './page.module.css';
import { projects } from '@/constants/projects';
import { useEffect, useState } from 'react';
import MissionLoadingScreen from '@/components/loading/mission-loading-screen';
import PortfolioHologram from '@/components/quick-profile-comps/portfolio-hologram';

const INTRO_IMAGES = [
    '/backgrounds/lab.png',
    '/locker.png',
    ...projects.flatMap(p => p.images.map(img => img.image)).filter(Boolean),
];

export default function Portfolio() {
    const [introLoading, setIntroLoading] = useState(true);
    const [projectNo, setProjectNo] = useState(null);
    const [backgroundZoom, setBackgroundZoom] = useState(null);
    const [project, setProject] = useState(null);

    const handleClick = (project, index) => {
        if (projectNo) {
            setProjectNo(null);
            setBackgroundZoom(null);
            setProject(null);
        } else {
            setProjectNo(index);
            setBackgroundZoom(project.pinData);
            setProject(project);
        }
    }

    const closeModal = () => {
        setProjectNo(null);
        setBackgroundZoom(null);
        setProject(null);
    }

    useEffect(() => {
        console.log(projectNo, 'PROJECT NO')
    }, [projectNo]);

    return (
        <>
            {introLoading && (
                <MissionLoadingScreen
                    images={INTRO_IMAGES}
                    title="MISSION DEBRIEF"
                    onComplete={() => setIntroLoading(false)}
                >
                    <h3>Vault Breach Successful</h3>
                    <p>Operative, the vault infiltration operation has concluded successfully.</p>
                    <p>Agent AC1178's classified project portfolio has been accessed. Files contain mission records, technical blueprints, and deployment data for multiple operations.</p>
                    <p>Proceed to review the extracted project files.</p>
                </MissionLoadingScreen>
            )}
            <main className={`${styles.main}`}>
                <PortfolioHologram />
            </main>
            {/* <main className={styles.main}>
            <div style={{backgroundSize: backgroundZoom? '230% 240%' : '110% 120%', backgroundPosition: backgroundZoom? `${backgroundZoom.left} ${backgroundZoom.top}`: ''}} className={styles.portfolioContainer}>
                {projects.map((project, index) => {
                    return projectNo === null && <MissionPin mission={project.pinData} handleClick={() => {handleClick(project, index)}} key={project.name}/>
                })}
            </div>
           {project && (
            <LightModal closeModal={closeModal}>
                <div className={styles.modalContent}>
                {project && (
                    <MultiSection>
                        <MultiSection.Section sectionTitle='Details'>
                            <h2>{project.name}</h2>
                            <p>Tech: <i>{project.tech}</i></p>
                            <p>Repo: {project.repo}</p>
                            <p>Live Link: <a href={project.link}>{project.link}</a></p>
                            <h3>App Concept</h3>
                            <p>{project.concept}</p>
                            <h3>Description</h3>
                            <p>{project.description}</p>
                        </MultiSection.Section>
                        <MultiSection.Section sectionTitle='Images'>
                            {project.display === 'carousel' && (
                            <CarouselWrapper size='dynamic'>
                            {project.images.map((quest, index) => {
                                return (
                                    <img
                                    key={index}
                                    src={quest.image}
                                    alt={`Slide ${index}`}
                                    className={`${styles.carouselImage}`}
                                />
                                )
                            })}
                            </CarouselWrapper>
                            )}
                            {project.display === 'grid' && (
                                <ImageGrid images={project.images.map((quest) => quest.image)} />
                            )}
                        </MultiSection.Section>
                    </MultiSection>
                        )}
                </div>
            </LightModal>
            )}
        </main> */}
        </>
    );
}