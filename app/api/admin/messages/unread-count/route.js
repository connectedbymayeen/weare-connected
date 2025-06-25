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

    // Count unread messages
    const count = await db.collection("messages").countDocuments({
      status: "unread",
    })

    return NextResponse.json({ count })
  } catch (error) {
    console.error("Unread count API error:", error)
    return NextResponse.json({ error: "Failed to fetch unread count" }, { status: 500 })
  }
}
