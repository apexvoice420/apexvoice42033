"use client";

import { useEffect, useState } from "react";
import { fetchLeads } from "../../../lib/api";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Search, Loader2 } from "lucide-react";
import Link from "next/link";

export default function ContactsPage() {
    const [leads, setLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        loadLeads();
    }, []);

    async function loadLeads() {
        try {
            const data = await fetchLeads();
            setLeads(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    const filteredLeads = leads.filter(l =>
        l.business_name?.toLowerCase().includes(search.toLowerCase()) ||
        l.phone?.includes(search)
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white">Contacts</h1>
                <Link href="/dashboard/crm/importer">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                        + Manual Import
                    </Button>
                </Link>
            </div>

            <Card className="bg-slate-950 border-slate-800">
                <CardHeader>
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                        <Input
                            placeholder="Search contacts..."
                            className="pl-9 bg-slate-900 border-slate-800 text-white"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center p-8">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-slate-400">
                                <thead className="text-xs text-slate-500 uppercase bg-slate-900/50">
                                    <tr>
                                        <th className="px-6 py-3">Name</th>
                                        <th className="px-6 py-3">Phone</th>
                                        <th className="px-6 py-3">City</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3">Source</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredLeads.map((lead) => (
                                        <tr key={lead.id} className="border-b border-slate-800 hover:bg-slate-900/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-white">{lead.business_name}</td>
                                            <td className="px-6 py-4">{lead.phone}</td>
                                            <td className="px-6 py-4">{lead.city}</td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400">
                                                    {lead.status || 'New'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">{lead.source}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredLeads.length === 0 && (
                                <div className="text-center p-8 text-slate-500">
                                    No contacts found.
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
