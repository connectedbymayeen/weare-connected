"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Briefcase, MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"

export default function RelatedJobs({ currentJobId, department, location }) {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRelatedJobs = async () => {
      try {
        // Try to fetch from API first
        const response = await fetch("/api/content/jobs")
        if (response.ok) {
          const allJobs = await response.json()
          const related = allJobs
            .filter(
              (job) =>
                job.id !== currentJobId &&
                job.slug !== currentJobId && // Also filter by slug in case currentJobId is a slug
                (job.department === department || job.location === location),
            )
            .slice(0, 3)
          setJobs(related)
        } else {
          // Fallback to sample jobs if API fails
          setJobs(getSampleRelatedJobs(currentJobId, department, location))
        }
      } catch (error) {
        console.warn("Failed to fetch related jobs, using sample data:", error)
        // Use sample data as fallback
        setJobs(getSampleRelatedJobs(currentJobId, department, location))
      } finally {
        setLoading(false)
      }
    }

    fetchRelatedJobs()
  }, [currentJobId, department, location])

  // Sample related jobs for fallback
  const getSampleRelatedJobs = (currentJobId, department, location) => {
    const sampleJobs = [
      {
        id: "frontend-developer",
        slug: "frontend-developer",
        title: "Frontend Developer",
        department: "Engineering",
        location: "Remote",
        type: "Full-time",
        experienceLevel: "Mid-level",
      },
      {
        id: "backend-developer",
        slug: "backend-developer",
        title: "Backend Developer",
        department: "Engineering",
        location: "San Francisco, CA",
        type: "Full-time",
        experienceLevel: "Senior",
      },
      {
        id: "product-designer",
        slug: "product-designer",
        title: "Product Designer",
        department: "Design",
        location: "Remote",
        type: "Full-time",
        experienceLevel: "Mid-level",
      },
      {
        id: "data-scientist",
        slug: "data-scientist",
        title: "Data Scientist",
        department: "Data",
        location: "New York, NY",
        type: "Full-time",
        experienceLevel: "Senior",
      },
      {
        id: "marketing-manager",
        slug: "marketing-manager",
        title: "Marketing Manager",
        department: "Marketing",
        location: "Remote",
        type: "Full-time",
        experienceLevel: "Mid-level",
      },
    ]

    return sampleJobs
      .filter(
        (job) =>
          job.id !== currentJobId &&
          job.slug !== currentJobId &&
          (job.department === department || job.location === location),
      )
      .slice(0, 3)
  }

  // Don't render if no jobs or still loading
  if (loading) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900">Related Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!jobs || jobs.length === 0) {
    return null // Don't render anything if no related jobs
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-purple-600" />
          Related Jobs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id || job.slug}
              className="border-b pb-4 last:border-0 hover:bg-gray-50 -mx-4 px-4 py-2 rounded-lg transition-colors"
            >
              <Link href={`/careers/${job.slug}`} className="block">
                <h4 className="font-semibold text-gray-900 hover:text-purple-600 transition-colors mb-1">
                  {job.title}
                </h4>
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-2">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{job.location}</span>
                  </div>
                  <span>•</span>
                  <span>{job.type}</span>
                  <span>•</span>
                  <Badge variant="outline" className="text-xs">
                    {job.department}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{job.experienceLevel}</span>
                  <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-800 p-0 h-auto">
                    View Position <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {jobs.length > 0 && (
          <div className="mt-6 pt-4 border-t">
            <Button asChild variant="outline" className="w-full">
              <Link href="/careers">
                View All Open Positions
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
