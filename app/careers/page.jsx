import CareersClientPage from "./careers-client"

// Serialize jobs data for client component
function serializeJobs(jobs) {
  return jobs.map((job) => ({
    id: job._id?.toString() || job.id?.toString() || Math.random().toString(),
    title: job.title || "Untitled Position",
    department: job.department || job.category || "General",
    location: job.location || "Remote",
    type: job.type || job.employmentType || "Full-time",
    salary: job.salary || job.salaryRange || "Competitive",
    description: job.description || job.summary || "",
    requirements: job.requirements || job.skills || [],
    posted: job.createdAt ? new Date(job.createdAt).toISOString() : new Date().toISOString(),
    slug: job.slug || job.id?.toString() || job._id?.toString(),
    experienceLevel: job.experienceLevel || job.level || "Mid-level",
  }))
}

// Get jobs from API/database
async function getJobs() {
  try {
    // Try to fetch from API first
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/content/jobs`, {
      cache: "no-store",
    })

    if (response.ok) {
      const jobs = await response.json()
      return jobs
    }
  } catch (error) {
    console.error("Error fetching jobs:", error)
  }

  // Fallback data if API fails
  return [
    {
      id: "1",
      title: "Senior Full Stack Developer",
      department: "Engineering",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$120k - $160k",
      description: "Join our engineering team to build scalable web applications using modern technologies.",
      requirements: ["5+ years experience", "React/Node.js", "AWS/Docker"],
      posted: new Date().toISOString(),
      slug: "senior-full-stack-developer",
      experienceLevel: "Senior",
    },
    {
      id: "2",
      title: "Product Manager",
      department: "Product",
      location: "Remote",
      type: "Full-time",
      salary: "$100k - $140k",
      description: "Lead product strategy and roadmap for our venture portfolio companies.",
      requirements: ["3+ years PM experience", "SaaS background", "Data-driven mindset"],
      posted: new Date().toISOString(),
      slug: "product-manager",
      experienceLevel: "Mid-level",
    },
  ]
}

export default async function CareersPage() {
  const rawJobs = await getJobs()
  const jobs = serializeJobs(rawJobs)

  return <CareersClientPage jobs={jobs} />
}
