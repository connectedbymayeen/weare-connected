import { NextResponse } from "next/server"
import { connectToDatabase } from "@/app/lib/mongodb"
import { ObjectId } from "mongodb"

// GET download file directly
export async function GET(request, { params }) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json({ error: "Item ID is required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Get the press kit item
    const item = await db.collection("press_kit").findOne({ _id: new ObjectId(id) })

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    if (!item.file) {
      return NextResponse.json({ error: "File not available" }, { status: 404 })
    }

    // Track download
    await db.collection("press_kit").updateOne(
      { _id: new ObjectId(id) },
      {
        $inc: { downloadCount: 1 },
        $set: { lastDownloaded: new Date() },
      },
    )

    // If it's a Cloudinary URL, redirect to it with download parameters
    if (item.file.includes("cloudinary.com")) {
      const url = new URL(item.file)
      url.searchParams.set("fl_attachment", `${item.title}.${item.fileType || "file"}`)
      return NextResponse.redirect(url.toString())
    }

    // If it's an external URL, redirect to it
    if (item.file.startsWith("http")) {
      return NextResponse.redirect(item.file)
    }

    // For local files, try to serve them
    try {
      const response = await fetch(item.file)
      if (!response.ok) {
        throw new Error(`File not accessible: ${response.status}`)
      }

      const fileBuffer = await response.arrayBuffer()
      const fileName = `${item.title}.${item.fileType || "file"}`

      return new NextResponse(fileBuffer, {
        headers: {
          "Content-Disposition": `attachment; filename="${fileName}"`,
          "Content-Type": response.headers.get("content-type") || "application/octet-stream",
        },
      })
    } catch (error) {
      console.error("Error serving file:", error)
      return NextResponse.json({ error: "File not accessible" }, { status: 404 })
    }
  } catch (error) {
    console.error("Error downloading file:", error)
    return NextResponse.json({ error: "Failed to download file" }, { status: 500 })
  }
}
