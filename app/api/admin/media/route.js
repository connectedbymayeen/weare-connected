import { NextResponse } from "next/server"
import { connectToDatabase } from "@/app/lib/mongodb"
import { verifyAuth } from "@/app/lib/auth"

export async function GET(request) {
  try {
    // Verify admin authentication
    const authResult = await verifyAuth(request)
    if (!authResult.authenticated || !authResult.isAdmin) {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const type = searchParams.get("type") || ""

    const { db } = await connectToDatabase()

    // Build query
    const query = {}
    if (search) {
      query.$or = [{ filename: { $regex: search, $options: "i" } }, { originalName: { $regex: search, $options: "i" } }]
    }
    if (type) query.type = type

    // Fetch media files
    const media = await db.collection("media").find(query).sort({ createdAt: -1 }).toArray()

    // Calculate stats
    const stats = {
      images: await db.collection("media").countDocuments({ type: "image" }),
      videos: await db.collection("media").countDocuments({ type: "video" }),
      documents: await db.collection("media").countDocuments({ type: "document" }),
      totalSize: 0, // You might want to calculate this from actual file sizes
    }

    // Serialize media data
    const serializedMedia = media.map((item) => ({
      _id: item._id.toString(),
      filename: item.filename || item.originalName || "Unknown",
      originalName: item.originalName || item.filename || "Unknown",
      url: item.url || item.secure_url || "",
      type: item.type || getFileType(item.filename || ""),
      size: item.size || item.bytes || 0,
      createdAt: item.createdAt || item.uploadedAt || new Date(),
      publicId: item.publicId || item.public_id || "",
    }))

    return NextResponse.json({
      media: serializedMedia,
      stats,
    })
  } catch (error) {
    console.error("Media API error:", error)
    return NextResponse.json({ error: "Failed to fetch media files" }, { status: 500 })
  }
}

function getFileType(filename) {
  const ext = filename.split(".").pop()?.toLowerCase()

  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext)) return "image"
  if (["mp4", "avi", "mov", "wmv", "flv"].includes(ext)) return "video"
  if (["mp3", "wav", "flac", "aac"].includes(ext)) return "audio"
  if (["pdf", "doc", "docx", "txt", "rtf"].includes(ext)) return "document"

  return "other"
}
