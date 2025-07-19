import { connectToDatabase } from "@/app/lib/mongodb"
import { verifyAuth } from "@/app/lib/auth"
import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"

export async function GET(request, { params }) {
  try {
    console.log("Admin job GET request received for ID:", params.id)

    // Verify authentication
    const { authenticated } = await verifyAuth(request)
    if (!authenticated) {
      console.error("Authentication failed")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()
    const job = await db.collection("jobs").findOne({ _id: new ObjectId(params.id) })

    if (!job) {
      console.error("Job not found:", params.id)
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    // Serialize the data
    const serializedJob = {
      ...job,
      _id: job._id.toString(),
      createdAt: job.createdAt || new Date().toISOString(),
      updatedAt: job.updatedAt || new Date().toISOString(),
      thumbnailImage: job.thumbnailImage || "",
    }

    console.log("Job found:", serializedJob.title)
    return NextResponse.json(serializedJob)
  } catch (error) {
    console.error("Error fetching job:", error)
    return NextResponse.json({ error: "Failed to fetch job" }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    console.log("Admin job PUT request received for ID:", params.id)

    // Verify authentication
    const { authenticated } = await verifyAuth(request)
    if (!authenticated) {
      console.error("Authentication failed")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    console.log("Job update data:", {
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

    // Check if slug already exists (excluding current job)
    const existingJob = await db.collection("jobs").findOne({
      slug: body.slug,
      _id: { $ne: new ObjectId(params.id) },
    })
    if (existingJob) {
      return NextResponse.json({ error: "A job with this slug already exists" }, { status: 400 })
    }

    // Update job document
    const updateData = {
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
      updatedAt: new Date().toISOString(),
    }

    const result = await db.collection("jobs").updateOne({ _id: new ObjectId(params.id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    console.log("Job updated successfully:", params.id)

    // Return the updated job
    const updatedJob = await db.collection("jobs").findOne({ _id: new ObjectId(params.id) })
    const serializedJob = {
      ...updatedJob,
      _id: updatedJob._id.toString(),
    }

    return NextResponse.json(serializedJob)
  } catch (error) {
    console.error("Error updating job:", error)
    return NextResponse.json({ error: "Failed to update job" }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    console.log("Admin job DELETE request received for ID:", params.id)

    // Verify authentication
    const { authenticated } = await verifyAuth(request)
    if (!authenticated) {
      console.error("Authentication failed")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()
    const result = await db.collection("jobs").deleteOne({ _id: new ObjectId(params.id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    console.log("Job deleted successfully:", params.id)
    return NextResponse.json({ message: "Job deleted successfully" })
  } catch (error) {
    console.error("Error deleting job:", error)
    return NextResponse.json({ error: "Failed to delete job" }, { status: 500 })
  }
}

export async function PATCH(request, { params }) {
  try {
    console.log("Admin job PATCH request received for ID:", params.id)

    // Verify authentication
    const { authenticated } = await verifyAuth(request)
    if (!authenticated) {
      console.error("Authentication failed")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { db } = await connectToDatabase()

    // Update only the provided fields
    const updateData = {
      ...body,
      updatedAt: new Date().toISOString(),
    }

    const result = await db.collection("jobs").updateOne({ _id: new ObjectId(params.id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    console.log("Job patched successfully:", params.id)

    // Return the updated job
    const updatedJob = await db.collection("jobs").findOne({ _id: new ObjectId(params.id) })
    const serializedJob = {
      ...updatedJob,
      _id: updatedJob._id.toString(),
    }

    return NextResponse.json(serializedJob)
  } catch (error) {
    console.error("Error patching job:", error)
    return NextResponse.json({ error: "Failed to update job" }, { status: 500 })
  }
}
