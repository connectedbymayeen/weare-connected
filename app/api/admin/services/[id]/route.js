import { verifyAuth } from "@/app/lib/auth"
import { deleteImage } from "@/app/lib/cloudinary"
import { connectToDatabase } from "@/app/lib/mongodb"
import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"

// GET a single service by ID
export async function GET(request, { params }) {
  try {
    // Verify admin authentication
    const { authenticated, isAdmin } = await verifyAuth(request)

    if (!authenticated || !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid service ID" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const service = await db.collection("services").findOne({ _id: new ObjectId(id) })

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    return NextResponse.json(service)
  } catch (error) {
    console.error("Error fetching service:", error)
    return NextResponse.json({ error: "Failed to fetch service" }, { status: 500 })
  }
}

// PUT update a service
export async function PUT(request, { params }) {
  try {
    // Verify admin authentication
    const { authenticated, isAdmin } = await verifyAuth(request)

    if (!authenticated || !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    const data = await request.json()

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid service ID" }, { status: 400 })
    }

    // Validate required fields
    if (!data.title || !data.description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Check if slug is being changed and if it already exists
    if (data.slug) {
      const existingService = await db
        .collection("services")
        .findOne({ slug: data.slug, _id: { $ne: new ObjectId(id) } })
      if (existingService) {
        return NextResponse.json({ error: "A service with this slug already exists" }, { status: 400 })
      }
    }

    // Update service with timestamps
    const updateData = {
      ...data,
      updatedAt: new Date(),
    }

    const result = await db.collection("services").updateOne({ _id: new ObjectId(id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Service updated successfully",
      service: { ...updateData, _id: id },
    })
  } catch (error) {
    console.error("Error updating service:", error)
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 })
  }
}

// DELETE a service
export async function DELETE(request, { params }) {
  try {
    // Verify admin authentication
    const { authenticated, isAdmin } = await verifyAuth(request)

    if (!authenticated || !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid service ID" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Get service to check for images to delete
    const service = await db.collection("services").findOne({ _id: new ObjectId(id) })

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    // Delete associated images from Cloudinary
    if (service.image && service.image.publicId) {
      await deleteImage(service.image.publicId)
    }

    // Delete service from database
    const result = await db.collection("services").deleteOne({ _id: new ObjectId(id) })

    return NextResponse.json({ message: "Service deleted successfully" })
  } catch (error) {
    console.error("Error deleting service:", error)
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 })
  }
}
