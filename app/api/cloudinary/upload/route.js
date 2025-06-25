import { verifyAuth } from "@/app/lib/auth"
import { uploadImage } from "@/app/lib/cloudinary"
import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    console.log("Cloudinary upload request received")

    // Get the request data
    const body = await request.json()
    const { image, folder = "website_content", requireAuth = true } = body

    console.log("Upload request details:", {
      hasImage: !!image,
      folder,
      requireAuth,
      imageType: image ? typeof image : "undefined",
    })

    if (!image) {
      console.error("No image data provided")
      return NextResponse.json({ error: "Image data is required" }, { status: 400 })
    }

    // Only verify authentication if required (skip for job applications)
    if (requireAuth) {
      console.log("Verifying authentication...")
      const { authenticated } = await verifyAuth(request)

      if (!authenticated) {
        console.error("Authentication failed")
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
      console.log("Authentication successful")
    } else {
      console.log("Skipping authentication for public upload")
    }

    // Validate image data format
    if (!image.startsWith("data:")) {
      console.error("Invalid image format - must be base64 data URL")
      return NextResponse.json({ error: "Invalid image format" }, { status: 400 })
    }

    console.log("Uploading to Cloudinary...")

    // Upload image to Cloudinary
    const result = await uploadImage(image, folder)

    console.log("Upload successful:", {
      public_id: result.public_id,
      secure_url: result.secure_url,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Cloudinary upload error:", error)

    // Return more specific error information
    const errorMessage = error.message || "Failed to upload image"
    const errorDetails = {
      error: errorMessage,
      details: error.toString(),
      timestamp: new Date().toISOString(),
    }

    console.error("Full error details:", errorDetails)

    return NextResponse.json(errorDetails, { status: 500 })
  }
}
