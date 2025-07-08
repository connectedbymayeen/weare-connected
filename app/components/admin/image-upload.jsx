"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, ImageIcon, Loader2 } from "lucide-react"
import Image from "next/image"

export default function ImageUpload({ onImageUpload, defaultImage = null, label = "Image" }) {
  const [image, setImage] = useState(defaultImage)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState("")
  const fileInputRef = useRef(null)

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"]
    if (!validTypes.includes(file.type)) {
      setError("Please select a valid image file (JPEG, PNG, GIF, WEBP, SVG)")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB")
      return
    }

    setError("")
    setIsUploading(true)

    try {
      // Convert file to base64 for direct upload
      const base64 = await convertToBase64(file)

      // Upload directly to server-side API
      const uploadRes = await fetch("/api/cloudinary/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: base64,
          folder: "website_content",
        }),
      })

      if (!uploadRes.ok) {
        const errorData = await uploadRes.json()
        throw new Error(errorData.error || "Failed to upload image")
      }

      const uploadData = await uploadRes.json()

      // Set image and call parent callback
      const imageData = {
        url: uploadData.url,
        publicId: uploadData.public_id,
        width: uploadData.width,
        height: uploadData.height,
      }

      setImage(imageData)
      onImageUpload(imageData)
    } catch (err) {
      console.error("Upload error:", err)
      setError(err.message || "Failed to upload image. Please try again.")
    } finally {
      setIsUploading(false)
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

  const handleRemoveImage = () => {
    setImage(null)
    onImageUpload(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="image-upload">{label}</Label>

      {image ? (
        <div className="relative rounded-md overflow-hidden border border-gray-200">
          <Image
            src={image.url || "/placeholder.svg"}
            alt="Uploaded image"
            width={image.width || 300}
            height={image.height || 200}
            className="w-full h-auto max-h-[300px] object-contain"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 rounded-full"
            onClick={handleRemoveImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
          <div className="text-center">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-2">
              <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500">PNG, JPG, GIF, WEBP, SVG up to 5MB</p>
            </div>
          </div>

          <Input
            id="image-upload"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
            className="mt-4 w-full"
          />

          {isUploading && (
            <div className="mt-2 flex items-center justify-center text-sm text-gray-500">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </div>
          )}
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
