import { connectToDatabase } from "@/app/lib/mongodb"
import { NextResponse } from "next/server"

export async function GET(request, { params }) {
  try {
    console.log("Public job GET request received for slug:", params.slug)

    const { db } = await connectToDatabase()
    const job = await db.collection("jobs").findOne({
      slug: params.slug,
      status: "open", // Only return published jobs
    })

    if (!job) {
      console.error("Job not found or not published:", params.slug)
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    // Serialize the data
    const serializedJob = {
      _id: job._id.toString(),
      title: job.title,
      slug: job.slug,
      description: job.description,
      shortDescription: job.shortDescription,
      thumbnailImage: job.thumbnailImage || "",
      department: job.department,
      location: job.location,
      type: job.type,
      salary: job.salary,
      experienceLevel: job.experienceLevel,
      technologies: job.technologies || [],
      responsibilities: job.responsibilities || [],
      requirements: job.requirements || [],
      benefits: job.benefits || [],
      status: job.status,
      applicationFormFields: job.applicationFormFields || [],
      createdAt: job.createdAt || new Date().toISOString(),
      updatedAt: job.updatedAt || new Date().toISOString(),
    }

    console.log("Job found:", serializedJob.title, "- Form fields:", serializedJob.applicationFormFields?.length || 0)
    return NextResponse.json(serializedJob)
  } catch (error) {
    console.error("Error fetching job:", error)
    return NextResponse.json({ error: "Failed to fetch job" }, { status: 500 })
  }
}
