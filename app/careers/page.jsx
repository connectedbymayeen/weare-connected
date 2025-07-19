import CareersClientPage from "./careers-client"

// Serialize jobs data for client component
function serializeJobs(jobs) {
  console.log("serializeJobs called with:", jobs)

  if (!Array.isArray(jobs)) {
    console.log("Jobs is not an array:", typeof jobs, jobs)
    return []
  }

  const serialized = jobs.map((job) => ({
    id: job.id || job._id?.toString() || Math.random().toString(),
    title: job.title || "Untitled Position",
    department: job.department || "General",
    location: job.location || "Remote",
    type: job.type || "Full-time",
    salary: job.salary || "Competitive",
    description: job.description || "No description available",
    shortDescription: job.shortDescription || job.description || "No description available",
    requirements: job.requirements || [],
    posted: job.postedDate || job.createdAt || new Date().toISOString(),
    slug: job.slug || job.id || Math.random().toString(),
    experienceLevel: job.experienceLevel || "Mid-level",
    status: job.status || "open",
    applicationFormFields: job.applicationFormFields || [],
  }))

  console.log("Serialized jobs:", serialized)
  return serialized
}

// Get jobs from API/database
async function getJobs() {
  try {
    console.log("getJobs: Starting to fetch jobs...")

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    const apiUrl = `${baseUrl}/api/content/jobs`

    console.log("getJobs: Fetching from URL:", apiUrl)

    const response = await fetch(apiUrl, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    })

    console.log("getJobs: API Response status:", response.status)
    console.log("getJobs: API Response ok:", response.ok)

    if (response.ok) {
      const jobs = await response.json()
      console.log("getJobs: Received jobs from API:", jobs)
      console.log("getJobs: Jobs count:", Array.isArray(jobs) ? jobs.length : "Not an array")

      // Ensure we return an array
      if (Array.isArray(jobs)) {
        return jobs
      } else {
        console.error("API returned non-array:", jobs)
        return []
      }
    } else {
      const errorText = await response.text()
      console.error("getJobs: API response not ok:", response.status, response.statusText)
      console.error("getJobs: Error response body:", errorText)
    }
  } catch (error) {
    console.error("getJobs: Error fetching jobs from API:", error)
    console.error("getJobs: Error stack:", error.stack)
  }

  // Fallback data if API fails
  console.log("getJobs: Using fallback jobs data")
  return [
    {
      id: "fallback-1",
      title: "Senior Full Stack Developer",
      department: "Engineering",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$120k - $160k",
      description: "Join our engineering team to build scalable web applications using modern technologies.",
      shortDescription: "Build scalable web applications with modern tech stack.",
      requirements: ["5+ years experience", "React/Node.js", "AWS/Docker"],
      posted: new Date().toISOString(),
      slug: "senior-full-stack-developer",
      experienceLevel: "Senior",
      status: "open",
      applicationFormFields: [],
    },
    {
      id: "fallback-2",
      title: "Product Manager",
      department: "Product",
      location: "Remote",
      type: "Full-time",
      salary: "$100k - $140k",
      description: "Lead product strategy and roadmap for our venture portfolio companies.",
      shortDescription: "Lead product strategy and roadmap development.",
      requirements: ["3+ years PM experience", "SaaS background", "Data-driven mindset"],
      posted: new Date().toISOString(),
      slug: "product-manager",
      experienceLevel: "Mid-level",
      status: "open",
      applicationFormFields: [],
    },
  ]
}

export default async function CareersPage() {
  console.log("=== CAREERS PAGE LOADING ===")

  const rawJobs = await getJobs()
  console.log("CareersPage: Raw jobs received:", rawJobs)

  const jobs = serializeJobs(rawJobs)
  console.log("CareersPage: Serialized jobs:", jobs.length, "jobs")

  return <CareersClientPage jobs={jobs} />
}
