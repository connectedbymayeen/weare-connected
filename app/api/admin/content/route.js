import { NextResponse } from "next/server"
import { connectToDatabase } from "@/app/lib/mongodb"

export async function POST(request) {
  try {
    const { content } = await request.json()

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Update or create the content document
    const result = await db.collection("site_content").updateOne(
      { type: "pages" },
      {
        $set: {
          content,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          type: "pages",
          createdAt: new Date(),
        },
      },
      { upsert: true },
    )

    return NextResponse.json({ success: true, result })
  } catch (error) {
    console.error("Error saving content:", error)
    return NextResponse.json({ error: "Failed to save content" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { db } = await connectToDatabase()

    const contentDoc = await db.collection("site_content").findOne({ type: "pages" })

    return NextResponse.json(contentDoc?.content || {})
  } catch (error) {
    console.error("Error fetching content:", error)
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 })
  }
}
