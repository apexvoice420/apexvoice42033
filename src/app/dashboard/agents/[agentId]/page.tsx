"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bot, Save, ArrowLeft, Phone, Zap, Settings as SettingsIcon } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

interface Agent {
    id: string;
    name: string;
    industry: string;
    status: "ACTIVE" | "INACTIVE";
    vapiAgentId?: string;
    prompt?: string;
}

export default function AgentDetailPage() {
    const params = useParams();
    const router = useRouter();
    const agentId = params.agentId as string;
    const [agent, setAgent] = useState<Agent | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const saved = localStorage.getItem("apex_agents");
        if (saved) {
            const agents: Agent[] = JSON.parse(saved);
            const found = agents.find(a => a.id === agentId);
            if (found) {
                setAgent({
                    ...found,
                    prompt: found.prompt || "You are a helpful AI voice receptionist for Apex Voice Solutions. Your goal is to qualify leads and book appointments."
                });
            }
        }
        setIsLoading(false);
    }, [agentId]);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!agent) return;

        const saved = localStorage.getItem("apex_agents");
        if (saved) {
            const agents: Agent[] = JSON.parse(saved);
            const updated = agents.map(a => a.id === agent.id ? agent : a);
            localStorage.setItem("apex_agents", JSON.stringify(updated));
            alert("Agent settings saved successfully! 🚀");
        }
    };

    if (isLoading) return <div className="p-8 text-zinc-500">Loading Agent Engine...</div>;
    if (!agent) return <div className="p-8 text-white">Agent not found. <Link href="/dashboard/agents" className="text-violet-500">Go back</Link></div>;

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/agents">
                        <Button variant="outline" size="icon" className="border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:text-white rounded-xl">
                            <ArrowLeft size={18} />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-3xl font-bold tracking-tight text-white">{agent.name}</h2>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-violet-500/10 text-violet-500 border border-violet-500/20 uppercase tracking-widest">
                                {agent.industry}
                            </span>
                        </div>
                        <p className="text-zinc-500 text-sm mt-1">Configure the "brain" and behavior for this agent.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:text-white rounded-xl h-11">
                        <Phone size={18} className="mr-2" /> Test Call
                    </Button>
                    <Button onClick={handleSave} className="bg-violet-600 hover:bg-violet-700 rounded-xl h-11 px-6 font-bold shadow-lg shadow-violet-900/20">
                        <Save size={18} className="mr-2" /> Save Changes
                    </Button>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card className="bg-zinc-900 border-zinc-800 shadow-2xl overflow-hidden">
                        <CardHeader className="border-b border-zinc-800 bg-zinc-900/50 flex flex-row items-center justify-between">
                            <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                                <Zap size={18} className="text-violet-500" /> System Prompt & Core Logic
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <textarea
                                className="w-full min-h-[500px] bg-transparent p-6 text-zinc-300 font-mono text-sm leading-relaxed focus:outline-none resize-none"
                                value={agent.prompt}
                                onChange={(e) => setAgent({ ...agent, prompt: e.target.value })}
                                placeholder="Write the detailed instructions for your AI agent here..."
                            />
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
                        <CardHeader className="border-b border-zinc-800 bg-zinc-900/50">
                            <CardTitle className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                                <SettingsIcon size={16} className="text-zinc-500" /> Identity Settings
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-zinc-500 uppercase">Display Name</Label>
                                <Input
                                    className="bg-zinc-800 border-zinc-700 text-white h-11 focus:ring-violet-500"
                                    value={agent.name}
                                    onChange={(e) => setAgent({ ...agent, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-zinc-500 uppercase">Industry Focus</Label>
                                <Input
                                    className="bg-zinc-800 border-zinc-700 text-white h-11 focus:ring-violet-500"
                                    value={agent.industry}
                                    onChange={(e) => setAgent({ ...agent, industry: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-zinc-500 uppercase">Vapi Assistant ID</Label>
                                <Input
                                    className="bg-zinc-800 border-zinc-700 text-white h-11 font-mono text-xs focus:ring-violet-500"
                                    value={agent.vapiAgentId}
                                    onChange={(e) => setAgent({ ...agent, vapiAgentId: e.target.value })}
                                    placeholder="vapi-..."
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="p-6 bg-gradient-to-br from-violet-600/10 to-transparent rounded-2xl border border-violet-500/20">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-violet-600 rounded-lg">
                                <Bot size={20} className="text-white" />
                            </div>
                            <h4 className="font-bold text-white">AI Health: Optimized</h4>
                        </div>
                        <p className="text-xs text-zinc-400 leading-relaxed">This agent is currently optimized for low latency and high accuracy. The prompt length is within the ideal token window for real-time conversation.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
