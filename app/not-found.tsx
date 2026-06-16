import React from "react";
import Link from "next/link";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { routes } from "@/config/routes";

export const metadata = {
  title: "404 - Page Not Found | Naukari Tools",
  description: "The requested utility could not be found. Return to Naukari Tools Government Utility Hub.",
};

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto py-16 px-4 text-center space-y-6">
      <div className="h-16 w-16 mx-auto rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.05)]">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-white glow-text">404 - Not Found</h1>
        <p className="text-sm text-zinc-400 leading-relaxed">
          The recruitment utility path or database record you are looking for does not exist or has been scheduled for a future release.
        </p>
      </div>
      <div className="pt-4">
        <Link
          href={routes.home}
          className="inline-flex items-center justify-center space-x-2 rounded-xl bg-zinc-900 border border-white/10 hover:border-white/20 px-4 py-2.5 text-xs font-semibold text-white transition-all hover:bg-zinc-800"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Return to Utility Hub</span>
        </Link>
      </div>
    </div>
  );
}
