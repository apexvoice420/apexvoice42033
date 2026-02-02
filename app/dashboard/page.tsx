"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { ArrowUpRight, Users, DollarSign, Phone, Activity, ArrowRight, TrendingUp } from "lucide-react";
import Link from "next/link";
import StatsCard from "../../components/Crm/StatsCard";

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Dashboard Archive</h1>
                    <p className="text-slate-400 mt-2">Welcome back, John. Here is what's happening today.</p>
                </div>
                <div className="flex gap-4">
                    <Link href="/dashboard/crm/importer">
                        <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-900">
                            Import Leads
                        </Button>
                    </Link>
                    <Link href="/dashboard/campaigns">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                            New Campaign
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Revenue"
                    value="$12,450"
                    icon={DollarSign}
                    trend={{ value: "+12.5%", label: "vs last month", isPositive: true }}
                    color="emerald"
                />
                <StatsCard
                    title="Active Leads"
                    value="1,240"
                    icon={Users}
                    trend={{ value: "+4.3%", label: "vs last month", isPositive: true }}
                    color="blue"
                />
                <StatsCard
                    title="Calls Made"
                    value="842"
                    icon={Phone}
                    trend={{ value: "+18%", label: "vs last month", isPositive: true }}
                    color="indigo"
                />
                <StatsCard
                    title="Conversion Rate"
                    value="3.2%"
                    icon={Activity}
                    trend={{ value: "-1.1%", label: "vs last month", isPositive: false }}
                    color="purple"
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Chart / Analytics Placeholder */}
                <Card className="col-span-1 lg:col-span-2 bg-slate-950 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-white">Revenue Overview</CardTitle>
                        <CardDescription className="text-slate-400">Monthly revenue performance for 2024.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full bg-slate-900/50 rounded-lg flex items-center justify-center border border-slate-800 border-dashed">
                            <div className="text-center text-slate-500">
                                <TrendingUp className="h-10 w-10 mx-auto mb-2 opacity-50" />
                                <p>Chart Visualization Component</p>
                                <p className="text-xs">(Requires Recharts or similar library)</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity Feed */}
                <Card className="col-span-1 bg-slate-950 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-white">Recent Activity</CardTitle>
                        <CardDescription className="text-slate-400">Latest actions across your CRM.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {[
                                { text: "New lead 'Acme Corp' added", time: "2 min ago", type: "lead" },
                                { text: "Call completed with 'John Smith'", time: "15 min ago", type: "call" },
                                { text: "Campaign 'Q1 Outreach' started", time: "1 hour ago", type: "campaign" },
                                { text: "Meeting booked with 'Sarah J.'", time: "3 hours ago", type: "meeting" },
                                { text: "New invoice paid ($450.00)", time: "5 hours ago", type: "money" },
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-4">
                                    <div className={`mt-1 h-2 w-2 rounded-full ${item.type === 'money' ? 'bg-emerald-500' :
                                            item.type === 'call' ? 'bg-blue-500' : 'bg-slate-500'
                                        }`} />
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-slate-200 leading-none">{item.text}</p>
                                        <p className="text-xs text-slate-500">{item.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
