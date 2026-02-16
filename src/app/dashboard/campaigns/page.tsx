"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Megaphone, Plus, Users, ArrowUpRight, CheckCircle2, Play, Pause, MoreHorizontal } from "lucide-react";

export default function CampaignsPage() {
    const [campaigns] = useState([
        { id: 1, name: "Storm Chaser Reactivation", leads: "1,240", status: "Active", conversion: "14%", icon: "⛈️" },
        { id: 2, name: "Google Ads Missed Call Back", leads: "452", status: "Active", conversion: "32%", icon: "📞" },
        { id: 3, name: "Past Customer Maintenance", leads: "2,890", status: "Draft", conversion: "0%", icon: "🛠️" },
    ]);

    return (
        <div className="p-6 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">Campaigns</h2>
                    <p className="text-zinc-400">Launch outbound voice and automated follow-ups.</p>
                </div>
                <Button className="bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-900/20">
                    <Plus className="mr-2 h-4 w-4" /> Start Campaign
                </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {[
                    { label: "Active Recipients", val: "1,692", sub: "+124 today", color: "blue" },
                    { label: "Avg. Connection Rate", val: "78%", sub: "Above industry avg", color: "emerald" },
                    { label: "Campaign ROI", val: "14.2x", sub: "Based on booked value", color: "violet" },
                ].map((stat, i) => (
                    <Card key={i} className="bg-zinc-900 border-zinc-800">
                        <CardContent className="pt-6">
                            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">{stat.label}</p>
                            <div className="flex items-baseline gap-3">
                                <h3 className="text-3xl font-extrabold text-white">{stat.val}</h3>
                                <span className={`text-xs font-bold text-${stat.color}-500`}>{stat.sub}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Megaphone size={20} className="text-orange-500" /> Outbound Engines
                </h3>
                <div className="grid gap-4">
                    {campaigns.map((camp) => (
                        <Card key={camp.id} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-all group overflow-hidden">
                            <CardHeader className="flex flex-row items-center justify-between pb-4">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 bg-zinc-800 rounded-2xl flex items-center justify-center text-2xl border border-zinc-700 shadow-inner group-hover:scale-110 transition-transform">
                                        {camp.icon}
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl font-bold text-white">{camp.name}</CardTitle>
                                        <div className="flex items-center gap-3 mt-1 text-sm text-zinc-500 font-medium">
                                            <div className="flex items-center gap-1"><Users size={14} /> {camp.leads} Leads</div>
                                            <div className="flex items-center gap-1 text-emerald-500"><ArrowUpRight size={14} /> {camp.conversion} Booked</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${camp.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-zinc-500/10 text-zinc-500 border border-zinc-500/20'}`}>
                                        {camp.status}
                                    </div>
                                    <Button variant="ghost" size="sm" className="text-zinc-500">
                                        <MoreHorizontal size={20} />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between mt-2 pt-4 border-t border-zinc-800/50">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3, 4].map(v => (
                                            <div key={v} className="w-6 h-6 rounded-full border-2 border-zinc-900 bg-zinc-800 text-[8px] flex items-center justify-center font-bold text-zinc-500">
                                                U
                                            </div>
                                        ))}
                                        <div className="w-6 h-6 rounded-full border-2 border-zinc-900 bg-zinc-800 text-[8px] flex items-center justify-center font-bold text-zinc-400">+2k</div>
                                    </div>
                                    <div className="flex gap-2">
                                        {camp.status === 'Active' ? (
                                            <Button size="sm" variant="outline" className="h-8 text-xs border-zinc-800 bg-transparent text-zinc-400 hover:text-white">
                                                <Pause size={14} className="mr-2" /> Pause
                                            </Button>
                                        ) : (
                                            <Button size="sm" variant="outline" className="h-8 text-xs border-zinc-800 bg-transparent text-emerald-500 hover:bg-emerald-500/5 hover:border-emerald-500">
                                                <Play size={14} className="mr-2" /> Launch
                                            </Button>
                                        )}
                                        <Button size="sm" className="h-8 text-xs bg-zinc-100 text-zinc-900 hover:bg-white font-bold">
                                            Manage Leads
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
