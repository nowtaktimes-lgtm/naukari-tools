import { Metadata } from "next";
import ExamsClient from "@/components/ExamsClient";
import RatingWidget from "@/components/RatingWidget";
import FAQSection from "@/components/FAQSection";

export const metadata: Metadata = {
  title: "All Government Exams",
  description: "Directory of central and state government recruitment exams. Access custom age limits, relaxation rules, and document resizing templates.",
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
      <FAQSection path="/exams" />
      <RatingWidget name="All Government Exams Directory" pageType="WebPage" description="Directory of central and state government recruitment exams. Access custom age limits, relaxation rules, and document resizing templates." />
    </>
  );
}
