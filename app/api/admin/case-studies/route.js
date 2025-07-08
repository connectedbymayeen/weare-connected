import { NextResponse } from "next/server"
import { connectToDatabase } from "@/app/lib/mongodb"
import { verifyAuth } from "@/app/lib/auth"

// GET all case studies
export async function GET(request) {
  try {
    // Verify admin authentication
    const { authenticated, isAdmin } = await verifyAuth(request)

    if (!authenticated || !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || ""
    const industry = searchParams.get("industry") || ""

    const { db } = await connectToDatabase()

    // Build query
    const query = {}
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { client: { $regex: search, $options: "i" } },
      ]
    }
    if (status) query.status = status
    if (industry) query.industry = industry

    const caseStudies = await db.collection("case_studies").find(query).sort({ createdAt: -1 }).toArray()

    return NextResponse.json(caseStudies)
  } catch (error) {
    console.error("Error fetching case studies:", error)
    return NextResponse.json({ error: "Failed to fetch case studies" }, { status: 500 })
  }
}

// POST create new case study
export async function POST(request) {
  try {
    // Verify admin authentication
    const { authenticated, isAdmin } = await verifyAuth(request)

    if (!authenticated || !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    // Validate required fields
    if (!data.title || !data.description || !data.client) {
      return NextResponse.json({ error: "Title, description, and client are required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Create slug from title if not provided
    if (!data.slug) {
      data.slug = data.title
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "-")
    }

    // Check if slug already exists
    const existingCaseStudy = await db.collection("case_studies").findOne({ slug: data.slug })
    if (existingCaseStudy) {
      return NextResponse.json({ error: "A case study with this slug already exists" }, { status: 400 })
    }

    // Create case study with timestamps
    const caseStudy = {
      ...data,
      status: data.status || "published",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("case_studies").insertOne(caseStudy)

    return NextResponse.json(
      {
        message: "Case study created successfully",
        id: result.insertedId,
        caseStudy: { ...caseStudy, _id: result.insertedId },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating case study:", error)
    return NextResponse.json({ error: "Failed to create case study" }, { status: 500 })
  }
}
