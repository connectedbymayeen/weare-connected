"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Eye, Plus, Search, Trash2 } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function JobsPage() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedJob, setSelectedJob] = useState(null)

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/jobs")
      if (response.ok) {
        const data = await response.json()
        setJobs(data)
      } else {
        console.error("Failed to fetch jobs")
      }
    } catch (error) {
      console.error("Error fetching jobs:", error)
    } finally {
      setLoading(false)
    }
  }

  const deleteJob = async (id) => {
    if (!confirm("Are you sure you want to delete this job?")) return

    try {
      const response = await fetch(`/api/admin/jobs/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setJobs(jobs.filter((job) => job._id !== id))
      } else {
        alert("Failed to delete job")
      }
    } catch (error) {
      console.error("Error deleting job:", error)
      alert("Error deleting job")
    }
  }

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || job.status === statusFilter

    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
            <p className="mt-4">Loading jobs...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Job Management</h1>
            <p className="text-gray-400">Manage job postings and applications</p>
          </div>
          <Button asChild className="bg-purple-600 hover:bg-purple-700">
            <Link href="/admin/jobs/new">
              <Plus className="h-4 w-4 mr-2" />
              Add New Job
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <Card className="bg-gray-800 border-gray-700 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48 bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Jobs Table */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300">Job</TableHead>
                  <TableHead className="text-gray-300">Department</TableHead>
                  <TableHead className="text-gray-300">Location</TableHead>
                  <TableHead className="text-gray-300">Type</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobs.map((job) => (
                  <TableRow key={job._id} className="border-gray-700">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        {job.thumbnailImage && (
                          <img
                            src={job.thumbnailImage || "/placeholder.svg"}
                            alt={job.title}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                        )}
                        <div>
                          <p className="font-medium text-white">{job.title}</p>
                          <p className="text-sm text-gray-400">{job.salary}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                        {job.department}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-300">{job.location}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-gray-600 text-gray-300">
                        {job.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={job.status === "published" ? "default" : "secondary"}
                        className={
                          job.status === "published" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {job.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedJob(job)}
                              className="text-gray-400 hover:text-white"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl">
                            <DialogHeader>
                              <DialogTitle className="text-white">{selectedJob?.title}</DialogTitle>
                            </DialogHeader>
                            {selectedJob && (
                              <div className="space-y-4">
                                {selectedJob.thumbnailImage && (
                                  <img
                                    src={selectedJob.thumbnailImage || "/placeholder.svg"}
                                    alt={selectedJob.title}
                                    className="w-full h-48 object-cover rounded-lg"
                                  />
                                )}
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm text-gray-400">Department</p>
                                    <p className="text-white">{selectedJob.department}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-400">Location</p>
                                    <p className="text-white">{selectedJob.location}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-400">Type</p>
                                    <p className="text-white">{selectedJob.type}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-400">Salary</p>
                                    <p className="text-white">{selectedJob.salary}</p>
                                  </div>
                                </div>
                                {selectedJob.shortDescription && (
                                  <div>
                                    <p className="text-sm text-gray-400 mb-2">Short Description</p>
                                    <p className="text-gray-300">{selectedJob.shortDescription}</p>
                                  </div>
                                )}
                                {selectedJob.description && (
                                  <div>
                                    <p className="text-sm text-gray-400 mb-2">Description</p>
                                    <div
                                      className="text-gray-300 prose prose-invert max-w-none"
                                      dangerouslySetInnerHTML={{ __html: selectedJob.description }}
                                    />
                                  </div>
                                )}
                                {selectedJob.technologies && selectedJob.technologies.length > 0 && (
                                  <div>
                                    <p className="text-sm text-gray-400 mb-2">Technologies</p>
                                    <div className="flex flex-wrap gap-2">
                                      {selectedJob.technologies.map((tech, index) => (
                                        <Badge key={index} variant="outline" className="border-gray-600 text-gray-300">
                                          {tech}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        <Button variant="ghost" size="sm" asChild className="text-gray-400 hover:text-white">
                          <Link href={`/admin/jobs/${job._id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteJob(job._id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredJobs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400 mb-4">No jobs found matching your criteria.</p>
                <Button asChild variant="outline" className="border-gray-600 text-gray-300 bg-transparent">
                  <Link href="/admin/jobs/new">Create Your First Job</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Total Jobs</CardTitle>
              <CardDescription className="text-gray-400">All job postings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-400">{jobs.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Published</CardTitle>
              <CardDescription className="text-gray-400">Active job postings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400">
                {jobs.filter((job) => job.status === "published").length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Drafts</CardTitle>
              <CardDescription className="text-gray-400">Unpublished jobs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-400">
                {jobs.filter((job) => job.status === "draft").length}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
