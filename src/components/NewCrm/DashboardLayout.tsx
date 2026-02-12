import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <div className="flex h-screen overflow-hidden bg-gray-900 text-gray-100 font-sans antialiased selection:bg-purple-500 selection:text-white">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Header */}
                <Header />

                {/* Main Scrollable Area */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900 p-6 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
