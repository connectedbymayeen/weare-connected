"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Download, Edit, FileArchive, FileText, ImageIcon, Plus, Trash2 } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

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

  useEffect(() => {
    fetchPressKitItems()
  }, [typeFilter, searchTerm])

  const fetchPressKitItems = async () => {
    try {
      const queryParams = new URLSearchParams({
        type: typeFilter !== "all" ? typeFilter : "",
        search: searchTerm,
      })

      const response = await fetch(`/api/admin/press-kit?${queryParams}`)

      if (!response.ok) throw new Error("Failed to fetch press kit items")

      const data = await response.json()
      setPressKitItems(data)
    } catch (err) {
      console.error("Error fetching press kit items:", err)
      setError("Failed to load press kit items. Please try again.")
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const handleFileUpload = (fileData) => {
    setFormData((prev) => ({ ...prev, file: fileData }))
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
      setPressKitItems((prev) => [data.pressKitItem, ...prev])
      setIsCreateModalOpen(false)
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

      if (!response.ok) throw new Error("Failed to delete press kit item")

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
      case "document": return <FileText className="h-6 w-6 text-blue-500" />
      case "image": return <ImageIcon className="h-6 w-6 text-green-500" />
      case "logo": return <ImageIcon className="h-6 w-6 text-purple-500" />
      default: return <FileArchive className="h-6 w-6 text-gray-500" />
    }
  }

  const getFileTypeColor = (fileType) => {
    switch (fileType) {
      case "pdf": return "bg-red-100 text-red-800"
      case "zip": return "bg-yellow-100 text-yellow-800"
      case "png":
      case "jpg":
      case "svg": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters & Header code remains unchanged */}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p>{error}</p>
          <Button variant="outline" className="mt-2" onClick={fetchPressKitItems}>
            Try Again
          </Button>
        </div>
      )}

      {/* Grid */}
      {!error && pressKitItems.length > 0 && (
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

      {!error && pressKitItems.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No press kit items found</h3>
            <p className="text-gray-600 mb-4">No items match your filters or search.</p>
            <Button className="bg-purple-emperor hover:bg-purple-emperor/90" onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Press Kit Item
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog remains */}
    </div>
  )
}
