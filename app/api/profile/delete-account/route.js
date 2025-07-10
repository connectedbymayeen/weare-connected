import { NextResponse } from "next/server"
import { verifyAuth } from "@/app/lib/auth"
import { connectToDatabase } from "@/app/lib/mongodb"
import { ObjectId } from "mongodb"

export async function DELETE(request) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Connect to database
    const { db } = await connectToDatabase()

    // Delete user's job applications
    await db.collection("job_applications").deleteMany({ userId: authResult.user.id })

    // Delete user account
    const result = await db.collection("users").deleteOne({ _id: new ObjectId(authResult.user.id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Clear authentication cookies
    const response = NextResponse.json({ message: "Account deleted successfully" })

    response.cookies.set("auth-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(0),
    })

    return response
  } catch (error) {
    console.error("Error deleting account:", error)
    return NextResponse.json({ message: "Error deleting account" }, { status: 500 })
  }
}
