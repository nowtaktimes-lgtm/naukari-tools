"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Calendar,
  ShieldCheck,
  Coins,
  LayoutList,
  ArrowRight,
  Award,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  BookOpen
} from "lucide-react";
import { toolsList, routes } from "@/config/routes";
import TrustBadges from "@/components/TrustBadges";
import AdBanner from "@/components/AdBanner";
import examsData from "@/data/exams.json";
import { ExamSEODB } from "@/types/exam";

// Define local interfaces for calculations
type Category = "General" | "OBC" | "SC" | "ST" | "PwD";

export default function Home() {
  const router = useRouter();
  const exams: ExamSEODB[] = examsData as ExamSEODB[];
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const normalizedQuery = searchQuery.toLowerCase().trim();
    // Check if query matches any active exam slug or keywords
    const matchedExam = exams.find(
      (exam) =>
        exam.slug.includes(normalizedQuery) ||
        exam.examName.toLowerCase().includes(normalizedQuery) ||
        exam.examBoard.toLowerCase().includes(normalizedQuery)
    );

    if (matchedExam) {
      const today = new Date("2026-06-15T00:00:00+05:30");
      const releaseDate = new Date(matchedExam.releaseDate);
      if (today >= releaseDate) {
        router.push(`/tools/${matchedExam.slug}`);
        return;
      }
    }

    // If no match or locked, log missed search query and redirect to custom master age-calculator
    try {
      await fetch("/api/search-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      });
    } catch (err) {
      console.error("Failed to log missed search query:", err);
    }
    // Redirect to generic age calculator tool
    router.push("/tools/age-calculator");
  };

  // --- Age Calculator State ---
  const [dob, setDob] = useState("1998-07-01");
  const [cutoffDate, setCutoffDate] = useState("2026-08-01");
  const [category, setCategory] = useState<Category>("General");
  const [ageResult, setAgeResult] = useState<{
    years: number;
    months: number;
    days: number;
    isEligibleUPSC: boolean;
    isEligibleSSC: boolean;
  } | null>(null);

  // --- Salary Estimator State ---
  const [payLevel, setPayLevel] = useState<number>(7);
  const [cityClass, setCityClass] = useState<"X" | "Y" | "Z">("Y");
  const [salaryDetails, setSalaryDetails] = useState<{
    basicPay: number;
    da: number;
    hra: number;
    ta: number;
    gross: number;
    nps: number;
    net: number;
  }>({ basicPay: 44900, da: 22450, hra: 8082, ta: 5400, gross: 80832, nps: 6735, net: 74097 });

  // --- Eligibility Checker State ---
  const [education, setEducation] = useState("Graduate");
  const [percentage, setPercentage] = useState(60);
  const [compatibleExams, setCompatibleExams] = useState<string[]>([]);

  // --- Syllabus Tracker State ---
  const [checklist, setChecklist] = useState([
    { id: 1, text: "Quantitative Aptitude (Algebra & Geometry)", done: true },
    { id: 2, text: "General Studies (Indian Polity & Constitution)", done: false },
    { id: 3, text: "English Comprehension & Vocabulary", done: false },
    { id: 4, text: "Logical Reasoning & Data Interpretation", done: true },
  ]);

  // Handle Age Calculation
  const calculateAge = useCallback(() => {
    if (!dob || !cutoffDate) return;

    const birth = new Date(dob);
    const target = new Date(cutoffDate);

    if (birth > target) {
      setAgeResult(null);
      return;
    }

    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    // Exam Age Relaxations
    // UPSC CSE: Min 21, Max 32 (General), +3 (OBC = 35), +5 (SC/ST = 37), +10 (PwD = 42)
    // SSC CGL: Min 18, Max 30 (varies, general max 30 used for baseline), +3 (OBC = 33), +5 (SC/ST = 35), +10 (PwD = 40)
    let maxUPSC = 32;
    let maxSSC = 30;

    if (category === "OBC") {
      maxUPSC += 3;
      maxSSC += 3;
    } else if (category === "SC" || category === "ST") {
      maxUPSC += 5;
      maxSSC += 5;
    } else if (category === "PwD") {
      maxUPSC += 10;
      maxSSC += 10;
    }

    const isEligibleUPSC = years >= 21 && years <= maxUPSC;
    const isEligibleSSC = years >= 18 && years <= maxSSC;

    setAgeResult({
      years,
      months,
      days,
      isEligibleUPSC,
      isEligibleSSC,
    });
  }, [dob, cutoffDate, category]);

  // Run age calculation on state change
  useEffect(() => {
    calculateAge();
  }, [calculateAge]);

  // Handle Salary Calculation
  useEffect(() => {
    // 7th Pay matrix basic levels
    const basicPayMap: Record<number, number> = {
      1: 18000,
      2: 19900,
      3: 21700,
      4: 25500,
      5: 29200,
      6: 35400,
      7: 44900,
      8: 47600,
      9: 53100,
      10: 56100,
    };

    const basic = basicPayMap[payLevel] || 18000;
    const daRate = 0.50; // 50% Dearness Allowance
    const da = Math.round(basic * daRate);

    // HRA: X = 30%, Y = 20%, Z = 10% (when DA crosses 50%)
    const hraRate = cityClass === "X" ? 0.30 : cityClass === "Y" ? 0.20 : 0.10;
    const hra = Math.round(basic * hraRate);

    // Transport Allowance (simplified structure)
    // Level 9+: 7200 + DA(50%) = 10800, Level 3-8: 3600 + DA(50%) = 5400, Level 1-2: 1800 + DA(50%) = 2700
    let ta = 0;
    if (payLevel >= 9) {
      ta = Math.round(7200 * (1 + daRate));
    } else if (payLevel >= 3) {
      ta = Math.round(3600 * (1 + daRate));
    } else {
      ta = Math.round(1800 * (1 + daRate));
    }

    const gross = basic + da + hra + ta;
    const nps = Math.round((basic + da) * 0.10); // 10% deduction
    const net = gross - nps;

    setSalaryDetails({
      basicPay: basic,
      da,
      hra,
      ta,
      gross,
      nps,
      net,
    });
  }, [payLevel, cityClass]);

  // Handle Eligibility Evaluator
  useEffect(() => {
    const list = [];
    if (education === "Graduate") {
      if (percentage >= 50) {
        list.push("UPSC Civil Services", "SSC CGL Officer Grade", "IBPS PO (Bank Manager)");
      } else {
        list.push("UPSC Civil Services (Pass Class)", "SSC CGL (Some Posts)");
      }
    } else if (education === "12th Pass") {
      if (percentage >= 60) {
        list.push("NDA Exam (Defense)", "SSC CHSL (LDC/DEO)", "Railway NTPC Undergrad");
      } else {
        list.push("SSC CHSL (LDC)", "Railway Group D");
      }
    } else {
      list.push("Railway Group D", "SSC MTS (Multi-Tasking Staff)");
    }
    setCompatibleExams(list);
  }, [education, percentage]);

  // Calculate syllabus progress
  const completedCount = checklist.filter((item) => item.done).length;
  const progressPercent = Math.round((completedCount / checklist.length) * 100);

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Naukari Tools",
    "url": "https://naukaritools.in",
    "description": "Elite government job utility software suite containing precise age relaxations, 7th pay commission allowances, and document compression tools."
  };

  return (
    <div className="space-y-16 pb-12">
      {/* Homepage WebSite Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto space-y-6 pt-8 md:pt-16">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center space-x-2 rounded-full border border-indigo-500/30 bg-indigo-500/5 px-3 py-1 text-xs text-indigo-600 dark:text-indigo-300 backdrop-blur-sm"
        >
          <Award className="h-3.5 w-3.5" />
          <span>Calculations verified under Government Gazettes</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.1] glow-text"
        >
          Government Job <br />
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 dark:from-indigo-400 dark:via-purple-400 dark:to-indigo-500 bg-clip-text text-transparent">
            Utility Software Suite
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-sm sm:text-base text-slate-500 dark:text-zinc-400 leading-relaxed max-w-2xl mx-auto"
        >
          Ad-free, trackless, and incredibly fast. Calculate precise age limits, simulate 7th Pay Salaries, evaluate eligibility criteria, and map out your path to selection.
        </motion.p>

        {/* Search Bar fallback input */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto pt-4">
          <div className="relative flex items-center">
            <label htmlFor="search-input" className="sr-only">Search target exam</label>
            <input
              id="search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search target exam (e.g. SSC CGL, UPSC)..."
              className="w-full bg-white dark:bg-zinc-950/85 border border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20 focus:border-indigo-500/50 rounded-xl pl-4 pr-36 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-650 focus:outline-none transition-colors"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 px-3.5 py-1.5 text-[10px] font-bold text-white transition-colors"
            >
              Check Specifications
            </button>
          </div>
        </form>
      </section>

      {/* Trust Badges */}
      <TrustBadges />

      {/* Ad Banner 1 */}
      <AdBanner />

      {/* Bento Grid Layout */}
      <section id="tools" className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
        
        {/* BENTO CARD 1: Sarkari Age Calculator (span-2) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="glass-card rounded-3xl p-6 md:col-span-2 flex flex-col justify-between relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl -z-10" />

          {/* Card Header */}
          <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-semibold text-lg text-slate-900 dark:text-white">Sarkari Age Calculator</h2>
                <p className="text-xs text-slate-550 dark:text-zinc-400">Evaluate exact age limit parameters and relaxations</p>
              </div>
            </div>
            <Link
              href={routes.tools.find((t) => t.slug === "age-calculator")?.path || "/tools/age-calculator"}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium inline-flex items-center space-x-1 group"
            >
              <span>Full Tool</span>
              <ArrowRight className="h-3 w-3 transform group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Card Body - Dual Column Interface */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
            {/* Input Form */}
            <div className="space-y-4 bg-slate-100/50 dark:bg-white/[0.01] border border-black/5 dark:border-white/5 rounded-2xl p-4">
              <div>
                <label htmlFor="dob-input" className="block text-xs font-semibold text-slate-655 dark:text-zinc-350 mb-1.5 uppercase tracking-wider">Date of Birth</label>
                <input
                  id="dob-input"
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-950/80 border border-black/10 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="cutoff-input" className="block text-xs font-semibold text-slate-655 dark:text-zinc-350 mb-1.5 uppercase tracking-wider">Cutoff Date</label>
                <input
                  id="cutoff-input"
                  type="date"
                  value={cutoffDate}
                  onChange={(e) => setCutoffDate(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-950/80 border border-black/10 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">Category</label>
                <div className="flex flex-wrap gap-1.5">
                  {(["General", "OBC", "SC", "ST", "PwD"] as Category[]).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`px-2.5 py-1 text-xs rounded-md border font-medium transition-all ${
                        category === cat
                          ? "bg-indigo-600 border-indigo-400 text-white shadow-[0_0_10px_rgba(99,102,241,0.2)]"
                          : "bg-slate-200 dark:bg-zinc-900 border-black/5 dark:border-white/5 text-slate-600 dark:text-zinc-400 hover:border-black/10 dark:hover:border-white/10"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Calculation Results Dashboard */}
            <div className="flex flex-col h-full justify-between space-y-4">
              <div className="bg-slate-100/30 dark:bg-zinc-950/40 border border-black/5 dark:border-white/5 rounded-2xl p-4 space-y-3.5">
                <div className="text-xs text-slate-500 dark:text-zinc-500 font-semibold uppercase tracking-wider">Age Result</div>
                {ageResult ? (
                  <div className="space-y-3">
                    <div>
                      <span className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                        {ageResult.years}
                      </span>
                      <span className="text-sm text-slate-500 dark:text-zinc-400 ml-1.5">years</span>
                      <span className="text-xl font-semibold text-slate-800 dark:text-zinc-200 ml-3">
                        {ageResult.months}
                      </span>
                      <span className="text-xs text-slate-500 ml-1">mo</span>
                      <span className="text-lg font-medium text-slate-700 dark:text-zinc-300 ml-2">
                        {ageResult.days}
                      </span>
                      <span className="text-xs text-slate-550 dark:text-zinc-550 ml-0.5">days</span>
                    </div>

                    <div className="border-t border-black/5 dark:border-white/5 pt-3 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-655 dark:text-zinc-350">UPSC Eligibility:</span>
                        <span
                          className={`font-semibold px-2 py-0.5 rounded ${
                            ageResult.isEligibleUPSC
                              ? "text-emerald-700 dark:text-emerald-350 bg-emerald-500/10 border border-emerald-500/20"
                              : "text-red-700 dark:text-red-350 bg-red-500/10 border border-red-500/20"
                          }`}
                        >
                          {ageResult.isEligibleUPSC ? "ELIGIBLE" : "INELIGIBLE"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-655 dark:text-zinc-350">SSC CGL (30 yrs max):</span>
                        <span
                          className={`font-semibold px-2 py-0.5 rounded ${
                            ageResult.isEligibleSSC
                              ? "text-emerald-700 dark:text-emerald-350 bg-emerald-500/10 border border-emerald-500/20"
                              : "text-red-700 dark:text-red-350 bg-red-500/10 border border-red-500/20"
                          }`}
                        >
                          {ageResult.isEligibleSSC ? "ELIGIBLE" : "INELIGIBLE"}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-lg text-xs">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span>Select correct dates to display eligibility</span>
                  </div>
                )}
              </div>

              <div className="text-xs text-slate-500 dark:text-zinc-500 flex items-start space-x-1.5 p-1">
                <HelpCircle className="h-3.5 w-3.5 text-slate-400 dark:text-zinc-650 flex-shrink-0 mt-0.5" />
                <span>Default calculations base on standard cutoffs for UPSC CSE and SSC exams. Check full tool for custom limits.</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* BENTO CARD 2: 7th Pay Salary Estimator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="glass-card rounded-3xl p-6 flex flex-col justify-between"
        >
          {/* Card Header */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 text-purple-600 dark:text-purple-400">
                <Coins className="h-5 w-5" />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-700 dark:text-purple-300">
                Salary
              </span>
            </div>
            <h2 className="font-semibold text-lg text-slate-900 dark:text-white mt-3">7th Pay Estimator</h2>
            <p className="text-xs text-slate-550 dark:text-zinc-400">Simulate Central Govt Level Pay allowances</p>
          </div>

          {/* Interactive Calculator Body */}
          <div className="my-6 space-y-4">
            <div>
              <label htmlFor="pay-level-input" className="flex justify-between text-xs font-semibold text-slate-655 dark:text-zinc-350 mb-1.5">
                <span>PAY MATRIX LEVEL</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">LEVEL {payLevel}</span>
              </label>
              <input
                id="pay-level-input"
                type="range"
                min="1"
                max="10"
                value={payLevel}
                onChange={(e) => setPayLevel(parseInt(e.target.value))}
                className="w-full accent-indigo-500 bg-slate-200 dark:bg-zinc-800 rounded-lg appearance-none h-1.5 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-600 dark:text-zinc-450 px-0.5 mt-1 font-mono">
                <span>L1 (PEON)</span>
                <span>L7 (INSPECTOR)</span>
                <span>L10</span>
              </div>
            </div>

            <div className="flex justify-between items-center bg-slate-100/30 dark:bg-zinc-950/40 border border-black/5 dark:border-white/5 rounded-xl p-2.5">
              <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">HRA City Class</span>
              <div className="flex space-x-1">
                {(["X", "Y", "Z"] as const).map((cls) => (
                  <button
                    key={cls}
                    onClick={() => setCityClass(cls)}
                    className={`px-2 py-0.5 text-xs rounded border font-mono ${
                      cityClass === cls
                        ? "bg-purple-650/20 border-purple-500 text-purple-700 dark:text-purple-300"
                        : "bg-slate-200 dark:bg-zinc-900 border-black/5 dark:border-white/5 text-slate-500"
                    }`}
                  >
                    {cls}
                  </button>
                ))}
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 border-t border-black/5 dark:border-white/5 pt-3.5">
              <div className="flex justify-between text-xs text-slate-500 dark:text-zinc-500">
                <span>Basic Pay:</span>
                <span className="font-mono text-slate-700 dark:text-zinc-300">₹{salaryDetails.basicPay.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500 dark:text-zinc-500">
                <span>Gross Allowances:</span>
                <span className="font-mono text-slate-700 dark:text-zinc-300">₹{(salaryDetails.gross - salaryDetails.basicPay).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500 dark:text-zinc-500">
                <span>NPS Ded. (10%):</span>
                <span className="font-mono text-red-600 dark:text-red-500/80">-₹{salaryDetails.nps.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* In-Hand Output */}
          <div className="bg-indigo-50 dark:bg-indigo-600/10 border border-indigo-200 dark:border-indigo-500/20 rounded-2xl p-3.5 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-300 uppercase tracking-wider">Est. Monthly In-Hand</div>
              <div className="text-lg font-bold text-slate-900 dark:text-white tracking-tight font-mono">
                ₹{salaryDetails.net.toLocaleString()}
              </div>
            </div>
            <Link
              href={routes.tools.find((t) => t.slug === "salary-calculator")?.path || "/tools/salary-calculator"}
              aria-label="Open 7th Pay Salary Calculator"
              className="h-8 w-8 rounded-lg bg-white hover:bg-slate-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-black/10 dark:border-white/10 flex items-center justify-center text-slate-800 dark:text-white transition-colors"
            >
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>

        {/* BENTO CARD 3: Syllabus & Revision Tracker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="glass-card rounded-3xl p-6 flex flex-col justify-between"
        >
          {/* Card Header */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                <LayoutList className="h-5 w-5" />
              </div>
              {/* Radial Progress indicator */}
              <div className="flex items-center space-x-1.5 text-xs text-emerald-750 dark:text-emerald-350 font-mono">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>{progressPercent}% Done</span>
              </div>
            </div>
            <h2 className="font-semibold text-lg text-slate-900 dark:text-white mt-3">Syllabus & Prep Tracker</h2>
            <p className="text-xs text-slate-550 dark:text-zinc-400">Organize and monitor subject-wise milestones</p>
          </div>

          {/* Task List */}
          <div className="my-6 space-y-2.5">
            {checklist.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setChecklist(
                    checklist.map((c) =>
                      c.id === item.id ? { ...c, done: !c.done } : c
                    )
                  );
                }}
                className="w-full flex items-center space-x-3 bg-slate-100/30 hover:bg-slate-150/60 dark:bg-zinc-950/40 dark:hover:bg-zinc-950/80 border border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10 rounded-xl p-2.5 text-left transition-all"
              >
                <div
                  className={`h-4.5 w-4.5 rounded flex items-center justify-center border transition-all ${
                    item.done
                      ? "bg-emerald-500 border-emerald-400 text-white"
                      : "border-black/10 dark:border-white/10 text-transparent"
                  }`}
                >
                  <CheckCircle2 className="h-3 w-3" />
                </div>
                <span className={`text-xs ${item.done ? "text-slate-500 dark:text-zinc-450 line-through" : "text-slate-700 dark:text-zinc-300"}`}>
                  {item.text}
                </span>
              </button>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="w-full bg-slate-200 dark:bg-zinc-900 rounded-full h-1.5 overflow-hidden border border-black/5 dark:border-white/5">
              <div
                className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <Link
              href={routes.tools.find((t) => t.slug === "syllabus-tracker")?.path || "/tools/syllabus-tracker"}
              className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-black/10 dark:border-white/10 text-xs text-center text-slate-600 hover:text-slate-900 dark:text-zinc-300 dark:hover:text-white font-medium transition-colors inline-block"
            >
              Configure Syllabus Milestones
            </Link>
          </div>
        </motion.div>

        {/* BENTO CARD 4: Eligibility Checker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="glass-card rounded-3xl p-6 flex flex-col justify-between"
        >
          {/* Card Header */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-600 dark:text-blue-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300">
                Evaluator
              </span>
            </div>
            <h2 className="font-semibold text-lg text-slate-900 dark:text-white mt-3">Eligibility Evaluator</h2>
            <p className="text-xs text-slate-550 dark:text-zinc-400">Verify compatibilities based on degree & marks</p>
          </div>

          {/* Interactive Inputs */}
          <div className="my-6 space-y-4">
            <div>
              <label htmlFor="qualification-select" className="block text-[10px] font-bold text-slate-655 dark:text-zinc-350 uppercase tracking-wider mb-1">Highest Qualification</label>
              <select
                id="qualification-select"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                className="w-full bg-white dark:bg-zinc-950 border border-black/10 dark:border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-blue-500/50"
              >
                <option value="Graduate">Graduate / Degree</option>
                <option value="12th Pass">Senior Secondary (12th)</option>
                <option value="10th Pass">Matriculation (10th)</option>
              </select>
            </div>

            <div>
              <label htmlFor="percentage-input" className="flex justify-between text-[10px] font-bold text-slate-655 dark:text-zinc-350 mb-1">
                <span>GRADUATION / 12TH SCORE</span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">{percentage}%</span>
              </label>
              <input
                id="percentage-input"
                type="range"
                min="40"
                max="100"
                value={percentage}
                onChange={(e) => setPercentage(parseInt(e.target.value))}
                className="w-full accent-blue-500 bg-slate-200 dark:bg-zinc-800 rounded-lg appearance-none h-1.5 cursor-pointer"
              />
            </div>
          </div>

          {/* Result Output */}
          <div className="space-y-2 bg-slate-100/30 dark:bg-zinc-950/40 border border-black/5 dark:border-white/5 rounded-2xl p-3.5">
            <div className="text-[10px] font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-wider">Compatible Jobs</div>
            <div className="space-y-1.5 max-h-[100px] overflow-y-auto pr-1">
              {compatibleExams.map((exam, i) => (
                <div key={i} className="flex items-center space-x-2 text-xs text-slate-700 dark:text-zinc-300">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500 dark:bg-blue-400" />
                  <span>{exam}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* BENTO CARD 5: All Tools Catalog Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="glass-card rounded-3xl p-6 md:col-span-2 flex flex-col justify-between relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl -z-10" />

          {/* Catalog Details */}
          <div className="space-y-2 max-w-lg mb-8">
            <div className="inline-flex items-center space-x-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-mono">
              <BookOpen className="h-3.5 w-3.5" />
              <span>Programmatic SEO Mapped Hubs</span>
            </div>
            <h2 className="font-semibold text-lg text-slate-900 dark:text-white">Interactive Utility Map</h2>
            <p className="text-xs text-slate-550 dark:text-zinc-400">
              Each utility compiles real-time rules, allowances, and relaxation structures. Navigate directly to dynamic utility pathways for deeper calculations and personalized reports.
            </p>
          </div>

          {/* Directory Listings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {toolsList.map((tool) => (
              <Link
                key={tool.slug}
                href={tool.path}
                className="group p-4 rounded-2xl border border-black/5 dark:border-white/5 bg-slate-100/30 dark:bg-zinc-950/20 hover:bg-slate-100/60 dark:hover:bg-zinc-950/60 hover:border-black/10 dark:hover:border-white/10 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="flex items-start justify-between">
                  <span className="font-semibold text-sm text-slate-800 dark:text-zinc-200 group-hover:text-slate-900 group-hover:dark:text-white transition-colors">
                    {tool.name}
                  </span>
                  {tool.badge && (
                    <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-300">
                      {tool.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-zinc-500 group-hover:text-slate-650 group-hover:dark:text-zinc-400 transition-colors leading-relaxed">
                  {tool.description}
                </p>
                <div className="flex items-center space-x-1 text-xs font-semibold text-slate-500 dark:text-zinc-400 group-hover:text-indigo-600 group-hover:dark:text-indigo-400 transition-colors">
                  <span>Open Tool</span>
                  <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

      </section>

      {/* Trust Signpost Section */}
      <section className="max-w-4xl mx-auto rounded-3xl border border-black/5 dark:border-white/5 bg-slate-100/30 dark:bg-zinc-950/20 px-8 py-10 text-center space-y-4">
        <h2 className="font-semibold text-lg text-slate-900 dark:text-white">How Naukari Tools Double-Checks Calculation Parameters</h2>
        <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed max-w-2xl mx-auto">
          Age limits and qualifications for government jobs are historically complex, varying widely between agencies (UPSC, SSC, Railway Board) and category classes (OBC, SC, ST, EWS). Naukari Tools utilizes verified mathematical logic mapped directly to Gazette notifications to guarantee precise estimations.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-semibold text-slate-500 dark:text-zinc-500 font-mono">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span>50+ Central Rules Compiled</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span>Zero Data Collection</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span>Latest 2026 Allowances</span>
          </div>
        </div>
      </section>

      {/* Ad Banner 2 */}
      <AdBanner />
    </div>
  );
}
