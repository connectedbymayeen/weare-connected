import { NextResponse } from "next/server"
import { connectToDatabase } from "@/app/lib/mongodb"
import { verifyAuth } from "@/app/lib/auth"
import { ObjectId } from "mongodb"

// GET single press kit item
export async function GET(request, { params }) {
  try {
    // Verify admin authentication
    const { authenticated, isAdmin } = await verifyAuth(request)

    if (!authenticated || !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()
    const pressKitItem = await db.collection("press_kit").findOne({ _id: new ObjectId(params.id) })

    if (!pressKitItem) {
      return NextResponse.json({ error: "Press kit item not found" }, { status: 404 })
    }

    return NextResponse.json(pressKitItem)
  } catch (error) {
    console.error("Error fetching press kit item:", error)
    return NextResponse.json({ error: "Failed to fetch press kit item" }, { status: 500 })
  }
}

// PUT update press kit item
export async function PUT(request, { params }) {
  try {
    // Verify admin authentication
    const { authenticated, isAdmin } = await verifyAuth(request)

    if (!authenticated || !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    // Validate required fields
    if (!data.title || !data.category) {
      return NextResponse.json({ error: "Title and category are required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    const updateData = {
      title: data.title,
      category: data.category,
      description: data.description || "",
      file: data.file || null,
      fileSize: data.fileSize || "",
      fileType: data.fileType || "",
      published: data.published !== undefined ? data.published : true,
      dimensions: data.dimensions || "",
      format: data.format || "",
      pages: data.pages || "",
      updatedAt: new Date(),
    }

    const result = await db.collection("press_kit").updateOne({ _id: new ObjectId(params.id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Press kit item not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Press kit item updated successfully" })
  } catch (error) {
    console.error("Error updating press kit item:", error)
    return NextResponse.json({ error: "Failed to update press kit item" }, { status: 500 })
  }
}

// DELETE press kit item
export async function DELETE(request, { params }) {
  try {
    // Verify admin authentication
    const { authenticated, isAdmin } = await verifyAuth(request)

    if (!authenticated || !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()

    const result = await db.collection("press_kit").deleteOne({ _id: new ObjectId(params.id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Press kit item not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Press kit item deleted successfully" })
  } catch (error) {
    console.error("Error deleting press kit item:", error)
    return NextResponse.json({ error: "Failed to delete press kit item" }, { status: 500 })
  }
}
