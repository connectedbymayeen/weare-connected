import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { connectToDatabase } from "@/app/lib/mongodb"
import { verifyAuth } from "@/app/lib/auth"

export async function GET(request, { params }) {
  try {
    const { id } = await params

    // Verify admin authorization
    const authResult = await verifyAuth(request)
    if (!authResult.authenticated || !authResult.isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Connect to database
    const { db } = await connectToDatabase()

    // Find user by ID
    let user
    try {
      user = await db.collection("users").findOne({ _id: new ObjectId(id) })
    } catch (error) {
      user = await db.collection("users").findOne({ _id: id })
    }

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Remove sensitive information
    const sanitizedUser = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      isActive: user.isActive,
      createdAt: user.createdAt?.toISOString(),
      lastLogin: user.lastLogin?.toISOString(),
    }

    return NextResponse.json(sanitizedUser)
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ message: "Error fetching user" }, { status: 500 })
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params
    const body = await request.json()

    // Verify admin authorization
    const authResult = await verifyAuth(request)
    if (!authResult.authenticated || !authResult.isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Connect to database
    const { db } = await connectToDatabase()

    // Handle different actions
    if (body.action === "toggle-status") {
      const result = await db.collection("users").updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            isActive: body.isActive,
            updatedAt: new Date(),
          },
        },
      )

      if (result.matchedCount === 0) {
        return NextResponse.json({ message: "User not found" }, { status: 404 })
      }

      return NextResponse.json({
        message: "User status updated successfully",
        isActive: body.isActive,
      })
    }

    return NextResponse.json({ message: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ message: "Error updating user" }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params

    // Verify admin authorization
    const authResult = await verifyAuth(request)
    if (!authResult.authenticated || !authResult.isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Connect to database
    const { db } = await connectToDatabase()

    // Delete user
    const result = await db.collection("users").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "User deleted successfully" })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ message: "Error deleting user" }, { status: 500 })
  }
}
