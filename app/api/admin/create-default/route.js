import { NextResponse } from "next/server"
import { connectToDatabase } from "@/app/lib/mongodb"
import bcrypt from "bcryptjs"

export async function POST() {
  try {
    const { db } = await connectToDatabase()

    // Check if any admin already exists
    const existingAdmin = await db.collection("admins").findOne()

    if (existingAdmin) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin user already exists",
        },
        { status: 400 },
      )
    }

    // Create default admin
    const defaultUsername = "admin"
    const defaultPassword = "admin123" // Change this in production!

    const hashedPassword = await bcrypt.hash(defaultPassword, 12)

    const adminUser = {
      username: defaultUsername,
      password: hashedPassword,
      email: "admin@connected.com",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("admins").insertOne(adminUser)

    console.log("Default admin created:", {
      id: result.insertedId,
      username: defaultUsername,
    })

    return NextResponse.json({
      success: true,
      message: "Default admin user created successfully",
      credentials: {
        username: defaultUsername,
        password: defaultPassword,
      },
    })
  } catch (error) {
    console.error("Error creating default admin:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    )
  }
}
