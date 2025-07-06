// import { getCaseStudies } from "@/lib/data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Clock, Building, TrendingUp } from "lucide-react"
import Header from "../components/header"
import Footer from "../components/footer"
import { getCaseStudies } from "../lib/data"

export const metadata = {
  title: "Case Studies | Connected",
  description:
    "Explore our success stories and learn how we've helped businesses achieve their goals through innovation and strategic execution.",
}

export default async function CaseStudiesPage() {
  // Fetch case studies data
  const caseStudies = await getCaseStudies()

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-orange-50 to-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl">Case Studies</h1>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                  Explore our success stories and learn how we've helped businesses achieve their goals through
                  innovation and strategic execution.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Case Studies Grid */}
        <section className="w-full py-12 md:py-24 bg-white">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {caseStudies.length > 0 ? (
                caseStudies.map((study) => (
                  <Card key={study.id} className="h-full hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">{study.industry}</Badge>
                      </div>
                      <CardTitle className="text-xl">{study.title}</CardTitle>
                      <CardDescription>{study.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            <span>{study.client}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{study.duration}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            <span>{study.results?.revenue || "Success"}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {study.tags &&
                            study.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                        </div>
                        <Button asChild variant="outline" className="w-full">
                          <Link href={`/case-studies/${study.slug}`}>
                            View Case Study <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-lg text-muted-foreground">No case studies found. Check back soon for updates!</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
