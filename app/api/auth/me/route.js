import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { connectToDatabase } from "@/app/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET() {
  try {
    console.log("=== AUTH ME API START ===")

    // Check environment variables first
    const jwtSecret = process.env.JWT_SECRET
    const mongoUri = process.env.MONGODB_URI
    const mongoDb = process.env.MONGODB_DB

    console.log("Environment check:", {
      hasJwtSecret: !!jwtSecret,
      hasMongoUri: !!mongoUri,
      hasMongoDb: !!mongoDb,
      nodeEnv: process.env.NODE_ENV,
    })

    if (!jwtSecret) {
      console.error("JWT_SECRET is missing")
      return NextResponse.json(
        {
          authenticated: false,
          error: "Server configuration error",
        },
        { status: 500 },
      )
    }

    if (!mongoUri || !mongoDb) {
      console.error("MongoDB configuration is missing")
      return NextResponse.json(
        {
          authenticated: false,
          error: "Database configuration error",
        },
        { status: 500 },
      )
    }

    // Get cookies
    const cookieStore = cookies()
    const userToken = cookieStore.get("auth-token")?.value
    const adminToken = cookieStore.get("admin-token")?.value

    console.log("Cookie check:", {
      hasUserToken: !!userToken,
      hasAdminToken: !!adminToken,
      userTokenLength: userToken?.length || 0,
      adminTokenLength: adminToken?.length || 0,
    })

    if (!userToken && !adminToken) {
      console.log("No authentication tokens found")
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    // Connect to database with error handling
    let db
    try {
      const connection = await connectToDatabase()
      db = connection.db
      console.log("Database connected successfully")
    } catch (dbError) {
      console.error("Database connection failed:", dbError)
      return NextResponse.json(
        {
          authenticated: false,
          error: "Database connection failed",
        },
        { status: 500 },
      )
    }

    // Check user token first
    if (userToken) {
      try {
        console.log("Verifying user token...")
        const decoded = jwt.verify(userToken, jwtSecret)
        console.log("User token decoded:", { id: decoded.id, email: decoded.email })

        // Validate ObjectId
        if (!ObjectId.isValid(decoded.id)) {
          console.error("Invalid user ID format:", decoded.id)
          return NextResponse.json({ authenticated: false }, { status: 401 })
        }

        // Get user from database
        const user = await db.collection("users").findOne({
          _id: new ObjectId(decoded.id),
        })

        if (!user) {
          console.log("User not found in database for ID:", decoded.id)
          return NextResponse.json({ authenticated: false }, { status: 401 })
        }

        console.log("User found:", { id: user._id, email: user.email })

        // Return user data (without password)
        const { password, ...userData } = user

        return NextResponse.json({
          authenticated: true,
          user: {
            ...userData,
            _id: userData._id.toString(),
            role: userData.role || "user",
          },
        })
      } catch (tokenError) {
        console.error("User token verification error:", tokenError.message)
        // Continue to check admin token if user token fails
      }
    }

    // Check admin token
    if (adminToken) {
      try {
        console.log("Verifying admin token...")
        const decoded = jwt.verify(adminToken, jwtSecret)
        console.log("Admin token decoded:", { id: decoded.id, username: decoded.username })

        // Validate ObjectId
        if (!ObjectId.isValid(decoded.id)) {
          console.error("Invalid admin ID format:", decoded.id)
          return NextResponse.json({ authenticated: false }, { status: 401 })
        }

        // Get admin from database
        const admin = await db.collection("admins").findOne({
          _id: new ObjectId(decoded.id),
        })

        if (!admin) {
          console.log("Admin not found in database for ID:", decoded.id)
          return NextResponse.json({ authenticated: false }, { status: 401 })
        }

        console.log("Admin found:", { id: admin._id, username: admin.username })

        // Return admin data (without password)
        const { password, ...adminData } = admin

        return NextResponse.json({
          authenticated: true,
          user: {
            ...adminData,
            _id: adminData._id.toString(),
            role: adminData.role || "admin",
          },
        })
      } catch (tokenError) {
        console.error("Admin token verification error:", tokenError.message)
        return NextResponse.json({ authenticated: false }, { status: 401 })
      }
    }

    // If we get here, both tokens were invalid
    console.log("All authentication attempts failed")
    return NextResponse.json({ authenticated: false }, { status: 401 })
  } catch (error) {
    console.error("=== AUTH ME API ERROR ===", error)
    return NextResponse.json(
      {
        authenticated: false,
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}
