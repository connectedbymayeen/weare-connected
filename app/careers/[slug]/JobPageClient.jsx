"use client"

import RelatedJobs from "@/app/components/careers/related-jobs"
import Header from "@/app/components/header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  ExternalLink,
  Gift,
  MapPin,
  Users,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function JobPageClient({ job }) {
  const [isLoading, setIsLoading] = useState(false)

  const handleApplyClick = () => {
    setIsLoading(true)
    // The Link component will handle navigation
    // Reset loading state after a short delay
    setTimeout(() => setIsLoading(false), 1000)
  }

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch (error) {
      return "Recently posted"
    }
  }

  const formatSalary = (salary) => {
    if (!salary) return "Competitive salary"
    if (typeof salary === "string") return salary
    if (typeof salary === "object" && salary.min && salary.max) {
      return `BDT${salary.min.toLocaleString()} - BDT${salary.max.toLocaleString()}`
    }
    return "Competitive salary"
  }

  return (

    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/careers"
            className="inline-flex items-center text-purple-600 hover:text-purple-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Careers
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Header */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-3xl font-bold text-gray-900 mb-2">{job.title}</CardTitle>
                    <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        <span>{job.department}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{job.type}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Posted {formatDate(job.postedDate)}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {job.technologies &&
                        Array.isArray(job.technologies) &&
                        job.technologies.map((tech, index) => (
                          <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-800">
                            {tech}
                          </Badge>
                        ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 sm:min-w-[200px]">
                    <Button
                      asChild
                      size="lg"
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-150 active:scale-95"
                      onClick={handleApplyClick}
                      disabled={isLoading}
                    >
                      <Link href={`/careers/${job.slug}/apply`} className="flex items-center justify-center">
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Loading...
                          </>
                        ) : (
                          <>
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Apply Now
                          </>
                        )}
                      </Link>
                    </Button>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-green-600 font-semibold">
                        <p className="font-bold" >BDT</p>
                        <span>{formatSalary(job.salary)}</span>
                      </div>
                      <div className="flex items-center justify-center gap-1 text-gray-500 text-sm mt-1">
                        <Users className="w-3 h-3" />
                        <span>{job.experienceLevel}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Job Description */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900">About This Role</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{job.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Responsibilities */}
            {job.responsibilities && Array.isArray(job.responsibilities) && job.responsibilities.length > 0 && (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Key Responsibilities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {job.responsibilities.map((responsibility, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700 leading-relaxed">{responsibility}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Requirements */}
            {job.requirements && Array.isArray(job.requirements) && job.requirements.length > 0 && (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {job.requirements.map((requirement, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700 leading-relaxed">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Benefits */}
            {job.benefits && Array.isArray(job.benefits) && job.benefits.length > 0 && (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Gift className="w-5 h-5 text-green-600" />
                    Benefits & Perks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {job.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700 leading-relaxed">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Card */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-blue-50">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Ready to Apply?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm">
                  Join our team and help us build the future of technology. We're looking for passionate individuals who
                  want to make a difference.
                </p>
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-150 active:scale-95"
                  size="lg"
                  onClick={handleApplyClick}
                  disabled={isLoading}
                >
                  <Link href={`/careers/${job.slug}/apply`} className="flex items-center justify-center">
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Loading...
                      </>
                    ) : (
                      <>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Apply for this Position
                      </>
                    )}
                  </Link>
                </Button>
                <div className="text-center text-sm text-gray-500">Application takes about 5-10 minutes</div>
              </CardContent>
            </Card>

            {/* Job Details */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Job Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Department</span>
                    <span className="font-medium text-gray-900">{job.department}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location</span>
                    <span className="font-medium text-gray-900">{job.location}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type</span>
                    <span className="font-medium text-gray-900">{job.type}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-gray-600">Experience</span>
                    <span className="font-medium text-gray-900">{job.experienceLevel}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-gray-600">Salary</span>
                    <span className="font-medium text-green-600">{formatSalary(job.salary)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Jobs */}
        <div className="mt-12">
          <RelatedJobs currentJobId={job.id || job.slug} department={job.department} location={job.location} />
        </div>
      </div>
    </div>
  )
}
