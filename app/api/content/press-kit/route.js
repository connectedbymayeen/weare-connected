import { NextResponse } from "next/server"
import { connectToDatabase } from "@/app/lib/mongodb"

// GET all published press kit items
export async function GET() {
  try {
    const { db } = await connectToDatabase()

    const items = await db.collection("press_kit").find({ published: true }).sort({ createdAt: -1 }).toArray()

    // Group items by category
    const grouped = items.reduce((acc, item) => {
      const category = item.category || "other"
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(item)
      return acc
    }, {})

    return NextResponse.json({
      items,
      grouped,
      total: items.length,
    })
  } catch (error) {
    console.error("Error fetching press kit data:", error)
    return NextResponse.json({ error: "Failed to fetch press kit data" }, { status: 500 })
  }
}
