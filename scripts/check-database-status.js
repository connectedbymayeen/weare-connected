// Load environment variables from .env.local
require("dotenv").config({ path: ".env.local" })

const { MongoClient } = require("mongodb")

async function checkDatabaseStatus() {
  console.log("🔍 Checking Database Status...\n")

  // Get MongoDB connection details
  const uri = process.env.MONGODB_URI
  const dbName = process.env.MONGODB_DB || "connected_website"

  if (!uri) {
    console.error("❌ MONGODB_URI not found in environment variables")
    console.log("📝 Make sure your .env.local file has MONGODB_URI uncommented")
    process.exit(1)
  }

  console.log(`📡 Connecting to MongoDB...`)
  console.log(`📊 Database: ${dbName}`)
  console.log(`🔗 URI: ${uri.substring(0, 20)}...${uri.substring(uri.length - 20)}\n`)

  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log("✅ Connected to MongoDB successfully\n")

    const db = client.db(dbName)

    // List all collections
    const collections = await db.listCollections().toArray()
    console.log("📋 Collections in database:")
    if (collections.length === 0) {
      console.log("   (No collections found - database is empty)")
    } else {
      collections.forEach((collection) => {
        console.log(`   - ${collection.name}`)
      })
    }

    // Check for admin users
    console.log("\n👤 Checking for admin users...")
    try {
      const adminCount = await db.collection("admins").countDocuments()
      console.log(`   Found ${adminCount} admin user(s)`)

      if (adminCount === 0) {
        console.log("⚠️  No admin users found - you need to create one!")
      } else {
        const admins = await db
          .collection("admins")
          .find({}, { projection: { username: 1, email: 1, createdAt: 1 } })
          .toArray()
        console.log("   Admin users:")
        admins.forEach((admin) => {
          console.log(`   - Username: ${admin.username}, Email: ${admin.email}`)
        })
      }
    } catch (error) {
      console.log("   No 'admins' collection found")
    }

    // Check for blog posts
    console.log("\n📝 Checking for blog posts...")
    try {
      const blogCount = await db.collection("blog").countDocuments()
      console.log(`   Found ${blogCount} blog post(s) in 'blog' collection`)
    } catch (error) {
      console.log("   No 'blog' collection found")
    }

    // Check for other important collections
    const importantCollections = ["users", "jobs", "services", "team", "ventures"]
    console.log("\n📊 Other collections:")
    for (const collectionName of importantCollections) {
      try {
        const count = await db.collection(collectionName).countDocuments()
        console.log(`   ${collectionName}: ${count} documents`)
      } catch (error) {
        console.log(`   ${collectionName}: collection not found`)
      }
    }
  } catch (error) {
    console.error("❌ Error connecting to database:", error.message)

    if (error.message.includes("authentication failed")) {
      console.log("🔑 Check your MongoDB username and password in the connection string")
    }

    if (error.message.includes("network")) {
      console.log("🌐 Check your internet connection and MongoDB server status")
    }

    if (error.message.includes("ENOTFOUND")) {
      console.log("🔍 Check your MongoDB cluster URL")
    }
  } finally {
    await client.close()
    console.log("\n🔌 MongoDB connection closed")
  }
}

// Run the function
checkDatabaseStatus().catch(console.error)
