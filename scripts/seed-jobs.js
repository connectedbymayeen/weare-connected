const { MongoClient } = require("mongodb")
const bcrypt = require("bcryptjs")
require("dotenv").config()

const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB

async function seedJobs() {
  if (!uri) {
    throw new Error("Please define the MONGODB_URI environment variable")
  }
  if (!dbName) {
    throw new Error("Please define the MONGODB_DB environment variable")
  }

  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db(dbName)
    const jobsCollection = db.collection("jobs")

    // Check if jobs already exist
    const existingJobs = await jobsCollection.countDocuments()
    if (existingJobs > 0) {
      console.log(`${existingJobs} jobs already exist in the database. Skipping seed.`)
      return
    }

    // Sample jobs data
    const jobs = [
      {
        title: "Senior Full Stack Developer",
        slug: "senior-full-stack-developer",
        department: "Engineering",
        location: "San Francisco, CA",
        type: "Full-time",
        salary: "$120k - $180k",
        experienceLevel: "5+ years",
        description:
          "We're looking for a Senior Full Stack Developer to join our growing engineering team. You'll be responsible for building and maintaining our core platform, working with modern technologies, and mentoring junior developers.",
        shortDescription: "Join our engineering team to build innovative solutions with modern technologies.",
        technologies: ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS", "Docker"],
        responsibilities: [
          "Design and develop scalable web applications using React, Node.js, and TypeScript",
          "Collaborate with product managers and designers to implement new features",
          "Write clean, maintainable, and well-tested code",
          "Mentor junior developers and conduct code reviews",
          "Participate in architectural decisions and technical planning",
          "Optimize application performance and ensure security best practices",
        ],
        requirements: [
          "5+ years of experience in full-stack development",
          "Strong proficiency in React, Node.js, and TypeScript",
          "Experience with modern databases (PostgreSQL, MongoDB)",
          "Knowledge of cloud platforms (AWS, GCP, or Azure)",
          "Experience with CI/CD pipelines and DevOps practices",
          "Strong problem-solving skills and attention to detail",
          "Excellent communication and teamwork abilities",
        ],
        benefits: [
          "Competitive salary and equity package",
          "Comprehensive health, dental, and vision insurance",
          "Flexible work arrangements and remote options",
          "Professional development budget ($2,000/year)",
          "Unlimited PTO and flexible hours",
          "Top-tier equipment and home office setup",
          "Team retreats and company events",
        ],
        status: "open",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "UI/UX Designer",
        slug: "ui-ux-designer",
        department: "Design",
        location: "Remote",
        type: "Full-time",
        salary: "$90k - $130k",
        experienceLevel: "3+ years",
        description:
          "We're seeking a talented UI/UX Designer to create beautiful, intuitive interfaces for our products. You'll work closely with product managers and developers to deliver exceptional user experiences.",
        shortDescription: "Create beautiful, intuitive interfaces for our growing product suite.",
        technologies: ["Figma", "Adobe Creative Suite", "Sketch", "Prototyping", "User Research"],
        responsibilities: [
          "Design user interfaces for web and mobile applications",
          "Create wireframes, prototypes, and high-fidelity mockups",
          "Conduct user research and usability testing",
          "Develop and maintain design systems",
          "Collaborate with developers to ensure proper implementation",
          "Stay current with UX trends and best practices",
        ],
        requirements: [
          "3+ years of experience in UI/UX design",
          "Strong portfolio demonstrating user-centered design process",
          "Proficiency in design tools like Figma, Sketch, or Adobe XD",
          "Experience with design systems and component libraries",
          "Understanding of accessibility standards",
          "Excellent communication and presentation skills",
          "Basic understanding of HTML/CSS",
        ],
        benefits: [
          "Competitive salary and equity package",
          "Comprehensive health, dental, and vision insurance",
          "Flexible work arrangements and remote options",
          "Professional development budget ($2,000/year)",
          "Unlimited PTO and flexible hours",
          "Top-tier equipment and home office setup",
          "Team retreats and company events",
        ],
        status: "open",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Digital Marketing Specialist",
        slug: "digital-marketing-specialist",
        department: "Marketing",
        location: "Dhaka, Bangladesh",
        type: "Full-time",
        salary: "$60k - $80k",
        experienceLevel: "2+ years",
        description:
          "We're looking for a Digital Marketing Specialist to help grow our online presence and drive customer acquisition. You'll be responsible for planning and executing marketing campaigns across various digital channels.",
        shortDescription: "Drive growth through innovative digital marketing strategies.",
        technologies: ["Google Analytics", "SEO", "SEM", "Social Media", "Email Marketing", "Content Marketing"],
        responsibilities: [
          "Plan and execute digital marketing campaigns",
          "Manage social media accounts and content calendar",
          "Optimize website content for SEO",
          "Create and manage PPC advertising campaigns",
          "Analyze campaign performance and provide reports",
          "Collaborate with content team on marketing materials",
        ],
        requirements: [
          "2+ years of experience in digital marketing",
          "Experience with SEO, SEM, and social media marketing",
          "Proficiency with Google Analytics and marketing tools",
          "Strong analytical skills and data-driven approach",
          "Excellent written and verbal communication",
          "Experience with email marketing platforms",
          "Basic understanding of HTML and CSS",
        ],
        benefits: [
          "Competitive salary and performance bonuses",
          "Health insurance coverage",
          "Flexible work arrangements",
          "Professional development opportunities",
          "Paid time off and holidays",
          "Modern office environment",
          "Regular team events",
        ],
        status: "open",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Product Manager",
        slug: "product-manager",
        department: "Product",
        location: "Hybrid",
        type: "Full-time",
        salary: "$110k - $150k",
        experienceLevel: "4+ years",
        description:
          "We're seeking an experienced Product Manager to lead the development of our core products. You'll work closely with engineering, design, and marketing teams to define product strategy and roadmap.",
        shortDescription: "Lead product development and strategy for our core offerings.",
        technologies: ["Product Management", "Agile", "Jira", "User Research", "Data Analysis", "Roadmapping"],
        responsibilities: [
          "Define product vision, strategy, and roadmap",
          "Gather and prioritize product requirements",
          "Work with engineering and design teams to deliver features",
          "Conduct market research and competitive analysis",
          "Analyze product metrics and user feedback",
          "Present product updates to leadership and stakeholders",
        ],
        requirements: [
          "4+ years of experience in product management",
          "Experience leading software product development",
          "Strong analytical and problem-solving skills",
          "Excellent communication and stakeholder management",
          "Experience with agile development methodologies",
          "Data-driven approach to decision making",
          "Technical background or understanding preferred",
        ],
        benefits: [
          "Competitive salary and equity package",
          "Comprehensive health, dental, and vision insurance",
          "Flexible work arrangements and remote options",
          "Professional development budget ($2,000/year)",
          "Unlimited PTO and flexible hours",
          "Top-tier equipment and home office setup",
          "Team retreats and company events",
        ],
        status: "open",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Business Development Manager",
        slug: "business-development-manager",
        department: "Sales",
        location: "Dhaka, Bangladesh",
        type: "Full-time",
        salary: "$80k - $120k + Commission",
        experienceLevel: "3+ years",
        description:
          "We're looking for a Business Development Manager to drive growth and expand our client base. You'll be responsible for identifying new business opportunities, building relationships, and closing deals.",
        shortDescription: "Drive business growth through strategic partnerships and sales.",
        technologies: ["CRM", "Sales", "Negotiation", "Prospecting", "Client Management"],
        responsibilities: [
          "Identify and pursue new business opportunities",
          "Build and maintain relationships with potential clients",
          "Develop and deliver compelling sales presentations",
          "Negotiate contracts and close deals",
          "Collaborate with marketing on lead generation",
          "Meet or exceed sales targets",
        ],
        requirements: [
          "3+ years of experience in business development or sales",
          "Proven track record of meeting or exceeding targets",
          "Strong negotiation and relationship-building skills",
          "Excellent communication and presentation abilities",
          "Experience with CRM systems and sales tools",
          "Self-motivated with ability to work independently",
          "Industry knowledge preferred but not required",
        ],
        benefits: [
          "Competitive base salary plus commission structure",
          "Health insurance coverage",
          "Performance bonuses",
          "Flexible work arrangements",
          "Professional development opportunities",
          "Paid time off and holidays",
          "Regular team events and celebrations",
        ],
        status: "open",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "DevOps Engineer",
        slug: "devops-engineer",
        department: "Engineering",
        location: "Remote",
        type: "Full-time",
        salary: "$100k - $140k",
        experienceLevel: "4+ years",
        description:
          "We're seeking a DevOps Engineer to build and maintain our infrastructure and deployment pipelines. You'll work closely with the development team to ensure reliable, scalable, and secure systems.",
        shortDescription: "Build and maintain scalable, reliable infrastructure for our growing platform.",
        technologies: ["AWS", "Kubernetes", "Docker", "Terraform", "CI/CD", "Monitoring", "Security"],
        responsibilities: [
          "Design and implement cloud infrastructure on AWS",
          "Manage Kubernetes clusters and containerized applications",
          "Build and maintain CI/CD pipelines",
          "Implement monitoring, alerting, and logging solutions",
          "Ensure system security and compliance",
          "Automate infrastructure and operational tasks",
        ],
        requirements: [
          "4+ years of experience in DevOps or SRE roles",
          "Strong experience with AWS services",
          "Experience with Kubernetes and container orchestration",
          "Knowledge of infrastructure as code (Terraform, CloudFormation)",
          "Experience with CI/CD tools (Jenkins, GitHub Actions, etc.)",
          "Understanding of security best practices",
          "Strong scripting skills (Bash, Python)",
        ],
        benefits: [
          "Competitive salary and equity package",
          "Comprehensive health, dental, and vision insurance",
          "Flexible work arrangements and remote options",
          "Professional development budget ($2,000/year)",
          "Unlimited PTO and flexible hours",
          "Top-tier equipment and home office setup",
          "Team retreats and company events",
        ],
        status: "open",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    // Insert jobs
    const result = await jobsCollection.insertMany(jobs)
    console.log(`${result.insertedCount} jobs inserted successfully`)
  } catch (error) {
    console.error("Error seeding jobs:", error)
  } finally {
    await client.close()
    console.log("MongoDB connection closed")
  }
}

seedJobs()
  .then(() => {
    console.log("Jobs seeding completed")
    process.exit(0)
  })
  .catch((error) => {
    console.error("Jobs seeding failed:", error)
    process.exit(1)
  })
