require("dotenv").config()
const { MongoClient } = require("mongodb")

async function checkProductionDatabase() {
  const uri = process.env.MONGODB_URI
  const dbName = process.env.MONGODB_DB || "weare-connected"

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
    console.log("✅ Connected to MongoDB successfully")

    const db = client.db(dbName)

    // List all collections
    const collections = await db.listCollections().toArray()
    console.log(
      "📁 Available collections:",
      collections.map((c) => c.name),
    )

    // Check blog collection
    const blogCollection = db.collection("blog")
    const blogCount = await blogCollection.countDocuments()
    console.log(`📝 Blog posts count: ${blogCount}`)

    if (blogCount > 0) {
      const allPosts = await blogCollection.find({}).toArray()
      console.log("📋 All blog posts:")
      allPosts.forEach((post) => {
        console.log(`  - ${post.title} (slug: ${post.slug}, status: ${post.status})`)
      })
    }

    // Specifically check for the mayeen-r post
    const mayeenPost = await blogCollection.findOne({ slug: "mayeen-r" })
    console.log("🔍 Mayeen post exists:", !!mayeenPost)

    if (mayeenPost) {
      console.log("📄 Mayeen post details:", {
        title: mayeenPost.title,
        slug: mayeenPost.slug,
        status: mayeenPost.status,
        author: mayeenPost.author?.name,
      })
    }
  } catch (error) {
    console.error("❌ Database connection error:", error)
  } finally {
    await client.close()
  }
}

checkProductionDatabase()
