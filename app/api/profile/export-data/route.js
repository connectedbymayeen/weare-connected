import { NextResponse } from "next/server"
import { verifyAuth } from "@/app/lib/auth"
import { connectToDatabase } from "@/app/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Connect to database
    const { db } = await connectToDatabase()

    // Get user data
    const user = await db.collection("users").findOne(
      { _id: new ObjectId(authResult.user.id) },
      { projection: { password: 0 } }, // Exclude password
    )

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Get user's job applications
    const applications = await db.collection("job_applications").find({ userId: authResult.user.id }).toArray()

    // Prepare export data
    const exportData = {
      profile: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone,
        company: user.company,
        jobTitle: user.jobTitle,
        location: user.location,
        website: user.website,
        bio: user.bio,
        profileImage: user.profileImage,
        createdAt: user.createdAt?.toISOString(),
        lastLogin: user.lastLogin?.toISOString(),
        isActive: user.isActive,
      },
      notifications: {
        emailNotifications: user.emailNotifications,
        jobAlerts: user.jobAlerts,
        marketingEmails: user.marketingEmails,
        securityAlerts: user.securityAlerts,
      },
      applications: applications.map((app) => ({
        id: app._id.toString(),
        jobId: app.jobId,
        jobTitle: app.jobTitle,
        company: app.company,
        appliedAt: app.createdAt?.toISOString(),
        status: app.status,
        coverLetter: app.coverLetter,
        resumeUrl: app.resumeUrl,
      })),
      exportedAt: new Date().toISOString(),
    }

    // Create JSON response
    const jsonData = JSON.stringify(exportData, null, 2)

    return new NextResponse(jsonData, {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="profile-data-${new Date().toISOString().split("T")[0]}.json"`,
      },
    })
  } catch (error) {
    console.error("Error exporting data:", error)
    return NextResponse.json({ message: "Error exporting data" }, { status: 500 })
  }
}
