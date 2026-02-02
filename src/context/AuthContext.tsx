"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, error: null });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!auth) {
            setError("Firebase is not configured. Please check your environment variables.");
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (error) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-950 text-white">
                <div className="max-w-md p-6 bg-slate-900 rounded-lg border border-red-900/50">
                    <div className="flex items-center gap-3 text-red-500 mb-2">
                        <AlertCircle className="h-6 w-6" />
                        <h2 className="text-xl font-bold">Configuration Error</h2>
                    </div>
                    <p className="text-slate-300">{error}</p>
                    <p className="mt-4 text-sm text-slate-500">
                        Check <code>.env.local</code> and ensure <code>NEXT_PUBLIC_FIREBASE_API_KEY</code> is set.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ user, loading, error }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

// Protected Route Component
export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, loading, error } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user && !error) {
            router.push("/login");
        }
    }, [user, loading, error, router]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-950 text-slate-400">
                <div className="flex flex-col items-center gap-2">
                    <div className="animate-spin h-8 w-8 border-4 border-slate-700 border-t-blue-500 rounded-full"></div>
                    Loading Apex Voice...
                </div>
            </div>
        );
    }

    if (error) return null; // Already handled in provider

    return user ? <>{children}</> : null;
};
