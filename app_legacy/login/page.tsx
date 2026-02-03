"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Label } from "../../components/ui/label";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // MOCK LOGIN for Migration Phase
        // In production, integrate Clerk or NextAuth here.
        if (email && password) {
            console.log("Mock login successful");
            // Simulate session token if needed, or just redirect
            router.push("/dashboard");
        } else {
            setError("Please enter valid credentials.");
        }
    };

    return (
        <div className="flex h-screen w-full items-center justify-center bg-slate-900 px-4">
            <Card className="w-full max-w-sm border-slate-800 bg-slate-950 text-slate-100">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center text-white">
                        Access CRM <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-full border border-emerald-500/20">v2.0</span>
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                        (Mock Mode) Enter any email/password to continue.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                    <CardContent className="grid gap-4">
                        {error && <div className="text-red-500 text-sm">{error}</div>}
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-slate-200">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@apex.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-slate-900 border-slate-700 text-white"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password" className="text-slate-200">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-slate-900 border-slate-700 text-white"
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700" type="submit">Sign in</Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
