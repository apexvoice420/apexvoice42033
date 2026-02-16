"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, Workflow, Trash2, Play, Pause, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface WorkflowData {
    id: string;
    name: string;
    trigger: string;
    action: string;
    status: "ACTIVE" | "PAUSED";
}

export default function WorkflowsPage() {
    const [workflows, setWorkflows] = useState<WorkflowData[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newWF, setNewWF] = useState({ name: "", trigger: "Incoming Call", action: "N8N Multi-step" });

    useEffect(() => {
        const saved = localStorage.getItem("apex_workflows");
        if (saved) {
            const parsed = JSON.parse(saved);
            const typed: WorkflowData[] = parsed.map((w: any) => ({
                ...w,
                status: w.status === "ACTIVE" || w.status === "PAUSED" ? w.status : "ACTIVE"
            }));
            setWorkflows(typed);
        } else {
            const initial: WorkflowData[] = [
                { id: "1", name: "Auto-Book Appointment", trigger: "Post-Call Summary", action: "Google Calendar", status: "ACTIVE" },
                { id: "2", name: "Emergency SMS Alert", trigger: "Urgent Sentiment", action: "Twilio SMS", status: "ACTIVE" }
            ];
            setWorkflows(initial);
            localStorage.setItem("apex_workflows", JSON.stringify(initial));
        }
    }, []);

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        const wf: WorkflowData = {
            id: Date.now().toString(),
            name: newWF.name,
            trigger: newWF.trigger,
            action: newWF.action,
            status: "ACTIVE"
        };
        const updated = [wf, ...workflows];
        setWorkflows(updated);
        localStorage.setItem("apex_workflows", JSON.stringify(updated));
        setIsCreateModalOpen(false);
        setNewWF({ name: "", trigger: "Incoming Call", action: "N8N Multi-step" });
    };

    const toggleStatus = (id: string) => {
        const updated: WorkflowData[] = workflows.map(wf => wf.id === id ? { ...wf, status: wf.status === "ACTIVE" ? "PAUSED" as const : "ACTIVE" as const } : wf);
        setWorkflows(updated);
        localStorage.setItem("apex_workflows", JSON.stringify(updated));
    };

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">Workflows</h2>
                    <p className="text-zinc-400">Automate your operations after the call ends.</p>
                </div>
                <Button onClick={() => setIsCreateModalOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="mr-2 h-4 w-4" /> New Workflow
                </Button>
            </div>

            <div className="grid gap-6">
                {workflows.map((wf) => (
                    <Card key={wf.id} className="bg-zinc-900 border-zinc-800 text-white">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                                    <Workflow size={20} />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-bold">{wf.name}</CardTitle>
                                    <CardDescription className="text-zinc-500">Trigger: {wf.trigger}</CardDescription>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleStatus(wf.id)}
                                    className={`${wf.status === "ACTIVE" ? "text-amber-500 hover:bg-amber-500/10" : "text-green-500 hover:bg-green-500/10"}`}
                                >
                                    {wf.status === "ACTIVE" ? <Pause size={18} /> : <Play size={18} />}
                                </Button>
                                <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-red-500 hover:bg-red-500/10">
                                    <Trash2 size={18} />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm border-t border-zinc-800 pt-4 mt-2 grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-zinc-500 text-[10px] uppercase font-bold">Action</span>
                                    <p className="text-zinc-300 font-medium">{wf.action}</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-zinc-500 text-[10px] uppercase font-bold">Status</span>
                                    <p className={`font-bold ${wf.status === "ACTIVE" ? "text-green-500" : "text-zinc-500"}`}>{wf.status}</p>
                                </div>
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
                        <h3 className="text-2xl font-bold text-white mb-2">Configure Workflow</h3>
                        <p className="text-zinc-400 mb-8 text-sm">Automate actions between Apex Voice and your CRM.</p>

                        <form onSubmit={handleCreate} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="wf-name" className="text-zinc-300">Name</Label>
                                <Input
                                    id="wf-name"
                                    placeholder="e.g. Schedule Estimate"
                                    value={newWF.name}
                                    onChange={(e) => setNewWF({ ...newWF, name: e.target.value })}
                                    className="bg-zinc-800 border-zinc-700 text-white"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="trigger" className="text-zinc-300">Trigger Event</Label>
                                <select
                                    id="trigger"
                                    className="w-full h-10 bg-zinc-800 border border-zinc-700 rounded-md px-3 text-white text-sm outline-none"
                                    value={newWF.trigger}
                                    onChange={(e) => setNewWF({ ...newWF, trigger: e.target.value })}
                                >
                                    <option>Incoming Call</option>
                                    <option>Call Ended</option>
                                    <option>Post-Call Summary</option>
                                    <option>Urgent Keyword Detected</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="action" className="text-zinc-300">Target Integration</Label>
                                <select
                                    id="action"
                                    className="w-full h-10 bg-zinc-800 border border-zinc-700 rounded-md px-3 text-white text-sm outline-none"
                                    value={newWF.action}
                                    onChange={(e) => setNewWF({ ...newWF, action: e.target.value })}
                                >
                                    <option>Google Sheets</option>
                                    <option>Google Calendar</option>
                                    <option>Twilio SMS</option>
                                    <option>N8N Multi-step</option>
                                    <option>GHL (GoHighLevel)</option>
                                </select>
                            </div>
                            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 mt-4 h-12 text-lg font-bold">
                                Create Automation ⚡
                            </Button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
