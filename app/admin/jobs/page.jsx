"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Plus, Search, Edit, Trash2, Eye, Loader2, MapPin, Briefcase, Clock, DollarSign } from "lucide-react"
import Link from "next/link"

export default function JobsManagement() {
  const router = useRouter()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [jobToDelete, setJobToDelete] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    shortDescription: "",
    department: "",
    location: "",
    type: "Full-time",
    salary: "",
    experienceLevel: "",
    technologies: [],
    responsibilities: [],
    requirements: [],
    benefits: [],
    status: "open",
  })
  const [newTechnology, setNewTechnology] = useState("")
  const [newResponsibility, setNewResponsibility] = useState("")
  const [newRequirement, setNewRequirement] = useState("")
  const [newBenefit, setNewBenefit] = useState("")
  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch jobs
  useEffect(() => {
    fetchJobs()
  }, [statusFilter, departmentFilter, searchTerm])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams({
        status: statusFilter !== "all" ? statusFilter : "",
        department: departmentFilter !== "all" ? departmentFilter : "",
        search: searchTerm,
      })

      const response = await fetch(`/api/admin/jobs?${queryParams}`)

      if (!response.ok) {
        throw new Error("Failed to fetch jobs")
      }

      const data = await response.json()
      setJobs(data)
    } catch (err) {
      console.error("Error fetching jobs:", err)
      setError("Failed to load jobs. Please try again.")
    } finally {
      setLoading(false)
    }
  }

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

  const handleCreateJob = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      setIsSubmitting(true)

      const response = await fetch("/api/admin/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create job")
      }

      const data = await response.json()

      // Add new job to state and close modal
      setJobs((prev) => [data.job, ...prev])
      setIsCreateModalOpen(false)

      // Reset form
      setFormData({
        title: "",
        slug: "",
        description: "",
        shortDescription: "",
        department: "",
        location: "",
        type: "Full-time",
        salary: "",
        experienceLevel: "",
        technologies: [],
        responsibilities: [],
        requirements: [],
        benefits: [],
        status: "open",
      })
    } catch (err) {
      console.error("Error creating job:", err)
      setFormErrors((prev) => ({ ...prev, submit: err.message }))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteClick = (job) => {
    setJobToDelete(job)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteJob = async () => {
    if (!jobToDelete) return

    try {
      setIsSubmitting(true)

      const response = await fetch(`/api/admin/jobs/${jobToDelete._id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete job")
      }

      // Remove job from state
      setJobs((prev) => prev.filter((job) => job._id !== jobToDelete._id))
      setIsDeleteModalOpen(false)
      setJobToDelete(null)
    } catch (err) {
      console.error("Error deleting job:", err)
      setError("Failed to delete job. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800"
      case "closed":
        return "bg-gray-100 text-gray-800"
      case "draft":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Format date to "X days ago"
  const formatPostedDate = (date) => {
    if (!date) return "Recently"

    const postedDate = new Date(date)
    const now = new Date()
    const diffTime = Math.abs(now - postedDate)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "1 day ago"
    return `${diffDays} days ago`
  }

  // Get unique departments for filter
  const departments = [...new Set(jobs.map((job) => job.department).filter(Boolean))]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Jobs Management</h1>
          <p className="text-gray-600 mt-1">Create, edit, and manage your job listings</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-700 hover:bg-purple-800">
              <Plus className="h-4 w-4 mr-2" />
              New Job
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Job</DialogTitle>
              <DialogDescription>Fill in the details to create a new job listing</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateJob} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    placeholder="e.g. $120k - $180k"
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
                  placeholder="Brief summary of the job (optional)"
                  rows={2}
                />
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
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              {formErrors.submit && (
                <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">{formErrors.submit}</div>
              )}

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="bg-purple-700 hover:bg-purple-800">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Job"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-700 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              <option value="draft">Draft</option>
            </select>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-700 focus:border-transparent"
            >
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-purple-700" />
          <span className="ml-2 text-lg text-gray-600">Loading jobs...</span>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p>{error}</p>
          <Button variant="outline" className="mt-2" onClick={fetchJobs}>
            Try Again
          </Button>
        </div>
      )}

      {/* Jobs List */}
      {!loading && !error && (
        <div className="grid gap-6">
          {jobs.map((job) => (
            <Card key={job._id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                      <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
                    </div>
                    <p className="text-gray-600 mb-4">
                      {job.shortDescription || job.description.substring(0, 150) + "..."}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Briefcase className="h-4 w-4 mr-1" />
                        <span>{job.department}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{job.type}</span>
                      </div>
                      {job.salary && (
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          <span>{job.salary}</span>
                        </div>
                      )}
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>Posted {formatPostedDate(job.createdAt)}</span>
                      </div>
                    </div>
                    {job.technologies && job.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {job.technologies.map((tech, index) => (
                          <Badge key={index} variant="outline" className="bg-gray-100">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/careers/${job.slug}`} target="_blank">
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/jobs/${job._id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteClick(job)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && jobs.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== "all" || departmentFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Get started by creating your first job listing"}
            </p>
            <Button className="bg-purple-700 hover:bg-purple-800" onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Job
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the job "{jobToDelete?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteJob} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
