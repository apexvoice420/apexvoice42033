export default function TeamPage() {
    return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-gray-500">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Team</h1>
            <p className="text-lg font-medium">Coming Soon</p>
            <p className="text-sm">Agent A is refining the Team module.</p>
        </div>
    );
}
