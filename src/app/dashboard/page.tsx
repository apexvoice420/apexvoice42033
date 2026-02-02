"use client";

import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { collection, onSnapshot, query, updateDoc, doc, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Lead } from '@/types';
import Link from 'next/link';

const COLUMNS = [
    { id: 'New Lead', title: 'New Lead', color: 'bg-blue-500' },
    { id: 'Called', title: 'Called', color: 'bg-yellow-500' },
    { id: 'Demo Booked', title: 'Demo Booked', color: 'bg-green-500' },
    { id: 'Not Interested', title: 'Not Interested', color: 'bg-red-500' }
];

export default function KanbanBoard() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [enabled, setEnabled] = useState(false);

    useEffect(() => {
        // Animation frame for dnd
        const animation = requestAnimationFrame(() => setEnabled(true));
        return () => {
            cancelAnimationFrame(animation);
            setEnabled(false);
        };
    }, []);

    useEffect(() => {
        const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const leadsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Lead[];
            setLeads(leadsData);
        });

        return () => unsubscribe();
    }, []);

    const onDragEnd = async (result: DropResult) => {
        if (!result.destination) return;

        const { draggableId, destination } = result;
        const newStatus = destination.droppableId as Lead['status'];

        // Optimistic update
        setLeads(prev => prev.map(lead =>
            lead.id === draggableId ? { ...lead, status: newStatus } : lead
        ));

        // Firestore update
        try {
            await updateDoc(doc(db, 'leads', draggableId), {
                status: newStatus
            });
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    if (!enabled) return null;

    return (
        <div className="h-full">
            <h2 className="text-3xl font-bold mb-6">Pipeline</h2>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex gap-4 h-[calc(100vh-150px)] overflow-x-auto pb-4">
                    {COLUMNS.map(column => (
                        <div key={column.id} className="min-w-[300px] bg-slate-800 rounded-lg flex flex-col">
                            <div className={`p-4 rounded-t-lg ${column.color} bg-opacity-20`}>
                                <h3 className="font-bold flex items-center gap-2">
                                    <span className={`w-3 h-3 rounded-full ${column.color}`}></span>
                                    {column.title}
                                    <span className="ml-auto text-sm opacity-50">
                                        {leads.filter(l => l.status === column.id).length}
                                    </span>
                                </h3>
                            </div>

                            <Droppable droppableId={column.id}>
                                {(provided) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className="p-4 flex-1 overflow-y-auto space-y-3"
                                    >
                                        {leads
                                            .filter(lead => lead.status === column.id)
                                            .map((lead, index) => (
                                                <Draggable key={lead.id} draggableId={lead.id!} index={index}>
                                                    {(provided) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className="bg-slate-700 p-4 rounded shadow hover:bg-slate-600 transition-colors cursor-grab active:cursor-grabbing border border-slate-600"
                                                        >
                                                            <Link href={`/dashboard/leads/${lead.id}`} className="block hover:no-underline">
                                                                <h4 className="font-bold text-lg mb-1">{lead.businessName}</h4>
                                                                {lead.rating && (
                                                                    <div className="text-yellow-400 text-sm mb-2">
                                                                        {'★'.repeat(Math.round(lead.rating))}
                                                                        <span className="text-slate-400 ml-1">({lead.rating})</span>
                                                                    </div>
                                                                )}
                                                                <div className="text-sm text-slate-300 space-y-1">
                                                                    <p>📞 {lead.phone}</p>
                                                                    <p>📍 {lead.city}</p>
                                                                </div>
                                                            </Link>

                                                            <div className="mt-3 flex gap-2">
                                                                <Link
                                                                    href={`/dashboard/leads/${lead.id}`}
                                                                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-xs py-2 px-3 rounded text-center"
                                                                >
                                                                    Call Now
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
}
