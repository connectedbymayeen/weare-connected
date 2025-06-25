"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MapPin, Clock, DollarSign, Users, Calendar, CheckCircle, ArrowLeft, Share2, Bookmark } from "lucide-react"
import Link from "next/link"

export default function JobContent({ job }) {
  // Format posted date
  const formatPostedDate = (date) => {
    if (!date) return "Recently"

    const postedDate = new Date(date)
    const now = new Date()
    const diffTime = Math.abs(now - postedDate)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "1 day ago"
    return `${diffDays} days ago`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link href="/careers" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Careers
            </Link>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Bookmark className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Header */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border">
              <div className="flex flex-wrap items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-gray-600">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {job.location}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {job.type}
                    </div>
                    {job.salary && (
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {job.salary}
                      </div>
                    )}
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Posted {formatPostedDate(job.createdAt || job.postedDate)}
                    </div>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {job.department}
                </Badge>
              </div>

              {/* Technologies/Skills */}
              {job.technologies && job.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {job.technologies.map((tech, index) => (
                    <Badge key={index} variant="outline">
                      {tech}
                    </Badge>
                  ))}
                </div>
              )}

              <Button
                asChild
                size="lg"
                className="bg-purple-700 hover:bg-purple-800 active:bg-purple-900 transform active:scale-95 transition-all duration-150 w-full sm:w-auto text-white font-semibold shadow-lg hover:shadow-xl"
              >
                <Link href={`/careers/${job.slug}/apply`} className="flex items-center justify-center">
                  Apply for this Position
                </Link>
              </Button>
            </div>

            {/* Job Description */}
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Description</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{job.description}</p>
              </CardContent>
            </Card>

            {/* Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Responsibilities</h2>
                  <ul className="space-y-3">
                    {job.responsibilities.map((responsibility, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{responsibility}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Requirements</h2>
                  <ul className="space-y-3">
                    {job.requirements.map((requirement, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Benefits */}
            {job.benefits && job.benefits.length > 0 && (
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Benefits & Perks</h2>
                  <ul className="space-y-3">
                    {job.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-purple-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Apply */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Apply</h3>
                <div className="space-y-4">
                  <Button
                    asChild
                    className="bg-purple-700 hover:bg-purple-800 active:bg-purple-900 transform active:scale-95 transition-all duration-150 w-full text-white font-semibold shadow-lg hover:shadow-xl"
                    size="lg"
                  >
                    <Link href={`/careers/${job.slug}/apply`} className="flex items-center justify-center">
                      Apply Now
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full">
                    Save for Later
                  </Button>
                </div>
                <Separator className="my-4" />
                <div className="text-sm text-gray-600">
                  <p className="mb-2">Application deadline:</p>
                  <p className="font-medium">Open until filled</p>
                </div>
              </CardContent>
            </Card>

            {/* Job Details */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Details</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Department</span>
                    <span className="font-medium">{job.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Experience</span>
                    <span className="font-medium">{job.experienceLevel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Employment Type</span>
                    <span className="font-medium">{job.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location</span>
                    <span className="font-medium">{job.location}</span>
                  </div>
                  {job.salary && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Salary Range</span>
                      <span className="font-medium">{job.salary}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Company Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">About Connected</h3>
                <p className="text-gray-600 text-sm mb-4">
                  We're a forward-thinking company that connects businesses with innovative solutions. Join our team and
                  be part of something extraordinary.
                </p>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  50-200 employees
                </div>
              </CardContent>
            </Card>

            {/* Similar Jobs */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Similar Jobs</h3>
                <div className="space-y-3">
                  <Link href="/careers/1" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <h4 className="font-medium text-gray-900">Senior Developer</h4>
                    <p className="text-sm text-gray-600">Engineering • Remote</p>
                  </Link>
                  <Link href="/careers/3" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <h4 className="font-medium text-gray-900">Product Manager</h4>
                    <p className="text-sm text-gray-600">Product • New York</p>
                  </Link>
                  <Link href="/careers/4" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <h4 className="font-medium text-gray-900">UX Designer</h4>
                    <p className="text-sm text-gray-600">Design • San Francisco</p>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
