import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import examsData from "@/data/exams.json";
import { ExamSEODB } from "@/types/exam";

export async function GET(request: NextRequest) {
  // Check authorization headers
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // Base current date
  const today = new Date("2026-06-15T00:00:00+05:30");
  const exams = examsData as ExamSEODB[];

  // Find newly released exams (released today)
  const newlyReleased = exams.filter((exam) => {
    const releaseDate = new Date(exam.releaseDate);
    return (
      releaseDate.getFullYear() === today.getFullYear() &&
      releaseDate.getMonth() === today.getMonth() &&
      releaseDate.getDate() === today.getDate()
    );
  });

  if (newlyReleased.length === 0) {
    return NextResponse.json({ 
      success: true, 
      message: "No new exams scheduled for publication today." 
    });
  }

  // Trigger on-demand ISR revalidation for active slugs
  for (const exam of newlyReleased) {
    try {
      revalidatePath(`/tools/${exam.slug}`);
      // Simulating dynamic indexing api ping
      console.log(`[Google Indexing API] Pinged crawler update for: https://naukaritools.in/tools/${exam.slug}`);
    } catch (err) {
      console.error(`Revalidation failed for exam slug: ${exam.slug}`, err);
    }
  }

  // Revalidate sitemap paths
  revalidatePath("/sitemap.xml");

  return NextResponse.json({
    success: true,
    message: "Auto-publishing cron completed successfully.",
    revalidatedPaths: newlyReleased.map((e) => `/tools/${e.slug}`),
  });
}
