"use client";

import React, { useState } from "react";

interface NewCampaignModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function NewCampaignModal({ isOpen, onClose }: NewCampaignModalProps) {
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get("name"),
            script: formData.get("script"),
        };

        try {
            const res = await fetch("/api/campaigns/start", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                alert("Campaign started successfully!");
                onClose();
            } else {
                alert("Failed to start campaign.");
            }
        } catch (err) {
            console.error(err);
            alert("Error starting campaign.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-gray-800 text-white rounded-xl shadow-2xl p-0 w-full max-w-lg border border-gray-700">
                <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="text-xl font-bold">New Campaign</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <i className="fa-solid fa-xmark text-lg"></i>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Campaign Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            placeholder="e.g. Q1 Cold Outreach"
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Select Script</label>
                        <select
                            name="script"
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                        >
                            <option value="appointment_setting_v1">Appt. Setting V1</option>
                            <option value="inbound_qualify">Inbound Qualify</option>
                            <option value="real_estate_followup">Real Estate Follow-up</option>
                        </select>
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
                            {loading ? "Launching..." : "Launch Campaign"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
