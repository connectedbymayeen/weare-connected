import { NextResponse } from "next/server"
import { connectToDatabase } from "@/app/lib/mongodb"

// GET all team members (public endpoint)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const department = searchParams.get("department")

    const { db } = await connectToDatabase()

    // Build query - only show active members publicly
    const query = { status: "Active" }
    if (department) query.department = department

    const teamMembers = await db.collection("team").find(query).sort({ createdAt: -1 }).toArray()

    // Serialize the data and remove sensitive information
    const publicMembers = teamMembers.map((member) => ({
      _id: member._id.toString(),
      name: member.name,
      role: member.role,
      department: member.department,
      bio: member.bio,
      profileImage: member.profileImage,
      location: member.location,
      skills: member.skills,
      social: member.social,
      joinDate: member.joinDate,
      // Don't expose email or other sensitive data publicly
    }))

    return NextResponse.json(publicMembers)
  } catch (error) {
    console.error("Error fetching team members:", error)
    return NextResponse.json({ error: "Failed to fetch team members" }, { status: 500 })
  }
}
