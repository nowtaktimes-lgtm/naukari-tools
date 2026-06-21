"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Award, CheckCircle2, AlertTriangle, GraduationCap } from "lucide-react";

interface JobRequirement {
  title: string;
  board: string;
  minQual: "10th Pass" | "12th Pass" | "Graduation" | "Post-Graduation";
  minPercentage: number;
  description: string;
}

const jobsDatabase: JobRequirement[] = [
  {
    title: "UPSC Civil Services",
    board: "UPSC",
    minQual: "Graduation",
    minPercentage: 0,
    description: "IAS, IPS, IFS administrative cadres. Only graduation degree required.",
  },
  {
    title: "SSC CGL (Graduate Level)",
    board: "SSC",
    minQual: "Graduation",
    minPercentage: 50,
    description: "Inspectors, Assistants, & Audit Officers in Central Ministries.",
  },
  {
    title: "IBPS PO (Bank Officers)",
    board: "IBPS",
    minQual: "Graduation",
    minPercentage: 60,
    description: "Probationary Officers in Nationalised Public Sector Banks.",
  },
  {
    title: "SSC CHSL (10+2 Level)",
    board: "SSC",
    minQual: "12th Pass",
    minPercentage: 0,
    description: "Lower Division Clerks & Postal Assistants in Central Govts.",
  },
  {
    title: "Indian Airforce (Group Y)",
    board: "IAF",
    minQual: "12th Pass",
    minPercentage: 50,
    description: "Non-Technical airmen vacancies. Requires 50% aggregate score.",
  },
  {
    title: "Railway RRB NTPC (Undergrad)",
    board: "RRB",
    minQual: "12th Pass",
    minPercentage: 50,
    description: "Clerks, Ticket Collectors, & Typists across Indian Railways.",
  },
  {
    title: "SSC GD Constable",
    board: "SSC",
    minQual: "10th Pass",
    minPercentage: 0,
    description: "General Duty Constable positions in CAPFs & rifleman in Assam Rifles.",
  },
  {
    title: "Post-Graduate Teacher (PGT)",
    board: "State Boards",
    minQual: "Post-Graduation",
    minPercentage: 55,
    description: "Academic lecturers in Govt senior secondary model schools.",
  },
];

const qualificationHierarchy = {
  "10th Pass": 1,
  "12th Pass": 2,
  "Graduation": 3,
  "Post-Graduation": 4,
};

export default function EligibilityEvaluator() {
  const [qual, setQual] = useState<keyof typeof qualificationHierarchy>("Graduation");
  const [percentage, setPercentage] = useState(55);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load state from localStorage
  useEffect(() => {
    const savedQual = localStorage.getItem("eligibility_qual");
    const savedPercentage = localStorage.getItem("eligibility_percentage");
    if (savedQual && savedQual in qualificationHierarchy) {
      setQual(savedQual as keyof typeof qualificationHierarchy);
    }
    if (savedPercentage) {
      setPercentage(parseInt(savedPercentage, 10));
    }
    setIsHydrated(true);
  }, []);

  const handleQualChange = (val: keyof typeof qualificationHierarchy) => {
    setQual(val);
    localStorage.setItem("eligibility_qual", val);
  };

  const handlePercentageChange = (val: number) => {
    setPercentage(val);
    localStorage.setItem("eligibility_percentage", val.toString());
  };

  // Filtering Logic
  const currentQualRank = qualificationHierarchy[qual];

  const compatibleJobs = jobsDatabase.filter((job) => {
    const requiredRank = qualificationHierarchy[job.minQual];
    return currentQualRank >= requiredRank && percentage >= job.minPercentage;
  });

  if (!isHydrated) {
    return (
      <div className="glass-card rounded-3xl p-8 text-center text-zinc-500 animate-pulse">
        Initializing Evaluator Engine...
      </div>
    );
  }

  return (
    <div className="glass-card rounded-3xl p-6 md:p-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl -z-10" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-black/5 dark:border-white/5">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-600 dark:text-blue-400">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-semibold text-lg text-slate-900 dark:text-white">Eligibility Evaluator</h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400">Evaluate matching public sector recruitment criteria</p>
          </div>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
          <ShieldCheck className="h-3 w-3" />
          <span>Local Engine</span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Form Controls */}
        <div className="space-y-6 md:col-span-1">
          {/* Dropdown for Qualification */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
              Highest Qualification
            </label>
            <select
              value={qual}
              onChange={(e) => handleQualChange(e.target.value as keyof typeof qualificationHierarchy)}
              className="w-full bg-white dark:bg-zinc-950 border border-black/10 dark:border-white/10 rounded-xl px-3 py-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-blue-500/50 transition-colors"
            >
              <option value="Post-Graduation">Post-Graduation</option>
              <option value="Graduation">Graduation / Degree</option>
              <option value="12th Pass">Senior Secondary (12th)</option>
              <option value="10th Pass">Matriculation (10th)</option>
            </select>
          </div>

          {/* Range Slider for Percentage */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
              <span>Academic Marks</span>
              <span className="text-blue-600 dark:text-blue-400 font-mono font-bold text-sm">{percentage}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={percentage}
              onChange={(e) => handlePercentageChange(parseInt(e.target.value))}
              className="w-full accent-blue-500 bg-slate-200 dark:bg-zinc-950 rounded-lg appearance-none h-2 cursor-pointer border border-black/5 dark:border-white/5"
            />
            <div className="flex justify-between text-[9px] text-slate-400 dark:text-zinc-650 font-semibold uppercase tracking-wider pt-1">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Quick Info Box */}
          <div className="p-3.5 rounded-2xl bg-slate-100/50 dark:bg-white/[0.01] border border-black/5 dark:border-white/5 text-[11px] text-slate-500 dark:text-zinc-500 leading-relaxed">
            <div className="font-semibold text-slate-650 dark:text-zinc-400 flex items-center space-x-1.5 mb-1.5">
              <Award className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              <span>Matching Guidelines</span>
            </div>
            Academic percent specifications are evaluated dynamically. Ensure you check specialized boards for subject requirements.
          </div>
        </div>

        {/* Right Columns: Compatible Jobs Output */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
              Compatible Openings ({compatibleJobs.length})
            </span>
            <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold font-mono">
              rank hierarchy matching active
            </span>
          </div>

          <div className="max-h-[300px] overflow-y-auto pr-2 space-y-3 scrollbar-thin">
            <AnimatePresence mode="popLayout">
              {compatibleJobs.length > 0 ? (
                compatibleJobs.map((job) => (
                  <motion.div
                    key={job.title}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    className="p-4 rounded-2xl bg-slate-100/30 dark:bg-zinc-950/40 border border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10 hover:bg-slate-100/60 dark:hover:bg-zinc-950/70 transition-all flex items-start space-x-3.5"
                  >
                    <div className="h-7 w-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20 flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-sm text-slate-900 dark:text-white">{job.title}</h4>
                        <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-300">
                          {job.board}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-500 leading-normal">{job.description}</p>
                      <div className="flex items-center space-x-3 text-[10px] text-slate-400 dark:text-zinc-650 font-semibold pt-1 uppercase tracking-wider">
                        <span>Min: {job.minQual}</span>
                        <span>•</span>
                        <span>Min Percent: {job.minPercentage}%</span>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-8 rounded-2xl bg-slate-100/20 dark:bg-zinc-950/20 border border-black/5 dark:border-white/5 border-dashed text-center text-slate-500 dark:text-zinc-500 space-y-2"
                >
                  <AlertTriangle className="h-8 w-8 mx-auto text-amber-500/60" />
                  <p className="text-xs font-semibold text-slate-700 dark:text-zinc-400">No Compatible Openings Found</p>
                  <p className="text-[11px] text-slate-400 dark:text-zinc-650">Try adjusting your highest qualification rank or percentage targets.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
