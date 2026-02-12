"use client";

import { useEffect, useState } from "react";
import KanbanBoard from "../../../components/Crm/KanbanBoard";

export default function OpportunitiesPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Opportunities</h1>
            <p className="text-slate-400">Manage your sales pipeline.</p>
            <div className="h-[600px] bg-slate-950 border border-slate-800 rounded-lg p-4 overflow-x-auto">
                {/* 
                  NOTE: KanbanBoard needs to be upgraded to use the new API.
                  For now, we render it if compatible, or a placeholder.
                  Currently the component exists in components/Crm/KanbanBoard.tsx
                */}
                <KanbanBoard />
            </div>
        </div>
    );
}
