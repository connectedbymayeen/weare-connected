"use client"

import ImageUpload from "@/app/components/admin/image-upload"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Loader2, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function NewVenturePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    tagline: "",
    category: "SaaS",
    status: "",
    foundedYear: "",
    teamSize: "",
    growth: "",
    website: "",
    metrics: [
      { label: "Active Users", value: "" },
      { label: "Projects", value: "" },
      { label: "Time Saved", value: "" },
    ],
    technologies: [],
    features: [],
    achievements: [],
    testimonials: [],
    logo: null,
    featuredImage: null,
    ctaDescription: "",
  })
  const [techInput, setTechInput] = useState("")
  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Auto-generate slug from name
    if (name === "name" && !formData.slug) {
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

  const handleMetricChange = (index, field, value) => {
    const updatedMetrics = [...formData.metrics]
    updatedMetrics[index] = { ...updatedMetrics[index], [field]: value }
    setFormData((prev) => ({ ...prev, metrics: updatedMetrics }))
  }

  const addMetric = () => {
    setFormData((prev) => ({
      ...prev,
      metrics: [...prev.metrics, { label: "", value: "" }],
    }))
  }

  const removeMetric = (index) => {
    const updatedMetrics = [...formData.metrics]
    updatedMetrics.splice(index, 1)
    setFormData((prev) => ({ ...prev, metrics: updatedMetrics }))
  }

  const handleAddTechnology = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        technologies: [...prev.technologies, techInput.trim()],
      }))
      setTechInput("")
    }
  }

  const removeTechnology = (tech) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((t) => t !== tech),
    }))
  }

  const addFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, ""],
    }))
  }

  const removeFeature = (index) => {
    const updatedFeatures = [...formData.features]
    updatedFeatures.splice(index, 1)
    setFormData((prev) => ({ ...prev, features: updatedFeatures }))
  }

  const addAchievement = () => {
    setFormData((prev) => ({
      ...prev,
      achievements: [...prev.achievements, ""],
    }))
  }

  const removeAchievement = (index) => {
    const updatedAchievements = [...formData.achievements]
    updatedAchievements.splice(index, 1)
    setFormData((prev) => ({ ...prev, achievements: updatedAchievements }))
  }

  const addTestimonial = () => {
    setFormData((prev) => ({
      ...prev,
      testimonials: [...prev.testimonials, { quote: "", author: "", role: "", company: "", image: "" }],
    }))
  }

  const removeTestimonial = (index) => {
    const updatedTestimonials = [...formData.testimonials]
    updatedTestimonials.splice(index, 1)
    setFormData((prev) => ({ ...prev, testimonials: updatedTestimonials }))
  }

  const handleTestimonialChange = (index, field, value) => {
    const updatedTestimonials = [...formData.testimonials]
    updatedTestimonials[index] = { ...updatedTestimonials[index], [field]: value }
    setFormData((prev) => ({ ...prev, testimonials: updatedTestimonials }))
  }

  const handleLogoUpload = (imageData) => {
    setFormData((prev) => ({
      ...prev,
      logo: imageData,
    }))
  }

  const handleFeaturedImageUpload = (imageData) => {
    setFormData((prev) => ({
      ...prev,
      featuredImage: imageData,
    }))
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.name.trim()) errors.name = "Name is required"
    if (!formData.description.trim()) errors.description = "Description is required"
    if (!formData.slug.trim()) errors.slug = "Slug is required"
    if (!formData.tagline.trim()) errors.tagline = "Tagline is required"
    if (!formData.ctaDescription.trim()) errors.ctaDescription = "CTA is required"

    setFormErrors(errors)

    return Object.keys(errors).length === 0
  }

  const handleCreateVenture = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      setIsSubmitting(true)

      const response = await fetch("/api/admin/ventures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create venture")
      }

      // Redirect back to ventures list
      router.push("/admin/ventures")
    } catch (err) {
      console.error("Error creating venture:", err)
      setFormErrors((prev) => ({ ...prev, submit: err.message }))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/ventures">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Venture</h1>
          <p className="text-gray-600 mt-1">Fill in the details to add a new venture to your portfolio</p>
        </div>
      </div>

      <form onSubmit={handleCreateVenture} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter venture name"
                />
                {formErrors.name && <p className="text-sm text-red-500">{formErrors.name}</p>}
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
                  placeholder="enter-venture-slug"
                />
                {formErrors.slug && <p className="text-sm text-red-500">{formErrors.slug}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tagline">
                  Tagline <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="tagline"
                  name="tagline"
                  value={formData.tagline}
                  onChange={handleInputChange}
                  placeholder="Brief tagline (e.g. Workflow automation reimagined)"
                />
                {formErrors.tagline && <p className="text-sm text-red-500">{formErrors.tagline}</p>}
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
                  placeholder="Comprehensive description of the venture"
                  rows={4}
                />
                {formErrors.description && <p className="text-sm text-red-500">{formErrors.description}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="cta">
                  CTA Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="cta"
                  name="ctaDescription"
                  value={formData.ctaDescription}
                  onChange={handleInputChange}
                  placeholder="Call-to-action (e.g. Try for free, Join waitlist)"
                  rows={3}
                />
                {formErrors.cta && <p className="text-sm text-red-500">{formErrors.cta}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder="e.g. SaaS, Fintech"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Input
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    placeholder="e.g. Active, Scaling, Upcoming"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="foundedYear">Founded Year</Label>
                  <Input
                    id="foundedYear"
                    name="foundedYear"
                    value={formData.foundedYear}
                    onChange={handleInputChange}
                    placeholder="e.g. 2022"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="teamSize">Team Size</Label>
                  <Input
                    id="teamSize"
                    name="teamSize"
                    value={formData.teamSize}
                    onChange={handleInputChange}
                    placeholder="e.g. 12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="growth">Growth</Label>
                  <Input
                    id="growth"
                    name="growth"
                    value={formData.growth}
                    onChange={handleInputChange}
                    placeholder="e.g. +150% YoY"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Details */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Metrics */}
              <div>
                <h3 className="text-lg font-medium mb-4">Metrics</h3>
                <div className="space-y-4">
                  {formData.metrics.map((metric, index) => (
                    <div key={index} className="grid grid-cols-5 gap-2 items-center">
                      <div className="col-span-2">
                        <Input
                          placeholder="Label (e.g. Active Users)"
                          value={metric.label}
                          onChange={(e) => handleMetricChange(index, "label", e.target.value)}
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          placeholder="Value (e.g. 10K+)"
                          value={metric.value}
                          onChange={(e) => handleMetricChange(index, "value", e.target.value)}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-red-500"
                        onClick={() => removeMetric(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={addMetric}>
                    <Plus className="h-4 w-4 mr-2" /> Add Metric
                  </Button>
                </div>
              </div>

              {/* Technologies */}
              <div>
                <h3 className="text-lg font-medium mb-4">Technologies</h3>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add technology (e.g. React)"
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTechnology())}
                    />
                    <Button type="button" onClick={handleAddTechnology}>
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary" className="px-2 py-1">
                        {tech}
                        <button
                          type="button"
                          className="ml-2 text-gray-500 hover:text-gray-700"
                          onClick={() => removeTechnology(tech)}
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Images */}
              <div>
                <h3 className="text-lg font-medium mb-4">Images</h3>
                <div className="grid grid-cols-1 gap-4">
                  <ImageUpload onImageUpload={handleLogoUpload} defaultImage={formData.logo} label="Company Logo" />
                  <ImageUpload
                    onImageUpload={handleFeaturedImageUpload}
                    defaultImage={formData.featuredImage}
                    label="Featured Image"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle>Key Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {formData.features.map((feature, index) => (
                <div key={index} className="grid grid-cols-5 gap-2 items-center">
                  <div className="col-span-4">
                    <Input
                      placeholder="Feature"
                      value={feature}
                      onChange={(e) => {
                        const updatedFeatures = [...formData.features]
                        updatedFeatures[index] = e.target.value
                        setFormData((prev) => ({ ...prev, features: updatedFeatures }))
                      }}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-red-500"
                    onClick={() => removeFeature(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                <Plus className="h-4 w-4 mr-2" /> Add Feature
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {formData.achievements.map((achievement, index) => (
                <div key={index} className="grid grid-cols-5 gap-2 items-center">
                  <div className="col-span-4">
                    <Input
                      placeholder="Achievement"
                      value={achievement}
                      onChange={(e) => {
                        const updatedAchievements = [...formData.achievements]
                        updatedAchievements[index] = e.target.value
                        setFormData((prev) => ({ ...prev, achievements: updatedAchievements }))
                      }}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-red-500"
                    onClick={() => removeAchievement(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addAchievement}>
                <Plus className="h-4 w-4 mr-2" /> Add Achievement
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Testimonials */}
        <Card>
          <CardHeader>
            <CardTitle>Testimonials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {formData.testimonials.map((testimonial, index) => (
                <div key={index} className="space-y-2 border rounded-md p-4">
                  <div className="space-y-2">
                    <Label htmlFor={`quote-${index}`}>Quote</Label>
                    <Textarea
                      id={`quote-${index}`}
                      placeholder="Testimonial Quote"
                      value={testimonial.quote}
                      onChange={(e) => handleTestimonialChange(index, "quote", e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`author-${index}`}>Author</Label>
                      <Input
                        id={`author-${index}`}
                        placeholder="Author Name"
                        value={testimonial.author}
                        onChange={(e) => handleTestimonialChange(index, "author", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`role-${index}`}>Role</Label>
                      <Input
                        id={`role-${index}`}
                        placeholder="Author's Role"
                        value={testimonial.role}
                        onChange={(e) => handleTestimonialChange(index, "role", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`company-${index}`}>Company</Label>
                      <Input
                        id={`company-${index}`}
                        placeholder="Company Name"
                        value={testimonial.company}
                        onChange={(e) => handleTestimonialChange(index, "company", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`image-${index}`}>Image URL</Label>
                      <Input
                        id={`image-${index}`}
                        placeholder="Image URL"
                        value={testimonial.image}
                        onChange={(e) => handleTestimonialChange(index, "image", e.target.value)}
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-red-500"
                    onClick={() => removeTestimonial(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addTestimonial}>
                <Plus className="h-4 w-4 mr-2" /> Add Testimonial
              </Button>
            </div>
          </CardContent>
        </Card>

        {formErrors.submit && <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">{formErrors.submit}</div>}

        <div className="flex gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/ventures">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting} className="bg-purple-emperor hover:bg-purple-emperor/90">
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Venture"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
