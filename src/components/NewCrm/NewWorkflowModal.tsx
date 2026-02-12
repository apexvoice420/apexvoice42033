"use client";

import React, { useState } from "react";

interface NewWorkflowModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function NewWorkflowModal({ isOpen, onClose }: NewWorkflowModalProps) {
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get("name"),
            trigger_type: formData.get("trigger_type"),
            config: formData.get("config"),
        };

        try {
            const res = await fetch("/api/workflows", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                alert("Workflow created successfully!");
                onClose();
                window.location.reload();
            } else {
                alert("Failed to create workflow.");
            }
        } catch (err) {
            console.error(err);
            alert("Error creating workflow.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-gray-800 text-white rounded-xl shadow-2xl p-0 w-full max-w-lg border border-gray-700">
                <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="text-xl font-bold">New Workflow</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <i className="fa-solid fa-xmark text-lg"></i>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Workflow Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            placeholder="e.g. Daily Leads Import"
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Trigger Type</label>
                        <select
                            name="trigger_type"
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                        >
                            <option value="GOOGLE_SHEET_IMPORT">Google Sheets Sync</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Google Sheet ID</label>
                        <input
                            type="text"
                            name="config"
                            required
                            placeholder="e.g. 1BxiMVs0XRA5n..."
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Copy the ID from your Google Sheet URL.</p>
                    </div>

                    <div className="flex justify-end pt-4 gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-2 disabled:opacity-50"
                        >
                            {loading ? "Creating..." : "Create Workflow"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
