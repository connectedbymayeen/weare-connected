"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Users,
  MessageSquare,
  Settings,
  ImageIcon,
  Calendar,
  BarChart3,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  UserCheck,
  UserPlus,
  User,
  SettingsIcon,
  Building,
} from "lucide-react";
import { Suspense } from "react";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Content Management",
    icon: FileText,
    items: [
      { title: "Blog Posts", href: "/admin/blog" },
      { title: "Ventures", href: "/admin/ventures" },
      { title: "Services", href: "/admin/services" },
      { title: "Case Studies", href: "/admin/case-studies" },
      { title: "Press Kit", href: "/admin/press-kit" },
    ],
  },
  {
    title: "Jobs & Careers",
    href: "/admin/jobs",
    icon: Briefcase,
  },
  {
    title: "Team Management",
    href: "/admin/team",
    icon: UserPlus,
  },
  {
    title: "Applications",
    href: "/admin/applications",
    label: "Applications",
    icon: UserCheck,
  },
  {
    title: "Messages",
    href: "/admin/messages",
    icon: MessageSquare,
    badge: "12",
  },
  {
    title: "Media Library",
    href: "/admin/media",
    icon: ImageIcon,
  },
  {
    title: "Users",
    href: "/admin/users",
    label: "Users",
    icon: Users,
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "Content",
    href: "/admin/content",
    icon: SettingsIcon,
  },
  {
    title: "Offices",
    href: "/admin/offices",
    icon: Building,
    current: false,
  },
];

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState(["Content Management"]);
  const pathname = usePathname();

  const toggleExpanded = (title) => {
    setExpandedItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  };


   const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (data.success) {
        // Clear any client-side storage
        if (typeof window !== "undefined") {
          localStorage.clear()
          sessionStorage.clear()
        }

        // Redirect to home page
        window.location.href = "/"
      } else {
        console.error("Logout failed:", data.message)
        // Still redirect even if API fails
        window.location.href = "/"
      }
    } catch (error) {
      console.error("Logout error:", error)
      // Redirect to home even if there's an error
      window.location.href = "/"
    }
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen bg-gray-50">
        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <Link href="/admin" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-emperor to-cobalite rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="font-bold text-gray-900">Admin Panel</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {sidebarItems.map((item) => (
              <div key={item.title}>
                {item.items ? (
                  <div>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-between text-left font-medium",
                        expandedItems.includes(item.title) &&
                          "text-purple-emperor"
                      )}
                      onClick={() => toggleExpanded(item.title)}
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </div>
                      <Calendar
                        className={cn(
                          "h-4 w-4 transition-transform",
                          expandedItems.includes(item.title) && "rotate-180"
                        )}
                      />
                    </Button>
                    {expandedItems.includes(item.title) && (
                      <div className="ml-8 mt-2 space-y-1">
                        {item.items.map((subItem) => (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className={cn(
                              "block px-3 py-2 text-sm rounded-md transition-colors",
                              pathname === subItem.href
                                ? "bg-purple-emperor text-white"
                                : "text-gray-600 hover:bg-gray-100"
                            )}
                          >
                            {subItem.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-md transition-colors",
                      pathname === item.href
                        ? "bg-purple-emperor text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.title}</span>
                    </div>
                    {item.badge && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-emperor to-cobalite rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Admin User</p>
                <p className="text-sm text-gray-500">admin@connected.com</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Logout"
            >
              <LogOut className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:ml-64">
          {/* Top header */}
          <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-emperor focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                </Button>
                <div className="w-8 h-8 bg-gradient-to-r from-purple-emperor to-cobalite rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="p-6">{children}</main>
        </div>
      </div>
    </Suspense>
  );
}
