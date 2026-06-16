"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Shield, ArrowRight } from "lucide-react";
import examsData from "@/data/exams.json";

// Types matching examsData
interface Exam {
  slug: string;
  examName: string;
  examBoard: string;
  releaseDate: string;
  generalMinAge: number;
  generalMaxAge: number;
  obcRelaxationYears: number;
  scstRelaxationYears: number;
  photoMaxKb: number;
  photoDimensions: string;
  signatureMaxKb: number;
  signatureDimensions: string;
}

const examsList = examsData as Exam[];

export default function ExamsClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBoard, setSelectedBoard] = useState("All");

  // Get unique board names for filter chips
  const boards = useMemo(() => {
    const uniqueBoards = new Set(examsList.map((e) => e.examBoard));
    return ["All", ...Array.from(uniqueBoards).sort()];
  }, []);

  // Filter exams based on search query and selected board category
  const filteredExams = useMemo(() => {
    return examsList.filter((exam) => {
      const matchesSearch =
        exam.examName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exam.examBoard.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesBoard =
        selectedBoard === "All" || exam.examBoard === selectedBoard;

      return matchesSearch && matchesBoard;
    });
  }, [searchQuery, selectedBoard]);

  // Premium HSL-based card badge styling according to board name
  const getBoardColor = (board: string) => {
    const b = board.toUpperCase();
    if (b.includes("SSC")) return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
    if (b.includes("UPSC")) return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
    if (b.includes("IBPS") || b.includes("SBI") || b.includes("RBI")) return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20";
    if (b.includes("RRB") || b.includes("RPF")) return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
    if (b.includes("TEACH") || b.includes("CBSE") || b.includes("KVS") || b.includes("NVS") || b.includes("TET")) return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
    return "bg-slate-500/10 text-slate-600 dark:text-zinc-400 border-slate-500/20";
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 py-6">
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white glow-text">
          Naukari<span className="text-indigo-600 dark:text-indigo-400">Tools</span> Exam Directory
        </h1>
        <p className="text-sm sm:text-base text-slate-500 dark:text-zinc-400 leading-relaxed">
          Find and launch eligibility tools, photo resizers, and document tools for all {examsList.length} Indian recruitment exams.
        </p>
      </div>

      {/* Filters Bento Block */}
      <div className="glass-card rounded-3xl p-6 border border-black/5 dark:border-white/10 shadow-sm flex flex-col md:flex-row gap-6 items-stretch justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 dark:text-zinc-500" />
          <input
            type="text"
            placeholder="Search exams by name, board, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-100/50 dark:bg-zinc-950/40 border border-black/5 dark:border-white/5 rounded-2xl text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 text-slate-900 dark:text-white transition-colors placeholder:text-slate-400 dark:placeholder:text-zinc-500"
          />
        </div>

        {/* Selected count info */}
        <div className="flex items-center px-2 text-xs text-slate-400 dark:text-zinc-500 font-medium font-mono">
          Showing {filteredExams.length} of {examsList.length} Exams
        </div>
      </div>

      {/* Board filter chips */}
      <div className="flex flex-wrap gap-2.5 max-w-7xl max-h-[140px] overflow-y-auto pr-2 custom-scrollbar">
        {boards.map((board) => (
          <button
            key={board}
            onClick={() => setSelectedBoard(board)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 ${
              selectedBoard === board
                ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/10"
                : "bg-white/60 dark:bg-[#0A0A0A]/40 border-black/5 dark:border-white/5 text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-900"
            }`}
          >
            {board === "All" ? "All Boards" : board}
          </button>
        ))}
      </div>

      {/* Exams Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredExams.map((exam) => (
            <Link key={exam.slug} href={`/tools/${exam.slug}`} className="block h-full group">
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="glass-card rounded-3xl p-6 border border-black/5 dark:border-white/10 flex flex-col justify-between hover:-translate-y-1 hover:shadow-lg h-full cursor-pointer"
              >
                <div className="space-y-4">
                  {/* Board Badge & Age limit info */}
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase border tracking-wider ${getBoardColor(exam.examBoard)}`}>
                      {exam.examBoard}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-zinc-550 font-semibold font-mono">
                      Age: {exam.generalMinAge}-{exam.generalMaxAge}
                    </span>
                  </div>

                  {/* Exam Name */}
                  <h3 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                    {exam.examName}
                  </h3>

                  {/* Quick specs preview */}
                  <div className="grid grid-cols-2 gap-3 pt-2 text-[10px] text-slate-500 dark:text-zinc-500 font-medium">
                    <div>
                      <span className="block text-slate-400 dark:text-zinc-650 font-bold uppercase tracking-wider mb-0.5">Photo</span>
                      <span className="font-mono text-slate-800 dark:text-zinc-350">{exam.photoDimensions} ({exam.photoMaxKb}KB)</span>
                    </div>
                    <div>
                      <span className="block text-slate-400 dark:text-zinc-650 font-bold uppercase tracking-wider mb-0.5">Signature</span>
                      <span className="font-mono text-slate-800 dark:text-zinc-350">{exam.signatureDimensions} ({exam.signatureMaxKb}KB)</span>
                    </div>
                  </div>
                </div>

                {/* Action Button (Visual only since entire card is wrapped in a Link) */}
                <div className="pt-6 border-t border-black/5 dark:border-white/5 mt-6">
                  <div
                    className="w-full inline-flex items-center justify-center space-x-2 rounded-xl bg-indigo-650 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-semibold py-2.5 px-4 text-xs transition-all duration-200"
                  >
                    <span>Use Tool</span>
                    <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </AnimatePresence>

        {filteredExams.length === 0 && (
          <div className="col-span-full py-16 text-center text-slate-500 dark:text-zinc-500 glass-card rounded-3xl p-8 border border-black/5 dark:border-white/10">
            <Shield className="mx-auto h-8 w-8 text-indigo-500/30 mb-3" />
            <h3 className="font-bold text-slate-900 dark:text-white text-base">No exams found</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">Try adjusting your search query or board filter.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
