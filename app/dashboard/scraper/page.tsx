'use client';

import { useState } from 'react';

export default function Scraper() {
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [type, setType] = useState('plumbers');
    const [minRating, setMinRating] = useState(4.0);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<any[]>([]);

    const handleScrape = async () => {
        setLoading(true);
        setResults([]);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
            const res = await fetch(`${apiUrl}/scrape`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    city,
                    state,
                    type,
                    minRating,
                    maxResults: 10 // Free tier limit
                })
            });

            const data = await res.json();

            if (data.success) {
                setResults(data.leads || []);
                alert(`Found ${data.found} leads, saved ${data.saved} new ones!`);
            } else {
                alert('Error: ' + data.error);
            }
        } catch (error: any) {
            alert('Error scraping: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-8">Lead Scraper</h1>

            <div className="bg-slate-800 p-6 rounded-lg max-w-2xl border border-slate-700">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm mb-2 text-slate-300">State (2 letters)</label>
                        <input
                            type="text"
                            placeholder="TX"
                            maxLength={2}
                            value={state}
                            onChange={(e) => setState(e.target.value.toUpperCase())}
                            className="w-full bg-slate-700 p-2 rounded border border-slate-600 focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-2 text-slate-300">City</label>
                        <input
                            type="text"
                            placeholder="Dallas"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full bg-slate-700 p-2 rounded border border-slate-600 focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-2 text-slate-300">Business Type</label>
                        <input
                            type="text"
                            placeholder="plumbers"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full bg-slate-700 p-2 rounded border border-slate-600 focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-2 text-slate-300">Min Rating: {minRating}</label>
                        <input
                            type="range"
                            min="1"
                            max="5"
                            step="0.1"
                            value={minRating}
                            onChange={(e) => setMinRating(parseFloat(e.target.value))}
                            className="w-full accent-blue-500"
                        />
                    </div>

                    <div className="bg-yellow-900/30 border border-yellow-600 p-3 rounded text-sm text-yellow-200">
                        ⚠️ Free tier limit: 10 leads per scrape (Vercel 10s timeout)
                    </div>

                    <button
                        onClick={handleScrape}
                        disabled={loading || !city || !state}
                        className="w-full bg-blue-600 p-3 rounded font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? 'Scraping...' : 'Start Scraping (Max 10)'}
                    </button>
                </div>
            </div>

            {results.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-2xl font-bold mb-4">Results ({results.length})</h2>
                    <div className="space-y-2">
                        {results.map((lead, i) => (
                            <div key={i} className="bg-slate-800 p-4 rounded border border-slate-700 flex justify-between items-center">
                                <div>
                                    <span className="font-bold text-lg">{lead.business_name}</span>
                                    <span className="ml-2 text-yellow-400">★ {lead.rating}</span>
                                </div>
                                <div className="text-slate-400">{lead.phone}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
