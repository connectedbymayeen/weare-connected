// Load environment variables from .env.local
require("dotenv").config({ path: ".env.local" })

const { MongoClient } = require("mongodb")

async function seedDatabase() {
  console.log("🌱 Seeding database with initial data...\n")

  const uri = process.env.MONGODB_URI
  const dbName = process.env.MONGODB_DB || "connected_website"

  if (!uri) {
    console.error("❌ MONGODB_URI not found in environment variables")
    process.exit(1)
  }

  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log("✅ Connected to MongoDB successfully")

    const db = client.db(dbName)

    // Seed Services
    console.log("🔧 Seeding services...")
    const services = [
      {
        title: "Web Development",
        slug: "web-development",
        description: "Custom web applications built with modern technologies",
        content: "We create responsive, scalable web applications using the latest technologies and best practices.",
        image: "/placeholder.svg?height=400&width=600",
        featured: true,
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Mobile App Development",
        slug: "mobile-app-development",
        description: "Native and cross-platform mobile applications",
        content: "Build powerful mobile apps for iOS and Android platforms with seamless user experiences.",
        image: "/placeholder.svg?height=400&width=600",
        featured: true,
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Digital Marketing",
        slug: "digital-marketing",
        description: "Comprehensive digital marketing strategies",
        content: "Grow your business with our data-driven digital marketing strategies and campaigns.",
        image: "/placeholder.svg?height=400&width=600",
        featured: false,
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    await db.collection("services").insertMany(services)
    console.log(`   ✅ Added ${services.length} services`)

    // Seed Team Members
    console.log("👥 Seeding team members...")
    const team = [
      {
        name: "John Doe",
        position: "CEO & Founder",
        bio: "Visionary leader with 10+ years of experience in tech industry",
        image: "/placeholder.svg?height=300&width=300",
        email: "john@connected.com",
        linkedin: "https://linkedin.com/in/johndoe",
        twitter: "https://twitter.com/johndoe",
        featured: true,
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Jane Smith",
        position: "CTO",
        bio: "Technical expert specializing in scalable web applications",
        image: "/placeholder.svg?height=300&width=300",
        email: "jane@connected.com",
        linkedin: "https://linkedin.com/in/janesmith",
        featured: true,
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    await db.collection("team").insertMany(team)
    console.log(`   ✅ Added ${team.length} team members`)

    // Seed Jobs
    console.log("💼 Seeding job listings...")
    const jobs = [
      {
        title: "Senior Full Stack Developer",
        slug: "senior-full-stack-developer",
        department: "Engineering",
        location: "Remote",
        type: "Full-time",
        description: "We're looking for a senior full stack developer to join our growing team.",
        requirements: [
          "5+ years of experience with React and Node.js",
          "Experience with MongoDB and PostgreSQL",
          "Strong problem-solving skills",
          "Excellent communication skills",
        ],
        responsibilities: [
          "Develop and maintain web applications",
          "Collaborate with design and product teams",
          "Write clean, maintainable code",
          "Mentor junior developers",
        ],
        benefits: [
          "Competitive salary",
          "Health insurance",
          "Remote work flexibility",
          "Professional development budget",
        ],
        salary: "$80,000 - $120,000",
        published: true,
        featured: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "UI/UX Designer",
        slug: "ui-ux-designer",
        department: "Design",
        location: "New York, NY",
        type: "Full-time",
        description: "Join our design team to create beautiful and intuitive user experiences.",
        requirements: [
          "3+ years of UI/UX design experience",
          "Proficiency in Figma and Adobe Creative Suite",
          "Strong portfolio demonstrating design skills",
          "Understanding of user-centered design principles",
        ],
        responsibilities: [
          "Design user interfaces for web and mobile applications",
          "Conduct user research and usability testing",
          "Create wireframes, prototypes, and design systems",
          "Collaborate with developers and product managers",
        ],
        benefits: ["Competitive salary", "Health insurance", "Creative workspace", "Design conference budget"],
        salary: "$60,000 - $90,000",
        published: true,
        featured: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    await db.collection("jobs").insertMany(jobs)
    console.log(`   ✅ Added ${jobs.length} job listings`)

    // Seed Blog Posts
    console.log("📝 Seeding blog posts...")
    const blogPosts = [
      {
        title: "The Future of Web Development",
        slug: "future-of-web-development",
        excerpt: "Exploring the latest trends and technologies shaping the future of web development.",
        content: `
# The Future of Web Development

Web development is constantly evolving, with new technologies and frameworks emerging regularly. In this post, we'll explore some of the key trends that are shaping the future of web development.

## Key Trends

### 1. AI Integration
Artificial intelligence is becoming increasingly integrated into web applications, from chatbots to personalized user experiences.

### 2. Progressive Web Apps
PWAs continue to bridge the gap between web and mobile applications, offering native-like experiences in the browser.

### 3. Serverless Architecture
Serverless computing is changing how we think about backend infrastructure and deployment.

## Conclusion

The future of web development is exciting, with new possibilities emerging every day. Stay tuned for more insights!
        `,
        author: "John Doe",
        image: "/placeholder.svg?height=400&width=800",
        tags: ["web development", "technology", "future"],
        published: true,
        featured: true,
        publishedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Building Scalable Applications",
        slug: "building-scalable-applications",
        excerpt: "Best practices for building applications that can grow with your business.",
        content: `
# Building Scalable Applications

Scalability is crucial for any successful application. Here are some best practices to ensure your application can handle growth.

## Architecture Principles

### 1. Microservices
Breaking down your application into smaller, manageable services.

### 2. Database Optimization
Proper indexing and query optimization techniques.

### 3. Caching Strategies
Implementing effective caching at multiple levels.

## Conclusion

Building scalable applications requires careful planning and the right architectural decisions from the start.
        `,
        author: "Jane Smith",
        image: "/placeholder.svg?height=400&width=800",
        tags: ["scalability", "architecture", "best practices"],
        published: true,
        featured: false,
        publishedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    await db.collection("blog").insertMany(blogPosts)
    console.log(`   ✅ Added ${blogPosts.length} blog posts`)

    // Seed Ventures
    console.log("🚀 Seeding ventures...")
    const ventures = [
      {
        title: "TechStart",
        slug: "techstart",
        description: "A revolutionary startup accelerator platform",
        content:
          "TechStart is our flagship venture that helps early-stage startups accelerate their growth through mentorship, funding, and resources.",
        image: "/placeholder.svg?height=400&width=600",
        status: "active",
        category: "Technology",
        website: "https://techstart.example.com",
        featured: true,
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    await db.collection("ventures").insertMany(ventures)
    console.log(`   ✅ Added ${ventures.length} ventures`)

    // Create site content
    console.log("🏠 Creating site content...")
    const siteContent = {
      hero: {
        title: "We Are Connected",
        subtitle: "Building the future through innovation and collaboration",
        description:
          "We connect ideas, people, and technology to create meaningful solutions that drive progress and positive change.",
        ctaText: "Get Started",
        ctaLink: "/contact",
      },
      about: {
        title: "About Us",
        description:
          "We are a team of passionate innovators, developers, and creators who believe in the power of connection and collaboration.",
        mission:
          "To bridge the gap between ideas and reality through cutting-edge technology and human-centered design.",
        vision: "A world where technology serves humanity and creates opportunities for everyone to thrive.",
      },
      contact: {
        email: "hello@connected.com",
        phone: "+1 (555) 123-4567",
        address: "123 Innovation Street, Tech City, TC 12345",
        socialMedia: {
          twitter: "https://twitter.com/weareconnected",
          linkedin: "https://linkedin.com/company/weareconnected",
          github: "https://github.com/weareconnected",
        },
      },
      updatedAt: new Date(),
    }

    await db.collection("site_content").insertOne(siteContent)
    console.log("   ✅ Added site content")

    console.log("\n🎉 Database seeded successfully!")
    console.log("📊 Summary:")
    console.log(`   - ${services.length} services`)
    console.log(`   - ${team.length} team members`)
    console.log(`   - ${jobs.length} job listings`)
    console.log(`   - ${blogPosts.length} blog posts`)
    console.log(`   - ${ventures.length} ventures`)
    console.log("   - Site content")
  } catch (error) {
    console.error("❌ Error seeding database:", error.message)
  } finally {
    await client.close()
    console.log("\n🔌 MongoDB connection closed")
  }
}

// Run the function
seedDatabase().catch(console.error)
