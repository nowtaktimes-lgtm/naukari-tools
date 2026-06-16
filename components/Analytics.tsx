"use client";

import React from "react";

export default function Analytics() {
  return (
    <>
      {/* Cookie-free Vercel insights analytics injection block */}
      <script
        async
        defer
        src="https://cdn.vercel-insights.com/v1/script.debug.js"
        data-sd-id="vercel-insights"
      />
    </>
  );
}
