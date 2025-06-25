import { NextResponse } from "next/server"
// import { getAllUsers } from "@/lib/models/user"
// import { verifyAuth } from "@/lib/auth"
import { getAllUsers } from "@/app/lib/models/user"
import { verifyAuth } from "@/app/lib/auth"

export async function GET(request) {
  try {
    // Verify admin authorization
    const authResult = await verifyAuth(request)

    console.log("Auth result:", authResult) // Debug logging

    if (!authResult.authenticated || !authResult.isAdmin) {
      console.log("Authentication failed:", {
        authenticated: authResult.authenticated,
        isAdmin: authResult.isAdmin,
        user: authResult.user,
      })
      return NextResponse.json({ message: "Unauthorized - Admin access required" }, { status: 401 })
    }

    // Get all users
    const users = await getAllUsers()

    // Remove sensitive information and ensure proper serialization
    const sanitizedUsers = users.map((user) => ({
      id: user._id?.toString() || user.id,
      name: user.name || "Unknown User",
      email: user.email,
      profileImage: user.profileImage || null,
      isActive: user.isActive !== false, // Default to true if not set
      createdAt: user.createdAt ? user.createdAt.toISOString() : new Date().toISOString(),
      lastLogin: user.lastLogin ? user.lastLogin.toISOString() : null,
    }))

    console.log(`Returning ${sanitizedUsers.length} users`) // Debug logging

    return NextResponse.json(sanitizedUsers)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      {
        message: "Error fetching users",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
