import { verifyAuth } from "@/app/lib/auth"
import { connectToDatabase } from "@/app/lib/mongodb"
import { ObjectId } from "mongodb"
import { NextResponse } from "next/server"

// GET a single venture by ID
export async function GET(request, { params }) {
  try {
    // Verify admin authentication
    const { authenticated, isAdmin } = await verifyAuth(request)

    if (!authenticated || !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid venture ID" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const venture = await db.collection("ventures").findOne({ _id: new ObjectId(id) })

    if (!venture) {
      return NextResponse.json({ error: "Venture not found" }, { status: 404 })
    }

    return NextResponse.json(venture)
  } catch (error) {
    console.error("Error fetching venture:", error)
    return NextResponse.json({ error: "Failed to fetch venture" }, { status: 500 })
  }
}

// PUT update a venture
export async function PUT(request, { params }) {
  try {
    // Verify admin authentication
    const { authenticated, isAdmin } = await verifyAuth(request)

    if (!authenticated || !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid venture ID" }, { status: 400 })
    }

    const data = await request.json()

    // Validate required fields
    if (!data.name || !data.description) {
      return NextResponse.json({ error: "Name and description are required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Check if slug already exists (excluding current venture)
    if (data.slug) {
      const existingVenture = await db
        .collection("ventures")
        .findOne({ slug: data.slug, _id: { $ne: new ObjectId(id) } })

      if (existingVenture) {
        return NextResponse.json({ error: "A venture with this slug already exists" }, { status: 400 })
      }
    }

    // Update venture with timestamps
    const updatedVenture = {
      ...data,
      updatedAt: new Date(),
    }

    const result = await db.collection("ventures").updateOne({ _id: new ObjectId(id) }, { $set: updatedVenture })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Venture not found" }, { status: 404 })
    }

    // Get the updated venture
    const venture = await db.collection("ventures").findOne({ _id: new ObjectId(id) })

    return NextResponse.json({
      message: "Venture updated successfully",
      venture,
    })
  } catch (error) {
    console.error("Error updating venture:", error)
    return NextResponse.json({ error: "Failed to update venture" }, { status: 500 })
  }
}

// DELETE a venture
export async function DELETE(request, { params }) {
  try {
    // Verify admin authentication
    const { authenticated, isAdmin } = await verifyAuth(request)

    if (!authenticated || !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid venture ID" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const result = await db.collection("ventures").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Venture not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Venture deleted successfully" })
  } catch (error) {
    console.error("Error deleting venture:", error)
    return NextResponse.json({ error: "Failed to delete venture" }, { status: 500 })
  }
}
