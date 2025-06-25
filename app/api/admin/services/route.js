import { NextResponse } from "next/server"
import { verifyAuth } from "@/app/lib/auth"
import { connectToDatabase } from "@/app/lib/mongodb"

// GET all services
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

    const { db } = await connectToDatabase()

    // Build query
    const query = {}
    if (search) {
      query.$or = [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }]
    }
    if (status) query.status = status

    const services = await db.collection("services").find(query).sort({ createdAt: -1 }).toArray()

    return NextResponse.json(services)
  } catch (error) {
    console.error("Error fetching services:", error)
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 })
  }
}

// POST create new service
export async function POST(request) {
  try {
    // Verify admin authentication
    const { authenticated, isAdmin } = await verifyAuth(request)

    if (!authenticated || !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    // Validate required fields
    if (!data.title || !data.description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 })
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
    const existingService = await db.collection("services").findOne({ slug: data.slug })
    if (existingService) {
      return NextResponse.json({ error: "A service with this slug already exists" }, { status: 400 })
    }

    // Create service with timestamps
    const service = {
      ...data,
      status: data.status || "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("services").insertOne(service)

    return NextResponse.json(
      {
        message: "Service created successfully",
        id: result.insertedId,
        service: { ...service, _id: result.insertedId },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating service:", error)
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 })
  }
}
