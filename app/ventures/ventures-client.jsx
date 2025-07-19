"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Calendar, ExternalLink, TrendingUp, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import Footer from "../components/footer"
import Header from "../components/header"

export default function VenturesClientPage({ ventures: dbVentures = [] }) {
  const ventures =
    dbVentures.length > 0
      ? dbVentures.map((venture) => ({
        slug: venture.slug || venture.id,
        name: venture.name,
        tagline: venture.tagline || venture.shortDescription,
        description: venture.description,
        category: venture.category || venture.industry || "Tech",
        status: venture.status || "Active",
        founded: venture.foundedYear || venture.year || "2025",
        team: venture.teamSize ? `${venture.teamSize} people` : "Team",
        growth: venture.growth || "Growing",
        image:
          venture.featuredImage?.url ||
          venture.image ||
          "/placeholder.svg?height=400&width=600&text=Venture",
        website: venture.website || "#",
      }))
      : []

  return (
    <>
      <Header />
      <div className="relative min-h-[100vh] flex items-center justify-center overflow-hidden -mt-[140px] pt-[160px]">
        {/* Background Layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-[#E9E6FF]/40 to-[#AA99FF]/30" />
        <div className="absolute inset-0 bg-primary/8" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(101,41,178,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(101,41,178,0.05)_1px,transparent_1px)] bg-[size:100px_100px]" />

        <div className="pt-2 pb-8 relative z-10 w-full">
          <div className="container mx-auto px-4 sm:px-6 md:px-8 py-8 max-w-[1600px]">
            <div className="text-center mb-12 max-w-6xl mx-auto">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-pot-black mb-6 font-syne">Our Ventures</h1>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Connected is home to a growing portfolio of ventures across tech, media, lifestyle, and digital
                services. Each brand is built with purpose, backed by strategy, and designed to shape the future. This
                is where ideas turn into impact.
              </p>
            </div>
          </div>

  <section className="py-8 sm:py-10">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {ventures.length === 0 ? (
        <div className="col-span-full text-center text-lg text-gray-500 font-medium py-12">
          No ventures available at this moment.
        </div>
      ) : (
        ventures.map((venture) => (
          <Card
            key={venture.slug}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col"
          >
            {/* Image Section */}
            <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
              <Image
                src={venture.image || "/placeholder.svg"}
                alt={venture.name}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-t-lg" />
              <div className="absolute bottom-3 left-3 flex gap-2">
                <Badge className="bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {venture.status}
                </Badge>
                <Badge className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">
                  {venture.category || "Tech"}
                </Badge>
              </div>
            </div>

            {/* Content Section */}
            <CardHeader className="px-4 pt-4 pb-2 flex flex-col flex-grow">
              <CardTitle className="text-xl font-semibold text-gray-900 mb-1">
                {venture.name}
              </CardTitle>
              <p className="text-sm text-primary font-medium mb-2">
                {venture.tagline}
              </p>
              <CardDescription className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4">
                {venture.description}
              </CardDescription>
            </CardHeader>

            {/* Stats and Button */}
            <CardContent className="px-4 pt-0 pb-4 mt-auto">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-3 flex-wrap gap-3">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{venture.founded || "2025"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{venture.team || "8 members"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  <span>{venture.growth || "+150%"}</span>
                </div>
              </div>

              <Button
                asChild
                size="sm"
                variant="outline"
                className="w-full text-sm font-semibold"
              >
                <Link href={`/ventures/${venture.slug}`}>
                  Learn More <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  </div>
</section>



        </div>
      </div>
      <Footer />
    </>
  )
}
