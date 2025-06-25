import { v2 as cloudinary } from "cloudinary"

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function GET() {
  try {
    // Generate timestamp for the signature
    const timestamp = Math.round(new Date().getTime() / 1000)

    // Generate the signature
    // The string to sign should include parameters that will be sent with the upload
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp,
        upload_preset: "user_profiles", // Must match the preset name in Cloudinary
      },
      process.env.CLOUDINARY_API_SECRET,
    )

    // Return the signature and other necessary data
    return Response.json({
      signature,
      timestamp,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
    })
  } catch (error) {
    console.error("Error generating signature:", error)
    return Response.json({ error: "Failed to generate signature" }, { status: 500 })
  }
}
