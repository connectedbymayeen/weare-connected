import { notFound } from "next/navigation"

async function getBlogPost(slug) {
  const baseUrl =
    process.env.NODE_ENV === "production"
      ? "https://weare-connected-six.vercel.app"
      : "http://localhost:3000"

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

export default async function NewBlogPage({ params }) {
  const { slug } = params
  const post = await getBlogPost(slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <p className="text-xl text-gray-600 mb-8">{post.excerpt}</p>

        {/* Updated prose block */}
        <div className="prose prose-lg max-w-none text-gray-800">
          <div
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </div>
    </div>
  )
}

export const dynamic = "force-dynamic"
export const revalidate = 0
