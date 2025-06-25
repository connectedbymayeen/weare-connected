"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "../lib/auth-context"

export default function SimpleNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, isAdmin, logout } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const navigation = [
    { name: "About", href: "/about" },
    { name: "Ventures", href: "/ventures" },
    { name: "Careers", href: "/careers" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ]

  const isActive = (path) => pathname === path || (path !== "/" && pathname.startsWith(path))

  return (
    <>
      <style jsx>{`
        .fixed-navbar {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          width: 100vw !important;
          height: 70px !important;
          background: rgba(255, 255, 255, 0.9) !important;
          backdrop-filter: blur(10px) !important;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;
          z-index: 999999 !important;
          display: flex !important;
          align-items: center !important;
          padding: 0 20px !important;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1) !important;
        }
        
        .navbar-container {
          max-width: 1200px !important;
          width: 100% !important;
          margin: 0 auto !important;
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
        }
        
        .logo {
          height: 40px !important;
          width: auto !important;
        }
        
        .nav-links {
          display: flex !important;
          align-items: center !important;
          gap: 30px !important;
        }
        
        .nav-link {
          color: #d91a7a !important;
          text-decoration: none !important;
          font-weight: 600 !important;
          font-size: 16px !important;
          transition: color 0.3s ease !important;
        }
        
        .nav-link:hover,
        .nav-link.active {
          color: #6529b2 !important;
        }
        
        .auth-section {
          display: flex !important;
          align-items: center !important;
          gap: 15px !important;
        }
        
        .auth-link {
          color: #666 !important;
          text-decoration: none !important;
          font-size: 14px !important;
        }
        
        .signup-btn {
          background: #6529b2 !important;
          color: white !important;
          padding: 8px 16px !important;
          border-radius: 6px !important;
          text-decoration: none !important;
          font-size: 14px !important;
        }
        
        .mobile-menu-btn {
          display: none !important;
          background: none !important;
          border: none !important;
          cursor: pointer !important;
          padding: 5px !important;
        }
        
        .hamburger {
          width: 25px !important;
          height: 20px !important;
          position: relative !important;
        }
        
        .hamburger span {
          display: block !important;
          height: 2px !important;
          width: 100% !important;
          background: #333 !important;
          margin: 4px 0 !important;
          transition: 0.3s !important;
        }
        
        .mobile-menu {
          position: absolute !important;
          top: 100% !important;
          left: 0 !important;
          right: 0 !important;
          background: white !important;
          border-top: 1px solid #eee !important;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1) !important;
          z-index: 999998 !important;
        }
        
        .mobile-menu-item {
          display: block !important;
          padding: 15px 20px !important;
          color: #333 !important;
          text-decoration: none !important;
          border-bottom: 1px solid #eee !important;
        }
        
        .mobile-menu-item:hover {
          background: #f5f5f5 !important;
        }
        
        .spacer {
          height: 70px !important;
          width: 100% !important;
        }
        
        @media (max-width: 1024px) {
          .nav-links {
            display: none !important;
          }
          .mobile-menu-btn {
            display: block !important;
          }
        }
      `}</style>

      <div className="fixed-navbar">
        <div className="navbar-container">
          {/* Logo */}
          <Link href="/">
            <img src="/logo.png" alt="Connected" className="logo" />
          </Link>

          {/* Desktop Navigation */}
          <div className="nav-links">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} className={`nav-link ${isActive(item.href) ? "active" : ""}`}>
                {item.name}
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="auth-section">
            {user ? (
              <>
                <span style={{ fontSize: "14px", color: "#666" }}>{user.name || user.email || user.username}</span>
                <Link href="/profile" className="auth-link">
                  Profile
                </Link>
                {isAdmin && (
                  <Link href="/admin" className="auth-link">
                    Admin
                  </Link>
                )}
                <button
                  onClick={logout}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#666",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="auth-link">
                  Login
                </Link>
                <Link href="/auth/signup" className="signup-btn">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <div className="hamburger">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="mobile-menu">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="mobile-menu-item"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {user ? (
                <>
                  <div style={{ padding: "15px 20px", color: "#666", fontSize: "14px" }}>
                    Signed in as {user.name || user.email || user.username}
                  </div>
                  <Link href="/profile" className="mobile-menu-item" onClick={() => setMobileMenuOpen(false)}>
                    Profile
                  </Link>
                  {isAdmin && (
                    <Link href="/admin" className="mobile-menu-item" onClick={() => setMobileMenuOpen(false)}>
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout()
                      setMobileMenuOpen(false)
                    }}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "15px 20px",
                      background: "none",
                      border: "none",
                      borderBottom: "1px solid #eee",
                      cursor: "pointer",
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="mobile-menu-item" onClick={() => setMobileMenuOpen(false)}>
                    Login
                  </Link>
                  <Link href="/auth/signup" className="mobile-menu-item" onClick={() => setMobileMenuOpen(false)}>
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Spacer */}
      <div className="spacer"></div>
    </>
  )
}
