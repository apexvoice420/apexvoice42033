"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Search,
    Users,
    MessageSquare,
    Megaphone,
    Calendar,
    BarChart3,
    Bot,
    Settings,
    Users2,
    Workflow,
} from "lucide-react";

const routes = [
    {
        label: "Launchpad",
        icon: LayoutDashboard,
        href: "/dashboard",
        color: "text-sky-500",
    },
    {
        label: "Agents",
        icon: Bot,
        href: "/dashboard/agents",
        color: "text-blue-500",
    },
    {
        label: "Workflows",
        icon: Workflow,
        href: "/dashboard/workflows",
        color: "text-emerald-500",
    },
    {
        label: "Lead Scraper",
        icon: Search,
        href: "/dashboard/scraper",
        color: "text-violet-500",
    },
    {
        label: "Contacts",
        icon: Users,
        href: "/dashboard/contacts",
        color: "text-pink-700",
    },
    {
        label: "Conversations",
        icon: MessageSquare,
        href: "/dashboard/conversations",
        color: "text-orange-700",
    },
    {
        label: "Campaigns",
        icon: Megaphone,
        href: "/dashboard/campaigns",
        color: "text-emerald-500",
    },
    {
        label: "Calendar",
        icon: Calendar,
        href: "/dashboard/calendars",
        color: "text-green-700",
    },
    {
        label: "Reports",
        icon: BarChart3,
        href: "/dashboard/reports",
        color: "text-blue-700",
    },
    {
        label: "Team",
        icon: Users2,
        href: "/dashboard/team",
        color: "text-indigo-700",
    },
    {
        label: "Settings",
        icon: Settings,
        href: "/dashboard/settings",
    },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
            <div className="px-3 py-2 flex-1">
                <Link href="/dashboard" className="flex items-center pl-3 mb-14">
                    <img
                        src="/assets/logo.png"
                        alt="Apex Voice Solutions"
                        className="h-10 w-auto"
                    />
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                                pathname === route.href ? "text-white bg-white/10" : "text-zinc-400"
                            )}
                        >
                            <div className="flex items-center flex-1">
                                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                                {route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
