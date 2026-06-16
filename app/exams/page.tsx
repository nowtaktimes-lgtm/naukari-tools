import { Metadata } from "next";
import ExamsClient from "@/components/ExamsClient";

export const metadata: Metadata = {
  title: "All Government Exams Directory | Naukari Tools",
  description: "Browse the comprehensive directory of central and state government recruitment exams. Get exact calculations for age limits, relaxations, photo resizing templates, and marks eligibility constraints.",
};

export default function ExamsPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "All Government Exams Directory | Naukari Tools",
    "url": "https://naukaritools.in/exams",
    "description": "Comprehensive directory of central and state government recruitment exams with customized tool links for age limits, relaxation rules, and document resizing templates."
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <ExamsClient />
    </>
  );
}
