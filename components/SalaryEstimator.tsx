"use client";

import React, { useState, useEffect } from "react";
import { Coins, HelpCircle, ShieldCheck } from "lucide-react";

interface PayLevel {
  level: string;
  basicPay: number;
  gradePay?: number;
}

const payMatrix: PayLevel[] = [
  { level: "L1", basicPay: 18000 },
  { level: "L2", basicPay: 19900 },
  { level: "L3", basicPay: 21700 },
  { level: "L4", basicPay: 25500 },
  { level: "L5", basicPay: 29200 },
  { level: "L6", basicPay: 35400 },
  { level: "L7", basicPay: 44900 },
  { level: "L8", basicPay: 47600 },
  { level: "L9", basicPay: 53100 },
  { level: "L10", basicPay: 56100 },
];

export default function SalaryEstimator() {
  const [selectedLevel, setSelectedLevel] = useState("L7");
  const [cityClass, setCityClass] = useState("Y"); // X, Y, Z
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from LocalStorage
  useEffect(() => {
    const savedLevel = localStorage.getItem("salary_level");
    const savedCity = localStorage.getItem("salary_city");
    if (savedLevel) setSelectedLevel(savedLevel);
    if (savedCity) setCityClass(savedCity);
    setIsHydrated(true);
  }, []);

  // Save to LocalStorage
  const handleLevelChange = (val: string) => {
    setSelectedLevel(val);
    localStorage.setItem("salary_level", val);
  };

  const handleCityChange = (val: string) => {
    setCityClass(val);
    localStorage.setItem("salary_city", val);
  };

  const currentMatrix = payMatrix.find((p) => p.level === selectedLevel) || payMatrix[6];
  const basicPay = currentMatrix.basicPay;

  // Dearness Allowance (DA) - Current Central Govt rate ~50%
  const daRate = 0.50;
  const da = Math.round(basicPay * daRate);

  // HRA Rates (X: 30%, Y: 20%, Z: 10%) - Minimum HRA applies
  let hraRate = 0.10;
  let minHra = 1800;
  if (cityClass === "X") {
    hraRate = 0.30;
    minHra = 5400;
  } else if (cityClass === "Y") {
    hraRate = 0.20;
    minHra = 3600;
  }
  const hra = Math.max(minHra, Math.round(basicPay * hraRate));

  // Transport Allowance (TA) - realistic 7th Pay rules
  let baseTa = 1800;
  const levelNum = parseInt(selectedLevel.replace("L", ""), 10);
  if (cityClass === "X") {
    if (levelNum >= 9) baseTa = 7200;
    else if (levelNum >= 3) baseTa = 3600;
    else baseTa = 1350;
  } else {
    if (levelNum >= 9) baseTa = 3600;
    else if (levelNum >= 3) baseTa = 1800;
    else baseTa = 900;
  }
  // TA includes DA component under standard central rules
  const ta = Math.round(baseTa + (baseTa * daRate));

  // Allowances & Gross
  const grossPay = basicPay + da + hra + ta;

  // Deductions
  // NPS = 10% of (Basic + DA)
  const nps = Math.round((basicPay + da) * 0.10);
  const cghs = levelNum >= 7 ? 650 : levelNum >= 4 ? 450 : 250;
  const cgegis = levelNum >= 8 ? 120 : levelNum >= 5 ? 60 : 30;
  const totalDeductions = nps + cghs + cgegis;

  // Net monthly in-hand salary
  const netPay = grossPay - totalDeductions;

  if (!isHydrated) {
    return (
      <div className="glass-card rounded-3xl p-8 text-center text-zinc-500 animate-pulse">
        Loading Estimator Engine...
      </div>
    );
  }

  return (
    <div className="glass-card rounded-3xl p-6 md:p-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/5 rounded-full blur-3xl -z-10" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-black/5 dark:border-white/5">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 text-indigo-600 dark:text-indigo-400">
            <Coins className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-semibold text-lg text-slate-900 dark:text-white">7th Pay commission Estimator</h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400">Estimate gross salary, deductions, and allowances locally</p>
          </div>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
          <ShieldCheck className="h-3 w-3" />
          <span>Local Engine</span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left Column: Form Settings */}
        <div className="space-y-6">
          {/* Pay Matrix Level Selection */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
              <span>Pay Matrix level</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-mono">Basic: ₹{basicPay.toLocaleString()}</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {payMatrix.map((item) => (
                <button
                  key={item.level}
                  onClick={() => handleLevelChange(item.level)}
                  className={`py-2 text-xs font-semibold rounded-lg transition-all border ${
                    selectedLevel === item.level
                      ? "bg-indigo-600 border-indigo-500 text-white shadow-[0_0_12px_rgba(99,102,241,0.3)]"
                      : "bg-slate-100 hover:bg-slate-200 dark:bg-zinc-950/40 border-black/5 dark:border-white/5 text-slate-650 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white dark:hover:bg-zinc-900/60"
                  }`}
                >
                  {item.level}
                </button>
              ))}
            </div>
          </div>

          {/* City Class Selection */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
              <span>HRA City Class</span>
              <div className="group relative cursor-pointer text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300">
                <HelpCircle className="h-3.5 w-3.5" />
                <span className="absolute bottom-6 right-0 w-64 p-2 bg-white dark:bg-zinc-950 border border-black/10 dark:border-white/10 rounded-lg text-[9px] lowercase leading-relaxed hidden group-hover:block z-20 text-slate-600 dark:text-zinc-400 shadow-md">
                  - Class X: Metro cities (HRA 30%, Min ₹5400)
                  <br />- Class Y: Tier-2 cities (HRA 20%, Min ₹3600)
                  <br />- Class Z: Rest of India (HRA 10%, Min ₹1800)
                </span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 bg-slate-100/50 dark:bg-zinc-950/40 border border-black/5 dark:border-white/5 p-1 rounded-xl">
              {["X", "Y", "Z"].map((tier) => (
                <button
                  key={tier}
                  onClick={() => handleCityChange(tier)}
                  className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                    cityClass === tier
                      ? "bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/10 text-slate-800 dark:text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-700 dark:text-zinc-500 dark:hover:text-zinc-300"
                  }`}
                >
                  City Class {tier}
                </button>
              ))}
            </div>
          </div>

          {/* Calculations Rules Notice */}
          <div className="p-3.5 rounded-2xl bg-slate-100/50 dark:bg-white/[0.01] border border-black/5 dark:border-white/5 text-[11px] text-slate-500 dark:text-zinc-500 leading-relaxed space-y-1">
            <div className="font-semibold text-slate-600 dark:text-zinc-400 flex items-center space-x-1.5 mb-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
              <span>Dearness Allowance (DA) Note</span>
            </div>
            Calculations are configured using the active central rate of <strong className="text-slate-700 dark:text-zinc-300">50% DA</strong>. HRA guarantees the mandatory minimum floor values for all classes.
          </div>
        </div>

        {/* Right Column: Calculations breakdown */}
        <div className="space-y-4">
          <div className="bg-slate-100/30 dark:bg-zinc-950/60 border border-black/5 dark:border-white/5 rounded-2xl p-5 space-y-4">
            <div className="flex justify-between items-center text-xs text-slate-650 dark:text-zinc-400 font-medium pb-2 border-b border-black/5 dark:border-white/5">
              <span>Earnings Component</span>
              <span>Amount (Monthly)</span>
            </div>

            <div className="space-y-2.5 text-xs text-slate-800 dark:text-zinc-300">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-zinc-500 font-medium">Basic Pay</span>
                <span className="font-mono">₹{basicPay.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-zinc-500 font-medium">Dearness Allowance (DA)</span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400">+ ₹{da.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-zinc-500 font-medium">House Rent Allowance (HRA)</span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400">+ ₹{hra.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-zinc-500 font-medium">Transport Allowance (TA)</span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400">+ ₹{ta.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pt-2.5 border-t border-black/5 dark:border-white/5 font-semibold text-slate-900 dark:text-white">
                <span>Gross Monthly Salary</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400">₹{grossPay.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-100/30 dark:bg-zinc-950/60 border border-black/5 dark:border-white/5 rounded-2xl p-5 space-y-3.5">
            <div className="flex justify-between items-center text-xs text-slate-650 dark:text-zinc-400 font-medium pb-1">
              <span>Statutory Deductions</span>
              <span className="text-rose-600 dark:text-rose-400 font-mono">- ₹{totalDeductions.toLocaleString()}</span>
            </div>
            <div className="space-y-2 text-[11px] text-slate-550 dark:text-zinc-405">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-zinc-600">NPS contribution (10% Basic + DA)</span>
                <span className="font-mono text-slate-800 dark:text-zinc-350">₹{nps.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-zinc-600">Central Health Scheme (CGHS)</span>
                <span className="font-mono text-slate-800 dark:text-zinc-350">₹{cghs.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-zinc-600">Group Insurance (CGEGIS)</span>
                <span className="font-mono text-slate-800 dark:text-zinc-350">₹{cgegis.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* NET IN HAND IN-HAND BANNER */}
          <div className="bg-indigo-50 dark:bg-indigo-600/10 border border-indigo-200 dark:border-indigo-500/20 rounded-2xl p-4 flex items-center justify-between shadow-[0_0_15px_rgba(99,102,241,0.05)]">
            <div>
              <div className="text-[10px] font-bold text-indigo-600 dark:text-indigo-300 uppercase tracking-wider">Est. Monthly In-Hand Pay</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight font-mono mt-0.5">
                ₹{netPay.toLocaleString()}
              </div>
            </div>
            <div className="h-10 w-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/20 font-bold text-sm">
              NET
            </div>
        </div>
      </div>
    </div>
  </div>
);
}
