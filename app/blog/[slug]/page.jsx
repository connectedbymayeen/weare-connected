"use client"
import Footer from "@/app/components/footer"
import Header from "@/app/components/header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Bookmark, Calendar, Clock, Share2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton
} from "react-share"

export default function BlogPage({ params }) {
  const slug = params.slug
  const [showShareOptions, setShowShareOptions] = useState(false)

  // Example Static Data
  const post = {
    title: "Example Blog Title",
    excerpt: "This is a blog about something awesome.",
    category: "Technology",
    tags: ["JavaScript", "React", "Next.js"],
    readTime: "4 min read",
    publishedAt: new Date().toISOString(),
    content: "Here is your blog content.\n\nThis is a second paragraph.",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176",
    author: {
      name: "Arif Almas",
      role: "Content Writer",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
    }
  }

  const shareUrl = `https://weare-connected.com/blog/${slug}`

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
                <Badge variant="secondary">{post.category}</Badge>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-500">{post.readTime}</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">{post.title}</h1>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">{post.excerpt}</p>

              <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
                <div className="flex items-center space-x-4">
                  <Image
                    src={post.author.image}
                    alt={post.author.name}
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{post.author.name}</div>
                    <div className="text-sm text-gray-600">{post.author.role}</div>
                  </div>
                  <Separator orientation="vertical" className="h-8" />
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-1" />
                    {post.readTime}
                  </div>
                </div>

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
            </header>

            <div className="mb-12">
              <Image
                src={post.image}
                alt={post.title}
                width={800}
                height={400}
                className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
              />
            </div>

            <div className="prose prose-lg max-w-none mb-12 text-gray-700">
              {post.content.split("\n\n").map((paragraph, index) => (
                <p key={index} className="text-lg leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {post.tags.length > 0 && (
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
                  src={post.author.image}
                  alt={post.author.name}
                  width={80}
                  height={80}
                  className="rounded-full object-cover"
                />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{post.author.name}</h3>
                  <p className="text-gray-600 mb-4">{post.author.role}</p>
                  <p className="text-gray-700">
                    {post.author.name} is a passionate content writer helping people understand complex technology easily.
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
