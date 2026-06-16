"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutList, Check, Plus, Settings2, ShieldCheck, RefreshCw } from "lucide-react";

interface Milestone {
  id: string;
  name: string;
  category: string;
}

const defaultMilestones: Milestone[] = [
  { id: "quant", name: "Quantitative Aptitude", category: "Mathematics" },
  { id: "gs", name: "General Studies & History", category: "GK & History" },
  { id: "english", name: "English Comprehension", category: "Language" },
  { id: "reasoning", name: "Logical & Analytical Reasoning", category: "Reasoning" },
  { id: "current", name: "Current Affairs & Static GK", category: "GK & Static" },
  { id: "science", name: "General Science & Tech", category: "Science" },
];

export default function SyllabusTracker() {
  const [milestones, setMilestones] = useState<Milestone[]>(defaultMilestones);
  const [completed, setCompleted] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [newMilestoneName, setNewMilestoneName] = useState("");
  const [showConfig, setShowConfig] = useState(false);

  // Load from LocalStorage
  useEffect(() => {
    const savedCompleted = localStorage.getItem("syllabus_completed");
    const savedMilestones = localStorage.getItem("syllabus_milestones");
    if (savedCompleted) {
      setCompleted(JSON.parse(savedCompleted));
    }
    if (savedMilestones) {
      setMilestones(JSON.parse(savedMilestones));
    }
    setIsHydrated(true);
  }, []);

  // Toggle completion
  const handleToggle = (id: string) => {
    let updated;
    if (completed.includes(id)) {
      updated = completed.filter((c) => c !== id);
    } else {
      updated = [...completed, id];
    }
    setCompleted(updated);
    localStorage.setItem("syllabus_completed", JSON.stringify(updated));
  };

  // Add custom milestone
  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestoneName.trim()) return;
    const newId = `custom_${Date.now()}`;
    const newMilestone: Milestone = {
      id: newId,
      name: newMilestoneName.trim(),
      category: "Custom Target",
    };
    const updatedMilestones = [...milestones, newMilestone];
    setMilestones(updatedMilestones);
    localStorage.setItem("syllabus_milestones", JSON.stringify(updatedMilestones));
    setNewMilestoneName("");
  };

  // Reset progress
  const handleReset = () => {
    setCompleted([]);
    localStorage.removeItem("syllabus_completed");
  };

  // Restore defaults
  const handleRestoreDefaults = () => {
    setMilestones(defaultMilestones);
    setCompleted([]);
    localStorage.setItem("syllabus_milestones", JSON.stringify(defaultMilestones));
    localStorage.removeItem("syllabus_completed");
  };

  const total = milestones.length;
  const doneCount = completed.filter((id) => milestones.some((m) => m.id === id)).length;
  const percentage = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  if (!isHydrated) {
    return (
      <div className="glass-card rounded-3xl p-8 text-center text-zinc-500 animate-pulse">
        Syncing Syllabus Engine...
      </div>
    );
  }

  return (
    <div className="glass-card rounded-3xl p-6 md:p-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl -z-10" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-black/5 dark:border-white/5">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            <LayoutList className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-slate-900 dark:text-white">Syllabus & Milestones</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">Track milestones and topics for competitive exams</p>
          </div>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
          <ShieldCheck className="h-3 w-3" />
          <span>Local Engine</span>
        </span>
      </div>

      {/* Checklist Grid */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <AnimatePresence mode="popLayout">
            {milestones.map((item) => {
              const isDone = completed.includes(item.id);
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => handleToggle(item.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                    isDone
                      ? "bg-emerald-500/5 border-emerald-500/25 hover:border-emerald-500/40"
                      : "bg-slate-100/30 border-black/5 hover:border-black/10 hover:bg-slate-100/60 dark:bg-zinc-950/20 dark:border-white/5 dark:hover:border-white/10 dark:hover:bg-zinc-950/40"
                  }`}
                >
                  <div className="space-y-1">
                    <span className={`text-xs font-semibold block transition-colors ${isDone ? "text-emerald-600 dark:text-emerald-400" : "text-slate-800 dark:text-zinc-200"}`}>
                      {item.name}
                    </span>
                    <span className="text-[9px] uppercase font-bold tracking-wider text-slate-450 dark:text-zinc-600 font-mono">
                      {item.category}
                    </span>
                  </div>

                  {/* Custom Glass Checkbox Element */}
                  <div
                    className={`h-5 w-5 rounded-lg border flex items-center justify-center transition-all ${
                      isDone
                        ? "bg-emerald-600 border-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                        : "bg-white border-black/10 dark:bg-zinc-950 dark:border-white/10 text-transparent group-hover:border-zinc-350 dark:group-hover:border-zinc-700"
                    }`}
                  >
                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Milestone Configuration Form Panel */}
        <AnimatePresence>
          {showConfig && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <form onSubmit={handleAddMilestone} className="p-4 rounded-2xl bg-white dark:bg-zinc-950 border border-black/5 dark:border-white/5 space-y-3 mt-2">
                <div className="text-[10px] font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-wider">
                  Add Custom Syllabus Milestone
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={newMilestoneName}
                    onChange={(e) => setNewMilestoneName(e.target.value)}
                    placeholder="e.g., General Hindi, Core CS Subject..."
                    className="flex-grow bg-slate-100 border border-black/10 dark:bg-zinc-900 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white placeholder-slate-450 dark:placeholder-zinc-700 focus:outline-none focus:border-emerald-500/50"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 text-xs font-bold text-white transition-all flex items-center space-x-1"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add</span>
                  </button>
                </div>
                <div className="flex gap-4 text-[10px] text-slate-500 dark:text-zinc-500 pt-1 font-semibold">
                  <button type="button" onClick={handleReset} className="hover:text-rose-600 dark:hover:text-rose-400 flex items-center space-x-1">
                    <RefreshCw className="h-3 w-3" />
                    <span>Clear completed Progress</span>
                  </button>
                  <button type="button" onClick={handleRestoreDefaults} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                    Restore Defaults
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Progress Bar & Action Button */}
        <div className="pt-4 border-t border-black/5 dark:border-white/5 space-y-4">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-wider block">
                Total Prep Milestones Completed
              </span>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">{doneCount}</span>
                <span className="text-xs text-slate-450 dark:text-zinc-600">/</span>
                <span className="text-xs text-slate-500 dark:text-zinc-500 font-mono">{total} subjects</span>
              </div>
            </div>

            {/* Glowing Text Indicator */}
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-wider block">Progress</span>
              <span className="text-lg font-extrabold text-emerald-650 dark:text-emerald-400 font-mono glow-text shadow-emerald-500/50">
                {percentage}% Done
              </span>
            </div>
          </div>

          {/* Animating Fill progress Bar */}
          <div className="w-full bg-slate-200 dark:bg-zinc-950 rounded-full h-2 overflow-hidden border border-black/5 dark:border-white/5 relative">
            <motion.div
              className="bg-emerald-500 h-full rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>

          <div className="flex justify-end pt-1">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowConfig(!showConfig)}
              className="inline-flex items-center space-x-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-white transition-all hover:bg-slate-100 dark:hover:bg-zinc-800"
            >
              <Settings2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Configure Syllabus Milestones</span>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
