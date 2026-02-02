export default function LaunchpadPage() {
    return (
        <div className="flex flex-col items-center justify-center h-full space-y-4">
            <h2 className="text-3xl font-bold text-slate-800">Launchpad</h2>
            <p className="text-slate-500 max-w-md text-center">Quickly connect your Google Business Profile, Facebook, and Stripe accounts here.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl mt-8">
                {/* Mock Integrations */}
                {['Google My Business', 'Facebook', 'Stripe', 'Yext'].map((app) => (
                    <div key={app} className="p-4 border rounded-lg bg-white shadow-sm flex items-center justify-between">
                        <span className="font-medium text-slate-700">{app}</span>
                        <button className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded">Connect</button>
                    </div>
                ))}
            </div>
        </div>
    );
}
