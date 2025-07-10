import { v2 as cloudinary } from "cloudinary"

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadImage(imageData, folder = "website_content") {
  try {
    console.log("Cloudinary config check:", {
      hasCloudName: !!process.env.CLOUDINARY_CLOUD_NAME,
      hasApiKey: !!process.env.CLOUDINARY_API_KEY,
      hasApiSecret: !!process.env.CLOUDINARY_API_SECRET,
      folder,
    })

    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      throw new Error("Cloudinary configuration is missing. Please check environment variables.")
    }

    console.log("Starting Cloudinary upload...")

    const result = await cloudinary.uploader.upload(imageData, {
      folder: folder,
      resource_type: "auto", // Automatically detect file type
      quality: "auto", // Optimize quality
      fetch_format: "auto", // Optimize format
    })

    console.log("Cloudinary upload result:", {
      public_id: result.public_id,
      secure_url: result.secure_url,
      format: result.format,
      bytes: result.bytes,
    })

    return result
  } catch (error) {
    console.error("Cloudinary upload error:", error)

    // Provide more specific error messages
    if (error.message.includes("Invalid image file")) {
      throw new Error("Invalid image file format")
    } else if (error.message.includes("File size too large")) {
      throw new Error("File size is too large")
    } else if (error.message.includes("Invalid API key")) {
      throw new Error("Cloudinary configuration error")
    } else {
      throw new Error(`Upload failed: ${error.message}`)
    }
  }
}

export async function deleteImage(publicId) {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    return result
  } catch (error) {
    console.error("Error deleting image:", error)
    throw error
  }
}

export function getOptimizedImageUrl(publicId, options = {}) {
  const { width = 800, height = 600, crop = "fill", quality = "auto", format = "auto" } = options

  return cloudinary.url(publicId, {
    width,
    height,
    crop,
    quality,
    fetch_format: format,
  })
}
