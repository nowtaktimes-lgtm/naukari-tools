import React from "react";
import Link from "next/link";
import { ArrowLeft, Shield, Cpu, Lock, CheckCircle2 } from "lucide-react";
import { routes } from "@/config/routes";

export const metadata = {
  title: "About",
  description: "Learn about Naukari Tools - the high-trust, minimalist, local-first utility workspace for civil service candidates.",
};

export default function AboutPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About Naukari Tools",
    "url": "https://naukaritools.in/about",
    "description": "Learn about Naukari Tools - the high-trust, minimalist, local-first utility workspace for civil service candidates."
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-8 px-4">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {/* Back button */}
      <Link 
        href={routes.home} 
        className="inline-flex items-center space-x-2 text-xs text-slate-500 hover:text-slate-900 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors group"
      >
        <ArrowLeft className="h-3.5 w-3.5 transform group-hover:-translate-x-0.5 transition-transform" />
        <span>Back to Utility Hub</span>
      </Link>

      {/* Header */}
      <div className="border-b border-black/5 dark:border-white/5 pb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white glow-text">About Naukari Tools</h1>
        <p className="text-sm text-slate-600 dark:text-zinc-400 mt-3 max-w-2xl leading-relaxed">
          Naukari Tools is an elite, high-trust candidate utility hub designed to make government job registration workflows frictionless, transparent, and completely secure.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card rounded-3xl p-6 border border-black/5 dark:border-white/10 space-y-4">
          <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 text-indigo-650 dark:text-indigo-400">
            <Cpu className="h-5 w-5" />
          </div>
          <h3 className="font-semibold text-lg text-slate-900 dark:text-white">Local-First Processing</h3>
          <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
            All heavy computations—including certificate image compression, signature resizing, and exact age criteria offsets—are processed strictly inside your device&apos;s browser sandbox. We run zero backend databases for document storage.
          </p>
        </div>

        <div className="glass-card rounded-3xl p-6 border border-black/5 dark:border-white/10 space-y-4">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-650 dark:text-emerald-400">
            <Shield className="h-5 w-5" />
          </div>
          <h3 className="font-semibold text-lg text-slate-900 dark:text-white">Rule Verification Engine</h3>
          <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
            Every age relaxation algorithm and cutoff constraint in our database is double-checked against official recruitment notifications. We update the repository parameters continuously as notifications release.
          </p>
        </div>

        <div className="glass-card rounded-3xl p-6 border border-black/5 dark:border-white/10 space-y-4">
          <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 text-purple-650 dark:text-purple-400">
            <Lock className="h-5 w-5" />
          </div>
          <h3 className="font-semibold text-lg text-slate-900 dark:text-white">Zero Server Uploads & Cookies</h3>
          <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
            Your personal information, scanned certificates, and photo credentials never leave your browser window. Naukari Tools uses clean, cookie-free analytics only to monitor portal load speeds and prevent bandwidth bottlenecks.
          </p>
        </div>

        <div className="glass-card rounded-3xl p-6 border border-black/5 dark:border-white/10 space-y-4">
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 text-amber-650 dark:text-amber-400">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <h3 className="font-semibold text-lg text-slate-900 dark:text-white">Built for Civil Servants</h3>
          <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
            We aim to remove the chaos of government application portals. From cyber cafe operators to remote candidates, Naukari Tools delivers verified, print-ready sheets for quick calculations.
          </p>
        </div>
      </div>
    </div>
  );
}
