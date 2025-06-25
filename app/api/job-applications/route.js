import { connectToDatabase } from "@/app/lib/mongodb"
import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const body = await request.json()
    const { db } = await connectToDatabase()

    // Create application document
    const application = {
      jobId: body.jobId,
      jobTitle: body.jobTitle,
      jobSlug: body.jobSlug,
      applicantInfo: {
        fullName: body.applicantInfo.fullName,
        email: body.applicantInfo.email,
        phone: body.applicantInfo.phone,
        linkedin: body.applicantInfo.linkedin || "",
        portfolio: body.applicantInfo.portfolio || "",
        coverLetter: body.applicantInfo.coverLetter,
        experience: body.applicantInfo.experience || "",
        expectedSalary: body.applicantInfo.expectedSalary || "",
        availableFrom: body.applicantInfo.availableFrom || "",
      },
      attachments: body.attachments || {},
      status: "pending",
      appliedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("job_applications").insertOne(application)

    return NextResponse.json({
      success: true,
      applicationId: result.insertedId,
      message: "Application submitted successfully",
    })
  } catch (error) {
    console.error("Error submitting job application:", error)
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 })
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const search = searchParams.get("search")

    const { db } = await connectToDatabase()

    const query = {}
    if (status && status !== "all") {
      query.status = status
    }
    if (search) {
      query.$or = [
        { "applicantInfo.fullName": { $regex: search, $options: "i" } },
        { "applicantInfo.email": { $regex: search, $options: "i" } },
        { jobTitle: { $regex: search, $options: "i" } },
      ]
    }

    const applications = await db.collection("job_applications").find(query).sort({ appliedAt: -1 }).toArray()

    return NextResponse.json(applications)
  } catch (error) {
    console.error("Error fetching applications:", error)
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 })
  }
}
