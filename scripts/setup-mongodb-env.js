// This script helps set up MongoDB environment variables
const fs = require("fs")
const path = require("path")
const readline = require("readline")

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

console.log("\n=== MongoDB Connection Setup ===\n")
console.log("You need to set up a MongoDB Atlas account or use another MongoDB provider.")
console.log("Visit https://www.mongodb.com/cloud/atlas to create a free MongoDB Atlas account.\n")

rl.question("Enter your MongoDB URI (e.g., mongodb+srv://username:password@cluster.mongodb.net/): ", (mongoUri) => {
  rl.question("Enter your database name (default: connected_website): ", (dbName) => {
    const database = dbName || "connected_website"

    // Create or update .env file
    try {
      let envContent = ""

      // Try to read existing .env file
      try {
        envContent = fs.readFileSync(".env", "utf8")
      } catch (err) {
        // File doesn't exist, create new one
        envContent = ""
      }

      // Update MongoDB variables
      const envLines = envContent.split("\n")
      const updatedLines = []
      let mongoUriAdded = false
      let mongoDbAdded = false

      // Update existing variables if they exist
      for (const line of envLines) {
        if (line.startsWith("MONGODB_URI=")) {
          updatedLines.push(`MONGODB_URI=${mongoUri}`)
          mongoUriAdded = true
        } else if (line.startsWith("MONGODB_DB=")) {
          updatedLines.push(`MONGODB_DB=${database}`)
          mongoDbAdded = true
        } else {
          updatedLines.push(line)
        }
      }

      // Add variables if they don't exist
      if (!mongoUriAdded) {
        updatedLines.push(`MONGODB_URI=${mongoUri}`)
      }
      if (!mongoDbAdded) {
        updatedLines.push(`MONGODB_DB=${database}`)
      }

      // Write updated content to .env file
      fs.writeFileSync(".env", updatedLines.join("\n"))

      console.log("\n✅ MongoDB environment variables have been added to your .env file.")
      console.log("\n=== Next Steps ===")
      console.log("1. Make sure your MongoDB Atlas cluster is properly configured:")
      console.log("   - Network access allows connections from your IP address")
      console.log("   - Database user has the correct permissions")
      console.log("2. Run 'npm run seed-database' to populate your database with initial data")
      console.log("3. Restart your Next.js application to use the new database connection")

      rl.close()
    } catch (err) {
      console.error("Error updating .env file:", err)
      rl.close()
    }
  })
})
