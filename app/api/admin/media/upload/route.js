import { NextResponse } from "next/server"
import { connectToDatabase } from "@/app/lib/mongodb"
import { verifyAuth } from "@/app/lib/auth"
import { uploadImage } from "@/app/lib/cloudinary"

export async function POST(request) {
  try {
    // Verify admin authentication
    const authResult = await verifyAuth(request)
    if (!authResult.authenticated || !authResult.isAdmin) {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file")
    const folder = formData.get("folder") || "media_library"

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Convert file to base64 for Cloudinary upload
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`

    // Upload to Cloudinary
    const uploadResult = await uploadImage(base64, folder)

    // Save to database
    const { db } = await connectToDatabase()
    const mediaItem = {
      filename: file.name,
      originalName: file.name,
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      type: getFileType(file.name),
      size: file.size,
      mimeType: file.type,
      createdAt: new Date(),
      uploadedBy: authResult.user?.id || "admin",
    }

    const result = await db.collection("media").insertOne(mediaItem)

    return NextResponse.json({
      message: "File uploaded successfully",
      id: result.insertedId,
      media: { ...mediaItem, _id: result.insertedId },
    })
  } catch (error) {
    console.error("Media upload error:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
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
