import { NextResponse } from "next/server"
import { connectToDatabase } from "@/app/lib/mongodb"

// GET complete press kit download
export async function GET(request) {
  try {
    const { db } = await connectToDatabase()

    // Track complete kit download
    await db.collection("press_kit_downloads").insertOne({
      type: "complete_kit",
      downloadedAt: new Date(),
      userAgent: request.headers.get("user-agent"),
      ip: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip"),
    })

    // For now, redirect to a static ZIP file
    // In production, you might want to generate this dynamically
    return NextResponse.redirect(new URL("/press-kit-complete.zip", request.url))
  } catch (error) {
    console.error("Error handling complete kit download:", error)
    return NextResponse.json({ error: "Failed to download complete kit" }, { status: 500 })
  }
}
