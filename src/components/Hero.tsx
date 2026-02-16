'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { useState } from 'react';
import FrameAnimation from './FrameAnimation';
import styles from './Hero.module.css';
import VapiManager, { VapiRef } from './VapiManager';
import BookingModal from './BookingModal';

export default function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const vapiRef = useRef<VapiRef>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end start'],
    });

    const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 20 });

    // Animation values
    // Fix: Start fully visible (1) and fade out (0) as user scrolls down
    const contentOpacity = useTransform(smoothProgress, [0, 0.5], [1, 0]);
    const contentY = useTransform(smoothProgress, [0, 0.5], [0, 50]);


    const handleHearVoice = (e: React.MouseEvent) => {
        e.preventDefault();
        if (vapiRef.current) {
            vapiRef.current.toggle();
        }
    };


    return (
        <section ref={containerRef} className={styles.section}>
            <VapiManager ref={vapiRef} />
            {/* Background Animation */}
            <div className={styles.animContainer}>
                <FrameAnimation
                    path="/images/animation/frame_"
                    frameCount={191}
                    fps={30}
                />
            </div>

            <div className={styles.stickyContainer}>
                {/* Content Overlay */}
                <div className={styles.content}>
                    <motion.h1
                        className={styles.headline}
                        style={{ opacity: contentOpacity, y: contentY }}
                    >
                        Voice AI That Sounds <br /> Like Your Best Rep
                    </motion.h1>
                    <motion.p
                        className={styles.subheadline}
                        style={{ opacity: contentOpacity, y: contentY }}
                    >
                        Automate booking, routing, and support with human-quality voice agents.
                        <br />
                        Convert more leads, 24/7.
                    </motion.p>
                    <motion.div
                        className={styles.ctaGroup}
                        style={{ opacity: contentOpacity, y: contentY }}
                    >
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className={styles.primaryButton}
                            style={{ border: 'none', cursor: 'pointer', fontSize: 'inherit' }}
                        >
                            Book a Demo
                        </button>
                        <a
                            href="tel:+13863199076"
                            className="inline-flex flex-col items-center gap-2 px-10 py-5 bg-gradient-to-br from-indigo-500 to-purple-600 text-white no-underline rounded-2xl font-bold shadow-xl shadow-indigo-500/30 hover:scale-105 transition-transform"
                        >
                            <span className="text-2xl">📞</span>
                            <span className="text-sm">Call for Live Demo</span>
                            <span className="text-[10px] opacity-90">+1 (386) 319-9076</span>
                        </a>
                        <button
                            onClick={handleHearVoice}
                            className={styles.secondaryButton}
                            style={{ border: 'none', cursor: 'pointer', fontSize: 'inherit' }}
                        >
                            Hear the AI in Action
                        </button>
                    </motion.div>

                    <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
                </div>
            </div>
        </section >
    );
}
