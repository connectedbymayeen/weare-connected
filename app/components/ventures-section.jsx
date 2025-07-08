"use client"

import { Button } from "@/components/ui/button"
import { motion, useInView } from "framer-motion"
import { ArrowRight, Calendar, TrendingUp, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRef } from "react"

export default function VenturesSection({ ventures = [] }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  // Enhanced fallback data with the new structure
  const venturesList =
    ventures.length > 0
      ? ventures.map((venture) => ({
        ...venture,
        status: venture.status || "Active",
        statusColor:
          venture.status === "Active"
            ? "bg-green-500"
            : venture.status === "Scaling"
              ? "bg-blue-500"
              : "bg-purple-500",
        category: venture.category || venture.industry || "Tech",
        year: venture.foundedYear || venture.year || "",
        teamMembers: venture.teamSize ? `${venture.teamSize} members` : "8 members",
        growth: venture.growth || "+150%",
        tags: venture.technologies || venture.tags || ["Technology", "Innovation"],
      }))
      : [

      ]

  return (
    <section ref={ref} className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-purple-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
        >
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-accent px-3 py-1 text-sm font-medium text-primary">
              Our Ventures
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Building the Future</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
              Discover the innovative ventures we're building across various industries, each designed to solve
              real-world problems and create lasting impact.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {venturesList.map((venture, index) => (
            <motion.div
              key={venture.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <Link href={`/ventures/${venture.slug}`} className="group block">
                <div className="bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl h-[500px] flex flex-col border border-gray-100">
                  {/* Status Badge */}
                  <div className="p-4 pb-0">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${venture.statusColor}`}
                    >
                      {venture.status}
                    </span>
                  </div>

                  {/* Image Section */}
                  <div className="relative h-48 w-full overflow-hidden mx-4 mt-3 rounded-lg">
                    <Image
                      src={
                        venture.image ||
                        venture.featuredImage?.url ||
                        "/placeholder.svg?height=600&width=1200&text=Venture" ||
                        "/placeholder.svg"
                      }
                      alt={venture.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {venture.logo && (
                      <div className="absolute bottom-3 left-3 h-10 w-10 rounded-full bg-white shadow-md overflow-hidden">
                        <Image
                          src={venture.logo || "/placeholder.svg"}
                          alt={`${venture.name} logo`}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>

                  {/* Content Section */}
                  <div className="p-4 flex-grow flex flex-col">
                    <div className="mb-3">
                      <span className="text-sm text-gray-500 font-medium">{venture.category}</span>
                    </div>

                    <h3 className="text-xl font-bold mb-2 text-gray-900">{venture.name}</h3>
                    <p className="text-gray-600 mb-4 flex-grow text-sm leading-relaxed line-clamp-3 overflow-hidden">
                      {venture.description || venture.tagline}
                    </p>

                    {/* Metrics Section */}
                    <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{venture.year}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users size={14} />
                        <span>{venture.teamMembers}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp size={14} />
                        <span className="font-medium text-green-600">{venture.growth}</span>
                      </div>
                    </div>

                    {/* Tags Section */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {venture.tags?.slice(0, 3).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Learn More Button */}
                    <Button asChild variant="outline" className="w-full" size="sm">
                      <Link href={`/ventures/${venture.slug}`}>
                        Learn More <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mx-auto max-w-md"
        >
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 sm:p-6 shadow-lg">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/ventures">
                View All Ventures <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
