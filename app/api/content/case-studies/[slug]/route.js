import { NextResponse } from "next/server"
import { connectToDatabase } from "@/app/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request, { params }) {
  try {
    const { slug } = params
    const { db } = await connectToDatabase()

    // Try to find by slug first
    let caseStudy = await db.collection("case_studies").findOne({
      slug,
      status: "published",
    })

    // If not found by slug, try by ID (in case slug is actually an ID)
    if (!caseStudy && ObjectId.isValid(slug)) {
      try {
        caseStudy = await db.collection("case_studies").findOne({
          _id: new ObjectId(slug),
          status: "published",
        })
      } catch (err) {
        console.log("Error trying to find by ID:", err.message)
      }
    }

    if (!caseStudy) {
      return NextResponse.json({ error: "Case study not found" }, { status: 404 })
    }

    // Transform the case study data
    const transformedCaseStudy = {
      id: caseStudy._id.toString(),
      slug: caseStudy.slug || caseStudy._id.toString(),
      title: caseStudy.title || "Untitled Case Study",
      client: caseStudy.client || "Client",
      industry: caseStudy.industry || "Industry",
      description: caseStudy.description || "No description available",
      shortDescription: caseStudy.shortDescription || "",
      challenge: caseStudy.challenge || "",
      solution: caseStudy.solution || "",
      results: caseStudy.results || "",
      testimonial: caseStudy.testimonial || "",
      services: Array.isArray(caseStudy.services) ? caseStudy.services : [],
      completionDate: caseStudy.completionDate || null,
      featuredImage: caseStudy.featuredImage || null,
      gallery: caseStudy.gallery || [],
      createdAt: caseStudy.createdAt || new Date().toISOString(),
      updatedAt: caseStudy.updatedAt || new Date().toISOString(),
    }

    return NextResponse.json(transformedCaseStudy)
  } catch (error) {
    console.error("Error fetching case study:", error)
    return NextResponse.json({ error: "Failed to fetch case study" }, { status: 500 })
  }
}
