export default function ConversationsPage() {
    return (
        <div className="flex items-center justify-center h-full">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-800">Conversations</h2>
                <p className="text-slate-500 mt-2">Manage your SMS and Call logs here.</p>
                <div className="mt-8 p-8 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
                    <p className="text-slate-400">No conversations yet.</p>
                </div>
            </div>
        </div>
    );
}
