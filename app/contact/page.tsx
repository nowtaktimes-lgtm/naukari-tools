"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, MessageSquare, Send, CheckCircle, MapPin } from "lucide-react";
import { routes } from "@/config/routes";

export default function ContactPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) return;
    
    // Simulate contact form submission
    console.log("Feedback submitted:", { email, message });
    setSubmitted(true);
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact Naukari Tools",
    "url": "https://naukaritools.in/contact",
    "description": "Get in touch with Naukari Tools support team. Submit discrepancies, feedback, or target exam requests.",
    "mainEntity": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "contact@naukaritools.in",
      "areaServed": "IN"
    }
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
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Contact & Feedback</h1>
        <p className="text-sm text-slate-500 dark:text-zinc-400 mt-2">
          Discovered discrepancies or want to suggest new exams? We respond within 24 hours.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Contact details */}
        <div className="glass-card rounded-2xl p-5 border border-black/5 dark:border-white/10 space-y-5 md:col-span-1">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-3">Direct Channels</h3>
            <div className="space-y-3 text-slate-650 dark:text-zinc-400 text-xs">
              <div className="flex items-center space-x-2.5">
                <Mail className="h-4 w-4 text-indigo-500 dark:text-indigo-400 flex-shrink-0" />
                <a href="mailto:contact@naukaritools.in" className="hover:text-slate-900 dark:hover:text-white transition-colors">contact@naukaritools.in</a>
              </div>
              <div className="flex items-center space-x-2.5">
                <MessageSquare className="h-4 w-4 text-indigo-500 dark:text-indigo-400 flex-shrink-0" />
                <span>Response Time: &lt;24 hours</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-black/5 dark:border-white/5">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-3">Office Address</h3>
            <div className="flex items-start space-x-2.5 text-slate-650 dark:text-zinc-400 text-xs leading-relaxed">
              <MapPin className="h-4 w-4 text-indigo-500 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
              <span>
                Naukari Tools Tech Lab,<br />
                NH-11, Karni Industrial Area,<br />
                Bikaner, Rajasthan, 334001
              </span>
            </div>
          </div>
        </div>

        {/* Message form */}
        <div className="glass-card rounded-2xl p-6 border border-black/5 dark:border-white/10 md:col-span-2">
          {submitted ? (
            <div className="text-center py-8 space-y-3">
              <CheckCircle className="h-10 w-10 text-emerald-500 mx-auto animate-bounce" />
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">Message Sent Successfully!</h4>
              <p className="text-xs text-slate-500 dark:text-zinc-500">Thank you for helping us maintain accurate calculators for future officers.</p>
              <button 
                onClick={() => {
                  setSubmitted(false);
                  setEmail("");
                  setMessage("");
                }}
                className="text-xs text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300 underline font-semibold"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">Your Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-100/50 dark:bg-zinc-950/40 border border-black/5 dark:border-white/5 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-650 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">Discrepancy / Suggestion details</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="State the exam name, board, and correct relaxation guidelines or photo dimensions."
                  className="w-full bg-slate-100/50 dark:bg-zinc-950/40 border border-black/5 dark:border-white/5 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-650 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center space-x-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 text-xs font-semibold text-white transition-all shadow-[0_0_15px_rgba(99,102,241,0.2)]"
              >
                <span>Send Message</span>
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
