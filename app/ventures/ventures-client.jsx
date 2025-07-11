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
            <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {ventures.length === 0 ? (
                  <div className="col-span-full text-center text-xl text-gray-500 font-medium py-16">
                    No ventures available at this moment.
                  </div>
                ) : (
                  ventures.map((venture) => (
                    <Card
                      key={venture.slug}
                      className="overflow-hidden hover:shadow-2xl transition-shadow duration-300 bg-white w-full"
                    >
                      <div className="relative h-[280px] sm:h-[300px]">
                        <Image
                          src={venture.image}
                          alt={venture.name}
                          fill
                          className="object-cover w-full h-full"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge
                              variant={venture.status === "Active" ? "default" : "secondary"}
                              className="bg-[#6529b2] text-white font-semibold text-sm px-3 py-1"
                            >
                              {venture.status}
                            </Badge>
                            <Badge variant="outline" className="bg-white/20 text-white border-white/30 text-sm px-3 py-1">
                              {venture.category}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <CardHeader className="pb-0 px-5 pt-5">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-2xl sm:text-3xl font-syne mb-2">{venture.name}</CardTitle>
                            <p className="text-primary font-medium mb-2 text-lg">{venture.tagline}</p>
                          </div>
                          <Button variant="ghost" size="sm" asChild>
                            <a href={venture.website} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-5 w-5" />
                            </a>
                          </Button>
                        </div>
                        <CardDescription className="text-base leading-relaxed text-muted-foreground">
                          {venture.description}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="pt-0 px-5 pb-5">
                        <div className="flex items-center justify-between gap-4 text-sm text-muted-foreground mb-6 mt-4 flex-wrap">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{venture.founded}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{venture.team}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-4 w-4" />
                            <span>{venture.growth}</span>
                          </div>
                        </div>

                        <Button asChild className="w-full h-10 dark:bg-white bg-[#6529b2] text-white text-base font-semibold">
                          <Link href={`/ventures/${venture.slug}`}>
                            Learn More <ArrowRight className="ml-2 h-4 w-4" />
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
