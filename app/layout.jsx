import { inter, satoshi, syne } from "@/lib/fonts"
import Script from "next/script"
import "./globals.css"
import { AuthProvider } from "./lib/auth-context"
import PrefetchRoutes from "../app/components/PrefetchRoutes.jsx"
import HiddenBenchmarkCard from "./components/hidden-benchmark-card"

export const metadata = {
  title: "Connected - The Launchpad for Limitless Revolutions",
  description:
    "Connected is a modern venture ecosystem that builds, launches, and scales bold ideas into global movements. From disruptive software to category-defining brands, we ignite revolutions that reshape industries across tech, media, consumer goods, and beyond",
  generator: "v0.dev",
  verification: {
    google: "HG7Ga3y2ghAg3JkWQ8bno_3tGlq0yv4q_gR9xkl08",
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-D5KWFSH1KX" strategy="afterInteractive" />
        <meta name="google-site-verification" content="HG7Ga3y2ghAg3JkWjWQ8bno_3tGlq0yv4q_gR9xkl08" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-D5KWFSH1KX');
          `}
        </Script>
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://weareconnected.io" />
        <meta property="og:title" content="Connected - The Launchpad for Limitless Revolutions" />
        <meta
          property="og:description"
          content="Connected is a modern venture ecosystem that builds, launches, and scales bold ideas into global movements."
        />
        <meta property="og:image" content="https://weareconnected.io/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* ✅ Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://weareconnected.io" />
        <meta name="twitter:title" content="Connected - The Launchpad for Limitless Revolutions" />
        <meta
          name="twitter:description"
          content="Connected is a modern venture ecosystem that builds, launches, and scales bold ideas into global movements."
        />
        <meta name="twitter:image" content="https://weareconnected.io/og-image.jpg" />

        <link rel="icon" href="/favicon-dark.ico" media="(prefers-color-scheme: dark)" />
        <link rel="icon" href="/favicon.ico" media="(prefers-color-scheme: light)" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${inter.variable} ${satoshi.variable} ${syne.variable} flex flex-col min-h-screen bg-white text-gray-900 antialiased`}
      >
        <PrefetchRoutes />
        <AuthProvider>{children}</AuthProvider>
        <HiddenBenchmarkCard />
      </body>
    </html>
  )
}
