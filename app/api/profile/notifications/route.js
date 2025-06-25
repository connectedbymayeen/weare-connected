import { NextResponse } from "next/server"
import { verifyAuth } from "@/app/lib/auth"
import { connectToDatabase } from "@/app/lib/mongodb"
import { ObjectId } from "mongodb"

export async function PUT(request) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // Connect to database
    const { db } = await connectToDatabase()

    // Update notification preferences
    const updateData = {
      emailNotifications: body.emailNotifications === true,
      jobAlerts: body.jobAlerts === true,
      marketingEmails: body.marketingEmails === true,
      securityAlerts: body.securityAlerts === true,
      updatedAt: new Date(),
    }

    const result = await db
      .collection("users")
      .updateOne({ _id: new ObjectId(authResult.user.id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Notification preferences updated successfully" })
  } catch (error) {
    console.error("Error updating notifications:", error)
    return NextResponse.json({ message: "Error updating notification preferences" }, { status: 500 })
  }
}
