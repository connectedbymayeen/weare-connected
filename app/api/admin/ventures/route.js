import { verifyAuth } from "@/app/lib/auth"
import { connectToDatabase } from "@/app/lib/mongodb"
import { NextResponse } from "next/server"

// GET all ventures without filtering by status
export async function GET(request) {
  try {
    // Verify admin authentication
    const { authenticated, isAdmin } = await verifyAuth(request)

    if (!authenticated || !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    // const status = searchParams.get("status") || ""  // <-- Remove this line

    const { db } = await connectToDatabase()

    // Build query
    const query = {}
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tagline: { $regex: search, $options: "i" } },
      ]
    }
    // Remove filtering by status completely
    // if (status) query.status = status

    const ventures = await db.collection("ventures").find(query).sort({ createdAt: -1 }).toArray()

    // Ensure ctaDescription is present and stringified (optional transformation)
    const transformedVentures = ventures.map((venture) => ({
      ...venture,
      id: venture._id.toString(),
      ctaDescription: venture.ctaDescription || "",
    }))

    return NextResponse.json(transformedVentures)
  } catch (error) {
    console.error("Error fetching ventures:", error)
    return NextResponse.json({ error: "Failed to fetch ventures" }, { status: 500 })
  }
}

// POST create new venture
export async function POST(request) {
  try {
    // Verify admin authentication
    const { authenticated, isAdmin } = await verifyAuth(request)

    if (!authenticated || !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    // Validate required fields
    if (!data.name || !data.description || !data.tagline) {
      return NextResponse.json({ error: "Name, description, and tagline are required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Create slug from name if not provided
    if (!data.slug) {
      data.slug = data.name
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "-")
    }

    // Check if slug already exists
    const existingVenture = await db.collection("ventures").findOne({ slug: data.slug })
    if (existingVenture) {
      return NextResponse.json({ error: "A venture with this slug already exists" }, { status: 400 })
    }

    // Create venture with timestamps
    const venture = {
      ...data,
      ctaDescription: data.ctaDescription || "",
      status: data.status || "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("ventures").insertOne(venture)

    return NextResponse.json(
      {
        message: "Venture created successfully",
        id: result.insertedId,
        venture: { ...venture, _id: result.insertedId },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating venture:", error)
    return NextResponse.json({ error: "Failed to create venture" }, { status: 500 })
  }
}
