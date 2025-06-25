// Enhanced script to create admin user with better error handling
const { MongoClient } = require("mongodb")
const bcrypt = require("bcryptjs")

// Default admin credentials - change these!
const DEFAULT_ADMIN = {
  username: "admin",
  password: "admin123", // Change this!
  email: "admin@connected.com",
  name: "Admin User",
  role: "admin",
}

async function createAdmin() {
  console.log("🔧 Creating admin user...")

  // Get MongoDB connection string from environment variables
  const uri = process.env.MONGODB_URI
  const dbName = process.env.MONGODB_DB || "connected_website"

  if (!uri) {
    console.error("❌ MONGODB_URI environment variable is not set")
    console.log("Please add MONGODB_URI to your .env.local file")
    process.exit(1)
  }

  console.log(`📡 Connecting to MongoDB...`)
  console.log(`📊 Database: ${dbName}`)

  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log("✅ Connected to MongoDB successfully")

    const db = client.db(dbName)

    // List all collections to see what exists
    const collections = await db.listCollections().toArray()
    console.log(
      "📋 Existing collections:",
      collections.map((c) => c.name),
    )

    // Check if admin user already exists
    const existingAdmin = await db.collection("admins").findOne({ username: DEFAULT_ADMIN.username })

    if (existingAdmin) {
      console.log(`⚠️  Admin user '${DEFAULT_ADMIN.username}' already exists`)
      console.log("✅ You can use these credentials to login:")
      console.log(`   Username: ${DEFAULT_ADMIN.username}`)
      console.log(`   Password: ${DEFAULT_ADMIN.password}`)
      return
    }

    // Hash the password
    console.log("🔐 Hashing password...")
    const salt = await bcrypt.genSalt(12)
    const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN.password, salt)

    // Create admin user
    console.log("👤 Creating admin user...")
    const result = await db.collection("admins").insertOne({
      username: DEFAULT_ADMIN.username,
      password: hashedPassword,
      email: DEFAULT_ADMIN.email,
      name: DEFAULT_ADMIN.name,
      role: DEFAULT_ADMIN.role,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLogin: null,
    })

    console.log("🎉 Admin user created successfully!")
    console.log("📝 Login Credentials:")
    console.log(`   Username: ${DEFAULT_ADMIN.username}`)
    console.log(`   Password: ${DEFAULT_ADMIN.password}`)
    console.log("⚠️  IMPORTANT: Please change this password after first login!")
    console.log(`🆔 Admin ID: ${result.insertedId}`)
  } catch (error) {
    console.error("❌ Error creating admin:", error.message)

    if (error.message.includes("authentication failed")) {
      console.log("🔑 Check your MongoDB connection string and credentials")
    }

    if (error.message.includes("network")) {
      console.log("🌐 Check your internet connection and MongoDB server status")
    }
  } finally {
    await client.close()
    console.log("🔌 MongoDB connection closed")
  }
}

// Run the function
createAdmin().catch(console.error)
