import React from "react";
import Link from "next/link";
import { ArrowLeft, Shield, Lock, Cpu, EyeOff } from "lucide-react";
import { routes } from "@/config/routes";

export const metadata = {
  title: "Privacy Policy",
  description: "Understand our privacy practices. Naukari Tools operates local-first inside your browser with zero server file uploads.",
};

export default function PrivacyPolicyPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Privacy Policy - Naukari Tools",
    "url": "https://naukaritools.in/privacy-policy",
    "description": "Privacy guidelines for candidates using Naukari Tools. Learn how we store zero data on servers and run all calculations locally inside your browser."
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
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Privacy Policy</h1>
        <p className="text-sm text-slate-500 dark:text-zinc-400 mt-2">
          Effective date: June 15, 2026. Naukari Tools values candidate privacy and security.
        </p>
      </div>

      {/* Content */}
      <div className="space-y-6 text-slate-650 dark:text-zinc-400 text-sm leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
            <Cpu className="h-4.5 w-4.5 text-indigo-500 dark:text-indigo-400" />
            <span>1. Local-Only Calculations</span>
          </h2>
          <p>
            All computations, including Date of Birth offsets, category-wise age relaxations, 7th Pay Matrix allowances, and photo/document resizing occur strictly inside your device&apos;s browser sandbox. Your images and documents are processed locally via canvas arrays and Web Workers. We have no backend databases that hold uploaded candidate certificates.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
            <Lock className="h-4.5 w-4.5 text-indigo-500 dark:text-indigo-400" />
            <span>2. Zero Server Uploads</span>
          </h2>
          <p>
            When you select certificate crop, rotation, or name/date stamps, files are never transmitted across network servers. Processing remains offline. Once calculations are complete, you download output files directly from local memory blobs.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
            <EyeOff className="h-4.5 w-4.5 text-indigo-500 dark:text-indigo-400" />
            <span>3. Cookie-Free Platform</span>
          </h2>
          <p>
            We utilize cookie-free, privacy-first analytics to evaluate general utility load speeds and path navigations. We do not track candidate IP addresses, user profiles, or drop persistent tracking files onto local browsers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
            <Shield className="h-4.5 w-4.5 text-indigo-500 dark:text-indigo-400" />
            <span>4. Advertising & External Links</span>
          </h2>
          <p>
            Google AdSense units may run on this portal to support infrastructure overhead costs. These units serve static text links, which utilize sandboxed iframe attributes to prevent cross-site identity scrapings.
          </p>
        </section>
      </div>
    </div>
  );
}
