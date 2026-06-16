import React from "react";
import { ExamSEODB } from "@/types/exam";
import { ShieldCheck, Info, FileImage } from "lucide-react";

interface SemanticSEOTextProps {
  exam: ExamSEODB | null;
}

export default function SemanticSEOText({ exam }: SemanticSEOTextProps) {
  if (exam) {
    return (
      <div className="space-y-8 text-slate-550 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed border-t border-black/5 dark:border-white/5 pt-10 mt-12 max-w-4xl mx-auto">
        
        {/* Section 1: Introduction */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center space-x-2">
            <Info className="h-4.5 w-4.5 text-indigo-650 dark:text-indigo-400" />
            <span>Official Rules for {exam.examName} Age & Document Uploads</span>
          </h2>
          <p>
            Applying for government vacancies through {exam.examBoard} is a high-stakes process. Even minor errors in date of birth calculation or document formatting can result in instant application rejection. The {exam.examName} has strict guidelines detailing both eligibility and physical specifications of digital uploads. Understanding these requirements prevents candidate disqualification.
          </p>
        </section>

        {/* Section 2: Age Limits */}
        <section className="space-y-3">
          <h3 className="text-md font-semibold text-slate-800 dark:text-zinc-200">1. Age Eligibility & Relaxation Policies</h3>
          <p>
            For {exam.examName}, candidates belonging to the general category must satisfy a minimum age limit of <strong>{exam.generalMinAge} years</strong> and a maximum age limit of <strong>{exam.generalMaxAge} years</strong>. However, under standard Central Government recruitment directives, relaxation is applicable for reserved categories:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-700 dark:text-zinc-300">
            <li><strong>Other Backward Classes (OBC):</strong> {exam.obcRelaxationYears} years of relaxation, pushing the maximum eligible age boundary to {exam.generalMaxAge + exam.obcRelaxationYears} years.</li>
            <li><strong>Scheduled Castes & Scheduled Tribes (SC/ST):</strong> {exam.scstRelaxationYears} years of relaxation, extending the upper age limit to {exam.generalMaxAge + exam.scstRelaxationYears} years.</li>
            <li><strong>Persons with Disabilities (PwD):</strong> Typically 10 years of relaxation (or more if combined with caste relaxation categories), evaluated case-by-case against target board notifications.</li>
          </ul>
        </section>

        {/* Section 3: Photo & Signature specifications */}
        <section className="space-y-3">
          <h3 className="text-md font-semibold text-slate-800 dark:text-zinc-200">2. Photo & Signature Specifications</h3>
          <p>
            Recruitment servers automatically scan uploaded images for face alignment, aspect ratios, and file dimensions. If the file exceeds maximum KB sizes, the portal blocks uploads. 
            The official specifications for {exam.examName} are:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-100/30 dark:bg-zinc-950/40 border border-black/5 dark:border-white/5 rounded-2xl p-4 my-2">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center space-x-1.5">
                <FileImage className="h-3.5 w-3.5" />
                <span>Photograph Spec</span>
              </span>
              <ul className="text-xs text-slate-500 dark:text-zinc-400 space-y-1">
                <li>• Dimensions: {exam.photoDimensions}</li>
                <li>• Maximum Size: {exam.photoMaxKb} KB</li>
                <li>• Background: Plain White or Light Gray</li>
                <li>• Stamp: Date of Photo/Name required at bottom</li>
              </ul>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center space-x-1.5">
                <FileImage className="h-3.5 w-3.5" />
                <span>Signature Spec</span>
              </span>
              <ul className="text-xs text-slate-500 dark:text-zinc-400 space-y-1">
                <li>• Dimensions: {exam.signatureDimensions}</li>
                <li>• Maximum Size: {exam.signatureMaxKb} KB</li>
                <li>• Ink Color: Black Ink on plain white paper</li>
                <li>• Content: Must be legible, no capital initials</li>
              </ul>
            </div>
          </div>
          <p>
            When preparing files, ensure you crop closely around the facial outline for photos and signature bounds for signings, avoiding dark backgrounds or flash glares.
          </p>
        </section>

        {/* Section 4: Step-by-Step Tutorial */}
        <section className="space-y-3">
          <h3 className="text-md font-semibold text-slate-800 dark:text-zinc-200">3. Tutorial: Step-by-Step Upload Verification</h3>
          <ol className="list-decimal list-inside space-y-2.5 pl-2 text-slate-700 dark:text-zinc-300">
            <li>
              <span className="font-semibold text-slate-900 dark:text-white">Calculate Age Eligibility:</span> Select your birth date and the cutoff date. Choose your reservation category (UR, OBC, SC/ST) to verify if you fall within allowed boundaries.
            </li>
            <li>
              <span className="font-semibold text-slate-900 dark:text-white">Resize Photograph:</span> Upload your photo. Enable the photo stamp toggle to dynamically write your name and DOP (Date of Photo) at the bottom. Choose your exam spec and compress.
            </li>
            <li>
              <span className="font-semibold text-slate-900 dark:text-white">Compress Marks Certificates:</span> Scan or photograph your 10th/12th marksheets. Choose the target PDF preset (typically 100KB or 200KB) and compress locally to export a highly legible, small-size PDF.
            </li>
          </ol>
        </section>

        {/* Legal Disclaimer */}
        <section className="border-t border-black/5 dark:border-white/5 pt-6 mt-8 flex flex-col space-y-2 text-slate-500 dark:text-zinc-550 text-[11px] sm:text-xs">
          <div className="flex items-center space-x-1.5 text-slate-650 dark:text-zinc-400 font-semibold">
            <ShieldCheck className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span>Official Legal Disclaimer</span>
          </div>
          <p>
            Naukari Tools is a free utility tool. All age computations, relaxations, and document size compressions are processed client-side using mathematical models. Candidates are strictly advised to verify the output document dimensions, dates, and eligibility statuses against the latest official employment newsletters and recruitment gazettes published by {exam.examBoard} before final submission. We bear no liability for errors or disqualifications.
          </p>
        </section>

      </div>
    );
  }

  // Fallback / Custom generic SEO text
  return (
    <div className="space-y-8 text-slate-550 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed border-t border-black/5 dark:border-white/5 pt-10 mt-12 max-w-4xl mx-auto">
      
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center space-x-2">
          <Info className="h-4.5 w-4.5 text-indigo-650 dark:text-indigo-400" />
          <span>Rules for Government Job Photo Resizing & Age Calculations</span>
        </h2>
        <p>
          Each Indian recruitment agency (such as SSC, UPSC, Railway Board, state boards HPRB, DSSSB) has specific guidelines for digital uploads. Failure to format files correctly causes database errors, leading to the automatic rejection of candidates.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-md font-semibold text-slate-800 dark:text-zinc-200">1. Age Relaxation Rules</h3>
        <p>
          Most central government jobs follow standard upper-age relaxation rules: OBC candidates receive a 3-year extension, and SC/ST candidates receive a 5-year extension. PwD candidates receive an additional 10 to 15 years depending on the specific caste combination. Cutoff dates are usually calculated as of January 1st or August 1st of the application year.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-md font-semibold text-slate-850 dark:text-zinc-200">2. Photo Resizer & Stamp Standards</h3>
        <p>
          Recent SSC and UPPRPB notifications require the photo to be taken within 3 months of notification, with the date of photo capture (DOP) printed at the bottom of the white background card. Maximum file size is typically 50KB, and signature sizes are usually capped at 20KB. Files must be uploaded strictly in JPG or JPEG format.
        </p>
      </section>

      {/* Legal Disclaimer */}
      <section className="border-t border-black/5 dark:border-white/5 pt-6 mt-8 flex flex-col space-y-2 text-slate-500 dark:text-zinc-550 text-[11px] sm:text-xs">
        <div className="flex items-center space-x-1.5 text-slate-650 dark:text-zinc-400 font-semibold">
          <ShieldCheck className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <span>Official Legal Disclaimer</span>
        </div>
        <p>
          This is a free helper tool; please verify output dimensions and dates against the latest official recruitment notifications before completing final submissions on government portals.
        </p>
      </section>

    </div>
  );
}
