import { NextResponse } from "next/server"
import { connectToDatabase } from "@/app/lib/mongodb"
import { verifyAuth } from "@/app/lib/auth"

export async function GET(request) {
  try {
    // Verify admin authentication
    const authResult = await verifyAuth(request)
    if (!authResult.authenticated || !authResult.isAdmin) {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const range = searchParams.get("range") || "30d"

    const { db } = await connectToDatabase()

    // Calculate date range
    const now = new Date()
    let startDate
    switch (range) {
      case "7d":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case "90d":
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      case "1y":
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
        break
      default: // 30d
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    }

    // Fetch analytics data
    const [
      totalUsers,
      newUsers,
      totalMessages,
      newMessages,
      totalJobs,
      totalApplications,
      newApplications,
      totalBlogPosts,
      publishedBlogs,
      totalVentures,
    ] = await Promise.all([
      db.collection("users").countDocuments(),
      db.collection("users").countDocuments({ createdAt: { $gte: startDate } }),
      db.collection("messages").countDocuments(),
      db.collection("messages").countDocuments({ createdAt: { $gte: startDate } }),
      db.collection("jobs").countDocuments({ status: "active" }),
      db.collection("job_applications").countDocuments(),
      db.collection("job_applications").countDocuments({ createdAt: { $gte: startDate } }),
      db.collection("blog").countDocuments(),
      db.collection("blog").countDocuments({ status: "published" }),
      db.collection("ventures").countDocuments(),
    ])

    // Key metrics
    const keyMetrics = [
      {
        title: "Total Users",
        value: totalUsers.toLocaleString(),
        change: `+${newUsers}`,
        trend: "up",
        icon: "Users",
      },
      {
        title: "Messages",
        value: totalMessages.toLocaleString(),
        change: `+${newMessages}`,
        trend: newMessages > 0 ? "up" : "neutral",
        icon: "MessageSquare",
      },
      {
        title: "Active Jobs",
        value: totalJobs.toLocaleString(),
        change: "Active",
        trend: "neutral",
        icon: "Briefcase",
      },
      {
        title: "Applications",
        value: totalApplications.toLocaleString(),
        change: `+${newApplications}`,
        trend: newApplications > 0 ? "up" : "neutral",
        icon: "FileText",
      },
      {
        title: "Blog Posts",
        value: publishedBlogs.toLocaleString(),
        change: `${totalBlogPosts} total`,
        trend: "neutral",
        icon: "FileText",
      },
      {
        title: "Ventures",
        value: totalVentures.toLocaleString(),
        change: "Active",
        trend: "neutral",
        icon: "TrendingUp",
      },
    ]

    // User growth data (simplified - you might want to aggregate by day)
    const userGrowth = await generateTimeSeriesData(db, "users", startDate, range)

    // Content performance
    const contentPerformance = [
      { type: "Blog Posts", count: totalBlogPosts },
      { type: "Jobs", count: totalJobs },
      { type: "Ventures", count: totalVentures },
      { type: "Messages", count: totalMessages },
    ]

    // Message sources
    const messageSources = [
      { name: "Contact Form", value: totalMessages },
      { name: "Job Applications", value: totalApplications },
    ]

    // Job applications trend
    const jobApplications = await generateTimeSeriesData(db, "job_applications", startDate, range)

    // Top content (simplified)
    const topContent = await db
      .collection("blog")
      .find({ status: "published" })
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray()

    const formattedTopContent = topContent.map((item) => ({
      title: item.title,
      type: "Blog Post",
      views: Math.floor(Math.random() * 1000) + 100, // Placeholder - implement real view tracking
    }))

    // Recent activity
    const recentActivity = await getRecentActivity(db, startDate)

    return NextResponse.json({
      keyMetrics,
      userGrowth,
      contentPerformance,
      messageSources,
      jobApplications,
      topContent: formattedTopContent,
      recentActivity,
    })
  } catch (error) {
    console.error("Analytics API error:", error)
    return NextResponse.json({ error: "Failed to fetch analytics data" }, { status: 500 })
  }
}

async function generateTimeSeriesData(db, collection, startDate, range) {
  // This is a simplified version - you might want to use MongoDB aggregation for better performance
  const data = []
  const days = range === "7d" ? 7 : range === "30d" ? 30 : range === "90d" ? 90 : 365

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
    const nextDate = new Date(date.getTime() + 24 * 60 * 60 * 1000)

    const count = await db.collection(collection).countDocuments({
      createdAt: { $gte: date, $lt: nextDate },
    })

    data.push({
      date: date.toISOString().split("T")[0],
      [collection === "users" ? "users" : "applications"]: count,
    })
  }

  return data
}

async function getRecentActivity(db, startDate) {
  const activities = []

  // Recent messages
  const recentMessages = await db
    .collection("messages")
    .find({ createdAt: { $gte: startDate } })
    .limit(3)
    .toArray()

  recentMessages.forEach((msg) => {
    activities.push({
      title: "New Message",
      description: `Message from ${msg.name}`,
      time: getTimeAgo(msg.createdAt),
      value: "1",
      icon: "MessageSquare",
    })
  })

  // Recent applications
  const recentApps = await db
    .collection("job_applications")
    .find({ createdAt: { $gte: startDate } })
    .limit(3)
    .toArray()

  recentApps.forEach((app) => {
    activities.push({
      title: "Job Application",
      description: `${app.fullName} applied`,
      time: getTimeAgo(app.createdAt),
      value: "1",
      icon: "Briefcase",
    })
  })

  return activities.sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 10)
}

function getTimeAgo(date) {
  const now = new Date()
  const diffInMs = now - new Date(date)
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInHours < 24) {
    return `${diffInHours} hours ago`
  } else {
    return `${diffInDays} days ago`
  }
}
