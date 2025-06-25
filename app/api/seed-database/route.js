import { connectToDatabase } from "@/app/lib/mongodb"
import { NextResponse } from "next/server"
// import { connectToDatabase } from "@/lib/mongodb"

// Sample data for seeding
const ventures = [
  {
    slug: "techflow",
    name: "TechFlow",
    tagline: "Workflow automation reimagined",
    description:
      "A comprehensive SaaS platform that revolutionizes how teams manage workflows and automate repetitive tasks.",
    fullDescription:
      "TechFlow was born from the frustration of managing complex workflows across multiple tools. Our platform provides a unified solution that integrates with your existing tools while offering powerful automation capabilities. With an intuitive drag-and-drop interface and advanced analytics, teams can streamline their processes and focus on what matters most.",
    category: "SaaS",
    status: "Active",
    founded: "2022",
    team: "12 people",
    growth: "+150% YoY",
    image: "/placeholder.svg?height=600&width=1200&text=TechFlow+Dashboard",
    logo: "/placeholder.svg?height=120&width=120&text=TF",
    website: "https://techflow.com",
    metrics: [
      { label: "Active Users", value: "10,000+", icon: "Users" },
      { label: "Projects Managed", value: "50,000+", icon: "Target" },
      { label: "Time Saved", value: "2M+ hours", icon: "Zap" },
      { label: "Customer Satisfaction", value: "4.8/5", icon: "Award" },
    ],
    technologies: ["React", "Node.js", "PostgreSQL", "AWS", "Docker", "Redis", "TypeScript", "GraphQL"],
    features: [
      "Drag-and-drop workflow builder",
      "Real-time collaboration",
      "Advanced analytics and reporting",
      "Integration with 100+ tools",
      "Custom automation rules",
      "Mobile app for iOS and Android",
    ],
    achievements: [
      "Featured in TechCrunch as 'Startup to Watch'",
      "Winner of SaaS Innovation Award 2023",
      "Reached 10,000 active users in 18 months",
      "Secured $2M in Series A funding",
    ],
    testimonials: [
      {
        quote:
          "TechFlow has transformed how our team works. We've reduced manual work by 70% and improved our delivery time significantly.",
        author: "Sarah Johnson",
        role: "Product Manager",
        company: "InnovateCorp",
        image: "/placeholder.svg?height=60&width=60&text=SJ",
      },
      {
        quote:
          "The automation capabilities are incredible. What used to take hours now happens automatically in minutes.",
        author: "Michael Chen",
        role: "Operations Director",
        company: "ScaleUp Inc",
        image: "/placeholder.svg?height=60&width=60&text=MC",
      },
    ],
  },
  {
    slug: "designhub",
    name: "DesignHub",
    tagline: "Creative solutions for modern brands",
    description:
      "A full-service design agency specializing in brand identity, digital experiences, and creative campaigns.",
    fullDescription:
      "DesignHub combines strategic thinking with creative excellence to help brands stand out in today's competitive landscape. Our team of designers, strategists, and developers work collaboratively to create cohesive brand experiences that resonate with audiences and drive business results.",
    category: "Agency",
    status: "Active",
    founded: "2021",
    team: "8 people",
    growth: "+85% YoY",
    image: "/placeholder.svg?height=600&width=1200&text=DesignHub+Portfolio",
    logo: "/placeholder.svg?height=120&width=120&text=DH",
    website: "https://designhub.com",
    metrics: [
      { label: "Happy Clients", value: "200+", icon: "Users" },
      { label: "Projects Completed", value: "500+", icon: "Target" },
      { label: "Awards Won", value: "15", icon: "Award" },
      { label: "Client Satisfaction", value: "4.9/5", icon: "Zap" },
    ],
    technologies: ["Figma", "Adobe Creative Suite", "Webflow", "Framer", "Sketch", "Principle", "After Effects"],
    features: [
      "Brand identity design",
      "Website and app design",
      "Marketing campaigns",
      "Packaging design",
      "Motion graphics",
      "Design system creation",
    ],
    achievements: [
      "Awwwards Site of the Day (3 times)",
      "Dribbble Team of the Year 2023",
      "Featured in Design Week Magazine",
      "Helped 50+ startups establish their brand identity",
    ],
    testimonials: [
      {
        quote:
          "DesignHub created a brand identity that perfectly captures our vision. The attention to detail is exceptional.",
        author: "Emily Rodriguez",
        role: "CEO",
        company: "GreenTech Solutions",
        image: "/placeholder.svg?height=60&width=60&text=ER",
      },
    ],
  },
]

const blogPosts = [
  {
    title: "The Future of Web Development: Trends to Watch in 2024",
    slug: "future-web-development-2024",
    excerpt: "Explore the latest trends shaping the future of web development, from AI integration to new frameworks.",
    content:
      "Web development is evolving rapidly, with new technologies and methodologies emerging every year. In 2024, we're seeing several key trends that are reshaping how developers build for the web. From AI-powered development tools to the rise of new frameworks and the continued evolution of serverless architecture, the landscape is changing faster than ever. This article explores the most significant trends and how they're impacting the industry.",
    author: {
      name: "Sarah Johnson",
      role: "Lead Developer",
      image: "/placeholder.svg?height=40&width=40",
    },
    publishedAt: new Date("2024-01-15"),
    readTime: "5 min read",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["Web Development", "Technology", "Trends"],
    category: "Technology",
  },
  {
    title: "Building Scalable Mobile Apps: Best Practices",
    slug: "scalable-mobile-apps-best-practices",
    excerpt: "Learn the essential practices for building mobile applications that can scale with your business growth.",
    content:
      "Building scalable mobile applications requires careful planning and implementation of best practices. From architecture decisions to code organization and performance optimization, every choice impacts how well your app can grow with your user base. This comprehensive guide covers the essential practices that ensure your mobile app can handle increasing loads without compromising performance or user experience.",
    author: {
      name: "Mike Chen",
      role: "Mobile Developer",
      image: "/placeholder.svg?height=40&width=40",
    },
    publishedAt: new Date("2024-01-10"),
    readTime: "7 min read",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["Mobile Development", "Scalability", "Best Practices"],
    category: "Development",
  },
]

const services = [
  {
    slug: "web-development",
    title: "Web Development",
    description: "Custom web applications built with modern technologies",
    longDescription:
      "We create powerful, scalable web applications using cutting-edge technologies like React, Next.js, and Node.js. Our team delivers responsive, user-friendly websites that drive business growth.",
    features: [
      "Responsive Design",
      "Modern Framework Integration",
      "SEO Optimization",
      "Performance Optimization",
      "Cross-browser Compatibility",
      "API Integration",
      "Content Management Systems",
      "E-commerce Solutions",
      "Progressive Web Apps",
      "Database Design",
      "Security Implementation",
      "Testing & Quality Assurance",
    ],
    benefits: [
      "Increased Online Presence",
      "Better User Experience",
      "Higher Conversion Rates",
      "Improved Search Rankings",
    ],
    process: [
      { step: "Discovery", description: "Understanding your requirements and goals" },
      { step: "Design", description: "Creating wireframes and visual designs" },
      { step: "Development", description: "Building your application with best practices" },
      { step: "Launch", description: "Deploying and monitoring your website" },
    ],
    pricing: [
      {
        plan: "Starter",
        price: "$2,999",
        features: ["5 Pages", "Responsive Design", "Basic SEO", "3 Months Support"],
      },
      {
        plan: "Professional",
        price: "$5,999",
        features: ["10 Pages", "Custom Design", "Advanced SEO", "CMS Integration", "6 Months Support"],
      },
      {
        plan: "Enterprise",
        price: "$12,999",
        features: ["Unlimited Pages", "Custom Features", "E-commerce", "API Integration", "12 Months Support"],
      },
    ],
    testimonials: [
      {
        name: "Sarah Johnson",
        role: "CEO",
        company: "TechStart Inc",
        content:
          "Connected delivered an amazing website that exceeded our expectations. The team was professional and responsive throughout the project.",
        rating: 5,
      },
      {
        name: "Mike Chen",
        role: "Marketing Director",
        company: "GrowthCorp",
        content:
          "Our new website has significantly improved our online presence and lead generation. Highly recommended!",
        rating: 5,
      },
    ],
    caseStudies: [
      {
        title: "E-commerce Platform for Fashion Brand",
        description: "Built a complete e-commerce solution with inventory management and payment processing.",
        image: "/ecommerce-fashion-website.png",
        results: [
          "300% increase in online sales",
          "50% reduction in cart abandonment",
          "Mobile-first responsive design",
        ],
      },
      {
        title: "SaaS Dashboard for Analytics Company",
        description: "Developed a comprehensive dashboard with real-time data visualization and reporting.",
        image: "/placeholder-xftac.png",
        results: ["Real-time data processing", "Interactive charts and graphs", "User role management"],
      },
    ],
    technologies: ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL", "AWS", "Vercel", "Tailwind CSS"],
    timeline: "4-8 weeks",
    teamSize: "3-5 developers",
    image: "/placeholder.svg?height=400&width=600&text=Web+Development",
  },
  {
    slug: "mobile-app-development",
    title: "Mobile App Development",
    description: "Native and cross-platform mobile applications",
    longDescription:
      "We develop high-performance mobile applications for iOS and Android platforms using React Native, Flutter, and native technologies. Our apps are designed for optimal user experience and performance.",
    features: [
      "Cross-platform Development",
      "Native Performance",
      "Push Notifications",
      "Offline Functionality",
      "App Store Optimization",
      "In-app Purchases",
      "Social Media Integration",
      "Analytics Integration",
      "Cloud Synchronization",
      "Biometric Authentication",
      "Real-time Features",
      "Custom UI/UX Design",
    ],
    benefits: ["Reach Mobile Users", "Increase Engagement", "Generate Revenue", "Build Brand Loyalty"],
    process: [
      { step: "Strategy", description: "Defining app concept and user journey" },
      { step: "Design", description: "Creating intuitive mobile interfaces" },
      { step: "Development", description: "Building native or cross-platform apps" },
      { step: "Testing", description: "Quality assurance and app store submission" },
    ],
    pricing: [
      {
        plan: "Basic App",
        price: "$8,999",
        features: ["Single Platform", "Basic Features", "App Store Submission", "3 Months Support"],
      },
      {
        plan: "Cross-Platform",
        price: "$15,999",
        features: ["iOS & Android", "Advanced Features", "Push Notifications", "6 Months Support"],
      },
      {
        plan: "Enterprise App",
        price: "$25,999",
        features: ["Custom Features", "Backend Integration", "Analytics", "Ongoing Maintenance"],
      },
    ],
    testimonials: [
      {
        name: "David Wilson",
        role: "Founder",
        company: "FitTrack",
        content: "Our fitness app has gained over 100k downloads thanks to Connected's excellent development work.",
        rating: 5,
      },
    ],
    caseStudies: [
      {
        title: "Fitness Tracking App",
        description: "Comprehensive fitness app with workout tracking, nutrition logging, and social features.",
        image: "/fitness-tracking-app.png",
        results: ["100k+ downloads", "4.8 app store rating", "Featured in App Store"],
      },
    ],
    technologies: ["React Native", "Flutter", "Swift", "Kotlin", "Firebase", "AWS Amplify"],
    timeline: "8-16 weeks",
    teamSize: "4-6 developers",
    image: "/placeholder.svg?height=400&width=600&text=Mobile+App+Development",
  },
]

export async function GET() {
  try {
    const { db } = await connectToDatabase()

    // Seed ventures collection
    const venturesCount = await db.collection("ventures").countDocuments()
    if (venturesCount === 0) {
      await db.collection("ventures").insertMany(ventures)
      console.log(`${ventures.length} ventures inserted`)
    }

    // Seed blog posts collection
    const blogPostsCount = await db.collection("blog_posts").countDocuments()
    if (blogPostsCount === 0) {
      await db.collection("blog_posts").insertMany(blogPosts)
      console.log(`${blogPosts.length} blog posts inserted`)
    }

    // Seed services collection
    const servicesCount = await db.collection("services").countDocuments()
    if (servicesCount === 0) {
      await db.collection("services").insertMany(services)
      console.log(`${services.length} services inserted`)
    }

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      counts: {
        ventures: await db.collection("ventures").countDocuments(),
        blogPosts: await db.collection("blog_posts").countDocuments(),
        services: await db.collection("services").countDocuments(),
      },
    })
  } catch (error) {
    console.error("Error seeding database:", error)
    return NextResponse.json(
      { success: false, message: "Error seeding database", error: error.message },
      { status: 500 },
    )
  }
}
