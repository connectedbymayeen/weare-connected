import { notFound } from "next/navigation"
import JobApplicationClient from "./JobApplicationClient"

async function getJob(slug) {
  try {
    console.log("=== FETCHING JOB FOR APPLICATION ===")
    console.log("Slug:", slug)

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    const url = `${baseUrl}/api/content/jobs/${slug}`

    console.log("Fetching from URL:", url)

    const res = await fetch(url, {
      cache: "no-store", // Always fetch fresh data
    })

    console.log("Response status:", res.status)

    if (!res.ok) {
      console.log("Response not OK:", res.status, res.statusText)
      return null
    }

    const job = await res.json()
    console.log("Job fetched successfully:", job.title)
    console.log("Job applicationFormFields count:", job.applicationFormFields?.length || 0)
    console.log("=== END FETCH ===")

    return job
  } catch (error) {
    console.error("Error fetching job for application:", error)
    return null
  }
}

export default async function JobApplicationPage({ params }) {
  const resolvedParams = await params
  const job = await getJob(resolvedParams.slug)

  if (!job) {
    notFound()
  }

  return <JobApplicationClient job={job} />
}
