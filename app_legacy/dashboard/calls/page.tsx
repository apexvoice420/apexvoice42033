export default function CallsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Call Logs</h1>
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-8 text-center">
                <p className="text-slate-400 mb-4">Call history will appear here once connected to VAPI.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                    <div className="bg-slate-900 p-4 rounded border border-slate-800">
                        <span className="block text-2xl font-bold text-white">0</span>
                        <span className="text-sm text-slate-500">Total Calls</span>
                    </div>
                    <div className="bg-slate-900 p-4 rounded border border-slate-800">
                        <span className="block text-2xl font-bold text-white">0m</span>
                        <span className="text-sm text-slate-500">Duration</span>
                    </div>
                    <div className="bg-slate-900 p-4 rounded border border-slate-800">
                        <span className="block text-2xl font-bold text-green-500">$0.00</span>
                        <span className="text-sm text-slate-500">Cost</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
