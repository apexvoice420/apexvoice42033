"use client";

import React, { useState } from 'react';
import { Loader2, Search, CheckCircle, AlertCircle } from 'lucide-react';
import { ScrapeRequest, Lead } from '@/types';

const US_STATES = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];

export default function ScraperPage() {
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<Lead[]>([]);
    const [formData, setFormData] = useState<ScrapeRequest>({
        city: '',
        state: 'TX',
        type: 'plumbers',
        minRating: 4.0,
        maxResults: 50
    });
    const [logs, setLogs] = useState<string[]>([]);

    const addLog = (msg: string) => setLogs(prev => [...prev, msg]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setResults([]);
        setLogs([]);
        addLog(`🔄 Starting scrape for ${formData.type} in ${formData.city}, ${formData.state}...`);

        try {
            const response = await fetch('/api/scrape', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Scrape failed');

            const data = await response.json();

            if (data.success) {
                setResults(data.leads);
                addLog(`✅ Successfully found ${data.found} leads.`);
            } else {
                throw new Error(data.error || 'Unknown error');
            }

        } catch (error: any) {
            addLog(`❌ Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Lead Scraper</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Form */}
                <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">City</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white"
                                    placeholder="Dallas"
                                    value={formData.city}
                                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">State</label>
                                <select
                                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white"
                                    value={formData.state}
                                    onChange={e => setFormData({ ...formData, state: e.target.value })}
                                >
                                    {US_STATES.map(state => (
                                        <option key={state} value={state}>{state}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Business Type</label>
                            <input
                                type="text"
                                required
                                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white"
                                placeholder="e.g. plumbers, roofers, dentists"
                                value={formData.type}
                                onChange={e => setFormData({ ...formData, type: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Min Rating ({formData.minRating}★)</label>
                            <input
                                type="range"
                                min="1"
                                max="5"
                                step="0.1"
                                className="w-full"
                                value={formData.minRating}
                                onChange={e => setFormData({ ...formData, minRating: parseFloat(e.target.value) })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Max Results</label>
                            <input
                                type="number"
                                min="1"
                                max="100"
                                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white"
                                value={formData.maxResults}
                                onChange={e => setFormData({ ...formData, maxResults: parseInt(e.target.value) })}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded transition-colors flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" /> Scraping...
                                </>
                            ) : (
                                <>
                                    <Search /> Start Scraping
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Results / Logs */}
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 h-[500px] overflow-y-auto">
                    <h3 className="font-bold mb-4 text-lg">Live Progress</h3>
                    <div className="space-y-2 font-mono text-sm">
                        {logs.length === 0 && <p className="text-slate-500 italic">Ready to scrape...</p>}
                        {logs.map((log, i) => (
                            <div key={i} className="flex items-start gap-2">
                                <span className="text-slate-400">{new Date().toLocaleTimeString()}</span>
                                <span>{log}</span>
                            </div>
                        ))}

                        {results.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-slate-800">
                                <p className="font-bold text-green-400 mb-2">New Leads:</p>
                                {results.map((lead, i) => (
                                    <div key={i} className="p-2 bg-slate-800 rounded mb-2 text-xs">
                                        <div className="font-bold">{lead.businessName}</div>
                                        <div className="text-slate-400">{lead.phone} • {lead.rating}★</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
