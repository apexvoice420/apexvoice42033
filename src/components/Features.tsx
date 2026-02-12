'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Mic, Calendar, GitBranch } from 'lucide-react';
import styles from './Features.module.css';

const features = [
    {
        title: 'AI Voice Agents',
        description: 'Human-quality agents that answer every call immediately. No robots, no wait times, just natural conversation.',
        icon: Mic,
    },
    {
        title: 'Automated Booking',
        description: 'Seamlessly schedule appointments directly into your calendar while you sleep. Integrates with Cal.com, Calendly, and more.',
        icon: Calendar,
    },
    {
        title: 'Deep Integrations',
        description: 'Connects with your CRM and workflows. Automatically update leads, trigger follow-ups, and log calls without lifting a finger.',
        icon: GitBranch,
    },
];

export default function Features() {
    return (
        <section className={styles.section} id="features">
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Why Apex?</h2>
                    <p className={styles.subtitle}>
                        Replace your voicemail with an intelligent workforce that never sleeps.
                    </p>
                </div>

                <div className={styles.featuresGrid}>
                    {features.map((feature, index) => (
                        <FeatureCard key={index} feature={feature} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function FeatureCard({ feature, index }: { feature: any; index: number }) {
    const cardRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: cardRef,
        offset: ['start end', 'start center']
    });

    const floatY = useTransform(scrollYProgress, [0, 1], [50, 0]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

    return (
        <motion.div
            ref={cardRef}
            className={styles.card}
            style={{ opacity, y: floatY, top: 200 + index * 30 }} // Increased spacing
        >
            <div className={styles.cardGlow} />
            <div className={styles.cardContent}>
                <feature.icon className={styles.cardIcon} />
                <h3 className={styles.cardTitle}>{feature.title}</h3>
                <p className={styles.cardDescription}>{feature.description}</p>
            </div>
        </motion.div>
    );
}
