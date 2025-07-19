import { Inter, Syne } from "next/font/google"
import localFont from "next/font/local"

export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
})

export const syne = Syne({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-syne",
})

export const satoshi = localFont({
  src: [
    {
      path: "../public/fonts/Satoshi-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Satoshi-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/Satoshi-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-satoshi",
  display: "swap",
})
