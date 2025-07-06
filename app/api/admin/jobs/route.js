import { NextResponse } from "next/server"
import { connectToDatabase } from "@/app/lib/mongodb"
import { verifyAuth } from "@/app/lib/auth"

// GET all jobs
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
    const department = searchParams.get("department") || ""
    const location = searchParams.get("location") || ""

    const { db } = await connectToDatabase()

    // Build query
    const query = {}
    if (search) {
      query.$or = [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }]
    }
    if (status) query.status = status
    if (department) query.department = department
    if (location) query.location = location

    const jobs = await db.collection("jobs").find(query).sort({ createdAt: -1 }).toArray()

    return NextResponse.json(jobs)
  } catch (error) {
    console.error("Error fetching jobs:", error)
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 })
  }
}

// POST create new job
export async function POST(request) {
  try {
    // Verify admin authentication
    const { authenticated, isAdmin } = await verifyAuth(request)

    if (!authenticated || !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    // Validate required fields
    if (!data.title || !data.description || !data.department || !data.location) {
      return NextResponse.json({ error: "Title, description, department, and location are required" }, { status: 400 })
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
    const existingJob = await db.collection("jobs").findOne({ slug: data.slug })
    if (existingJob) {
      return NextResponse.json({ error: "A job with this slug already exists" }, { status: 400 })
    }

    // Create job with timestamps
    const job = {
      ...data,
      status: data.status || "open",
      createdAt: new Date(),
      updatedAt: new Date(),
      postedDate: new Date(),
    }

    const result = await db.collection("jobs").insertOne(job)

    return NextResponse.json(
      {
        message: "Job created successfully",
        id: result.insertedId,
        job: { ...job, _id: result.insertedId },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating job:", error)
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 })
  }
}
