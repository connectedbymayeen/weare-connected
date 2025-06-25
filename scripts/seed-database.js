// This script seeds the database with initial data
require("dotenv").config() // Load environment variables from .env file
const { MongoClient } = require("mongodb")

// Connection URL and Database Name from environment variables
const url = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB

if (!url) {
  console.error("MONGODB_URI environment variable is not set")
  process.exit(1)
}

if (!dbName) {
  console.error("MONGODB_DB environment variable is not set")
  process.exit(1)
}

console.log(`Using MongoDB URI: ${url.replace(/\/\/([^:]+):([^@]+)@/, "//***:***@")}`)
console.log(`Using database: ${dbName}`)

async function seedDatabase() {
  let client

  try {
    console.log("Connecting to MongoDB...")

    // Connect to MongoDB
    client = await MongoClient.connect(url)
    console.log("Connected to MongoDB successfully")

    const db = client.db(dbName)

    // Seed ventures collection
    await seedVentures(db)

    // Seed blog posts collection
    await seedBlogPosts(db)

    // Seed services collection
    await seedServices(db)

    // Seed case studies collection
    await seedCaseStudies(db)

    // Seed jobs collection
    await seedJobs(db)

    // Seed press releases collection
    await seedPressReleases(db)

    // Seed media assets collection
    await seedMediaAssets(db)

    // Seed team members collection
    await seedTeamMembers(db)

    console.log("Database seeded successfully")
  } catch (error) {
    console.error("Error seeding database:", error)
  } finally {
    if (client) {
      await client.close()
      console.log("MongoDB connection closed")
    }
  }
}

async function seedVentures(db) {
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
    // Add more ventures as needed
  ]

  // Check if collection exists and has data
  const count = await db.collection("ventures").countDocuments()
  if (count === 0) {
    await db.collection("ventures").insertMany(ventures)
    console.log(`${ventures.length} ventures inserted`)
  } else {
    console.log("Ventures collection already has data, skipping seed")
  }
}

// The rest of the seed functions remain the same
async function seedBlogPosts(db) {
  // Same implementation as before
  const blogPosts = [
    {
      title: "The Future of Web Development: Trends to Watch in 2024",
      slug: "future-web-development-2024",
      excerpt:
        "Explore the latest trends shaping the future of web development, from AI integration to new frameworks.",
      content:
        "Web development is evolving rapidly, with new technologies and methodologies emerging every year. In 2024, we're seeing several key trends that are reshaping how developers build for the web. From AI-powered development tools to the rise of new frameworks and the continued evolution of serverless architecture, the landscape is changing faster than ever. This article explores the most significant trends and how they're impacting the industry.",
      author: {
        name: "Sarah Johnson",
        role: "Lead Developer",
        image: "/placeholder.svg?height=40&width=40",
      },
      publishedAt: "2024-01-15",
      readTime: "5 min read",
      image: "/placeholder.svg?height=400&width=600",
      tags: ["Web Development", "Technology", "Trends"],
      category: "Technology",
    },
    {
      title: "Building Scalable Mobile Apps: Best Practices",
      slug: "scalable-mobile-apps-best-practices",
      excerpt:
        "Learn the essential practices for building mobile applications that can scale with your business growth.",
      content:
        "Building scalable mobile applications requires careful planning and implementation of best practices. From architecture decisions to code organization and performance optimization, every choice impacts how well your app can grow with your user base. This comprehensive guide covers the essential practices that ensure your mobile app can handle increasing loads without compromising performance or user experience.",
      author: {
        name: "Mike Chen",
        role: "Mobile Developer",
        image: "/placeholder.svg?height=40&width=40",
      },
      publishedAt: "2024-01-10",
      readTime: "7 min read",
      image: "/placeholder.svg?height=400&width=600",
      tags: ["Mobile Development", "Scalability", "Best Practices"],
      category: "Development",
    },
    // Add more blog posts as needed
  ]

  // Check if collection exists and has data
  const count = await db.collection("blog_posts").countDocuments()
  if (count === 0) {
    await db.collection("blog_posts").insertMany(blogPosts)
    console.log(`${blogPosts.length} blog posts inserted`)
  } else {
    console.log("Blog posts collection already has data, skipping seed")
  }
}

async function seedServices(db) {
  // Same implementation as before
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
    },
    // Add more services as needed
  ]

  // Check if collection exists and has data
  const count = await db.collection("services").countDocuments()
  if (count === 0) {
    await db.collection("services").insertMany(services)
    console.log(`${services.length} services inserted`)
  } else {
    console.log("Services collection already has data, skipping seed")
  }
}

async function seedCaseStudies(db) {
  // Same implementation as before
  const caseStudies = [
    {
      slug: "fintech-startup",
      title: "FinTech Startup Scales to $50M Valuation",
      client: "PayFlow Technologies",
      industry: "Financial Technology",
      duration: "18 months",
      investment: "$2.5M",
      results: {
        revenue: "400% increase",
        users: "100K+ active users",
        valuation: "$50M Series A",
      },
      image: "/placeholder.svg?height=400&width=600&text=FinTech+Case+Study",
      description:
        "How we helped a payment processing startup scale from MVP to market leader through strategic investment and business development.",
      tags: ["FinTech", "Series A", "B2B SaaS"],
      challenge:
        "PayFlow Technologies had a promising MVP but struggled with technical scalability issues and lacked a clear go-to-market strategy. They needed to rapidly scale their infrastructure while simultaneously growing their customer base to secure Series A funding.",
      solution:
        "We provided technical expertise to rebuild their payment processing infrastructure using microservices architecture, implemented a comprehensive security framework, and developed a targeted sales strategy focusing on mid-market businesses. Our team also helped refine their pricing model and prepare for due diligence.",
      outcome:
        "Within 18 months, PayFlow Technologies achieved a 400% increase in revenue, grew to over 100,000 active users, and successfully secured a $50M Series A funding round. The company is now positioned as a market leader in B2B payment processing solutions.",
      testimonial: {
        quote:
          "Connected's strategic guidance and technical expertise were instrumental in our growth. They didn't just help us build a product; they helped us build a successful company.",
        author: "Alex Rivera",
        role: "CEO",
        company: "PayFlow Technologies",
      },
    },
    {
      slug: "ecommerce-platform",
      title: "E-commerce Platform Achieves Market Leadership",
      client: "ShopSmart Solutions",
      industry: "E-commerce",
      duration: "24 months",
      investment: "$5M",
      results: {
        revenue: "600% growth",
        users: "500K+ merchants",
        valuation: "$120M Series B",
      },
      image: "/placeholder.svg?height=400&width=600&text=E-commerce+Case+Study",
      description:
        "Transforming a small e-commerce tool into a comprehensive platform serving hundreds of thousands of merchants worldwide.",
      tags: ["E-commerce", "Series B", "Platform"],
      challenge:
        "ShopSmart Solutions had a basic e-commerce tool with limited functionality and struggled to differentiate in a crowded market. They needed to evolve into a comprehensive platform that could compete with industry leaders while maintaining their focus on small to medium-sized businesses.",
      solution:
        "We led a complete platform redesign, implementing advanced inventory management, multi-channel selling capabilities, and integrated analytics. Our team developed a plugin ecosystem to enable third-party developers to extend the platform's functionality and created a tiered pricing strategy to serve different merchant segments.",
      outcome:
        "Over 24 months, ShopSmart Solutions transformed into a market-leading e-commerce platform with 500,000+ merchants, achieved 600% revenue growth, and secured $120M in Series B funding at a valuation that positioned them as a major player in the e-commerce space.",
      testimonial: {
        quote:
          "Connected helped us transform from a simple tool into a comprehensive platform. Their strategic vision and execution capabilities exceeded our expectations at every turn.",
        author: "Jennifer Lee",
        role: "Founder & CEO",
        company: "ShopSmart Solutions",
      },
    },
    // Add more case studies as needed
  ]

  // Check if collection exists and has data
  const count = await db.collection("case_studies").countDocuments()
  if (count === 0) {
    await db.collection("case_studies").insertMany(caseStudies)
    console.log(`${caseStudies.length} case studies inserted`)
  } else {
    console.log("Case studies collection already has data, skipping seed")
  }
}

async function seedJobs(db) {
  // Same implementation as before
  const jobs = [
    {
      title: "Senior Full Stack Developer",
      department: "Engineering",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$120k - $180k",
      experience: "5+ years",
      postedAt: new Date("2024-01-15"),
      description:
        "We're looking for a Senior Full Stack Developer to join our growing engineering team. You'll be responsible for building and maintaining our core platform, working with modern technologies, and mentoring junior developers.",
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
      skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS", "Docker"],
    },
    {
      title: "Product Marketing Manager",
      department: "Marketing",
      location: "New York, NY",
      type: "Full-time",
      salary: "$90k - $130k",
      experience: "3-5 years",
      postedAt: new Date("2024-01-10"),
      description:
        "Join our marketing team as a Product Marketing Manager and help drive the go-to-market strategy for our innovative products. You'll work closely with product, sales, and marketing teams to position our solutions in the market.",
      responsibilities: [
        "Develop and execute go-to-market strategies for new product launches",
        "Create compelling product messaging and positioning",
        "Collaborate with sales team to develop sales enablement materials",
        "Conduct market research and competitive analysis",
        "Manage product marketing campaigns across multiple channels",
        "Analyze campaign performance and optimize for better results",
      ],
      requirements: [
        "3-5 years of product marketing experience, preferably in B2B SaaS",
        "Strong analytical skills and data-driven mindset",
        "Excellent written and verbal communication skills",
        "Experience with marketing automation tools (HubSpot, Marketo)",
        "Knowledge of digital marketing channels and tactics",
        "Bachelor's degree in Marketing, Business, or related field",
        "Ability to work in a fast-paced, collaborative environment",
      ],
      benefits: [
        "Competitive salary and performance bonuses",
        "Comprehensive health and wellness benefits",
        "Flexible work schedule and hybrid options",
        "Professional development opportunities",
        "Stock options and equity participation",
        "Modern office space in downtown NYC",
        "Catered lunches and team events",
      ],
      skills: ["Product Marketing", "B2B SaaS", "HubSpot", "Analytics", "Content Strategy", "Campaign Management"],
    },
    // Add more jobs as needed
  ]

  // Check if collection exists and has data
  const count = await db.collection("jobs").countDocuments()
  if (count === 0) {
    await db.collection("jobs").insertMany(jobs)
    console.log(`${jobs.length} jobs inserted`)
  } else {
    console.log("Jobs collection already has data, skipping seed")
  }
}

async function seedPressReleases(db) {
  // Same implementation as before
  const pressReleases = [
    {
      title: "Connected Announces $50M Series B Funding Round",
      slug: "connected-announces-50m-series-b",
      date: new Date("2024-06-01"),
      excerpt: "Funding will accelerate expansion into new markets and development of innovative venture studio model.",
      content:
        'Connected, a leading venture studio building the next generation of technology companies, today announced it has secured $50 million in Series B funding led by Accel Partners, with participation from existing investors Sequoia Capital and Andreessen Horowitz. The funding will be used to expand Connected\'s venture studio model into new markets and accelerate the development of its portfolio companies.\n\n"This funding marks a significant milestone in our journey to build transformative companies," said Sarah Johnson, CEO of Connected. "With this investment, we\'ll be able to support more entrepreneurs and launch more ventures that solve meaningful problems across industries."\n\nConnected has built a reputation for successfully launching and scaling ventures in fintech, healthtech, and enterprise software. The company\'s unique studio model combines capital, talent, and operational expertise to reduce the risk of early-stage company building.\n\nJohn Smith, Partner at Accel Partners, will join Connected\'s board of directors. "Connected has proven that their venture studio approach can consistently produce successful companies," said Smith. "We\'re excited to support their expansion and help bring more innovative solutions to market."',
      category: "Company News",
    },
    {
      title: "Connected Launches New Healthtech Venture: HealthHub",
      slug: "connected-launches-healthhub",
      date: new Date("2024-05-15"),
      excerpt: "New digital health platform aims to transform patient care coordination and telemedicine services.",
      content:
        'Connected today announced the launch of HealthHub, a comprehensive digital health platform designed to streamline care coordination and improve patient outcomes. The platform connects patients, healthcare providers, and caregivers through an intuitive interface that facilitates telemedicine visits, medication management, and health monitoring.\n\n"Healthcare remains fragmented and difficult to navigate for many patients," said Michael Chen, Managing Director of Connected\'s healthtech division. "HealthHub addresses these challenges by creating a unified platform that puts patients at the center of their care journey."\n\nHealthHub has already partnered with three major hospital systems and will begin rolling out its services in select markets next month. The platform features secure video consultations, digital prescription management, and integration with popular wearable devices for continuous health monitoring.\n\n"We\'ve designed HealthHub with both patients and providers in mind," said Dr. Emily Rodriguez, Chief Medical Officer at HealthHub. "Our goal is to make healthcare more accessible, efficient, and effective for everyone involved."\n\nHealthHub represents Connected\'s third venture in the healthtech space, following the successful launches of MedTrack and CareConnect in previous years.',
      category: "Product Launch",
    },
    // Add more press releases as needed
  ]

  // Check if collection exists and has data
  const count = await db.collection("press_releases").countDocuments()
  if (count === 0) {
    await db.collection("press_releases").insertMany(pressReleases)
    console.log(`${pressReleases.length} press releases inserted`)
  } else {
    console.log("Press releases collection already has data, skipping seed")
  }
}

async function seedMediaAssets(db) {
  // Same implementation as before
  const mediaAssets = [
    {
      title: "Connected Logo Package",
      description: "Official Connected logos in various formats and colors",
      items: [
        {
          name: "Connected Logo - Full Color",
          format: "PNG",
          dimensions: "2000x500px",
          url: "/placeholder.svg?height=500&width=2000&text=Connected+Logo",
        },
        {
          name: "Connected Logo - White",
          format: "PNG",
          dimensions: "2000x500px",
          url: "/placeholder.svg?height=500&width=2000&text=Connected+Logo+White",
        },
        {
          name: "Connected Icon - Full Color",
          format: "PNG",
          dimensions: "500x500px",
          url: "/placeholder.svg?height=500&width=500&text=Connected+Icon",
        },
        {
          name: "Connected Logo Package",
          format: "ZIP",
          size: "15MB",
          url: "#",
        },
      ],
      size: "15MB",
      type: "Logo",
    },
    {
      title: "Connected Executive Headshots",
      description: "Professional headshots of Connected's executive team",
      items: [
        {
          name: "Sarah Johnson - CEO",
          format: "JPG",
          dimensions: "2000x2000px",
          url: "/placeholder.svg?height=2000&width=2000&text=CEO+Headshot",
        },
        {
          name: "Michael Chen - CTO",
          format: "JPG",
          dimensions: "2000x2000px",
          url: "/placeholder.svg?height=2000&width=2000&text=CTO+Headshot",
        },
        {
          name: "Emily Rodriguez - COO",
          format: "JPG",
          dimensions: "2000x2000px",
          url: "/placeholder.svg?height=2000&width=2000&text=COO+Headshot",
        },
        {
          name: "Executive Headshots Package",
          format: "ZIP",
          size: "25MB",
          url: "#",
        },
      ],
      size: "25MB",
      type: "Images",
    },
    // Add more media assets as needed
  ]

  // Check if collection exists and has data
  const count = await db.collection("media_assets").countDocuments()
  if (count === 0) {
    await db.collection("media_assets").insertMany(mediaAssets)
    console.log(`${mediaAssets.length} media assets inserted`)
  } else {
    console.log("Media assets collection already has data, skipping seed")
  }
}

async function seedTeamMembers(db) {
  // Same implementation as before
  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "Chief Executive Officer",
      bio: "Sarah is a seasoned entrepreneur with over 15 years of experience building and scaling technology companies. Prior to founding Connected, she was the COO of TechVentures, where she led the company's expansion into international markets. Sarah holds an MBA from Stanford University and is passionate about creating companies that combine innovation with social impact.",
      image: "/placeholder.svg?height=300&width=300&text=Sarah+J",
      socialLinks: {
        linkedin: "https://linkedin.com/in/sarahjohnson",
        twitter: "https://twitter.com/sarahjohnson",
      },
      order: 1,
    },
    {
      name: "Michael Chen",
      role: "Chief Technology Officer",
      bio: "Michael leads Connected's technology strategy and oversees the development of our venture portfolio. With a background in computer science and 12 years of experience at companies like Google and Amazon, Michael brings deep technical expertise and a passion for building scalable systems. He holds a Ph.D. in Computer Science from MIT and has published numerous papers on distributed systems and machine learning.",
      image: "/placeholder.svg?height=300&width=300&text=Michael+C",
      socialLinks: {
        linkedin: "https://linkedin.com/in/michaelchen",
        github: "https://github.com/michaelchen",
      },
      order: 2,
    },
    {
      name: "Emily Rodriguez",
      role: "Chief Operating Officer",
      bio: "Emily oversees Connected's day-to-day operations and ensures that our ventures have the resources and support they need to succeed. Before joining Connected, she was the VP of Operations at ScaleUp Ventures, where she helped portfolio companies optimize their operations and achieve sustainable growth. Emily has an MBA from Harvard Business School and is committed to building diverse and inclusive teams.",
      image: "/placeholder.svg?height=300&width=300&text=Emily+R",
      socialLinks: {
        linkedin: "https://linkedin.com/in/emilyrodriguez",
      },
      order: 3,
    },
    {
      name: "David Kim",
      role: "Chief Financial Officer",
      bio: "David manages Connected's financial strategy and investment activities. With over 20 years of experience in finance, including roles at major investment banks and as CFO of multiple startups, David brings valuable expertise in fundraising, financial planning, and investor relations. He holds a degree in Finance from the Wharton School and is a Certified Public Accountant.",
      image: "/placeholder.svg?height=300&width=300&text=David+K",
      socialLinks: {
        linkedin: "https://linkedin.com/in/davidkim",
      },
      order: 4,
    },
    {
      name: "Jessica Martinez",
      role: "Head of Design",
      bio: "Jessica leads Connected's design practice, ensuring that all our ventures deliver exceptional user experiences. Before joining Connected, she was Design Director at a leading digital agency, where she worked with Fortune 500 clients across various industries. Jessica holds a degree in Interaction Design from RISD and is an advocate for human-centered design principles.",
      image: "/placeholder.svg?height=300&width=300&text=Jessica+M",
      socialLinks: {
        linkedin: "https://linkedin.com/in/jessicamartinez",
        dribbble: "https://dribbble.com/jessicamartinez",
      },
      order: 5,
    },
    // Add more team members as needed
  ]

  // Check if collection exists and has data
  const count = await db.collection("team_members").countDocuments()
  if (count === 0) {
    await db.collection("team_members").insertMany(teamMembers)
    console.log(`${teamMembers.length} team members inserted`)
  } else {
    console.log("Team members collection already has data, skipping seed")
  }
}

// Run the seed function
seedDatabase().catch(console.error)
