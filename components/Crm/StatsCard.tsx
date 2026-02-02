import { LucideIcon, ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        value: string;
        label: string;
        isPositive: boolean;
    };
    color?: "blue" | "indigo" | "purple" | "emerald";
}

// GHL uses specific colors for icons in circles
const colorMap = {
    blue: "bg-blue-100 text-blue-600",
    indigo: "bg-indigo-100 text-indigo-600",
    purple: "bg-purple-100 text-purple-600",
    emerald: "bg-emerald-100 text-emerald-600",
};

export default function StatsCard({ title, value, icon: Icon, trend, color = "indigo" }: StatsCardProps) {
    return (
        <div className="bg-slate-900 rounded-lg p-5 border border-slate-800 shadow-sm hover:border-slate-700 transition-colors relative overflow-hidden group">

            {/* Top Row: Title and Icon */}
            <div className="flex justify-between items-start mb-2">
                <h4 className="text-slate-400 text-[13px] font-semibold uppercase tracking-wider">{title}</h4>
                <div className={`p-2 rounded-full bg-slate-800 text-${color}-400`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>

            {/* Value */}
            <h3 className="text-[32px] font-bold text-white tracking-tight leading-none mb-4">
                {value}
            </h3>

            {/* Trend / Footer */}
            {trend && (
                <div className="flex items-center text-xs font-medium text-slate-500 pt-3 border-t border-slate-800">
                    <span className={`flex items-center mr-2 px-1.5 py-0.5 rounded ${trend.isPositive ? 'text-emerald-400 bg-emerald-950/30' : 'text-red-400 bg-red-950/30'}`}>
                        {trend.isPositive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                        {trend.value}
                    </span>
                    <span className="text-slate-500">{trend.label}</span>
                </div>
            )}

            {!trend && (
                <div className="text-xs text-slate-500 pt-3 border-t border-slate-800 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1 text-slate-600" />
                    <span>Updated just now</span>
                </div>
            )}

            {/* Decorative gradient blur */}
            <div className={`absolute -bottom-4 -right-4 w-20 h-20 bg-gradient-to-br from-transparent to-${color}-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`}></div>
        </div>
    );
}
