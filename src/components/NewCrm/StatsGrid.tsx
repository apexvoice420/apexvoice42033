import React from "react";

interface Stats {
    total_leads: number | string;
    calls_made: number | string;
    conversion_rate: number | string;
    revenue: number | string;
}

interface StatsGridProps {
    stats?: Stats;
}

export default function StatsGrid({ stats = {
    total_leads: 0,
    calls_made: 0,
    conversion_rate: 0,
    revenue: 0
} }: StatsGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Card 1 */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg relative overflow-hidden group hover:border-blue-500/50 transition-all">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Total Leads</p>
                        <h3 className="text-3xl font-bold text-white mt-1">{stats.total_leads}</h3>
                    </div>
                    <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
                        <i className="fa-solid fa-users text-xl"></i>
                    </div>
                </div>
                <div className="flex items-center text-sm text-green-400">
                    <i className="fa-solid fa-arrow-trend-up mr-1"></i>
                    <span>+12% <span className="text-gray-500 ml-1">vs last week</span></span>
                </div>
            </div>

            {/* Card 2 */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg relative overflow-hidden group hover:border-purple-500/50 transition-all">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Calls Made</p>
                        <h3 className="text-3xl font-bold text-white mt-1">{stats.calls_made}</h3>
                    </div>
                    <div className="p-3 bg-purple-500/10 rounded-lg text-purple-400">
                        <i className="fa-solid fa-phone-volume text-xl"></i>
                    </div>
                </div>
                <div className="flex items-center text-sm text-green-400">
                    <i className="fa-solid fa-arrow-trend-up mr-1"></i>
                    <span>+5% <span className="text-gray-500 ml-1">completion</span></span>
                </div>
            </div>

            {/* Card 3 */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg relative overflow-hidden group hover:border-orange-500/50 transition-all">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Conversion</p>
                        <h3 className="text-3xl font-bold text-white mt-1">{stats.conversion_rate}%</h3>
                    </div>
                    <div className="p-3 bg-orange-500/10 rounded-lg text-orange-400">
                        <i className="fa-solid fa-bolt text-xl"></i>
                    </div>
                </div>
                <div className="w-full bg-gray-700 h-1.5 rounded-full mt-4 overflow-hidden">
                    <div
                        className="bg-orange-500 h-full rounded-full"
                        style={{ width: `${stats.conversion_rate}%` }}
                    ></div>
                </div>
            </div>

            {/* Card 4 */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg relative overflow-hidden group hover:border-green-500/50 transition-all">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Revenue Pipe</p>
                        <h3 className="text-3xl font-bold text-white mt-1">${stats.revenue}</h3>
                    </div>
                    <div className="p-3 bg-green-500/10 rounded-lg text-green-400">
                        <i className="fa-solid fa-sack-dollar text-xl"></i>
                    </div>
                </div>
                <div className="flex items-center text-sm text-gray-400">
                    <span>Avg Deal: $500</span>
                </div>
            </div>
        </div>
    );
}
