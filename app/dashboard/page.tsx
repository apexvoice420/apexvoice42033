import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { ArrowRight, CheckCircle, Github, Smartphone, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "../../components/ui/button";

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Launchpad</h1>
                <p className="text-slate-400 mt-2">Get started with Apex Voice Solutions.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="bg-slate-950 border-slate-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                            <Smartphone className="h-5 w-5 text-blue-500" />
                            Connect App
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                            Download our mobile app to manage leads on the go.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="outline" className="w-full border-slate-700 text-slate-300 hover:bg-slate-900">
                            Send Link
                        </Button>
                    </CardContent>
                </Card>

                <Card className="bg-slate-950 border-slate-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                            <Github className="h-5 w-5 text-green-500" />
                            Connect Stripe
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                            Start accepting payments immediately.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">
                            Connect
                        </Button>
                    </CardContent>
                </Card>

                <Card className="bg-slate-950 border-slate-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                            <Zap className="h-5 w-5 text-yellow-500" />
                            Quick Actions
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                            Common tasks to get you moving.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Link href="/dashboard/crm/importer">
                            <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-900">
                                <ArrowRight className="mr-2 h-4 w-4" /> Import Leads
                            </Button>
                        </Link>
                        <Link href="/dashboard/campaigns">
                            <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-900">
                                <ArrowRight className="mr-2 h-4 w-4" /> Create Campaign
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="bg-slate-950 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-white">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex items-center justify-between border-b border-slate-800 pb-4 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-3">
                                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                        <div>
                                            <p className="text-sm font-medium text-white">New Lead Generated</p>
                                            <p className="text-xs text-slate-500">2 minutes ago</p>
                                        </div>
                                    </div>
                                    <span className="text-xs text-slate-400">Auto-Scraper</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
