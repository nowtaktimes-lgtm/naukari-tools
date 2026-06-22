import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { toolsList, routes } from "@/config/routes";
import examsData from "@/data/exams.json";
import { ExamSEODB } from "@/types/exam";
import dynamic from "next/dynamic";

const AgeCalculator = dynamic(() => import("@/components/AgeCalculator"), {
  loading: () => <div className="animate-pulse h-96 bg-slate-100 dark:bg-zinc-900 rounded-3xl" />,
  ssr: false,
});
const ClientImageResizer = dynamic(() => import("@/components/ClientImageResizer"), {
  loading: () => <div className="animate-pulse h-[500px] bg-slate-100 dark:bg-zinc-900 rounded-3xl" />,
  ssr: false,
});
const DocumentCompressor = dynamic(() => import("@/components/DocumentCompressor"), {
  loading: () => <div className="animate-pulse h-96 bg-slate-100 dark:bg-zinc-900 rounded-3xl" />,
  ssr: false,
});
const SalaryEstimator = dynamic(() => import("@/components/SalaryEstimator"), {
  loading: () => <div className="animate-pulse h-96 bg-slate-100 dark:bg-zinc-900 rounded-3xl" />,
  ssr: false,
});
const EligibilityEvaluator = dynamic(() => import("@/components/EligibilityEvaluator"), {
  loading: () => <div className="animate-pulse h-96 bg-slate-100 dark:bg-zinc-900 rounded-3xl" />,
  ssr: false,
});
const SyllabusTracker = dynamic(() => import("@/components/SyllabusTracker"), {
  loading: () => <div className="animate-pulse h-96 bg-slate-100 dark:bg-zinc-900 rounded-3xl" />,
  ssr: false,
});

import TrustBadges from "@/components/TrustBadges";
import SemanticSEOText from "@/components/SemanticSEOText";
import AdBanner from "@/components/AdBanner";
import RatingWidget from "@/components/RatingWidget";
import FAQSection from "@/components/FAQSection";
import { ArrowLeft, AlertTriangle, Link2, ChevronRight, Award } from "lucide-react";

interface Props {
  params: {
    slug: string;
  };
}

// Generate static params for all dynamic tool and exam paths at build time
export async function generateStaticParams() {
  const toolSlugs = toolsList.map((t) => ({ slug: t.slug }));
  const examSlugs = (examsData as ExamSEODB[]).map((e) => ({ slug: e.slug }));
  return [...toolSlugs, ...examSlugs];
}

// Programmatic SEO Metadata & Google Discover Robots Tags
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tool = toolsList.find((t) => t.slug === params.slug);
  const exam = (examsData as ExamSEODB[]).find((e) => e.slug === params.slug);

  function formatExamNameForTitle(name: string): string {
    // Suffix: " Photo Resizer & Age Check (Strict Rules)" is 41 characters
    // Max length for exam name: 59 - 41 = 18 characters.
    const maxLen = 18;
    let formatted = name;
    const abbreviations: Record<string, string> = {
      "Rajasthan Eligibility Examination for Teachers": "REET Exam",
      "Central Teacher Eligibility Test": "CTET Exam",
      "UPSC National Defence Academy": "UPSC NDA",
      "UPSC Combined Defence Services": "UPSC CDS",
      "SSC Central Police Organization": "SSC CPO",
      "Air Force Common Admission Test": "AFCAT",
      "SBI Junior Associates": "SBI JA",
      "RBI Grade B Officer": "RBI Grade B",
      "LIC Apprentice Development Officer": "LIC ADO",
      "LIC Assistant Administrative Officer": "LIC AAO",
      "NIACL Administrative Officer": "NIACL AO",
      "UP Teacher Eligibility Test": "UPTET Exam",
      "Haryana Teacher Eligibility Test": "HTET Exam",
      "Rajasthan Administrative Service": "RAS Exam",
      "Provincial Civil Services": "PCS Exam",
      "Combined Competitive Exam": "CCE Exam",
      "KVS Primary Teacher": "KVS PRT",
      "KVS Post Graduate Teacher": "KVS PGT",
      "NVS Trained Graduate Teacher": "NVS TGT",
      "DSSSB Primary Teacher": "DSSSB PRT",
      "DSSSB Trained Graduate Teacher": "DSSSB TGT",
    };

    for (const [key, value] of Object.entries(abbreviations)) {
      if (formatted.includes(key)) {
        formatted = formatted.replace(key, value);
      }
    }

    if (formatted.length > maxLen) {
      formatted = formatted.substring(0, maxLen - 3) + "...";
    }
    return formatted;
  }

  function formatExamNameForDescription(name: string): string {
    // Suffix/prefix static parts:
    // "Prevent form rejection! Auto-resize " (36)
    // " photo to strict 50KB & check age eligibility. 100% Free & Zero Server Uploads." (79)
    // Total static: 115.
    // We need the middle part to be between 25 and 40 characters: 140 <= 115 + L <= 155 => 25 <= L <= 40.
    let formatted = name;

    if (formatted.length < 25) {
      const expansions = [
        " recruitment exam",
        " official application",
        " recruitment portal",
        " online form",
      ];
      for (const exp of expansions) {
        if (formatted.length + exp.length <= 40) {
          formatted += exp;
        }
        if (formatted.length >= 25 && formatted.length <= 40) {
          break;
        }
      }
      while (formatted.length < 25) {
        formatted += " exam";
      }
    } else if (formatted.length > 40) {
      formatted = formatted.substring(0, 37) + "...";
    }
    return formatted;
  }

  if (tool) {
    return {
      title: `${tool.name}`,
      description: tool.description,
      metadataBase: new URL("https://naukaritools.in"),
      robots: {
        index: true,
        follow: true,
        "max-image-preview": "large",
      },
    };
  }

  if (exam) {
    const titleName = formatExamNameForTitle(exam.examName);
    const descName = formatExamNameForDescription(exam.examName);

    return {
      title: {
        absolute: `${titleName} Photo Resizer & Age Check (Strict Rules)`,
      },
      description: `Prevent form rejection! Auto-resize ${descName} photo to strict 50KB & check age eligibility. 100% Free & Zero Server Uploads.`,
      metadataBase: new URL("https://naukaritools.in"),
      robots: {
        index: true,
        follow: true,
        "max-image-preview": "large",
      },
      openGraph: {
        title: `${titleName} Photo Resizer & Age Check (Strict Rules)`,
        description: `Prevent form rejection! Auto-resize ${descName} photo to strict 50KB & check age eligibility. 100% Free & Zero Server Uploads.`,
        images: [
          {
            url: `/og-image-cover.jpg`, // High-res cover image URL
            width: 1200,
            height: 630,
            alt: `${exam.examName} specifications`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${titleName} Photo Resizer & Age Check (Strict Rules)`,
        description: `Prevent form rejection! Auto-resize ${descName} photo to strict 50KB & check age eligibility. 100% Free & Zero Server Uploads.`,
        images: [`/og-image-cover.jpg`],
      },
    };
  }

  return {
    title: {
      absolute: "Government Exam Form Resizer | Prevent Rejection",
    },
    description: "Prevent form rejection! Auto-resize your exam photos and check exact age eligibility according to official notification rules. 100% Free.",
  };
}

export default function ToolPage({ params }: Props) {
  const tool = toolsList.find((t) => t.slug === params.slug);
  const exam = (examsData as ExamSEODB[]).find((e) => e.slug === params.slug);

  // Related Exams calculation
  const exams = examsData as ExamSEODB[];
  let relatedExams: ExamSEODB[] = [];
  if (exam) {
    relatedExams = exams
      .filter((e) => e.slug !== exam.slug && e.examBoard === exam.examBoard)
      .slice(0, 5);

    if (relatedExams.length < 5) {
      const additional = exams
        .filter((e) => e.slug !== exam.slug && e.examBoard !== exam.examBoard && !relatedExams.some((re) => re.slug === e.slug))
        .slice(0, 5 - relatedExams.length);
      relatedExams.push(...additional);
    }
  }

  // Time-lock validation logic
  const today = new Date("2026-06-15T00:00:00+05:30"); // Reference base system date
  const isExam = !!exam;
  const isLocked = isExam && today < new Date(exam.releaseDate);
  const exists = !!tool || (isExam && !isLocked);

  // Helper render function for related exams
  const renderRelatedExams = () => {
    if (relatedExams.length === 0) return null;
    return (
      <div className="space-y-6 border-t border-black/5 dark:border-white/5 pt-10 mt-6">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center space-x-2">
            <Award className="h-5 w-5 text-indigo-650 dark:text-indigo-400" />
            <span>Verify Eligibility & Resize Photos for Other Exams</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            Access custom resizers, cutoff settings, and relaxations for other upcoming notifications.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {relatedExams.map((re) => (
            <Link
              key={re.slug}
              href={`/tools/${re.slug}`}
              className="glass-card rounded-2xl p-4 border border-black/5 dark:border-white/10 hover:border-indigo-500/30 flex flex-col justify-between space-y-4 hover:-translate-y-0.5 group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-[9px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                    {re.examBoard}
                  </span>
                  <span className="text-[9px] text-slate-400 dark:text-zinc-550 font-mono font-semibold">
                    {re.generalMinAge}-{re.generalMaxAge} Yrs
                  </span>
                </div>
                <h3 className="text-xs font-bold text-slate-800 dark:text-zinc-200 group-hover:text-indigo-650 dark:group-hover:text-indigo-400 transition-colors leading-tight line-clamp-2">
                  {re.examName}
                </h3>
              </div>
              <div className="flex items-center space-x-1 text-[10px] font-semibold text-slate-400 group-hover:text-indigo-650 dark:group-hover:text-indigo-400 transition-colors pt-2 border-t border-black/5 dark:border-white/5">
                <span>Open Tool</span>
                <ChevronRight className="h-3 w-3 transform group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  };

  // If locked or doesn't exist, load fallback banner and render custom master resizer
  if (!exists) {
    const releaseDateStr = exam?.releaseDate || "a future date";
    return (
      <div className="max-w-7xl mx-auto space-y-8 py-8 px-4">
        {/* Back Link */}
        <Link href={routes.home} className="inline-flex items-center space-x-2 text-xs text-slate-500 hover:text-slate-900 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors group">
          <ArrowLeft className="h-3.5 w-3.5 transform group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Utility Hub</span>
        </Link>

        {/* Fallback Glassmorphic Banner */}
        <div className="glass-card rounded-3xl p-8 border border-amber-500/20 bg-amber-500/5 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_0_30px_rgba(245,158,11,0.05)]">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">Scheduled Resource</h3>
              <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
                This exam page is scheduled for release on <strong className="text-amber-600 dark:text-amber-400">{releaseDateStr}</strong>! Meanwhile, please use our Custom Master Resizer below.
              </p>
            </div>
          </div>
        </div>

        {/* Ad Banner 1 */}
        <AdBanner />

        {/* Bento Grid containing Custom Master Resizer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <ClientImageResizer defaultExamSlug={exam?.slug} />
          </div>
          <div>
            <AgeCalculator defaultExamSlug={exam?.slug} />
          </div>
        </div>

        {/* Trust Badges Banner */}
        <TrustBadges layout="horizontal" />

        {/* Related Exams section */}
        {renderRelatedExams()}

        {/* Dynamic SEO text & disclaimers */}
        <SemanticSEOText exam={null} />
        <FAQSection exam={exam || null} />
        <RatingWidget 
          name={exam ? `${exam.examName} Photo Resizer and Age Calculator` : "Government Exam Form Resizer"} 
          pageType="SoftwareApplication" 
          description={exam ? `Official ${exam.examBoard} photo and signature maker for ${exam.examName}.` : "Prevent form rejection! Auto-resize your exam photos and check exact age eligibility."} 
        />

        {/* Ad Banner 2 */}
        <AdBanner />
      </div>
    );
  }

  // --- RENDER REGULAR ACTIVE EXAMS OR TOOLS ---
  // If it's a specific tool slug, we render that tool's standard detail page layout
  if (tool) {
    return (
      <div className="max-w-7xl mx-auto space-y-8 py-8 px-4">
        <Link href={routes.home} className="inline-flex items-center space-x-2 text-xs text-slate-500 hover:text-slate-900 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors group">
          <ArrowLeft className="h-3.5 w-3.5 transform group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Utility Hub</span>
        </Link>

        <div className="border-b border-black/5 dark:border-white/5 pb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">{tool.name}</h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-2">{tool.description}</p>
        </div>

        {/* Ad Banner 1 */}
        <AdBanner />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            {tool.slug === "age-calculator" ? <AgeCalculator /> :
             tool.slug === "photo-resizer" ? <ClientImageResizer /> :
             tool.slug === "photo-resizer-in-kb" ? <ClientImageResizer defaultResizeMode="photo" /> :
             tool.slug === "ssc-signature-compressor-20kb" ? <ClientImageResizer defaultExamSlug="ssc-cgl-2026" defaultResizeMode="signature" /> :
             tool.slug === "rrb-signature-resizer-10kb" ? <ClientImageResizer defaultExamSlug="rrb-ntpc" defaultResizeMode="signature" /> :
             tool.slug === "document-compressor" ? <DocumentCompressor /> : 
             tool.slug === "salary-calculator" ? <SalaryEstimator /> :
             tool.slug === "eligibility-checker" ? <EligibilityEvaluator /> :
             tool.slug === "syllabus-tracker" ? <SyllabusTracker /> :
             <div className="glass-card rounded-3xl p-8 text-center text-slate-500 dark:text-zinc-400">
               Workspace Active
             </div>}
          </div>
          <div className="space-y-6">
            {/* Other Useful Tools Widget */}
            <div className="glass-card rounded-3xl p-6 border border-black/5 dark:border-white/10 space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
                <Link2 className="h-4 w-4 text-indigo-650 dark:text-indigo-400" />
                <span>Other Useful Tools</span>
              </h3>
              <div className="space-y-2">
                {toolsList
                  .filter((t) => t.slug !== tool.slug)
                  .map((t) => (
                    <Link
                      key={t.slug}
                      href={t.path}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-100/50 dark:hover:bg-zinc-900/40 border border-transparent hover:border-black/5 dark:hover:border-white/5 transition-all text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:text-indigo-650 dark:hover:text-indigo-400 group"
                    >
                      <span>{t.name}</span>
                      <ChevronRight className="h-3.5 w-3.5 transform group-hover:translate-x-0.5 transition-transform text-slate-400" />
                    </Link>
                  ))}
              </div>
            </div>

            {/* Exam Directory Cross-Link Card */}
            <div className="glass-card rounded-3xl p-6 border border-black/5 dark:border-white/10 bg-indigo-500/5 dark:bg-indigo-500/2 space-y-3">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
                <Award className="h-4 w-4 text-indigo-650 dark:text-indigo-400" />
                <span>Exam Specific Rules?</span>
              </h4>
              <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                Check matching age relaxation rules and photo guidelines for all Central and State government recruitment exams.
              </p>
              <Link
                href={routes.exams}
                className="w-full inline-flex items-center justify-center space-x-1.5 rounded-xl bg-indigo-650 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-semibold py-2.5 px-4 text-xs transition-all duration-200"
              >
                <span>Browse Exam Directory</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <TrustBadges layout="vertical" />
          </div>
        </div>
        <SemanticSEOText exam={null} />
        <FAQSection tool={tool} />
        <RatingWidget name={tool.name} pageType="SoftwareApplication" description={tool.description} />

        {/* Ad Banner 2 */}
        <AdBanner />
      </div>
    );
  }

  if (!exam) {
    notFound();
  }

  // Render pre-populated Active Exam Dashboard
  return (
    <div className="max-w-7xl mx-auto space-y-8 py-8 px-4">

      {/* Back button */}
      <Link href={routes.home} className="inline-flex items-center space-x-2 text-xs text-slate-500 hover:text-slate-900 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors group">
        <ArrowLeft className="h-3.5 w-3.5 transform group-hover:-translate-x-0.5 transition-transform" />
        <span>Back to Utility Hub</span>
      </Link>

      {/* Exam Header */}
      <div className="border-b border-black/5 dark:border-white/5 pb-6">
        <div className="flex items-center space-x-2 text-xs text-indigo-600 dark:text-indigo-400 font-semibold uppercase tracking-wider mb-2">
          <span>{exam.examBoard} Exam Matrix</span>
          <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-zinc-700" />
          <span className="text-slate-500 dark:text-zinc-550 lowercase font-mono">active since: {exam.releaseDate}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white glow-text">
          {exam.examName} Verification Hub
        </h1>
        <p className="text-sm text-slate-500 dark:text-zinc-400 mt-2 max-w-3xl">
          Complete eligibility checks and format photo upload templates matching the official {exam.examName} specification criteria.
        </p>
      </div>

      {/* Ad Banner 1 */}
      <AdBanner />

      {/* Bento Box Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Age Calculator */}
        <div className="md:col-span-2">
          <AgeCalculator defaultCutoffDate={exam.releaseDate} defaultExamSlug={exam.slug} />
        </div>

        {/* Right Column: Resizer */}
        <div>
          <ClientImageResizer defaultExamSlug={exam.slug} />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <DocumentCompressor />
        </div>
        <div>
          <TrustBadges layout="vertical" />
        </div>
      </div>

      {/* Related Exams section */}
      {renderRelatedExams()}

      {/* Semantic SEO Text Panel */}
      <SemanticSEOText exam={exam} />
      <FAQSection exam={exam} />
      <RatingWidget name={`${exam.examName} Photo Resizer and Age Calculator`} pageType="SoftwareApplication" description={`Official ${exam.examBoard} photo and signature maker for ${exam.examName}.`} />

      {/* Ad Banner 2 */}
      <AdBanner />
    </div>
  );
}
