"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Upload,
  Search,
  Grid,
  List,
  Trash2,
  ImageIcon,
  FileText,
  Video,
  Music,
  Archive,
  RefreshCw,
  Copy,
  ExternalLink,
} from "lucide-react"
import { useState, useEffect } from "react"
import Image from "next/image"

export default function MediaPage() {
  const [media, setMedia] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [viewMode, setViewMode] = useState("grid")
  const [selectedMedia, setSelectedMedia] = useState([])
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [uploadFiles, setUploadFiles] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [stats, setStats] = useState(null)

  const fetchMedia = async () => {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams({
        search: searchTerm,
        type: filterType !== "all" ? filterType : "",
      })

      const response = await fetch(`/api/admin/media?${queryParams}`)
      if (response.ok) {
        const data = await response.json()
        setMedia(data.media || [])
        setStats(data.stats || null)
      }
    } catch (error) {
      console.error("Error fetching media:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMedia()
  }, [searchTerm, filterType])

  const getFileIcon = (type) => {
    switch (type) {
      case "image":
        return <ImageIcon className="h-5 w-5 text-green-600" />
      case "video":
        return <Video className="h-5 w-5 text-blue-600" />
      case "audio":
        return <Music className="h-5 w-5 text-purple-600" />
      case "document":
        return <FileText className="h-5 w-5 text-red-600" />
      default:
        return <Archive className="h-5 w-5 text-gray-600" />
    }
  }

  const getFileTypeColor = (type) => {
    switch (type) {
      case "image":
        return "bg-green-100 text-green-800"
      case "video":
        return "bg-blue-100 text-blue-800"
      case "audio":
        return "bg-purple-100 text-purple-800"
      case "document":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleUpload = async () => {
    if (uploadFiles.length === 0) return

    setIsUploading(true)
    try {
      const uploadPromises = uploadFiles.map(async (file) => {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("folder", "media_library")

        const response = await fetch("/api/admin/media/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`)
        }

        return response.json()
      })

      await Promise.all(uploadPromises)
      setUploadFiles([])
      setIsUploadModalOpen(false)
      fetchMedia()
    } catch (error) {
      console.error("Upload error:", error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (mediaId) => {
    if (!confirm("Are you sure you want to delete this media file?")) return

    try {
      const response = await fetch(`/api/admin/media/${mediaId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setMedia(media.filter((item) => item._id !== mediaId))
      }
    } catch (error) {
      console.error("Delete error:", error)
    }
  }

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url)
    // You could add a toast notification here
  }

  const toggleSelection = (mediaId) => {
    setSelectedMedia((prev) => (prev.includes(mediaId) ? prev.filter((id) => id !== mediaId) : [...prev, mediaId]))
  }

  const handleBulkDelete = async () => {
    if (selectedMedia.length === 0) return
    if (!confirm(`Are you sure you want to delete ${selectedMedia.length} files?`)) return

    try {
      const deletePromises = selectedMedia.map((id) => fetch(`/api/admin/media/${id}`, { method: "DELETE" }))

      await Promise.all(deletePromises)
      setMedia(media.filter((item) => !selectedMedia.includes(item._id)))
      setSelectedMedia([])
    } catch (error) {
      console.error("Bulk delete error:", error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Media Library</h1>
          <p className="text-gray-600 mt-1">Manage your media files and assets</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={fetchMedia} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-purple-emperor hover:bg-purple-emperor/90">
                <Upload className="h-4 w-4 mr-2" />
                Upload Files
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Upload Media Files</DialogTitle>
                <DialogDescription>Select files to upload to your media library</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        Drop files here or click to browse
                      </span>
                      <input
                        id="file-upload"
                        type="file"
                        multiple
                        className="hidden"
                        onChange={(e) => setUploadFiles(Array.from(e.target.files || []))}
                        accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
                      />
                    </label>
                  </div>
                </div>

                {uploadFiles.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Selected Files:</h4>
                    {uploadFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">{file.name}</span>
                        <span className="text-xs text-gray-500">{formatFileSize(file.size)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsUploadModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpload} disabled={isUploading || uploadFiles.length === 0}>
                  {isUploading ? "Uploading..." : `Upload ${uploadFiles.length} Files`}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <ImageIcon className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Images</p>
                  <p className="text-xl font-bold">{stats.images || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Video className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Videos</p>
                  <p className="text-xl font-bold">{stats.videos || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-sm text-gray-600">Documents</p>
                  <p className="text-xl font-bold">{stats.documents || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Archive className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Size</p>
                  <p className="text-xl font-bold">{formatFileSize(stats.totalSize || 0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search media files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-emperor focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="image">Images</option>
                <option value="video">Videos</option>
                <option value="audio">Audio</option>
                <option value="document">Documents</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              {selectedMedia.length > 0 && (
                <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete ({selectedMedia.length})
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}>
                {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Media Grid/List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="aspect-square bg-gray-200"></div>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {media.map((item) => (
            <Card key={item._id} className="hover:shadow-lg transition-shadow group">
              <div className="relative aspect-square bg-gray-100 overflow-hidden">
                {item.type === "image" ? (
                  <Image
                    src={item.url || "/placeholder.svg"}
                    alt={item.filename}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">{getFileIcon(item.type)}</div>
                )}

                <div className="absolute top-2 left-2">
                  <input
                    type="checkbox"
                    checked={selectedMedia.includes(item._id)}
                    onChange={() => toggleSelection(item._id)}
                    className="rounded"
                  />
                </div>

                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex space-x-1">
                    <Button size="sm" variant="secondary" onClick={() => copyToClipboard(item.url)}>
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="secondary" asChild>
                      <a href={item.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(item._id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm truncate">{item.filename}</h3>
                    <Badge className={getFileTypeColor(item.type)}>{item.type}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{formatFileSize(item.size || 0)}</span>
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {media.map((item) => (
                <div key={item._id} className="flex items-center space-x-4 p-4 hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={selectedMedia.includes(item._id)}
                    onChange={() => toggleSelection(item._id)}
                    className="rounded"
                  />
                  <div className="flex-shrink-0">{getFileIcon(item.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{item.filename}</p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(item.size || 0)} • {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getFileTypeColor(item.type)}>{item.type}</Badge>
                    <Button size="sm" variant="ghost" onClick={() => copyToClipboard(item.url)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" asChild>
                      <a href={item.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(item._id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!loading && media.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No media files found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filterType !== "all"
                ? "Try adjusting your search or filters"
                : "Get started by uploading your first media file"}
            </p>
            <Button className="bg-purple-emperor hover:bg-purple-emperor/90" onClick={() => setIsUploadModalOpen(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Files
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
