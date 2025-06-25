"use client"
import { useState, useEffect } from "react"
import HeroSection from "./components/hero-section"
import AboutSection from "./components/about-section"
import VenturesSection from "./components/ventures-section"
import InnovationEcosystemSection from "./components/innovation-ecosystem-section"
import ContactSection from "./components/contact-section"
import Footer from "./components/footer"
import Header from "./components/header"

export default function Home() {
  const [data, setData] = useState({
    heroData: {
      title: "Building the Future of Technology",
      subtitle: "We create, invest in, and scale innovative ventures that solve meaningful problems.",
      stats: [
        { value: "50+", label: "Ventures Launched" },
        { value: "$100M+", label: "Capital Raised" },
        { value: "500+", label: "Jobs Created" },
        { value: "12", label: "Countries" },
      ],
    },
    aboutData: {
      title: "About Connected",
      description:
        "Connected is a venture studio that builds, invests in, and scales technology companies. We combine capital, talent, and expertise to create ventures that solve meaningful problems and generate exceptional returns.",
      metrics: [
        { value: "2018", label: "Founded" },
        { value: "85+", label: "Team Members" },
        { value: "3", label: "Global Offices" },
      ],
    },
    featuredVentures: [],
    services: [],
    caseStudies: [],
  })
  const [siteContent, setSiteContent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch homepage data
        const homepageResponse = await fetch("/api/homepage")
        if (homepageResponse.ok) {
          const homepageData = await homepageResponse.json()
          setData(homepageData)
        }

        // Fetch site content
        const contentResponse = await fetch("/api/content/site")
        if (contentResponse.ok) {
          const contentData = await contentResponse.json()
          setSiteContent(contentData)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <main className="relative">
      {/* sticky header  */}
      <Header />
      <HeroSection content={siteContent?.homepage} />
      <AboutSection content={siteContent?.homepage} />
      <VenturesSection ventures={data.featuredVentures} />
      <InnovationEcosystemSection caseStudies={data.caseStudies} />
      <ContactSection content={siteContent?.homepage} />
      <Footer />
    </main>
  )
}
