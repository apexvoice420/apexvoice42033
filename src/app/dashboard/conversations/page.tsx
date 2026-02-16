"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Phone, User, Clock, Search, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";

const initialConversations = [
    { id: "1", name: "John Petersen", lastMessage: "Yes, I'd like a quote for a roof repair.", time: "10:15 AM", type: "AI Voice Call", status: "Handled" },
    { id: "2", name: "Alice Brown", lastMessage: "Can you call me back next week?", time: "9:30 AM", type: "AI Voice Call", status: "Follow-up" },
    { id: "3", name: "Unknown Caller", lastMessage: "(No transcription available)", time: "Yesterday", type: "Missed Call", status: "Missed" },
];

export default function ConversationsPage() {
    const [selected, setSelected] = useState(initialConversations[0]);

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col md:flex-row bg-[#0B0F1A] border border-zinc-800 rounded-3xl overflow-hidden m-6">
            {/* Sidebar */}
            <div className="w-full md:w-80 border-r border-zinc-800 flex flex-col bg-zinc-900/50">
                <div className="p-6 border-b border-zinc-800 bg-zinc-900">
                    <h2 className="text-xl font-bold text-white mb-4">Conversations</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                        <Input className="bg-zinc-800 border-zinc-700 pl-10 h-10 text-white" placeholder="Search chats..." />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {initialConversations.map((chat) => (
                        <div
                            key={chat.id}
                            onClick={() => setSelected(chat)}
                            className={`p-5 flex items-start gap-4 cursor-pointer hover:bg-zinc-800/50 transition-colors border-b border-zinc-800/50 ${selected.id === chat.id ? "bg-violet-600/10 border-l-4 border-l-violet-600" : ""}`}
                        >
                            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold border border-zinc-700">
                                {chat.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-1">
                                    <h4 className="text-sm font-bold text-white truncate">{chat.name}</h4>
                                    <span className="text-[10px] text-zinc-500 font-bold">{chat.time}</span>
                                </div>
                                <p className="text-xs text-zinc-400 truncate">{chat.lastMessage}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat View */}
            <div className="flex-1 flex flex-col bg-zinc-950/20 backdrop-blur-3xl relative">
                <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/40">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center font-bold text-lg text-white">
                            {selected.name.charAt(0)}
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">{selected.name}</h3>
                            <div className="flex items-center gap-2 text-xs text-zinc-500 font-bold uppercase tracking-wider">
                                <span>{selected.type}</span>
                                <span>•</span>
                                <span className="text-green-500">{selected.status}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="border-zinc-800 text-zinc-400">
                            <Phone size={16} className="mr-2" /> Call Back
                        </Button>
                        <Button variant="outline" className="border-zinc-800 text-zinc-400">
                            <User size={16} />
                        </Button>
                    </div>
                </div>

                <div className="flex-1 p-8 overflow-y-auto flex flex-col gap-6">
                    <div className="flex flex-col items-center py-10">
                        <div className="bg-zinc-800/50 rounded-full px-4 py-1.5 flex items-center gap-2 border border-zinc-700 mb-8">
                            <Clock size={12} className="text-zinc-500" />
                            <span className="text-[10px] font-bold text-zinc-500 uppercase">Transcript Analyzed by Apex AI</span>
                        </div>

                        <div className="w-full max-w-2xl space-y-8">
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center self-start text-xs border border-zinc-700 text-zinc-400 font-bold shrink-0">P</div>
                                <div className="bg-zinc-800/40 border border-zinc-800/50 p-4 rounded-2xl rounded-tl-none text-zinc-300 text-sm leading-relaxed max-w-[80%]">
                                    Hello? I'm looking for someone to fix a leak in my roof. It happened during the storm last night.
                                </div>
                            </div>

                            <div className="flex gap-4 flex-row-reverse">
                                <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center self-start text-[10px] text-white font-bold shrink-0">AI</div>
                                <div className="bg-violet-600 p-4 rounded-2xl rounded-tr-none text-white text-sm leading-relaxed max-w-[80%] shadow-lg shadow-violet-900/20">
                                    I understand. That sounds like an urgent repair. I can certainly help you get someone out there. Could you tell me your address and if there's any active dripping inside right now?
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center self-start text-xs border border-zinc-700 text-zinc-400 font-bold shrink-0">P</div>
                                <div className="bg-zinc-800/40 border border-zinc-800/50 p-4 rounded-2xl rounded-tl-none text-zinc-300 text-sm leading-relaxed max-w-[80%]">
                                    Yes, it's dripping in the living room. My address is 123 Maple St.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-zinc-800 bg-zinc-900/20">
                    <div className="flex items-center gap-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-2 px-4 shadow-inner">
                        <Input className="border-none bg-transparent focus-visible:ring-0 text-white" placeholder="Type a message to the human receptionist..." />
                        <Button className="bg-violet-600 hover:bg-violet-700 rounded-xl px-6">Send</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
