'use client';

import Link from 'next/link';
import Image from 'next/image';
import styles from './SocialCTA.module.css';
import FrameAnimation from './FrameAnimation';

export function SocialProof() {
    return (
        <section className={styles.socialSection}>
            <div className={styles.socialHeader}>
                <h2 className={styles.socialTitle}>Trusted by Industry Leaders</h2>
                <p style={{ color: 'var(--secondary)' }}>From HVAC to Medical Services</p>
            </div>

            <div className={styles.grid}>
                <Testimonial
                    quote="We missed 30% of calls before Apex. Now, every single caller gets booked instantly. It doubled our revenue in 3 months."
                    author="Sarah J."
                    role="Owner, HVAC Pro"
                    imageSrc="/images/avatars/sarah.png"
                />
                <Testimonial
                    quote="The voice is so natural, patients don't even know they're talking to an AI. It's a game changer for our clinic."
                    author="Dr. Chen"
                    role="Medical Director"
                    imageSrc="/images/avatars/chen.png"
                />
                <Testimonial
                    quote="Setup took less than an hour. The integration with our CRM is flawless."
                    author="Mike R."
                    role="Agency Founder"
                    imageSrc="/images/avatars/mike.png"
                />
            </div>
        </section>
    );
}

function Testimonial({ quote, author, role, imageSrc }: { quote: string; author: string; role: string; imageSrc: string }) {
    return (
        <div className={styles.testimonialCard}>
            <p className={styles.quote}>"{quote}"</p>
            <div className={styles.author}>
                <div className={styles.avatarWrapper}>
                    <Image
                        src={imageSrc}
                        alt={author}
                        width={48}
                        height={48}
                        className={styles.avatarImage}
                    />
                </div>
                <div className={styles.authorInfo}>
                    <h4>{author}</h4>
                    <span>{role}</span>
                </div>
            </div>
        </div>
    );
}

export function FinalCTA() {
    return (
        <section className={styles.ctaSection}>
            <div className={styles.ctaBackground}>
                <FrameAnimation
                    frameCount={192}
                    path="/images/animation/frame_"
                    fps={30}
                    className={styles.animationCanvas}
                />
                <div className={styles.overlay} />
            </div>
            <div className={styles.ctaContent}>
                <h2 className={styles.ctaTitle}>Unlock 24/7 Voice Automation</h2>
                <Link href="#book" className={styles.ctaButton}>
                    Book a Demo
                </Link>
            </div>
        </section>
    );
}
