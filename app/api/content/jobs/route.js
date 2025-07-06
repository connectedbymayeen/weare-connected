import { NextResponse } from "next/server"
import { connectToDatabase } from "@/app/lib/mongodb"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const department = searchParams.get("department")
    const location = searchParams.get("location")
    const type = searchParams.get("type")
    const search = searchParams.get("search")

    const { db } = await connectToDatabase()

    // Build query
    const query = { status: "open" }

    if (department) {
      query.department = department
    }

    if (location) {
      query.location = location
    }

    if (type) {
      query.type = type
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { department: { $regex: search, $options: "i" } },
      ]
    }

    const jobs = await db.collection("jobs").find(query).sort({ createdAt: -1 }).toArray()

    // Convert MongoDB _id to string id for client-side use
    return NextResponse.json(
      jobs.map((job) => ({
        ...job,
        id: job._id.toString(),
      })),
    )
  } catch (error) {
    console.error("Error fetching jobs:", error)
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 })
  }
}
