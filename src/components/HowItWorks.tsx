'use client';

import { motion } from 'framer-motion';
import { PhoneIncoming, Bot, TrendingUp } from 'lucide-react';
import styles from './HowItWorks.module.css';

const steps = [
    {
        title: 'Call Comes In',
        description: 'A customer calls your business number. No changes needed to your existing lines.',
        icon: PhoneIncoming,
    },
    {
        title: 'AI Handles the Conversation',
        description: 'Our AI answers instantly, understanding context, emotion, and intent just like a human.',
        icon: Bot,
    },
    {
        title: 'Business Gets Results',
        description: 'Appointments are booked, questions answered, and data synced to your CRM automatically.',
        icon: TrendingUp,
    },
];

export default function HowItWorks() {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>How It Works</h2>
                    <p className={styles.subtitle}>Simple setup. Powerful results.</p>
                </div>

                <div className={styles.steps}>
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            className={styles.step}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                        >
                            <div className={styles.iconWrapper}>
                                <step.icon className={styles.icon} />
                            </div>
                            <div className={styles.content}>
                                <h3 className={styles.stepTitle}>{step.title}</h3>
                                <p className={styles.stepDescription}>{step.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
