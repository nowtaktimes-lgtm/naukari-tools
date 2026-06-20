import { MetadataRoute } from "next";
import fs from "fs";
import path from "path";
import examsData from "@/data/exams.json";
import { ExamSEODB } from "@/types/exam";
import { toolsList } from "@/config/routes";

// Recursive function to scan the app directory for static routes
function getStaticRoutes(dir: string, baseRoute = ""): string[] {
  const routes: string[] = [];
  
  if (!fs.existsSync(dir)) return routes;
  
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Ignore Next.js system/reserved folders, dynamic route folders, and API folders
      const ignoredFolders = ["api", "tools", "fonts", "_not-found"];
      if (ignoredFolders.includes(item) || item.startsWith("[") || item.startsWith("_")) {
        continue;
      }

      // Handle Route Groups e.g. (auth)
      const isRouteGroup = item.startsWith("(") && item.endsWith(")");
      const nextRouteSegment = isRouteGroup ? "" : item;
      
      let nextRoute = baseRoute;
      if (nextRouteSegment) {
        nextRoute = baseRoute ? `${baseRoute}/${nextRouteSegment}` : `/${nextRouteSegment}`;
      }

      // Check if this folder has a page file
      const hasPage = fs.readdirSync(fullPath).some((file) => 
        file.startsWith("page.") && (file.endsWith(".tsx") || file.endsWith(".ts") || file.endsWith(".js") || file.endsWith(".jsx"))
      );

      if (hasPage && nextRoute) {
        routes.push(nextRoute);
      }

      // Recursively scan subdirectories
      routes.push(...getStaticRoutes(fullPath, nextRoute));
    }
  }

  // Deduplicate routes
  return Array.from(new Set(routes));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const exams = examsData as ExamSEODB[];
  const baseUrl = "https://naukaritools.in";

  // 1. Dynamic exam URLs (All exams are included to allow pre-indexing of upcoming resources)
  const examUrls = exams.map((exam) => ({
    url: `${baseUrl}/tools/${exam.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // 2. Dynamic core tools URLs
  const toolUrls = toolsList.map((tool) => ({
    url: `${baseUrl}/tools/${tool.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  // 3. Scan filesystem for all static routes inside the app directory
  const appDirectory = path.join(process.cwd(), "app");
  const detectedStaticRoutes = getStaticRoutes(appDirectory);

  // Map detected static routes
  const staticUrls = [
    // Add homepage manually
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    // Map dynamically detected routes
    ...detectedStaticRoutes.map((route) => {
      // Set high crawl frequency and priority for core directory page
      const isExamsDir = route === "/exams";
      return {
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: isExamsDir ? ("daily" as const) : ("monthly" as const),
        priority: isExamsDir ? 0.9 : 0.5,
      };
    })
  ];

  return [...staticUrls, ...toolUrls, ...examUrls];
}
