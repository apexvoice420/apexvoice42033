'use client';

import { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import Vapi from '@vapi-ai/web';
import { Loader2, Mic, PhoneOff } from 'lucide-react';

const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || '');

export interface VapiRef {
    start: () => void;
    stop: () => void;
    toggle: () => void;
}

const VapiManager = forwardRef<VapiRef, {}>((props, ref) => {
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useImperativeHandle(ref, () => ({
        start: startCall,
        stop: stopCall,
        toggle: () => {
            if (isSessionActive) {
                stopCall();
            } else {
                startCall();
            }
        }
    }));

    useEffect(() => {
        // Event listeners
        vapi.on('call-start', () => {
            console.log('Call started');
            setIsSessionActive(true);
            setIsLoading(false);
        });

        vapi.on('call-end', () => {
            console.log('Call ended');
            setIsSessionActive(false);
            setIsSpeaking(false);
            setIsLoading(false);
        });

        vapi.on('speech-start', () => {
            setIsSpeaking(true);
        });

        vapi.on('speech-end', () => {
            setIsSpeaking(false);
        });

        vapi.on('error', (e) => {
            console.error('Vapi error:', e);
            setIsLoading(false);
            setIsSessionActive(false);
        });

        return () => {
            // Cleanup listeners if needed, Vapi SDK handles some cleanup
            vapi.stop();
        };
    }, []);

    const startCall = async () => {
        const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
        if (!assistantId) {
            console.error('Missing NEXT_PUBLIC_VAPI_ASSISTANT_ID');
            alert('Please configure NEXT_PUBLIC_VAPI_ASSISTANT_ID');
            return;
        }

        setIsLoading(true);
        try {
            await vapi.start(assistantId);
        } catch (err) {
            console.error('Failed to start Vapi call', err);
            setIsLoading(false);
        }
    };

    const stopCall = () => {
        vapi.stop();
    };

    if (!isSessionActive && !isLoading) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            zIndex: 50,
            backgroundColor: '#18181b', // zinc-900
            border: '1px solid #3f3f46', // zinc-700
            borderRadius: '9999px',
            padding: '1rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
            color: '#fff'
        }}>
            {isLoading ? (
                <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Connecting...</span>
                </>
            ) : (
                <>
                    <div style={{
                        position: 'relative',
                        width: 12, height: 12,
                        borderRadius: '50%',
                        backgroundColor: isSpeaking ? '#4ade80' : '#ef4444', // green-400 : red-500
                        boxShadow: isSpeaking ? '0 0 10px #4ade80' : 'none',
                        transition: 'all 0.2s'
                    }} />
                    <span style={{ fontWeight: 500 }}>
                        {isSpeaking ? 'Agent Speaking' : 'Listening...'}
                    </span>
                    <button
                        onClick={stopCall}
                        style={{
                            marginLeft: '1rem',
                            background: 'rgba(255,255,255,0.1)',
                            border: 'none',
                            color: 'white',
                            padding: '0.5rem',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <PhoneOff size={16} />
                    </button>
                </>
            )}
        </div>
    );
});

VapiManager.displayName = 'VapiManager';
export default VapiManager;
