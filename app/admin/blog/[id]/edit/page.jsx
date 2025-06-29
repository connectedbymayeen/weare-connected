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
import { useEffect, useState } from "react"

// Calculate dynamic read time
function calculateReadTime(content) {
  if (!content) return "1 min read"
  const wordsPerMinute = 200
  const wordCount = content.trim().split(/\s+/).length
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

  // Fetch blog post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true)
        console.log(`Fetching blog post with ID: ${id}`)

        const response = await fetch(`/api/admin/blog/${id}`)
        console.log(`API response status: ${response.status}`)

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          console.error("API error:", errorData)
          throw new Error(errorData.error || `HTTP ${response.status}: Failed to fetch blog post`)
        }

        const post = await response.json()
        console.log("Fetched post:", post)

        // Format data for form
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
        console.error("Error fetching post:", err)
        setError(`Failed to load blog post: ${err.message}`)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchPost()
    }
  }, [id])

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
    if (!formData.content.trim()) errors.content = "Content is required"
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
      console.log("Submitting form data:", formData)

      // Calculate dynamic read time
      const readTime = calculateReadTime(formData.content)

      // Format data for submission
      const formattedData = {
        ...formData,
        tags: formData.tags ? formData.tags.split(",").map((tag) => tag.trim()) : [],
        readTime,
        publishedAt:
          formData.status === "published" && !formData.publishedAt ? new Date().toISOString() : formData.publishedAt,
      }

      console.log("Formatted data for API:", formattedData)

      const response = await fetch(`/api/admin/blog/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      })

      console.log(`Update API response status: ${response.status}`)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("Update API error:", errorData)
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to update blog post`)
      }

      const result = await response.json()
      console.log("Update result:", result)

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
      console.error("Error updating post:", err)
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

      {/* Edit Form */}
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
              <Textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Write your blog post content here..."
                rows={12}
              />
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
                  <div>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </div>
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
