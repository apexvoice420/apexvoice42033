'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';

export default function Calls() {
    const [calls, setCalls] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/calls')
            .then(res => res.json())
            .then(data => {
                setCalls(data);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-8">Call History</h1>

            <div className="bg-slate-800 rounded border border-slate-700 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-900 border-b border-slate-700 text-slate-400">
                        <tr>
                            <th className="p-4">Date</th>
                            <th className="p-4">Lead</th>
                            <th className="p-4">Phone</th>
                            <th className="p-4">Outcome</th>
                            <th className="p-4">Duration</th>
                            <th className="p-4">Transcript</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                        {calls.map((call: any) => (
                            <tr key={call.id} className="hover:bg-slate-750">
                                <td className="p-4 text-slate-300">
                                    {format(new Date(call.created_at), 'MMM d, h:mm a')}
                                </td>
                                <td className="p-4 font-medium">{call.leads?.business_name}</td>
                                <td className="p-4 font-mono text-sm">{call.phone_number}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs uppercase font-bold
                    ${call.outcome === 'interested' ? 'bg-green-900 text-green-300' :
                                            call.outcome === 'not_interested' ? 'bg-red-900 text-red-300' :
                                                'bg-slate-700 text-slate-300'}`}>
                                        {call.outcome || 'pending'}
                                    </span>
                                </td>
                                <td className="p-4 text-slate-400">{call.duration ? `${call.duration}s` : '-'}</td>
                                <td className="p-4 max-w-xs truncate text-slate-500 text-sm">
                                    {call.transcript}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
