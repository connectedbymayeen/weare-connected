import { NextResponse } from "next/server"
import { connectToDatabase } from "@/app/lib/mongodb"
import { verifyAuth } from "@/app/lib/auth"
import { deleteImage } from "@/app/lib/cloudinary"
import { ObjectId } from "mongodb"

export async function DELETE(request, { params }) {
  try {
    // Verify admin authentication
    const authResult = await verifyAuth(request)
    if (!authResult.authenticated || !authResult.isAdmin) {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 401 })
    }

    const { id } = await params
    const { db } = await connectToDatabase()

    // Find the media item
    const mediaItem = await db.collection("media").findOne({ _id: new ObjectId(id) })

    if (!mediaItem) {
      return NextResponse.json({ error: "Media file not found" }, { status: 404 })
    }

    // Delete from Cloudinary if publicId exists
    if (mediaItem.publicId) {
      try {
        await deleteImage(mediaItem.publicId)
      } catch (cloudinaryError) {
        console.error("Cloudinary deletion error:", cloudinaryError)
        // Continue with database deletion even if Cloudinary fails
      }
    }

    // Delete from database
    await db.collection("media").deleteOne({ _id: new ObjectId(id) })

    return NextResponse.json({ message: "Media file deleted successfully" })
  } catch (error) {
    console.error("Media deletion error:", error)
    return NextResponse.json({ error: "Failed to delete media file" }, { status: 500 })
  }
}
