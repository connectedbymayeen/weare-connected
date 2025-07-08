import { NextResponse } from "next/server"
import { connectToDatabase } from "@/app/lib/mongodb"

export async function GET(request, { params }) {
  try {
    const { slug } = await params
    console.log(`Blog API: Fetching post with slug: ${slug}`)

    if (!slug || typeof slug !== "string") {
      console.log("Blog API: Invalid slug provided")
      return NextResponse.json({ error: "Invalid slug" }, { status: 400 })
    }

    // Check if MongoDB is available
    try {
      const { db } = await connectToDatabase()
      console.log("Blog API: Database connected successfully")

      let post = null

      // Try to find by slug in 'blog' collection
      try {
        const blogCollection = db.collection("blog")
        post = await blogCollection.findOne({ slug: slug, status: "published" })

        if (post) {
          console.log(`Blog API: Found post: ${post.title}`)
        } else {
          console.log(`Blog API: No post found with slug: ${slug}`)
          // Try without status filter
          post = await blogCollection.findOne({ slug: slug })
          if (post) {
            console.log(`Blog API: Found post without status filter: ${post.title}`)
          }
        }
      } catch (err) {
        console.log("Blog API: Error querying blog collection:", err.message)
      }

      if (!post) {
        console.log(`Blog API: Post not found for slug: ${slug}`)
        return NextResponse.json({ error: "Post not found" }, { status: 404 })
      }

      // Transform post data to ensure consistent format
      const transformedPost = {
        id: post._id.toString(),
        slug: post.slug || slug,
        title: post.title || "Untitled Post",
        excerpt:
          post.excerpt ||
          post.shortDescription ||
          (post.content ? post.content.substring(0, 150) + "..." : "No excerpt available"),
        content: post.content || "No content available",
        author: {
          name: post.author?.name || post.author || "Connected Team",
          role: post.author?.role || "Author",
          image:
            post.author?.image?.url ||
            post.author?.image ||
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
        },
        publishedAt: post.publishedAt ? new Date(post.publishedAt).toISOString() : new Date().toISOString(),
        image:
          post.featuredImage?.url ||
          post.image?.url ||
          post.image ||
          "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop",
        tags: Array.isArray(post.tags) ? post.tags : ["Technology", "Innovation"],
        category: post.category || "Technology",
        readTime: post.readTime || "5 min read",
        status: post.status || "published",
      }

      console.log(`Blog API: Returning post: ${transformedPost.title}`)
      return NextResponse.json(transformedPost, {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      })
    } catch (dbError) {
      console.error("Blog API: Database connection failed:", dbError)
      return NextResponse.json(
        {
          error: "Database connection failed",
          details: dbError.message,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error(`Blog API: Error fetching blog post:`, error)
    return NextResponse.json(
      {
        error: "Failed to fetch blog post",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
