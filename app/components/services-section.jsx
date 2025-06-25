import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Button } from "@/components/ui/button"



export default function ServicesSection({ services = [] }) {

  const ref = useRef(null)
    const isInView = useInView(ref, { once: true })

  // If no services are provided, use fallback data
  const servicesList =
    services.length > 0
      ? services
      : [
          {
            slug: "web-development",
            title: "Web Development",
            description: "Custom web applications built with modern technologies",
          },
          {
            slug: "mobile-app-development",
            title: "Mobile App Development",
            description: "Native and cross-platform mobile applications",
          },
          {
            slug: "product-strategy",
            title: "Product Strategy",
            description: "Strategic planning and roadmapping for digital products",
          },
          {
            slug: "venture-building",
            title: "Venture Building",
            description: "End-to-end support for launching new ventures",
          },
        ]

  return (
    <section ref={ref} className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-purple-50 to-white">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
        >
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-accent px-3 py-1 text-sm font-medium text-primary">
             Our Services
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Building the Conection</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                            We offer a comprehensive range of services to help businesses innovate, grow, and transform.

            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">

          {servicesList.map((service) => (
            <Link href={`/services/${service.slug}`} key={service.slug} className="group">
              <div className="bg-white rounded-lg p-8 shadow-md transition-all duration-300 hover:shadow-xl h-full flex flex-col">
                <h3 className="text-xl text-primary font-bold mb-4">{service.title}</h3>
                <p className="text-gray-600 mb-6 flex-grow">{service.description}</p>
                <div className="flex items-center text-primary font-medium">
                  <span>Learn more</span>
                  <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center"
        >
          <Button asChild size="lg">
            <Link href="/ventures">
              View All Ventures <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}




