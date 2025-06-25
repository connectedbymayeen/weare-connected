import { NextResponse } from "next/server"
import { connectToDatabase } from "@/app/lib/mongodb"

export async function GET(request, { params }) {
  try {
    const resolvedParams = await params
    const { slug } = resolvedParams

    if (!slug) {
      return NextResponse.json({ error: "Job slug is required" }, { status: 400 })
    }

    console.log("API: Looking for job with slug:", slug)

    const { db } = await connectToDatabase()

    // Try to find by slug first
    let job = await db.collection("jobs").findOne({ slug })

    // If not found, try to find by _id (in case slug is actually an ID)
    if (!job) {
      try {
        const { ObjectId } = require("mongodb")
        if (ObjectId.isValid(slug)) {
          job = await db.collection("jobs").findOne({ _id: new ObjectId(slug) })
          console.log("API: Tried finding by ID:", job ? "Found" : "Not found")
        }
      } catch (err) {
        console.log("API: Error trying to find by ID:", err.message)
      }
    }

    console.log("API: Found job:", job ? "Yes" : "No")

    if (!job) {
      // Debug: List all jobs in the collection to see what's available
      const allJobs = await db.collection("jobs").find({}).toArray()
      console.log(
        "API: Available jobs:",
        allJobs.map((j) => ({ _id: j._id.toString(), slug: j.slug, title: j.title })),
      )

      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    // Convert MongoDB _id to string id for client-side use
    return NextResponse.json({
      ...job,
      id: job._id.toString(),
    })
  } catch (error) {
    console.error("API: Error fetching job:", error)
    return NextResponse.json({ error: "Failed to fetch job" }, { status: 500 })
  }
}
