
import TimeLine from '@/components/timeline/timeline';
import styles from './page.module.css'
import { experience } from '@/constants/experience';

export default function Experience() {
    return (
        <main>
            {experience.map((exp, index) => {
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
    );
}