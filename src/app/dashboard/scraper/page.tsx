"use client";

import React, { useCallback } from 'react';
import ScraperView from '@/components/NewCrm/ScraperView';
import { Lead } from '@/types';

export default function ScraperPage() {
    const handleNewLeads = useCallback((newLeads: Lead[]) => {
        // Simple handler to persist to localStorage for now, similar to dashboard/page.tsx
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('apex_leads');
            const currentLeads = saved ? JSON.parse(saved) : [];
            const updatedLeads = [...newLeads, ...currentLeads];
            localStorage.setItem('apex_leads', JSON.stringify(updatedLeads));
            console.log("Leads saved from Scraper:", newLeads);
        }
    }, []);

    return (
        <div className="h-full p-8">
            <ScraperView onNewLeads={handleNewLeads} />
        </div>
    );
}
