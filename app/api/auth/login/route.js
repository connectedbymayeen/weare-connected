import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { connectToDatabase } from "@/app/lib/mongodb"

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      console.log("Missing email or password")
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 })
    }

    console.log(`User login attempt for email: ${email}`)

    // Connect to database
    const { db } = await connectToDatabase()

    // Find user by email
    const user = await db.collection("users").findOne({ email })

    // Check if user exists
    if (!user) {
      console.log(`User not found: ${email}`)
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
    }

    console.log(`User found: ${email}, verifying password`)

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      console.log(`Invalid password for user: ${email}`)
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
    }

    console.log(`Password valid for user: ${email}, creating token`)

    // Create JWT token
    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        role: user.role || "user",
      },
      process.env.JWT_SECRET || "fallback-secret-do-not-use-in-production",
      { expiresIn: "7d" },
    )

    console.log(`Token created for user: ${email}`)

    // Set cookie
    cookies().set({
      name: "auth-token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    // Return user data (without password)
    const { password: _, ...userData } = user

    // Convert ObjectId to string to make it serializable
    const serializedUser = {
      ...userData,
      _id: userData._id.toString(),
      role: userData.role || "user",
    }

    console.log(`User login successful: ${email}`)

    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: serializedUser,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
