"use client"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Building, Edit, Eye, Loader2, Plus, Search, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const mockVentures = [
  {
    _id: 1,
    name: "TechFlow",
    slug: "techflow",
    description:
      "A comprehensive SaaS platform that revolutionizes how teams manage workflows and automate repetitive tasks.",
    tagline: "Workflow automation reimagined",
    category: "SaaS",
    status: "active",
    foundedYear: "2022",
    teamSize: "12",
    growth: "+150% YoY",
    website: "https://techflow.example.com",
    metrics: [
      { label: "Active Users", value: "10K+" },
      { label: "Projects", value: "50K+" },
      { label: "Time Saved", value: "2M+ hrs" },
    ],
    technologies: ["React", "Node.js", "PostgreSQL", "AWS"],
    logo: "/placeholder.svg?height=100&width=100",
    featuredImage: "/placeholder.svg?height=400&width=600",
  },
  {
    _id: 2,
    name: "Mobile App Development",
    slug: "mobile-app-development",
    description: "Native and cross-platform mobile applications for iOS and Android",
    tagline: "Native and cross-platform mobile apps",
    category: "Technology",
    status: "active",
    foundedYear: "2023",
    teamSize: "8",
    growth: "+120% YoY",
    website: "https://mobileappdevelopment.com",
    metrics: [
      { label: "Apps Delivered", value: "50+" },
      { label: "Downloads", value: "1M+" },
      { label: "Client Satisfaction", value: "4.9/5" },
    ],
    technologies: ["React Native", "Swift", "Kotlin", "Firebase"],
    logo: "/placeholder.svg?height=100&width=100",
    featuredImage: "/placeholder.svg?height=200&width=300",
  },
]

export default function VenturesPage() {
  const router = useRouter()
  const [ventures, setVentures] = useState(mockVentures)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [ventureToDelete, setVentureToDelete] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch ventures
  useEffect(() => {
    fetchVentures()
  }, [statusFilter, searchTerm])

  const fetchVentures = async () => {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams({
        status: statusFilter !== "all" ? statusFilter : "",
        search: searchTerm,
      })

      const response = await fetch(`/api/admin/ventures?${queryParams}`)

      if (!response.ok) {
        throw new Error("Failed to fetch ventures")
      }

      const data = await response.json()
      setVentures(data)
    } catch (err) {
      console.error("Error fetching ventures:", err)
      setError("Failed to load ventures. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (venture) => {
    setVentureToDelete(venture)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteVenture = async () => {
    if (!ventureToDelete) return

    try {
      setIsSubmitting(true)

      const response = await fetch(`/api/admin/ventures/${ventureToDelete._id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete venture")
      }

      // Remove venture from state
      setVentures((prev) => prev.filter((venture) => venture._id !== ventureToDelete._id))
      setIsDeleteModalOpen(false)
      setVentureToDelete(null)
    } catch (err) {
      console.error("Error deleting venture:", err)
      setError("Failed to delete venture. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ventures Management</h1>
          <p className="text-gray-600 mt-1">Create, edit, and manage your ventures and portfolio companies</p>
        </div>
        <Button className="bg-purple-emperor hover:bg-purple-emperor/90" asChild>
          <Link href="/admin/ventures/new">
            <Plus className="h-4 w-4 mr-2" />
            New Venture
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
                placeholder="Search ventures..."
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="scaling">Scaling</option>
              <option value="upcoming">Upcoming</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-purple-emperor" />
          <span className="ml-2 text-lg text-gray-600">Loading ventures...</span>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p>{error}</p>
          <Button variant="outline" className="mt-2" onClick={fetchVentures}>
            Try Again
          </Button>
        </div>
      )}

      {/* Ventures List */}
      {!loading && !error && (
        <div className="grid gap-6">
          {ventures.map((venture) => (
            <Card key={venture._id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Logo */}
                  <div className="w-full md:w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                    {venture.logo ? (
                      <img
                        src={venture.logo?.url || venture.logo || "/placeholder.svg"}
                        alt={`${venture.name} logo`}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.style.display = "none"
                          e.target.nextSibling.style.display = "flex"
                        }}
                      />
                    ) : (
                      <div className="w-full h-full items-center justify-center">
                        <Building className="h-12 w-12 text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">{venture.name}</h3>
                          <Badge className={getStatusColor(venture.status)}>{venture.status}</Badge>
                          {venture.category && (
                            <Badge variant="outline" className="text-xs">
                              {venture.category}
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{venture.tagline || venture.shortDescription}</p>
                      </div>
                      <div className="flex items-center space-x-2 mt-4 md:mt-0">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/ventures/${venture.slug}`} target="_blank">
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/admin/ventures/${venture._id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteClick(venture)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Details */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-700">Details</h4>
                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
                          {venture.foundedYear && <div>Founded: {venture.foundedYear}</div>}
                          {venture.teamSize && <div>Team: {venture.teamSize} people</div>}
                          {venture.growth && <div>Growth: {venture.growth}</div>}
                          {venture.website && (
                            <a
                              href={venture.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-emperor hover:underline"
                            >
                              Website
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Metrics */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-700">Metrics</h4>
                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                          {venture.metrics && venture.metrics.length > 0 ? (
                            venture.metrics.map((metric, i) => (
                              <div key={i} className="text-gray-600">
                                <span className="font-medium text-purple-emperor">{metric.value}</span>{" "}
                                <span>{metric.label}</span>
                              </div>
                            ))
                          ) : (
                            <span className="text-gray-400">No metrics added</span>
                          )}
                        </div>
                      </div>

                      {/* Technologies */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-700">Technologies</h4>
                        <div className="flex flex-wrap gap-2">
                          {venture.technologies && venture.technologies.length > 0 ? (
                            venture.technologies.map((tech) => (
                              <Badge key={tech} variant="outline" className="text-xs">
                                {tech}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-gray-400">No technologies added</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && ventures.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No ventures found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Get started by creating your first venture"}
            </p>
            <Button className="bg-purple-emperor hover:bg-purple-emperor/90" asChild>
              <Link href="/admin/ventures/new">
                <Plus className="h-4 w-4 mr-2" />
                Create Venture
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogPortal>
          <DialogOverlay />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the venture "{ventureToDelete?.name}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button variant="destructive" onClick={handleDeleteVenture} disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </div>
  )
}
