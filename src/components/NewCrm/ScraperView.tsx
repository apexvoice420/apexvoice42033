
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Lead, LeadStatus } from '@/types';

interface ScraperViewProps {
    onNewLeads: (leads: Lead[]) => void;
}

const ScraperView: React.FC<ScraperViewProps> = ({ onNewLeads }) => {
    const [isScraping, setIsScraping] = useState(false);
    const [city, setCity] = useState('Austin, TX');
    const [category, setCategory] = useState('Plumbers');
    const [logs, setLogs] = useState<string[]>([]);
    const [progress, setProgress] = useState(0);
    const [activeLead, setActiveLead] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const startScrape = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setIsScraping(true);
        setLogs([]);
        setProgress(0);
        setActiveLead(null);
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    const onNewLeadsRef = useRef(onNewLeads);
    useEffect(() => { onNewLeadsRef.current = onNewLeads; }, [onNewLeads]);

    useEffect(() => {
        if (!isScraping) return;

        intervalRef.current = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                        intervalRef.current = null;
                    }
                    setIsScraping(false);

                    const foundLeads: Lead[] = [
                        {
                            id: Math.random().toString(36).substr(2, 9),
                            businessName: `${city.split(',')[0]} Professional ${category.slice(0, -1)}`,
                            phone: `+1555${Math.floor(Math.random() * 9000 + 1000)}`,
                            website: 'scraped-site.com',
                            stars: 4.5 + Math.random() * 0.5,
                            status: LeadStatus.NEW,
                            city: city, // Added
                        }
                    ];
                    onNewLeadsRef.current(foundLeads);
                    setLogs(prevLogs => [...prevLogs, `✅ ANTIGRAVITY: Payload delivered to Railway database.`]);
                    setLogs(prevLogs => [...prevLogs, `🔋 Engine Hibernation Mode Active.`]);
                    return 100;
                }

                const next = prev + 2;
                if (next === 10) setLogs(prevLogs => [...prevLogs, `🛰️ Initializing Antigravity Sat-Link...`]);
                if (next === 20) setLogs(prevLogs => [...prevLogs, `🌐 Routing through ${city.split(',')[0]} Proxy Nodes...`]);
                if (next === 30) {
                    setLogs(prevLogs => [...prevLogs, `🔍 Navigating G-Maps: ${category} in ${city}`]);
                    setActiveLead("Analyzing Map Results...");
                }
                if (next === 50) {
                    setLogs(prevLogs => [...prevLogs, `👀 Antigravity Browser: Found ${category} Listing: "Elite Service Co."`]);
                    setActiveLead("Elite Service Co. (Checking Ratings...)");
                }
                if (next === 65) {
                    setLogs(prevLogs => [...prevLogs, `⭐ Rating Filter: 4.7 Stars - PASS`]);
                }
                if (next === 80) {
                    setLogs(prevLogs => [...prevLogs, `📱 Extracting NAP Data (Name, Address, Phone)...`]);
                    setActiveLead("Extracting: +1 555-0921");
                }

                return next;
            });
        }, 200);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [isScraping, city, category]);

    return (
        <div className="flex gap-6 h-[calc(100vh-120px)] overflow-hidden">
            <div className="w-1/3 flex flex-col gap-6">
                <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 p-6 shadow-xl">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <h2 className="text-xl font-bold text-white uppercase tracking-tighter">Antigravity Scraper</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Geographic Focus</label>
                            <input
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                className="w-full bg-black/40 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="e.g. Austin, TX"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Lead Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full bg-black/40 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                            >
                                <option>Plumbers</option>
                                <option>Roofers</option>
                                <option>Medical Offices</option>
                                <option>Attorneys</option>
                            </select>
                        </div>

                        <button
                            onClick={startScrape}
                            disabled={isScraping}
                            className={`w-full py-3 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${isScraping
                                    ? 'bg-blue-600/20 text-blue-400 cursor-not-allowed border border-blue-500/30'
                                    : 'bg-blue-600 text-white hover:bg-blue-500 active:scale-[0.98] shadow-lg shadow-blue-900/20'
                                }`}
                        >
                            {isScraping ? (
                                <>
                                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Syncing Antigravity...
                                </>
                            ) : '🚀 Deploy Engine'}
                        </button>
                    </div>
                </div>

                <div className="flex-1 bg-black rounded-xl border border-gray-800 p-4 font-mono text-xs overflow-hidden flex flex-col relative">
                    <div className="flex items-center justify-between mb-2 text-gray-600">
                        <span>TERMINAL OUTPUT</span>
                        <span className="animate-pulse">● LIVE</span>
                    </div>
                    <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-1 custom-scrollbar">
                        <div className="text-gray-500 mb-2">Antigravity OS v4.2.0 [BUILD_RAILWAY_STABLE]</div>
                        {logs.map((log, i) => (
                            <div key={i} className="text-blue-400 border-l-2 border-blue-900 pl-2 py-0.5">{`> ${log}`}</div>
                        ))}
                        {isScraping && (
                            <div className="animate-pulse inline-block w-2 h-4 bg-blue-500 ml-1 translate-y-1"></div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex-1 bg-[#111827] rounded-xl border border-gray-800 flex flex-col overflow-hidden relative shadow-2xl">
                <div className="bg-[#1a1f2e] p-3 border-b border-gray-800 flex items-center gap-4">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-rose-500/50"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50"></div>
                    </div>
                    <div className="flex-1 bg-black/40 rounded px-3 py-1 text-[10px] text-gray-500 flex items-center justify-between">
                        <span className="truncate">https://www.google.com/maps/search/{category}+in+{city.replace(' ', '+')}</span>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    </div>
                </div>

                <div className="flex-1 relative bg-gray-950 overflow-hidden">
                    <div className="absolute inset-0 opacity-20" style={{
                        backgroundImage: `linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }}></div>

                    <div className="absolute left-0 top-0 bottom-0 w-64 bg-[#1a1f2e] border-r border-gray-800 p-4 space-y-4">
                        <div className="h-8 bg-gray-800 rounded animate-pulse"></div>
                        <div className="space-y-3">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="bg-gray-900/50 p-3 rounded-lg border border-gray-800 flex flex-col gap-2">
                                    <div className="h-3 w-3/4 bg-gray-800 rounded"></div>
                                    <div className="h-2 w-1/2 bg-gray-800/50 rounded"></div>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map(s => <div key={s} className="w-2 h-2 rounded-full bg-amber-500/30"></div>)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {isScraping && (
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute top-1/2 left-[60%] -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-blue-500/30 rounded-full animate-ping"></div>
                            <div className="absolute top-1/2 left-[60%] -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-blue-500/50 rounded-full animate-pulse"></div>

                            <div className="absolute top-[45%] left-[58%] bg-blue-600/90 text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-xl animate-bounce">
                                🎯 TARGET IDENTIFIED
                            </div>

                            <svg className="absolute inset-0 w-full h-full opacity-30">
                                <line x1="256" y1="200" x2="60%" y2="50%" stroke="#3b82f6" strokeWidth="1" strokeDasharray="5,5" className="animate-[dash_10s_linear_infinite]" />
                            </svg>
                        </div>
                    )}

                    {isScraping && (
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-80 bg-blue-600 rounded-xl p-4 shadow-2xl flex items-center gap-4 border border-blue-400 animate-in slide-in-from-bottom-4">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                            </div>
                            <div className="flex-1">
                                <div className="text-[10px] font-bold text-blue-200 uppercase tracking-widest">Active Extraction</div>
                                <div className="text-sm font-bold text-white truncate">{activeLead || "Scanning Maps..."}</div>
                            </div>
                        </div>
                    )}

                    {!isScraping && progress === 0 && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950/80 backdrop-blur-sm">
                            <div className="w-20 h-20 bg-blue-600/10 border border-blue-500/20 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>
                            </div>
                            <h3 className="text-lg font-bold text-white">Antigravity Live View</h3>
                            <p className="text-gray-500 text-sm mt-1">Configure your target above and deploy the engine.</p>
                        </div>
                    )}
                </div>

                <div className="bg-[#1a1f2e] p-3 border-t border-gray-800 flex justify-between px-6">
                    <div className="flex gap-4">
                        <div className="flex flex-col">
                            <span className="text-[8px] text-gray-500 uppercase font-bold">Scrape Progress</span>
                            <span className="text-xs font-mono text-blue-400">{progress}%</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[8px] text-gray-500 uppercase font-bold">Network Latency</span>
                            <span className="text-xs font-mono text-emerald-400">24ms</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-400">ENGINE STATUS:</span>
                        <span className={`text-[10px] font-bold ${isScraping ? 'text-blue-500' : 'text-gray-600'}`}>
                            {isScraping ? 'ACTIVE_EXTRACTION' : 'IDLE_WAIT'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScraperView;
