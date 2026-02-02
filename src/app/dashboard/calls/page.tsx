"use client";

import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Phone, Clock, MessageSquare } from 'lucide-react';

interface CallLog {
    id: string;
    businessName: string;
    phoneNumber: string;
    status: string;
    outcome?: string;
    duration?: number;
    transcript?: string;
    createdAt: any;
}

export default function CallsPage() {
    const [calls, setCalls] = useState<CallLog[]>([]);
    const [selectedCall, setSelectedCall] = useState<CallLog | null>(null);

    useEffect(() => {
        const q = query(collection(db, 'calls'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setCalls(snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as CallLog[]);
        });
        return () => unsubscribe();
    }, []);

    return (
        <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Call History</h2>

            <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-900 border-b border-slate-700 text-slate-400 font-medium">
                        <tr>
                            <th className="p-4">Date</th>
                            <th className="p-4">Business</th>
                            <th className="p-4">Phone</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Duration</th>
                            <th className="p-4">Outcome</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                        {calls.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-slate-500">
                                    No calls recorded yet.
                                </td>
                            </tr>
                        ) : (
                            calls.map(call => (
                                <tr
                                    key={call.id}
                                    className="hover:bg-slate-700/50 cursor-pointer transition-colors"
                                    onClick={() => setSelectedCall(call)}
                                >
                                    <td className="p-4 text-slate-400">
                                        {call.createdAt?.seconds ? new Date(call.createdAt.seconds * 1000).toLocaleString() : 'Pending...'}
                                    </td>
                                    <td className="p-4 font-bold">{call.businessName}</td>
                                    <td className="p-4">{call.phoneNumber}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs uppercase font-bold
                        ${call.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                            {call.status}
                                        </span>
                                    </td>
                                    <td className="p-4">{call.duration ? `${call.duration}s` : '-'}</td>
                                    <td className="p-4 capitalize">{call.outcome || '-'}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Transcript Modal */}
            {selectedCall && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
                    <div className="bg-slate-800 p-6 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-slate-600">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold">Call Transcript</h3>
                            <button
                                onClick={() => setSelectedCall(null)}
                                className="text-slate-400 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="flex gap-4 text-sm text-slate-400 border-b border-slate-700 pb-4">
                                <div className="flex items-center gap-1">
                                    <Phone className="w-4 h-4" /> {selectedCall.phoneNumber}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" /> {selectedCall.duration}s
                                </div>
                            </div>

                            <div className="prose prose-invert max-w-none">
                                <p className="whitespace-pre-wrap leading-relaxed text-slate-300">
                                    {selectedCall.transcript || "No transcript available."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
