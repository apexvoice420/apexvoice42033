"use client";

import React, { useState, useEffect } from 'react';
import { Lead } from '../../types';
import { DndContext, DragEndEvent, useDraggable, useDroppable } from '@dnd-kit/core';
import { Phone, MessageSquare } from 'lucide-react';

const COLUMNS: { id: Lead['status']; title: string; color: string }[] = [
    { id: 'New', title: 'New Leads', color: 'border-blue-500' },
    { id: 'Called', title: 'Hot Leads', color: 'border-yellow-500' },
    { id: 'Booked', title: 'Booking Requested', color: 'border-green-500' },
    { id: 'Retry', title: 'Follow Up', color: 'border-orange-500' },
    { id: 'Lost', title: 'Lost', color: 'border-red-500' },
];

interface KanbanBoardProps {
    initialLeads?: Lead[];
}

export default function KanbanBoard({ initialLeads = [] }: KanbanBoardProps) {
    const [leads, setLeads] = useState<Lead[]>(initialLeads);

    useEffect(() => {
        if (initialLeads.length) setLeads(initialLeads);
    }, [initialLeads]);

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const leadId = active.id; // Correct type?
            const newStatus = over.id as Lead['status'];

            setLeads((prev) =>
                prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l)
            );
        }
    };

    return (
        <div className="flex h-full overflow-x-auto pb-4 gap-4 p-1 scrollbar-thin scrollbar-thumb-slate-700">
            <DndContext onDragEnd={handleDragEnd}>
                {COLUMNS.map((col) => (
                    <KanbanColumn key={col.id} col={col} leads={leads.filter(l => l.status === col.id)} />
                ))}
            </DndContext>
        </div>
    );
}

function KanbanColumn({ col, leads }: { col: typeof COLUMNS[0], leads: Lead[] }) {
    const { setNodeRef } = useDroppable({
        id: col.id,
    });

    const totalValue = leads.length * 1500; // Mock value

    return (
        <div
            ref={setNodeRef}
            className="flex-shrink-0 w-[300px] flex flex-col h-full rounded-lg bg-slate-900/50 border border-slate-800/60"
        >
            <div className="flex flex-col mb-1 p-3 border-b border-slate-800 bg-slate-900 rounded-t-lg">
                <div className="flex justify-between items-center mb-1">
                    <h3 className="font-bold text-slate-300 text-sm uppercase tracking-wide">{col.title}</h3>
                    <span className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded text-xs font-bold border border-slate-700">{leads.length}</span>
                </div>
                <div className="text-xs text-slate-500 font-medium text-right">
                    ${totalValue.toLocaleString()}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 p-2 min-h-[100px] scrollbar-thin">
                {leads.map(lead => (
                    <KanbanCard key={lead.id} lead={lead} statusColor={col.color} />
                ))}
            </div>
        </div>
    );
}

function KanbanCard({ lead, statusColor }: { lead: Lead, statusColor: string }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: lead.id,
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 999,
    } : undefined;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={`bg-slate-900 p-3 rounded shadow-sm border border-slate-800 cursor-grab hover:border-slate-700 hover:shadow-md transition-all group relative active:cursor-grabbing border-l-[4px] ${statusColor}
        ${isDragging ? 'rotate-1 scale-105 shadow-xl ring-2 ring-blue-500/20 z-50' : ''}`}
        >
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-slate-200 text-sm hover:text-blue-400 transition-colors truncate pr-2">{lead.business_name}</h4>
                <p className="text-[10px] text-slate-500 whitespace-nowrap">Now</p>
            </div>

            <div className="mb-3">
                <span className="text-sm font-bold text-slate-400">$1,500.00</span>
            </div>

            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800">
                <div className="flex flex-wrap gap-1">
                    <span className="text-[10px] bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded border border-slate-700">
                        {lead.niche}
                    </span>
                </div>

                <div className="flex items-center space-x-2">
                    <button className="text-slate-500 hover:text-green-400 hover:bg-green-950/30 p-1 rounded transition">
                        <Phone className="w-3.5 h-3.5" />
                    </button>
                    <button className="text-slate-500 hover:text-blue-400 hover:bg-blue-950/30 p-1 rounded transition">
                        <MessageSquare className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
