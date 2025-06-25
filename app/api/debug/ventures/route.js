import { NextResponse } from "next/server"
import { connectToDatabase, isMongoDBAvailable } from "@/app/lib/mongodb"

export async function GET() {
  try {
    console.log("=== VENTURES DEBUG ===")

    // Check environment variables
    const mongoUri = process.env.MONGODB_URI
    const mongoDb = process.env.MONGODB_DB

    console.log("MongoDB URI exists:", !!mongoUri)
    console.log("MongoDB DB exists:", !!mongoDb)
    console.log("MongoDB available:", isMongoDBAvailable())

    if (!isMongoDBAvailable()) {
      return NextResponse.json({
        error: "MongoDB not available",
        mongoUri: !!mongoUri,
        mongoDb: !!mongoDb,
        env: process.env.NODE_ENV,
      })
    }

    // Try to connect to database
    const { db } = await connectToDatabase()
    console.log("Database connected successfully")

    // Check if ventures collection exists
    const collections = await db.listCollections().toArray()
    const venturesCollection = collections.find((col) => col.name === "ventures")
    console.log("Ventures collection exists:", !!venturesCollection)

    // Get all ventures (including inactive ones for debugging)
    const allVentures = await db.collection("ventures").find({}).toArray()
    console.log("Total ventures in DB:", allVentures.length)

    // Get active ventures
    const activeVentures = await db
      .collection("ventures")
      .find({
        $or: [{ status: "active" }, { status: "scaling" }],
      })
      .toArray()
    console.log("Active ventures:", activeVentures.length)

    return NextResponse.json({
      success: true,
      mongoUri: !!mongoUri,
      mongoDb: !!mongoDb,
      totalVentures: allVentures.length,
      activeVentures: activeVentures.length,
      ventures: allVentures.map((v) => ({
        id: v._id.toString(),
        name: v.name,
        status: v.status,
        slug: v.slug,
      })),
      collections: collections.map((c) => c.name),
    })
  } catch (error) {
    console.error("Ventures debug error:", error)
    return NextResponse.json(
      {
        error: error.message,
        stack: error.stack,
        mongoUri: !!process.env.MONGODB_URI,
        mongoDb: !!process.env.MONGODB_DB,
      },
      { status: 500 },
    )
  }
}
