"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Users,
  FileText,
  MessageSquare,
  Briefcase,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Activity,
} from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/dashboard")
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
        setRecentActivity(data.recentActivity)
        setLastUpdated(new Date())
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()

    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const quickActions = [
    {
      title: "Create Blog Post",
      href: "/admin/blog/new",
      color: "bg-purple-emperor hover:bg-purple-emperor/90",
      icon: FileText,
    },
    {
      title: "Add Job Listing",
      href: "/admin/jobs/new",
      color: "bg-cobalite hover:bg-cobalite/90",
      icon: Briefcase,
    },
    {
      title: "View Messages",
      href: "/admin/messages",
      color: "bg-orange-600 hover:bg-orange-600/90",
      icon: MessageSquare,
    },
    {
      title: "Manage Users",
      href: "/admin/users",
      color: "bg-green-600 hover:bg-green-600/90",
      icon: Users,
    },
  ]

  if (loading && !stats) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Loading dashboard data...</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-8 bg-gray-200 rounded w-16"></div>
                    <div className="h-4 bg-gray-200 rounded w-12"></div>
                  </div>
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here's what's happening with your website.
            {lastUpdated && (
              <span className="text-sm text-gray-500 ml-2">Last updated: {lastUpdated.toLocaleTimeString()}</span>
            )}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={fetchDashboardData}
            disabled={loading}
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>
          <Button className="bg-purple-emperor hover:bg-purple-emperor/90">
            <Activity className="h-4 w-4 mr-2" />
            View Analytics
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats &&
          stats.map((stat) => (
            <Card
              key={stat.title}
              className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-purple-emperor"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      {stat.trend === "up" ? (
                        <ArrowUpRight className="h-4 w-4 text-green-600" />
                      ) : stat.trend === "down" ? (
                        <ArrowDownRight className="h-4 w-4 text-red-600" />
                      ) : null}
                      <span
                        className={`text-sm font-medium ml-1 ${
                          stat.trend === "up"
                            ? "text-green-600"
                            : stat.trend === "down"
                              ? "text-red-600"
                              : "text-gray-500"
                        }`}
                      >
                        {stat.change}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">vs last month</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor || "bg-gray-100"}`}>
                    <stat.icon className={`h-6 w-6 ${stat.iconColor || "text-gray-600"}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Recent Activity</span>
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/messages">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                  >
                    <div
                      className={`w-3 h-3 rounded-full ${
                        activity.type === "blog"
                          ? "bg-purple-emperor"
                          : activity.type === "job"
                            ? "bg-cobalite"
                            : activity.type === "message"
                              ? "bg-orange-600"
                              : activity.type === "application"
                                ? "bg-green-600"
                                : "bg-blue-600"
                      }`}
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-600">{activity.title}</p>
                    </div>
                    <span className="text-sm text-gray-500">{activity.time}</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No recent activity</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {quickActions.map((action) => (
                <Button key={action.title} className={`w-full justify-start ${action.color}`} asChild>
                  <Link href={action.href} className="flex items-center space-x-2">
                    <action.icon className="h-4 w-4" />
                    <span>{action.title}</span>
                  </Link>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
