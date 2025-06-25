import { notFound } from "next/navigation"

async function getTestBlogPost(slug) {
  try {
    const response = await fetch(`https://weare-connected-six.vercel.app/api/test-blog/${slug}`, {
      cache: "no-store",
    })

    if (response.ok) {
      const data = await response.json()
      return data.post
    }

    return null
  } catch (error) {
    console.error("Error fetching test blog post:", error)
    return null
  }
}

export default async function TestBlogPage({ params }) {
  const { slug } = await params
  const post = await getTestBlogPost(slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <p className="text-gray-600 mb-4">Slug: {post.slug}</p>
        <p className="text-gray-600 mb-4">Author: {post.author}</p>
        <p className="text-gray-600 mb-4">Status: {post.status}</p>
        <div className="prose max-w-none">
          <p>{post.content}</p>
        </div>
      </div>
    </div>
  )
}

export const dynamic = "force-dynamic"
