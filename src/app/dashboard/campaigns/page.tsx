export default function CampaignsPage() {
    return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-gray-500">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Campaigns</h1>
            <p className="text-lg font-medium">Coming Soon</p>
            <p className="text-sm">Agent A is refining the Campaigns module.</p>
        </div>
    );
}
