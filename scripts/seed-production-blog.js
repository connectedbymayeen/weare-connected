require("dotenv").config()
const { MongoClient } = require("mongodb")

async function seedProductionBlog() {
  const uri = process.env.MONGODB_URI
  const dbName = process.env.MONGODB_DB || "connected_website"

  console.log("🔧 Environment check:")
  console.log("MONGODB_URI exists:", !!uri)
  console.log("MONGODB_DB:", dbName)

  if (!uri) {
    console.error("❌ MONGODB_URI environment variable is required")
    console.log("Make sure you have a .env file with MONGODB_URI set")
    process.exit(1)
  }

  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log("✅ Connected to MongoDB")

    const db = client.db(dbName)
    const collection = db.collection("blog")

    // Check if the post already exists
    const existingPost = await collection.findOne({ slug: "mayeen-r" })
    if (existingPost) {
      console.log("📝 Blog post already exists!")
      console.log("Existing post:", {
        title: existingPost.title,
        slug: existingPost.slug,
        status: existingPost.status,
      })
      return
    }

    // Create the blog post that matches your local data
    const blogPost = {
      slug: "mayeen-r",
      title: "mayeen rahman",
      excerpt: "esvhcvsghvcghvashvchvhgsavhcvhsvhvhasvhajvbhjsabjhvbsajbvjbasjbvjhbashjbvhjbhjvhsddhvcesa",
      content: `This is a comprehensive blog post about mayeen rahman and the various aspects of modern technology development.

The content covers multiple topics including software development, user experience design, and innovative solutions for modern businesses.

We explore the intersection of technology and human creativity, discussing how developers like mayeen rahman contribute to the ever-evolving landscape of digital innovation.

The post delves into practical applications, theoretical frameworks, and real-world implementations that showcase the power of thoughtful development practices.`,
      author: {
        name: "mehdi",
        role: "developer",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
      },
      publishedAt: new Date("2025-06-20"),
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=400&fit=crop",
      tags: ["Technology", "Development", "Innovation"],
      category: "Technology",
      readTime: "1 min read",
      status: "published",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await collection.insertOne(blogPost)
    console.log("✅ Blog post created successfully:", result.insertedId)

    // Verify the post was created
    const verifyPost = await collection.findOne({ slug: "mayeen-r" })
    console.log("🔍 Verification - Post exists:", !!verifyPost)

    if (verifyPost) {
      console.log("📄 Created post details:", {
        title: verifyPost.title,
        slug: verifyPost.slug,
        status: verifyPost.status,
        author: verifyPost.author?.name,
      })
    }
  } catch (error) {
    console.error("❌ Error seeding blog post:", error)
  } finally {
    await client.close()
  }
}

seedProductionBlog()
