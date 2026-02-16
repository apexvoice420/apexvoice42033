"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, User, Phone, Mail, Filter, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";

interface Contact {
    id: string;
    name: string;
    email: string;
    phone: string;
    status: string;
    lastCall: string;
}

export default function ContactsPage() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newContact, setNewContact] = useState({ name: "", email: "", phone: "" });

    useEffect(() => {
        const saved = localStorage.getItem("apex_contacts");
        if (saved) {
            setContacts(JSON.parse(saved));
        } else {
            const initial: Contact[] = [
                { id: "1", name: "Maurice Smith", email: "maurice@example.com", phone: "+1 (555) 123-4567", status: "Lead", lastCall: "2 hours ago" },
                { id: "2", name: "Sarah Johnson", email: "sarah@apex.com", phone: "+1 (555) 987-6543", status: "Booked", lastCall: "Yesterday" }
            ];
            setContacts(initial);
            localStorage.setItem("apex_contacts", JSON.stringify(initial));
        }
    }, []);

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        const contact: Contact = {
            id: Date.now().toString(),
            name: newContact.name,
            email: newContact.email,
            phone: newContact.phone,
            status: "Lead",
            lastCall: "Just now"
        };
        const updated = [contact, ...contacts];
        setContacts(updated);
        localStorage.setItem("apex_contacts", JSON.stringify(updated));
        setIsAddModalOpen(false);
        setNewContact({ name: "", email: "", phone: "" });
    };

    const filtered = contacts.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">Contacts (CRM)</h2>
                    <p className="text-zinc-400">All your AI-captured leads and customers in one place.</p>
                </div>
                <Button onClick={() => setIsAddModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="mr-2 h-4 w-4" /> Add Contact
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <Input
                        placeholder="Search leads by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-zinc-900 border-zinc-800 text-white pl-10 h-10"
                    />
                </div>
                <Button variant="outline" className="border-zinc-800 text-zinc-400 hover:text-white">
                    <Filter className="mr-2 h-4 w-4" /> Filter
                </Button>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
                <table className="w-full text-left">
                    <thead className="bg-zinc-800/50 border-b border-zinc-800 text-zinc-400 text-sm">
                        <tr>
                            <th className="px-6 py-4 font-bold">Name</th>
                            <th className="px-6 py-4 font-bold">Contact Info</th>
                            <th className="px-6 py-4 font-bold">Status</th>
                            <th className="px-6 py-4 font-bold">Last Activity</th>
                            <th className="px-6 py-4 font-bold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800 text-zinc-300">
                        {filtered.map((contact) => (
                            <tr key={contact.id} className="hover:bg-zinc-800/20 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-500 font-bold border border-violet-500/20">
                                            {contact.name.charAt(0)}
                                        </div>
                                        <span className="font-bold text-white">{contact.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="space-y-1">
                                        <div className="text-xs flex items-center gap-1.5"><Mail size={12} className="text-zinc-500" /> {contact.email}</div>
                                        <div className="text-xs flex items-center gap-1.5"><Phone size={12} className="text-zinc-500" /> {contact.phone}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-500/10 text-blue-500 border border-blue-500/20">
                                        {contact.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-zinc-500">{contact.lastCall}</td>
                                <td className="px-6 py-4 text-right">
                                    <button className="p-2 text-zinc-500 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filtered.length === 0 && (
                    <div className="py-20 text-center text-zinc-500">
                        No contacts found mapping your search.
                    </div>
                )}
            </div>

            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-8 relative shadow-2xl overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
                        <button
                            onClick={() => setIsAddModalOpen(false)}
                            className="absolute top-4 right-4 text-zinc-400 hover:text-white"
                        >
                            <X size={20} />
                        </button>
                        <h3 className="text-2xl font-bold text-white mb-2">Add New Lead</h3>
                        <p className="text-zinc-400 mb-8 text-sm">Manually add a contact to your CRM.</p>

                        <form onSubmit={handleAdd} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="c-name" className="text-zinc-300">Full Name</Label>
                                <Input
                                    id="c-name"
                                    placeholder="John Doe"
                                    value={newContact.name}
                                    onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                                    className="bg-zinc-800 border-zinc-700 text-white"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="c-email" className="text-zinc-300">Email Address</Label>
                                <Input
                                    id="c-email"
                                    type="email"
                                    placeholder="john@example.com"
                                    value={newContact.email}
                                    onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                                    className="bg-zinc-800 border-zinc-700 text-white"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="c-phone" className="text-zinc-300">Phone Number</Label>
                                <Input
                                    id="c-phone"
                                    placeholder="+1 (555) 000-0000"
                                    value={newContact.phone}
                                    onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                                    className="bg-zinc-800 border-zinc-700 text-white"
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 mt-4 h-12 text-lg font-bold shadow-lg shadow-blue-900/40">
                                Save Contact 💾
                            </Button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

function X({ size }: { size: number }) {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>;
}
