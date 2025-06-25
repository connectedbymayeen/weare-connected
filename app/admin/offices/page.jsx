"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Trash2,
  Edit,
  Plus,
  Building,
  MapPin,
  Users,
  Calendar,
  Loader2,
  X,
  ImageIcon,
  Search,
  Filter,
  Grid3X3,
  List,
  Eye,
  Upload,
  Star,
} from "lucide-react"
import { useToast } from "@/app/hooks/use-toast"

export default function OfficesPage() {
  const [offices, setOffices] = useState([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingOffice, setEditingOffice] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [uploadingMain, setUploadingMain] = useState(false)
  const [uploadingGallery, setUploadingGallery] = useState(false)
  const [viewMode, setViewMode] = useState("grid")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    category: "",
    capacity: "",
    establishedYear: "",
    description: "",
    mainImage: "",
    images: [],
  })

  const categories = ["All", "Headquarters", "Regional Office", "Co-working Space", "Innovation Hub", "Remote Office"]

  useEffect(() => {
    fetchOffices()
  }, [])

  const fetchOffices = async () => {
    try {
      const response = await fetch("/api/admin/offices")
      if (response.ok) {
        const data = await response.json()
        setOffices(data)
      } else {
        throw new Error("Failed to fetch offices")
      }
    } catch (error) {
      console.error("Error fetching offices:", error)
      toast({
        title: "Error",
        description: "Failed to fetch offices",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Original image upload functionality
  const handleMainImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploadingMain(true)
    try {
      const formDataUpload = new FormData()
      formDataUpload.append("file", file)
      formDataUpload.append("folder", "offices")

      const response = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: formDataUpload,
      })

      if (response.ok) {
        const data = await response.json()
        setFormData((prev) => ({
          ...prev,
          mainImage: data.media.url,
        }))
        toast({
          title: "Success",
          description: "Main image uploaded successfully",
        })
      } else {
        throw new Error("Upload failed")
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      })
    } finally {
      setUploadingMain(false)
    }
  }

  const handleGalleryImagesUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    setUploadingGallery(true)
    try {
      const uploadPromises = files.map(async (file) => {
        const formDataUpload = new FormData()
        formDataUpload.append("file", file)
        formDataUpload.append("folder", "offices/gallery")

        const response = await fetch("/api/admin/media/upload", {
          method: "POST",
          body: formDataUpload,
        })

        if (response.ok) {
          const data = await response.json()
          return data.media.url
        }
        throw new Error("Upload failed")
      })

      const uploadedUrls = await Promise.all(uploadPromises)
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
      }))

      toast({
        title: "Success",
        description: `${uploadedUrls.length} images uploaded successfully`,
      })
    } catch (error) {
      console.error("Error uploading gallery images:", error)
      toast({
        title: "Error",
        description: "Failed to upload some images",
        variant: "destructive",
      })
    } finally {
      setUploadingGallery(false)
    }
  }

  const removeGalleryImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const url = editingOffice ? `/api/admin/offices/${editingOffice._id}` : "/api/admin/offices"
      const method = editingOffice ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          capacity: Number.parseInt(formData.capacity) || 0,
          establishedYear: Number.parseInt(formData.establishedYear) || new Date().getFullYear(),
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Office ${editingOffice ? "updated" : "created"} successfully`,
        })
        resetForm()
        fetchOffices()
      } else {
        throw new Error("Failed to save office")
      }
    } catch (error) {
      console.error("Error saving office:", error)
      toast({
        title: "Error",
        description: "Failed to save office",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (office) => {
    setEditingOffice(office)
    setFormData({
      name: office.name || "",
      location: office.location || "",
      category: office.category || "",
      capacity: office.capacity?.toString() || "",
      establishedYear: office.establishedYear?.toString() || "",
      description: office.description || "",
      mainImage: office.mainImage || "",
      images: office.images || [],
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this office?")) return

    try {
      const response = await fetch(`/api/admin/offices/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Office deleted successfully",
        })
        fetchOffices()
      } else {
        throw new Error("Failed to delete office")
      }
    } catch (error) {
      console.error("Error deleting office:", error)
      toast({
        title: "Error",
        description: "Failed to delete office",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      location: "",
      category: "",
      capacity: "",
      establishedYear: "",
      description: "",
      mainImage: "",
      images: [],
    })
    setEditingOffice(null)
    setIsDialogOpen(false)
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case "Headquarters":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "Regional Office":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Co-working Space":
        return "bg-green-100 text-green-800 border-green-200"
      case "Innovation Hub":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "Remote Office":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const filteredOffices = offices.filter((office) => {
    const matchesSearch =
      office.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      office.location?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || office.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const stats = {
    total: offices.length,
    headquarters: offices.filter((o) => o.category === "Headquarters").length,
    regional: offices.filter((o) => o.category === "Regional Office").length,
    totalCapacity: offices.reduce((sum, office) => sum + (office.capacity || 0), 0),
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Offices Management</h1>
          <p className="text-lg text-gray-600">Manage your office locations and galleries</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={resetForm}
              size="lg"
              className="bg-gradient-to-r from-[#6529B2] to-[#8B5CF6] hover:from-[#5420A0] hover:to-[#7C3AED]"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Office
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                {editingOffice ? "Edit Office" : "Add New Office"}
              </DialogTitle>
              <DialogDescription>
                {editingOffice ? "Update office information and gallery" : "Create a new office location with gallery"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="images">Images</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name">Office Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., New York Headquarters"
                        required
                        disabled={submitting}
                      />
                    </div>

                    <div>
                      <Label htmlFor="location">Location *</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="e.g., New York, NY, USA"
                        required
                        disabled={submitting}
                      />
                    </div>

                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData({ ...formData, category: value })}
                        disabled={submitting}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories
                            .filter((c) => c !== "All")
                            .map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="capacity">Capacity</Label>
                      <Input
                        id="capacity"
                        type="number"
                        value={formData.capacity}
                        onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                        placeholder="Number of people"
                        disabled={submitting}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="images" className="space-y-6">
                  {/* Main Image Upload */}
                  <div>
                    <Label>Main Image</Label>
                    <div className="mt-2 border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-gray-400 transition-colors">
                      {formData.mainImage ? (
                        <div className="relative">
                          <img
                            src={formData.mainImage || "/placeholder.svg"}
                            alt="Main office image"
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => setFormData({ ...formData, mainImage: "" })}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleMainImageUpload}
                            disabled={uploadingMain || submitting}
                            className="max-w-xs mx-auto"
                          />
                          {uploadingMain && (
                            <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-600">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Uploading main image...
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Gallery Images Upload */}
                  <div>
                    <Label>Gallery Images</Label>
                    <div className="mt-2 space-y-4">
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-gray-400 transition-colors">
                        <div className="text-center">
                          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <Input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleGalleryImagesUpload}
                            disabled={uploadingGallery || submitting}
                            className="max-w-xs mx-auto"
                          />
                          {uploadingGallery && (
                            <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-600">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Uploading gallery images...
                            </div>
                          )}
                        </div>
                      </div>

                      {formData.images.length > 0 && (
                        <div className="grid grid-cols-4 gap-4">
                          {formData.images.map((image, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={image || "/placeholder.svg"}
                                alt={`Gallery ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute -top-2 -right-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeGalleryImage(index)}
                                disabled={submitting}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="details" className="space-y-6">
                  <div>
                    <Label htmlFor="establishedYear">Established Year</Label>
                    <Input
                      id="establishedYear"
                      type="number"
                      value={formData.establishedYear}
                      onChange={(e) => setFormData({ ...formData, establishedYear: e.target.value })}
                      placeholder="2024"
                      disabled={submitting}
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Brief description of the office space..."
                      rows={4}
                      disabled={submitting}
                      className="resize-none"
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end gap-3 pt-6 border-t">
                <Button type="button" variant="outline" onClick={resetForm} disabled={submitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting} className="bg-gradient-to-r from-[#6529B2] to-[#8B5CF6]">
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {editingOffice ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>{editingOffice ? "Update Office" : "Create Office"}</>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Offices</p>
                <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-500 rounded-full">
                <Building className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Headquarters</p>
                <p className="text-3xl font-bold text-purple-900">{stats.headquarters}</p>
              </div>
              <div className="p-3 bg-purple-500 rounded-full">
                <Star className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Regional Offices</p>
                <p className="text-3xl font-bold text-green-900">{stats.regional}</p>
              </div>
              <div className="p-3 bg-green-500 rounded-full">
                <MapPin className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Total Capacity</p>
                <p className="text-3xl font-bold text-orange-900">{stats.totalCapacity}</p>
              </div>
              <div className="p-3 bg-orange-500 rounded-full">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-1 gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search offices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Offices Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOffices.map((office) => (
            <Card key={office._id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
              <div className="relative h-48">
                {office.mainImage ? (
                  <img
                    src={office.mainImage || "/placeholder.svg"}
                    alt={office.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <Building className="w-16 h-16 text-gray-400" />
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <Badge className={`${getCategoryColor(office.category)} border`}>{office.category}</Badge>
                </div>
                {office.images && office.images.length > 0 && (
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-black/70 text-white">
                      +{office.images.length} photos
                    </Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-6">
                <h3 className="font-bold text-xl mb-3 group-hover:text-[#6529B2] transition-colors">{office.name}</h3>
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#6529B2]" />
                    {office.location}
                  </div>
                  {office.capacity && (
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#6529B2]" />
                      {office.capacity} people capacity
                    </div>
                  )}
                  {office.establishedYear && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#6529B2]" />
                      Established {office.establishedYear}
                    </div>
                  )}
                </div>
                {office.description && <p className="text-sm text-gray-600 mb-4 line-clamp-2">{office.description}</p>}
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(office)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDelete(office._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button size="sm" variant="ghost">
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {filteredOffices.map((office) => (
                <div key={office._id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      {office.mainImage ? (
                        <img
                          src={office.mainImage || "/placeholder.svg"}
                          alt={office.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <Building className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">{office.name}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {office.location}
                            </span>
                            {office.capacity && (
                              <span className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                {office.capacity} people
                              </span>
                            )}
                            {office.establishedYear && (
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {office.establishedYear}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={`${getCategoryColor(office.category)} border`}>{office.category}</Badge>
                          <Button size="sm" variant="outline" onClick={() => handleEdit(office)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDelete(office._id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {filteredOffices.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-gray-400 mb-6">
              <Building className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No offices found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || selectedCategory !== "All"
                ? "Try adjusting your search or filter criteria"
                : "Create your first office location to get started"}
            </p>
            {!searchTerm && selectedCategory === "All" && (
              <Button onClick={() => setIsDialogOpen(true)} className="bg-gradient-to-r from-[#6529B2] to-[#8B5CF6]">
                <Plus className="w-4 h-4 mr-2" />
                Add First Office
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
