export async function uploadToCloudinary(file) {
  try {
    // Get the upload signature from our backend
    const signatureResponse = await fetch("/api/cloudinary/signature")

    if (!signatureResponse.ok) {
      const errorData = await signatureResponse.json()
      console.error("Failed to get signature:", errorData)
      throw new Error("Failed to get upload signature")
    }

    const { signature, timestamp, cloudName, apiKey } = await signatureResponse.json()

    // Create form data with all required parameters
    const formData = new FormData()
    formData.append("file", file)
    formData.append("api_key", apiKey)
    formData.append("timestamp", timestamp)
    formData.append("signature", signature)
    formData.append("upload_preset", "user_profiles") // Make sure this preset exists in Cloudinary

    // Log the request details for debugging (remove in production)
    console.log("Upload request details:", {
      cloudName,
      apiKey: apiKey.substring(0, 5) + "...", // Only log part of the key for security
      timestamp,
      hasSignature: !!signature,
      uploadPreset: "user_profiles",
      fileType: file.type,
      fileSize: file.size,
    })

    // Upload to Cloudinary
    const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData,
    })

    // Handle error response
    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.json()
      console.error("Cloudinary error response:", errorData)
      throw new Error(errorData.error?.message || "Upload failed")
    }

    // Return successful response
    return await uploadResponse.json()
  } catch (error) {
    console.error("Cloudinary upload error:", error)
    throw error
  }
}
