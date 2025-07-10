import Footer from "@/app/components/footer";
import Header from "@/app/components/header";
import ShareButton from "@/app/components/ShareButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Bookmark, Calendar, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

async function getBlogPost(slug) {
  const baseUrl = process.env.NODE_ENV === "production" ? "https://weare-connected-six.vercel.app" : "http://localhost:3000"

  try {
    const response = await fetch(`${baseUrl}/api/content/blog/${slug}`, {
      cache: "no-store",
    })

    if (response.ok) {
      const post = await response.json()
      return post
    }

    return null
  } catch (error) {
    console.error("Error:", error)
    return null
  }
}

function calculateReadTime(content) {
  if (!content) return "1 min read"
  const wordsPerMinute = 200
  const wordCount = content.trim().split(/\s+/).length
  const readTime = Math.ceil(wordCount / wordsPerMinute)
  return `${readTime} min read`
}

export default async function BlogPage({ params }) {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    notFound()
  }

  const authorName = post.author?.name || post.author || "Connected Team"
  const authorRole = post.author?.role || "Author"
  const authorImage =
    post.author?.image?.url ||
    post.author?.image ||
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face"
  const postImage =
    post.featuredImage?.url ||
    post.image?.url ||
    post.image ||
    "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop"

  return (
    <>
      <Header />
      <div className="min-h-screen pt-20 bg-white">
        {/* Navigation */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link href="/blog" className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
        </div>

        {/* Hero Section */}
        <article className="container mx-auto px-4 pb-12">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <header className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary">{post.category || "Blog"}</Badge>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-500">{post.readTime || calculateReadTime(post.content)}</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">{post.title}</h1>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed"
               dangerouslySetInnerHTML={{
                __html: post.excerpt || "Read our latest insights and perspectives."
               }}
              />

              {/* Author and Meta Info */}
              <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
                <div className="flex items-center space-x-4">
                  <Image
                    src={authorImage || "/placeholder.svg"}
                    alt={authorName}
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{authorName}</div>
                    <div className="text-sm text-gray-600">{authorRole}</div>
                  </div>
                  <Separator orientation="vertical" className="h-8" />
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(post.publishedAt || post.createdAt || Date.now()).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-1" />
                    {/* {post.readTime || calculateReadTime(post.content)} */}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <ShareButton url={`https://weare-connected-six.vercel.app/blog/${slug}`} title={post.title} />

                  <Button variant="outline" size="sm" className="bg-white text-gray-700 border-gray-300">
                    <Bookmark className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </div>
              </div>
            </header>

            {/* Featured Image */}
            <div className="mb-12">
              <Image
                src={postImage || "/placeholder.svg"}
                alt={post.title}
                width={800}
                height={400}
                className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
              />
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none mb-12 prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-primary prose-img:rounded-lg">
  <div dangerouslySetInnerHTML={{ __html: post.content }} />
</div>


            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mb-12">
                <h3 className="text-lg font-semibold mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Separator className="mb-12" />

            {/* Author Bio */}
            <div className="bg-gray-50 rounded-lg p-8 mb-12">
              <div className="flex items-start space-x-4">
                <Image
                  src={authorImage || "/placeholder.svg"}
                  alt={authorName}
                  width={80}
                  height={80}
                  className="rounded-full object-cover"
                />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{authorName}</h3>
                  <p className="text-gray-600 mb-4">{authorRole}</p>
                  <p className="text-gray-700">
                    {authorName} is a leading expert in {(post.category || "technology").toLowerCase()}, helping
                    businesses navigate the complexities of modern technology adoption and digital transformation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
      <Footer />
    </>
  )
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    return {
      title: "Post Not Found | Connected Blog",
      description: "The requested blog post could not be found.",
    }
  }

  return {
    title: `${post.title} | Connected Blog`,
    description: post.excerpt || "Read our latest insights and perspectives.",
    openGraph: {
      title: post.title,
      description: post.excerpt || "Read our latest insights and perspectives.",
      images: [post.image],
    },
  }
}

export const dynamic = "force-dynamic"
export const revalidate = 0
