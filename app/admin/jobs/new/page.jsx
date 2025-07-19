"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Save, Loader2, Eye, EyeOff, Upload, X } from "lucide-react"

const DEFAULT_FORM_FIELDS = [
  { id: "fullName", label: "Full Name", type: "text", required: true, visible: true, category: "personal" },
  { id: "email", label: "Email Address", type: "email", required: true, visible: true, category: "personal" },
  { id: "phone", label: "Phone Number", type: "tel", required: true, visible: true, category: "personal" },
  { id: "linkedin", label: "LinkedIn Profile", type: "url", required: false, visible: true, category: "personal" },
  { id: "portfolio", label: "Portfolio/Website", type: "url", required: false, visible: true, category: "personal" },
  {
    id: "experience",
    label: "Years of Experience",
    type: "text",
    required: false,
    visible: true,
    category: "professional",
  },
  {
    id: "expectedSalary",
    label: "Expected Salary",
    type: "text",
    required: false,
    visible: true,
    category: "professional",
  },
  {
    id: "availableFrom",
    label: "Available From",
    type: "date",
    required: false,
    visible: true,
    category: "professional",
  },
  { id: "coverLetter", label: "Cover Letter", type: "textarea", required: true, visible: true, category: "documents" },
  { id: "resume", label: "Resume/CV", type: "file", required: true, visible: true, category: "documents" },
  {
    id: "coverLetterFile",
    label: "Cover Letter Document",
    type: "file",
    required: false,
    visible: true,
    category: "documents",
  },
  {
    id: "portfolioFile",
    label: "Portfolio Document",
    type: "file",
    required: false,
    visible: true,
    category: "documents",
  },
]

export default function NewJob() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  // Add thumbnailImage to the initial formData
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    shortDescription: "",
    thumbnailImage: "",
    department: "",
    location: "",
    type: "Full-time",
    salary: "",
    experienceLevel: "",
    technologies: [],
    responsibilities: [],
    requirements: [],
    benefits: [],
    status: "draft",
    applicationFormFields: DEFAULT_FORM_FIELDS,
  })
  const [newTechnology, setNewTechnology] = useState("")
  const [newResponsibility, setNewResponsibility] = useState("")
  const [newRequirement, setNewRequirement] = useState("")
  const [newBenefit, setNewBenefit] = useState("")
  const [formErrors, setFormErrors] = useState({})

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Auto-generate slug from title
    if (name === "title") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
      setFormData((prev) => ({ ...prev, slug }))
    }

    // Clear validation error when field is edited
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"]
    if (!validTypes.includes(file.type)) {
      alert("Please select a valid image file (JPEG, PNG, GIF, WEBP, SVG)")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB")
      return
    }

    try {
      setUploading(true)

      // Convert file to base64
      const base64 = await convertToBase64(file)

      // Upload using your existing API endpoint
      const response = await fetch("/api/cloudinary/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: base64,
          folder: "job_thumbnails",
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to upload image")
      }

      const data = await response.json()
      setFormData((prev) => ({
        ...prev,
        thumbnailImage: data.secure_url,
      }))
    } catch (error) {
      console.error("Error uploading image:", error)
      alert("Failed to upload image. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
    })
  }

  const addTechnology = () => {
    if (newTechnology.trim() !== "") {
      setFormData((prev) => ({
        ...prev,
        technologies: [...prev.technologies, newTechnology.trim()],
      }))
      setNewTechnology("")
    }
  }

  const removeTechnology = (index) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((_, i) => i !== index),
    }))
  }

  const addResponsibility = () => {
    if (newResponsibility.trim() !== "") {
      setFormData((prev) => ({
        ...prev,
        responsibilities: [...prev.responsibilities, newResponsibility.trim()],
      }))
      setNewResponsibility("")
    }
  }

  const removeResponsibility = (index) => {
    setFormData((prev) => ({
      ...prev,
      responsibilities: prev.responsibilities.filter((_, i) => i !== index),
    }))
  }

  const addRequirement = () => {
    if (newRequirement.trim() !== "") {
      setFormData((prev) => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()],
      }))
      setNewRequirement("")
    }
  }

  const removeRequirement = (index) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
    }))
  }

  const addBenefit = () => {
    if (newBenefit.trim() !== "") {
      setFormData((prev) => ({
        ...prev,
        benefits: [...prev.benefits, newBenefit.trim()],
      }))
      setNewBenefit("")
    }
  }

  const removeBenefit = (index) => {
    setFormData((prev) => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index),
    }))
  }

  const updateFormField = (fieldId, updates) => {
    setFormData((prev) => ({
      ...prev,
      applicationFormFields: prev.applicationFormFields.map((field) =>
        field.id === fieldId ? { ...field, ...updates } : field,
      ),
    }))
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.title.trim()) errors.title = "Title is required"
    if (!formData.description.trim()) errors.description = "Description is required"
    if (!formData.slug.trim()) errors.slug = "Slug is required"
    if (!formData.department.trim()) errors.department = "Department is required"
    if (!formData.location.trim()) errors.location = "Location is required"
    if (!formData.experienceLevel.trim()) errors.experienceLevel = "Experience level is required"

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      setSaving(true)

      const response = await fetch("/api/admin/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create job")
      }

      // Redirect back to jobs management page
      router.push("/admin/jobs")
    } catch (err) {
      console.error("Error creating job:", err)
      setFormErrors((prev) => ({ ...prev, submit: err.message }))
    } finally {
      setSaving(false)
    }
  }

  const groupedFields = {
    personal: formData.applicationFormFields.filter((f) => f.category === "personal"),
    professional: formData.applicationFormFields.filter((f) => f.category === "professional"),
    documents: formData.applicationFormFields.filter((f) => f.category === "documents"),
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => router.push("/admin/jobs")} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create New Job</h1>
            <p className="text-gray-600 mt-1">Add a new job listing with customizable application form</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Button onClick={handleSubmit} disabled={saving} className="bg-purple-700 hover:bg-purple-800">
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Create Job
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Job Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Job Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">
                      Job Title <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter job title"
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
                      placeholder="enter-job-slug"
                    />
                    {formErrors.slug && <p className="text-sm text-red-500">{formErrors.slug}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="department">
                      Department <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      placeholder="e.g. Engineering, Marketing"
                    />
                    {formErrors.department && <p className="text-sm text-red-500">{formErrors.department}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">
                      Location <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="e.g. Remote, San Francisco, CA"
                    />
                    {formErrors.location && <p className="text-sm text-red-500">{formErrors.location}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="type">Job Type</Label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                      <option value="Freelance">Freelance</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="salary">Salary Range</Label>
                    <Input
                      id="salary"
                      name="salary"
                      value={formData.salary}
                      onChange={handleInputChange}
                      placeholder="e.g. BDT 120k - BDT 180k"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experienceLevel">
                    Experience Level <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="experienceLevel"
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleInputChange}
                    placeholder="e.g. 5+ years, 3+ years"
                  />
                  {formErrors.experienceLevel && <p className="text-sm text-red-500">{formErrors.experienceLevel}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">
                    Job Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Write your job description here..."
                    rows={8}
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
                    placeholder="Brief summary of the job (optional)"
                    rows={3}
                  />
                </div>

                {/* Thumbnail Image Upload */}
                <div className="space-y-2 border border-gray-200 rounded-md p-4">
                  <Label>Job Thumbnail Image</Label>
                  <p className="text-sm text-gray-600">
                    Upload a background image for the job card (recommended: 600x400px)
                  </p>

                  {formData.thumbnailImage ? (
                    <div className="relative rounded-md overflow-hidden border border-gray-200">
                      <img
                        src={formData.thumbnailImage || "/placeholder.svg"}
                        alt="Job thumbnail"
                        className="w-full h-48 object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 rounded-full"
                        onClick={() => setFormData((prev) => ({ ...prev, thumbnailImage: "" }))}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
                      <div className="text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF, WEBP, SVG up to 5MB</p>
                          <p className="text-xs text-gray-500">Recommended size: 600x400px</p>
                        </div>
                      </div>

                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className="mt-4 w-full"
                      />

                      {uploading && (
                        <div className="mt-2 flex items-center justify-center text-sm text-gray-500">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Uploading...
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Technologies */}
                <div className="space-y-2 border border-gray-200 rounded-md p-4">
                  <Label>Technologies</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newTechnology}
                      onChange={(e) => setNewTechnology(e.target.value)}
                      placeholder="e.g. React, Node.js"
                      className="flex-1"
                    />
                    <Button type="button" onClick={addTechnology} variant="outline">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.technologies.map((tech, index) => (
                      <Badge key={index} className="px-3 py-1 bg-gray-100 text-gray-800">
                        {tech}
                        <button
                          type="button"
                          className="ml-2 text-gray-500 hover:text-gray-700"
                          onClick={() => removeTechnology(index)}
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Responsibilities */}
                <div className="space-y-2 border border-gray-200 rounded-md p-4">
                  <Label>Key Responsibilities</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newResponsibility}
                      onChange={(e) => setNewResponsibility(e.target.value)}
                      placeholder="Add a responsibility"
                      className="flex-1"
                    />
                    <Button type="button" onClick={addResponsibility} variant="outline">
                      Add
                    </Button>
                  </div>
                  <ul className="mt-2 space-y-1">
                    {formData.responsibilities.map((item, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="flex-1">{item}</span>
                        <button
                          type="button"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => removeResponsibility(index)}
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Requirements */}
                <div className="space-y-2 border border-gray-200 rounded-md p-4">
                  <Label>Requirements</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newRequirement}
                      onChange={(e) => setNewRequirement(e.target.value)}
                      placeholder="Add a requirement"
                      className="flex-1"
                    />
                    <Button type="button" onClick={addRequirement} variant="outline">
                      Add
                    </Button>
                  </div>
                  <ul className="mt-2 space-y-1">
                    {formData.requirements.map((item, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="flex-1">{item}</span>
                        <button
                          type="button"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => removeRequirement(index)}
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Benefits */}
                <div className="space-y-2 border border-gray-200 rounded-md p-4">
                  <Label>Benefits & Perks</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newBenefit}
                      onChange={(e) => setNewBenefit(e.target.value)}
                      placeholder="Add a benefit"
                      className="flex-1"
                    />
                    <Button type="button" onClick={addBenefit} variant="outline">
                      Add
                    </Button>
                  </div>
                  <ul className="mt-2 space-y-1">
                    {formData.benefits.map((item, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="flex-1">{item}</span>
                        <button
                          type="button"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => removeBenefit(index)}
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
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
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                {formErrors.submit && (
                  <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">{formErrors.submit}</div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Application Form Configuration */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Application Form Configuration</CardTitle>
              <p className="text-sm text-gray-600">Customize which fields applicants will see and which are required</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(groupedFields).map(([category, fields]) => (
                <div key={category} className="space-y-3">
                  <h4 className="font-medium text-gray-900 capitalize border-b pb-1">{category} Information</h4>
                  {fields.map((field) => (
                    <div key={field.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{field.label}</div>
                        <div className="text-xs text-gray-500">{field.type}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => updateFormField(field.id, { visible: !field.visible })}
                          className={field.visible ? "text-green-600" : "text-gray-400"}
                        >
                          {field.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </Button>
                        <Checkbox
                          checked={field.required}
                          onCheckedChange={(checked) => updateFormField(field.id, { required: checked })}
                          disabled={!field.visible}
                        />
                        <Label className="text-xs">Required</Label>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
