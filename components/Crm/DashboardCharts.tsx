"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const revenueData = [
    { name: "Jan", total: 1200 },
    { name: "Feb", total: 2100 },
    { name: "Mar", total: 1800 },
    { name: "Apr", total: 2400 },
    { name: "May", total: 3200 },
    { name: "Jun", total: 4500 },
];

const sourceData = [
    { name: "Facebook", value: 400, color: "#3b82f6" }, // Blue
    { name: "Google", value: 300, color: "#ef4444" },   // Red
    { name: "Direct", value: 300, color: "#22c55e" },   // Green
    { name: "Referral", value: 200, color: "#eab308" }, // Yellow
];

const funnelData = [
    { name: "New Leads", value: 120, color: "#3b82f6" },
    { name: "Called", value: 80, color: "#6366f1" },
    { name: "Booked", value: 45, color: "#8b5cf6" },
    { name: "Closed", value: 12, color: "#ec4899" },
];

export function RevenueChart() {
    return (
        <Card className="bg-slate-950 border-slate-800 col-span-1 lg:col-span-2">
            <CardHeader>
                <CardTitle className="text-white">Revenue Growth</CardTitle>
                <CardDescription className="text-slate-400">Monthly breakdown affecting total value.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
                        <defs>
                            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                        <Tooltip
                            contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", color: "#fff" }}
                            itemStyle={{ color: "#fff" }}
                        />
                        <Area type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorTotal)" />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

export function LeadSourceChart() {
    return (
        <Card className="bg-slate-950 border-slate-800 col-span-1">
            <CardHeader>
                <CardTitle className="text-white">Lead Source</CardTitle>
                <CardDescription className="text-slate-400">Where are your leads coming from?</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={sourceData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {sourceData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", color: "#fff" }}
                            itemStyle={{ color: "#fff" }}
                        />
                    </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 mt-4">
                    {sourceData.map((item) => (
                        <div key={item.name} className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="text-xs text-slate-400">{item.name}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

export function PipelineFunnel() {
    return (
        <Card className="bg-slate-950 border-slate-800 col-span-1">
            <CardHeader>
                <CardTitle className="text-white">Pipeline Funnel</CardTitle>
                <CardDescription className="text-slate-400">Conversion from Lead to Sale.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={funnelData} margin={{ left: 20 }}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} width={80} />
                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", color: "#fff" }}
                        />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                            {funnelData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
