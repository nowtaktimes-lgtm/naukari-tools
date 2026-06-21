"use client";

import React from "react";
import { Shield, Cpu, CloudOff } from "lucide-react";

interface TrustBadgesProps {
  layout?: "horizontal" | "vertical";
}

export default function TrustBadges({ layout = "horizontal" }: TrustBadgesProps) {
  const isVertical = layout === "vertical";

  return (
    <div className="w-full max-w-4xl mx-auto px-4 animate-fade-in-up animation-delay-200">
      <div 
        className={`glass-card rounded-2xl px-6 py-5 border border-black/5 dark:border-white/10 backdrop-blur-md bg-slate-100/40 dark:bg-white/[0.01] ${
          isVertical 
            ? "flex flex-col gap-5" 
            : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        }`}
      >
        {/* Badge 1: 100% Privacy Certified */}
        <div className="flex items-center space-x-3.5 group cursor-default min-w-0 hover:scale-[1.02] transition-transform duration-200">
          <div className="h-9 w-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 transition-colors duration-200 group-hover:bg-indigo-500/20">
            <Shield className="h-4.5 w-4.5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-slate-850 dark:text-white tracking-wide break-words">100% Privacy Certified</div>
            <div className="text-[10px] text-slate-500 dark:text-zinc-500 font-mono break-words">Gazette Security Match</div>
          </div>
        </div>

        {/* Badge 2: Processed Locally on Your Device */}
        <div className="flex items-center space-x-3.5 group cursor-default min-w-0 hover:scale-[1.02] transition-transform duration-200">
          <div className="h-9 w-9 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0 transition-colors duration-200 group-hover:bg-purple-500/20">
            <Cpu className="h-4.5 w-4.5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-slate-850 dark:text-white tracking-wide break-words">Processed Locally</div>
            <div className="text-[10px] text-slate-500 dark:text-zinc-500 font-mono break-words">On Your Device</div>
          </div>
        </div>

        {/* Badge 3: Zero Server Uploads & Cookies */}
        <div className="flex items-center space-x-3.5 group cursor-default min-w-0 hover:scale-[1.02] transition-transform duration-200">
          <div className="h-9 w-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 transition-colors duration-200 group-hover:bg-emerald-500/20">
            <CloudOff className="h-4.5 w-4.5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-slate-850 dark:text-white tracking-wide break-words">Zero Server Uploads</div>
            <div className="text-[10px] text-slate-500 dark:text-zinc-500 font-mono break-words">&amp; Cookies Tracked</div>
          </div>
        </div>
      </div>
    </div>
  );
}
