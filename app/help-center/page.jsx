import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, MessageCircle, Book, Users, ArrowRight, HelpCircle, FileText, Video, Mail } from "lucide-react"
import Header from "../components/header"
import Footer from "../components/footer"

export const metadata = {
  title: "Help Center | Connected",
  description: "Find answers to your questions and get support from the Connected team.",
}

const categories = [
  {
    title: "Getting Started",
    description: "Learn the basics and get up and running quickly",
    icon: Book,
    articles: 12,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Account Management",
    description: "Manage your account settings and preferences",
    icon: Users,
    articles: 8,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Billing & Payments",
    description: "Information about billing, payments, and subscriptions",
    icon: FileText,
    articles: 6,
    color: "bg-purple-100 text-purple-600",
  },
  {
    title: "Technical Support",
    description: "Troubleshooting and technical assistance",
    icon: HelpCircle,
    articles: 15,
    color: "bg-orange-100 text-orange-600",
  },
]

const popularArticles = [
  {
    title: "How to get started with Connected",
    category: "Getting Started",
    views: "2.5K views",
    updated: "2 days ago",
  },
  {
    title: "Understanding our pricing plans",
    category: "Billing & Payments",
    views: "1.8K views",
    updated: "1 week ago",
  },
  {
    title: "Setting up your first project",
    category: "Getting Started",
    views: "1.2K views",
    updated: "3 days ago",
  },
  {
    title: "Troubleshooting common issues",
    category: "Technical Support",
    views: "980 views",
    updated: "5 days ago",
  },
  {
    title: "Managing team members and permissions",
    category: "Account Management",
    views: "750 views",
    updated: "1 week ago",
  },
]

const contactOptions = [
  {
    title: "Live Chat",
    description: "Chat with our support team in real-time",
    icon: MessageCircle,
    availability: "Available 24/7",
    action: "Start Chat",
  },
  {
    title: "Email Support",
    description: "Send us an email and we'll get back to you",
    icon: Mail,
    availability: "Response within 24 hours",
    action: "Send Email",
  },
  {
    title: "Video Tutorials",
    description: "Watch step-by-step video guides",
    icon: Video,
    availability: "Available anytime",
    action: "Watch Videos",
  },
]

export default function HelpCenterPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary/10 to-secondary/10">
          <div className="container px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6 font-syne">Help Center</h1>
              <p className="text-xl text-muted-foreground mb-8">
                Find answers to your questions and get the support you need to succeed with Connected.
              </p>
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input placeholder="Search for help articles..." className="pl-10 bg-background border-input" />
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-20 bg-white">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 font-syne">Browse by Category</h2>
              <p className="text-xl text-muted-foreground">Find the information you need organized by topic</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category, index) => {
                const Icon = category.icon
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                    <CardHeader className="text-center">
                      <div
                        className={`w-16 h-16 rounded-full ${category.color} flex items-center justify-center mx-auto mb-4`}
                      >
                        <Icon className="h-8 w-8" />
                      </div>
                      <CardTitle className="text-xl">{category.title}</CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                      <Badge variant="secondary">{category.articles} articles</Badge>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Popular Articles Section */}
        <section className="py-20 bg-lynx-white">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 font-syne">Popular Articles</h2>
              <p className="text-xl text-muted-foreground">Most viewed help articles from our community</p>
            </div>

            <div className="max-w-4xl mx-auto space-y-4">
              {popularArticles.map((article, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2 hover:text-primary cursor-pointer">
                          {article.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <Badge variant="outline">{article.category}</Badge>
                          <span>{article.views}</span>
                          <span>Updated {article.updated}</span>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button variant="outline">
                View All Articles <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Contact Support Section */}
        <section className="py-20 bg-white">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 font-syne">Still Need Help?</h2>
              <p className="text-xl text-muted-foreground">Our support team is here to help you succeed</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {contactOptions.map((option, index) => {
                const Icon = option.icon
                return (
                  <Card key={index} className="text-center border-none shadow-sm">
                    <CardHeader>
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{option.title}</CardTitle>
                      <CardDescription>{option.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">{option.availability}</p>
                      <Button className="w-full">{option.action}</Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-lynx-white">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 font-syne">Frequently Asked Questions</h2>
              <p className="text-xl text-muted-foreground">Quick answers to common questions</p>
            </div>

            <div className="max-w-3xl mx-auto space-y-6">
              {[
                {
                  question: "How do I get started with Connected?",
                  answer:
                    "Getting started is easy! Simply sign up for an account, complete your profile, and you can begin exploring our platform and services immediately.",
                },
                {
                  question: "What support do you provide to portfolio companies?",
                  answer:
                    "We provide comprehensive support including strategic guidance, business development, technical resources, funding assistance, and access to our network of partners and advisors.",
                },
                {
                  question: "How can I apply for investment or partnership?",
                  answer:
                    "You can submit your application through our contact form or reach out directly to our team. We review all applications and will get back to you within 5-7 business days.",
                },
                {
                  question: "Do you work with international companies?",
                  answer:
                    "Yes, we work with companies globally. While our headquarters is in the US, we have experience working with international teams and can provide support across different time zones.",
                },
                {
                  question: "What industries do you focus on?",
                  answer:
                    "We work across various industries including technology, healthcare, fintech, e-commerce, education, and clean energy. We're always interested in innovative solutions regardless of the sector.",
                },
              ].map((faq, index) => (
                <Card key={index} className="border-none shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-white">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold mb-4 font-syne">Can't Find What You're Looking For?</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Our team is always ready to help. Reach out to us directly and we'll get back to you as soon as possible.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg" asChild>
                <Link href="/contact">Contact Support</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="border-white text-white hover:bg-white hover:text-primary"
              >
                <Link href="mailto:support@connected.com">Email Us</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  )
}
