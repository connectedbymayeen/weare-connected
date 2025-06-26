"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"
import { Clock, DollarSign, MapPin, Search } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import Footer from "../components/footer"
import Header from "../components/header"

const benefits = [
  "Competitive salary and equity",
  "Health, dental, and vision insurance",
  "Flexible work arrangements",
  "Professional development budget",
  "Unlimited PTO",
  "Modern office spaces",
]

export default function CareersClientPage({ jobs = [] }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [locationFilter, setLocationFilter] = useState("all")

  const departments = ["all", ...new Set(jobs.map((job) => job.department).filter(Boolean))]
  const locations = ["all", ...new Set(jobs.map((job) => job.location).filter(Boolean))]

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = departmentFilter === "all" || job.department === departmentFilter
    const matchesLocation = locationFilter === "all" || job.location.includes(locationFilter)
    return matchesSearch && matchesDepartment && matchesLocation
  })

  const formatPostedDate = (dateString) => {
    if (!dateString) return "Recently"
    const postedDate = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - postedDate)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "1 day ago"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} week${Math.ceil(diffDays / 7) > 1 ? "s" : ""} ago`
    return `${Math.ceil(diffDays / 30)} month${Math.ceil(diffDays / 30) > 1 ? "s" : ""} ago`
  }

  return (
    <>
      <Header />
      <div className="relative min-h-[100vh] flex items-center justify-center -mt-[140px] pt-[200px]">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-[#E9E6FF]/40 to-[#AA99FF]/30 -top-[120px] pt-[120px]">
          {[...Array(35)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{ y: [0, -100, 0], opacity: [0, 1, 0] }}
              transition={{ duration: Math.random() * 10 + 10, repeat: Infinity, delay: Math.random() * 10 }}
            />
          ))}
          <div className="absolute inset-0 bg-primary/8" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(101,41,178,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(101,41,178,0.05)_1px,transparent_1px)] bg-[size:100px_100px]" />
        </div>

        <div className="pt-2 pb-8 relative z-10 w-full">
          <div className="mx-auto px-4 sm:px-6 md:px-8 max-w-[70rem] w-full">
            <div className="text-center mb-12 mx-auto w-full">
              <h1 className="text-4xl md:text-5xl font-bold text-pot-black mb-6 font-syne">Join Our Team</h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-4xl mx-auto">
                Help us build the future by joining our team of innovators, creators, and problem-solvers.
              </p>
            </div>

            <section className="py-8 w-full">
              <div className="mb-8 w-full">
                <div className="flex flex-col lg:flex-row gap-6 w-full">
                  {/* Search Input */}
                  <div className="relative bg-white rounded-lg flex-1 border border-gray-200">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search jobs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 py-[23px] bg-[#f0eeff] w-full"
                    />
                  </div>

                  {/* Department Dropdown */}
                  <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                    <SelectTrigger
                      className="w-full lg:w-60 py-[23px] bg-[#f0eeff]"
                    >
                      <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent
                      className="bg-primary/15 border border-primary/20 backdrop-blur-xl shadow-xl rounded-xl text-pot-black"
                    >
                      <SelectItem value="all">All Departments</SelectItem>
                      {departments
                        .filter((dept) => dept !== "all")
                        .map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>

                  {/* Location Dropdown */}
                  <Select value={locationFilter} onValueChange={setLocationFilter}>
                    <SelectTrigger
                      className="w-full lg:w-60 py-[23px] bg-[#f0eeff]"
                    >
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent
                      className="bg-primary/15 border border-primary/20 backdrop-blur-xl shadow-xl rounded-xl text-pot-black"
                    >
                      <SelectItem value="all">All Locations</SelectItem>
                      {locations
                        .filter((loc) => loc !== "all")
                        .map((loc) => (
                          <SelectItem key={loc} value={loc}>
                            {loc}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>

                </div>
              </div>
            </section>

            {/* Jobs Section */}
            <div className="w-full">
              <div className="mb-8 text-left w-full">
                <h2 className="text-3xl font-bold text-pot-black mb-2 font-syne">Open Positions</h2>
                <p className="text-muted-foreground">
                  {filteredJobs.length} position{filteredJobs.length !== 1 ? "s" : ""} available
                </p>
              </div>

              <div className="space-y-6 w-full">
                {filteredJobs.map((job) => (
                  <Card key={job.id} className="hover:shadow-md transition-shadow bg-white w-full">
                    <CardHeader>
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-2xl mb-2">{job.title}</CardTitle>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <Badge variant="secondary" className="bg-[#a9f] text-black">{job.department}</Badge>
                            <Badge variant="outline">{job.type}</Badge>
                          </div>
                          <CardDescription className="text-base leading-relaxed">{job.description}</CardDescription>
                        </div>
                        <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:text-right">
                          <Button asChild>
                            <Link href={`/careers/${job.slug}`}>Apply Now</Link>
                          </Button>
                          <p className="text-sm text-muted-foreground">{formatPostedDate(job.posted)}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span>{job.salary}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{job.type}</span>
                        </div>
                      </div>
                      {job.requirements?.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm text-center font-semibold text-gray-500 mb-2">Key Requirements:</p>
                          <div className="flex items-center justify-center flex-wrap gap-2 text-black">
                            {job.requirements.map((req, index) => (
                              <Badge key={index} variant="outline" className="text-xs">{req}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredJobs.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">No positions match your search criteria.</p>
                  <Button variant="outline" onClick={() => {
                    setSearchTerm("")
                    setDepartmentFilter("all")
                    setLocationFilter("all")
                  }}>
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
