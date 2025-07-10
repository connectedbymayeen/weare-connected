import { NextResponse } from "next/server"
import { connectToDatabase } from "@/app/lib/mongodb"

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const offices = await db.collection("offices").find({}).sort({ createdAt: -1 }).toArray()

    return NextResponse.json(offices)
  } catch (error) {
    console.error("Error fetching offices:", error)
    return NextResponse.json({ error: "Failed to fetch offices" }, { status: 500 })
  }
}
