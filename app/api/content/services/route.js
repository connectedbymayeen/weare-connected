import { connectToDatabase } from "@/app/lib/mongodb"
import { NextResponse } from "next/server"
// import { connectToDatabase } from "@/lib/mongodb"

// GET all services
export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const services = await db.collection("services").find({}).toArray()

    return NextResponse.json(services)
  } catch (error) {
    console.error("Error fetching services:", error)
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 })
  }
}

// POST new service (admin only)
export async function POST(request) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.title || !data.description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Create service with timestamps
    const service = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("services").insertOne(service)

    return NextResponse.json(
      {
        message: "Service created successfully",
        id: result.insertedId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating service:", error)
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 })
  }
}
