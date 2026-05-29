
'use client';
import { useState } from 'react';
import TimeLine from '@/components/timeline/timeline';
import { experience } from '@/constants/experience';
import MissionLoadingScreen from '@/components/loading/mission-loading-screen';

const INTRO_IMAGES = experience.flatMap(exp => [exp.backgroundImage, ...exp.images]);

export default function Experience() {
    const [introLoading, setIntroLoading] = useState(true);
    return (
        <>
            {introLoading && (
                <MissionLoadingScreen
                    images={INTRO_IMAGES}
                    buttonText="View Timeline"
                    title="MISSION DEBRIEF"
                    onComplete={() => setIntroLoading(false)}
                >
                    <h3>Timeline Reconstruction Complete</h3>
                    <p>Operative, the timeline traversal operation has concluded successfully.</p>
                    <p>Agent AC1178's full career history has been recovered across multiple operational theatres. Records span international deployments, technical training, and field operations.</p>
                    <p>Proceed to review the reconstructed timeline intelligence.</p>
                </MissionLoadingScreen>
            )}
            <main>
            {experience.map((exp) => {
                return (
                    <TimeLine 
                        key={exp.title} 
                        backgroundImage={exp.backgroundImage} 
                        layout={exp.layout} 
                        details={{missionTitle: exp.title}} 
                        images={exp.images}
                        description={exp.description}
                    >
                        {exp.timeline}
                    </TimeLine>
                );
            })}
        </main>
        </>
    );
}