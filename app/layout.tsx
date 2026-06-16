import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Shield, Sparkles, Activity } from "lucide-react";
import Analytics from "@/components/Analytics";
import AutoSchema from "@/components/AutoSchema";
import { routes } from "@/config/routes";
import ThemeProvider from "@/components/ThemeProvider";
import ThemeSwitcher from "@/components/ThemeSwitcher";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Naukari Tools | Government Job Utility Hub",
  description: "Elite, high-trust utility software suite for government job aspirants. Compute precise age relaxation, check exam eligibility, and track your prep path in a premium Bento workspace.",
  metadataBase: new URL("https://naukaritools.in"),
  openGraph: {
    title: "Naukari Tools | Government Job Utility Hub",
    description: "Elite, high-trust utility software suite for government job aspirants. Precise age calculator, salary estimator, and exam trackers.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`} suppressHydrationWarning>
      <body className="bg-slate-50 text-slate-900 dark:bg-[#0A0A0A] dark:text-[#F5F5F5] min-h-screen antialiased flex flex-col justify-between selection:bg-indigo-500/30 selection:text-white transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {/* Global Organization Schema */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "Naukari Tools",
                "url": "https://naukaritools.in",
                "logo": "https://naukaritools.in/logo.png",
                "contactPoint": {
                  "@type": "ContactPoint",
                  "contactType": "customer service",
                  "email": "contact@naukaritools.in"
                }
              }),
            }}
          />

          {/* Glow Background Mesh */}
          <div className="ambient-mesh" />

          {/* Premium Header */}
          <header className="w-full px-4 sm:px-6 lg:px-8 pt-6">
            <div className="max-w-7xl mx-auto rounded-2xl bg-white/60 border border-black/5 dark:bg-[#0d0d0d]/40 dark:border-white/10 backdrop-blur-md px-6 py-4 flex items-center justify-between">
              {/* Logo */}
              <Link href={routes.home} className="flex items-center space-x-2.5 group">
                <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)] group-hover:scale-105 transition-transform duration-300">
                  <Shield className="h-4.5 w-4.5" />
                  <div className="absolute inset-0 rounded-lg bg-indigo-500 blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
                </div>
                <span className="font-semibold text-lg tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600 dark:from-white dark:via-zinc-200 dark:to-zinc-400 bg-clip-text text-transparent">
                  Naukari<span className="text-indigo-600 dark:text-indigo-400">Tools</span>
                </span>
              </Link>

              {/* Navigation links */}
              <nav className="hidden md:flex items-center space-x-8">
                <Link href={routes.home} className="text-sm text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition-colors duration-200 font-medium">
                  Home
                </Link>
                <Link href={`${routes.home}#tools`} className="text-sm text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition-colors duration-200 font-medium">
                  Tools
                </Link>
                <Link href={routes.exams} className="text-sm text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition-colors duration-200 font-medium">
                  All Exams
                </Link>
                <Link href={routes.tools.find((t) => t.slug === "age-calculator")?.path || "/tools/age-calculator"} className="text-sm text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition-colors duration-200 font-medium">
                  Age Calculator
                </Link>
                <Link href={routes.about} className="text-sm text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition-colors duration-200 font-medium">
                  About
                </Link>
              </nav>

              {/* System Status Pill & CTA */}
              <div className="flex items-center space-x-3 sm:space-x-4">
                <ThemeSwitcher />

                <div className="hidden sm:flex items-center space-x-2 rounded-full border border-slate-200 bg-slate-100/50 text-slate-600 dark:border-emerald-500/20 dark:bg-emerald-500/5 dark:text-emerald-400 px-3 py-1 text-xs">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="font-medium">System Active</span>
                </div>

                {/* Action Button */}
                <Link
                  href={`${routes.home}#tools`}
                  className="inline-flex items-center space-x-1.5 rounded-lg bg-white border border-black/5 dark:bg-zinc-900 dark:border-white/10 dark:hover:border-white/20 px-3.5 py-1.5 text-sm font-medium text-slate-800 dark:text-white transition-all hover:bg-slate-100 dark:hover:bg-zinc-800 duration-200"
                >
                  <span>Launch Hub</span>
                  <Sparkles className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" />
                </Link>
              </div>
            </div>
          </header>

          {/* Main Workspace Canvas */}
          <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>

          {/* Premium Footer */}
          <footer className="w-full border-t border-black/5 dark:border-white/5 bg-slate-100/50 dark:bg-[#080808] py-12 px-4 sm:px-6 lg:px-8 mt-12">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8">
              <div className="space-y-4 md:col-span-1">
                <div className="flex items-center space-x-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-600 text-white">
                    <Shield className="h-3.5 w-3.5" />
                  </div>
                  <span className="font-semibold text-md bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
                    Naukari Tools
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-zinc-500 leading-relaxed max-w-xs">
                  A high-trust, minimalist utility software suite. Engineered to simplify complex government recruitment rules for aspirants.
                </p>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-800 dark:text-zinc-300 uppercase tracking-wider mb-4">Calculators</h4>
                <ul className="space-y-2.5">
                  <li>
                    <Link href={routes.tools.find((t) => t.slug === "age-calculator")?.path || "/tools/age-calculator"} className="text-xs text-slate-500 hover:text-slate-900 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors">
                      Sarkari Age Calculator
                    </Link>
                  </li>
                  <li>
                    <Link href={routes.tools.find((t) => t.slug === "salary-calculator")?.path || "/tools/salary-calculator"} className="text-xs text-slate-500 hover:text-slate-900 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors">
                      7th Pay Commission Salary
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-800 dark:text-zinc-300 uppercase tracking-wider mb-4">Evaluators</h4>
                <ul className="space-y-2.5">
                  <li>
                    <Link href={routes.tools.find((t) => t.slug === "eligibility-checker")?.path || "/tools/eligibility-checker"} className="text-xs text-slate-500 hover:text-slate-900 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors">
                      Eligibility Checker
                    </Link>
                  </li>
                  <li>
                    <Link href={routes.tools.find((t) => t.slug === "syllabus-tracker")?.path || "/tools/syllabus-tracker"} className="text-xs text-slate-500 hover:text-slate-900 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors">
                      Syllabus Progress Tracker
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-800 dark:text-zinc-300 uppercase tracking-wider mb-4">Legal</h4>
                <ul className="space-y-2.5">
                  <li>
                    <Link href={routes.disclaimer} className="text-xs text-slate-500 hover:text-slate-900 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors">
                      Disclaimer
                    </Link>
                  </li>
                  <li>
                    <Link href={routes.privacyPolicy} className="text-xs text-slate-500 hover:text-slate-900 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href={routes.terms} className="text-xs text-slate-500 hover:text-slate-900 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link href={routes.contact} className="text-xs text-slate-500 hover:text-slate-900 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors">
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-800 dark:text-zinc-300 uppercase tracking-wider mb-4">Platform</h4>
                <p className="text-xs text-slate-500 dark:text-zinc-500 leading-relaxed mb-3">
                  Ad-free, tracker-free, and high-trust. All calculation rules are double-checked against official recruitment gazettes.
                </p>
                <div className="flex items-center space-x-2 text-xs text-indigo-600/80 dark:text-indigo-400/80">
                  <Activity className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
                  <span>Double-checked eligibility logic</span>
                </div>
              </div>
            </div>

            <div className="max-w-7xl mx-auto border-t border-black/5 dark:border-white/5 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 dark:text-zinc-600">
              <p>© {new Date().getFullYear()} Naukari Tools. Built for future civil servants.</p>
              <div className="flex space-x-6 mt-4 sm:mt-0">
                <Link href={routes.about} className="hover:text-slate-900 dark:hover:text-zinc-400 transition-colors">About</Link>
                <Link href={routes.disclaimer} className="hover:text-slate-900 dark:hover:text-zinc-400 transition-colors">Disclaimer</Link>
                <Link href={routes.privacyPolicy} className="hover:text-slate-900 dark:hover:text-zinc-400 transition-colors">Privacy Policy</Link>
                <Link href={routes.terms} className="hover:text-slate-900 dark:hover:text-zinc-400 transition-colors">Terms of Service</Link>
              </div>
            </div>
          </footer>
          <Analytics />
          <AutoSchema />
        </ThemeProvider>
      </body>
    </html>
  );
}
