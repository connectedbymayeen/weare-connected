import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Building, Calendar, CheckCircle, Target, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import Footer from "@/app/components/footer"
import Header from "@/app/components/header"
import { getCaseStudyBySlug } from "@/app/lib/data"

export async function generateMetadata({ params }) {
  const { slug } = await params
  const caseStudy = await getCaseStudyBySlug(slug)

  if (!caseStudy) {
    return {
      title: "Case Study Not Found",
    }
  }

  return {
    title: `${caseStudy.title} - ${caseStudy.client} | Connected`,
    description: caseStudy.shortDescription || caseStudy.description,
  }
}

export default async function CaseStudyDetailPage({ params }) {
  const { slug } = await params
  const caseStudy = await getCaseStudyBySlug(slug)

  if (!caseStudy) {
    notFound()
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
        {/* Hero Section */}
        <section className="py-12">
          <div className="container px-4 md:px-6 mx-auto max-w-7xl">
            {/* Back Button */}
            <div className="mb-8">
              <Button variant="ghost" asChild className="text-gray-600 hover:text-gray-900">
                <Link href="/case-studies">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Case Studies
                </Link>
              </Button>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Content */}
              <div className="space-y-6">
                {/* Badges */}
                <div className="flex gap-3">
                  <Badge className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-full">
                    Case Study
                  </Badge>
                  {caseStudy.industry && (
                    <Badge variant="outline" className="px-3 py-1 rounded-full border-gray-300">
                      {caseStudy.industry}
                    </Badge>
                  )}
                </div>

                {/* Title and Client */}
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">{caseStudy.title}</h1>
                  <div className="flex items-center gap-2 text-lg text-gray-600 mb-4">
                    <Building className="h-5 w-5" />
                    <span>Client: {caseStudy.client}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed text-lg">
                  {caseStudy.shortDescription || caseStudy.description}
                </p>

                {/* Meta Info */}
                <div className="flex flex-wrap gap-6 text-gray-600 text-sm">
                  {caseStudy.completionDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Completed {new Date(caseStudy.completionDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  {caseStudy.services && caseStudy.services.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      <span>{caseStudy.services.join(", ")}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Featured Image */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 shadow-lg">
                {caseStudy.featuredImage?.url ? (
                  <Image
                    src={caseStudy.featuredImage.url || "/placeholder.svg"}
                    alt={caseStudy.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-100">
                    <div className="text-center">
                      <Building className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                      <p className="text-purple-600 font-medium">{caseStudy.title}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Challenge, Solution, Results Section */}
        <section className="py-16 bg-white">
          <div className="container px-4 md:px-6 mx-auto max-w-7xl">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Challenge */}
              {caseStudy.challenge && (
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <Target className="h-5 w-5 text-red-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">Challenge</h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{caseStudy.challenge}</p>
                  </CardContent>
                </Card>
              )}

              {/* Solution */}
              {caseStudy.solution && (
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">Solution</h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{caseStudy.solution}</p>
                  </CardContent>
                </Card>
              )}

              {/* Results */}
              {caseStudy.results && (
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">Results</h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{caseStudy.results}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>

        {/* Services Used */}
        {caseStudy.services && caseStudy.services.length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="container px-4 md:px-6 mx-auto max-w-7xl">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Services Provided</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Here are the key services we provided to help {caseStudy.client} achieve their goals.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                {caseStudy.services.map((service, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="px-4 py-2 text-sm rounded-full border-purple-200 text-purple-700 bg-purple-50"
                  >
                    {service}
                  </Badge>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Testimonial */}
        {caseStudy.testimonial && (
          <section className="py-16 bg-white">
            <div className="container px-4 md:px-6 mx-auto max-w-4xl text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">What Our Client Says</h2>
              <blockquote className="text-xl italic text-gray-700 mb-6">"{caseStudy.testimonial}"</blockquote>
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Building className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">{caseStudy.client}</div>
                  <div className="text-sm text-gray-600">{caseStudy.industry}</div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-16 bg-purple-600 text-white">
          <div className="container px-4 md:px-6 mx-auto text-center max-w-4xl">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Success Story?</h2>
            <p className="text-xl mb-8 opacity-90">
              Let's work together to create amazing results for your business, just like we did for {caseStudy.client}.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-100 rounded-lg"
                asChild
              >
                <Link href="/contact">Start Your Project</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-purple-600 rounded-lg bg-transparent"
                asChild
              >
                <Link href="/case-studies">View More Case Studies</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
