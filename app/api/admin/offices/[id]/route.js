import { NextResponse } from "next/server"
import { connectToDatabase } from "@/app/lib/mongodb"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { ObjectId } from "mongodb"

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

export async function GET(request, { params }) {
  try {
    const authResult = await verifyAuth()
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: 401 })
    }

    const { db } = await connectToDatabase()
    const office = await db.collection("offices").findOne({ _id: new ObjectId(params.id) })

    if (!office) {
      return NextResponse.json({ error: "Office not found" }, { status: 404 })
    }

    return NextResponse.json(office)
  } catch (error) {
    console.error("Error fetching office:", error)
    return NextResponse.json({ error: "Failed to fetch office" }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const authResult = await verifyAuth()
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: 401 })
    }

    const body = await request.json()
    const { db } = await connectToDatabase()

    const updateData = {
      ...body,
      updatedAt: new Date(),
    }

    const result = await db.collection("offices").updateOne({ _id: new ObjectId(params.id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Office not found" }, { status: 404 })
    }

    const updatedOffice = await db.collection("offices").findOne({ _id: new ObjectId(params.id) })
    return NextResponse.json(updatedOffice)
  } catch (error) {
    console.error("Error updating office:", error)
    return NextResponse.json({ error: "Failed to update office" }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const authResult = await verifyAuth()
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: 401 })
    }

    const { db } = await connectToDatabase()
    const result = await db.collection("offices").deleteOne({ _id: new ObjectId(params.id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Office not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Office deleted successfully" })
  } catch (error) {
    console.error("Error deleting office:", error)
    return NextResponse.json({ error: "Failed to delete office" }, { status: 500 })
  }
}
