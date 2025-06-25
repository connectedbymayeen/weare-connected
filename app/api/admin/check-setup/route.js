import { connectToDatabase } from "@/app/lib/mongodb"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const { db } = await connectToDatabase()

    // Check if any admin users exist
    const adminCount = await db.collection("admins").countDocuments()

    // Also check if we can connect to the database
    const collections = await db.listCollections().toArray()

    return NextResponse.json({
      success: true,
      adminCount,
      collections: collections.map((c) => c.name),
      databaseConnected: true,
    })
  } catch (error) {
    console.error("Database check error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        databaseConnected: false,
      },
      { status: 500 },
    )
  }
}
