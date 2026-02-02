import React from 'react';
import { Lead } from '@/types';
import KanbanBoard from '@/components/Crm/KanbanBoard';
import StartCampaignButton from '@/components/Crm/StartCampaignButton';
import StatsCard from '@/components/Crm/StatsCard';
import { Users, Phone, CalendarCheck, TrendingUp, DollarSign } from 'lucide-react';

// Server Component
export const dynamic = 'force-dynamic';

async function getLeads() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    try {
        const res = await fetch(`${apiUrl}/leads`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch leads');
        return await res.json();
    } catch (error) {
        console.error('Error fetching leads:', error);
        return [];
    }
}

export default async function CrmPage() {
    const leads: Lead[] = await getLeads();

    // Calculate Stats
    const totalLeads = leads.length;
    const bookedLeads = leads.filter(l => l.status === 'Booked').length;
    const conversionRate = totalLeads > 0 ? ((bookedLeads / totalLeads) * 100).toFixed(1) : '0.0';

    return (
        <div className="h-full flex flex-col space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Launchpad</h1>
                    <p className="text-slate-500 mt-2 text-sm">Welcome back, <span className="font-semibold text-slate-700">John Doe</span>.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="px-4 py-2 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-lg text-sm font-bold shadow-sm hover:bg-yellow-100 transition flex items-center">
                        Simulate Test Call
                    </button>
                    <StartCampaignButton />
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatsCard
                    title="Total Calls"
                    value={leads.filter(l => l.status === 'Called' || l.status === 'Booked' || l.status === 'Retry').length}
                    icon={Phone}
                    color="blue"
                    trend={{ value: "+12", label: "this week", isPositive: true }}
                />
                <StatsCard
                    title="Conversion Rate"
                    value={`${conversionRate}%`}
                    icon={TrendingUp}
                    color="emerald"
                    trend={{ value: "+2.4%", label: "efficiency", isPositive: true }}
                />
                <StatsCard
                    title="Revenue"
                    value={`$${(bookedLeads * 1500).toLocaleString()}`}
                    icon={DollarSign}
                    color="indigo"
                    trend={{ value: "+$4.5k", label: "projected", isPositive: true }}
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 h-[600px] min-h-[600px]">
                {/* Main Kanban Area */}
                <div className="xl:col-span-2 h-full flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden ring-1 ring-slate-900/5">
                    <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                        <h3 className="font-bold text-slate-800 text-lg">Pipeline Board</h3>
                        <div className="flex space-x-2">
                            <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">Drag to update status</span>
                        </div>
                    </div>
                    <div className="flex-1 min-h-0 bg-slate-50/50 p-4">
                        <KanbanBoard initialLeads={leads} />
                    </div>
                </div>

                {/* Right Sidebar / Tools */}
                <div className="flex flex-col gap-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 ring-1 ring-slate-900/5">
                        <h3 className="font-bold text-slate-800 mb-1">Import Leads</h3>
                        <p className="text-sm text-slate-500 mb-4">Upload CSV with Business Name, Phone, and City.</p>
                        {/* Importer component will need similar update if restored */}
                        <div className="p-4 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 text-sm">
                            <p><strong>Importer</strong> uses new Database</p>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden flex-1">
                        <div className="absolute top-0 right-0 p-3 opacity-10">
                            <Phone className="w-48 h-48" />
                        </div>
                        <div className="relative z-10">
                            <h3 className="font-bold text-lg mb-2">AI Agent Status</h3>
                            <div className="flex items-center space-x-2 text-emerald-400 mb-6">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                                </span>
                                <span className="text-sm font-medium">System Online</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
