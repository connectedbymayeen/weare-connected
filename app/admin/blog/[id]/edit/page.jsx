"use client"

import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import "react-quill/dist/quill.snow.css"

import ImageUpload from "@/app/components/admin/image-upload"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Eye, Loader2, Save } from "lucide-react"
import Link from "next/link"

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false })

// Strip HTML tags for plain text word count
function calculateReadTime(content) {
  if (!content) return "1 min read"
  const plainText = content.replace(/<[^>]+>/g, "")
  const wordsPerMinute = 200
  const wordCount = plainText.trim().split(/\s+/).length
  const readTime = Math.ceil(wordCount / wordsPerMinute)
  return `${readTime} min read`
}

export default function EditBlogPost({ params }) {
  const router = useRouter()
  const { id } = params

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    author: {
      name: "",
      role: "",
      image: null,
    },
    category: "",
    tags: "",
    status: "draft",
    featuredImage: null,
  })
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/admin/blog/${id}`)
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || `HTTP ${response.status}: Failed to fetch blog post`)
        }
        const post = await response.json()
        setFormData({
          title: post.title || "",
          slug: post.slug || "",
          content: post.content || "",
          excerpt: post.excerpt || "",
          author: {
            name: post.author?.name || "",
            role: post.author?.role || "",
            image: post.author?.image || null,
          },
          category: post.category || "",
          tags: post.tags ? post.tags.join(", ") : "",
          status: post.status || "draft",
          featuredImage: post.featuredImage || null,
        })
      } catch (err) {
        setError(`Failed to load blog post: ${err.message}`)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchPost()
  }, [id])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith("author.")) {
      const field = name.split(".")[1]
      setFormData((prev) => ({
        ...prev,
        author: { ...prev.author, [field]: value },
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleImageUpload = (imageData) => {
    setFormData((prev) => ({ ...prev, featuredImage: imageData }))
  }

  const handleAuthorImageUpload = (imageData) => {
    setFormData((prev) => ({
      ...prev,
      author: { ...prev.author, image: imageData },
    }))
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.title.trim()) errors.title = "Title is required"
    if (!formData.slug.trim()) errors.slug = "Slug is required"
    if (!formData.content || formData.content.replace(/<[^>]+>/g, "").trim().length === 0)
      errors.content = "Content is required"
    if (!formData.author.name.trim()) errors.authorName = "Author name is required"
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      setSaving(true)
      const readTime = calculateReadTime(formData.content)
      const formattedData = {
        ...formData,
        tags: formData.tags ? formData.tags.split(",").map((tag) => tag.trim()) : [],
        readTime,
        publishedAt:
          formData.status === "published" && !formData.publishedAt
            ? new Date().toISOString()
            : formData.publishedAt,
      }

      const response = await fetch(`/api/admin/blog/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to update blog post`)
      }

      // Optional: revalidate static blog page
      try {
        await fetch("/api/revalidate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            path: "/blog",
            secret: process.env.REVALIDATE_SECRET || "fallback-secret",
          }),
        })
      } catch (err) {
        console.warn("Failed to revalidate:", err)
      }

      router.push("/admin/blog")
    } catch (err) {
      setFormErrors((prev) => ({ ...prev, submit: err.message }))
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-purple-emperor" />
        <span className="ml-2 text-lg text-gray-600">Loading post...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => router.push("/admin/blog")} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Error</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              <p>{error}</p>
              <Button variant="outline" className="mt-2" onClick={() => router.push("/admin/blog")}>
                Return to Blog Management
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => router.push("/admin/blog")} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Blog Post</h1>
            <p className="text-gray-600 mt-1">Update your blog post content and settings</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" asChild>
            <Link href={`/blog/${formData.slug}`} target="_blank">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Link>
          </Button>
          <Button onClick={handleSubmit} disabled={saving} className="bg-purple-emperor hover:bg-purple-emperor/90">
            {saving ? (
              <div>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </div>
            ) : (
              <div>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </div>
            )}
          </Button>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title & Slug */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
                <Input id="title" name="title" value={formData.title} onChange={handleInputChange} />
                {formErrors.title && <p className="text-sm text-red-500">{formErrors.title}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug <span className="text-red-500">*</span></Label>
                <Input id="slug" name="slug" value={formData.slug} onChange={handleInputChange} />
                {formErrors.slug && <p className="text-sm text-red-500">{formErrors.slug}</p>}
              </div>
            </div>

            {/* Rich Text Content */}
            <div className="space-y-2">
              <Label htmlFor="content">Content <span className="text-red-500">*</span></Label>
              <ReactQuill value={formData.content} onChange={(val) => setFormData((prev) => ({ ...prev, content: val }))} />
              {formErrors.content && <p className="text-sm text-red-500">{formErrors.content}</p>}
              <p className="text-sm text-gray-500">Read time: {calculateReadTime(formData.content)}</p>
            </div>

            {/* Excerpt */}
            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Input id="excerpt" name="excerpt" value={formData.excerpt} onChange={handleInputChange} />
            </div>

            {/* Author */}
            <div className="border rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold">Author Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="author.name">Author Name <span className="text-red-500">*</span></Label>
                  <Input id="author.name" name="author.name" value={formData.author.name} onChange={handleInputChange} />
                  {formErrors.authorName && <p className="text-sm text-red-500">{formErrors.authorName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="author.role">Author Role</Label>
                  <Input id="author.role" name="author.role" value={formData.author.role} onChange={handleInputChange} />
                </div>
              </div>
              <ImageUpload onImageUpload={handleAuthorImageUpload} defaultImage={formData.author.image} label="Author Profile Image" />
            </div>

            {/* Category, Tags, Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" name="category" value={formData.category} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select id="status" name="status" value={formData.status} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input id="tags" name="tags" value={formData.tags} onChange={handleInputChange} />
              </div>
            </div>

            <ImageUpload onImageUpload={handleImageUpload} defaultImage={formData.featuredImage} label="Featured Image" />

            {formErrors.submit && (
              <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">{formErrors.submit}</div>
            )}

            <div className="flex justify-end space-x-3">
              <Button type="button" variant="outline" onClick={() => router.push("/admin/blog")}>Cancel</Button>
              <Button type="submit" disabled={saving} className="bg-purple-emperor hover:bg-purple-emperor/90">
                {saving ? (
                  <div><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</div>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
