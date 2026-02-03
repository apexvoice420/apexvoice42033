"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface Lead {
    id: string | number;
    name: string;
    email: string;
    phone: string;
    status: "NEW" | "CONTACTING" | "NURTURING" | "BOOKED" | "DEAD";
    lastAction: string;
    notes?: string;
    avatar?: string;
}

interface LeadsTableProps {
    leads?: Lead[];
}

const statusColors: Record<string, string> = {
    NEW: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    CONTACTING: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    NURTURING: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    BOOKED: "bg-green-500/10 text-green-400 border-green-500/20",
    DEAD: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function LeadsTable({ leads = [] }: LeadsTableProps) {
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);

    const handleDelete = (id: string | number) => {
        if (confirm("Are you sure you want to delete this lead?")) {
            // TODO: Implement delete API call
            console.log("Deleting lead", id);
            alert("Delete functionality to be connected to API");
        }
    };

    const handleCall = (name: string) => {
        alert(`Calling ${name}...`);
        // TODO: Implement call API
    };

    return (
        <>
            <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-xl overflow-hidden">
                <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-white">Latest Leads</h2>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Search leads..."
                            className="bg-gray-900 border border-gray-600 rounded-lg px-3 py-1.5 text-sm text-gray-300 focus:outline-none focus:border-blue-500"
                        />
                        <button
                            onClick={() => setIsImportModalOpen(true)}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm border border-blue-600 flex items-center gap-2"
                        >
                            <i className="fa-solid fa-file-csv"></i> Import CSV
                        </button>
                        <button className="bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1.5 rounded-lg text-sm border border-gray-600">
                            <i className="fa-solid fa-filter"></i> Filter
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-900/50 text-gray-400 text-xs uppercase tracking-wider">
                                <th className="p-4 font-medium border-b border-gray-700">Name & Contact</th>
                                <th className="p-4 font-medium border-b border-gray-700">Status</th>
                                <th className="p-4 font-medium border-b border-gray-700">Last Action</th>
                                <th className="p-4 font-medium border-b border-gray-700 text-right">Controls</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700 text-sm">
                            {leads.map((lead) => (
                                <tr key={lead.id} className="hover:bg-gray-750 transition-colors group">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 font-bold text-xs">
                                                {lead.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-white">{lead.name}</p>
                                                <p className="text-xs text-gray-500">{lead.email}</p>
                                                <p className="text-xs text-gray-500">{lead.phone}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span
                                            className={cn(
                                                "px-2.5 py-1 rounded-full text-xs font-medium border",
                                                statusColors[lead.status] || "bg-gray-700 text-gray-400"
                                            )}
                                        >
                                            {lead.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-400">
                                        {lead.lastAction}
                                        <div className="text-xs text-gray-500 mt-1 truncate max-w-[150px]">
                                            {lead.notes || "No notes"}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleCall(lead.name)}
                                                className="p-2 rounded bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-white transition"
                                                title="Call Now"
                                            >
                                                <i className="fa-solid fa-phone"></i>
                                            </button>
                                            <button
                                                className="p-2 rounded bg-gray-700 text-gray-400 hover:bg-blue-500 hover:text-white transition"
                                                title="Edit"
                                            >
                                                <i className="fa-solid fa-pen"></i>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(lead.id)}
                                                className="p-2 rounded bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition"
                                                title="Delete"
                                            >
                                                <i className="fa-solid fa-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {leads.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-gray-500">
                                        <i className="fa-solid fa-inbox text-4xl mb-3 opacity-50"></i>
                                        <p>No leads found yet.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination (Visual only for now) */}
                <div className="px-6 py-4 border-t border-gray-700 flex justify-between items-center">
                    <p className="text-xs text-gray-500">
                        Showing <span className="text-white">{leads.length}</span> results
                    </p>
                    <div className="flex gap-2">
                        <button
                            className="px-3 py-1 rounded bg-gray-700 text-gray-400 text-xs hover:text-white disabled:opacity-50"
                            disabled
                        >
                            Previous
                        </button>
                        <button
                            className="px-3 py-1 rounded bg-gray-700 text-gray-400 text-xs hover:text-white disabled:opacity-50"
                            disabled
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* Import Modal Dialog */}
            {isImportModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-gray-800 text-white rounded-xl shadow-2xl p-0 w-full max-w-lg border border-gray-700 relative">
                        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                            <h3 className="text-xl font-bold">Import Leads CSV</h3>
                            <button onClick={() => setIsImportModalOpen(false)} className="text-gray-400 hover:text-white">
                                <i className="fa-solid fa-xmark text-lg"></i>
                            </button>
                        </div>
                        {/* Placeholder for ImportForm */}
                        <div className="p-6">
                            <div
                                className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
                                onClick={() => document.getElementById('csvInput')?.click()}
                            >
                                <i className="fa-solid fa-cloud-arrow-up text-4xl text-gray-500 mb-3"></i>
                                <p className="text-gray-300 font-medium">Click to upload CSV</p>
                                <p className="text-xs text-gray-500 mt-1">Accepted columns: Business Name, Phone, Email, City</p>
                                <input
                                    type="file"
                                    id="csvInput"
                                    accept=".csv"
                                    className="hidden"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;

                                        const formData = new FormData();
                                        formData.append('file', file);

                                        try {
                                            const btn = document.getElementById('uploadText');
                                            if (btn) btn.innerText = "Uploading...";

                                            const res = await fetch('/api/leads/import', {
                                                method: 'POST',
                                                body: formData
                                            });

                                            if (res.ok) {
                                                alert('Leads imported successfully!');
                                                setIsImportModalOpen(false);
                                                window.location.reload();
                                            } else {
                                                alert('Import failed.');
                                            }
                                        } catch (err) {
                                            console.error(err);
                                            alert('Error uploading file.');
                                        }
                                    }}
                                />
                                <p id="uploadText" className="text-sm text-blue-400 mt-2 font-mono"></p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
