import { NextResponse } from "next/server"
import { connectToDatabase, isMongoDBAvailable } from "@/app/lib/mongodb"

export async function GET() {
  try {
    console.log("=== DATABASE DEBUG ===")

    // Environment check
    const envVars = {
      MONGODB_URI: !!process.env.MONGODB_URI,
      MONGODB_DB: !!process.env.MONGODB_DB,
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: !!process.env.VERCEL,
      VERCEL_ENV: process.env.VERCEL_ENV,
    }

    console.log("Environment variables:", envVars)

    if (!isMongoDBAvailable()) {
      return NextResponse.json({
        error: "MongoDB not configured",
        env: envVars,
      })
    }

    // Test database connection
    const { db } = await connectToDatabase()

    // List all collections
    const collections = await db.listCollections().toArray()
    const collectionNames = collections.map((c) => c.name)

    // Count documents in each collection
    const collectionCounts = {}
    for (const collection of collectionNames) {
      try {
        collectionCounts[collection] = await db.collection(collection).countDocuments()
      } catch (err) {
        collectionCounts[collection] = `Error: ${err.message}`
      }
    }

    return NextResponse.json({
      success: true,
      env: envVars,
      collections: collectionNames,
      counts: collectionCounts,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Database debug error:", error)
    return NextResponse.json(
      {
        error: error.message,
        stack: error.stack,
        env: {
          MONGODB_URI: !!process.env.MONGODB_URI,
          MONGODB_DB: !!process.env.MONGODB_DB,
          NODE_ENV: process.env.NODE_ENV,
        },
      },
      { status: 500 },
    )
  }
}
