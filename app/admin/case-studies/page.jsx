"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Plus, Search, Edit, Trash2, Eye, Loader2, Building, Calendar } from "lucide-react"
import Link from "next/link"
// import ImageUpload from "@/components/admin/image-upload"

// Mock data for case studies
const mockCaseStudies = [
  {
    _id: 1,
    title: "E-commerce Platform Redesign",
    slug: "ecommerce-platform-redesign",
    client: "Fashion Retailer Inc.",
    description: "Complete redesign of an e-commerce platform resulting in 45% increase in conversion rates",
    shortDescription: "E-commerce redesign with 45% conversion increase",
    industry: "Retail",
    services: ["UX/UI Design", "Web Development", "Analytics"],
    challenge: "The client's outdated platform was causing high bounce rates and cart abandonment.",
    solution: "We implemented a modern, mobile-first design with streamlined checkout process.",
    results: "45% increase in conversion rates, 30% reduction in cart abandonment",
    testimonial: "The redesign transformed our business and significantly improved our bottom line.",
    featuredImage: "/placeholder.svg?height=400&width=600",
    gallery: ["/placeholder.svg?height=300&width=400", "/placeholder.svg?height=300&width=400"],
    status: "published",
    completionDate: "2023-06-15",
  },
  {
    _id: 2,
    title: "Mobile Banking App Development",
    slug: "mobile-banking-app",
    client: "Global Finance Bank",
    description: "Development of a secure, user-friendly mobile banking application with biometric authentication",
    shortDescription: "Secure mobile banking app with biometric authentication",
    industry: "Finance",
    services: ["Mobile App Development", "Security Implementation", "UX Design"],
    challenge: "The bank needed a secure yet user-friendly mobile solution for their customers.",
    solution: "We built a native app with advanced security features and intuitive interface.",
    results: "200,000+ downloads in first month, 4.8/5 app store rating",
    testimonial: "The app exceeded our expectations and our customers love the ease of use.",
    featuredImage: "/placeholder.svg?height=400&width=600",
    gallery: ["/placeholder.svg?height=300&width=400", "/placeholder.svg?height=300&width=400"],
    status: "published",
    completionDate: "2023-09-22",
  },
  {
    _id: 3,
    title: "Healthcare Patient Portal",
    slug: "healthcare-patient-portal",
    client: "Metropolitan Medical Center",
    description: "Development of a comprehensive patient portal for appointment scheduling and medical records access",
    shortDescription: "Patient portal for appointment scheduling and records access",
    industry: "Healthcare",
    services: ["Web Application Development", "Integration", "Security"],
    challenge: "The medical center needed to streamline patient communication and record access.",
    solution: "We developed a secure portal integrated with their existing systems.",
    results: "70% reduction in phone calls, 85% patient adoption rate",
    testimonial: "This portal has revolutionized how we interact with patients.",
    featuredImage: "/placeholder.svg?height=400&width=600",
    gallery: ["/placeholder.svg?height=300&width=400", "/placeholder.svg?height=300&width=400"],
    status: "draft",
    completionDate: "2023-11-10",
  },
]

export default function CaseStudiesManagement() {
  const router = useRouter()
  const [caseStudies, setCaseStudies] = useState(mockCaseStudies)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [industryFilter, setIndustryFilter] = useState("all")
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [caseStudyToDelete, setCaseStudyToDelete] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false) // Declare setIsCreateModalOpen

  // Fetch case studies
  useEffect(() => {
    fetchCaseStudies()
  }, [statusFilter, industryFilter, searchTerm])

  const fetchCaseStudies = async () => {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams({
        status: statusFilter !== "all" ? statusFilter : "",
        industry: industryFilter !== "all" ? industryFilter : "",
        search: searchTerm,
      })

      const response = await fetch(`/api/admin/case-studies?${queryParams}`)

      if (!response.ok) {
        throw new Error("Failed to fetch case studies")
      }

      const data = await response.json()
      setCaseStudies(data)
    } catch (err) {
      console.error("Error fetching case studies:", err)
      setError("Failed to load case studies. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (caseStudy) => {
    setCaseStudyToDelete(caseStudy)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteCaseStudy = async () => {
    if (!caseStudyToDelete) return

    try {
      setIsSubmitting(true)

      const response = await fetch(`/api/admin/case-studies/${caseStudyToDelete._id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete case study")
      }

      // Remove case study from state
      setCaseStudies((prev) => prev.filter((study) => study._id !== caseStudyToDelete._id))
      setIsDeleteModalOpen(false)
      setCaseStudyToDelete(null)
    } catch (err) {
      console.error("Error deleting case study:", err)
      setError("Failed to delete case study. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800"
      case "draft":
        return "bg-yellow-100 text-yellow-800"
      case "archived":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Get unique industries for filter
  const industries = [...new Set(caseStudies.map((study) => study.industry).filter(Boolean))]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Case Studies Management</h1>
          <p className="text-gray-600 mt-1">Create, edit, and manage your case studies and client success stories</p>
        </div>
        <Button className="bg-purple-emperor hover:bg-purple-emperor/90" asChild>
          <Link href="/admin/case-studies/new">
            <Plus className="h-4 w-4 mr-2" />
            New Case Study
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search case studies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-emperor focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
            <select
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-emperor focus:border-transparent"
            >
              <option value="all">All Industries</option>
              {industries.map((industry) => (
                <option key={industry} value={industry}>
                  {industry}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-purple-emperor" />
          <span className="ml-2 text-lg text-gray-600">Loading case studies...</span>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p>{error}</p>
          <Button variant="outline" className="mt-2 bg-transparent" onClick={fetchCaseStudies}>
            Try Again
          </Button>
        </div>
      )}

      {/* Case Studies List */}
      {!loading && !error && (
        <div className="grid gap-6">
          {caseStudies.map((caseStudy) => (
            <Card key={caseStudy._id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{caseStudy.title}</h3>
                      <Badge className={getStatusColor(caseStudy.status)}>{caseStudy.status}</Badge>
                    </div>
                    <p className="text-gray-600 mb-4">
                      {caseStudy.shortDescription || caseStudy.description.substring(0, 150) + "..."}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Building className="h-4 w-4 mr-1" />
                        <span>{caseStudy.client}</span>
                      </div>
                      {caseStudy.industry && <span>{caseStudy.industry}</span>}
                      {caseStudy.completionDate && (
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>
                            {new Date(caseStudy.completionDate).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                            })}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/case-studies/${caseStudy.slug}`} target="_blank">
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/case-studies/${caseStudy._id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteClick(caseStudy)}
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
      {!loading && !error && caseStudies.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No case studies found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== "all" || industryFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Get started by creating your first case study"}
            </p>
            <Button className="bg-purple-emperor hover:bg-purple-emperor/90" onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Case Study
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
              Are you sure you want to delete the case study "{caseStudyToDelete?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCaseStudy} disabled={isSubmitting}>
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
