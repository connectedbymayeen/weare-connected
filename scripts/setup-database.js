// This script sets up the database with initial data
// Run with: node scripts/setup-database.js

const { MongoClient } = require("mongodb")
const bcrypt = require("bcryptjs")
require("dotenv").config({ path: ".env.local" })

// Default admin credentials
const DEFAULT_ADMIN = {
  username: "admin",
  password: "admin123",
  email: "admin@example.com",
  name: "Admin User",
  role: "admin",
}

async function setupDatabase() {
  // Get MongoDB connection string from environment variables
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017"
  const dbName = process.env.MONGODB_DB || "connected_website"

  console.log("Setting up database...")
  console.log(`URI: ${uri}`)
  console.log(`Database: ${dbName}`)

  // Create a new MongoClient
  const client = new MongoClient(uri)

  try {
    // Connect to the MongoDB server
    await client.connect()
    console.log("Connected to MongoDB")

    // Get the database
    const db = client.db(dbName)

    // Create collections if they don't exist
    const collections = ["admins", "users", "blog", "services", "jobs", "team", "case_studies", "messages"]

    for (const collection of collections) {
      const exists = await db.listCollections({ name: collection }).hasNext()
      if (!exists) {
        console.log(`Creating collection: ${collection}`)
        await db.createCollection(collection)
      } else {
        console.log(`Collection already exists: ${collection}`)
      }
    }

    // Check if admin user already exists
    const existingAdmin = await db.collection("admins").findOne({ username: DEFAULT_ADMIN.username })

    if (existingAdmin) {
      console.log(`Admin user '${DEFAULT_ADMIN.username}' already exists`)
    } else {
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

      console.log(`Admin user '${DEFAULT_ADMIN.username}' created successfully with ID: ${result.insertedId}`)
      console.log(`Username: ${DEFAULT_ADMIN.username}`)
      console.log(`Password: ${DEFAULT_ADMIN.password}`)
      console.log("Please change this password after first login")
    }

    // Create indexes for better performance
    console.log("Creating indexes...")
    await db.collection("users").createIndex({ email: 1 }, { unique: true })
    await db.collection("admins").createIndex({ username: 1 }, { unique: true })
    await db.collection("blog").createIndex({ slug: 1 }, { unique: true })
    await db.collection("services").createIndex({ slug: 1 }, { unique: true })

    console.log("Database setup completed successfully")
  } catch (error) {
    console.error("Error setting up database:", error)
  } finally {
    // Close the connection
    await client.close()
    console.log("MongoDB connection closed")
  }
}

// Run the function
setupDatabase().catch(console.error)
