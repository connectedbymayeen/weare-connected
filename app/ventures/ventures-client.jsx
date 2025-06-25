"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { ArrowRight, Calendar, ExternalLink, TrendingUp, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import Footer from "../components/footer"
import Header from "../components/header"

// Fallback data in case database is empty
const fallbackVentures = [
  {
    slug: "techflow",
    name: "TechFlow",
    tagline: "Workflow automation reimagined",
    description:
      "A comprehensive SaaS platform that revolutionizes how teams manage workflows and automate repetitive tasks.",
    category: "SaaS",
    status: "Active",
    founded: "2022",
    team: "12 people",
    growth: "+150% YoY",
    image: "/placeholder.svg?height=400&width=600&text=TechFlow",
    website: "https://techflow.com",
  },
  {
    slug: "designhub",
    name: "DesignHub",
    tagline: "Creative solutions for modern brands",
    description:
      "A full-service design agency specializing in brand identity, digital experiences, and creative campaigns.",
    category: "Agency",
    status: "Active",
    founded: "2021",
    team: "8 people",
    growth: "+85% YoY",
    image: "/placeholder.svg?height=400&width=600&text=DesignHub",
    website: "https://designhub.com",
  },
  {
    slug: "marketpulse",
    name: "MarketPulse",
    tagline: "Data-driven marketing intelligence",
    description:
      "Advanced analytics platform providing real-time market insights and competitive intelligence for businesses.",
    category: "Analytics",
    status: "Active",
    founded: "2023",
    team: "6 people",
    growth: "+200% YoY",
    image: "/placeholder.svg?height=400&width=600&text=MarketPulse",
    website: "https://marketpulse.com",
  },
  {
    slug: "ecolife",
    name: "EcoLife",
    tagline: "Sustainable living made simple",
    description:
      "A lifestyle platform connecting eco-conscious consumers with sustainable products and green living solutions.",
    category: "Lifestyle",
    status: "Beta",
    founded: "2024",
    team: "4 people",
    growth: "New",
    image: "/placeholder.svg?height=400&width=600&text=EcoLife",
    website: "https://ecolife.com",
  },
]

export default function VenturesClientPage({ ventures: dbVentures = [] }) {
  // Map database data to component format or use fallback
  const ventures =
    dbVentures.length > 0
      ? dbVentures.map((venture) => ({
        slug: venture.slug || venture.id,
        name: venture.name,
        tagline: venture.tagline || venture.shortDescription,
        description: venture.description,
        category: venture.category || venture.industry || "Tech",
        status: venture.status || "Active",
        founded: venture.foundedYear || venture.year || "2024",
        team: venture.teamSize ? `${venture.teamSize} people` : "Team",
        growth: venture.growth || "Growing",
        image: venture.featuredImage?.url || venture.image || "/placeholder.svg?height=400&width=600&text=Venture",
        website: venture.website || "#",
      }))
      : fallbackVentures

  return (
    <>
      <Header />
      <div className="relative min-h-[100vh] sm:min-h-[100vh] md:min-h-[100vh] flex items-center justify-center overflow-hidden -mt-[100px] sm:-mt-[120px] md:-mt-[140px] pt-[120px] sm:pt-[160px] md:pt-[200px]">
        {/* Hero section background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-[#E9E6FF]/40 to-[#AA99FF]/30 -top-[120px] -mt-[120px] pt-[120px]">
          {/* Floating particles */}
          {[...Array(40)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 10,
              }}
            />
          ))}
          <div className="absolute inset-0 bg-primary/8" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(101,41,178,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(101,41,178,0.05)_1px,transparent_1px)] bg-[size:100px_100px]" />
        </div>

        <div className="pt-2 pb-8 relative z-10">
          <div className="container mx-auto px-4 sm:px-6 md:px-8 py-8 max-w-[1600px]">
            <div className="text-center mb-12 full max-w-6xl mx-auto">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-pot-black mb-6 font-syne">Our Ventures</h1>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Connected is home to a growing portfolio of ventures across tech, media, lifestyle, and digital
                services. Each brand is built with purpose, backed by strategy, and designed to shape the future. This
                is where ideas turn into impact.
              </p>
            </div>
          </div>

          <section className="py-8 sm:py-10">
            <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-[1800px]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 sm:gap-16">
                {ventures.map((venture, index) => (
                  <Card
                    key={venture.slug}
                    className="overflow-hidden hover:shadow-2xl transition-shadow duration-300 bg-white w-full"
                  >
                    <div className="relative h-[380px] sm:h-[400px]">
                      <Image
                        src={venture.image || "/placeholder.svg"}
                        alt={venture.name}
                        fill
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-6 left-6 right-6">
                        <div className="flex items-center gap-3 mb-3">
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

                    <CardHeader className="pb-0 px-6 pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-3xl sm:text-4xl font-syne mb-3">{venture.name}</CardTitle>
                          <p className="text-primary font-medium mb-3 text-xl">{venture.tagline}</p>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <a href={venture.website} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-5 w-5" />
                          </a>
                        </Button>
                      </div>
                      <CardDescription className="text-lg leading-relaxed text-muted-foreground">
                        {venture.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-0 px-6 pb-6">
                      <div className="flex items-center justify-center gap-6 text-base text-muted-foreground mb-8 mt-6">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-5 w-5" />
                          <span>Founded {venture.founded}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-5 w-5" />
                          <span>{venture.team}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5" />
                          <span>{venture.growth}</span>
                        </div>
                      </div>

                      <Button asChild className="w-full h-12 bg-[#6529b2] text-white text-lg font-semibold">
                        <Link href={`/ventures/${venture.slug}`}>
                          Learn More <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

        </div>

      </div>


      {/* Stats Section */}
      <section className="py-16 sm:py-20 bg-lynx-white">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl">
          <div className="text-center mb-12 mx-auto max-w-4xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-pot-black mb-4 font-syne">Portfolio Impact</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Our ventures are making a real difference across industries.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {[
              { number: "$10M+", label: "Revenue Generated" },
              { number: "100+", label: "Jobs Created" },
              { number: "4M+", label: "Audience Reached" },
              { number: "16", label: "Countries Touched" },
              { number: "5/12", label: "Ventures Built/Pipeline" },
              { number: "$100M+", label: "Projected Market Cap" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-sm sm:text-base text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-white text-gray-900 relative overflow-hidden">
        {/* Creative background elements */}
        <div className="absolute inset-0 bg-white">
          {/* Animated floating shapes */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-32 right-16 w-16 h-16 bg-secondary/15 rotate-45 animate-bounce"></div>
          <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-accent/20 rounded-full animate-ping"></div>

          {/* Curved lines */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 400" fill="none">
            <path
              d="M0,200 Q250,100 500,200 T1000,200"
              stroke="url(#gradient1)"
              strokeWidth="2"
              fill="none"
              opacity="0.3"
            />
            <path
              d="M0,250 Q300,150 600,250 T1000,250"
              stroke="url(#gradient2)"
              strokeWidth="2"
              fill="none"
              opacity="0.2"
            />
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.5" />
              </linearGradient>
              <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0.4" />
              </linearGradient>
            </defs>
          </svg>

          {/* Dotted pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,rgba(101,41,178,0.15)_1px,transparent_0)] bg-[size:40px_40px]"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl relative z-10">
          <motion.div
            className="text-center max-w-4xl mx-auto relative"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {/* Fire effect container */}
            <div className="relative bg-gradient-to-br from-white via-primary/5 to-secondary/10 rounded-[2rem] p-8 sm:p-12 border-4 border-dashed border-primary/30 shadow-2xl transform rotate-1 hover:rotate-0 transition-all duration-500 overflow-hidden">
              {/* Fire flames - organic shapes */}
              <div className="absolute -inset-2 rounded-[2rem] overflow-hidden pointer-events-none">
                {/* Top fire flames */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={`flame-top-${i}`}
                    className="absolute bg-gradient-to-t from-primary via-secondary to-accent opacity-70"
                    style={{
                      left: `${15 + i * 12}%`,
                      top: "-20px",
                      width: "12px",
                      height: "30px",
                      clipPath:
                        "polygon(40% 100%, 20% 80%, 30% 60%, 10% 40%, 25% 20%, 45% 30%, 60% 10%, 80% 25%, 70% 45%, 90% 65%, 75% 85%, 55% 75%)",
                    }}
                    animate={{
                      scaleY: [1, 1.8, 1.2, 1.5, 1],
                      scaleX: [1, 0.8, 1.1, 0.9, 1],
                      opacity: [0.5, 0.9, 0.7, 0.8, 0.5],
                      y: [0, -5, 2, -3, 0],
                    }}
                    transition={{
                      duration: 2 + Math.random(),
                      repeat: Number.POSITIVE_INFINITY,
                      delay: i * 0.3,
                      ease: "easeInOut",
                    }}
                  />
                ))}

                {/* Bottom fire flames */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={`flame-bottom-${i}`}
                    className="absolute bg-gradient-to-b from-primary via-secondary to-accent opacity-70"
                    style={{
                      left: `${20 + i * 12}%`,
                      bottom: "-20px",
                      width: "12px",
                      height: "30px",
                      clipPath:
                        "polygon(40% 0%, 20% 20%, 30% 40%, 10% 60%, 25% 80%, 45% 70%, 60% 90%, 80% 75%, 70% 55%, 90% 35%, 75% 15%, 55% 25%)",
                    }}
                    animate={{
                      scaleY: [1, 1.8, 1.2, 1.5, 1],
                      scaleX: [1, 0.8, 1.1, 0.9, 1],
                      opacity: [0.5, 0.9, 0.7, 0.8, 0.5],
                      y: [0, 5, -2, 3, 0],
                    }}
                    transition={{
                      duration: 2 + Math.random(),
                      repeat: Number.POSITIVE_INFINITY,
                      delay: i * 0.3 + 0.5,
                      ease: "easeInOut",
                    }}
                  />
                ))}

                {/* Left fire flames */}
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={`flame-left-${i}`}
                    className="absolute bg-gradient-to-r from-primary via-secondary to-accent opacity-70"
                    style={{
                      left: "-20px",
                      top: `${25 + i * 15}%`,
                      width: "30px",
                      height: "12px",
                      clipPath:
                        "polygon(100% 40%, 80% 20%, 60% 30%, 40% 10%, 20% 25%, 30% 45%, 10% 60%, 25% 80%, 45% 70%, 65% 90%, 85% 75%, 75% 55%)",
                    }}
                    animate={{
                      scaleX: [1, 1.8, 1.2, 1.5, 1],
                      scaleY: [1, 0.8, 1.1, 0.9, 1],
                      opacity: [0.5, 0.9, 0.7, 0.8, 0.5],
                      x: [0, -5, 2, -3, 0],
                    }}
                    transition={{
                      duration: 2 + Math.random(),
                      repeat: Number.POSITIVE_INFINITY,
                      delay: i * 0.4,
                      ease: "easeInOut",
                    }}
                  />
                ))}

                {/* Right fire flames */}
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={`flame-right-${i}`}
                    className="absolute bg-gradient-to-l from-primary via-secondary to-accent opacity-70"
                    style={{
                      right: "-20px",
                      top: `${30 + i * 15}%`,
                      width: "30px",
                      height: "12px",
                      clipPath:
                        "polygon(0% 40%, 20% 20%, 40% 30%, 60% 10%, 80% 25%, 70% 45%, 90% 60%, 75% 80%, 55% 70%, 35% 90%, 15% 75%, 25% 55%)",
                    }}
                    animate={{
                      scaleX: [1, 1.8, 1.2, 1.5, 1],
                      scaleY: [1, 0.8, 1.1, 0.9, 1],
                      opacity: [0.5, 0.9, 0.7, 0.8, 0.5],
                      x: [0, 5, -2, 3, 0],
                    }}
                    transition={{
                      duration: 2 + Math.random(),
                      repeat: Number.POSITIVE_INFINITY,
                      delay: i * 0.4 + 0.7,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>

              {/* Funky corner decorations - minimal */}
              <motion.div
                className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-br from-primary to-secondary rounded-sm"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              />
              <motion.div
                className="absolute -bottom-2 -right-2 w-6 h-6 bg-gradient-to-br from-secondary to-accent rounded-sm"
                animate={{ rotate: -360 }}
                transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              />

              {/* Funky inner pattern with animation */}
              <motion.div
                className="absolute inset-4 border-2 border-dotted border-secondary/20 rounded-2xl"
                animate={{ rotate: [0, 1, -1, 0] }}
                transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY }}
              />

              {/* Ember particles - minimal */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"
                  style={{
                    left: `${Math.random() * 80 + 10}%`,
                    top: `${Math.random() * 80 + 10}%`,
                  }}
                  animate={{
                    scale: [0, 1.5, 0],
                    opacity: [0, 1, 0],
                    y: [0, -20, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.8,
                  }}
                />
              ))}

              <h2 className="text-2xl sm:text-3xl font-bold mb-4 font-syne text-gray-900 relative z-10">
                Have an Idea?
              </h2>
              <p className="text-lg sm:text-xl mb-8 text-gray-700 max-w-2xl mx-auto relative z-10">
                We're always looking for the next big opportunity. Let's discuss how we can bring your vision to life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg"
                    asChild
                  >
                    <Link href="/contact">Pitch Your Idea</Link>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-primary text-primary hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-white hover:border-transparent shadow-lg"
                    asChild
                  >
                    <Link href="/about">Learn About Us</Link>
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  )
}
