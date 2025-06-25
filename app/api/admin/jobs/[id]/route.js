import { NextResponse } from "next/server"
import { connectToDatabase } from "@/app/lib/mongodb"
import { ObjectId } from "mongodb"

// GET a single job by ID
export async function GET(request, { params }) {
  try {
    const resolvedParams = await params
    const { id } = resolvedParams

    if (!id) {
      return NextResponse.json({ error: "Job ID is required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const job = await db.collection("jobs").findOne({ _id: new ObjectId(id) })

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    return NextResponse.json({
      ...job,
      id: job._id.toString(),
    })
  } catch (error) {
    console.error("Error fetching job:", error)
    return NextResponse.json({ error: "Failed to fetch job" }, { status: 500 })
  }
}

// PUT update a job
export async function PUT(request, { params }) {
  try {
    const resolvedParams = await params
    const { id } = resolvedParams
    const data = await request.json()

    if (!id) {
      return NextResponse.json({ error: "Job ID is required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Remove id from data to avoid conflicts
    const { id: _, ...updateData } = data

    // Add updatedAt timestamp
    updateData.updatedAt = new Date()

    const result = await db.collection("jobs").updateOne({ _id: new ObjectId(id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    // Fetch and return the updated job
    const updatedJob = await db.collection("jobs").findOne({ _id: new ObjectId(id) })

    return NextResponse.json({
      ...updatedJob,
      id: updatedJob._id.toString(),
    })
  } catch (error) {
    console.error("Error updating job:", error)
    return NextResponse.json({ error: "Failed to update job" }, { status: 500 })
  }
}

// DELETE a job
export async function DELETE(request, { params }) {
  try {
    const resolvedParams = await params
    const { id } = resolvedParams

    if (!id) {
      return NextResponse.json({ error: "Job ID is required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const result = await db.collection("jobs").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Job deleted successfully" })
  } catch (error) {
    console.error("Error deleting job:", error)
    return NextResponse.json({ error: "Failed to delete job" }, { status: 500 })
  }
}
