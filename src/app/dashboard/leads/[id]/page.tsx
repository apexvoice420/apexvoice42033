"use client";

import React, { useEffect, useState, use } from 'react';
import { doc, onSnapshot, updateDoc, collection, query, where, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Lead } from '@/types';
import { Phone, MapPin, Star, Clock, FileText, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LeadDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const { id } = resolvedParams;
    const [lead, setLead] = useState<Lead | null>(null);
    const [loading, setLoading] = useState(true);
    const [calling, setCalling] = useState(false);
    const [note, setNote] = useState('');
    const [timeline, setTimeline] = useState<any[]>([]);

    useEffect(() => {
        const unsubscribeLead = onSnapshot(doc(db, 'leads', id), (doc) => {
            if (doc.exists()) {
                setLead({ id: doc.id, ...doc.data() } as Lead);
            }
            setLoading(false);
        });

        // Mock timeline or fetch calls
        const qCalls = query(collection(db, 'calls'), where('leadId', '==', id), orderBy('createdAt', 'desc'));
        const unsubscribeCalls = onSnapshot(qCalls, (snapshot) => {
            const calls = snapshot.docs.map(d => ({ id: d.id, type: 'call', ...d.data() }));
            setTimeline(calls);
        });

        return () => {
            unsubscribeLead();
            unsubscribeCalls();
        };
    }, [id]);

    const handleCall = async () => {
        setCalling(true);
        try {
            const response = await fetch('/api/call', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ leadId: id })
            });
            if (!response.ok) throw new Error('Call failed');
            alert('VAPI Call Initiated!');
        } catch (error) {
            alert('Error making call');
            console.error(error);
        } finally {
            setCalling(false);
        }
    };

    const updateStatus = async (newStatus: any) => {
        await updateDoc(doc(db, 'leads', id), { status: newStatus });
    };

    if (loading) return <div className="p-8"><Loader2 className="animate-spin" /></div>;
    if (!lead) return <div className="p-8">Lead not found</div>;

    return (
        <div className="max-w-6xl mx-auto">
            <Link href="/dashboard" className="flex items-center text-slate-400 hover:text-white mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Lead Info */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                        <h1 className="text-2xl font-bold mb-2">{lead.businessName}</h1>
                        <div className="flex items-center text-yellow-400 mb-6">
                            <Star className="w-4 h-4 mr-1 fill-current" />
                            <span className="font-bold">{lead.rating}</span>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-slate-500 uppercase font-bold">Status</label>
                                <select
                                    value={lead.status}
                                    onChange={(e) => updateStatus(e.target.value)}
                                    className="w-full mt-1 bg-slate-900 border border-slate-700 rounded p-2"
                                >
                                    <option value="New Lead">New Lead</option>
                                    <option value="Called">Called</option>
                                    <option value="Demo Booked">Demo Booked</option>
                                    <option value="Not Interested">Not Interested</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-xs text-slate-500 uppercase font-bold">Phone</label>
                                <div className="flex items-center mt-1">
                                    <Phone className="w-4 h-4 mr-2 text-slate-400" />
                                    <span className="text-lg">{lead.phone}</span>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs text-slate-500 uppercase font-bold">Location</label>
                                <div className="flex items-center mt-1">
                                    <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                                    <span>{lead.city}, {lead.state || 'USA'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <button
                                onClick={handleCall}
                                disabled={calling}
                                className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded flex items-center justify-center gap-2"
                            >
                                {calling ? <Loader2 className="animate-spin" /> : <Phone />}
                                Call Now
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Activity & Notes */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                        <h2 className="text-xl font-bold mb-4">Activity Timeline</h2>
                        <div className="space-y-6">
                            {/* Add manual note logic here if needed, for now just call log */}
                            {timeline.length === 0 ? (
                                <p className="text-slate-500 italic">No activity yet.</p>
                            ) : (
                                timeline.map((event) => (
                                    <div key={event.id} className="flex gap-4">
                                        <div className="mt-1">
                                            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                                                <Phone className="w-4 h-4" />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-bold">Automated Call</p>
                                            <p className="text-sm text-slate-400">
                                                Status: {event.status} • Duration: {event.duration ? `${event.duration}s` : '...'}
                                            </p>
                                            {event.transcript && (
                                                <div className="mt-2 p-3 bg-slate-900 rounded text-sm text-slate-300">
                                                    "{event.transcript}"
                                                </div>
                                            )}
                                            <p className="text-xs text-slate-600 mt-1">
                                                {event.createdAt?.seconds ? new Date(event.createdAt.seconds * 1000).toLocaleString() : 'Just now'}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
