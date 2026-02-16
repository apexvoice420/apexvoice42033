"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const ADMIN_EMAIL = 'apexvoicesolutions@gmail.com';
const ADMIN_PASSWORD = 'password123';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Simple local auth
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            // Set cookie for middleware
            document.cookie = `apex_auth=${encodeURIComponent(JSON.stringify({
                email,
                loggedIn: true
            }))}; path=/; max-age=86400`;
            
            // Also set localStorage for client-side access
            localStorage.setItem('apex_auth', JSON.stringify({
                email,
                loggedIn: true,
                timestamp: Date.now()
            }));
            router.push('/dashboard');
        } else {
            setError('Invalid credentials');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white text-2xl mx-auto mb-4">A</div>
                    <h1 className="text-3xl font-bold text-white">Apex Voice CRM</h1>
                    <p className="text-slate-400 mt-2">Sign in to your dashboard</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-8">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </div>
                </form>

                <p className="text-center text-slate-500 text-sm mt-6">
                    Default: apexvoicesolutions@gmail.com / password123
                </p>
            </div>
        </div>
    );
}
