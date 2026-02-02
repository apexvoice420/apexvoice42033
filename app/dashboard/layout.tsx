import Link from 'next/link';

export default function DashboardLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen bg-slate-900 text-white">
            <aside className="w-64 bg-slate-800 p-4 border-r border-slate-700">
                <h1 className="text-2xl font-bold mb-8 text-blue-400">Apex Voice</h1>
                <nav className="space-y-2">
                    <Link href="/dashboard" className="block p-2 rounded hover:bg-slate-700 transition-colors">
                        🏠 Dashboard
                    </Link>
                    <Link href="/dashboard/scraper" className="block p-2 rounded hover:bg-slate-700 transition-colors">
                        🔍 Scraper
                    </Link>
                    <Link href="/dashboard/calls" className="block p-2 rounded hover:bg-slate-700 transition-colors">
                        📞 Calls
                    </Link>
                </nav>
            </aside>
            <main className="flex-1 overflow-auto bg-slate-900">
                {children}
            </main>
        </div>
    );
}
