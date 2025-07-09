"use client"

import ImageUpload from "@/app/components/admin/image-upload"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Eye, Loader2, Save } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import HtmlTextEditor from "./components/HtmlTextEditor"

// Calculate dynamic read time
function calculateReadTime(content) {
  if (!content) return "1 min read"
  const wordsPerMinute = 200
  const wordCount = content.trim().split(/\s+/).length
  const readTime = Math.ceil(wordCount / wordsPerMinute)
  return `${readTime} min read`
}

export default function NewBlogPost() {
  const [content, setContent] = useState("");
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
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

  const handleInputChange = (e) => {
    const { name, value } = e.target

    if (name.startsWith("author.")) {
      const authorField = name.split(".")[1]
      setFormData((prev) => ({
        ...prev,
        author: {
          ...prev.author,
          [authorField]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))

      // Auto-generate slug from title
      if (name === "title" && !formData.slug) {
        const slug = value
          .toLowerCase()
          .replace(/[^\w\s]/gi, "")
          .replace(/\s+/g, "-")
        setFormData((prev) => ({ ...prev, slug }))
      }
    }

    // Clear validation error when field is edited
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleImageUpload = (imageData) => {
    setFormData((prev) => ({
      ...prev,
      featuredImage: imageData,
    }))
  }

  const handleAuthorImageUpload = (imageData) => {
    setFormData((prev) => ({
      ...prev,
      author: {
        ...prev.author,
        image: imageData,
      },
    }))
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.title.trim()) errors.title = "Title is required"
    if (!content.trim()) errors.content = "Content is required"
    if (!formData.slug.trim()) errors.slug = "Slug is required"
    if (!formData.author.name.trim()) errors.authorName = "Author name is required"

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      setSaving(true)

      // Calculate dynamic read time
      const readTime = calculateReadTime(formData.content)

      // Format data for submission
      const formattedData = {
        ...formData,
        content,
        tags: formData.tags ? formData.tags.split(",").map((tag) => tag.trim()) : [],
        readTime,
        publishedAt: formData.status === "published" ? new Date().toISOString() : null,
      }

      const response = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create blog post")
      }

      // Trigger revalidation for production
      try {
        const revalidateResponse = await fetch("/api/revalidate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            path: "/blog",
            secret: process.env.REVALIDATE_SECRET || "fallback-secret",
          }),
        })

        if (revalidateResponse.ok) {
          console.log("Revalidation successful")
        } else {
          console.warn("Revalidation failed:", await revalidateResponse.text())
        }
      } catch (revalidateError) {
        console.warn("Failed to revalidate:", revalidateError)
      }

      // Redirect back to blog management page
      router.push("/admin/blog")
    } catch (err) {
      console.error("Error creating post:", err)
      setFormErrors((prev) => ({ ...prev, submit: err.message }))
    } finally {
      setSaving(false)
    }
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
            <h1 className="text-3xl font-bold text-gray-900">Create New Blog Post</h1>
            <p className="text-gray-600 mt-1">Fill in the details to create a new blog post</p>
          </div>
        </div>
        <div className="flex space-x-3">
          {formData.slug && (
            <Button variant="outline" asChild>
              <Link href={`/blog/${formData.slug}`} target="_blank">
                <Eye className="h-4 w-4 mr-2" />
                Preview
            </Link>
            </Button>
          )}
          <Button onClick={handleSubmit} disabled={saving} className="bg-purple-emperor hover:bg-purple-emperor/90">
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Create Post
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter post title"
                />
                {formErrors.title && <p className="text-sm text-red-500">{formErrors.title}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">
                  Slug <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  placeholder="enter-post-slug"
                />
                {formErrors.slug && <p className="text-sm text-red-500">{formErrors.slug}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">
                Content <span className="text-red-500">*</span>
              </Label>
              {/* text area comment and add HTML Text Editor added */}
              {/* <Textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Write your blog post content here..."
                rows={12}
              /> */}
              <HtmlTextEditor content={content} setContent={setContent}/>
              {formErrors.content && <p className="text-sm text-red-500">{formErrors.content}</p>}
              <p className="text-sm text-gray-500">Read time: {calculateReadTime(formData.content)}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                placeholder="Brief summary of the post (optional)"
                rows={3}
              />
            </div>

            {/* Author Section */}
            <div className="border rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold">Author Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="author.name">
                    Author Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="author.name"
                    name="author.name"
                    value={formData.author.name}
                    onChange={handleInputChange}
                    placeholder="Author full name"
                  />
                  {formErrors.authorName && <p className="text-sm text-red-500">{formErrors.authorName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="author.role">Author Role</Label>
                  <Input
                    id="author.role"
                    name="author.role"
                    value={formData.author.role}
                    onChange={handleInputChange}
                    placeholder="e.g., Senior Developer, Content Writer"
                  />
                </div>
              </div>

              <ImageUpload
                onImageUpload={handleAuthorImageUpload}
                defaultImage={formData.author.image}
                label="Author Profile Image"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="Post category"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="tag1, tag2, tag3"
                />
              </div>
            </div>

            <ImageUpload
              onImageUpload={handleImageUpload}
              defaultImage={formData.featuredImage}
              label="Featured Image"
            />

            {formErrors.submit && (
              <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">{formErrors.submit}</div>
            )}

            <div className="flex justify-end space-x-3">
              <Button type="button" variant="outline" onClick={() => router.push("/admin/blog")}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving} className="bg-purple-emperor hover:bg-purple-emperor/90">
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Post"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
