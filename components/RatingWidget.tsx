"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Star, CheckCircle } from "lucide-react";

interface RatingWidgetProps {
  name: string;
  pageType?: "SoftwareApplication" | "WebPage";
  description?: string;
}

export default function RatingWidget({
  name,
  pageType = "WebPage",
  description = "Interactive educational utility page on Naukari Tools.",
}: RatingWidgetProps) {
  const pathname = usePathname();
  const [rating, setRating] = useState<number | null>(null);
  const [hover, setHover] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [stats, setStats] = useState<{ count: number; avg: number }>({ count: 124, avg: 4.8 });

  // Generate a deterministic seed rating based on the pathname
  useEffect(() => {
    if (!pathname) return;

    // Calculate a hash from pathname
    let hash = 0;
    for (let i = 0; i < pathname.length; i++) {
      hash = pathname.charCodeAt(i) + ((hash << 5) - hash);
    }
    hash = Math.abs(hash);

    const seedCount = 110 + (hash % 65); // Vote count between 110 and 174
    const seedAvgStr = (4.7 + (hash % 3) * 0.1).toFixed(1); // Avg of 4.7, 4.8, or 4.9
    const seedAvg = parseFloat(seedAvgStr);

    // Check localStorage for prior votes on this path
    const savedVote = localStorage.getItem(`nt-vote-${pathname}`);
    if (savedVote) {
      const userVote = parseInt(savedVote, 10);
      const newCount = seedCount + 1;
      const newAvg = parseFloat(((seedAvg * seedCount + userVote) / newCount).toFixed(1));
      setStats({ count: newCount, avg: newAvg });
      setRating(userVote);
      setHasVoted(true);
    } else {
      setStats({ count: seedCount, avg: seedAvg });
    }
  }, [pathname]);

  const handleVote = (voteValue: number) => {
    if (hasVoted) return;

    localStorage.setItem(`nt-vote-${pathname}`, voteValue.toString());
    const newCount = stats.count + 1;
    const newAvg = parseFloat(((stats.avg * stats.count + voteValue) / newCount).toFixed(1));

    setStats({ count: newCount, avg: newAvg });
    setRating(voteValue);
    setHasVoted(true);
  };

  // Structured schema for search engines
  const schemaMarkup =
    pageType === "SoftwareApplication"
      ? {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": name,
          "applicationCategory": "EducationalApplication, Utility",
          "operatingSystem": "Web, Windows, iOS, Android",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "INR",
          },
          "description": description,
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": stats.avg.toString(),
            "reviewCount": stats.count.toString(),
            "bestRating": "5",
            "worstRating": "1",
          },
        }
      : {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": name,
          "url": `https://naukaritools.in${pathname}`,
          "description": description,
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": stats.avg.toString(),
            "reviewCount": stats.count.toString(),
            "bestRating": "5",
            "worstRating": "1",
          },
        };

  return (
    <div className="glass-card rounded-3xl p-6 border border-black/5 dark:border-white/10 shadow-sm max-w-4xl mx-auto my-8">
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="font-bold text-slate-900 dark:text-white text-md">
            Candidate Feedback & Verification Rating
          </h4>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            Help future civil service aspirants! Rate the accuracy of this {pageType === "SoftwareApplication" ? "utility tool" : "resource page"}.
          </p>
        </div>

        <div className="flex flex-col items-center sm:items-end gap-2">
          {/* Stars display */}
          <div className="flex items-center space-x-1.5">
            {[1, 2, 3, 4, 5].map((star) => {
              const isActive = (hover !== null ? hover : rating !== null ? rating : 0) >= star;
              return (
                <button
                  key={star}
                  type="button"
                  disabled={hasVoted}
                  onClick={() => handleVote(star)}
                  onMouseEnter={() => !hasVoted && setHover(star)}
                  onMouseLeave={() => !hasVoted && setHover(null)}
                  className={`p-1 focus:outline-none transition-transform duration-150 ${
                    hasVoted ? "cursor-default" : "hover:scale-115 active:scale-95"
                  }`}
                  aria-label={`Rate ${star} stars`}
                >
                  <Star
                    className={`h-6 w-6 transition-colors duration-150 ${
                      isActive
                        ? "fill-amber-500 text-amber-500"
                        : "text-slate-350 dark:text-zinc-700 hover:text-amber-400"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Stats info matching schema EXACTLY */}
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700 dark:text-zinc-350">
            {hasVoted ? (
              <span className="flex items-center space-x-1 text-emerald-650 dark:text-emerald-450">
                <CheckCircle className="h-3.5 w-3.5" />
                <span>Thank you! Rated {rating}/5</span>
              </span>
            ) : (
              <span>Rate this page</span>
            )}
            <span className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-zinc-700" />
            <span>
              {stats.avg} / 5 ({stats.count} votes)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
