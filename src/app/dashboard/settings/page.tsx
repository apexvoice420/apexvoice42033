"use client";

import React, { useState, useEffect } from 'react';
import SettingsView from '@/components/NewCrm/SettingsView';

export default function SettingsPage() {
    const [config, setConfig] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('apex_config');
            return saved ? JSON.parse(saved) : {
                vapiAssistantId: '',
                vapiApiKey: '',
                railwayEndpoint: '',
                railwayApiKey: ''
            };
        }
        return {
            vapiAssistantId: '',
            vapiApiKey: '',
            railwayEndpoint: '',
            railwayApiKey: ''
        };
    });

    useEffect(() => {
        localStorage.setItem('apex_config', JSON.stringify(config));
    }, [config]);

    return (
        <div className="animate-in slide-in-from-right-8 duration-500">
            <SettingsView config={config} onSave={setConfig} />
        </div>
    );
}
