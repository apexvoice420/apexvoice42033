"use client";

import { useState, useEffect } from 'react';

interface Lead {
  id: number;
  businessName: string;
  phone: string;
  email?: string;
  city?: string;
  state?: string;
  status: string;
  rating?: number;
  createdAt: string;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/leads')
      .then(res => res.json())
      .then(data => {
        setLeads(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-gray-400">Loading leads...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-6">Leads</h1>
      
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-800">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Business</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Phone</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">City</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Status</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Rating</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-slate-800/50">
                <td className="px-4 py-3 text-white">{lead.businessName}</td>
                <td className="px-4 py-3 text-gray-400">{lead.phone}</td>
                <td className="px-4 py-3 text-gray-400">{lead.city}, {lead.state}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-400">
                    {lead.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-yellow-400">{lead.rating || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {leads.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No leads found. Add your first lead to get started.
          </div>
        )}
      </div>
    </div>
  );
}
