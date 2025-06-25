import { NextResponse } from "next/server"
import { connectToDatabase } from "@/app/lib/mongodb"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

async function verifyAuth() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("auth-token")?.value || cookieStore.get("admin-token")?.value

    if (!token) {
      return { success: false, error: "No token provided" }
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    return { success: true, user: decoded }
  } catch (error) {
    console.error("Auth verification failed:", error)
    return { success: false, error: "Invalid token" }
  }
}

export async function GET() {
  try {
    const authResult = await verifyAuth()
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: 401 })
    }

    const { db } = await connectToDatabase()
    const offices = await db.collection("offices").find({}).sort({ createdAt: -1 }).toArray()

    return NextResponse.json(offices)
  } catch (error) {
    console.error("Error fetching offices:", error)
    return NextResponse.json({ error: "Failed to fetch offices" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const authResult = await verifyAuth()
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: 401 })
    }

    const body = await request.json()
    const { db } = await connectToDatabase()

    const office = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("offices").insertOne(office)
    const createdOffice = await db.collection("offices").findOne({ _id: result.insertedId })

    return NextResponse.json(createdOffice, { status: 201 })
  } catch (error) {
    console.error("Error creating office:", error)
    return NextResponse.json({ error: "Failed to create office" }, { status: 500 })
  }
}
