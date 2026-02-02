import { LucideIcon, ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';
import { cn } from "../../lib/utils";

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

export default function StatsCard({ title, value, icon: Icon, trend, color = "indigo" }: StatsCardProps) {
    const colorStyles = {
        blue: "text-blue-500 bg-blue-500/10 border-blue-500/20",
        indigo: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
        purple: "text-purple-500 bg-purple-500/10 border-purple-500/20",
        emerald: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    };

    return (
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-800 shadow-xl hover:border-slate-700 transition-all duration-200 group">
            <div className="flex justify-between items-start mb-4">
                <div className={cn("p-3 rounded-lg border transition-colors", colorStyles[color])}>
                    <Icon className="h-6 w-6" />
                </div>
                {trend && (
                    <div className={cn(
                        "flex items-center text-xs font-medium px-2 py-1 rounded-full border",
                        trend.isPositive
                            ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
                            : "text-rose-400 bg-rose-400/10 border-rose-400/20"
                    )}>
                        {trend.isPositive ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                        {trend.value}
                    </div>
                )}
            </div>

            <div className="space-y-1">
                <h3 className="text-sm font-medium text-slate-400">{title}</h3>
                <div className="flex items-baseline gap-2">
                    <h2 className="text-3xl font-bold text-white tracking-tight">{value}</h2>
                </div>
            </div>

            {trend && (
                <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                    <span>{trend.label}</span>
                </div>
            )}
        </div>
    );
}
