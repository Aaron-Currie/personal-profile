'use client';
import { MissionPin } from '@/components/pins/pins';
import styles from './page.module.css';
import { projects } from '@/constants/projects';
import { Fragment, use, useEffect, useState } from 'react';
import Button from '@/components/button/button';
import CarouselWrapper from '@/components/carousel-wrapper/carousel-wrapper';

export default function Portfolio() {
    const [projectNo, setProjectNo] = useState(null);
    const [backgroundZoom, setBackgroundZoom] = useState(null);

    const handleClick = (project, index) => {
        if (projectNo) {
            setProjectNo(null);
            setBackgroundZoom(null);
        } else {
            setProjectNo(index);
            setBackgroundZoom(project.pinData);
        }
    }

    const closeModal = () => {
        setProjectNo(null);
        setBackgroundZoom(null);
    }

    useEffect(() => {
        console.log(projectNo, 'PROJECT NO')
    }, [projectNo]);

    return (
        <main>
            <div style={{backgroundSize: backgroundZoom? '230% 240%' : '110% 120%', backgroundPosition: backgroundZoom? `${backgroundZoom.left} ${backgroundZoom.top}`: ''}} className={styles.portfolioContainer}>
                {projects.map((project, index) => {
                    return (
                        <Fragment key={project.name}>
                            {projectNo === null && <MissionPin mission={project.pinData} handleClick={() => {handleClick(project, index)}}/>}
                            {projectNo === index && (
                                <section className={styles.portfolioProject}>
                                    <Button action={closeModal} label={'×'} type='icon' />
                                    <h2>{project.name}</h2>
                                    <p>Tech: <i>{project.tech}</i></p>
                                    <p>Repo: {project.repo}</p>
                                    <p>Live Link: <a href={project.link}>{project.link}</a></p>
                                    <h3>App Concept</h3>
                                    <p>{project.concept}</p>
                                    <h3>Description</h3>
                                    <p>{project.description}</p>
                                    <CarouselWrapper>
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
                                </section>
                        )}
                        </Fragment>
                    )
                })}
            </div>
        </main>
    );
}