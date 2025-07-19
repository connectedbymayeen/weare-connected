import Footer from "@/app/components/footer"
import Header from "@/app/components/header"
import ShareButton from "@/app/components/ShareButton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Bookmark, Calendar, Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

async function getBlogPost(slug) {
  const baseUrl =
    process.env.NODE_ENV === "production" ? "https://weareconnected.io" : "http://localhost:3000"

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

              <p
                className="text-xl text-gray-600 mb-8 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: post.excerpt || "Read our latest insights and perspectives.",
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
            <div
              className="prose prose-lg prose-slate max-w-none mb-12 
  prose-headings:text-gray-900 prose-headings:font-bold
  prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-8
  prose-h2:text-3xl prose-h2:mb-4 prose-h2:mt-6
  prose-h3:text-2xl prose-h3:mb-3 prose-h3:mt-5
  prose-h4:text-xl prose-h4:mb-2 prose-h4:mt-4
  prose-h5:text-lg prose-h5:mb-2 prose-h5:mt-3
  prose-h6:text-base prose-h6:mb-2 prose-h6:mt-3
  prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
  prose-a:text-blue-600 prose-a:hover:text-blue-800 prose-a:underline
  prose-strong:text-gray-900 prose-strong:font-semibold
  prose-em:text-gray-700 prose-em:italic
  prose-ul:mb-4 prose-ol:mb-4
  prose-li:text-gray-700 prose-li:mb-1
  prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600
  prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
  prose-pre:bg-gray-900 prose-pre:text-white prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto
  prose-img:rounded-lg prose-img:shadow-md prose-img:mx-auto
  prose-hr:border-gray-300 prose-hr:my-8
  prose-table:border-collapse prose-table:w-full
  prose-th:border prose-th:border-gray-300 prose-th:bg-gray-50 prose-th:p-2 prose-th:text-left prose-th:font-semibold
  prose-td:border prose-td:border-gray-300 prose-td:p-2
  [&>div]:space-y-4
  [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:text-gray-900 [&_h1]:mb-6 [&_h1]:mt-8
  [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mb-4 [&_h2]:mt-6
  [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:text-gray-900 [&_h3]:mb-3 [&_h3]:mt-5
  [&_h4]:text-xl [&_h4]:font-bold [&_h4]:text-gray-900 [&_h4]:mb-2 [&_h4]:mt-4
  [&_h5]:text-lg [&_h5]:font-bold [&_h5]:text-gray-900 [&_h5]:mb-2 [&_h5]:mt-3
  [&_h6]:text-base [&_h6]:font-bold [&_h6]:text-gray-900 [&_h6]:mb-2 [&_h6]:mt-3
  [&_p]:text-gray-700 [&_p]:leading-relaxed [&_p]:mb-4
  [&_strong]:text-gray-900 [&_strong]:font-semibold
  [&_em]:text-gray-700 [&_em]:italic
  [&_ul]:mb-4 [&_ul]:pl-6
  [&_ol]:mb-4 [&_ol]:pl-6
  [&_li]:text-gray-700 [&_li]:mb-1
  [&_blockquote]:border-l-4 [&_blockquote]:border-blue-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-600 [&_blockquote]:my-4
  [&_code]:bg-gray-100 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono
  [&_pre]:bg-gray-900 [&_pre]:text-white [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:my-4
  [&_img]:rounded-lg [&_img]:shadow-md [&_img]:mx-auto [&_img]:my-4
  [&_hr]:border-gray-300 [&_hr]:my-8
  [&_table]:border-collapse [&_table]:w-full [&_table]:my-4
  [&_th]:border [&_th]:border-gray-300 [&_th]:bg-gray-50 [&_th]:p-2 [&_th]:text-left [&_th]:font-semibold
  [&_td]:border [&_td]:border-gray-300 [&_td]:p-2
  [&_a]:text-blue-600 [&_a]:hover:text-blue-800 [&_a]:underline
"
            >
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
