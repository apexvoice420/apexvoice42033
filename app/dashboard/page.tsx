'use client';

import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const COLUMNS = ['New Lead', 'Called', 'Demo Booked', 'Not Interested'];

export default function Dashboard() {
    const [leads, setLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadLeads();
    }, []);

    const loadLeads = async () => {
        const res = await fetch('/api/leads');
        const data = await res.json();
        setLeads(data);
        setLoading(false);
    };

    const onDragEnd = async (result: any) => {
        if (!result.destination) return;

        const leadId = result.draggableId;
        const newStatus = result.destination.droppableId;

        setLeads(prev =>
            prev.map((lead: any) =>
                lead.id.toString() === leadId
                    ? { ...lead, status: newStatus }
                    : lead
            )
        );

        await fetch(`/api/leads/${leadId}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });
    };

    const handleCall = async (leadId: number) => {
        try {
            const res = await fetch('/api/calls', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ leadId })
            });

            const data = await res.json();

            if (data.success) {
                alert('Call initiated!');
                loadLeads();
            } else {
                alert('Error: ' + data.error);
            }
        } catch (error: any) {
            alert('Error making call: ' + error.message);
        }
    };

    if (loading) {
        return (
            <div className="p-8">
                <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
                <div className="grid grid-cols-4 gap-4 mb-8">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-slate-800 p-4 rounded border border-slate-700 h-24 animate-pulse" />
                    ))}
                </div>
                <div className="grid grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-slate-800 p-4 rounded min-h-[400px] border border-slate-700 animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

            <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="bg-slate-800 p-4 rounded border border-slate-700">
                    <div className="text-sm text-slate-400">Total Leads</div>
                    <div className="text-2xl font-bold">{leads.length}</div>
                </div>
                <div className="bg-slate-800 p-4 rounded border border-slate-700">
                    <div className="text-sm text-slate-400">Called</div>
                    <div className="text-2xl font-bold">
                        {leads.filter((l: any) => l.status === 'Called').length}
                    </div>
                </div>
                <div className="bg-slate-800 p-4 rounded border border-slate-700">
                    <div className="text-sm text-slate-400">Demos Booked</div>
                    <div className="text-2xl font-bold text-green-400">
                        {leads.filter((l: any) => l.status === 'Demo Booked').length}
                    </div>
                </div>
                <div className="bg-slate-800 p-4 rounded border border-slate-700">
                    <div className="text-sm text-slate-400">Conversion Rate</div>
                    <div className="text-2xl font-bold text-blue-400">
                        {leads.length > 0
                            ? Math.round((leads.filter((l: any) => l.status === 'Demo Booked').length / leads.length) * 100)
                            : 0}%
                    </div>
                </div>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="grid grid-cols-4 gap-4">
                    {COLUMNS.map(column => (
                        <Droppable key={column} droppableId={column}>
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="bg-slate-800 p-4 rounded min-h-[400px] border border-slate-700"
                                >
                                    <h3 className="font-bold mb-4 text-slate-300">{column}</h3>
                                    <div className="space-y-2">
                                        {leads
                                            .filter((lead: any) => lead.status === column)
                                            .map((lead: any, index: number) => (
                                                <Draggable
                                                    key={lead.id}
                                                    draggableId={lead.id.toString()}
                                                    index={index}
                                                >
                                                    {(provided) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className="bg-slate-700 p-3 rounded shadow hover:bg-slate-600 transition-colors"
                                                        >
                                                            <div className="font-semibold text-white">{lead.business_name}</div>
                                                            <div className="text-sm text-slate-400">{lead.phone}</div>
                                                            <div className="text-sm text-slate-400">
                                                                {lead.city}, {lead.state} | ⭐ {lead.rating}
                                                            </div>
                                                            <div className="mt-3 flex gap-2">
                                                                <button
                                                                    onClick={() => handleCall(lead.id)}
                                                                    className="bg-blue-600 text-xs px-2 py-1.5 rounded hover:bg-blue-700 text-white font-medium"
                                                                >
                                                                    Call Now
                                                                </button>
                                                                <a
                                                                    href={`/dashboard/leads/${lead.id}`}
                                                                    className="bg-slate-600 text-xs px-2 py-1.5 rounded hover:bg-slate-500 text-white font-medium"
                                                                >
                                                                    View
                                                                </a>
                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                        {provided.placeholder}
                                    </div>
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
}
