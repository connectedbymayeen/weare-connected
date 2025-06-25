const { MongoClient } = require("mongodb")

const sampleBlogPosts = [
  {
    slug: "mayeen-r",
    title: "Mayeen Rahman",
    excerpt: "Exploring innovative solutions and cutting-edge technology developments in the modern digital landscape.",
    content: `
# Mayeen Rahman: A Visionary in Technology

Mayeen Rahman represents the new generation of technology leaders who are reshaping how we think about digital innovation and entrepreneurship.

## Background and Expertise

With a deep understanding of modern web technologies and a passion for creating meaningful digital experiences, Mayeen has been at the forefront of several groundbreaking projects.

## Key Contributions

- **Web Development Excellence**: Pioneering modern web development practices
- **Innovation Leadership**: Leading teams in creating cutting-edge solutions
- **Community Building**: Fostering collaboration and knowledge sharing

## Vision for the Future

The future of technology lies in creating solutions that are not just functional, but transformative. This vision drives every project and initiative.

## Conclusion

As we continue to push the boundaries of what's possible in technology, leaders like Mayeen Rahman show us the path forward through innovation, dedication, and a commitment to excellence.
    `,
    author: {
      name: "Mayeen Rahman",
      role: "Technology Leader",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
    },
    publishedAt: new Date(),
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop",
    tags: ["Technology", "Innovation", "Leadership"],
    category: "Technology",
    readTime: "5 min read",
    status: "published",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    slug: "future-of-web-development",
    title: "The Future of Web Development",
    excerpt: "Exploring the latest trends and technologies that are shaping the future of web development.",
    content: `
# The Future of Web Development

Web development continues to evolve at a rapid pace, with new technologies and frameworks emerging regularly.

## Current Trends

- **React and Next.js**: Dominating the frontend landscape
- **TypeScript**: Bringing type safety to JavaScript
- **Serverless Architecture**: Changing how we deploy applications
- **AI Integration**: Enhancing user experiences

## What's Next?

The future holds exciting possibilities for web developers, from WebAssembly to advanced AI integrations.

## Conclusion

Staying current with these trends is essential for any web developer looking to build modern, efficient applications.
    `,
    author: {
      name: "Connected Team",
      role: "Development Team",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
    },
    publishedAt: new Date(),
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop",
    tags: ["Web Development", "Technology", "Future"],
    category: "Technology",
    readTime: "7 min read",
    status: "published",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

async function seedBlogPosts() {
  const uri = process.env.MONGODB_URI

  if (!uri) {
    console.error("MONGODB_URI environment variable is not set")
    process.exit(1)
  }

  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db(process.env.MONGODB_DB || "weare-connected")
    const collection = db.collection("blog")

    // Check if posts already exist
    const existingPosts = await collection.find({}).toArray()
    console.log(`Found ${existingPosts.length} existing blog posts`)

    // Insert sample posts if none exist
    if (existingPosts.length === 0) {
      const result = await collection.insertMany(sampleBlogPosts)
      console.log(`Inserted ${result.insertedCount} blog posts`)
    } else {
      // Update existing posts or insert new ones
      for (const post of sampleBlogPosts) {
        const existing = await collection.findOne({ slug: post.slug })
        if (existing) {
          await collection.updateOne({ slug: post.slug }, { $set: { ...post, updatedAt: new Date() } })
          console.log(`Updated blog post: ${post.title}`)
        } else {
          await collection.insertOne(post)
          console.log(`Inserted new blog post: ${post.title}`)
        }
      }
    }

    // List all posts
    const allPosts = await collection.find({}).toArray()
    console.log("\nAll blog posts in database:")
    allPosts.forEach((post) => {
      console.log(`- ${post.title} (slug: ${post.slug})`)
    })
  } catch (error) {
    console.error("Error seeding blog posts:", error)
  } finally {
    await client.close()
    console.log("Disconnected from MongoDB")
  }
}

// Run the seeding function
seedBlogPosts().catch(console.error)
