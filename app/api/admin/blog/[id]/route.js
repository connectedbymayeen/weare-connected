import { NextResponse } from "next/server"
// import { connectToDatabase } from "@/lib/mongodb"
import { connectToDatabase } from "@/app/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request, { params }) {
  try {
    const { id } = await params
    const { db } = await connectToDatabase()

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid blog post ID" }, { status: 400 })
    }

    const post = await db.collection("blog").findOne({ _id: new ObjectId(id) })

    if (!post) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 })
    }

    return NextResponse.json({
      ...post,
      id: post._id.toString(),
      _id: post._id.toString(),
    })
  } catch (error) {
    console.error("Error fetching blog post:", error)
    return NextResponse.json({ error: "Failed to fetch blog post" }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params
    const data = await request.json()
    const { db } = await connectToDatabase()

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid blog post ID" }, { status: 400 })
    }

    const updateData = {
      ...data,
      updatedAt: new Date(),
      publishedAt: data.status === "published" ? (data.publishedAt ? new Date(data.publishedAt) : new Date()) : null,
    }

    const result = await db.collection("blog").updateOne({ _id: new ObjectId(id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 })
    }

    const updatedPost = await db.collection("blog").findOne({ _id: new ObjectId(id) })

    return NextResponse.json({
      ...updatedPost,
      id: updatedPost._id.toString(),
      _id: updatedPost._id.toString(),
    })
  } catch (error) {
    console.error("Error updating blog post:", error)
    return NextResponse.json({ error: "Failed to update blog post" }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params
    const { db } = await connectToDatabase()

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid blog post ID" }, { status: 400 })
    }

    const result = await db.collection("blog").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Blog post deleted successfully" })
  } catch (error) {
    console.error("Error deleting blog post:", error)
    return NextResponse.json({ error: "Failed to delete blog post" }, { status: 500 })
  }
}
