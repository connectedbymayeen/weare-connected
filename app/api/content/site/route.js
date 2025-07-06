import { connectToDatabase } from "@/app/lib/mongodb"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const { db } = await connectToDatabase()

    // Get content from database
    const contentDoc = await db.collection("site_content").findOne({ type: "pages" })

    // Default content structure
    const defaultContent = {
      homepage: {
        hero: {
          title: "THE FUTURE IS CONNECTED",
          subtitle:
            "We don't just build products. We architect digital ecosystems that transform industries and connect the world.",
          stats: [
            { value: "5+", label: "Ventures Built" },
            { value: "$20M+", label: "Value Created" },
            { value: "15", label: "Countries" },
          ],
        },
        about: {
          title: "Who We Are",
          description:
            "Connected began with a vision to nurture and scale innovative ideas into leading market solutions.",
          vision:
            "Our vision is to become the world's leading launchpad for next-generation ventures. We aim to create a global ecosystem where bold ideas grow into influential brands that define the future of technology, culture, and commerce.",
          mission:
            "Connected's mission is to build ventures that shape the future. We turn ideas into impactful businesses across tech, digital, media, and lifestyle. Our goal is to empower creators, disrupt industries, and deliver innovation with purpose and precision.",
          values: [
            {
              number: "01",
              title: "Innovation",
              description:
                "We push boundaries and challenge the status quo to create cutting-edge solutions that transform industries.",
            },
            {
              number: "02",
              title: "Collaboration",
              description:
                "We believe in the power of community and partnerships to achieve extraordinary results and sustainable growth.",
            },
            {
              number: "03",
              title: "Impact",
              description:
                "We're committed to creating meaningful change and lasting value that drives transformative growth across markets.",
            },
          ],
        },
        ventures: {
          title: "Building the Future",
          subtitle:
            "Discover the innovative ventures we're building across various industries, each designed to solve real-world problems and create lasting impact.",
        },
        services: {
          title: "Building the Connection",
          subtitle: "We offer a comprehensive range of services to help businesses innovate, grow, and transform.",
        },
        contact: {
          title: "Get in Touch",
          description:
            "Whether you have a specific project in mind or just want to explore possibilities, we're here to help. Our team of experts is ready to discuss your vision and provide tailored solutions.",
          office: {
            address: "1234 Innovation Drive, Suite 500",
            city: "San Francisco, CA 94107",
            country: "United States",
          },
          emails: {
            general: "hello@connected.com",
            business: "business@connected.com",
            careers: "careers@connected.com",
          },
          phone: "+1 (415) 555-0164",
          hours: "Mon-Fri: 9:00 AM - 6:00 PM (PST)",
        },
      },
      about: {
        hero: {
          title: "About Connected",
          subtitle: "Building the future through innovation and collaboration",
        },
        story: {
          title: "Our Story",
          content:
            "Founded with a vision to transform how businesses operate in the digital age, Connected has grown from a small team of passionate innovators to a global network of creators, builders, and visionaries. Our journey began with a simple belief: that the most impactful solutions come from connecting diverse perspectives, cutting-edge technology, and human-centered design.",
        },
        team: {
          title: "Meet Our Team",
          subtitle: "The brilliant minds behind our success",
        },
      },
      contact: {
        hero: {
          title: "Contact Us",
          subtitle: "Let's start a conversation about your next big idea",
        },
      },
    }

    return NextResponse.json(contentDoc?.content || defaultContent)
  } catch (error) {
    console.error("Error fetching site content:", error)
    return NextResponse.json(
      {
        homepage: {
          hero: {
            title: "THE FUTURE IS CONNECTED",
            subtitle:
              "We don't just build products. We architect digital ecosystems that transform industries and connect the world.",
            stats: [
              { value: "5+", label: "Ventures Built" },
              { value: "$20M+", label: "Value Created" },
              { value: "15", label: "Countries" },
            ],
          },
          about: {
            title: "Who We Are",
            description:
              "Connected began with a vision to nurture and scale innovative ideas into leading market solutions.",
            vision: "Our vision is to become the world's leading launchpad for next-generation ventures. We aim to create a global ecosystem where bold ideas grow into influential brands that define the future of technology, culture, and commerce.",
            mission: "Connected's mission is to build ventures that shape the future. We turn ideas into impactful businesses across tech, digital, media, and lifestyle. Our goal is to empower creators, disrupt industries, and deliver innovation with purpose and precision.",
            values: [
              {
                number: "01",
                title: "Innovation",
                description: "We push boundaries and challenge the status quo.",
              },
              {
                number: "02",
                title: "Collaboration",
                description: "We believe in the power of community and partnerships.",
              },
              {
                number: "03",
                title: "Impact",
                description: "We're committed to creating meaningful change.",
              },
            ],
          },
        },
        about: {
          hero: {
            title: "About Connected",
            subtitle: "Building the future through innovation and collaboration",
          },
          story: {
            title: "Our Story",
            content: "Founded with a vision to transform how businesses operate in the digital age...",
          },
          team: {
            title: "Meet Our Team",
            subtitle: "The brilliant minds behind our success",
          },
        },
        contact: {
          hero: {
            title: "Contact Us",
            subtitle: "Let's start a conversation about your next big idea",
          },
        },
      },
      { status: 200 },
    )
  }
}
