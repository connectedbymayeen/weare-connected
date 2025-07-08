import { NextResponse } from "next/server"
// import { verifyAuth } from "@/lib/auth"
// import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { verifyAuth } from "@/app/lib/auth"
import { connectToDatabase } from "@/app/lib/mongodb"

export async function GET(request) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Connect to database
    const { db } = await connectToDatabase()

    // Get user profile
    const user = await db.collection("users").findOne(
      { _id: new ObjectId(authResult.user.id) },
      { projection: { password: 0 } }, // Exclude password
    )

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Serialize user data
    const serializedUser = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      company: user.company || "",
      jobTitle: user.jobTitle || "",
      location: user.location || "",
      website: user.website || "",
      bio: user.bio || "",
      profileImage: user.profileImage || "",
      emailNotifications: user.emailNotifications !== false,
      jobAlerts: user.jobAlerts !== false,
      marketingEmails: user.marketingEmails === true,
      securityAlerts: user.securityAlerts !== false,
      createdAt: user.createdAt?.toISOString(),
      lastLogin: user.lastLogin?.toISOString(),
      isActive: user.isActive !== false,
    }

    return NextResponse.json(serializedUser)
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json({ message: "Error fetching profile" }, { status: 500 })
  }
}

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

    // Update user profile
    const updateData = {
      name: body.name,
      email: body.email,
      phone: body.phone || "",
      company: body.company || "",
      jobTitle: body.jobTitle || "",
      location: body.location || "",
      website: body.website || "",
      bio: body.bio || "",
      updatedAt: new Date(),
    }

    // Add profile image if provided
    if (body.profileImage) {
      updateData.profileImage = body.profileImage
    }

    const result = await db
      .collection("users")
      .updateOne({ _id: new ObjectId(authResult.user.id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Profile updated successfully" })
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json({ message: "Error updating profile" }, { status: 500 })
  }
}
