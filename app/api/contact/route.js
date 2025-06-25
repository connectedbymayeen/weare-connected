import { NextResponse } from "next/server"
import { connectToDatabase } from "@/app/lib/mongodb"

// POST new contact message
export async function POST(request) {
  try {
    const data = await request.json()

    console.log("Received contact form data:", data)

    // Validate required fields
    if (!data.name || !data.email || !data.message) {
      return NextResponse.json({ error: "Name, email and message are required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Create contact message with proper structure for admin panel
    const message = {
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      company: data.company || null,
      subject: data.subject || "General Inquiry",
      message: data.message,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "unread", // This matches what the admin panel expects
      replied: false,
      // Additional metadata
      source: "contact_form",
      ipAddress: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
    }

    console.log("Saving message to database:", message)

    // Save to the messages collection (same as admin panel uses)
    const result = await db.collection("messages").insertOne(message)

    console.log("Message saved successfully:", result.insertedId)

    return NextResponse.json(
      {
        success: true,
        message: "Message sent successfully! We'll get back to you within 24 hours.",
        id: result.insertedId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error saving contact message:", error)
    return NextResponse.json(
      {
        error: "Failed to send message. Please try again or contact us directly.",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 },
    )
  }
}
