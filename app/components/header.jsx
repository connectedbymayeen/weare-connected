// "use client"

// import { useEffect, useState } from "react"
// import Link from "next/link"
// import { usePathname } from "next/navigation"
// import { useAuth } from "../lib/auth-context"
// import { Button } from "@/components/ui/button"
// import { Menu, X } from "lucide-react"
// import { cn } from "@/lib/utils"

// export default function Header() {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
//   const pathname = usePathname()
//   const { user, isAdmin, logout } = useAuth()
//   const [isMenuOpen, setIsMenuOpen] = useState(false)
//   const [isScrolled, setIsScrolled] = useState(false)
//   const [isMounted, setIsMounted] = useState(false)

//   const navigation = [
//     // { name: "Home", href: "/" },
//     { name: "About", href: "/about" },
//     // { name: "Services", href: "/services" },
//     { name: "Ventures", href: "/ventures" },
//     { name: "Careers", href: "/careers" },
//     { name: "Blog", href: "/blog" },
//     { name: "Contact", href: "/contact" },
//   ]

//   const isActive = (path) => {
//     if (path === "/") {
//       return pathname === "/"
//     }
//     return pathname.startsWith(path)
//   }

//   useEffect(() => {
//     setIsMounted(true)

//     const handleScroll = () => {
//       if (typeof window !== "undefined") {
//         setIsScrolled(window.scrollY > 20)
//       }
//     }

//     if (typeof window !== "undefined") {
//       window.addEventListener("scroll", handleScroll)
//       return () => window.removeEventListener("scroll", handleScroll)
//     }
//   }, [])

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen)
//   }

//   if (!isMounted) {
//     return null
//   }

//   return (
//     <>
//       {/* Fixed Header */}
//       <header className="fixed sticky-top top-0 left-0 right-0 z-50 w-full">
//         <div className="bg-white/10 backdrop-blur-md border-b border-white/20">
//           <nav
//             className="relative mx-auto max-w-7xl border border-white/30
//          bg-white/20 backdrop-blur-xl
//          rounded-[10px] px-4 sm:px-6 lg:px-8 shadow-2xl mt-4 mb-4
//          before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/10 before:to-transparent before:rounded-[10px] before:pointer-events-none"
//             aria-label="Top"
//           >
//             <div className="flex h-16 items-center justify-between">
//               <div className="container mx-auto px-6">
//                 <div className="flex h-20 items-center justify-between">
//                   {/* Logo */}
//                   <Link href="/" className="flex items-center group shrink-0">
// <div className="relative h-10 w-48 transition-transform duration-300 group-hover:scale-105">
//   <img src="/logo.png" alt="Connected" className="object-cover" />
// </div>
//                   </Link>

//                   {/* Combined Nav, Icon Divider, and CTA for Desktop */}
//                   <div className="hidden lg:flex items-center space-x-6">
//                     <nav className="flex items-center">
//                       {[
//                         { href: "/about", label: "About" },
//                         { href: "/ventures", label: "Ventures" },
//                         { href: "/blog", label: "Blog" },
//                         { href: "/careers", label: "Careers" },
//                         { href: "/contact", label: "Contact" },
//                       ].map((item) => (
//                         <Link
//                           key={item.href}
//                           href={item.href}
//                           className="font-satoshi relative px-3 py-2 text-md font-semibold text-pink-600 hover:text-primary transition-all duration-300 group"
//                         >
//                           {item.label}
//                           <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-primary to-secondary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
//                         </Link>
//                       ))}
//                     </nav>
//                   </div>

//                   {/* Mobile Menu Button */}
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="lg:hidden relative w-10 h-10 rounded-full hover:bg-gray-100 transition-colors duration-300"
//                     onClick={toggleMenu}
//                   >
//                     <div className="relative w-6 h-6">
//                       <span
//                         className={cn(
//                           "absolute block h-0.5 w-6 bg-gray-700 transition-all duration-300",
//                           isMenuOpen ? "top-3 rotate-45" : "top-1",
//                         )}
//                       />
//                       <span
//                         className={cn(
//                           "absolute block h-0.5 w-6 bg-gray-700 transition-all duration-300",
//                           isMenuOpen ? "opacity-0" : "top-3",
//                         )}
//                       />
//                       <span
//                         className={cn(
//                           "absolute block h-0.5 w-6 bg-gray-700 transition-all duration-300",
//                           isMenuOpen ? "top-3 -rotate-45" : "top-5",
//                         )}
//                       />
//                     </div>
//                     <span className="sr-only">Toggle menu</span>
//                   </Button>
//                 </div>
//               </div>

//               <div className="flex lg:hidden">
//                 <button
//                   type="button"
//                   className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
//                   onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//                 >
//                   <span className="sr-only">Open main menu</span>
//                   {mobileMenuOpen ? (
//                     <X className="h-6 w-6" aria-hidden="true" />
//                   ) : (
//                     <Menu className="h-6 w-6" aria-hidden="true" />
//                   )}
//                 </button>
//               </div>
//             </div>
//             {/* Mobile menu */}
//             {mobileMenuOpen && (
//               <div className="lg:hidden absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl border border-white/30 rounded-lg shadow-2xl">
//                 <div className="space-y-1 px-2 pb-3 pt-2">
//                   {navigation.map((link) => (
//                     <Link
//                       key={link.name}
//                       href={link.href}
//                       className={`block rounded-md px-3 py-2 text-base font-medium ${
//                         isActive(link.href)
//                           ? "bg-gray-100 text-primary"
//                           : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
//                       }`}
//                       onClick={() => setMobileMenuOpen(false)}
//                     >
//                       {link.name}
//                     </Link>
//                   ))}
//                   {user ? (
//                     <>
//                       <div className="px-3 py-2 text-base font-medium text-gray-500">
//                         Signed in as {user.name || user.email || user.username}
//                       </div>
//                       <Link
//                         href="/profile"
//                         className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
//                         onClick={() => setMobileMenuOpen(false)}
//                       >
//                         Profile
//                       </Link>
//                       <Link
//                         href="/settings"
//                         className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
//                         onClick={() => setMobileMenuOpen(false)}
//                       >
//                         Settings
//                       </Link>
//                       {isAdmin && (
//                         <Link
//                           href="/admin"
//                           className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
//                           onClick={() => setMobileMenuOpen(false)}
//                         >
//                           Admin Panel
//                         </Link>
//                       )}
//                       <button
//                         onClick={() => {
//                           logout()
//                           setMobileMenuOpen(false)
//                         }}
//                         className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
//                       >
//                         Log out
//                       </button>
//                     </>
//                   ) : (
//                     <>
//                       <Link
//                         href="/auth/login"
//                         className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
//                         onClick={() => setMobileMenuOpen(false)}
//                       >
//                         Log in
//                       </Link>
//                       <Link
//                         href="/auth/signup"
//                         className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
//                         onClick={() => setMobileMenuOpen(false)}
//                       >
//                         Sign up
//                       </Link>
//                     </>
//                   )}
//                 </div>
//               </div>
//             )}
//           </nav>
//         </div>
//       </header>

//       {/* Spacer to prevent content from hiding behind fixed header */}
//       <div className="h-24"></div>
//     </>
//   )
// }



"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const navItems = [
  { name: "About", href: "/about" },
  { name: "Ventures", href: "/ventures" },
  { name: "Blog", href: "/blog" },
  { name: "Careers", href: "/career" },
  // { name: "Contact", href: "/contact" },
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 left-0 right-0 z-50 p-2 sm:p-4 md:p-6 print:hidden bg-transparent">
      <div
        className={cn(
          "relative w-full max-w-[1172px] h-[70px] sm:h-[80px] md:h-[86px] mx-auto",
          "bg-primary/15 backdrop-blur-xl border border-primary/20",
          "rounded-[20px] sm:rounded-[28px] md:rounded-[32px] transition-all duration-300 shadow-sm",
        )}
      >
        <div className="px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
          <div className="flex h-[70px] sm:h-[80px] md:h-[86px] items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center group">
              <div className="relative h-10 w-48 transition-transform duration-300 group-hover:scale-105">
                <img src="/logo.png" alt="Connected" className="object-cover" />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-bold font-satoshi text-gray-500 text-shadow-fuchsia-950 hover:text-gray-700 transition-all duration-300 relative group"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-900/30 group-hover:w-full transition-all duration-300"></span>
                </Link>
              ))}

              {/* CTA Button */}
              <Link href='/contact'>
                <Button
                  variant="outline"
                  size="sm"
                  className="cursor-pointer ml-4 bg-[#6529b2] border-[#6529b2] text-white hover:bg-[#5a24a0] hover:border-[#5a24a0] transition-all duration-300 font-satoshi"
                >
                  Contact Us
                </Button></Link>
            </nav>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-900 hover:bg-gray-900/10 transition-all duration-300 h-8 w-8 sm:h-9 sm:w-9"
              >
                {isMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
                <span className="sr-only">Toggle menu</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          className={cn(
            "lg:hidden absolute left-2 right-2 sm:left-4 sm:right-4 mt-2 shadow-2xl z-20",
            "max-w-screen-lg xl:max-w-screen-xl mx-auto",
            "bg-primary/20 backdrop-blur-2xl border border-primary/25",
            "rounded-xl overflow-hidden",
          )}
        >
          <nav className="flex flex-col p-4 sm:p-6 space-y-3 sm:space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-base sm:text-lg font-medium font-satoshi text-pot-black hover:text-gray-700 transition-all duration-300 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-3 sm:pt-4 border-t border-white/20">
              <Button
                variant="outline"
                className="w-full bg-[#6529b2] border-[#6529b2] text-white hover:bg-[#5a24a0] hover:border-[#5a24a0] transition-all duration-300 font-satoshi"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact Us
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
