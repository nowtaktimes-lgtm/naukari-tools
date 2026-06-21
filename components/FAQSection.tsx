"use client";

import React, { useState } from "react";
import { HelpCircle, ChevronDown } from "lucide-react";
import { ExamSEODB } from "@/types/exam";
import { RouteInfo } from "@/config/routes";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  exam?: ExamSEODB | null;
  tool?: RouteInfo | null;
  path?: string;
}

export default function FAQSection({ exam, tool, path }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Generate FAQs dynamically based on the page context
  const getFAQItems = (): FAQItem[] => {
    if (exam) {
      return [
        {
          question: `What is the age limit for the ${exam.examName} exam?`,
          answer: `For ${exam.examName}, candidates in the General category must satisfy a minimum age limit of ${exam.generalMinAge} years and a maximum limit of ${exam.generalMaxAge} years. Upper age relaxations are applicable as per rules: ${exam.obcRelaxationYears} years for OBC and ${exam.scstRelaxationYears} years for SC/ST candidates.`,
        },
        {
          question: `What photograph size and dimension specifications apply to the ${exam.examName} application?`,
          answer: `The photograph must be resized to ${exam.photoDimensions} with a maximum file size of ${exam.photoMaxKb} KB. The signature must be resized to ${exam.signatureDimensions} with a maximum size of ${exam.signatureMaxKb} KB. You can use our free resizer tool to auto-format your uploads to these specifications locally in one click.`,
        },
        {
          question: `Is it mandatory to print my name and date of photo capture on the ${exam.examName} photograph?`,
          answer: `Depending on the latest notification guidelines for ${exam.examBoard} exams, it is highly recommended to enable name and date stamps on your photograph to avoid form rejection. You can use our Photo Resizer's stamp toggle to add this text block at the bottom of your image automatically.`,
        },
        {
          question: `Does Naukari Tools save my passport photos or documents on any server?`,
          answer: `No. Naukari Tools is designed to process all candidate photos, signatures, and certificates locally inside your browser memory. No files are uploaded to our servers, ensuring 100% data privacy and security for all candidates.`,
        },
      ];
    }

    if (tool) {
      if (tool.slug === "age-calculator") {
        return [
          {
            question: "How do I compute my exact age relaxation eligibility using the Sarkari Age Calculator?",
            answer: "Enter your exact Date of Birth, select the cutoff date specified in the official notification, and choose your reservation category (General, OBC, SC, ST, PwD). The tool will automatically calculate your age and display if you qualify under official relaxation rules.",
          },
          {
            question: "What is the cutoff date in government recruitment notifications?",
            answer: "The cutoff date (e.g. August 1st or January 1st) is the official reference date used by recruitment boards (such as SSC, UPSC, and state PSCs) to determine whether a candidate satisfies the upper and lower age limits.",
          },
        ];
      }
      if (tool.slug === "photo-resizer") {
        return [
          {
            question: "How do I resize my exam photo to under 50KB?",
            answer: "Upload your photograph in our resizer, select the target exam template (or enter custom dimensions), adjust the quality slider to keep the file size under 50KB, and download the cropped file directly from local browser memory.",
          },
          {
            question: "How do I stamp my name and the date of photo capture on a photo?",
            answer: "Enable the 'Photo Stamp' toggle inside our resizer widget, input your name and target date, and they will be drawn onto the bottom card of your photograph locally before downloading.",
          },
        ];
      }
      if (tool.slug === "document-compressor") {
        return [
          {
            question: "How do I compress my marksheet certificate to under 100KB or 200KB?",
            answer: "Upload your scanned certificate (JPG/PNG), select your target PDF size preset (100KB or 200KB), and our local-first compressor will lower the image file size and output a compliant, high-legibility PDF file.",
          },
          {
            question: "Are my compressed PDFs safe to upload to official portals?",
            answer: "Yes. All compressed PDFs generated conform to standard document formats required by recruitment portals (such as SSC, UPSC, and state boards) and are processed entirely client-side for maximum security.",
          },
        ];
      }
      if (tool.slug === "salary-calculator") {
        return [
          {
            question: "How does the 7th Pay Salary Estimator calculate in-hand salary?",
            answer: "It uses the standard 7th Pay Commission pay matrix levels. Select your pay level (1 to 18) and your city class (X, Y, or Z for HRA calculations) to view basic pay, allowances (DA, HRA, TA), and NPS deductions automatically.",
          },
          {
            question: "What is the current dearness allowance (DA) percentage?",
            answer: "The salary estimator uses the latest approved DA parameters (currently calculated at 50% of basic pay according to central government directives).",
          },
        ];
      }
      if (tool.slug === "eligibility-checker") {
        return [
          {
            question: "How does the Eligibility Evaluator determine compatible exams?",
            answer: "It evaluates your highest educational qualification, marks percentage, current age, height, and gender against our database of 100+ central and state recruitment exams to instantly list compatible matches.",
          },
        ];
      }
      if (tool.slug === "syllabus-tracker") {
        return [
          {
            question: "How does the Syllabus & Progress Tracker save my study status?",
            answer: "The tracker utilizes local browser storage to save your preparation checkmarks, syllabus topics, and completion status. Your preparation stats remain active even when you go offline.",
          },
        ];
      }
    }

    // Static pages FAQs
    if (path === "/about") {
      return [
        {
          question: "What is Naukari Tools and who is it built for?",
          answer: "Naukari Tools is a high-trust, minimalist candidate utility hub designed to make government job registration workflows frictionless, transparent, and completely secure for future civil servants.",
        },
        {
          question: "Why does Naukari Tools run local-first computations?",
          answer: "Since recruitment documents contain sensitive details, running image cropping, compression, and age calculations inside your browser memory ensures your personal data is never transmitted or stored on remote servers.",
        },
      ];
    }
    if (path === "/disclaimer") {
      return [
        {
          question: "Is Naukari Tools affiliated with the Government of India?",
          answer: "No. Naukari Tools is an independent educational utility. We have no affiliation, connection, or endorsement from any government agency, recruitment board, or official department.",
        },
        {
          question: "How accurate are the calculators and templates on Naukari Tools?",
          answer: "All age relaxation rules and image specifications are double-checked against official recruitment brochures. However, candidates should verify output dimensions and limits with official employment newsletters.",
        },
      ];
    }
    if (path === "/privacy-policy") {
      return [
        {
          question: "Does Naukari Tools collect or store my uploaded documents?",
          answer: "No. All photo/signature cropping, stamping, and certificate compression operations are executed locally using Web Workers. We have no backend databases storing candidate files.",
        },
        {
          question: "What analytics tools are used on this website?",
          answer: "We use cookie-free, privacy-first analytics to monitor portal speed and bandwidth performance without tracking candidate IP addresses or individual user profiles.",
        },
      ];
    }
    if (path === "/terms") {
      return [
        {
          question: "Are the tools on Naukari Tools free to use?",
          answer: "Yes. All calculator, checker, resizer, and tracker tools on Naukari Tools are 100% free of charge for candidates and cyber cafe operators.",
        },
        {
          question: "What are the usage limits for local document compression?",
          answer: "There are no limits. You can resize, compress, and check eligibility for as many candidate profiles and applications as needed.",
        },
      ];
    }
    if (path === "/exams") {
      return [
        {
          question: "How do I find eligibility rules for my target government exam?",
          answer: "Our directory indexes 100+ exams from SSC, UPSC, Railways, Banking, and State PSCs. Select your target exam to open a dedicated portal pre-configured with official age criteria and document sizes.",
        },
        {
          question: "How often is the government exams directory updated?",
          answer: "We monitor official gazettes and recruitment boards daily, updating the database as soon as notifications are released.",
        },
      ];
    }

    // Default Fallback FAQs
    return [
      {
        question: "How does Naukari Tools protect my privacy?",
        answer: "All document resizing, certificate compression, and eligibility calculations are executed inside your browser memory locally. No files are uploaded to any server.",
      },
      {
        question: "Is this website free to use?",
        answer: "Yes, Naukari Tools is completely free and requires no registration, cookies, or personal data entry.",
      },
    ];
  };

  const faqItems = getFAQItems();

  // Create JSON-LD schema payload
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer,
      },
    })),
  };

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto my-12 border-t border-black/5 dark:border-white/5 pt-10">
      {/* FAQ Schema Script Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />

      <div className="space-y-1 text-center sm:text-left mb-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center justify-center sm:justify-start space-x-2">
          <HelpCircle className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          <span>Frequently Asked Questions</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-zinc-400">
          Get answers to common queries about qualifications, limits, and document specifications.
        </p>
      </div>

      <div className="space-y-4">
        {faqItems.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="glass-card rounded-2xl border border-black/5 dark:border-white/10 overflow-hidden transition-all duration-300"
            >
              <button
                type="button"
                onClick={() => toggleAccordion(index)}
                className="w-full px-5 py-4 flex items-center justify-between text-left focus:outline-none transition-colors duration-150 hover:bg-slate-50 dark:hover:bg-zinc-950/40"
              >
                <span className="text-sm font-semibold text-slate-800 dark:text-zinc-200">
                  {item.question}
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${
                    isOpen ? "transform rotate-180 text-indigo-500" : ""
                  }`}
                />
              </button>

              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  isOpen ? "max-h-[500px] border-t border-black/5 dark:border-white/5" : "max-h-0"
                }`}
              >
                <div className="px-5 py-4 text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed bg-slate-50/50 dark:bg-zinc-950/20">
                  {item.answer}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
