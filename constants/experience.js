import styles from '../app/experience/page.module.css';

export const experience = [
    {
        title: 'Software Engineer',
        backgroundImage: '/timeline/apartment.png',
        layout: 'center',
        images: ['/personal/hobbies1.jpg', 
                 '/personal/hobbies2.jpg', 
                 '/personal/hobbies5.jpg'],
        timeline : <div aria-hidden={true} inert className={`${styles.timeLine} ${styles.middle100} `}></div>,
        description: {
            company: 'Sky',
            position: 'Software Engineer',
            time: 'March 2024 - Present, 1 year 8 months',
            bio: 'I\'m a full-stack developer with 2.5 years of industry experience at Sky, where I quickly progressed from junior to mid-level after transitioning into tech from a diverse background in hospitality and laboratory management. I\'ve delivered a wide range of projects across modern frontends and cloud-native backends, working with technologies like React, Next.js, Google Cloud, and Docker.',
            points: [
                'Led migration from Next.js Pages Router to App Router, improving codebase scalability and developer experience.',
                'Designed and implemented a secure, scalable article ingestion pipeline using GCP (API Gateway, Cloud Functions, Pub/Sub).',
                'Migrated search from Azure to Elasticsearch, enhancing search performance and reliability.',
                'Mentored new engineers and technically led a graduate team on an internal tool, covering planning, PR reviews, and architectural guidance.',
                'Integrated authentication across stage sites with NextAuth and custom middleware.',
                'Cybersecurity Champion (Green Belt Level), ensuring best practices across development'
            ]
        }
    },
    {
        title: 'Associate Software Engineer',
        backgroundImage: '/timeline/city.png',
        layout: 'right',
        images: ['/personal/hobbies3.jpg', 
                 '/personal/hobbies4.jpg', 
                 '/personal/hobbies6.jpeg'],
        timeline : <>
            <div className={`${styles.timeLine} ${styles.top50} `}></div>
            <div className={`${styles.timeLine} ${styles.right50} `}></div>
            <div className={`${styles.timeLine} ${styles.bottomRight50} `}></div>
        </>,
        description: {
            company: 'Sky',
            position: 'Associate Software Engineer',
            time: 'March 2023 - March 2024, 1 year',
            bio: 'I worked as an Associate Software Engineer at Sky, where I contributed to various projects and gained valuable experience in software development.',
            points: [
                'Contributed to multiple projects across the Sky platform.',
                'Gained experience in both frontend and backend development.',
                'Collaborated with cross-functional teams to deliver high-quality software solutions.'
            ]
        }
    },
    {
        title: 'Northcoders Bootcamp',
        backgroundImage: '/timeline/campus.png',
        layout: 'center',
        images: ['/personal/hobbies2.jpg', 
                 '/personal/hobbies4.jpg', 
                 '/personal/hobbies5.jpg'],
        timeline : <>
            <div className={`${styles.timeLine} ${styles.topRight50} `}></div>
            <div className={`${styles.timeLine} ${styles.right50} `}></div>
            <div className={`${styles.timeLine} ${styles.bottom50} `}></div>
        </>,
        description: {
            company: 'Northcoders Bootcamp',
            position: 'Full Stack Developer Trainee',
            time: 'September 2022 - March 2023, 6 months',
            bio: 'I completed a full-stack developer training program at Northcoders Bootcamp, where I learned modern web development technologies and practices.',
            points: [
                'Learned modern web development technologies including JavaScript, React, Node.js, and SQL.',
                'Built several full-stack applications as part of the curriculum.',
                'Collaborated with peers on group projects to enhance teamwork skills.'
            ]
        }
    },
    {
        title: 'Bar Manager',
        backgroundImage: '/timeline/shore.png',
        layout: 'left',
        images: ['/personal/hobbies1.jpg', 
                 '/personal/hobbies6.jpeg',
                 '/personal/hobbies3.jpg',
            ], 
        timeline : <><div className={`${styles.timeLine} ${styles.top50} `}></div>
        <div className={`${styles.timeLine} ${styles.right50} `}></div>
        <div className={`${styles.timeLine} ${styles.left50} `}></div>
        <div className={`${styles.timeLine} ${styles.bottomLeft50} `}></div>
        <div className={`${styles.timeLine} ${styles.bottomRight50} `}></div></>
        ,
        description: {
            company: 'Seasalt Clovelly',
            position: 'Bar Manager',
            time: 'June 2021 - September 2022, 1 year 3 months',
            bio: 'I managed a bar, overseeing operations, staff, and customer service while ensuring a high-quality experience for patrons.',
            points: [
                'Managed daily operations of the bar, including staff scheduling and inventory management.',
                'Ensured high standards of customer service and satisfaction.',
                'Developed and implemented new drink menus and promotions to attract customers.'
                ,
            ]
        }
    },
    {
        title: 'Self Learning Code Academy',
        backgroundImage: 'timeline/city-mountains.png',
        layout: 'right',
        images: ['/personal/hobbies5.jpg', 
                 '/personal/hobbies3.jpg',
                 '/personal/hobbies2.jpg',
            ], 
        timeline : <><div className={`${styles.timeLine} ${styles.topRight50} `}></div>
        <div className={`${styles.timeLine} ${styles.topLeft50} `}></div>
        <div className={`${styles.timeLine} ${styles.bottomRight50} `}></div>
        <div className={`${styles.timeLine} ${styles.bottomLeft50} `}></div></>
        ,
        description: {
            company: 'Self Learning Code Academy',
            position: 'Student',
            time: 'January 2021 - June 2021, 6 months',
            bio: 'I completed a self-directed coding academy, where I focused on learning web development skills and building projects to enhance my programming abilities.',
            points: [
                'Engaged in self-directed learning to master web development technologies.',
                'Built several personal projects to apply learned skills in real-world scenarios.',
                'Participated in online coding communities to share knowledge and collaborate with others.'
            ]
        }
    },
    {
        title: 'Bar Supervisor',
        backgroundImage: 'timeline/mountain-town.png',
        layout: 'center',
        images: ['/personal/hobbies1.jpg', 
                 '/personal/hobbies4.jpg',
                 '/personal/hobbies2.jpg',
            ], 
        timeline : <><div className={`${styles.timeLine} ${styles.topRight50} `}></div>
        <div className={`${styles.timeLine} ${styles.topLeft50} `}></div>
        <div className={`${styles.timeLine} ${styles.right50} `}></div>
        <div className={`${styles.timeLine} ${styles.left50} `}></div>
            <div className={`${styles.timeLine} ${styles.bottom50} `}></div></>
        ,
        description: {
            company: 'Thredbo Ski Resort',
            position: 'Bar Supervisor',
            time: 'June 2020 - January 2021, 7 months',
            bio: 'I supervised bar operations, ensuring smooth service and high standards of quality while managing a team of bartenders.',
            points: [
                'Supervised daily bar operations, including staff management and customer service.',
                'Maintained high standards of cleanliness and organization in the bar area.',
                'Trained new staff on bar procedures and customer service best practices.'
            ]
        }
    },
    {
        title: 'Various Roles and Travel',
        backgroundImage: '/timeline/jungle.png',
        layout: 'left',
        images: ['/personal/hobbies1.jpg', 
                 '/personal/hobbies5.jpg',
                 '/personal/hobbies6.jpeg',
            ], 
        timeline : <><div className={`${styles.timeLine} ${styles.top50} `}></div>
        <div className={`${styles.timeLine} ${styles.left50} `}></div>
        <div className={`${styles.timeLine} ${styles.bottomLeft50} `}></div></>
        ,
        description: {
            company: 'Various',
            position: 'Hospitality Work, Farm Work, Hostel Work',
            time: 'January 2019 - June 2020, 1 year 5 months',
            bio: 'I traveled extensively while working in various hospitality roles, gaining diverse experiences and skills in customer service and operations.',
            points: [
                'Worked in various hospitality roles while traveling, enhancing customer service skills.',
                'Adapted to different work environments and cultures during travels.',
                'Developed strong problem-solving and communication skills through diverse experiences.'
            ]
        }
    },
    {
        title: 'Senior Laboratory Technician',
        backgroundImage: 'timeline/lab.png',
        layout: 'center',
        images: ['/personal/hobbies4.jpg', 
                 '/personal/hobbies5.jpg',
                 '/personal/hobbies2.jpg',
            ], 
        timeline : <><div className={`${styles.timeLine} ${styles.topLeft50} `}></div>
        <div className={`${styles.timeLine} ${styles.left50} `}></div>
        <div className={`${styles.timeLine} ${styles.bottom50} `}></div></>
        ,
        description: {
            company: 'Thorden Academy',
            position: 'Senior Laboratory Technician',
            time: 'June 2016 - January 2019, 2 years 7 months',
            bio: 'I worked as a Senior Laboratory Technician, managing laboratory operations and supporting research projects in a university setting.',
            points: [
                'Managed laboratory operations, including equipment maintenance and safety protocols.',
                'Supported research projects by providing technical expertise and assistance.',
                'Trained and supervised junior laboratory staff on procedures and safety practices.',
                'Ensured compliance with health and safety regulations in the laboratory environment.',
                'Contributed to research publications and presentations based on laboratory findings.',
            ]
        }
    },
]