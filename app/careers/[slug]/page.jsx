import { getJobBySlug } from "@/app/lib/data"
import { notFound } from "next/navigation"
import JobPageClient from "./JobPageClient"

// Generate static params for build time
export async function generateStaticParams() {
  try {
    // Return sample job slugs for build time
    return [
      { slug: "senior-frontend-developer" },
      { slug: "senior-backend-developer" },
      { slug: "senior-full-stack-developer" },
      { slug: "product-manager" },
      { slug: "ui-ux-designer" },
    ]
  } catch (error) {
    console.error("Error generating static params for jobs:", error)
    return []
  }
}

export async function generateMetadata({ params }) {
  try {
    const resolvedParams = await params
    const job = await getJobBySlug(resolvedParams.slug)

    if (!job) {
      return {
        title: "Job Not Found - We Are Connected",
        description: "The job position you're looking for could not be found.",
      }
    }

    return {
      title: `${job.title} - We Are Connected`,
      description: job.shortDescription || job.description || `Join our team as a ${job.title}`,
      openGraph: {
        title: `${job.title} - We Are Connected`,
        description: job.shortDescription || job.description,
        type: "website",
      },
    }
  } catch (error) {
    console.error("Error generating metadata for job:", error)
    return {
      title: "Job Position - We Are Connected",
      description: "Explore career opportunities with We Are Connected",
    }
  }
}

async function JobPage({ params }) {
  try {
    const resolvedParams = await params
    console.log("JobPage: Received slug:", resolvedParams.slug)

    let job = await getJobBySlug(resolvedParams.slug)
    console.log("JobPage: Found job:", job ? job.title : "Not found")

    // If job not found in database, provide sample data for build time
    if (!job) {
      job = getSampleJobData(resolvedParams.slug)

      if (!job) {
        console.log("JobPage: No sample data found, calling notFound()")
        notFound()
      }
    }

    // Serialize and ensure all required fields exist
    const serializedJob = {
      id: job.id || job._id?.toString() || resolvedParams.slug,
      title: job.title || "Job Position",
      slug: job.slug || resolvedParams.slug,
      description: job.description || "Job description not available.",
      shortDescription: job.shortDescription || job.description || "Join our team in this exciting role.",
      department: job.department || "Technology",
      location: job.location || "Remote",
      type: job.type || "Full-time",
      salary: job.salary || "Competitive",
      experienceLevel: job.experienceLevel || "Mid-level",
      technologies: Array.isArray(job.technologies) ? job.technologies : [],
      responsibilities: Array.isArray(job.responsibilities) ? job.responsibilities : [],
      requirements: Array.isArray(job.requirements) ? job.requirements : [],
      benefits: Array.isArray(job.benefits) ? job.benefits : [],
      status: job.status || "open",
      createdAt: job.createdAt || new Date().toISOString(),
      updatedAt: job.updatedAt || new Date().toISOString(),
      postedDate: job.postedDate || new Date().toISOString(),
    }

    return <JobPageClient job={serializedJob} />
  } catch (error) {
    console.error("Error in JobPage:", error)
    notFound()
  }
}

// Sample job data for build time
function getSampleJobData(slug) {
  const sampleJobs = {
    "senior-frontend-developer": {
      id: "sample-1",
      title: "Senior Frontend Developer",
      slug: "senior-frontend-developer",
      description:
        "We're looking for a Senior Frontend Developer to join our dynamic team and help build cutting-edge web applications that serve millions of users worldwide.",
      shortDescription: "Join our team as a Senior Frontend Developer and build amazing user experiences.",
      department: "Engineering",
      location: "Remote / San Francisco",
      type: "Full-time",
      salary: "$120,000 - $160,000",
      experienceLevel: "Senior",
      technologies: ["React", "TypeScript", "Next.js", "Tailwind CSS", "GraphQL"],
      responsibilities: [
        "Develop and maintain high-quality frontend applications",
        "Collaborate with design and backend teams",
        "Optimize applications for maximum speed and scalability",
        "Mentor junior developers and conduct code reviews",
        "Stay up-to-date with emerging technologies and best practices",
      ],
      requirements: [
        "5+ years of experience in frontend development",
        "Expert knowledge of React and TypeScript",
        "Experience with modern build tools and workflows",
        "Strong understanding of web performance optimization",
        "Excellent communication and teamwork skills",
      ],
      benefits: [
        "Competitive salary and equity package",
        "Comprehensive health, dental, and vision insurance",
        "Flexible working hours and remote work options",
        "Professional development budget",
        "Modern equipment and tools",
      ],
      status: "open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      postedDate: new Date().toISOString(),
    },
    "senior-backend-developer": {
      id: "sample-2",
      title: "Senior Backend Developer",
      slug: "senior-backend-developer",
      description:
        "We're seeking a Senior Backend Developer to architect and build scalable server-side applications that power our platform.",
      shortDescription: "Build robust backend systems as our Senior Backend Developer.",
      department: "Engineering",
      location: "Remote / New York",
      type: "Full-time",
      salary: "$130,000 - $170,000",
      experienceLevel: "Senior",
      technologies: ["Node.js", "Python", "PostgreSQL", "MongoDB", "AWS", "Docker"],
      responsibilities: [
        "Design and implement scalable backend architectures",
        "Develop RESTful APIs and microservices",
        "Optimize database performance and queries",
        "Implement security best practices",
        "Monitor and maintain production systems",
      ],
      requirements: [
        "5+ years of backend development experience",
        "Proficiency in Node.js and Python",
        "Experience with cloud platforms (AWS, GCP, or Azure)",
        "Strong database design and optimization skills",
        "Knowledge of containerization and orchestration",
      ],
      benefits: [
        "Competitive salary and equity package",
        "Comprehensive health, dental, and vision insurance",
        "Flexible working hours and remote work options",
        "Professional development budget",
        "Modern equipment and tools",
      ],
      status: "open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      postedDate: new Date().toISOString(),
    },
    "senior-full-stack-developer": {
      id: "sample-3",
      title: "Senior Full Stack Developer",
      slug: "senior-full-stack-developer",
      description:
        "Join our team as a Senior Full Stack Developer and work on both frontend and backend technologies to deliver complete solutions.",
      shortDescription: "Lead full-stack development projects from conception to deployment.",
      department: "Engineering",
      location: "Remote / Austin",
      type: "Full-time",
      salary: "$125,000 - $165,000",
      experienceLevel: "Senior",
      technologies: ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS", "Docker"],
      responsibilities: [
        "Develop end-to-end web applications",
        "Work with both frontend and backend technologies",
        "Collaborate with product and design teams",
        "Ensure code quality and best practices",
        "Participate in architecture decisions",
      ],
      requirements: [
        "5+ years of full-stack development experience",
        "Proficiency in React and Node.js",
        "Experience with databases and cloud platforms",
        "Strong problem-solving skills",
        "Ability to work independently and in teams",
      ],
      benefits: [
        "Competitive salary and equity package",
        "Comprehensive health, dental, and vision insurance",
        "Flexible working hours and remote work options",
        "Professional development budget",
        "Modern equipment and tools",
      ],
      status: "open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      postedDate: new Date().toISOString(),
    },
    "product-manager": {
      id: "sample-4",
      title: "Product Manager",
      slug: "product-manager",
      description:
        "We're looking for a Product Manager to drive product strategy and work closely with engineering and design teams.",
      shortDescription: "Shape the future of our products as a Product Manager.",
      department: "Product",
      location: "Remote / Seattle",
      type: "Full-time",
      salary: "$110,000 - $150,000",
      experienceLevel: "Mid-Senior",
      technologies: ["Analytics Tools", "Figma", "Jira", "Slack", "SQL"],
      responsibilities: [
        "Define product roadmap and strategy",
        "Work with engineering and design teams",
        "Analyze user feedback and market trends",
        "Manage product launches and releases",
        "Communicate with stakeholders",
      ],
      requirements: [
        "3+ years of product management experience",
        "Strong analytical and communication skills",
        "Experience with agile development processes",
        "Understanding of user experience principles",
        "Bachelor's degree in relevant field",
      ],
      benefits: [
        "Competitive salary and equity package",
        "Comprehensive health, dental, and vision insurance",
        "Flexible working hours and remote work options",
        "Professional development budget",
        "Modern equipment and tools",
      ],
      status: "open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      postedDate: new Date().toISOString(),
    },
    "ui-ux-designer": {
      id: "sample-5",
      title: "UI/UX Designer",
      slug: "ui-ux-designer",
      description: "Join our design team to create beautiful and intuitive user experiences for our products.",
      shortDescription: "Create amazing user experiences as our UI/UX Designer.",
      department: "Design",
      location: "Remote / Los Angeles",
      type: "Full-time",
      salary: "$90,000 - $130,000",
      experienceLevel: "Mid-level",
      technologies: ["Figma", "Adobe Creative Suite", "Sketch", "Principle", "InVision"],
      responsibilities: [
        "Design user interfaces and experiences",
        "Create wireframes, prototypes, and mockups",
        "Conduct user research and testing",
        "Collaborate with product and engineering teams",
        "Maintain design systems and guidelines",
      ],
      requirements: [
        "3+ years of UI/UX design experience",
        "Proficiency in design tools (Figma, Sketch, etc.)",
        "Strong portfolio demonstrating design skills",
        "Understanding of user-centered design principles",
        "Experience with design systems",
      ],
      benefits: [
        "Competitive salary and equity package",
        "Comprehensive health, dental, and vision insurance",
        "Flexible working hours and remote work options",
        "Professional development budget",
        "Modern equipment and tools",
      ],
      status: "open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      postedDate: new Date().toISOString(),
    },
  }

  return sampleJobs[slug] || null
}

export default JobPage
