import Footer from "@/app/components/footer"
import Header from "@/app/components/header"
import { getVentureBySlug, getVentures } from "@/app/lib/data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Award,
  Calendar,
  ExternalLink,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

export async function generateStaticParams() {
  const ventures = await getVentures()
  return ventures
    .filter((venture) => venture.slug)
    .map((venture) => ({
      slug: venture.slug,
    }))
}

export async function generateMetadata({ params }) {
  const { slug } = params
  const venture = await getVentureBySlug(slug)

  if (!venture) {
    return {
      title: "Venture Not Found",
    }
  }

  return {
    title: `${venture.name} - ${venture.tagline || venture.shortDescription} | Connected`,
    description: venture.description,
  }
}

export default async function VentureDetailPage({ params }) {
  const { slug } = params
  const venture = await getVentureBySlug(slug)

  if (!venture) {
    notFound()
  }

  const getMetricIcon = (metric) => {
    const label = metric.label.toLowerCase()

    if (
      label.includes("user") ||
      label.includes("client") ||
      label.includes("people") ||
      label.includes("team")
    ) {
      return Users
    } else if (
      label.includes("product") ||
      label.includes("project") ||
      label.includes("service")
    ) {
      return Target
    } else if (
      label.includes("co2") ||
      label.includes("energy") ||
      label.includes("speed") ||
      label.includes("performance")
    ) {
      return Zap
    } else if (
      label.includes("award") ||
      label.includes("partner") ||
      label.includes("brand") ||
      label.includes("achievement")
    ) {
      return Award
    } else if (
      label.includes("growth") ||
      label.includes("revenue") ||
      label.includes("profit")
    ) {
      return TrendingUp
    } else if (
      label.includes("year") ||
      label.includes("time") ||
      label.includes("date")
    ) {
      return Calendar
    } else {
      return Target
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
        {/* Hero Section */}
        <section className="py-12">
          <div className="container px-4 md:px-16 mx-auto max-w-7xl">
            <div className="mb-8">
              <Button variant="ghost" asChild className="text-gray-600 hover:text-gray-900">
                <Link href="/ventures">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Ventures
                </Link>
              </Button>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Content */}
              <div className="space-y-6">
                <div className="flex gap-3">
                  <Badge className="bg-[#6529b2] hover:bg-purple-700 text-white px-3 py-1 rounded-full">
                    {venture.status || "Active"}
                  </Badge>
                  <Badge variant="outline" className="px-3 py-1 rounded-full border-gray-300">
                    {venture.industry || venture.category || "Agency"}
                  </Badge>
                </div>

                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
                    {venture.name}
                  </h1>
                  <p className="text-xl text-gray-600 mb-4">
                    {venture.tagline || venture.shortDescription}
                  </p>
                </div>

                <p className="text-gray-600 leading-relaxed text-base">
                  {venture.fullDescription || venture.description}
                </p>

                <div className="flex flex-wrap gap-6 text-gray-600 text-sm">
                  {venture.foundedYear && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Founded {venture.foundedYear}</span>
                    </div>
                  )}
                  {venture.teamSize && (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{venture.teamSize} people</span>
                    </div>
                  )}
                  {venture.growth && (
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      <span>{venture.growth}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-4 pt-2">
                  {venture.website && (
                    <Button className="bg-[#6529b2] hover:bg-purple-700 rounded-lg" asChild>
                      <a href={venture.website} target="_blank" rel="noopener noreferrer">
                        Visit Website <ExternalLink className="h-4 w-4 ml-2" />
                      </a>
                    </Button>
                  )}
                  <Button variant="outline" className="rounded-lg" asChild>
                    <Link href="/contact">Get in Touch</Link>
                  </Button>
                </div>
              </div>

              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 shadow-lg">
                {venture.featuredImage?.url || venture.image ? (
                  <Image
                    src={venture.featuredImage?.url || venture.image}
                    alt={venture.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-[#6529b2] text-white">
          <div className="container px-4 md:px-6 mx-auto text-center max-w-7xl">
            <h2 className="text-3xl font-bold mb-4">Interested in {venture.name}?</h2>
            {venture.ctaDescription && (
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                {venture.ctaDescription}
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg" className="rounded-lg" asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
              {venture.website && (
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="border-white text-[#6529b2] hover:bg-white hover:text-[#241637] rounded-lg"
                >
                  <a href={venture.website} target="_blank" rel="noopener noreferrer">
                    Visit {venture.name}
                  </a>
                </Button>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
