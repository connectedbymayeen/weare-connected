// Simple script to test environment variables
require("dotenv").config({ path: ".env.local" })

console.log("🔍 Testing Environment Variables...\n")

const envVars = [
  "MONGODB_URI",
  "MONGODB_DB",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "JWT_SECRET",
  "NEXT_PUBLIC_BASE_URL",
]

envVars.forEach((varName) => {
  const value = process.env[varName]
  if (value) {
    // Hide sensitive parts of the value
    const displayValue =
      varName.includes("SECRET") || varName.includes("URI") || varName.includes("KEY")
        ? value.substring(0, 10) + "..." + value.substring(value.length - 10)
        : value
    console.log(`✅ ${varName}: ${displayValue}`)
  } else {
    console.log(`❌ ${varName}: NOT SET`)
  }
})

console.log("\n📝 Make sure to remove # comments from your .env.local file!")
