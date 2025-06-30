"use client"

import Footer from "@/app/components/footer"
import Header from "@/app/components/header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Bookmark, Calendar, Clock, Share2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { useEffect, useState } from "react"
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share"

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

function calculateReadTime(content) {
  if (!content) return "1 min read"
  const wordsPerMinute = 200
  const wordCount = content.trim().split(/\s+/).length
  const readTime = Math.ceil(wordCount / wordsPerMinute)
  return `${readTime} min read`
}

export default function BlogPage({ params }) {
  const slug = params.slug
  const [post, setPost] = useState(null)
  const [showShareOptions, setShowShareOptions] = useState(false)

  const shareUrl = `https://weare-connected.com/blog/${slug}`

  useEffect(() => {
    const fetchPost = async () => {
      const data = await getBlogPost(slug)
      if (!data) {
        notFound()
      } else {
        setPost(data)
      }
    }
    fetchPost()
  }, [slug])

  if (!post) {
    return null
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
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link href="/blog" className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
        </div>

        <article className="container mx-auto px-4 pb-12">
          <div className="max-w-4xl mx-auto">
            <header className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary">{post.category || "Blog"}</Badge>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-500">{post.readTime || calculateReadTime(post.content)}</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">{post.title}</h1>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {post.excerpt || "Read our latest insights and perspectives."}
              </p>

              <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
                <div className="flex items-center space-x-4">
                  <Image
                    src={authorImage}
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
                    {post.readTime || calculateReadTime(post.content)}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white text-gray-700 border-gray-300"
                      onClick={() => setShowShareOptions(!showShareOptions)}
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>

                    {showShareOptions && (
                      <div className="absolute mt-2 z-50 flex gap-2 p-3 rounded-md shadow-lg bg-white border">
                        <FacebookShareButton url={shareUrl} quote={post.title}>
                          <FacebookIcon size={32} round />
                        </FacebookShareButton>
                        <TwitterShareButton url={shareUrl} title={post.title}>
                          <TwitterIcon size={32} round />
                        </TwitterShareButton>
                        <LinkedinShareButton url={shareUrl} title={post.title}>
                          <LinkedinIcon size={32} round />
                        </LinkedinShareButton>
                        <WhatsappShareButton url={shareUrl} title={post.title}>
                          <WhatsappIcon size={32} round />
                        </WhatsappShareButton>
                      </div>
                    )}
                  </div>

                  <Button variant="outline" size="sm" className="bg-white text-gray-700 border-gray-300">
                    <Bookmark className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </div>
              </div>
            </header>

            <div className="mb-12">
              <Image
                src={postImage}
                alt={post.title}
                width={800}
                height={400}
                className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
              />
            </div>

            <div className="prose prose-lg max-w-none mb-12 text-gray-700">
              {(post.content || "Content coming soon...").split("\n\n").map((paragraph, index) => (
                <p key={index} className="text-lg leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

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

            <div className="bg-gray-50 rounded-lg p-8 mb-12">
              <div className="flex items-start space-x-4">
                <Image
                  src={authorImage}
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
                    businesses navigate modern tech adoption and digital transformation.
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
