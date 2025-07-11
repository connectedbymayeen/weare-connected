"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation"; 
import { inter, satoshi, syne } from "@/lib/fonts";
import Script from "next/script";
import "./globals.css";
import { AuthProvider } from "./lib/auth-context";

export const metadata = {
  title: "Connected - The Launchpad for Limitless Revolutions",
  description:
    "Connected is a modern venture ecosystem that builds, launches, and scales bold ideas into global movements. From disruptive software to category-defining brands, we ignite revolutions that reshape industries across tech, media, consumer goods, and beyond",
  generator: "v0.dev",
  verification: {
    google: "HG7Ga3y2ghAg3JkWQ8bno_3tGlq0yv4q_gR9xkl08",
  },
};

export default function RootLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    router.prefetch("/about");
    router.prefetch("/contact");
    router.prefetch("/blog");
    router.prefetch("/ventures");
    router.prefetch("/career");
    router.prefetch("/careers");
  }, []);

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Google Analytics Script */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-D5KWFSH1KX"
          strategy="afterInteractive"
        />
        <meta
          name="google-site-verification"
          content="HG7Ga3y2ghAg3JkWjWQ8bno_3tGlq0yv4q_gR9xkl08"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-D5KWFSH1KX');
          `}
        </Script>
        <link
          rel="icon"
          href="/favicon-dark.ico"
          media="(prefers-color-scheme: dark)"
        />
        <link
          rel="icon"
          href="/favicon.ico"
          media="(prefers-color-scheme: light)"
        />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${inter.variable} ${satoshi.variable} ${syne.variable} flex flex-col min-h-screen bg-white text-gray-900 antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
