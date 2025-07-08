import { ObjectId } from "mongodb"
import { connectToDatabase, isMongoDBAvailable } from "./mongodb"

// Helper function to handle database errors
const handleDbError = (error, fallbackData, entityName) => {
  console.error(`Error fetching ${entityName}:`, error)
  return fallbackData
}

// Helper function to serialize MongoDB objects
function serializeMongoObject(obj) {
  if (!obj) return null

  return {
    ...obj,
    _id: obj._id?.toString() || obj._id,
    createdAt: obj.createdAt?.toISOString?.() || obj.createdAt || new Date().toISOString(),
    updatedAt: obj.updatedAt?.toISOString?.() || obj.updatedAt || new Date().toISOString(),
    publishedAt: obj.publishedAt?.toISOString?.() || obj.publishedAt || null,
  }
}

const serializeJob = (job) => {
  if (!job) return null

  return {
    id: job._id?.toString() || job.id,
    title: job.title || "",
    slug: job.slug || "",
    description: job.description || "",
    shortDescription: job.shortDescription || "",
    department: job.department || "",
    location: job.location || "",
    type: job.type || "",
    salary: job.salary || "",
    experienceLevel: job.experienceLevel || "",
    technologies: Array.isArray(job.technologies) ? job.technologies : [],
    responsibilities: Array.isArray(job.responsibilities) ? job.responsibilities : [],
    requirements: Array.isArray(job.requirements) ? job.requirements : [],
    benefits: Array.isArray(job.benefits) ? job.benefits : [],
    status: job.status || "open",
    createdAt: job.createdAt ? new Date(job.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: job.updatedAt ? new Date(job.updatedAt).toISOString() : new Date().toISOString(),
    postedDate: job.postedDate ? new Date(job.postedDate).toISOString() : new Date().toISOString(),
  }
}

// Helper function to serialize blog post data
const serializeBlogPost = (post) => {
  if (!post) return null

  return {
    id: post._id?.toString() || post.id,
    slug: post.slug || post._id?.toString() || "",
    title: post.title || "Untitled Post",
    excerpt:
      post.excerpt ||
      post.shortDescription ||
      (post.content ? post.content.substring(0, 150) + "..." : "No excerpt available"),
    content: post.content || "No content available",
    author: post.author || {
      name: "Connected Team",
      role: "Author",
      image: "/placeholder.svg?height=40&width=40&text=A",
    },
    authorImage:
      post.author?.image ||
      "/placeholder.svg?height=80&width=80&text=" + encodeURIComponent(post.author?.name?.charAt(0) || "A"),
    authorRole: post.author?.role || "Author",
    publishedAt: post.publishedAt ? new Date(post.publishedAt).toISOString() : new Date().toISOString(),
    image:
      post.featuredImage?.url ||
      post.image ||
      "/placeholder.svg?height=400&width=600&text=" + encodeURIComponent(post.title || "Blog Post"),
    tags: Array.isArray(post.tags) ? post.tags : ["Technology", "Innovation"],
    category: post.category || "Technology",
    readTime: post.readTime || "5 min read",
    status: post.status || "published",
  }
}

// Helper function to serialize service data
const serializeService = (service) => {
  if (!service) return null

  return {
    id: service._id?.toString() || service.id,
    slug: service.slug || "",
    title: service.title || "",
    description: service.description || service.shortDescription || "",
    longDescription: service.longDescription || service.description || "",
    image:
      service.featuredImage?.url ||
      service.image ||
      "/placeholder.svg?height=400&width=600&text=" + encodeURIComponent(service.title || "Service"),
    icon: service.icon || "Zap",
    features: Array.isArray(service.features) ? service.features : [],
    benefits: Array.isArray(service.benefits) ? service.benefits : [],
    process: Array.isArray(service.process) ? service.process : [],
    pricing: Array.isArray(service.pricing) ? service.pricing : [],
    testimonials: Array.isArray(service.testimonials) ? service.testimonials : [],
    technologies: Array.isArray(service.technologies) ? service.technologies : [],
    deliverables: Array.isArray(service.deliverables) ? service.deliverables : [],
    timeline: service.timeline || "",
    startingPrice: service.startingPrice || "",
    status: service.status || "active",
  }
}

// Get all jobs
export async function getJobs() {
  try {
    if (!isMongoDBAvailable()) {
      console.warn("MongoDB not available, returning sample jobs")
      return getSampleJobs()
    }

    const { db } = await connectToDatabase()
    const jobs = await db.collection("jobs").find({ status: "open" }).sort({ createdAt: -1 }).toArray()

    if (jobs.length === 0) {
      return getSampleJobs()
    }

    return jobs.map((job) => serializeJob(job))
  } catch (error) {
    console.error("Error fetching jobs:", error)
    return getSampleJobs()
  }
}

// Get a single job by slug
export async function getJobBySlug(slug) {
  try {
    if (!isMongoDBAvailable()) {
      console.warn("MongoDB not available, returning null for job")
      return null
    }

    const { db } = await connectToDatabase()

    // Try to find by slug first
    let job = await db.collection("jobs").findOne({ slug, status: "open" })

    // If not found, try to find by _id (in case slug is actually an ID)
    if (!job && ObjectId.isValid(slug)) {
      try {
        job = await db.collection("jobs").findOne({ _id: new ObjectId(slug), status: "open" })
      } catch (err) {
        console.log("Error trying to find by ID:", err.message)
      }
    }

    return serializeJob(job)
  } catch (error) {
    console.error(`Error fetching job with slug ${slug}:`, error)
    return null
  }
}

// Get a single job by ID (for backward compatibility)
export async function getJob(id) {
  return getJobBySlug(id)
}

// Sample jobs for build time and fallback
function getSampleJobs() {
  return [
    {
      id: "sample-1",
      title: "Senior Frontend Developer",
      slug: "senior-frontend-developer",
      description: "Join our team as a Senior Frontend Developer and build amazing user experiences.",
      shortDescription: "Build cutting-edge frontend applications with React and TypeScript.",
      department: "Engineering",
      location: "Remote / San Francisco",
      type: "Full-time",
      salary: "$120,000 - $160,000",
      experienceLevel: "Senior",
      technologies: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
      responsibilities: ["Develop frontend applications", "Collaborate with teams", "Optimize performance"],
      requirements: ["5+ years React experience", "TypeScript proficiency", "Team collaboration"],
      benefits: ["Competitive salary", "Health insurance", "Remote work", "Professional development"],
      status: "open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      postedDate: new Date().toISOString(),
    },
    {
      id: "sample-2",
      title: "Senior Backend Developer",
      slug: "senior-backend-developer",
      description: "Build robust backend systems as our Senior Backend Developer.",
      shortDescription: "Architect scalable server-side applications with Node.js and Python.",
      department: "Engineering",
      location: "Remote / New York",
      type: "Full-time",
      salary: "$130,000 - $170,000",
      experienceLevel: "Senior",
      technologies: ["Node.js", "Python", "PostgreSQL", "AWS"],
      responsibilities: ["Design backend architecture", "Develop APIs", "Optimize databases"],
      requirements: ["5+ years backend experience", "Cloud platform knowledge", "Database expertise"],
      benefits: ["Competitive salary", "Health insurance", "Remote work", "Professional development"],
      status: "open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      postedDate: new Date().toISOString(),
    },
    {
      id: "sample-3",
      title: "Senior Full Stack Developer",
      slug: "senior-full-stack-developer",
      description: "Lead full-stack development projects from conception to deployment.",
      shortDescription: "Work with both frontend and backend technologies to deliver complete solutions.",
      department: "Engineering",
      location: "Remote / Austin",
      type: "Full-time",
      salary: "$125,000 - $165,000",
      experienceLevel: "Senior",
      technologies: ["React", "Node.js", "TypeScript", "PostgreSQL"],
      responsibilities: ["Develop full-stack applications", "Work with product teams", "Ensure code quality"],
      requirements: ["5+ years full-stack experience", "React and Node.js proficiency", "Problem-solving skills"],
      benefits: ["Competitive salary", "Health insurance", "Remote work", "Professional development"],
      status: "open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      postedDate: new Date().toISOString(),
    },
  ]
}

// Get all blog posts - UPDATED TO FETCH REAL DATA
export async function getBlogPosts() {
  try {
    if (!isMongoDBAvailable()) {
      console.warn("MongoDB not available, returning sample blog posts")
      return getSampleBlogPosts()
    }

    const { db } = await connectToDatabase()
    let posts = []

    // Try 'blog' collection first (this is where admin creates posts)
    try {
      posts = await db
        .collection("blog")
        .find({ status: "published" })
        .sort({ publishedAt: -1, createdAt: -1 })
        .toArray()

      console.log(`Found ${posts.length} published posts in 'blog' collection`)

      // If no published posts, get all posts from blog collection
      if (posts.length === 0) {
        posts = await db.collection("blog").find({}).sort({ publishedAt: -1, createdAt: -1 }).toArray()

        console.log(`Found ${posts.length} total posts in 'blog' collection`)
      }
    } catch (err) {
      console.log("Error accessing blog collection:", err.message)
    }

    // If no posts found, try 'blog_posts' collection as fallback
    if (posts.length === 0) {
      try {
        posts = await db
          .collection("blog_posts")
          .find({ status: "published" })
          .sort({ publishedAt: -1, createdAt: -1 })
          .toArray()

        console.log(`Found ${posts.length} posts in 'blog_posts' collection`)
      } catch (err) {
        console.log("Error accessing blog_posts collection:", err.message)
      }
    }

    if (posts.length === 0) {
      console.log("No blog posts found in database, returning sample data")
      return getSampleBlogPosts()
    }

    console.log(`Returning ${posts.length} real blog posts from database`)
    return posts.map((post) => serializeBlogPost(post))
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return getSampleBlogPosts()
  }
}

function getSampleBlogPosts() {
  return [


  ]
}

// Get a single blog post by slug - UPDATED TO FETCH REAL DATA
export async function getBlogPostBySlug(slug) {
  try {
    if (!isMongoDBAvailable()) {
      console.warn("MongoDB not available, checking sample blog posts")
      const samplePosts = getSampleBlogPosts()
      return samplePosts.find((post) => post.slug === slug) || null
    }

    const { db } = await connectToDatabase()
    let post = null

    // Try 'blog' collection first (your original data)
    try {
      post = await db.collection("blog").findOne({ slug, status: "published" })
    } catch (err) {
      console.log("Blog collection not found, trying blog_posts...")
    }

    // If not found, try 'blog_posts' collection
    if (!post) {
      try {
        post = await db.collection("blog_posts").findOne({ slug, status: "published" })
      } catch (err) {
        console.log("Blog_posts collection not found either...")
      }
    }

    // If still not found, try without status filter from 'blog' collection
    if (!post) {
      try {
        post = await db.collection("blog").findOne({ slug })
      } catch (err) {
        console.log("Error finding blog post without status filter in blog collection:", err.message)
      }
    }

    // If still not found, try without status filter from 'blog_posts' collection
    if (!post) {
      try {
        post = await db.collection("blog_posts").findOne({ slug })
      } catch (err) {
        console.log("Error finding blog post without status filter in blog_posts collection:", err.message)
      }
    }

    // If still not found by slug, try by ID (in case slug is actually an ID)
    if (!post && ObjectId.isValid(slug)) {
      try {
        post = await db.collection("blog").findOne({ _id: new ObjectId(slug) })
      } catch (err) {
        try {
          post = await db.collection("blog_posts").findOne({ _id: new ObjectId(slug) })
        } catch (err2) {
          console.log("Error trying to find by ID:", err2.message)
        }
      }
    }

    if (!post) {
      console.log(`Blog post with slug '${slug}' not found in database`)
      return null
    }

    console.log(`Found blog post: ${post.title}`)
    return serializeBlogPost(post)
  } catch (error) {
    console.error(`Error fetching blog post with slug ${slug}:`, error)
    return null
  }
}

// Get all services
export async function getServices() {
  try {
    if (!isMongoDBAvailable()) {
      console.warn("MongoDB not available, returning sample services")
      return getSampleServices()
    }

    const { db } = await connectToDatabase()
    const services = await db.collection("services").find({ status: "active" }).toArray()

    if (services.length === 0) {
      return getSampleServices()
    }

    return services.map((service) => serializeService(service))
  } catch (error) {
    return handleDbError(error, getSampleServices(), "services")
  }
}

function getSampleServices() {
  return [
    {
      id: "1",
      slug: "web-development",
      title: "Web Development",
      description: "Custom web applications built with modern technologies and best practices for optimal performance.",
      longDescription:
        "We create custom web applications using cutting-edge technologies like React, Next.js, and Node.js. Our development process focuses on performance, scalability, and user experience to deliver solutions that drive business growth.",
      image: "/placeholder.svg?height=400&width=600&text=Web+Development",
      icon: "Code",
      features: ["React & Next.js", "Node.js Backend", "Database Design", "API Development", "Responsive Design"],
      benefits: ["Fast Performance", "SEO Optimized", "Mobile Responsive", "Scalable Architecture", "Modern UI/UX"],
      process: [
        { step: "Discovery", description: "Understanding your requirements and goals" },
        { step: "Design", description: "Creating wireframes and visual designs" },
        { step: "Development", description: "Building your application with modern technologies" },
        { step: "Testing", description: "Comprehensive testing across devices and browsers" },
        { step: "Deployment", description: "Launching your application to production" },
      ],
      technologies: ["React", "Next.js", "Node.js", "TypeScript", "Tailwind CSS"],
      deliverables: ["Source Code", "Documentation", "Deployment Guide", "Training Materials"],
      timeline: "4-8 weeks",
      startingPrice: "$5,000",
    },
    {
      id: "2",
      slug: "mobile-app-development",
      title: "Mobile App Development",
      description: "Native and cross-platform mobile applications for iOS and Android with seamless user experiences.",
      longDescription:
        "We develop high-quality mobile applications for iOS and Android platforms using both native and cross-platform technologies. Our apps are designed to provide exceptional user experiences while maintaining optimal performance.",
      image: "/placeholder.svg?height=400&width=600&text=Mobile+App+Development",
      icon: "Smartphone",
      features: ["iOS Development", "Android Development", "React Native", "Flutter", "App Store Optimization"],
      benefits: [
        "Cross-Platform Compatibility",
        "Native Performance",
        "Offline Functionality",
        "Push Notifications",
        "App Store Ready",
      ],
      process: [
        { step: "Strategy", description: "Defining app strategy and user journey" },
        { step: "UI/UX Design", description: "Creating intuitive and engaging interfaces" },
        { step: "Development", description: "Building native or cross-platform applications" },
        { step: "Testing", description: "Rigorous testing on multiple devices" },
        { step: "Launch", description: "App store submission and launch support" },
      ],
      technologies: ["React Native", "Flutter", "Swift", "Kotlin", "Firebase"],
      deliverables: ["Mobile App", "App Store Assets", "Analytics Setup", "Maintenance Guide"],
      timeline: "6-12 weeks",
      startingPrice: "$8,000",
    },
    {
      id: "3",
      slug: "product-strategy",
      title: "Product Strategy",
      description:
        "Strategic planning and roadmapping for digital products to ensure market success and user satisfaction.",
      longDescription:
        "Our product strategy services help you define clear roadmaps, validate ideas, and create products that resonate with your target market. We combine market research, user insights, and business objectives to guide your product development.",
      image: "/placeholder.svg?height=400&width=600&text=Product+Strategy",
      icon: "Target",
      features: [
        "Market Research",
        "User Experience Design",
        "Product Roadmapping",
        "Competitive Analysis",
        "Go-to-Market Strategy",
      ],
      benefits: [
        "Clear Direction",
        "Reduced Risk",
        "Market Validation",
        "User-Centered Design",
        "Competitive Advantage",
      ],
      process: [
        { step: "Research", description: "Market and user research to understand opportunities" },
        { step: "Strategy", description: "Developing comprehensive product strategy" },
        { step: "Roadmap", description: "Creating detailed product roadmap and milestones" },
        { step: "Validation", description: "Testing concepts with target users" },
        { step: "Launch Plan", description: "Go-to-market strategy and launch planning" },
      ],
      technologies: ["Analytics Tools", "User Research Platforms", "Prototyping Tools", "Market Research"],
      deliverables: ["Strategy Document", "Product Roadmap", "User Personas", "Market Analysis"],
      timeline: "2-4 weeks",
      startingPrice: "$3,000",
    },
    {
      id: "4",
      slug: "venture-building",
      title: "Venture Building",
      description: "End-to-end support for launching new ventures from ideation to market entry and scaling.",
      longDescription:
        "We partner with entrepreneurs and organizations to build new ventures from the ground up. Our comprehensive approach covers everything from idea validation to product development, team building, and market launch.",
      image: "/placeholder.svg?height=400&width=600&text=Venture+Building",
      icon: "Rocket",
      features: ["Idea Validation", "Business Model Design", "MVP Development", "Funding Support", "Team Building"],
      benefits: [
        "Reduced Time to Market",
        "Expert Guidance",
        "Network Access",
        "Risk Mitigation",
        "Scalable Foundation",
      ],
      process: [
        { step: "Ideation", description: "Refining and validating your venture idea" },
        { step: "Planning", description: "Business model and go-to-market planning" },
        { step: "Building", description: "MVP development and initial team formation" },
        { step: "Testing", description: "Market testing and iteration" },
        { step: "Scaling", description: "Growth strategy and scaling support" },
      ],
      technologies: ["Various based on venture needs"],
      deliverables: ["Business Plan", "MVP Product", "Team Structure", "Funding Strategy"],
      timeline: "3-6 months",
      startingPrice: "$15,000",
    },
  ]
}

// Get a single service by slug
export async function getServiceBySlug(slug) {
  try {
    if (!isMongoDBAvailable()) {
      console.warn("MongoDB not available, checking sample services")
      const sampleServices = getSampleServices()
      return sampleServices.find((service) => service.slug === slug) || null
    }

    const { db } = await connectToDatabase()
    const service = await db.collection("services").findOne({ slug, status: "active" })

    if (!service) {
      // Fallback to sample services
      const sampleServices = getSampleServices()
      return sampleServices.find((s) => s.slug === slug) || null
    }

    return serializeService(service)
  } catch (error) {
    console.error(`Error fetching service with slug ${slug}:`, error)
    // Fallback to sample services
    const sampleServices = getSampleServices()
    return sampleServices.find((service) => service.slug === slug) || null
  }
}

// Alias for backward compatibility
export async function getService(slug) {
  return getServiceBySlug(slug)
}

// Get all ventures - IMPROVED WITH BETTER ERROR HANDLING
export async function getVentures() {
  try {
    console.log("=== GETTING VENTURES ===")

    if (!isMongoDBAvailable()) {
      console.warn("MongoDB not available, returning sample ventures")
      return getSampleVentures()
    }

    const { db } = await connectToDatabase()
    console.log("Database connected successfully")

    // Get all ventures with any status (active, scaling, etc.)
    const ventures = await db.collection("ventures").find({}).sort({ createdAt: -1 }).toArray()

    console.log(`Found ${ventures.length} total ventures in database`)

    if (ventures.length === 0) {
      console.log("No ventures found in database, returning sample ventures")
      return getSampleVentures()
    }

    // Transform and return ventures
    const transformedVentures = ventures.map((venture) => {
      console.log(`Processing venture: ${venture.name} (Status: ${venture.status})`)

      return {
        ...venture,
        id: venture._id.toString(),
        slug: venture.slug || venture._id.toString(),
        name: venture.name || "Untitled Venture",
        tagline: venture.tagline || venture.shortDescription || "Innovative solutions",
        description: venture.description || "No description available",
        shortDescription: venture.shortDescription || venture.description?.substring(0, 100) + "..." || "",
        fullDescription: venture.fullDescription || venture.description || "",
        category: venture.category || venture.industry || "Technology",
        status: venture.status || "active",
        foundedYear: venture.foundedYear || venture.year || new Date().getFullYear(),
        teamSize: venture.teamSize || "5-10",
        growth: venture.growth || "+100% YoY",
        image:
          venture.featuredImage?.url ||
          venture.image ||
          "/placeholder.svg?height=600&width=1200&text=" + encodeURIComponent(venture.name || "Venture"),
        logo:
          venture.logo?.url ||
          venture.logo ||
          "/placeholder.svg?height=120&width=120&text=" + encodeURIComponent(venture.name?.charAt(0) || "V"),
        website: venture.website || "#",
        industry: venture.industry || venture.category || "Technology",
        metrics: venture.metrics || [],
        technologies: venture.technologies || [],
        features: venture.features || [],
        testimonials: venture.testimonials || [],
        createdAt: venture.createdAt ? new Date(venture.createdAt).toISOString() : new Date().toISOString(),
        updatedAt: venture.updatedAt ? new Date(venture.updatedAt).toISOString() : new Date().toISOString(),
      }
    })

    console.log(`Returning ${transformedVentures.length} transformed ventures`)
    return transformedVentures
  } catch (error) {
    console.error("Error fetching ventures:", error)
    console.log("Falling back to sample ventures due to error")
    return getSampleVentures()
  }
}

function getSampleVentures() {
  return [

  ]
}

// Get a single venture by slug
export async function getVentureBySlug(slug) {
  try {
    if (!isMongoDBAvailable()) {
      console.warn("MongoDB not available, checking fallback ventures")
      const fallbackVentures = getSampleVentures()
      return fallbackVentures.find((venture) => venture.slug === slug) || null
    }

    const { db } = await connectToDatabase()
    let venture = await db.collection("ventures").findOne({ slug })

    // If not found by slug, try by ID (in case slug is actually an ID)
    if (!venture && ObjectId.isValid(slug)) {
      try {
        venture = await db.collection("ventures").findOne({ _id: new ObjectId(slug) })
      } catch (err) {
        console.log("Error trying to find by ID:", err.message)
      }
    }

    if (!venture) {
      // Check fallback ventures as last resort
      const fallbackVentures = getSampleVentures()
      return fallbackVentures.find((v) => v.slug === slug) || null
    }

    return {
      ...venture,
      id: venture._id.toString(),
      slug: venture.slug || venture._id.toString(),
      image:
        venture.featuredImage?.url ||
        venture.image ||
        "/placeholder.svg?height=600&width=1200&text=" + encodeURIComponent(venture.name || "Venture"),
      logo:
        venture.logo?.url ||
        venture.logo ||
        "/placeholder.svg?height=120&width=120&text=" + encodeURIComponent(venture.name?.charAt(0) || "V"),
    }
  } catch (error) {
    console.error(`Error fetching venture with slug ${slug}:`, error)
    // Return fallback venture if available
    const fallbackVentures = getSampleVentures()
    return fallbackVentures.find((venture) => venture.slug === slug) || null
  }
}

// Get all case studies
export async function getCaseStudies() {
  try {
    if (!isMongoDBAvailable()) {
      console.warn("MongoDB not available, returning empty case studies")
      return []
    }

    const { db } = await connectToDatabase()
    const caseStudies = await db.collection("case_studies").find({ status: "published" }).toArray()

    return caseStudies.map((study) => ({
      id: study._id.toString(),
      slug: study.slug || study._id.toString(),
      title: study.title || "Untitled Case Study",
      client: study.client || "Client",
      industry: study.industry || "Industry",
      image:
        study.featuredImage?.url ||
        study.image ||
        "/placeholder.svg?height=400&width=600&text=" + encodeURIComponent(study.title || "Case Study"),
      description: study.description || "No description available",
      tags: study.tags || [],
    }))
  } catch (error) {
    return handleDbError(error, [], "case studies")
  }
}

// Get a single case study by slug
export async function getCaseStudyBySlug(slug) {
  try {
    if (!isMongoDBAvailable()) {
      console.warn("MongoDB not available, returning null for case study")
      return null
    }

    const { db } = await connectToDatabase()
    const study = await db.collection("case_studies").findOne({ slug, status: "published" })

    if (!study) return null

    return {
      id: study._id.toString(),
      slug: study.slug,
      title: study.title || "Untitled Case Study",
      client: study.client || "Client",
      industry: study.industry || "Industry",
      image:
        study.featuredImage?.url ||
        study.image ||
        "/placeholder.svg?height=400&width=600&text=" + encodeURIComponent(study.title || "Case Study"),
      description: study.description || "No description available",
      tags: study.tags || [],
      challenge: study.challenge || "No challenge information available",
      solution: study.solution || "No solution information available",
      outcome: study.outcome || "No outcome information available",
      testimonial: study.testimonial || null,
    }
  } catch (error) {
    return handleDbError(error, null, `case study with slug ${slug}`)
  }
}

// Get all team members
export async function getTeamMembers() {
  try {
    if (!isMongoDBAvailable()) {
      console.warn("MongoDB not available, returning empty team members")
      return []
    }

    const { db } = await connectToDatabase()
    const teamMembers = await db.collection("team_members").find({ status: "active" }).toArray()

    return teamMembers.map((member) => ({
      id: member._id.toString(),
      name: member.name || "Team Member",
      role: member.role || "Team Member",
      bio: member.bio || "No bio available",
      image:
        member.image ||
        "/placeholder.svg?height=300&width=300&text=" + encodeURIComponent(member.name?.charAt(0) || "T"),
      socialLinks: member.socialLinks || {},
    }))
  } catch (error) {
    return handleDbError(error, [], "team members")
  }
}

// Get all press releases
export async function getPressReleases() {
  try {
    if (!isMongoDBAvailable()) {
      console.warn("MongoDB not available, returning empty press releases")
      return []
    }

    const { db } = await connectToDatabase()
    const pressReleases = await db.collection("press_releases").find({ status: "published" }).toArray()

    return pressReleases.map((release) => ({
      id: release._id.toString(),
      title: release.title || "Untitled Press Release",
      date: release.date ? new Date(release.date).toLocaleDateString() : "No date available",
      excerpt: release.excerpt || "No excerpt available",
      content: release.content || "No content available",
      category: release.category || "News",
    }))
  } catch (error) {
    return handleDbError(error, [], "press releases")
  }
}

// Get all media assets
export async function getMediaAssets() {
  try {
    if (!isMongoDBAvailable()) {
      console.warn("MongoDB not available, returning empty media assets")
      return []
    }

    const { db } = await connectToDatabase()
    const mediaAssets = await db.collection("media_assets").find({ status: "active" }).toArray()

    return mediaAssets.map((asset) => ({
      id: asset._id.toString(),
      title: asset.title || "Untitled Asset",
      description: asset.description || "No description available",
      url: asset.url || "#",
      type: asset.type || "Other",
    }))
  } catch (error) {
    return handleDbError(error, [], "media assets")
  }
}
