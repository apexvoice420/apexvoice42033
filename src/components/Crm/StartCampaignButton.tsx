"use client";

import { useState } from 'react';
import { Play, Loader2 } from 'lucide-react';

export default function StartCampaignButton() {
    const [loading, setLoading] = useState(false);

    const startCampaign = async () => {
        if (!confirm('Are you sure you want to start the calling campaign for all NEW leads?')) return;

        setLoading(true);
        try {
            const res = await fetch('/api/campaign/start', { method: 'POST' });
            const data = await res.json();
            if (data.success) {
                alert(`Campaign started! Initiated ${data.processed} calls.`);
                window.location.reload(); // Quick way to refresh UI status
            } else {
                alert('Failed to start campaign: ' + (data.message || 'Unknown error'));
            }
        } catch (error) {
            console.error(error);
            alert('Error starting campaign');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={startCampaign}
            disabled={loading}
            className={`flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg shadow-md hover:shadow-lg hover:from-indigo-700 hover:to-blue-700 transition transform hover:-translate-y-0.5 active:translate-y-0
        ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
            {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <Play className="w-4 h-4 fill-current" />
            )}
            <span className="font-semibold">Start Campaign</span>
        </button>
    );
}
