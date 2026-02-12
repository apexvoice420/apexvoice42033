
import React from 'react';
import { Lead, LeadStatus } from '@/types';

interface KanbanBoardProps {
    leads: Lead[];
    onStatusChange: (id: string, newStatus: LeadStatus) => void;
    onCallLead: (id: string) => void;
    isCalling: string | null;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ leads, onStatusChange, onCallLead, isCalling }) => {
    const columns = [
        { status: LeadStatus.NEW, color: 'border-blue-500/30' },
        { status: LeadStatus.CALLED, color: 'border-amber-500/30' },
        { status: LeadStatus.DEMO_BOOKED, color: 'border-emerald-500/30' },
        { status: LeadStatus.NOT_INTERESTED, color: 'border-rose-500/30' },
    ];

    return (
        <div className="flex gap-4 h-[calc(100vh-320px)] overflow-x-auto pb-4">
            {columns.map((col) => {
                const columnLeads = leads.filter((l) => l.status === col.status);
                return (
                    <div key={col.status} className="flex-shrink-0 w-80 flex flex-col">
                        <div className={`flex items-center justify-between mb-3 px-2 py-1 border-l-2 ${col.color}`}>
                            <span className="font-semibold text-sm text-gray-300 uppercase tracking-wider">{col.status}</span>
                            <span className="text-xs bg-gray-800 px-2 py-0.5 rounded-full text-gray-500">{columnLeads.length}</span>
                        </div>

                        <div className="flex-1 bg-gray-900/50 rounded-xl p-3 space-y-3 overflow-y-auto border border-gray-800/50">
                            {columnLeads.length === 0 ? (
                                <div className="text-center py-10 opacity-20">
                                    <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    <p className="text-xs">No leads in this stage</p>
                                </div>
                            ) : (
                                columnLeads.map((lead) => (
                                    <div key={lead.id} className="bg-[#1a1f2e] p-4 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors shadow-sm group">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-medium text-sm text-white group-hover:text-blue-400 transition-colors">{lead.businessName}</h4>
                                            <div className="flex items-center text-xs text-amber-400">
                                                <span>★</span>
                                                <span className="ml-1">{lead.stars}</span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-500 mb-4">{lead.phone}</p>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => onCallLead(lead.id)}
                                                disabled={isCalling !== null}
                                                className={`flex-1 py-1.5 rounded text-xs font-semibold flex items-center justify-center gap-1 transition-all ${isCalling === lead.id
                                                        ? 'bg-blue-600 text-white animate-pulse'
                                                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700 active:scale-95'
                                                    }`}
                                            >
                                                {isCalling === lead.id ? 'Calling...' : (
                                                    <>
                                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>
                                                        Call Agent
                                                    </>
                                                )}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    const nextStatus = lead.status === LeadStatus.NEW ? LeadStatus.CALLED :
                                                        lead.status === LeadStatus.CALLED ? LeadStatus.DEMO_BOOKED :
                                                            LeadStatus.NEW;
                                                    onStatusChange(lead.id, nextStatus);
                                                }}
                                                className="p-1.5 bg-gray-800 rounded hover:bg-gray-700 text-gray-500 hover:text-white transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default KanbanBoard;
