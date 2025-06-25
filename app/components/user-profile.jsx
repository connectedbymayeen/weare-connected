"use client"

import { useState, useEffect } from "react"
import { Camera, Save, Loader2 } from "lucide-react"

export default function UserProfile({ user, onUpdate }) {
  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    profileImage: user?.profileImage || "",
  })

  const [newProfileImage, setNewProfileImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(user?.profileImage || "")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || "",
        email: user.email || "",
        profileImage: user.profileImage || "",
      })
      setImagePreview(user.profileImage || "")
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setNewProfileImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadImageToCloudinary = async (file) => {
    try {
      // Get upload signature from backend
      const signatureRes = await fetch("/api/cloudinary/signature")
      const { signature, timestamp, cloudName, apiKey, uploadPreset } = await signatureRes.json()

      // Create form data for upload
      const formData = new FormData()
      formData.append("file", file)
      formData.append("signature", signature)
      formData.append("timestamp", timestamp)
      formData.append("api_key", apiKey)
      formData.append("upload_preset", uploadPreset)

      // Upload to Cloudinary
      const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      })

      const uploadData = await uploadRes.json()
      if (uploadData.error) {
        throw new Error(uploadData.error.message)
      }

      return uploadData.secure_url
    } catch (error) {
      console.error("Image upload error:", error)
      throw new Error("Failed to upload profile image")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: "", text: "" })

    try {
      const updatedProfile = { ...profile }

      // Upload new image if selected
      if (newProfileImage) {
        const imageUrl = await uploadImageToCloudinary(newProfileImage)
        updatedProfile.profileImage = imageUrl
      }

      // Update profile via API
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProfile),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile")
      }

      setMessage({
        type: "success",
        text: "Profile updated successfully!",
      })

      // Update parent component
      if (onUpdate) {
        onUpdate(updatedProfile)
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "An error occurred while updating your profile",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-card rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-6">Your Profile</h2>

      {message.text && (
        <div
          className={`mb-4 p-3 rounded ${
            message.type === "success"
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-muted">
                {imagePreview ? (
                  <img src={imagePreview || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">No Image</div>
                )}
              </div>
              <label htmlFor="profileImage" className="mt-2 cursor-pointer">
                <Camera className="w-6 h-6" />
                <span className="sr-only">Upload profile image</span>
              </label>
              <input id="profileImage" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={profile.name}
                onChange={handleChange}
                className="bg-input rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={profile.email}
                onChange={handleChange}
                className="bg-input rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <button
              type="submit"
              className="bg-primary text-white rounded-lg px-4 py-2 text-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring"
              disabled={loading}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span className="ml-2">Save Changes</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
