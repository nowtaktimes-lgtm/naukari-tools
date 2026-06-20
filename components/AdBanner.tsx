"use client";

import React, { useEffect } from "react";

export default function AdBanner() {
  const adPublisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;

  useEffect(() => {
    // Inject MoneTag Ad Script (zone: 11177455)
    const scriptId = "monetag-inpage-ad";
    const existingScript = document.getElementById(scriptId);

    if (!existingScript) {
      try {
        const script = document.createElement("script");
        script.id = scriptId;
        script.src = "https://nap5k.com/tag.min.js";
        script.dataset.zone = "11177455";
        
        // Append script to document body or root html element
        const target = [document.documentElement, document.body].filter(Boolean).pop();
        if (target) {
          target.appendChild(script);
        }
      } catch (err) {
        console.error("Failed to load MoneTag In-Page ad script:", err);
      }
    }
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto my-6 px-4">
      <div className="glass-card rounded-2xl p-4 border border-white/5 bg-white/[0.01] flex flex-col items-center justify-center min-h-[90px] relative overflow-hidden">
        {/* Sponsored tag overlay */}
        <span className="absolute top-2 right-3 text-[9px] font-bold uppercase tracking-wider text-zinc-500 bg-zinc-950 px-1.5 py-0.5 rounded border border-white/5">
          Sponsored
        </span>

        {adPublisherId ? (
          // Injected Ad block placeholder
          <div className="text-center text-xs text-zinc-500 font-mono tracking-wide">
            AdUnit Slot: (ca-pub-{adPublisherId})
          </div>
        ) : (
          // Dynamic supportive message matching Vercel theme
          <div className="text-center space-y-1">
            <div className="text-xs font-semibold text-zinc-450">Naukari Tools Core Free Utilities</div>
            <p className="text-[10px] text-zinc-550">Processed locally in-browser. Clean. Ad-free. Privacy guaranteed.</p>
          </div>
        )}
      </div>
    </div>
  );
}

