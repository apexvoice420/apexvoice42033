export default function CalendarsPage() {
    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Calendars</h2>
                <div className="space-x-2">
                    <button className="px-3 py-1.5 bg-white border text-slate-600 rounded text-sm">Week</button>
                    <button className="px-3 py-1.5 bg-white border text-slate-600 rounded text-sm">Month</button>
                </div>
            </div>
            <div className="flex-1 bg-white rounded-lg border border-slate-200 shadow-sm flex items-center justify-center text-slate-400">
                Calendar View Component
            </div>
        </div>
    );
}
