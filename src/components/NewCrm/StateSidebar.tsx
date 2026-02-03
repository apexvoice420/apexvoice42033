
import React from 'react';
import { ViewType } from '@/types';
import { SIDEBAR_ITEMS } from './constants';

interface SidebarProps {
    currentView: ViewType | string;
    onViewChange: (view: any) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
    return (
        <aside className="w-64 fixed left-0 top-0 bottom-0 bg-[#0b0e14] border-r border-gray-800 flex flex-col z-50">
            <div className="p-6">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                        <span className="font-bold text-white text-lg">A</span>
                    </div>
                    <span className="font-bold text-white tracking-tight">Apex Voice</span>
                </div>

                <nav className="space-y-1">
                    {SIDEBAR_ITEMS.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onViewChange(item.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${currentView === item.id
                                    ? 'bg-blue-600/10 text-blue-500 border border-blue-600/20 shadow-[0_0_15px_rgba(37,99,235,0.1)]'
                                    : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/50'
                                }`}
                        >
                            {item.icon}
                            {item.label}
                            {item.id === 'opportunities' && (
                                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                            )}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="mt-auto p-6 border-t border-gray-800">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-400">
                        JS
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">John Smith</p>
                        <p className="text-xs text-gray-500 truncate">Admin Access</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
