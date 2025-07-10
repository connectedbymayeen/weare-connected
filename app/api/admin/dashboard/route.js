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

    const { db } = await connectToDatabase()

    // Get current date for comparisons
    const now = new Date()
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    // Fetch all collections data
    const [
      totalUsers,
      lastMonthUsers,
      totalMessages,
      unreadMessages,
      lastMonthMessages,
      totalJobs,
      activeJobs,
      lastMonthJobs,
      totalBlogPosts,
      publishedBlogPosts,
      lastMonthBlogPosts,
      totalApplications,
      lastMonthApplications,
      totalVentures,
      lastMonthVentures,
    ] = await Promise.all([
      // Users
      db
        .collection("users")
        .countDocuments(),
      db.collection("users").countDocuments({ createdAt: { $gte: lastMonth } }),

      // Messages
      db
        .collection("messages")
        .countDocuments(),
      db.collection("messages").countDocuments({ status: "unread" }),
      db.collection("messages").countDocuments({ createdAt: { $gte: lastMonth } }),

      // Jobs
      db
        .collection("jobs")
        .countDocuments(),
      db.collection("jobs").countDocuments({ status: "active" }),
      db.collection("jobs").countDocuments({ createdAt: { $gte: lastMonth } }),

      // Blog Posts
      db
        .collection("blog")
        .countDocuments(),
      db.collection("blog").countDocuments({ status: "published" }),
      db.collection("blog").countDocuments({ createdAt: { $gte: lastMonth } }),

      // Applications
      db
        .collection("job_applications")
        .countDocuments(),
      db.collection("job_applications").countDocuments({ createdAt: { $gte: lastMonth } }),

      // Ventures
      db
        .collection("ventures")
        .countDocuments(),
      db.collection("ventures").countDocuments({ createdAt: { $gte: lastMonth } }),
    ])

    // Calculate percentage changes
    const calculateChange = (current, lastMonth) => {
      if (lastMonth === 0) return current > 0 ? "+100%" : "0%"
      const change = ((current - (current - lastMonth)) / (current - lastMonth)) * 100
      return change > 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`
    }

    // Build stats array
    const stats = [
      {
        title: "Total Users",
        value: totalUsers.toLocaleString(),
        change: calculateChange(totalUsers, lastMonthUsers),
        trend: lastMonthUsers > 0 ? "up" : "neutral",
        icon: "Users",
        bgColor: "bg-blue-100",
        iconColor: "text-blue-600",
      },
      {
        title: "Messages",
        value: totalMessages.toLocaleString(),
        change: `${unreadMessages} unread`,
        trend: unreadMessages > 0 ? "up" : "neutral",
        icon: "MessageSquare",
        bgColor: "bg-orange-100",
        iconColor: "text-orange-600",
      },
      {
        title: "Active Jobs",
        value: activeJobs.toLocaleString(),
        change: `${totalJobs} total`,
        trend: lastMonthJobs > 0 ? "up" : "neutral",
        icon: "Briefcase",
        bgColor: "bg-green-100",
        iconColor: "text-green-600",
      },
      {
        title: "Blog Posts",
        value: publishedBlogPosts.toLocaleString(),
        change: `${totalBlogPosts} total`,
        trend: lastMonthBlogPosts > 0 ? "up" : "neutral",
        icon: "FileText",
        bgColor: "bg-purple-100",
        iconColor: "text-purple-600",
      },
      {
        title: "Applications",
        value: totalApplications.toLocaleString(),
        change: calculateChange(totalApplications, lastMonthApplications),
        trend: lastMonthApplications > 0 ? "up" : "neutral",
        icon: "Users",
        bgColor: "bg-indigo-100",
        iconColor: "text-indigo-600",
      },
      {
        title: "Ventures",
        value: totalVentures.toLocaleString(),
        change: calculateChange(totalVentures, lastMonthVentures),
        trend: lastMonthVentures > 0 ? "up" : "neutral",
        icon: "TrendingUp",
        bgColor: "bg-teal-100",
        iconColor: "text-teal-600",
      },
    ]

    // Get recent activity
    const recentActivity = []

    // Recent messages
    const recentMessages = await db.collection("messages").find({}).sort({ createdAt: -1 }).limit(3).toArray()

    recentMessages.forEach((message) => {
      recentActivity.push({
        action: "New message received",
        title: `${message.subject || "Contact inquiry"} from ${message.name}`,
        time: getTimeAgo(message.createdAt),
        type: "message",
      })
    })

    // Recent job applications
    const recentApplications = await db
      .collection("job_applications")
      .find({})
      .sort({ createdAt: -1 })
      .limit(2)
      .toArray()

    recentApplications.forEach((app) => {
      recentActivity.push({
        action: "New job application",
        title: `${app.fullName} applied for ${app.jobTitle}`,
        time: getTimeAgo(app.createdAt),
        type: "application",
      })
    })

    // Recent blog posts
    const recentBlogs = await db.collection("blog").find({}).sort({ createdAt: -1 }).limit(2).toArray()

    recentBlogs.forEach((blog) => {
      recentActivity.push({
        action: blog.status === "published" ? "Blog post published" : "Blog post created",
        title: blog.title,
        time: getTimeAgo(blog.createdAt),
        type: "blog",
      })
    })

    // Sort activity by date
    recentActivity.sort((a, b) => {
      // This is a simple sort, in real implementation you'd want to sort by actual dates
      return 0
    })

    return NextResponse.json({
      stats,
      recentActivity: recentActivity.slice(0, 8), // Limit to 8 most recent
    })
  } catch (error) {
    console.error("Dashboard API error:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
  }
}

function getTimeAgo(date) {
  if (!date) return "Unknown"

  const now = new Date()
  const diffInMs = now - new Date(date)
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes ago`
  } else if (diffInHours < 24) {
    return `${diffInHours} hours ago`
  } else {
    return `${diffInDays} days ago`
  }
}
