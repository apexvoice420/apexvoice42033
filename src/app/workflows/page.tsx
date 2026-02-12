"use client";

import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/NewCrm/DashboardLayout";
import NewWorkflowModal from "@/components/NewCrm/NewWorkflowModal";

interface Workflow {
    id: string;
    name: string;
    trigger_type: string;
    config: string;
    last_run: string | null;
}

export default function WorkflowsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [workflows, setWorkflows] = useState<Workflow[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWorkflows();
    }, []);

    async function fetchWorkflows() {
        try {
            const res = await fetch("/api/workflows");
            const data = await res.json();
            if (data.workflows) {
                setWorkflows(data.workflows);
            }
        } catch (error) {
            console.error("Failed to load workflows", error);
        } finally {
            setLoading(false);
        }
    }

    const handleDelete = async (id: string) => {
        if (confirm("Delete this workflow?")) {
            // TODO: API delete endpoint
            alert("Delete API to be implemented");
        }
    }

    return (
        <DashboardLayout>
            <NewWorkflowModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

            <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Workflows</h2>
                        <p className="text-gray-400 text-sm">Automate lead ingestion and processing.</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
                    >
                        <i className="fa-solid fa-plus"></i> New Workflow
                    </button>
                </div>

                {/* Active Workflows Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        <div className="col-span-full text-center text-gray-500">Loading workflows...</div>
                    ) : workflows.map((workflow) => (
                        <div key={workflow.id} className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg relative group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-green-500/10 rounded-lg text-green-400">
                                    <i className="fa-solid fa-file-csv text-xl"></i>
                                </div>
                                {/* Controls */}
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="text-gray-400 hover:text-white" title="Settings">
                                        <i className="fa-solid fa-gear"></i>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(workflow.id)}
                                        className="text-gray-400 hover:text-red-400"
                                        title="Delete"
                                    >
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-white mb-1">{workflow.name}</h3>
                            <p className="text-xs text-gray-400 mb-4 bg-gray-700/50 p-1.5 rounded truncate font-mono">
                                ID: {workflow.config}
                            </p>

                            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-700">
                                <span className="text-xs text-gray-500">
                                    Last sync: {workflow.last_run ? new Date(workflow.last_run as string).toLocaleDateString() : 'Never'}
                                </span>

                                <button
                                    onClick={() => alert("Sync started! Check Dashboard for new leads.")}
                                    className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded transition"
                                >
                                    <i className="fa-solid fa-rotate mr-1"></i> Sync Now
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Empty State */}
                    {!loading && workflows.length === 0 && (
                        <div className="col-span-full py-12 text-center border-2 border-dashed border-gray-700 rounded-xl">
                            <i className="fa-solid fa-robot text-4xl text-gray-600 mb-3"></i>
                            <h3 className="text-gray-400 font-medium">No active workflows</h3>
                            <p className="text-gray-500 text-sm mt-1">Create a workflow to import leads automatically.</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
