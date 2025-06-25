import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import bcrypt from "bcryptjs"
import { verifyAuth } from "@/app/lib/auth"
import { connectToDatabase } from "@/app/lib/mongodb"

export async function POST(request) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { currentPassword, newPassword } = await request.json()

    // Validation
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ message: "Current password and new password are required" }, { status: 400 })
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ message: "New password must be at least 6 characters long" }, { status: 400 })
    }

    // Connect to database
    const { db } = await connectToDatabase()

    // Get user with password
    const user = await db.collection("users").findOne({ _id: new ObjectId(authResult.user.id) })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password)
    if (!isCurrentPasswordValid) {
      return NextResponse.json({ message: "Current password is incorrect" }, { status: 400 })
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12)

    // Update password
    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(authResult.user.id) },
      {
        $set: {
          password: hashedNewPassword,
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Failed to update password" }, { status: 500 })
    }

    return NextResponse.json({ message: "Password changed successfully" })
  } catch (error) {
    console.error("Error changing password:", error)
    return NextResponse.json({ message: "Error changing password" }, { status: 500 })
  }
}
