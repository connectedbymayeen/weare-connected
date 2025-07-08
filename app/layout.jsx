import { inter, satoshi, syne } from "@/lib/fonts";
import Script from "next/script";
import "./globals.css";
import { AuthProvider } from "./lib/auth-context";

export const metadata = {
  title: "Connected - The Launchpad for Limitless Revolutions",
  description:
    "Connected is a modern venture ecosystem that builds, launches, and scales bold ideas into global movements. From disruptive software to category-defining brands, we ignite revolutions that reshape industries across tech, media, consumer goods, and beyond",
  generator: "v0.dev",
  icons: [
    {
      rel: "icon",
      url: "/favicon.ico",
      media: "(prefers-color-scheme: light)",
    },
    {
      rel: "icon",
      url: "/favicon-dark.ico",
      media: "(prefers-color-scheme: dark)",
    },
    {
      rel: "icon",
      url: "/favicon.ico",
    },
  ],

  verification: {
    google: "HG7Ga3y2ghAg3JkWQ8bno_3tGlq0yv4q_gR9xkl08",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>

        {/* Google Analytics Script */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-D5KWFSH1KX"
          strategy="afterInteractive"
        />
        <meta name="google-site-verification" content="HG7Ga3y2ghAg3JkWjWQ8bno_3tGlq0yv4q_gR9xkl08" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-D5KWFSH1KX');
          `}
        </Script>
      </head>
      <body
        className={`${inter.variable} ${satoshi.variable} ${syne.variable} flex flex-col min-h-screen bg-white text-gray-900 antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
