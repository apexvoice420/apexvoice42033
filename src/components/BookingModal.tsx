'use client';

import { useState } from 'react';
import { X, Check, Loader2 } from 'lucide-react';
import styles from './BookingModal.module.css';

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        message: ''
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const WEBHOOK_URL = process.env.NEXT_PUBLIC_GOOGLE_SHEET_URL || 'https://script.google.com/macros/s/AKfycby9KTHybDogFssgB1I-Aj0iMZ5qmHtpZue68uS7qP38WS00JhyoP13An0EGWWsvs4-l/exec';

        if (!WEBHOOK_URL) {
            alert('Booking System Config Error: Missing NEXT_PUBLIC_GOOGLE_SHEET_URL');
            setIsLoading(false);
            return;
        }

        try {
            // Use URLSearchParams for application/x-www-form-urlencoded
            const params = new URLSearchParams();
            params.append('name', formData.name);
            params.append('email', formData.email);
            params.append('phone', formData.phone);
            params.append('company', formData.company);
            params.append('message', formData.message);

            await fetch(WEBHOOK_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: params.toString()
            });

            // Since 'no-cors' mode is opaque, we assume success if no network error thrown
            setIsSuccess(true);
            setTimeout(() => {
                onClose();
                setIsSuccess(false); // Reset for next time
                setFormData({ name: '', email: '', phone: '', company: '', message: '' });
            }, 3000);

        } catch (error) {
            console.error('Submission error:', error);
            alert('Failed to submit form. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className={styles.modal}>
                <button onClick={onClose} className={styles.closeButton}>
                    <X size={20} />
                </button>

                {isSuccess ? (
                    <div className={styles.successMessage}>
                        <div className={styles.iconWrapper}>
                            <Check size={24} />
                        </div>
                        <h3 className={styles.successTitle}>Request Sent!</h3>
                        <p>We'll be in touch shortly to schedule your demo.</p>
                    </div>
                ) : (
                    <>
                        <div className={styles.header}>
                            <h2 className={styles.title}>Book a Demo</h2>
                            <p className={styles.subtitle}>Let's see how our AI can transform your business.</p>
                        </div>

                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    className={styles.input}
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    className={styles.input}
                                    placeholder="john@company.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    required
                                    className={styles.input}
                                    placeholder="+1 (555) 000-0000"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Company Name</label>
                                <input
                                    type="text"
                                    name="company"
                                    className={styles.input}
                                    placeholder="Acme Inc."
                                    value={formData.company}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Anything specific you want to see?</label>
                                <textarea
                                    name="message"
                                    className={styles.textarea}
                                    placeholder="I'm interested in..."
                                    value={formData.message}
                                    onChange={handleChange}
                                />
                            </div>

                            <button type="submit" className={styles.submitButton} disabled={isLoading}>
                                {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Schedule Demo'}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
