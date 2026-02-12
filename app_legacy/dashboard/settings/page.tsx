"use client";

import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";

export default function SettingsPage() {
    return (
        <div className="space-y-6 max-w-2xl">
            <h1 className="text-3xl font-bold text-white">Settings</h1>

            <Card className="bg-slate-950 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-white">API Keys</CardTitle>
                    <CardDescription className="text-slate-400">Manage your connections to third-party services.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="vapi" className="text-white">VAPI Private Key</Label>
                        <Input id="vapi" type="password" value="************************" disabled className="bg-slate-900 border-slate-800" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="railway" className="text-white">Railway Database URL</Label>
                        <Input id="railway" type="password" value="postgres://************************" disabled className="bg-slate-900 border-slate-800" />
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-slate-950 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-white">Account</CardTitle>
                </CardHeader>
                <CardContent>
                    <Button variant="destructive">Log Out</Button>
                </CardContent>
            </Card>
        </div>
    );
}
