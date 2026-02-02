import Link from 'next/link';
import React from 'react';

export default function DashboardLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen bg-slate-900">
            <aside className="w-64 bg-slate-800 p-4 text-white">
                <h1 className="text-2xl font-bold mb-8">Apex Voice</h1>
                <nav className="space-y-2">
                    <Link href="/dashboard" className="block p-2 rounded hover:bg-slate-700">
                        🏠 Dashboard
                    </Link>
                    <Link href="/dashboard/scraper" className="block p-2 rounded hover:bg-slate-700">
                        🔍 Scraper
                    </Link>
                    <Link href="/dashboard/leads" className="block p-2 rounded hover:bg-slate-700">
                        👥 Leads
                    </Link>
                    <Link href="/dashboard/calls" className="block p-2 rounded hover:bg-slate-700">
                        📞 Calls
                    </Link>
                </nav>
            </aside>
            <main className="flex-1 overflow-auto p-8 text-white">
                {children}
            </main>
        </div>
    );
}
