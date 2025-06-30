import { connectToDatabase } from "@/app/lib/mongodb"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const { db } = await connectToDatabase()

    // Fetch featured ventures (limit to 3 for homepage)
    const ventures = await db
      .collection("ventures")
      .find({ status: "active" })
      .sort({ createdAt: -1 })
      .limit(3)
      .toArray()

    // Fetch services (limit to 4 for homepage)
    const services = await db
      .collection("services")
      .find({ status: "active" })
      .sort({ createdAt: -1 })
      .limit(4)
      .toArray()

    // Fetch case studies (limit to 3 for homepage)
    const caseStudies = await db.collection("case_studies").find({}).sort({ createdAt: -1 }).limit(3).toArray()

    // Transform ventures data
    const transformedVentures = ventures.map((venture) => ({
      id: venture._id.toString(),
      slug: venture.slug || venture._id.toString(),
      name: venture.name || "Untitled Venture",
      tagline: venture.tagline || venture.shortDescription || "Innovation at its finest",
      description: venture.description || "No description available",
      image:
        venture.featuredImage?.url ||
        venture.image ||
        "/placeholder.svg?height=600&width=1200&text=" + encodeURIComponent(venture.name || "Venture"),
      logo:
        venture.logo?.url ||
        venture.logo ||
        "/placeholder.svg?height=120&width=120&text=" + encodeURIComponent(venture.name?.charAt(0) || "V"),
      category: venture.category || "Technology",
      status: venture.status || "active",
      website: venture.website,
      metrics: venture.metrics || [],
      technologies: venture.technologies || [],
    }))

    // Transform services data
    const transformedServices = services.map((service) => ({
      id: service._id.toString(),
      slug: service.slug || service._id.toString(),
      title: service.title || "Untitled Service",
      description: service.shortDescription || service.description || "No description available",
      image:
        service.featuredImage?.url ||
        service.image ||
        "/placeholder.svg?height=400&width=600&text=" + encodeURIComponent(service.title || "Service"),
      icon: service.icon || "Zap",
      features: service.features || [],
      price: service.price,
    }))

    // Transform case studies data
    const transformedCaseStudies = caseStudies.map((study) => ({
      id: study._id.toString(),
      slug: study.slug || study._id.toString(),
      title: study.title || "Untitled Case Study",
      client: study.client || "Client",
      industry: study.industry || "Technology",
      description: study.description || "No description available",
      image:
        study.featuredImage?.url ||
        study.image ||
        "/placeholder.svg?height=400&width=600&text=" + encodeURIComponent(study.title || "Case Study"),
      tags: study.tags || [],
    }))

    const homepageData = {
      heroData: {
        title: "Building the Future of Technology",
        subtitle: "We create, invest in, and scale innovative ventures that solve meaningful problems.",
        stats: [
          { value: "50+", label: "Ventures Launched" },
          { value: "$100M+", label: "Capital Raised" },
          { value: "500+", label: "Jobs Created" },
          { value: "12", label: "Countries" },
        ],
      },
      aboutData: {
        title: "About Connected",
        description:
          "Connected is a venture studio that builds, invests in, and scales technology companies. We combine capital, talent, and expertise to create ventures that solve meaningful problems and generate exceptional returns.",
        metrics: [
          { value: "2018", label: "Founded" },
          { value: "85+", label: "Team Members" },
          { value: "3", label: "Global Offices" },
        ],
      },
      featuredVentures: transformedVentures,
      services: transformedServices,
      caseStudies: transformedCaseStudies,
    }

    return NextResponse.json(homepageData)
  } catch (error) {
    console.error("Error fetching homepage data:", error)

    // Return fallback data if database fails
    return NextResponse.json({
      heroData: {
        title: "Building the Future of Technology",
        subtitle: "We create, invest in, and scale innovative ventures that solve meaningful problems.",
        stats: [
          { value: "50+", label: "Ventures Launched" },
          { value: "$100M+", label: "Capital Raised" },
          { value: "500+", label: "Jobs Created" },
          { value: "12", label: "Countries" },
        ],
      },
      aboutData: {
        title: "About Connected",
        description:
          "Connected is a venture studio that builds, invests in, and scales technology companies. We combine capital, talent, and expertise to create ventures that solve meaningful problems and generate exceptional returns.",
        metrics: [
          { value: "2018", label: "Founded" },
          { value: "85+", label: "Team Members" },
          { value: "3", label: "Global Offices" },
        ],
      },
      featuredVentures: [

      ],
      services: [
        {
          id: "1",
          slug: "web-development",
          title: "Web Development",
          description: "Custom web applications built with modern technologies",
        },
        {
          id: "2",
          slug: "mobile-app-development",
          title: "Mobile App Development",
          description: "Native and cross-platform mobile applications",
        },
      ],
      caseStudies: [],
    })
  }
}
