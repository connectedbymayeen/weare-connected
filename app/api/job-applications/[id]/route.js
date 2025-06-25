import { connectToDatabase } from "@/app/lib/mongodb"
import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"

export async function GET(request, { params }) {
  try {
    const resolvedParams = await params
    const { db } = await connectToDatabase()

    const application = await db.collection("job_applications").findOne({
      _id: new ObjectId(resolvedParams.id),
    })

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    return NextResponse.json(application)
  } catch (error) {
    console.error("Error fetching application:", error)
    return NextResponse.json({ error: "Failed to fetch application" }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const resolvedParams = await params
    const body = await request.json()
    const { db } = await connectToDatabase()

    const updateData = {
      status: body.status,
      updatedAt: new Date(),
    }

    if (body.adminNotes) {
      updateData.adminNotes = body.adminNotes
    }

    const result = await db
      .collection("job_applications")
      .updateOne({ _id: new ObjectId(resolvedParams.id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Application updated successfully" })
  } catch (error) {
    console.error("Error updating application:", error)
    return NextResponse.json({ error: "Failed to update application" }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const resolvedParams = await params
    const { db } = await connectToDatabase()

    const result = await db.collection("job_applications").deleteOne({
      _id: new ObjectId(resolvedParams.id),
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Application deleted successfully" })
  } catch (error) {
    console.error("Error deleting application:", error)
    return NextResponse.json({ error: "Failed to delete application" }, { status: 500 })
  }
}
