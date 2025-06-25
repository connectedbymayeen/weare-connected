import { NextResponse } from "next/server"
import { connectToDatabase } from "@/app/lib/mongodb"
import { verifyAuth } from "@/app/lib/auth"

// GET all team members
export async function GET(request) {
  try {
    // Verify admin authentication
    const authResult = await verifyAuth(request)
    if (!authResult.authenticated || !authResult.isAdmin) {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 401 })
    }

    const { db } = await connectToDatabase()
    const teamMembers = await db.collection("team").find({}).sort({ createdAt: -1 }).toArray()

    // Serialize the data
    const serializedMembers = teamMembers.map((member) => ({
      ...member,
      _id: member._id.toString(),
      createdAt: member.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: member.updatedAt?.toISOString() || new Date().toISOString(),
    }))

    return NextResponse.json(serializedMembers)
  } catch (error) {
    console.error("Error fetching team members:", error)
    return NextResponse.json({ error: "Failed to fetch team members" }, { status: 500 })
  }
}

// POST new team member
export async function POST(request) {
  try {
    // Verify admin authentication
    const authResult = await verifyAuth(request)
    if (!authResult.authenticated || !authResult.isAdmin) {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 401 })
    }

    const data = await request.json()

    // Validate required fields
    if (!data.name || !data.role || !data.email) {
      return NextResponse.json({ error: "Name, role, and email are required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Check if email already exists
    const existingMember = await db.collection("team").findOne({ email: data.email })
    if (existingMember) {
      return NextResponse.json({ error: "A team member with this email already exists" }, { status: 400 })
    }

    // Create team member with timestamps
    const teamMember = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: data.status || "Active",
    }

    const result = await db.collection("team").insertOne(teamMember)

    return NextResponse.json(
      {
        message: "Team member created successfully",
        id: result.insertedId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating team member:", error)
    return NextResponse.json({ error: "Failed to create team member" }, { status: 500 })
  }
}
