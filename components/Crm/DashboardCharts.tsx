"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

const revenueData = [
    { name: "Jan", total: 12400 },
    { name: "Feb", total: 14100 },
    { name: "Mar", total: 18400 },
    { name: "Apr", total: 24500 },
    { name: "May", total: 32900 },
    { name: "Jun", total: 45200 },
];

const sourceData = [
    { name: "Facebook Ads", value: 400, color: "#6366f1" }, // Indigo 500
    { name: "Google PPC", value: 300, color: "#8b5cf6" },   // Violet 500
    { name: "Organic", value: 300, color: "#10b981" },      // Emerald 500
    { name: "Referrals", value: 200, color: "#f59e0b" },    // Amber 500
];

const funnelData = [
    { name: "New Leads", value: 120, color: "#6366f1" },
    { name: "Qualified", value: 80, color: "#8b5cf6" },
    { name: "Booked", value: 45, color: "#ec4899" },
    { name: "Closed", value: 12, color: "#10b981" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-900/90 border border-slate-700 p-2 rounded-lg shadow-xl backdrop-blur-md">
                <p className="text-slate-300 text-xs mb-1">{label}</p>
                <p className="text-white font-bold text-sm">
                    ${payload[0].value.toLocaleString()}
                </p>
            </div>
        );
    }
    return null;
};

export function RevenueChart() {
    return (
        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm shadow-xl col-span-1 lg:col-span-2">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-white text-lg font-semibold tracking-tight">Revenue Growth</CardTitle>
                        <CardDescription className="text-slate-400">Net revenue month over month</CardDescription>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                        +24.5% YTD
                    </div>
                </div>
            </CardHeader>
            <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
                        <defs>
                            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.5} />
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                        <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`} dx={-10} />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#6366f1', strokeWidth: 1 }} />
                        <Area type="monotone" dataKey="total" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

export function LeadSourceChart() {
    return (
        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm shadow-xl col-span-1">
            <CardHeader>
                <CardTitle className="text-white text-lg font-semibold tracking-tight">Lead Sources</CardTitle>
                <CardDescription className="text-slate-400">Channel performance attribution</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={sourceData}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={90}
                            paddingAngle={4}
                            dataKey="value"
                            stroke="none"
                        >
                            {sourceData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", color: "#fff", borderRadius: "8px" }} />
                    </PieChart>
                </ResponsiveContainer>

                {/* Center text for Donut Chart */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                    <p className="text-2xl font-bold text-white">1,200</p>
                    <p className="text-xs text-slate-500">Total Leads</p>
                </div>

                <div className="flex flex-wrap justify-center gap-3 mt-2">
                    {sourceData.map((item) => (
                        <div key={item.name} className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
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
        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm shadow-xl col-span-1">
            <CardHeader>
                <CardTitle className="text-white text-lg font-semibold tracking-tight">Conversion Funnel</CardTitle>
                <CardDescription className="text-slate-400">Lead velocity through pipeline</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={funnelData} margin={{ left: 0, right: 0, top: 0, bottom: 0 }} barSize={32}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} width={70} tickLine={false} axisLine={false} />
                        <Tooltip
                            cursor={{ fill: '#1e293b' }}
                            contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", color: "#fff", borderRadius: "8px" }}
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
