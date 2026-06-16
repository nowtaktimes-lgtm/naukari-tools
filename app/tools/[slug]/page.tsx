import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { toolsList, routes } from "@/config/routes";
import examsData from "@/data/exams.json";
import { ExamSEODB } from "@/types/exam";
import AgeCalculator from "@/components/AgeCalculator";
import ClientImageResizer from "@/components/ClientImageResizer";
import DocumentCompressor from "@/components/DocumentCompressor";
import SalaryEstimator from "@/components/SalaryEstimator";
import EligibilityEvaluator from "@/components/EligibilityEvaluator";
import SyllabusTracker from "@/components/SyllabusTracker";
import TrustBadges from "@/components/TrustBadges";
import SemanticSEOText from "@/components/SemanticSEOText";
import AdBanner from "@/components/AdBanner";
import { ArrowLeft, AlertTriangle } from "lucide-react";

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

  if (tool) {
    return {
      title: `${tool.name} | Naukari Tools`,
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
    const today = new Date("2026-06-15T00:00:00+05:30"); // Base reference system date
    const release = new Date(exam.releaseDate);
    const isLocked = today < release;

    if (isLocked) {
      return {
        title: `Scheduled Release - ${exam.examName} | Naukari Tools`,
        description: `The eligibility dashboard for ${exam.examName} is scheduled for release on ${exam.releaseDate}.`,
        robots: {
          index: false,
          follow: true,
        },
      };
    }

    return {
      title: `${exam.examName} Photo Resizer & Age Calculator - ${exam.photoMaxKb}KB`,
      description: `Official ${exam.examBoard} ${exam.examName} photo and signature maker. Auto-resize to ${exam.photoDimensions} under ${exam.photoMaxKb}KB.`,
      metadataBase: new URL("https://naukaritools.in"),
      robots: {
        index: true,
        follow: true,
        "max-image-preview": "large",
      },
      openGraph: {
        title: `${exam.examName} Photo Resizer & Age Calculator - ${exam.photoMaxKb}KB`,
        description: `Official ${exam.examBoard} ${exam.examName} photo and signature maker. Auto-resize to ${exam.photoDimensions} under ${exam.photoMaxKb}KB.`,
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
        title: `${exam.examName} Photo Resizer & Age Calculator - ${exam.photoMaxKb}KB`,
        description: `Official ${exam.examBoard} ${exam.examName} photo and signature maker. Auto-resize to ${exam.photoDimensions} under ${exam.photoMaxKb}KB.`,
        images: [`/og-image-cover.jpg`],
      },
    };
  }

  return {
    title: "Government Job Utility Hub | Naukari Tools",
    description: "Access verified calculators and photo resizers.",
  };
}

export default function ToolPage({ params }: Props) {
  const tool = toolsList.find((t) => t.slug === params.slug);
  const exam = (examsData as ExamSEODB[]).find((e) => e.slug === params.slug);

  // Time-lock validation logic
  const today = new Date("2026-06-15T00:00:00+05:30"); // Reference base system date
  const isExam = !!exam;
  const isLocked = isExam && today < new Date(exam.releaseDate);
  const exists = !!tool || (isExam && !isLocked);

  // JSON-LD Schema Script (SoftwareApplication type)
  const jsonLd = exam ? {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": `${exam.examName} Photo Resizer and Age Calculator`,
    "applicationCategory": "EducationalApplication, Utility",
    "operatingSystem": "Web, Windows, iOS, Android",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR"
    },
    "description": `Official ${exam.examBoard} photo and signature maker for ${exam.examName}.`
  } : tool ? {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": `${tool.name} Photo Resizer and Age Calculator`,
    "applicationCategory": "EducationalApplication, Utility",
    "operatingSystem": "Web, Windows, iOS, Android",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR"
    },
    "description": tool.description
  } : null;

  // If locked or doesn't exist, load fallback banner and render custom master resizer
  if (!exists) {
    const releaseDateStr = exam?.releaseDate || "a future date";
    return (
      <div className="max-w-7xl mx-auto space-y-8 py-8 px-4">
        {jsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        )}
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
          <div className="space-y-6">
            <AgeCalculator defaultExamSlug={exam?.slug} />
            <TrustBadges layout="vertical" />
          </div>
        </div>

        {/* Dynamic SEO text & disclaimers */}
        <SemanticSEOText exam={null} />

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
        {jsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        )}
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
             tool.slug === "document-compressor" ? <DocumentCompressor /> : 
             tool.slug === "salary-calculator" ? <SalaryEstimator /> :
             tool.slug === "eligibility-checker" ? <EligibilityEvaluator /> :
             tool.slug === "syllabus-tracker" ? <SyllabusTracker /> :
             <div className="glass-card rounded-3xl p-8 text-center text-slate-500 dark:text-zinc-400">
               Workspace Active
             </div>}
          </div>
          <div className="space-y-6">
            <TrustBadges layout="vertical" />
          </div>
        </div>
        <SemanticSEOText exam={null} />

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
      {/* JSON-LD Schema injection */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

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

      {/* Semantic SEO Text Panel */}
      <SemanticSEOText exam={exam} />

      {/* Ad Banner 2 */}
      <AdBanner />
    </div>
  );
}
