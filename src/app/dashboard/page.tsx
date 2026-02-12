"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '@/components/NewCrm/StateSidebar';
import StatsCards from '@/components/NewCrm/StatsCards';
import KanbanBoard from '@/components/NewCrm/KanbanBoard';
import ScraperView from '@/components/NewCrm/ScraperView';
import SettingsView from '@/components/NewCrm/SettingsView';
import { Lead, LeadStatus, ViewType, Stats } from '@/types';
import { INITIAL_LEADS } from '@/components/NewCrm/constants';
import { triggerVapiCall } from '@/services/vapiService';

export default function DashboardPage() {
    const [currentView, setCurrentView] = useState<ViewType | string>('opportunities');
    const [isTestMode, setIsTestMode] = useState(true);

    const [leads, setLeads] = useState<Lead[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('apex_leads');
            return saved ? JSON.parse(saved) : INITIAL_LEADS;
        }
        return INITIAL_LEADS;
    });

    const [config, setConfig] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('apex_config');
            return saved ? JSON.parse(saved) : {
                vapiAssistantId: '',
                vapiApiKey: '',
                railwayEndpoint: '',
                railwayApiKey: ''
            };
        }
        return {
            vapiAssistantId: '',
            vapiApiKey: '',
            railwayEndpoint: '',
            railwayApiKey: ''
        };
    });

    const [isCalling, setIsCalling] = useState<string | null>(null);
    const [stats, setStats] = useState<Stats>({
        totalCalls: 124,
        conversionRate: 18.5,
        revenue: 12500
    });

    useEffect(() => {
        localStorage.setItem('apex_leads', JSON.stringify(leads));
    }, [leads]);

    useEffect(() => {
        localStorage.setItem('apex_config', JSON.stringify(config));
    }, [config]);

    const updateStats = useCallback(() => {
        const callCount = leads.filter(l => l.status !== LeadStatus.NEW).length + 100;
        const demoBookedCount = leads.filter(l => l.status === LeadStatus.DEMO_BOOKED).length;
        const totalRev = leads.reduce((sum, l) => sum + (l.revenue || 0), 0) + 12000;

        setStats({
            totalCalls: callCount,
            conversionRate: leads.length > 0 ? parseFloat(((demoBookedCount / leads.length) * 100).toFixed(1)) : 0,
            revenue: totalRev
        });
    }, [leads]);

    useEffect(() => {
        updateStats();
    }, [leads, updateStats]);

    const handleStatusChange = useCallback((id: string, newStatus: LeadStatus) => {
        setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
    }, []);

    const handleCallLead = async (id: string) => {
        const lead = leads.find(l => l.id === id);
        if (!lead) return;

        setIsCalling(id);
        try {
            const useTest = isTestMode || !config.vapiApiKey;
            const newStatus = await triggerVapiCall(lead, useTest);
            handleStatusChange(id, newStatus);

            if (newStatus === LeadStatus.DEMO_BOOKED) {
                setLeads(prev => prev.map(l => l.id === id ? { ...l, revenue: 1500 } : l));
            }

            if (config.railwayEndpoint && !useTest) {
                console.log(`[Railway] Notifying backend of call to ${lead.id}`);
            }
        } finally {
            setIsCalling(null);
        }
    };

    const handleNewLeads = useCallback((newLeads: Lead[]) => {
        setLeads(prev => [...newLeads, ...prev]);
        if (config.railwayEndpoint && config.railwayApiKey) {
            console.log(`[Railway] Syncing ${newLeads.length} new leads to production DB...`);
        }
    }, [config.railwayEndpoint, config.railwayApiKey]);

    const renderContent = () => {
        switch (currentView) {
            case 'opportunities':
                return (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h1 className="text-2xl font-bold text-white">Opportunities Pipeline</h1>
                                <p className="text-gray-500 text-sm">Managing leads and voice agents across Railway & VAPI</p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsTestMode(!isTestMode)}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all flex items-center gap-2 ${isTestMode
                                            ? 'bg-amber-500/10 text-amber-500 border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.1)]'
                                            : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                                        }`}
                                >
                                    <span className={`w-2 h-2 rounded-full ${isTestMode ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                                    {isTestMode ? 'Test Mode Active' : 'Production Mode'}
                                </button>
                                <button
                                    onClick={() => handleNewLeads([{
                                        id: Math.random().toString(),
                                        businessName: 'Apex Sample Lead',
                                        phone: '+15550000',
                                        website: 'apex.ai',
                                        stars: 5.0,
                                        status: LeadStatus.NEW
                                    }])}
                                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-sm font-medium rounded-lg border border-gray-700 transition-colors"
                                >
                                    + Add Lead
                                </button>
                            </div>
                        </div>
                        <StatsCards stats={stats} />
                        <KanbanBoard
                            leads={leads}
                            onStatusChange={handleStatusChange}
                            onCallLead={handleCallLead}
                            isCalling={isCalling}
                        />
                    </div>
                );
            case 'scraper':
                return (
                    <div className="animate-in zoom-in-95 duration-500 h-full">
                        <ScraperView onNewLeads={handleNewLeads} />
                    </div>
                );
            case 'settings':
                return (
                    <div className="animate-in slide-in-from-right-8 duration-500">
                        <SettingsView config={config} onSave={setConfig} />
                    </div>
                );
            default:
                // Handle undefined or 'launchpad', etc.
                return (
                    <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-gray-500">
                        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        </div>
                        <p className="text-lg font-medium">Coming Soon</p>
                        <p className="text-sm">Agent A is refining the {currentView} module.</p>
                    </div>
                );
        }
    };

    return (
        <div className="flex min-h-screen">
            <Sidebar currentView={currentView} onViewChange={setCurrentView} />

            <main className="flex-1 ml-64 p-8 overflow-y-auto max-h-screen">
                <header className="flex justify-between items-center mb-8">
                    <div className="relative w-96">
                        <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        <input
                            type="text"
                            placeholder="Search leads, calls, transcripts..."
                            className="w-full bg-[#1a1f2e] border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-widest transition-all ${config.vapiApiKey ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]' : 'bg-gray-800/50 text-gray-500 border-gray-800'
                            }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${config.vapiApiKey ? 'bg-emerald-500 animate-pulse' : 'bg-gray-600'}`}></span>
                            {config.vapiApiKey ? 'VAPI LINKED' : 'VAPI OFFLINE'}
                        </div>
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-widest transition-all ${config.railwayEndpoint ? 'bg-purple-500/10 text-purple-500 border-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,0.1)]' : 'bg-gray-800/50 text-gray-500 border-gray-800'
                            }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${config.railwayEndpoint ? 'bg-purple-500' : 'bg-gray-600'}`}></span>
                            {config.railwayEndpoint ? 'RAILWAY ACTIVE' : 'NO BACKEND'}
                        </div>
                        <button className="p-2 text-gray-400 hover:text-white transition-colors relative">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                            <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full"></span>
                        </button>
                    </div>
                </header>

                <div>
                    {renderContent()}
                </div>
            </main>
        </div>
    );
}
