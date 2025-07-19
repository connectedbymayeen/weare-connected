import { connectToDatabase } from "@/app/lib/mongodb"
import { verifyAuth } from "@/app/lib/auth"
import { NextResponse } from "next/server"

export async function GET(request) {
  try {
    console.log("Admin jobs GET request received")

    // Verify authentication
    const { authenticated } = await verifyAuth(request)
    if (!authenticated) {
      console.error("Authentication failed")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()
    const jobs = await db.collection("jobs").find({}).sort({ createdAt: -1 }).toArray()

    // Serialize the data
    const serializedJobs = jobs.map((job) => ({
      ...job,
      _id: job._id.toString(),
      createdAt: job.createdAt || new Date().toISOString(),
      updatedAt: job.updatedAt || new Date().toISOString(),
      thumbnailImage: job.thumbnailImage || "",
    }))

    console.log(`Found ${serializedJobs.length} jobs`)
    return NextResponse.json(serializedJobs)
  } catch (error) {
    console.error("Error fetching jobs:", error)
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    console.log("Admin jobs POST request received")

    // Verify authentication
    const { authenticated } = await verifyAuth(request)
    if (!authenticated) {
      console.error("Authentication failed")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    console.log("Job creation data:", {
      title: body.title,
      slug: body.slug,
      department: body.department,
      hasThumbnail: !!body.thumbnailImage,
    })

    // Validate required fields
    if (!body.title || !body.slug || !body.department || !body.location) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Check if slug already exists
    const existingJob = await db.collection("jobs").findOne({ slug: body.slug })
    if (existingJob) {
      return NextResponse.json({ error: "A job with this slug already exists" }, { status: 400 })
    }

    // Create job document
    const jobData = {
      title: body.title,
      slug: body.slug,
      description: body.description || "",
      shortDescription: body.shortDescription || "",
      thumbnailImage: body.thumbnailImage || "",
      department: body.department,
      location: body.location,
      type: body.type || "Full-time",
      salary: body.salary || "",
      experienceLevel: body.experienceLevel || "",
      technologies: body.technologies || [],
      responsibilities: body.responsibilities || [],
      requirements: body.requirements || [],
      benefits: body.benefits || [],
      status: body.status || "draft",
      applicationFormFields: body.applicationFormFields || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const result = await db.collection("jobs").insertOne(jobData)

    console.log("Job created successfully:", result.insertedId)

    // Return the created job
    const createdJob = {
      ...jobData,
      _id: result.insertedId.toString(),
    }

    return NextResponse.json(createdJob, { status: 201 })
  } catch (error) {
    console.error("Error creating job:", error)
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 })
  }
}
