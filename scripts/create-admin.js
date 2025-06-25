// This script creates an admin user in the database
// Run with: node -r dotenv/config scripts/create-admin.js

const { MongoClient } = require("mongodb")
const bcrypt = require("bcryptjs")

// Default admin credentials
const DEFAULT_ADMIN = {
  username: "admin",
  password: "admin123",
  email: "admin@example.com",
  name: "Admin User",
  role: "admin",
}

async function createAdmin() {
  // Get MongoDB connection string from environment variables
  const uri = process.env.MONGODB_URI
  const dbName = process.env.MONGODB_DB

  if (!uri) {
    console.error("MONGODB_URI environment variable is not set")
    process.exit(1)
  }

  if (!dbName) {
    console.error("MONGODB_DB environment variable is not set")
    process.exit(1)
  }

  console.log("Connecting to MongoDB...")

  // Create a new MongoClient
  const client = new MongoClient(uri)

  try {
    // Connect to the MongoDB server
    await client.connect()
    console.log("Connected to MongoDB")

    // Get the database
    const db = client.db(dbName)

    // Check if admins collection exists, create it if not
    const collections = await db.listCollections({ name: "admins" }).toArray()
    if (collections.length === 0) {
      console.log("Creating admins collection...")
      await db.createCollection("admins")
    }

    // Check if admin user already exists
    const existingAdmin = await db.collection("admins").findOne({ username: DEFAULT_ADMIN.username })

    if (existingAdmin) {
      console.log(`Admin user '${DEFAULT_ADMIN.username}' already exists`)
      return
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN.password, salt)

    // Create admin user
    const result = await db.collection("admins").insertOne({
      username: DEFAULT_ADMIN.username,
      password: hashedPassword,
      email: DEFAULT_ADMIN.email,
      name: DEFAULT_ADMIN.name,
      role: DEFAULT_ADMIN.role,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    console.log(`Admin user '${DEFAULT_ADMIN.username}' created successfully`)
    console.log(`Username: ${DEFAULT_ADMIN.username}`)
    console.log(`Password: ${DEFAULT_ADMIN.password}`)
    console.log("Please change this password after first login")
  } finally {
    // Close the connection
    await client.close()
    console.log("MongoDB connection closed")
  }
}

// Run the function
createAdmin().catch(console.error)
