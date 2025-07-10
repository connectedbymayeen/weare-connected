import { NextResponse } from "next/server"
import { connectToDatabase } from "@/app/lib/mongodb"

// Sample blog posts as fallback
const sampleBlogPosts = [
  {
    id: "1",
    slug: "future-of-technology",
    title: "The Future of Technology: Trends to Watch",
    excerpt:
      "Explore the latest technological trends that are shaping our future and transforming industries worldwide.",
    content: `Technology continues to evolve at an unprecedented pace, bringing new opportunities and challenges to businesses and individuals alike. In this comprehensive analysis, we explore the key trends that will define the next decade of technological advancement.

Artificial Intelligence and Machine Learning are no longer buzzwords but essential tools driving innovation across industries. From healthcare diagnostics to financial fraud detection, AI is revolutionizing how we approach complex problems and make decisions.

The Internet of Things (IoT) is creating a more connected world, where everyday objects communicate and share data to improve efficiency and user experience. Smart homes, connected vehicles, and industrial IoT applications are just the beginning of this transformation.

Blockchain technology is expanding beyond cryptocurrency, offering secure and transparent solutions for supply chain management, digital identity verification, and decentralized applications.

As we look to the future, these technologies will continue to converge and create new possibilities we can barely imagine today.`,
    author: {
      name: "Connected Team",
      role: "Technology Analyst",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
    },
    publishedAt: new Date().toISOString(),
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop",
    tags: ["Technology", "Innovation", "Future", "AI", "IoT"],
    category: "Technology",
    readTime: "8 min read",
    status: "published",
  },
  {
    id: "2",
    slug: "digital-transformation-guide",
    title: "Digital Transformation: A Complete Guide for Businesses",
    excerpt: "Learn how to successfully navigate digital transformation and modernize your business operations.",
    content: `Digital transformation is no longer optional for businesses that want to remain competitive in today's market. This comprehensive guide will walk you through the essential steps and strategies needed to successfully modernize your operations.

Understanding Digital Transformation means recognizing that it's not just about adopting new technologies, but fundamentally changing how your business operates and delivers value to customers.

Key Components include cloud migration, data analytics, automation, and customer experience optimization. Each of these elements plays a crucial role in creating a more efficient and responsive organization.

Implementation Strategy requires careful planning, stakeholder buy-in, and a phased approach that minimizes disruption while maximizing benefits.

Success Stories from various industries demonstrate that companies that embrace digital transformation see improved efficiency, better customer satisfaction, and increased revenue growth.`,
    author: {
      name: "Sarah Johnson",
      role: "Digital Strategy Consultant",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face",
    },
    publishedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop",
    tags: ["Digital Transformation", "Business", "Strategy", "Technology"],
    category: "Business",
    readTime: "12 min read",
    status: "published",
  },
  {
    id: "3",
    slug: "cybersecurity-best-practices",
    title: "Cybersecurity Best Practices for Modern Businesses",
    excerpt: "Protect your business from cyber threats with these essential security practices and strategies.",
    content: `Cybersecurity has become one of the most critical concerns for businesses of all sizes. With cyber attacks becoming more sophisticated and frequent, implementing robust security measures is essential for protecting your organization's data and reputation.

Essential Security Measures include multi-factor authentication, regular software updates, employee training, and comprehensive backup strategies. These foundational elements form the backbone of any effective cybersecurity program.

Threat Detection and Response capabilities are crucial for identifying and mitigating potential security incidents before they can cause significant damage to your organization.

Compliance and Governance ensure that your security practices meet industry standards and regulatory requirements, protecting your business from legal and financial penalties.

Future-Proofing Your Security involves staying informed about emerging threats and continuously updating your security posture to address new challenges.`,
    author: {
      name: "Michael Chen",
      role: "Cybersecurity Expert",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
    },
    publishedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=400&fit=crop",
    tags: ["Cybersecurity", "Security", "Business", "Technology"],
    category: "Security",
    readTime: "10 min read",
    status: "published",
  },
]

export async function GET() {
  try {
    console.log("Blog API: Attempting to fetch blog posts")

    // Try to connect to database
    const { db } = await connectToDatabase()
    console.log("Blog API: Database connected successfully")

    // Try to fetch from the 'blog' collection first (this is where your admin creates posts)
    let posts = await db
      .collection("blog")
      .find({ status: "published" })
      .sort({ publishedAt: -1, createdAt: -1 })
      .toArray()

    console.log(`Blog API: Found ${posts.length} posts in 'blog' collection`)

    // If no published posts, try to get all posts from blog collection
    if (posts.length === 0) {
      posts = await db.collection("blog").find({}).sort({ publishedAt: -1, createdAt: -1 }).toArray()
      console.log(`Blog API: Found ${posts.length} total posts in 'blog' collection`)
    }

    // If still no posts, try blog_posts collection as fallback
    if (posts.length === 0) {
      posts = await db.collection("blog_posts").find({ status: "published" }).sort({ publishedAt: -1 }).toArray()
      console.log(`Blog API: Found ${posts.length} posts in 'blog_posts' collection`)
    }

    if (posts && posts.length > 0) {
      // Convert MongoDB ObjectIds to strings and ensure proper formatting
      const formattedPosts = posts.map((post) => ({
        id: post._id.toString(),
        slug: post.slug || post._id.toString(),
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
        publishedAt: post.publishedAt
          ? new Date(post.publishedAt).toISOString()
          : new Date(post.createdAt || Date.now()).toISOString(),
        image:
          post.featuredImage?.url ||
          post.image?.url ||
          post.image ||
          "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop",
        tags: Array.isArray(post.tags) ? post.tags : ["Technology", "Innovation"],
        category: post.category || "Technology",
        readTime: post.readTime || "5 min read",
        status: post.status || "published",
        createdAt: post.createdAt ? new Date(post.createdAt).toISOString() : new Date().toISOString(),
        updatedAt: post.updatedAt ? new Date(post.updatedAt).toISOString() : new Date().toISOString(),
      }))

      return NextResponse.json(
        {
          posts: formattedPosts,
          source: "database",
          count: formattedPosts.length,
        },
        {
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        },
      )
    }

    console.log("Blog API: No posts found in database, using sample data")
  } catch (error) {
    console.error("Blog API: Database error:", error)
  }

  // Return sample data as fallback
  return NextResponse.json(
    {
      posts: sampleBlogPosts,
      source: "fallback",
      count: sampleBlogPosts.length,
    },
    {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    },
  )
}
