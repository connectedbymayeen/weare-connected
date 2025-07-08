import { NextResponse } from "next/server"
import { connectToDatabase } from "@/app/lib/mongodb"
import { ObjectId } from "mongodb"

// POST download file
export async function POST(request) {
  try {
    const { itemId } = await request.json()

    if (!itemId) {
      return NextResponse.json({ error: "Item ID is required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Get the press kit item
    const item = await db.collection("press_kit").findOne({ _id: new ObjectId(itemId) })

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    if (!item.file) {
      return NextResponse.json({ error: "File not available" }, { status: 404 })
    }

    // Track download
    await db.collection("press_kit").updateOne(
      { _id: new ObjectId(itemId) },
      {
        $inc: { downloadCount: 1 },
        $set: { lastDownloaded: new Date() },
      },
    )

    // Log download for analytics
    await db.collection("press_kit_downloads").insertOne({
      itemId: new ObjectId(itemId),
      downloadedAt: new Date(),
      userAgent: request.headers.get("user-agent"),
      ip: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip"),
    })

    // Return the file URL for download
    return NextResponse.json({
      success: true,
      fileUrl: item.file,
      fileName: item.title,
      fileType: item.fileType,
    })
  } catch (error) {
    console.error("Error processing download:", error)
    return NextResponse.json({ error: "Failed to process download" }, { status: 500 })
  }
}
