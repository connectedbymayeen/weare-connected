import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"
import Header from "../components/header"
import Footer from "../components/footer"
import { getServices } from "../lib/data"

export const metadata = {
  title: "Our Services | Connected",
  description:
    "Explore our comprehensive range of services designed to help businesses innovate, grow, and succeed in the digital age.",
}

export default async function ServicesPage() {
  // Fetch services data
  const services = await getServices()

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-blue-50 to-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl">Our Services</h1>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                  We offer a comprehensive range of services to help businesses innovate, grow, and succeed in the
                  digital age.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="w-full py-12 md:py-24 bg-white">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.length > 0 ? (
                services.map((service) => (
                  <Card key={service.id} className="h-full hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <ul className="space-y-2">
                          {service.features &&
                            service.features.slice(0, 4).map((feature, i) => (
                              <li key={i} className="flex items-center">
                                <Check className="h-4 w-4 mr-2 text-primary" />
                                <span className="text-sm">{feature}</span>
                              </li>
                            ))}
                        </ul>
                        <Button asChild variant="outline" className="w-full dark:bg-white dark:hover:text-black dark:hover:bg-[#b073ff]">
                          <Link href={`/services/${service.slug}`}>
                            Learn More <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-lg text-muted-foreground">No services found. Check back soon for updates!</p>
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
