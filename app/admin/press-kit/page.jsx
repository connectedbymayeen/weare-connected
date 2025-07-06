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
import { Plus, Search, Edit, Trash2, Download, Loader2, FileText, ImageIcon, FileArchive } from "lucide-react"
import Image from "next/image"
import ImageUpload from "@/app/components/admin/image-upload"

// Mock data for press kit items
const mockPressKitItems = [
  {
    _id: 1,
    title: "Company Logo Pack",
    type: "logo",
    description: "Official company logos in various formats (PNG, SVG, AI)",
    fileUrl: "/placeholder.svg?height=200&width=200",
    fileType: "zip",
    fileSize: "2.5 MB",
    dimensions: "Various sizes",
    format: "PNG, SVG, AI",
  },
  {
    _id: 2,
    title: "Company Fact Sheet",
    type: "document",
    description: "Key information about the company, mission, vision, and leadership",
    fileUrl: "/placeholder.svg?height=200&width=200",
    fileType: "pdf",
    fileSize: "1.2 MB",
    pages: 4,
  },
  {
    _id: 3,
    title: "Office Photos",
    type: "image",
    description: "High-resolution photos of our headquarters and offices",
    fileUrl: "/placeholder.svg?height=200&width=200",
    fileType: "zip",
    fileSize: "15 MB",
    dimensions: "Various sizes",
    format: "JPG",
  },
  {
    _id: 4,
    title: "Brand Guidelines",
    type: "document",
    description: "Comprehensive guide to our brand identity, colors, typography, and usage",
    fileUrl: "/placeholder.svg?height=200&width=200",
    fileType: "pdf",
    fileSize: "4.8 MB",
    pages: 24,
  },
]

export default function PressKitManagement() {
  const router = useRouter()
  const [pressKitItems, setPressKitItems] = useState(mockPressKitItems)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    file: null,
    fileSize: "",
    fileType: "",
    published: true,
    dimensions: "",
    format: "",
    pages: "",
  })
  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch press kit items
  useEffect(() => {
    fetchPressKitItems()
  }, [typeFilter, searchTerm])

  const fetchPressKitItems = async () => {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams({
        type: typeFilter !== "all" ? typeFilter : "",
        search: searchTerm,
      })

      const response = await fetch(`/api/admin/press-kit?${queryParams}`)

      if (!response.ok) {
        throw new Error("Failed to fetch press kit items")
      }

      const data = await response.json()
      setPressKitItems(data)
    } catch (err) {
      console.error("Error fetching press kit items:", err)
      setError("Failed to load press kit items. Please try again.")
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

    // Clear validation error when field is edited
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleFileUpload = (fileData) => {
    setFormData((prev) => ({
      ...prev,
      file: fileData,
    }))
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.title.trim()) errors.title = "Title is required"
    if (!formData.category) errors.category = "Category is required"
    if (!formData.file) errors.file = "File is required"

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleCreatePressKitItem = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      setIsSubmitting(true)

      const response = await fetch("/api/admin/press-kit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create press kit item")
      }

      const data = await response.json()

      // Add new press kit item to state and close modal
      setPressKitItems((prev) => [data.pressKitItem, ...prev])
      setIsCreateModalOpen(false)

      // Reset form
      setFormData({
        title: "",
        category: "",
        description: "",
        file: null,
        fileSize: "",
        fileType: "",
        published: true,
        dimensions: "",
        format: "",
        pages: "",
      })
    } catch (err) {
      console.error("Error creating press kit item:", err)
      setFormErrors((prev) => ({ ...prev, submit: err.message }))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteClick = (item) => {
    setItemToDelete(item)
    setIsDeleteModalOpen(true)
  }

  const handleDeletePressKitItem = async () => {
    if (!itemToDelete) return

    try {
      setIsSubmitting(true)

      const response = await fetch(`/api/admin/press-kit/${itemToDelete._id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete press kit item")
      }

      // Remove item from state
      setPressKitItems((prev) => prev.filter((item) => item._id !== itemToDelete._id))
      setIsDeleteModalOpen(false)
      setItemToDelete(null)
    } catch (err) {
      console.error("Error deleting press kit item:", err)
      setError("Failed to delete press kit item. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case "document":
        return <FileText className="h-6 w-6 text-blue-500" />
      case "image":
        return <ImageIcon className="h-6 w-6 text-green-500" />
      case "logo":
        return <ImageIcon className="h-6 w-6 text-purple-500" />
      default:
        return <FileArchive className="h-6 w-6 text-gray-500" />
    }
  }

  const getFileTypeColor = (fileType) => {
    switch (fileType) {
      case "pdf":
        return "bg-red-100 text-red-800"
      case "zip":
        return "bg-yellow-100 text-yellow-800"
      case "png":
      case "jpg":
      case "svg":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Press Kit Management</h1>
          <p className="text-gray-600 mt-1">Manage your press kit resources for media and partners</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-emperor hover:bg-purple-emperor/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Press Kit Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Press Kit Item</DialogTitle>
              <DialogDescription>Upload a new resource to your press kit</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreatePressKitItem} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter title"
                />
                {formErrors.title && <p className="text-sm text-red-500">{formErrors.title}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">
                  Category <span className="text-red-500">*</span>
                </Label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select Category</option>
                  <option value="logos">Logos</option>
                  <option value="brand-guidelines">Brand Guidelines</option>
                  <option value="company-info">Company Info</option>
                  <option value="photos">Photos</option>
                  <option value="videos">Videos</option>
                  <option value="web-assets">Web Assets</option>
                </select>
                {formErrors.category && <p className="text-sm text-red-500">{formErrors.category}</p>}
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="published"
                  name="published"
                  checked={formData.published}
                  onChange={(e) => setFormData((prev) => ({ ...prev, published: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="published">Published (visible on press kit page)</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe this press kit item"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>
                  File <span className="text-red-500">*</span>
                </Label>
                <ImageUpload onImageUpload={handleFileUpload} defaultImage={formData.file} label="Upload File" />
                {formErrors.file && <p className="text-sm text-red-500">{formErrors.file}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fileType">File Type</Label>
                  <Input
                    id="fileType"
                    name="fileType"
                    value={formData.fileType}
                    onChange={handleInputChange}
                    placeholder="e.g. PDF, ZIP, PNG"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fileSize">File Size</Label>
                  <Input
                    id="fileSize"
                    name="fileSize"
                    value={formData.fileSize}
                    onChange={handleInputChange}
                    placeholder="e.g. 2.5 MB"
                  />
                </div>
              </div>

              {(formData.type === "image" || formData.type === "logo") && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dimensions">Dimensions</Label>
                    <Input
                      id="dimensions"
                      name="dimensions"
                      value={formData.dimensions}
                      onChange={handleInputChange}
                      placeholder="e.g. 1920x1080"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="format">Format</Label>
                    <Input
                      id="format"
                      name="format"
                      value={formData.format}
                      onChange={handleInputChange}
                      placeholder="e.g. PNG, JPG, SVG"
                    />
                  </div>
                </div>
              )}

              {formData.type === "document" && (
                <div className="space-y-2">
                  <Label htmlFor="pages">Pages</Label>
                  <Input
                    id="pages"
                    name="pages"
                    type="number"
                    value={formData.pages}
                    onChange={handleInputChange}
                    placeholder="Number of pages"
                  />
                </div>
              )}

              {formErrors.submit && (
                <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">{formErrors.submit}</div>
              )}

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    "Upload Item"
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
                placeholder="Search press kit items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-emperor focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="document">Documents</option>
              <option value="image">Images</option>
              <option value="logo">Logos</option>
              <option value="other">Other</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-purple-emperor" />
          <span className="ml-2 text-lg text-gray-600">Loading press kit items...</span>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p>{error}</p>
          <Button variant="outline" className="mt-2" onClick={fetchPressKitItems}>
            Try Again
          </Button>
        </div>
      )}

      {/* Press Kit Items Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pressKitItems.map((item) => (
            <Card key={item._id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      {getTypeIcon(item.type)}
                      <h3 className="text-lg font-semibold text-gray-900 ml-2">{item.title}</h3>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteClick(item)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {item.fileUrl && (
                    <div className="relative h-40 mb-4 bg-gray-100 rounded-md overflow-hidden">
                      <Image
                        src={item.fileUrl || "/placeholder.svg"}
                        alt={item.title}
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}

                  {item.description && <p className="text-gray-600 text-sm mb-4">{item.description}</p>}

                  <div className="mt-auto flex flex-wrap gap-2">
                    {item.fileType && (
                      <Badge className={getFileTypeColor(item.fileType)}>{item.fileType.toUpperCase()}</Badge>
                    )}
                    {item.fileSize && <span className="text-xs text-gray-500">{item.fileSize}</span>}
                    {item.dimensions && <span className="text-xs text-gray-500">{item.dimensions}</span>}
                    {item.pages && <span className="text-xs text-gray-500">{item.pages} pages</span>}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && pressKitItems.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No press kit items found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || typeFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Get started by adding your first press kit item"}
            </p>
            <Button className="bg-purple-emperor hover:bg-purple-emperor/90" onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Press Kit Item
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
              Are you sure you want to delete "{itemToDelete?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeletePressKitItem} disabled={isSubmitting}>
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
