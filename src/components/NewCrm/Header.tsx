import React from "react";

export default function Header() {
    return (
        <header className="h-16 bg-gray-900/80 backdrop-blur-md border-b border-gray-800 flex items-center justify-between px-6 md:px-8 z-10 sticky top-0">
            {/* Breadcrumbs */}
            <div className="flex items-center text-sm">
                <span className="text-gray-500">Dashboard</span>
                <i className="fa-solid fa-chevron-right text-xs text-gray-600 mx-2"></i>
                <span className="text-gray-200 font-medium">Overview</span>
            </div>

            {/* Right Header Tools */}
            <div className="flex items-center gap-6">
                {/* System Status */}
                <div className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-full border border-gray-700">
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                    </span>
                    <span className="text-xs font-semibold text-gray-300">Vapi Online</span>
                </div>

                {/* Admin Profile */}
                <div className="flex items-center gap-3 pl-6 border-l border-gray-800">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-white">Admin</p>
                        <p className="text-xs text-gray-500">Admin</p>
                    </div>
                    <div className="h-9 w-9 bg-gray-700 rounded-full flex items-center justify-center text-gray-300 border border-gray-600">
                        <i className="fa-solid fa-user"></i>
                    </div>
                </div>
            </div>
        </header>
    );
}
