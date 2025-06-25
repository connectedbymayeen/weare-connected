import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { verifyAuth } from "@/app/lib/auth"
import { connectToDatabase } from "@/app/lib/mongodb"

// GET all messages with pagination and filtering
export async function GET(request) {
  try {
    // Verify admin authentication
    const { authenticated, isAdmin } = await verifyAuth(request)

    if (!authenticated || !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || ""

    const { db } = await connectToDatabase()

    // Build query
    const query = {}
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } },
      ]
    }
    if (status) query.status = status

    // Get total count
    const total = await db.collection("messages").countDocuments(query)

    // Get messages with pagination
    const messages = await db
      .collection("messages")
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    return NextResponse.json({
      messages,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}

// PUT update message status (batch update)
export async function PUT(request) {
  try {
    // Verify admin authentication
    const { authenticated, isAdmin } = await verifyAuth(request)

    if (!authenticated || !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    // Validate required fields
    if (!data.ids || !Array.isArray(data.ids) || data.ids.length === 0) {
      return NextResponse.json({ error: "Message IDs are required" }, { status: 400 })
    }

    if (!data.status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Convert string IDs to ObjectIds
    const objectIds = data.ids.map((id) => {
      if (!ObjectId.isValid(id)) {
        throw new Error(`Invalid message ID: ${id}`)
      }
      return new ObjectId(id)
    })

    // Update messages
    const result = await db.collection("messages").updateMany(
      { _id: { $in: objectIds } },
      {
        $set: {
          status: data.status,
          updatedAt: new Date(),
        },
      },
    )

    return NextResponse.json({
      message: `${result.modifiedCount} messages updated successfully`,
      modifiedCount: result.modifiedCount,
    })
  } catch (error) {
    console.error("Error updating messages:", error)
    return NextResponse.json({ error: "Failed to update messages" }, { status: 500 })
  }
}

// DELETE messages (batch delete)
export async function DELETE(request) {
  try {
    // Verify admin authentication
    const { authenticated, isAdmin } = await verifyAuth(request)

    if (!authenticated || !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const ids = searchParams.get("ids")

    if (!ids) {
      return NextResponse.json({ error: "Message IDs are required" }, { status: 400 })
    }

    const messageIds = ids.split(",")

    // Convert string IDs to ObjectIds
    const objectIds = messageIds.map((id) => {
      if (!ObjectId.isValid(id)) {
        throw new Error(`Invalid message ID: ${id}`)
      }
      return new ObjectId(id)
    })

    const { db } = await connectToDatabase()

    // Delete messages
    const result = await db.collection("messages").deleteMany({ _id: { $in: objectIds } })

    return NextResponse.json({
      message: `${result.deletedCount} messages deleted successfully`,
      deletedCount: result.deletedCount,
    })
  } catch (error) {
    console.error("Error deleting messages:", error)
    return NextResponse.json({ error: "Failed to delete messages" }, { status: 500 })
  }
}
