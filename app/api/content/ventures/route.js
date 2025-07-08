import { connectToDatabase } from "@/app/lib/mongodb"
import { NextResponse } from "next/server"

// GET all ventures for public consumption
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit")) || 0

    const { db } = await connectToDatabase()

    // Build query for active ventures only
    const query = {}

    let venturesQuery = db.collection("ventures").find(query).sort({ createdAt: -1 })

    if (limit > 0) {
      venturesQuery = venturesQuery.limit(limit)
    }

    const ventures = await venturesQuery.toArray()

    // Transform data for public consumption
    const transformedVentures = ventures.map((venture) => ({
      id: venture._id.toString(),
      slug: venture.slug,
      name: venture.name,
      tagline: venture.tagline || venture.shortDescription,
      shortDescription: venture.shortDescription,
      description: venture.description,
      fullDescription: venture.fullDescription,
      image: venture.featuredImage?.url || venture.image,
      featuredImage: venture.featuredImage,
      logo: venture.logo,
      industry: venture.industry,
      category: venture.category,
      status: venture.status,
      foundedYear: venture.foundedYear,
      teamSize: venture.teamSize,
      growth: venture.growth,
      website: venture.website,
      metrics: venture.metrics || [],
      technologies: venture.technologies || [],
      features: venture.features || [],
      testimonials: venture.testimonials || [],
      ctaDescription: venture.ctaDescription || "",
    }))

    return NextResponse.json(transformedVentures)
  } catch (error) {
    console.error("Error fetching ventures:", error)
    return NextResponse.json({ error: "Failed to fetch ventures" }, { status: 500 })
  }
}
