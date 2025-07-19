"use client"

import { ArrowLeft, Check, Star, Users, Clock, Award } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function ServicePageContent({ service }) {
  // Ensure all arrays exist with fallback values
  const safeService = {
    title: service?.title || "Service",
    longDescription: service?.longDescription || service?.description || "Professional service description",
    timeline: service?.timeline || "2-4 weeks",
    teamSize: service?.teamSize || "3-5 experts",
    features: Array.isArray(service?.features)
      ? service.features
      : ["Professional consultation", "Custom solution design", "Quality assurance", "Ongoing support"],
    process: Array.isArray(service?.process)
      ? service.process
      : [
          { step: "Discovery", description: "Understanding your requirements" },
          { step: "Planning", description: "Creating detailed project plan" },
          { step: "Execution", description: "Implementing the solution" },
          { step: "Delivery", description: "Final delivery and handover" },
        ],
    technologies: Array.isArray(service?.technologies)
      ? service.technologies
      : ["Modern Technologies", "Best Practices", "Industry Standards"],
    pricing: Array.isArray(service?.pricing)
      ? service.pricing
      : [
          {
            plan: "Starter",
            price: "$2,500",
            features: ["Basic implementation", "Standard support", "Documentation"],
          },
          {
            plan: "Professional",
            price: "$5,000",
            features: ["Advanced features", "Priority support", "Training included", "Custom integrations"],
          },
          {
            plan: "Enterprise",
            price: "Custom",
            features: ["Full customization", "Dedicated support", "SLA guarantee", "Ongoing maintenance"],
          },
        ],
    testimonials: Array.isArray(service?.testimonials)
      ? service.testimonials
      : [
          {
            rating: 5,
            content: "Exceptional service and outstanding results. Highly recommended!",
            name: "John Smith",
            role: "CEO",
            company: "Tech Solutions Inc.",
          },
          {
            rating: 5,
            content: "Professional team that delivered exactly what we needed on time.",
            name: "Sarah Johnson",
            role: "Product Manager",
            company: "Innovation Labs",
          },
        ],
    caseStudies: Array.isArray(service?.caseStudies)
      ? service.caseStudies
      : [
          {
            title: "E-commerce Platform Transformation",
            description: "Complete redesign and development of a modern e-commerce platform",
            image: "/placeholder.svg?height=300&width=600&text=Case+Study+1",
            results: [
              "300% increase in conversion rate",
              "50% reduction in page load time",
              "Improved user experience",
            ],
          },
          {
            title: "Mobile App Development Success",
            description: "Native mobile application with seamless user experience",
            image: "/placeholder.svg?height=300&width=600&text=Case+Study+2",
            results: ["100K+ downloads in first month", "4.8 star rating on app stores", "Featured in app store"],
          },
        ],
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <div className="container mx-auto px-4 py-6">
        <Link href="/services" className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Services
        </Link>
      </div>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">{safeService.title}</h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">{safeService.longDescription}</p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center bg-white rounded-full px-6 py-3 shadow-sm">
                <Clock className="w-5 h-5 text-blue-600 mr-2" />
                <span className="font-medium">{safeService.timeline}</span>
              </div>
              <div className="flex items-center bg-white rounded-full px-6 py-3 shadow-sm">
                <Users className="w-5 h-5 text-blue-600 mr-2" />
                <span className="font-medium">{safeService.teamSize}</span>
              </div>
              <div className="flex items-center bg-white rounded-full px-6 py-3 shadow-sm">
                <Award className="w-5 h-5 text-blue-600 mr-2" />
                <span className="font-medium">Expert Team</span>
              </div>
            </div>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Get Started Today
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">What's Included</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {safeService.features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Our Process</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {safeService.process.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{step.step}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Technologies We Use</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {safeService.technologies.map((tech, index) => (
                <Badge key={index} variant="outline" className="px-4 py-2 text-sm">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Pricing Plans</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {safeService.pricing.map((plan, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-8 relative">
                  {index === 1 && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-blue-600 text-white px-4 py-1">Most Popular</Badge>
                    </div>
                  )}
                  <h3 className="text-xl font-bold mb-4">{plan.plan}</h3>
                  <div className="text-3xl font-bold text-blue-600 mb-6">{plan.price}</div>
                  <ul className="space-y-3 mb-8">
                    {(Array.isArray(plan.features) ? plan.features : []).map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <Check className="w-4 h-4 text-green-600 mr-2" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${index === 1 ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-600 hover:bg-gray-700"}`}
                  >
                    Choose Plan
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">What Our Clients Say</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {safeService.testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Case Studies</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {safeService.caseStudies.map((study, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <Image
                    src={study.image || "/placeholder.svg?height=300&width=600&text=Case+Study"}
                    alt={study.title || "Case Study"}
                    width={600}
                    height={300}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-3">{study.title}</h3>
                    <p className="text-gray-600 mb-4">{study.description}</p>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Results:</h4>
                      {(Array.isArray(study.results) ? study.results : []).map((result, resultIndex) => (
                        <div key={resultIndex} className="flex items-center text-sm">
                          <Check className="w-4 h-4 text-green-600 mr-2" />
                          <span>{result}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">Let's discuss your project and bring your vision to life.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary">
              Schedule Consultation
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
              View Portfolio
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
