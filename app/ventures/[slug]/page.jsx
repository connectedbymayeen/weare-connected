import Footer from "@/app/components/footer"
import Header from "@/app/components/header"
import { getVentureBySlug, getVentures } from "@/app/lib/data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Award, Calendar, ExternalLink, Target, TrendingUp, Users, Zap } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

export async function generateStaticParams() {
  const ventures = await getVentures()
  return ventures.map((venture) => ({
    slug: venture.slug,
  }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
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
  const { slug } = await params
  const venture = await getVentureBySlug(slug)

  if (!venture) {
    notFound()
  }

  // Map icon components to metric icons with better logic
  const getMetricIcon = (metric) => {
    const label = metric.label.toLowerCase()

    if (label.includes("user") || label.includes("client") || label.includes("people") || label.includes("team")) {
      return Users
    } else if (label.includes("product") || label.includes("project") || label.includes("service")) {
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
    } else if (label.includes("growth") || label.includes("revenue") || label.includes("profit")) {
      return TrendingUp
    } else if (label.includes("year") || label.includes("time") || label.includes("date")) {
      return Calendar
    } else {
      return Target // default icon
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br=">
        {/* Hero Section */}
        <section className="py-12">
          <div className="container px-4 md:px-16 mx-auto max-w-7xl">
            {/* Back Button */}
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
                {/* Badges */}
                <div className="flex gap-3">
                  <Badge className="bg-[#6529b2] hover:bg-purple-700 text-white px-3 py-1 rounded-full">
                    {venture.status || "Active"}
                  </Badge>
                  <Badge variant="outline" className="px-3 py-1 rounded-full border-gray-300">
                    {venture.industry || venture.category || "Agency"}
                  </Badge>
                </div>

                {/* Title and Tagline */}
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">{venture.name}</h1>
                  <p className="text-xl text-gray-600 mb-4">{venture.tagline || venture.shortDescription}</p>
                </div>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed text-base">
                  {venture.fullDescription || venture.description}
                </p>

                {/* Meta Info */}
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

                {/* Buttons */}
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

              {/* Image */}
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

        {/* Key Metrics Section */}
        <section className="py-16 bg-white">
          <div className="container px-4 md:px-6 mx-auto max-w-7xl">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Key Metrics</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {venture.metrics && venture.metrics.length > 0 ? (
                venture.metrics.map((metric, index) => {
                  const IconComponent = getMetricIcon(metric)
                  return (
                    <div key={index} className="text-center">
                      <div className="mb-4">
                        <IconComponent className="h-10 w-10 text-[#6529b2] mx-auto" />
                      </div>
                      <div className="text-2xl font-bold text-[#6529b2] mb-2">{metric.value}</div>
                      <div className="text-gray-600 text-sm">{metric.label}</div>
                    </div>
                  )
                })
              ) : (
                // Keep existing default metrics with appropriate icons
                <>
                  <div className="text-center">
                    <div className="mb-4">
                      <Users className="h-10 w-10 text-[#6529b2] mx-auto" />
                    </div>
                    <div className="text-2xl font-bold text-[#6529b2] mb-2">200+</div>
                    <div className="text-gray-600 text-sm">Happy Clients</div>
                  </div>
                  <div className="text-center">
                    <div className="mb-4">
                      <Target className="h-10 w-10 text-[#6529b2] mx-auto" />
                    </div>
                    <div className="text-2xl font-bold text-[#6529b2] mb-2">500+</div>
                    <div className="text-gray-600 text-sm">Projects Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="mb-4">
                      <Award className="h-10 w-10 text-[#6529b2] mx-auto" />
                    </div>
                    <div className="text-2xl font-bold text-[#6529b2] mb-2">15</div>
                    <div className="text-gray-600 text-sm">Awards Won</div>
                  </div>
                  <div className="text-center">
                    <div className="mb-4">
                      <Zap className="h-10 w-10 text-[#6529b2] mx-auto" />
                    </div>
                    <div className="text-2xl font-bold text-[#6529b2] mb-2">4.9/5</div>
                    <div className="text-gray-600 text-sm">Client Satisfaction</div>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Features and Technology Section */}
        <section className="py-16 bg-gray-50">
          <div className="container px-4 md:px-6 mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-16">
              {/* Key Features */}
              <div>
                <h2 className="text-3xl font-bold mb-8 text-gray-900">Key Features</h2>
                <div className="space-y-4">
                  {venture.features && venture.features.length > 0 ? (
                    venture.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-[#6529b2] rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))
                  ) : (
                    // Default features
                    <>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-[#6529b2] rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">Brand identity design</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-[#6529b2] rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">Website and app design</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-[#6529b2] rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">Marketing campaigns</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-[#6529b2] rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">Packaging design</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-[#6529b2] rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">Motion graphics</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-[#6529b2] rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">Design system creation</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Technology Stack */}
              <div>
                <h2 className="text-3xl font-bold mb-8 text-gray-900">Technology Stack</h2>
                <div className="flex flex-wrap gap-3">
                  {venture.technologies && venture.technologies.length > 0 ? (
                    venture.technologies.map((tech) => (
                      <Badge key={tech} variant="outline" className="px-4 py-2 text-sm rounded-full border-gray-300">
                        {tech}
                      </Badge>
                    ))
                  ) : (
                    // Default technologies
                    <>
                      <Badge variant="outline" className="px-4 py-2 text-sm rounded-full border-gray-300">
                        Figma
                      </Badge>
                      <Badge variant="outline" className="px-4 py-2 text-sm rounded-full border-gray-300">
                        Adobe Creative Suite
                      </Badge>
                      <Badge variant="outline" className="px-4 py-2 text-sm rounded-full border-gray-300">
                        Webflow
                      </Badge>
                      <Badge variant="outline" className="px-4 py-2 text-sm rounded-full border-gray-300">
                        Framer
                      </Badge>
                      <Badge variant="outline" className="px-4 py-2 text-sm rounded-full border-gray-300">
                        Sketch
                      </Badge>
                      <Badge variant="outline" className="px-4 py-2 text-sm rounded-full border-gray-300">
                        Principle
                      </Badge>
                      <Badge variant="outline" className="px-4 py-2 text-sm rounded-full border-gray-300">
                        After Effects
                      </Badge>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Achievements Section */}
        <section className="py-16 bg-white">
          <div className="container px-4 md:px-6 mx-auto max-w-7xl">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Achievements</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {venture.achievements && venture.achievements.length > 0 ? (
                venture.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <Award className="h-6 w-6 text-[#6529b2] flex-shrink-0" />
                    <span className="text-gray-700">{achievement}</span>
                  </div>
                ))
              ) : (
                // Default achievements
                <>
                  <div className="flex items-center gap-4">
                    <Award className="h-6 w-6 text-[#6529b2] flex-shrink-0" />
                    <span className="text-gray-700">Awwwards Site of the Day (3 times)</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Award className="h-6 w-6 text-[#6529b2] flex-shrink-0" />
                    <span className="text-gray-700">Dribbble Team of the Year 2023</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Award className="h-6 w-6 text-[#6529b2] flex-shrink-0" />
                    <span className="text-gray-700">Featured in Design Week Magazine</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Award className="h-6 w-6 text-[#6529b2] flex-shrink-0" />
                    <span className="text-gray-700">Helped 50+ startups establish their brand identity</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        {venture.testimonials && venture.testimonials.length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="container px-4 md:px-6 mx-auto max-w-7xl">
              <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">What Our Users Say</h2>
              <div className="max-w-3xl mx-auto text-center">
                <div>
                  <p className="text-xl italic text-gray-700 mb-8">"{venture.testimonials[0].quote}"</p>
                  <div className="flex items-center justify-center gap-4">
                    <div className="relative w-12 h-12">
                      <Image
                        src={venture.testimonials[0].image || "/placeholder.svg?height=48&width=48"}
                        alt={venture.testimonials[0].author}
                        fill
                        className="object-cover rounded-full"
                      />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-gray-900">{venture.testimonials[0].author}</div>
                      <div className="text-sm text-gray-600">
                        {venture.testimonials[0].role} at {venture.testimonials[0].company}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}



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
      <Button
        variant="secondary"
        size="lg"
        className="bg-white text-[#6529b2] hover:text-black hover:bg-white border-white rounded-lg"
        asChild
      >
        <Link href="/contact">Contact Us</Link>
      </Button>

      {venture.website && (
        <Button
  variant="secondary"
  size="lg"
  className="bg-white dark:bg-white! text-[#6529b2] hover:text-black hover:bg-white border-white rounded-lg"
  asChild
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
