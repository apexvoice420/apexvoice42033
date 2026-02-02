import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, ShieldCheck, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Navbar */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white">
            A
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Apex Voice
          </span>
        </div>
        <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
          <Link href="#features" className="hover:text-white transition-colors">Features</Link>
          <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
          <Link href="#about" className="hover:text-white transition-colors">About</Link>
        </nav>
        <div className="flex gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800">
              Log in
            </Button>
          </Link>
          <Link href="/login">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10 pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-400 backdrop-blur-xl">
            <span className="flex h-2 w-2 rounded-full bg-blue-400 mr-2 animate-pulse"></span>
            Now powering over 1M calls
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-br from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            The AI CRM that <br /> <span className="text-blue-500">Actually Speaks</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
            Automate your lead qualification with hyper-realistic Voice AI agents.
            Import leads, launch campaigns, and watch your calendar fill up automatically.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link href="/login">
              <Button size="lg" className="h-12 px-8 text-lg bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-900/20">
                Calculate My ROI
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="h-12 px-8 text-lg border-slate-700 bg-slate-900/50 hover:bg-slate-800 text-slate-300">
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-20 bg-slate-900/50 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-12">
          <div className="space-y-4 p-6 rounded-2xl bg-slate-950 border border-slate-800/50 hover:border-blue-500/30 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Instant Response</h3>
            <p className="text-slate-400 leading-relaxed">
              Engage leads within seconds of submission. Speed to lead is the #1 factor in conversion, and our AI never sleeps.
            </p>
          </div>
          <div className="space-y-4 p-6 rounded-2xl bg-slate-950 border border-slate-800/50 hover:border-purple-500/30 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Perfect Qualification</h3>
            <p className="text-slate-400 leading-relaxed">
              Train your agent to ask the right questions. Only qualified meetings hit your calendar, saving your sales team hours.
            </p>
          </div>
          <div className="space-y-4 p-6 rounded-2xl bg-slate-950 border border-slate-800/50 hover:border-emerald-500/30 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Full Compliance</h3>
            <p className="text-slate-400 leading-relaxed">
              Built-in DNC management, recording conscent handling, and TCPA compliance guardrails to keep your brand safe.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-800 text-center text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Apex Voice Solutions. All rights reserved.</p>
      </footer>
    </div>
  );
}
