import { inter, satoshi, syne } from "@/lib/fonts";
import Head from "next/head";
import "./globals.css";
import { AuthProvider } from "./lib/auth-context";

export const metadata = {
  title: "Connected - The Launchpad for Limitless Revolutions",
  description:
    "Connected is a modern venture ecosystem that builds, launches, and scales bold ideas into global movements.From disruptive software to category- defining brands, we ignite revolutions that reshape industries across tech, media, consumer goods, and beyond",
  generator: "v0.dev",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <Head>
        <meta name="google-site-verification" content="HG7Ga3y2ghAg3JkWjWQ8bno_3tGlq0yv4q_gR9xkl08" />
      </Head>
      <body
        className={`${inter.variable} ${satoshi.variable} ${syne.variable} flex flex-col min-h-screen bg-white text-gray-900 antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
