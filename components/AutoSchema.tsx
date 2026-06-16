"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { toolsList } from "@/config/routes";
import examsData from "@/data/exams.json";
import { ExamSEODB } from "@/types/exam";

export default function AutoSchema() {
  const pathname = usePathname();

  useEffect(() => {
    // Clean up previous dynamically generated auto-schemas to prevent duplication on client-side navigation
    const existing = document.getElementById("auto-page-schema");
    if (existing) {
      existing.remove();
    }

    let schema: Record<string, unknown> | null = null;

    // 1. Dynamic tools and exams routes under /tools/
    if (pathname.startsWith("/tools/")) {
      const slug = pathname.replace("/tools/", "");
      const exam = (examsData as ExamSEODB[]).find((e) => e.slug === slug);
      const tool = toolsList.find((t) => t.slug === slug);

      if (exam) {
        schema = {
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
        };
      } else if (tool) {
        schema = {
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
        };
      }
    } else {
      // 2. Primary static routes
      const staticPages: Record<string, { name: string; type: string; desc: string }> = {
        "/": { 
          name: "Naukari Tools", 
          type: "WebSite", 
          desc: "Elite government job utility software suite containing precise age relaxations, 7th pay commission allowances, and document compression tools." 
        },
        "/exams": { 
          name: "All Government Exams Directory", 
          type: "CollectionPage", 
          desc: "Comprehensive directory of central and state government recruitment exams with customized tool links for age limits, relaxation rules, and document resizing templates." 
        },
        "/about": { 
          name: "About Naukari Tools", 
          type: "AboutPage", 
          desc: "Learn about Naukari Tools - the high-trust, minimalist, local-first utility workspace for civil service candidates." 
        },
        "/contact": { 
          name: "Contact Naukari Tools", 
          type: "ContactPage", 
          desc: "Get in touch with Naukari Tools support team. Submit discrepancies, feedback, or target exam requests." 
        },
        "/disclaimer": { 
          name: "Disclaimer - Naukari Tools", 
          type: "WebPage", 
          desc: "Important legal disclaimers for Naukari Tools educational utility platform. We are not affiliated with or connected to any Indian Government Organization." 
        },
        "/privacy-policy": { 
          name: "Privacy Policy - Naukari Tools", 
          type: "WebPage", 
          desc: "Privacy guidelines for candidates using Naukari Tools. Learn how we store zero data on servers and run all calculations locally inside your browser." 
        },
        "/terms": { 
          name: "Terms of Service - Naukari Tools", 
          type: "WebPage", 
          desc: "Terms of use and service agreement details for accessing tools on Naukari Tools." 
        }
      };

      const matched = staticPages[pathname];
      if (matched) {
        schema = {
          "@context": "https://schema.org",
          "@type": matched.type,
          "name": matched.name,
          "url": `https://naukaritools.in${pathname === "/" ? "" : pathname}`,
          "description": matched.desc
        };
      } else {
        // 3. Fallback Auto-Schema for ANY new static page that gets added in the future!
        schema = {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": document.title || "Naukari Tools Utility Page",
          "url": `https://naukaritools.in${pathname}`,
          "description": `Interactive educational utilities and compliance page for Naukari Tools.`
        };
      }
    }

    if (schema) {
      const script = document.createElement("script");
      script.id = "auto-page-schema";
      script.type = "application/ld+json";
      script.innerHTML = JSON.stringify(schema);
      document.head.appendChild(script);
    }
  }, [pathname]);

  return null;
}
