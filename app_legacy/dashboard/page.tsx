"use client";

import { Button } from "../../components/ui/button";
import { Users, DollarSign, Phone, Activity, TrendingUp } from "lucide-react";
import Link from "next/link";
import StatsCard from "../../components/Crm/StatsCard";
import { RevenueChart, LeadSourceChart, PipelineFunnel } from "../../components/Crm/DashboardCharts";

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                        <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold animate-pulse">
                            v2.0 LIVE
                        </span>
                    </div>
                    <p className="text-slate-400 mt-2">Executive Overview</p>
                </div>
                <div className="flex gap-3">
                    <Link href="/dashboard/crm/importer">
                        <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-900">
                            Import CSV
                        </Button>
                    </Link>
                    <Link href="/dashboard/campaigns">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20">
                            + New Campaign
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Top Stats - GHL Style (Pipeline Value, Conversion, etc) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Pipeline Value"
                    value="$48,200"
                    icon={DollarSign}
                    trend={{ value: "+22%", label: "proj. close", isPositive: true }}
                    color="emerald"
                />
                <StatsCard
                    title="Opportunities"
                    value="142"
                    icon={Users}
                    trend={{ value: "+12", label: "new this week", isPositive: true }}
                    color="blue"
                />
                <StatsCard
                    title="Conversion Rate"
                    value="4.8%"
                    icon={Activity}
                    trend={{ value: "+0.4%", label: "vs last month", isPositive: true }}
                    color="purple"
                />
                <StatsCard
                    title="Tasks Due"
                    value="8"
                    icon={TrendingUp}
                    trend={{ value: "3", label: "urgent", isPositive: false }}
                    color="indigo"
                />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Revenue Chart (Span 2) */}
                <RevenueChart />

                {/* Lead Source Pie (Span 1) */}
                <LeadSourceChart />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Funnel Chart */}
                <PipelineFunnel />

                {/* Recent Activity (Legacy Text Feed) */}
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-white mb-4">Manual Actions</h3>
                    <div className="bg-slate-900/50 rounded-lg p-8 flex flex-col items-center justify-center text-center h-[240px] border border-slate-800 border-dashed">
                        <Phone className="h-10 w-10 text-slate-500 mb-2" />
                        <p className="text-slate-400">No manual calls pending.</p>
                        <Button variant="link" className="text-blue-400 mt-2">View All Tasks</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
