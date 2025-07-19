"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, DollarSign, Calendar, ExternalLink } from "lucide-react"

export default function JobCard({ job }) {
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    } catch (error) {
      return "Recently"
    }
  }

  const formatSalary = (salary) => {
    if (!salary) return "Competitive"
    if (typeof salary === "string") return salary
    if (typeof salary === "object" && salary.min && salary.max) {
      return `$${salary.min.toLocaleString()} - $${salary.max.toLocaleString()}`
    }
    return "Competitive"
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-white">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <CardTitle className="text-xl font-semibold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2">
              <Link href={`/careers/${job.slug}`} className="hover:underline">
                {job.title}
              </Link>
            </CardTitle>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{job.type}</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="w-3 h-3" />
                <span>{formatSalary(job.salary)}</span>
              </div>
            </div>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800 whitespace-nowrap">
            {job.status === "open" ? "Open" : job.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-gray-600 text-sm line-clamp-3 mb-4">{job.shortDescription || job.description}</p>

        {job.technologies && job.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {job.technologies.slice(0, 4).map((tech, index) => (
              <Badge key={index} variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                {tech}
              </Badge>
            ))}
            {job.technologies.length > 4 && (
              <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600">
                +{job.technologies.length - 4} more
              </Badge>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Calendar className="w-3 h-3" />
            <span>Posted {formatDate(job.postedDate || job.createdAt)}</span>
          </div>

          <Button
            asChild
            size="sm"
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-sm hover:shadow-md transition-all duration-200"
          >
            <Link href={`/careers/${job.slug}`} className="flex items-center gap-1">
              <span>View</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
