'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import FrameAnimation from './FrameAnimation';
import styles from './Hero.module.css';

export default function Hero() {
    return (
        <section className={styles.section}>
            {/* Background Animation */}
            <div className={styles.animContainer}>
                <FrameAnimation
                    path="/hero-animation/frame_"
                    frameCount={191}
                    fps={30}
                />
            </div>

            <div className={styles.container}>
                {/* Content Overlay */}
                <div className={styles.content}>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className={styles.headline}
                    >
                        Voice AI That Sounds <br /> Like Your Best Rep
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className={styles.subheadline}
                    >
                        Automate booking, routing, and support with human-quality voice agents.
                        <br />
                        Convert more leads, 24/7.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                        className={styles.ctaGroup}
                    >
                        <Link href="#book" className={styles.primaryButton}>
                            Book a Demo
                        </Link>
                        <Link href="#listen" className={styles.secondaryButton}>
                            Hear the AI in Action
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
