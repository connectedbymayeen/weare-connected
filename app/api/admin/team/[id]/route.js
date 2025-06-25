import { NextResponse } from "next/server"
import { connectToDatabase } from "@/app/lib/mongodb"
import { verifyAuth } from "@/app/lib/auth"
import { ObjectId } from "mongodb"

// GET single team member
export async function GET(request, { params }) {
  try {
    const authResult = await verifyAuth(request)
    if (!authResult.authenticated || !authResult.isAdmin) {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 401 })
    }

    const { db } = await connectToDatabase()
    const teamMember = await db.collection("team").findOne({ _id: new ObjectId(params.id) })

    if (!teamMember) {
      return NextResponse.json({ error: "Team member not found" }, { status: 404 })
    }

    // Serialize the data
    const serializedMember = {
      ...teamMember,
      _id: teamMember._id.toString(),
      createdAt: teamMember.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: teamMember.updatedAt?.toISOString() || new Date().toISOString(),
    }

    return NextResponse.json(serializedMember)
  } catch (error) {
    console.error("Error fetching team member:", error)
    return NextResponse.json({ error: "Failed to fetch team member" }, { status: 500 })
  }
}

// PUT update team member
export async function PUT(request, { params }) {
  try {
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

    // Check if email already exists for other members
    const existingMember = await db.collection("team").findOne({
      email: data.email,
      _id: { $ne: new ObjectId(params.id) },
    })
    if (existingMember) {
      return NextResponse.json({ error: "A team member with this email already exists" }, { status: 400 })
    }

    // Update team member
    const updateData = {
      ...data,
      updatedAt: new Date(),
    }

    const result = await db.collection("team").updateOne({ _id: new ObjectId(params.id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Team member not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Team member updated successfully" })
  } catch (error) {
    console.error("Error updating team member:", error)
    return NextResponse.json({ error: "Failed to update team member" }, { status: 500 })
  }
}

// DELETE team member
export async function DELETE(request, { params }) {
  try {
    const authResult = await verifyAuth(request)
    if (!authResult.authenticated || !authResult.isAdmin) {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 401 })
    }

    const { db } = await connectToDatabase()

    const result = await db.collection("team").deleteOne({ _id: new ObjectId(params.id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Team member not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Team member deleted successfully" })
  } catch (error) {
    console.error("Error deleting team member:", error)
    return NextResponse.json({ error: "Failed to delete team member" }, { status: 500 })
  }
}
