import { getBlogPosts } from "../lib/data";
import BlogClientPage from "./blog-client";

export const metadata = {
  title: "Blog | Connected",
  description:
    "Insights, stories, and updates from the Connected team. Discover the latest trends in technology, entrepreneurship, and innovation.",
}

// Disable caching for this page
export const dynamic = "force-dynamic"
export const revalidate = 0

// Serialize blog posts for client component
function serializeBlogPosts(posts) {
  return posts.map((post) => ({
    id: post._id ? post._id.toString() : post.id,
    title: post.title || "Untitled Post",
    slug: post.slug || post.title?.toLowerCase().replace(/\s+/g, "-") || "untitled",
    excerpt: post.excerpt || post.description || "No excerpt available",
    content: post.content || "",
    category: post.category || "General",
    author: typeof post.author === "object" && post.author?.name ? post.author.name : post.author || "Connected Team",
    authorRole: typeof post.author === "object" && post.author?.role ? post.author.role : "Author",
    // Fix: Extract URL from author image object
    authorImage:
      typeof post.author === "object" && post.author?.image
        ? typeof post.author.image === "object"
          ? post.author.image.url
          : post.author.image
        : null,
    // Fix: Extract URL from featured image object
    image: post.featuredImage
      ? typeof post.featuredImage === "object"
        ? post.featuredImage.url
        : post.featuredImage
      : post.image
        ? typeof post.image === "object"
          ? post.image.url
          : post.image
        : null,
    date: post.publishedAt
      ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
      : new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    readTime: post.readTime || `${Math.ceil((post.content?.length || 1000) / 200)} min read`,
    tags: post.tags || [],
    publishedAt: post.publishedAt ? new Date(post.publishedAt).toISOString() : new Date().toISOString(),
    createdAt: post.createdAt ? new Date(post.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: post.updatedAt ? new Date(post.updatedAt).toISOString() : new Date().toISOString(),
  }))
}


export default async function BlogPage() {
  try {


    // Fetch real blog posts from database
    const rawPosts = await getBlogPosts()
    const posts = serializeBlogPosts(rawPosts)
    console.log(`BlogPage: Serialized ${posts.length} posts`)

    return <BlogClientPage posts={posts} />
  } catch (error) {
    console.error("BlogPage: Error fetching blog posts:", error)

    // Fallback data if database fails
    const fallbackPosts = [
      {
        id: "1",
        title: "The Future of Venture Capital",
        slug: "future-of-venture-capital",
        excerpt:
          "Exploring how technology is reshaping the venture capital landscape and what it means for entrepreneurs.",
        category: "Investment",
        author: "Connected Team",
        date: "December 15, 2024",
        readTime: "5 min read",
      },
      {
        id: "2",
        title: "Building Scalable Startups",
        slug: "building-scalable-startups",
        excerpt: "Key strategies and frameworks for building startups that can scale effectively in today's market.",
        category: "Entrepreneurship",
        author: "Connected Team",
        date: "December 10, 2024",
        readTime: "7 min read",
      },
      {
        id: "3",
        title: "Innovation in Tech",
        slug: "innovation-in-tech",
        excerpt: "Latest trends and innovations shaping the technology industry and their impact on businesses.",
        category: "Technology",
        author: "Connected Team",
        date: "December 5, 2024",
        readTime: "6 min read",
      },
    ]

    return <BlogClientPage posts={fallbackPosts} />
  }
}
