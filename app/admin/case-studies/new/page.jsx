"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Loader2, Save } from "lucide-react"
import Link from "next/link"
import ImageUpload from "@/app/components/admin/image-upload"

export default function NewCaseStudyPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    client: "",
    description: "",
    shortDescription: "",
    industry: "",
    services: "",
    challenge: "",
    solution: "",
    results: "",
    testimonial: "",
    completionDate: "",
    status: "published",
    featuredImage: null,
  })
  const [formErrors, setFormErrors] = useState({})

  const handleInputChange = (e) => {
    const { name, value } = e.target
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

    // Clear validation error when field is edited
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleFeaturedImageUpload = (imageData) => {
    setFormData((prev) => ({
      ...prev,
      featuredImage: imageData,
    }))
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.title.trim()) errors.title = "Title is required"
    if (!formData.client.trim()) errors.client = "Client name is required"
    if (!formData.description.trim()) errors.description = "Description is required"
    if (!formData.slug.trim()) errors.slug = "Slug is required"

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      setSaving(true)

      // Format services as array if provided
      const formattedData = {
        ...formData,
        services: formData.services
          ? formData.services
              .split(",")
              .map((service) => service.trim())
              .filter(Boolean)
          : [],
      }

      const response = await fetch("/api/admin/case-studies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create case study")
      }

      router.push("/admin/case-studies")
    } catch (err) {
      console.error("Error creating case study:", err)
      setFormErrors((prev) => ({ ...prev, submit: err.message }))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/admin/case-studies">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Case Studies
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create New Case Study</h1>
            <p className="text-gray-600 mt-1">Add a new case study to showcase your work</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Case Study Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter case study title"
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
                  placeholder="enter-case-study-slug"
                />
                {formErrors.slug && <p className="text-sm text-red-500">{formErrors.slug}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="client">
                Client Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="client"
                name="client"
                value={formData.client}
                onChange={handleInputChange}
                placeholder="Enter client name"
              />
              {formErrors.client && <p className="text-sm text-red-500">{formErrors.client}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Write your case study description here..."
                rows={6}
              />
              {formErrors.description && <p className="text-sm text-red-500">{formErrors.description}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="shortDescription">Short Description</Label>
              <Textarea
                id="shortDescription"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleInputChange}
                placeholder="Brief summary of the case study (optional)"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  placeholder="e.g. Healthcare, Finance, Retail"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="services">Services (comma separated)</Label>
                <Input
                  id="services"
                  name="services"
                  value={formData.services}
                  onChange={handleInputChange}
                  placeholder="e.g. Web Design, Development, SEO"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="challenge">Challenge</Label>
              <Textarea
                id="challenge"
                name="challenge"
                value={formData.challenge}
                onChange={handleInputChange}
                placeholder="Describe the challenge the client faced"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="solution">Solution</Label>
              <Textarea
                id="solution"
                name="solution"
                value={formData.solution}
                onChange={handleInputChange}
                placeholder="Describe the solution you provided"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="results">Results</Label>
              <Textarea
                id="results"
                name="results"
                value={formData.results}
                onChange={handleInputChange}
                placeholder="Describe the results achieved"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="testimonial">Client Testimonial</Label>
              <Textarea
                id="testimonial"
                name="testimonial"
                value={formData.testimonial}
                onChange={handleInputChange}
                placeholder="Add a client testimonial (optional)"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="completionDate">Completion Date</Label>
                <Input
                  id="completionDate"
                  name="completionDate"
                  type="date"
                  value={formData.completionDate}
                  onChange={handleInputChange}
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
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Featured Image</Label>
              <ImageUpload
                onImageUpload={handleFeaturedImageUpload}
                defaultImage={formData.featuredImage}
                label="Featured Image"
              />
            </div>

            {formErrors.submit && (
              <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">{formErrors.submit}</div>
            )}

            <div className="flex gap-4">
              <Button type="submit" disabled={saving} className="bg-purple-emperor hover:bg-purple-emperor/90">
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Create Case Study
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/case-studies">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
