import React from "react";
import Link from "next/link";
import { ArrowLeft, Scale, ShieldAlert, Cpu } from "lucide-react";
import { routes } from "@/config/routes";
import RatingWidget from "@/components/RatingWidget";
import FAQSection from "@/components/FAQSection";

export const metadata = {
  title: "Terms of Service",
  description: "Read our terms of service. Understand user permissions, sandbox calculations, and liability limitations when using Naukari Tools.",
};

export default function TermsPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Terms of Service - Naukari Tools",
    "url": "https://naukaritools.in/terms",
    "description": "Terms of use and service agreement details for accessing tools on Naukari Tools."
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-8 px-4">
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
      <div className="border-b border-black/5 dark:border-white/5 pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Terms of Service</h1>
        <p className="text-sm text-slate-500 dark:text-zinc-400 mt-2">
          Effective date: June 15, 2026. Terms of use for Naukari Tools.
        </p>
      </div>

      {/* Content */}
      <div className="space-y-6 text-slate-650 dark:text-zinc-400 text-sm leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
            <Scale className="h-4.5 w-4.5 text-indigo-500 dark:text-indigo-400" />
            <span>1. Acceptance of Terms</span>
          </h2>
          <p>
            By accessing and using Naukari Tools, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use our utilities. All features and calculations are provided free of cost to aspirants.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
            <Cpu className="h-4.5 w-4.5 text-indigo-500 dark:text-indigo-400" />
            <span>2. Permitted Use & Sandbox Limitations</span>
          </h2>
          <p>
            You may use our photo resizers, document compressors, eligibility checkers, and salary calculators for personal, educational, and job application preparation. All modifications occur in the browser environment locally. You agree not to attempt to scrap, exploit, or flood our dynamic programmatic routing endpoints.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
            <ShieldAlert className="h-4.5 w-4.5 text-indigo-500 dark:text-indigo-400" />
            <span>3. No Warranties & Liability Limitation</span>
          </h2>
          <p>
            Naukari Tools makes no representations or warranties of any kind, express or implied, regarding the accuracy, completeness, or reliability of calculations. The utilities are provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. We are not liable for recruitment form rejections due to specification discrepancies.
          </p>
        </section>
      </div>
      <FAQSection path="/terms" />
      <RatingWidget name="Terms of Service - Naukari Tools" pageType="WebPage" description="Read our terms of service. Understand user permissions, sandbox calculations, and liability limitations when using Naukari Tools." />
    </div>
  );
}
