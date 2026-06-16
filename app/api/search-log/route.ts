import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();
    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const dataDir = path.join(process.cwd(), "data");
    const logFile = path.join(dataDir, "failed_searches.json");

    // Ensure directory exists
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Read existing logs
    let logs: { query: string; timestamp: string }[] = [];
    if (fs.existsSync(logFile)) {
      try {
        const fileContent = fs.readFileSync(logFile, "utf-8");
        logs = JSON.parse(fileContent);
      } catch {
        logs = [];
      }
    }

    // Append new log entry
    logs.push({
      query: query.trim(),
      timestamp: new Date().toISOString(),
    });

    // Write back
    fs.writeFileSync(logFile, JSON.stringify(logs, null, 2), "utf-8");

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to log search query:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
