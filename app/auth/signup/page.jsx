"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, UserPlus, Upload } from "lucide-react"
import { uploadToCloudinary } from "@/app/lib/client-cloudinary"
// import { uploadToCloudinary } from "@/lib/client-cloudinary"

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [profileImage, setProfileImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [uploadStatus, setUploadStatus] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB")
        return
      }

      setProfileImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setUploadStatus("")

    try {
      // Validate passwords match
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match")
        setLoading(false)
        return
      }

      // Upload image if exists
      let imageUrl = ""
      if (profileImage) {
        try {
          setUploadStatus("Uploading image...")
          const uploadResult = await uploadToCloudinary(profileImage)
          imageUrl = uploadResult.secure_url
          setUploadStatus("Image uploaded successfully!")
        } catch (uploadError) {
          console.error("Upload error details:", uploadError)
          setError(`Image upload failed: ${uploadError.message || "Unknown error"}`)
          setLoading(false)
          return
        }
      }

      // Register user
      setUploadStatus("Creating account...")
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          profileImage: imageUrl,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Registration failed")
      }

      // Success
      router.push("/auth/login?registered=true")
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
      setUploadStatus("")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-foreground">Create your account</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-medium text-primary hover:text-primary/80">
              Sign in
            </Link>
          </p>
        </div>

        {error && (
          <div
            className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded relative"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {uploadStatus && (
          <div className="bg-primary/10 border border-primary text-primary px-4 py-3 rounded relative">
            <span className="block sm:inline">{uploadStatus}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="name" className="sr-only">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-border placeholder-muted-foreground text-foreground focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Full Name"
              />
            </div>

            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-border placeholder-muted-foreground text-foreground focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleChange}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-border placeholder-muted-foreground text-foreground focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            </div>

            <div>
              <label htmlFor="confirm-password" className="sr-only">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-border placeholder-muted-foreground text-foreground focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Confirm Password"
              />
            </div>

            <div className="flex flex-col items-center space-y-2">
              <label
                htmlFor="profile-image"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer bg-background hover:bg-muted/50"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {imagePreview ? (
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Profile preview"
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Upload profile image</p>
                      <p className="text-xs text-muted-foreground">(Max 5MB)</p>
                    </>
                  )}
                </div>
                <input
                  id="profile-image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
              {imagePreview && (
                <button
                  type="button"
                  onClick={() => {
                    setProfileImage(null)
                    setImagePreview(null)
                  }}
                  className="text-sm text-destructive hover:text-destructive/80"
                >
                  Remove image
                </button>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <UserPlus className="h-5 w-5 text-primary-foreground group-hover:text-primary-foreground/80" />
              </span>
              {loading ? "Processing..." : "Sign up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
