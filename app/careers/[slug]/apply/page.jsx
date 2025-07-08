import { getJobBySlug } from "@/app/lib/data"
import { notFound } from "next/navigation"
import JobApplicationClient from "./JobApplicationClient"

export async function generateMetadata({ params }) {
  const resolvedParams = await params
  console.log("Apply page metadata: Received slug:", resolvedParams.slug)

  const job = await getJobBySlug(resolvedParams.slug)
  console.log("Apply page metadata: Found job:", job ? job.title : "Not found")

  if (!job) {
    return {
      title: "Job Not Found",
    }
  }
  return {
    title: `Apply for ${job.title}`,
    description: `Submit your application for ${job.title} position`,
  }
}

async function JobApplicationPage({ params }) {
  const resolvedParams = await params
  console.log("Apply page: Received slug:", resolvedParams.slug)

  const job = await getJobBySlug(resolvedParams.slug)
  console.log("Apply page: Found job:", job ? job.title : "Not found")

  if (!job) {
    console.log("Apply page: Job not found, calling notFound()")
    notFound()
  }

  // Serialize the job data to remove MongoDB-specific objects
  const serializedJob = {
    id: job.id || job._id?.toString(),
    title: job.title || "",
    slug: job.slug || "",
    description: job.description || "",
    shortDescription: job.shortDescription || "",
    department: job.department || "",
    location: job.location || "",
    type: job.type || "",
    salary: job.salary || "",
    experienceLevel: job.experienceLevel || "",
    technologies: job.technologies || [],
    responsibilities: job.responsibilities || [],
    requirements: job.requirements || [],
    benefits: job.benefits || [],
    status: job.status || "open",
    createdAt: job.createdAt ? new Date(job.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: job.updatedAt ? new Date(job.updatedAt).toISOString() : new Date().toISOString(),
    postedDate: job.postedDate ? new Date(job.postedDate).toISOString() : new Date().toISOString(),
  }

  console.log("Apply page: Rendering with job:", serializedJob.title)
  return <JobApplicationClient job={serializedJob} />
}

export default JobApplicationPage
