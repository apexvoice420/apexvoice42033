
import React, { useState } from 'react';

interface SettingsViewProps {
    config: {
        vapiAssistantId: string;
        vapiApiKey: string;
        railwayEndpoint: string;
        railwayApiKey: string;
    };
    onSave: (newConfig: any) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ config, onSave }) => {
    const [localConfig, setLocalConfig] = useState(config);

    return (
        <div className="max-w-4xl mx-auto py-8">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Engine Settings</h2>
                    <p className="text-gray-400">Configure your high-latency voice agents and cloud database connectivity.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-5 py-2 text-sm text-gray-500 hover:text-white transition-colors">Documentation</button>
                    <button
                        onClick={() => onSave(localConfig)}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-lg shadow-blue-900/40 transition-all active:scale-95"
                    >
                        Deploy Configuration
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
                <section className="bg-[#1a1f2e] rounded-2xl border border-gray-800 p-8 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                        </span>
                        VAPI Telephony Integration
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2 tracking-widest">Assistant ID</label>
                            <input
                                type="password"
                                value={localConfig.vapiAssistantId}
                                onChange={(e) => setLocalConfig({ ...localConfig, vapiAssistantId: e.target.value })}
                                className="w-full bg-black/40 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-700"
                                placeholder="va-xxxx-xxxx-xxxx"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2 tracking-widest">VAPI Private Key</label>
                            <input
                                type="password"
                                value={localConfig.vapiApiKey}
                                onChange={(e) => setLocalConfig({ ...localConfig, vapiApiKey: e.target.value })}
                                className="w-full bg-black/40 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-700"
                                placeholder="Bearer xxxx..."
                            />
                        </div>
                    </div>
                    <div className="mt-6 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-xs text-emerald-400 leading-relaxed">
                        <span className="font-bold">Info:</span> Your VAPI assistant ID is required to route outbound calls through the Apex custom agents.
                    </div>
                </section>

                <section className="bg-[#1a1f2e] rounded-2xl border border-gray-800 p-8 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                        </span>
                        Railway Backend Architecture
                    </h3>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2 tracking-widest">Lead Engine REST Endpoint</label>
                            <input
                                type="text"
                                value={localConfig.railwayEndpoint}
                                onChange={(e) => setLocalConfig({ ...localConfig, railwayEndpoint: e.target.value })}
                                className="w-full bg-black/40 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all placeholder:text-gray-700"
                                placeholder="https://apex-backend.up.railway.app"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2 tracking-widest">Railway Project Auth Key</label>
                            <input
                                type="password"
                                value={localConfig.railwayApiKey}
                                onChange={(e) => setLocalConfig({ ...localConfig, railwayApiKey: e.target.value })}
                                className="w-full bg-black/40 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all placeholder:text-gray-700"
                                placeholder="railway-sk-xxxx..."
                            />
                        </div>
                    </div>
                </section>
            </div>

            <div className="mt-12 text-center text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em]">
                Apex Voice Solutions CRM v4.2.0 • 2024 Build
            </div>
        </div>
    );
};

export default SettingsView;
