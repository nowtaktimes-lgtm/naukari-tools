"use client";

import React, { useState, useEffect, useCallback } from "react";
import { jsPDF } from "jspdf";
import { 
  Calendar, 
  Printer, 
  CheckCircle2, 
  XCircle
} from "lucide-react";
import examsData from "@/data/exams.json";
import { ExamSEODB } from "@/types/exam";

interface AgeCalculatorProps {
  defaultCutoffDate?: string;
  defaultExamSlug?: string;
}

export default function AgeCalculator({ defaultCutoffDate = "2026-08-01", defaultExamSlug }: AgeCalculatorProps) {
  // Database of exams
  const exams: ExamSEODB[] = examsData as ExamSEODB[];

  // State inputs
  const [candidateName, setCandidateName] = useState("");
  const [dob, setDob] = useState("1998-07-01");
  const [selectedExamSlug, setSelectedExamSlug] = useState(defaultExamSlug || exams[0]?.slug || "");
  const [cutoffDate, setCutoffDate] = useState(defaultCutoffDate);
  const [category, setCategory] = useState<"General" | "OBC" | "SC/ST">("General");

  // Calculation Results
  const [ageYears, setAgeYears] = useState(0);
  const [ageMonths, setAgeMonths] = useState(0);
  const [ageDays, setAgeDays] = useState(0);
  const [isEligible, setIsEligible] = useState(true);
  const [maxAgeAllowed, setMaxAgeAllowed] = useState(30);
  const [minAgeAllowed, setMinAgeAllowed] = useState(18);
  const [remainingYears, setRemainingYears] = useState(0);

  // Selected Exam object
  const currentExam = exams.find((e) => e.slug === selectedExamSlug);

  // Update cutoff date when exam changes
  useEffect(() => {
    if (currentExam) {
      setCutoffDate(currentExam.releaseDate || defaultCutoffDate);
    }
  }, [selectedExamSlug, currentExam, defaultCutoffDate]);

  // Main Calculation Logic
  const performCalculation = useCallback(() => {
    if (!dob || !cutoffDate) return;

    const birthDate = new Date(dob);
    const targetDate = new Date(cutoffDate);

    if (birthDate > targetDate) {
      setIsEligible(false);
      return;
    }

    // Exact difference calculation
    let years = targetDate.getFullYear() - birthDate.getFullYear();
    let months = targetDate.getMonth() - birthDate.getMonth();
    let days = targetDate.getDate() - birthDate.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    setAgeYears(years);
    setAgeMonths(months);
    setAgeDays(days);

    // Age limits & relaxation logic
    let minAge = 18;
    let maxAge = 30;
    let relaxation = 0;

    if (currentExam) {
      minAge = currentExam.generalMinAge;
      maxAge = currentExam.generalMaxAge;
      
      if (category === "OBC") {
        relaxation = currentExam.obcRelaxationYears;
      } else if (category === "SC/ST") {
        relaxation = currentExam.scstRelaxationYears;
      }
    }

    const finalMaxAge = maxAge + relaxation;
    setMinAgeAllowed(minAge);
    setMaxAgeAllowed(finalMaxAge);

    // Check Eligibility
    const decimalAge = years + months / 12 + days / 365;
    const isUnderMax = decimalAge <= finalMaxAge;
    const isOverMin = decimalAge >= minAge;
    const eligible = isUnderMax && isOverMin;

    setIsEligible(eligible);

    // Calculate remaining attempts / years
    if (eligible) {
      setRemainingYears(Math.max(0, finalMaxAge - years));
    } else {
      setRemainingYears(0);
    }
  }, [dob, cutoffDate, category, currentExam]);

  // Recalculate whenever inputs change
  useEffect(() => {
    performCalculation();
  }, [performCalculation]);

  // Export PDF Report
  const generatePDF = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    const primaryColor = "#4F46E5"; // Indigo-600
    const secondaryColor = "#1F2937"; // Gray-800
    const accentColor = isEligible ? "#10B981" : "#EF4444"; // Emerald or Red

    // Background border card
    doc.setDrawColor(229, 231, 235);
    doc.rect(10, 10, 190, 277);

    // Title Header
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(primaryColor);
    doc.text("Naukari Tools Eligibility Report", 15, 25);

    // Verification subtitle
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(107, 114, 128); // Gray-500
    doc.text("VERIFIED CLIENT-SIDE | ZERO SERVER DATA UPLOADS", 15, 30);

    // Line separator
    doc.setDrawColor(79, 70, 229);
    doc.setLineWidth(0.8);
    doc.line(15, 33, 195, 33);

    // Section 1: Candidate Details
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(secondaryColor);
    doc.text("Candidate Details", 15, 45);

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Candidate Name: ${candidateName || "Not Specified"}`, 15, 52);
    doc.text(`Date of Birth: ${dob}`, 15, 58);
    doc.text(`Category Applied: ${category}`, 15, 64);

    // Section 2: Exam parameters
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Exam Eligibility Parameters", 15, 76);

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Exam Selected: ${currentExam?.examName || "Custom Exam"}`, 15, 83);
    doc.text(`Conducting Board: ${currentExam?.examBoard || "Custom"}`, 15, 89);
    doc.text(`Official Cutoff Date: ${cutoffDate}`, 15, 95);
    doc.text(`Min Age Allowed: ${minAgeAllowed} Years`, 15, 101);
    doc.text(`Max Age Allowed (with relaxation): ${maxAgeAllowed} Years`, 15, 107);

    // Box highlight for Calculated Age
    doc.setFillColor(243, 244, 246); // Light Gray
    doc.rect(15, 115, 180, 20, "F");

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(secondaryColor);
    doc.text("CALCULATED AGE ON CUTOFF DATE", 20, 121);
    
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(primaryColor);
    doc.text(`${ageYears} Years, ${ageMonths} Months, ${ageDays} Days`, 20, 130);

    // Eligibility Status
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(secondaryColor);
    doc.text("Eligibility Status", 15, 147);

    doc.setFillColor(isEligible ? 209 : 254, isEligible ? 250 : 226, isEligible ? 229 : 226); // Emerald-100 or Red-100
    doc.rect(15, 151, 180, 12, "F");

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(accentColor);
    doc.text(isEligible ? "ELIGIBLE TO APPLY!" : "INELIGIBLE - AGE LIMIT EXCEEDED", 20, 159);

    // Additional findings
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(secondaryColor);
    if (isEligible) {
      doc.text(`Candidate has approx. ${remainingYears} years of eligibility remaining for this exam.`, 15, 172);
    } else {
      doc.text("Candidate's calculated age is outside the bounds of the specified recruitment rules.", 15, 172);
    }

    // Disclaimer Footer
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175); // Gray-400
    doc.text("Disclaimer: This report is compiled client-side based on gazetted notifications compiled by Naukari Tools.", 15, 255);
    doc.text("Please cross-reference with official employment news before applying.", 15, 260);

    // System active verification stamp
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(primaryColor);
    doc.text("Naukari Tools Verification Stamp - SECURE REPORT", 15, 270);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 15, 274);

    // Download PDF
    doc.save(`Naukari_Tools_Age_Report_${currentExam?.slug || "custom"}.pdf`);
  };

  return (
    <div className="glass-card rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between h-full">
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl -z-10" />

      {/* Header */}
      <div className="flex items-center space-x-3 border-b border-black/5 dark:border-white/5 pb-4 mb-6">
        <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 text-indigo-650 dark:text-indigo-400">
          <Calendar className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-semibold text-lg text-slate-900 dark:text-white">Age Eligibility Console</h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400">Verified gazette age relaxation calculator</p>
        </div>
      </div>

      {/* Input controls */}
      <div className="space-y-4">
        {/* Candidate Name Input */}
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">Candidate Name</label>
          <input
            type="text"
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
            placeholder="Enter candidate name (Optional)"
            className="w-full bg-white dark:bg-zinc-950/80 border border-black/10 dark:border-white/10 rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* DOB Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">Date of Birth</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full bg-white dark:bg-zinc-950/80 border border-black/10 dark:border-white/10 rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500/50"
            />
          </div>

          {/* Exam Selection Dropdown */}
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">Exam Board Match</label>
            <select
              value={selectedExamSlug}
              onChange={(e) => setSelectedExamSlug(e.target.value)}
              className="w-full bg-white dark:bg-zinc-950/80 border border-black/10 dark:border-white/10 rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500/50"
            >
              {exams.map((exam) => (
                <option key={exam.slug} value={exam.slug}>
                  {exam.examName} ({exam.examBoard})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Cutoff Date (pre-loaded but configurable) */}
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">Target Cutoff Date</label>
            <input
              type="date"
              value={cutoffDate}
              onChange={(e) => setCutoffDate(e.target.value)}
              className="w-full bg-white dark:bg-zinc-950/80 border border-black/10 dark:border-white/10 rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500/50"
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">Reservation Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as "General" | "OBC" | "SC/ST")}
              className="w-full bg-white dark:bg-zinc-950/80 border border-black/10 dark:border-white/10 rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500/50"
            >
              <option value="General">General / Unreserved (UR)</option>
              <option value="OBC">Other Backward Classes (OBC)</option>
              <option value="SC/ST">Scheduled Caste / Tribe (SC/ST)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Dashboard */}
      <div className="my-6 space-y-4">
        {/* Age Numbers */}
        <div className="bg-slate-100/30 dark:bg-zinc-950/40 border border-black/5 dark:border-white/5 rounded-2xl p-4 flex justify-around items-center">
          <div className="text-center">
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{ageYears}</div>
            <div className="text-[10px] uppercase font-semibold text-slate-500 dark:text-zinc-500 tracking-wider">Years</div>
          </div>
          <div className="h-8 w-[1px] bg-black/5 dark:bg-white/5" />
          <div className="text-center">
            <div className="text-3xl font-extrabold text-slate-800 dark:text-zinc-200 tracking-tight">{ageMonths}</div>
            <div className="text-[10px] uppercase font-semibold text-slate-500 dark:text-zinc-500 tracking-wider">Months</div>
          </div>
          <div className="h-8 w-[1px] bg-black/5 dark:bg-white/5" />
          <div className="text-center">
            <div className="text-3xl font-extrabold text-slate-700 dark:text-zinc-300 tracking-tight">{ageDays}</div>
            <div className="text-[10px] uppercase font-semibold text-slate-500 dark:text-zinc-500 tracking-wider">Days</div>
          </div>
        </div>

        {/* Eligibility Status Readout */}
        <div className="transition-all duration-300">
          {isEligible ? (
            <div className="flex items-start space-x-3 rounded-2xl bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-200 dark:border-emerald-500/20 p-4 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider">Eligible to Apply!</h4>
                <p className="text-xs text-slate-550 dark:text-zinc-400 leading-relaxed mt-1">
                  Candidate meets the criteria. (Age limit: {minAgeAllowed} to {maxAgeAllowed} years). 
                  Approx. <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{remainingYears} eligibility years</span> remaining.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start space-x-3 rounded-2xl bg-red-50 dark:bg-red-500/5 border border-red-200 dark:border-red-500/20 p-4 text-red-600 dark:text-red-400">
              <XCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider">Ineligible by Age Bound</h4>
                <p className="text-xs text-slate-550 dark:text-zinc-400 leading-relaxed mt-1">
                  Candidate&apos;s age on cutoff date ({cutoffDate}) falls outside the allowable limit ({minAgeAllowed} to {maxAgeAllowed} years).
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* PDF Export Action Button */}
      <button
        onClick={generatePDF}
        className="w-full inline-flex items-center justify-center space-x-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 border border-indigo-400/20 px-4 py-3 text-sm font-semibold text-white transition-all shadow-[0_0_15px_rgba(99,102,241,0.2)] hover:shadow-[0_0_25px_rgba(99,102,241,0.4)]"
      >
        <Printer className="h-4 w-4" />
        <span>Print / Save Result as PDF</span>
      </button>
    </div>
  );
}
