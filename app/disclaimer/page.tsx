import React from "react";
import Link from "next/link";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { routes } from "@/config/routes";

export default function DisclaimerPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Disclaimer - Naukari Tools",
    "url": "https://naukaritools.in/disclaimer",
    "description": "Important legal disclaimers for Naukari Tools educational utility platform. We are not affiliated with or connected to any Indian Government Organization."
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-8 px-4">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {/* Back Button */}
      <Link 
        href={routes.home} 
        className="inline-flex items-center space-x-2 text-xs text-slate-500 hover:text-slate-900 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors group"
      >
        <ArrowLeft className="h-3.5 w-3.5 transform group-hover:-translate-x-0.5 transition-transform" />
        <span>Back to Utility Hub</span>
      </Link>

      {/* Header */}
      <div className="border-b border-black/5 dark:border-white/5 pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Disclaimer</h1>
        <p className="text-sm text-slate-500 dark:text-zinc-400 mt-2">
          Last updated: June 15, 2026. Please read this disclaimer carefully.
        </p>
      </div>

      {/* Content */}
      <div className="space-y-6 text-slate-650 dark:text-zinc-400 text-sm leading-relaxed">
        {/* Critical Notice Callout */}
        <div className="bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 dark:border-amber-500/30 rounded-2xl p-5 flex items-start space-x-4 shadow-sm">
          <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-extrabold text-slate-900 dark:text-amber-300 text-sm tracking-wide">
              Naukari Tools is an independent educational utility platform and is NOT affiliated with, endorsed by, or connected to any Indian Government Organization or Recruitment Board. All data is for informational purposes.
            </p>
          </div>
        </div>

        <section className="space-y-3">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            1. Accuracy of Information
          </h2>
          <p>
            While we make every effort to keep recruitment rules, age criteria, and file specifications updated based on official recruitment notifications and gazettes, the calculations provided by Naukari Tools are automated and intended for reference only. Candidates are strongly advised to cross-verify all limits, cutoffs, and dimension restrictions against official notification brochures before completing their applications.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            2. Local Processing & File Outputs
          </h2>
          <p>
            Naukari Tools provides local image resizing and document compression templates. All resizing actions occur entirely on the client side. We do not guarantee acceptance of generated files by official application portals (like SSC, UPSC, or state recruitment portals). It remains the candidate&apos;s responsibility to inspect output dimensions and properties.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            3. No Legal Liability
          </h2>
          <p>
            Under no circumstances shall Naukari Tools, its developers, or affiliates be liable for any errors, missed deadlines, rejection of application forms, or financial losses resulting from the use of calculations or tools offered on this site.
          </p>
        </section>
      </div>
    </div>
  );
}
