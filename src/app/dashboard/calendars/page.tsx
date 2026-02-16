"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Clock } from "lucide-react";

export default function CalendarPage() {
    const days = [
        { d: "Mon", date: "16", current: true },
        { d: "Tue", date: "17" },
        { d: "Wed", date: "18" },
        { d: "Thu", date: "19" },
        { d: "Fri", date: "20" },
        { d: "Sat", date: "21" },
        { d: "Sun", date: "22" },
    ];

    const appointments = [
        { id: 1, time: "9:00 AM", client: "Maurice Smith", service: "Roof Inspection", status: "Confirmed", color: "blue" },
        { id: 2, time: "11:30 AM", client: "Sarah Johnson", service: "Estimate", status: "Pending", color: "amber" },
        { id: 3, time: "2:00 PM", client: "Mike Davis", service: "Repair Leak", status: "AI Booked", color: "violet" },
    ];

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                        <CalendarIcon className="text-sky-500" /> Schedule
                    </h2>
                    <p className="text-zinc-400">All appointments booked by your AI receptionist.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex border border-zinc-800 rounded-lg overflow-hidden h-10">
                        <button className="px-4 py-1 bg-zinc-800 text-white text-xs font-bold uppercase">Day</button>
                        <button className="px-4 py-1 bg-zinc-900 text-zinc-500 text-xs font-bold uppercase hover:text-white transition-colors">Week</button>
                        <button className="px-4 py-1 bg-zinc-900 text-zinc-500 text-xs font-bold uppercase hover:text-white transition-colors">Month</button>
                    </div>
                    <Button className="bg-sky-600 hover:bg-sky-700">
                        <Plus className="mr-2 h-4 w-4" /> Book Appointment
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-4">
                {days.map((day) => (
                    <div key={day.date} className={`text-center p-4 rounded-2xl border transition-all ${day.current ? 'bg-sky-600/10 border-sky-600/50' : 'bg-zinc-900/50 border-zinc-800/50'}`}>
                        <div className={`text-[10px] font-bold uppercase tracking-widest ${day.current ? 'text-sky-500' : 'text-zinc-500'}`}>{day.d}</div>
                        <div className="text-2xl font-black text-white mt-1">{day.date}</div>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
                        <div className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></div> Today's Bookings
                    </h3>
                    <div className="space-y-3">
                        {appointments.map((app) => (
                            <Card key={app.id} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors group">
                                <CardContent className="p-0">
                                    <div className="flex">
                                        <div className={`w-2 bg-${app.color}-600 self-stretch`}></div>
                                        <div className="p-6 flex-1 flex items-center justify-between">
                                            <div className="flex items-center gap-6">
                                                <div className="space-y-1">
                                                    <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{app.time}</div>
                                                    <div className="text-lg font-bold text-white">{app.client}</div>
                                                </div>
                                                <div className="h-8 w-[1px] bg-zinc-800"></div>
                                                <div>
                                                    <div className="text-xs font-medium text-zinc-500">Service</div>
                                                    <div className="text-sm font-bold text-zinc-300">{app.service}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className={`px-2 py-1 rounded text-[10px] font-bold border ${app.color === 'blue' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : app.color === 'amber' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-violet-500/10 text-violet-500 border-violet-500/20'}`}>
                                                    {app.status}
                                                </div>
                                                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400">
                                                    Manage
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardHeader>
                            <CardTitle className="text-sm font-bold flex items-center gap-2">
                                <Clock size={16} className="text-zinc-500" /> Resource Utilization
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {[
                                { name: "Mike T.", role: "Technician", load: 85, color: "sky" },
                                { name: "Jason R.", role: "Estimator", load: 40, color: "emerald" },
                                { name: "Sarah K.", role: "Technician", load: 60, color: "violet" }
                            ].map(r => (
                                <div key={r.name} className="space-y-2">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-white font-bold">{r.name} ({r.role})</span>
                                        <span className="text-zinc-500 font-bold">{r.load}%</span>
                                    </div>
                                    <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                                        <div className={`bg-${r.color}-500 h-full`} style={{ width: `${r.load}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <div className="p-6 bg-gradient-to-br from-violet-600/20 to-indigo-600/20 rounded-2xl border border-violet-600/20">
                        <h4 className="font-bold text-white mb-2">AI Sync Active</h4>
                        <p className="text-xs text-zinc-400 leading-relaxed mb-4">Your AI is currently monitoring availability across 3 calendars and booking into "Apex Primary".</p>
                        <Button className="w-full bg-violet-600 hover:bg-violet-700 font-bold h-9 text-xs">Calibration Sync</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
