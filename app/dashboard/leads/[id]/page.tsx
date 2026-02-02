'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';

export default function LeadDetails({ params }: { params: { id: string } }) {
    const [lead, setLead] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/leads/${params.id}`)
            .then(res => res.json())
            .then(data => {
                setLead(data);
                setLoading(false);
            });
    }, [params.id]);

    const handleCall = async () => {
        // Call logic reuse
        try {
            const res = await fetch('/api/calls', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ leadId: lead.id })
            });
            const data = await res.json();
            if (data.success) alert('Call initiated!');
            else alert('Error: ' + data.error);
        } catch (e: any) {
            alert(e.message);
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;
    if (!lead) return <div className="p-8">Lead not found</div>;

    return (
        <div className="p-8 grid grid-cols-2 gap-8">
            <div>
                <h1 className="text-3xl font-bold mb-4">{lead.business_name}</h1>
                <div className="bg-slate-800 p-6 rounded border border-slate-700 space-y-4">
                    <div>
                        <label className="text-slate-400 text-sm">Status</label>
                        <div className="font-semibold text-lg">{lead.status}</div>
                    </div>
                    <div>
                        <label className="text-slate-400 text-sm">Phone</label>
                        <div className="font-mono text-lg">{lead.phone}</div>
                    </div>
                    <div>
                        <label className="text-slate-400 text-sm">Location</label>
                        <div>{lead.address}</div>
                        <div>{lead.city}, {lead.state}</div>
                    </div>
                    <div>
                        <label className="text-slate-400 text-sm">Rating</label>
                        <div className="text-yellow-400">{'⭐'.repeat(Math.round(lead.rating))} ({lead.rating})</div>
                    </div>

                    <button
                        onClick={handleCall}
                        className="w-full bg-blue-600 p-3 rounded font-bold hover:bg-blue-700"
                    >
                        Call Now via VAPI
                    </button>
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-bold mb-4">Activity</h2>
                <div className="space-y-4">
                    {lead.calls.map((call: any) => (
                        <div key={call.id} className="bg-slate-800 p-4 rounded border border-slate-700">
                            <div className="flex justify-between mb-2">
                                <span className="font-bold capitalize">{call.outcome || 'No outcome'}</span>
                                <span className="text-sm text-slate-400">
                                    {format(new Date(call.created_at), 'MMM d, h:mm a')}
                                </span>
                            </div>
                            <p className="text-slate-300 text-sm italic">"{call.transcript || 'No transcript available'}"</p>
                            <div className="mt-2 text-xs text-slate-500">Duration: {call.duration}s</div>
                        </div>
                    ))}
                    {lead.calls.length === 0 && (
                        <div className="text-slate-500">No calls yet.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
