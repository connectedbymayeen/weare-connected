import { connectToDatabase } from "@/app/lib/mongodb"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("Public jobs GET request received")

    const { db } = await connectToDatabase()

    // Only fetch published jobs (status: 'open')
    const jobs = await db.collection("jobs").find({ status: "open" }).sort({ createdAt: -1 }).toArray()

    // Serialize the data
    const serializedJobs = jobs.map((job) => ({
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
    }))

    console.log(`Found ${serializedJobs.length} published jobs`)
    return NextResponse.json(serializedJobs)
  } catch (error) {
    console.error("Error fetching jobs:", error)
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 })
  }
}
