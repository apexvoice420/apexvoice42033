"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, MessageSquare, Users, BarChart3, Settings, Phone, Megaphone } from "lucide-react";
import { cn } from "../../lib/utils";

const sidebarItems = [
    { name: "Launchpad", href: "/dashboard", icon: LayoutDashboard },
    { name: "Conversations", href: "/dashboard/conversations", icon: MessageSquare },
    { name: "Contacts", href: "/dashboard/contacts", icon: Users },
    { name: "Opportunities", href: "/dashboard/opportunities", icon: BarChart3 },
    { name: "Campaigns", href: "/dashboard/campaigns", icon: Megaphone },
    { name: "Calls", href: "/dashboard/calls", icon: Phone },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex flex-col h-full w-64 bg-slate-950 border-r border-slate-800 text-white">
            <div className="p-6 border-b border-slate-800 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white">
                    A
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    Apex Voice
                </span>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-blue-600/10 text-blue-400 border border-blue-500/20"
                                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                            )}
                        >
                            <item.icon className={cn("h-5 w-5", isActive ? "text-blue-400" : "text-slate-500")} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <div className="flex items-center gap-3 px-4 py-3">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-medium text-slate-400">
                        JD
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-white">John Doe</span>
                        <span className="text-xs text-slate-500">Admin</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
