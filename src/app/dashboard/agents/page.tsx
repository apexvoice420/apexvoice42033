"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bot, Plus, X } from "lucide-react";

interface Agent {
    id: string;
    name: string;
    industry: string;
    status: "ACTIVE" | "INACTIVE";
    vapiAgentId?: string;
}

export default function AgentsPage() {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newAgent, setNewAgent] = useState({ name: "", industry: "" });

    useEffect(() => {
        const saved = localStorage.getItem("apex_agents");
        if (saved) {
            setAgents(JSON.parse(saved));
        } else {
            // Seed default
            const initial: Agent[] = [
                { id: "1", name: "Cora (Receptionist)", industry: "General", status: "ACTIVE", vapiAgentId: "cora-default-123" }
            ];
            setAgents(initial);
            localStorage.setItem("apex_agents", JSON.stringify(initial));
        }
    }, []);

    const handleCreateAgent = (e: React.FormEvent) => {
        e.preventDefault();
        const agent: Agent = {
            id: Date.now().toString(),
            name: newAgent.name,
            industry: newAgent.industry,
            status: "ACTIVE",
        };
        const updated = [agent, ...agents];
        setAgents(updated);
        localStorage.setItem("apex_agents", JSON.stringify(updated));
        setIsCreateModalOpen(false);
        setNewAgent({ name: "", industry: "" });
    };

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">AI Agents</h2>
                    <p className="text-zinc-400">Manage your voice receptionists and sales agents.</p>
                </div>
                <Button onClick={() => setIsCreateModalOpen(true)} className="bg-violet-600 hover:bg-violet-700">
                    <Plus className="mr-2 h-4 w-4" /> Create Agent
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {agents.map((agent) => (
                    <Card key={agent.id} className="bg-zinc-900 border-zinc-800 text-white hover:border-violet-500/50 transition-all">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-lg font-bold">
                                {agent.name}
                            </CardTitle>
                            <div className={`px-2 py-1 rounded text-[10px] font-bold ${agent.status === "ACTIVE" ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-zinc-500/10 text-zinc-500 border border-zinc-500/20"}`}>
                                {agent.status}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <CardDescription className="text-zinc-400">
                                Industry: {agent.industry}
                            </CardDescription>
                            <div className="text-sm text-zinc-500 mt-4 flex items-center gap-2">
                                <Bot size={14} />
                                {agent.vapiAgentId || "No VAPI ID"}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-8 relative shadow-2xl">
                        <button
                            onClick={() => setIsCreateModalOpen(false)}
                            className="absolute top-4 right-4 text-zinc-400 hover:text-white"
                        >
                            <X size={20} />
                        </button>
                        <h3 className="text-2xl font-bold text-white mb-2">Create New Agent</h3>
                        <p className="text-zinc-400 mb-8 text-sm">Deploy a new AI brain for your business.</p>

                        <form onSubmit={handleCreateAgent} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-zinc-300">Agent Name</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g. Roof Repair Intake"
                                    value={newAgent.name}
                                    onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                                    className="bg-zinc-800 border-zinc-700 text-white focus:ring-violet-500"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="industry" className="text-zinc-300">Industry / Purpose</Label>
                                <Input
                                    id="industry"
                                    placeholder="e.g. Roofing, Plumbing..."
                                    value={newAgent.industry}
                                    onChange={(e) => setNewAgent({ ...newAgent, industry: e.target.value })}
                                    className="bg-zinc-800 border-zinc-700 text-white focus:ring-violet-500"
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-700 mt-4 h-12 text-lg font-bold">
                                Deploy Agent 🚀
                            </Button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
