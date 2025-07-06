import { inter, satoshi, syne } from "@/lib/fonts";
import "./globals.css";
import { AuthProvider } from "./lib/auth-context";

export const metadata = {
  title: "Connected - Empowering Bold Ideas",
  description:
    "Connected is a forward-thinking company that empowers bold ideas across tech, digital, and lifestyle industries.",
  generator: "v0.dev",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${satoshi.variable} ${syne.variable} flex flex-col min-h-screen bg-white text-gray-900 antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>

      </body>
    </html>
  );
}
