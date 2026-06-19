"use client";

import React from "react";
import Script from "next/script";

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

      {/* Google tag (gtag.js) */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-66D4STE0CW"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-66D4STE0CW');
        `}
      </Script>
    </>
  );
}
