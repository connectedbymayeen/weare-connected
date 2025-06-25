import { NextResponse } from "next/server"
import { connectToDatabase } from "@/app/lib/mongodb"

// GET all case studies
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const featured = searchParams.get("featured") === "true"

    const { db } = await connectToDatabase()

    // Build query
    const query = {}
    if (category) query.category = category
    if (searchParams.has("featured")) query.featured = featured

    const caseStudies = await db.collection("caseStudies").find(query).toArray()

    return NextResponse.json(caseStudies)
  } catch (error) {
    console.error("Error fetching case studies:", error)
    return NextResponse.json({ error: "Failed to fetch case studies" }, { status: 500 })
  }
}

// POST new case study (admin only)
export async function POST(request) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.title || !data.client || !data.description) {
      return NextResponse.json({ error: "Title, client and description are required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Create case study with timestamps
    const caseStudy = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
      publishDate: data.publishDate || new Date(),
      status: data.status || "Published",
      featured: data.featured || false,
    }

    const result = await db.collection("caseStudies").insertOne(caseStudy)

    return NextResponse.json(
      {
        message: "Case study created successfully",
        id: result.insertedId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating case study:", error)
    return NextResponse.json({ error: "Failed to create case study" }, { status: 500 })
  }
}
