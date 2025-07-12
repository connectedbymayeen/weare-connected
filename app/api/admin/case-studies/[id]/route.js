import { NextResponse } from "next/server"
import { connectToDatabase } from "@/app/lib/mongodb"
import { verifyAuth } from "@/app/lib/auth"
import { ObjectId } from "mongodb"

// GET single case study
export async function GET(request, { params }) {
  try {
    const { authenticated, isAdmin } = await verifyAuth(request)

    if (!authenticated || !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    const { db } = await connectToDatabase()

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid case study ID" }, { status: 400 })
    }

    const caseStudy = await db.collection("case_studies").findOne({ _id: new ObjectId(id) })

    if (!caseStudy) {
      return NextResponse.json({ error: "Case study not found" }, { status: 404 })
    }

    return NextResponse.json(caseStudy)
  } catch (error) {
    console.error("Error fetching case study:", error)
    return NextResponse.json({ error: "Failed to fetch case study" }, { status: 500 })
  }
}

// PUT update case study
export async function PUT(request, { params }) {
  try {
    const { authenticated, isAdmin } = await verifyAuth(request)

    if (!authenticated || !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    const data = await request.json()

    // Validate required fields
    if (!data.title || !data.description || !data.client) {
      return NextResponse.json({ error: "Title, description, and client are required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid case study ID" }, { status: 400 })
    }

    // Check if slug already exists for other case studies
    if (data.slug) {
      const existingCaseStudy = await db.collection("case_studies").findOne({
        slug: data.slug,
        _id: { $ne: new ObjectId(id) },
      })
      if (existingCaseStudy) {
        return NextResponse.json({ error: "A case study with this slug already exists" }, { status: 400 })
      }
    }

    // Format services as array if provided
    const formattedData = {
      ...data,
      services: data.services
        ? Array.isArray(data.services)
          ? data.services
          : data.services
              .split(",")
              .map((service) => service.trim())
              .filter(Boolean)
        : [],
      updatedAt: new Date(),
    }

    const result = await db.collection("case_studies").updateOne({ _id: new ObjectId(id) }, { $set: formattedData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Case study not found" }, { status: 404 })
    }

    const updatedCaseStudy = await db.collection("case_studies").findOne({ _id: new ObjectId(id) })

    return NextResponse.json({
      message: "Case study updated successfully",
      caseStudy: updatedCaseStudy,
    })
  } catch (error) {
    console.error("Error updating case study:", error)
    return NextResponse.json({ error: "Failed to update case study" }, { status: 500 })
  }
}

// DELETE case study
export async function DELETE(request, { params }) {
  try {
    const { authenticated, isAdmin } = await verifyAuth(request)

    if (!authenticated || !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    const { db } = await connectToDatabase()

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid case study ID" }, { status: 400 })
    }

    const result = await db.collection("case_studies").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Case study not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Case study deleted successfully" })
  } catch (error) {
    console.error("Error deleting case study:", error)
    return NextResponse.json({ error: "Failed to delete case study" }, { status: 500 })
  }
}
