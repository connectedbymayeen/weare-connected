import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI
const options = {}

let client
let clientPromise

// Handle missing MongoDB URI gracefully during build
if (!process.env.MONGODB_URI) {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Please add your Mongo URI to environment variables")
  } else {
    console.warn("MongoDB URI not found. Database features will be disabled.")
    // Create a mock client promise for build time
    clientPromise = Promise.reject(new Error("MongoDB URI not configured"))
  }
} else {
  if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options)
      global._mongoClientPromise = client.connect()
    }
    clientPromise = global._mongoClientPromise
  } else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri, options)
    clientPromise = client.connect()
  }
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise

export async function connectToDatabase() {
  try {
    // Handle case where MongoDB URI is not configured
    if (!process.env.MONGODB_URI) {
      throw new Error("MongoDB URI not configured")
    }

    const client = await clientPromise

    // Use the database name from environment variable, fallback to 'connected_website'
    const dbName = process.env.MONGODB_DB || "connected_website"
    console.log(`Connecting to database: ${dbName}`)

    const db = client.db(dbName)

    return { client, db }
  } catch (error) {
    console.error("MongoDB connection error:", error)
    throw error
  }
}

// Helper function to check if MongoDB is available
export function isMongoDBAvailable() {
  return !!process.env.MONGODB_URI
}
