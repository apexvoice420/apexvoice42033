"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";
import NewCampaignModal from "./NewCampaignModal";

export default function Sidebar() {
    const pathname = usePathname();
    const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);

    const links = [
        { name: "Dashboard", href: "/dashboard", icon: "fa-chart-line" },
        { name: "Live Leads", href: "/dashboard", icon: "fa-inbox" }, // Temporary redirect to dashboard
        { name: "Workflows", href: "/workflows", icon: "fa-network-wired" },
        { name: "Call Logs", href: "/dashboard/calls", icon: "fa-phone" },
        { name: "Settings", href: "/dashboard/settings", icon: "fa-sliders" },
    ];

    return (
        <>
            <NewCampaignModal
                isOpen={isCampaignModalOpen}
                onClose={() => setIsCampaignModalOpen(false)}
            />
            <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col hidden md:flex">
                {/* Logo */}
                <div className="p-6 border-b border-gray-800">
                    <div className="flex items-center gap-3">
                        <img src="/assets/logo.png" alt="Apex Voice Solutions" className="h-8 w-auto" />
                    </div>
                </div>

                {/* Action Button */}
                <div className="p-4">
                    <button
                        onClick={() => setIsCampaignModalOpen(true)}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2"
                    >
                        <i className="fa-solid fa-plus"></i> New Campaign
                    </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
                    {links.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group",
                                    isActive
                                        ? "text-gray-300 bg-gray-800/50 border border-gray-700/50 hover:bg-gray-800 hover:text-white"
                                        : "text-gray-400 hover:bg-gray-800 hover:text-white"
                                )}
                            >
                                <i className={cn("fa-solid", link.icon, isActive ? "text-blue-400" : "text-gray-500 group-hover:text-purple-400")}></i>
                                <span className="font-medium">{link.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* User Footer */}
                <div className="p-4 border-t border-gray-800">
                    <Link
                        href="/auth/logout"
                        className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-red-400 transition-colors"
                    >
                        <i className="fa-solid fa-arrow-right-from-bracket"></i>
                        <span>Logout</span>
                    </Link>
                </div>
            </aside>
        </>
    );
}
