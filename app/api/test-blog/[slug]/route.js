import { NextResponse } from "next/server"
import { connectToDatabase } from "@/app/lib/mongodb"

export async function GET(request, { params }) {
  try {
    console.log("Test blog API called with slug:", params.slug)

    const { db } = await connectToDatabase()
    const collection = db.collection("blog")

    // Try to find the blog post
    const post = await collection.findOne({
      slug: params.slug,
      status: "published",
    })

    console.log("Found post:", post)

    if (!post) {
      return NextResponse.json({ error: "Post not found", slug: params.slug }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      post: {
        id: post._id.toString(),
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt,
        author: post.author,
        category: post.category,
        publishedAt: post.publishedAt,
        createdAt: post.createdAt,
        status: post.status,
      },
    })
  } catch (error) {
    console.error("Test blog API error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
