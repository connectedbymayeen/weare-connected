// Load environment variables from .env.local
require("dotenv").config({ path: ".env.local" })

const { MongoClient } = require("mongodb")
const bcrypt = require("bcryptjs")

// Default admin credentials - change these after first login!
const DEFAULT_ADMIN = {
  username: "admin",
  password: "admin123",
  email: "admin@connected.com",
  name: "Admin User",
  role: "admin",
}

async function createAdmin() {
  console.log("🔧 Creating admin user...\n")

  const uri = process.env.MONGODB_URI
  const dbName = process.env.MONGODB_DB || "connected_website"

  if (!uri) {
    console.error("❌ MONGODB_URI not found in environment variables")
    console.log("📝 Make sure your .env.local file has MONGODB_URI uncommented")
    process.exit(1)
  }

  console.log(`📡 Connecting to MongoDB...`)
  console.log(`📊 Database: ${dbName}\n`)

  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log("✅ Connected to MongoDB successfully")

    const db = client.db(dbName)

    // Check if admin already exists
    const existingAdmin = await db.collection("admins").findOne({
      username: DEFAULT_ADMIN.username,
    })

    if (existingAdmin) {
      console.log(`⚠️  Admin user '${DEFAULT_ADMIN.username}' already exists`)
      console.log("✅ You can use these credentials to login:")
      console.log(`   Username: ${DEFAULT_ADMIN.username}`)
      console.log(`   Password: ${DEFAULT_ADMIN.password}`)
      console.log("⚠️  Please change this password after login!")
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

    console.log("\n🎉 Admin user created successfully!")
    console.log("📝 Login Credentials:")
    console.log(`   Username: ${DEFAULT_ADMIN.username}`)
    console.log(`   Password: ${DEFAULT_ADMIN.password}`)
    console.log("⚠️  IMPORTANT: Change this password after first login!")
    console.log(`🆔 Admin ID: ${result.insertedId}`)
  } catch (error) {
    console.error("❌ Error creating admin:", error.message)
  } finally {
    await client.close()
    console.log("\n🔌 MongoDB connection closed")
  }
}

// Run the function
createAdmin().catch(console.error)
