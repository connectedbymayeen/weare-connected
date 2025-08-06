"use client"
import OfficesGallerySection from "@/app/components/offices-gallery-section"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { motion } from "framer-motion"
import { AlertCircle, CheckCircle, Clock, Loader2, Mail, MapPin, Phone, Send } from "lucide-react"
import { useEffect, useState } from "react"
import Footer from "../components/footer"
import Header from "../components/header"

export default function ContactPageClient() {
  const [content, setContent] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)
  const [errorMessage, setErrorMessage] = useState("")
  const [particles, setParticles] = useState([])
  const [isMounted, setIsMounted] = useState(false)

  // Generate particles on client side only
  useEffect(() => {
    const generatedParticles = [...Array(30)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 10,
    }))
    setParticles(generatedParticles)
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch("/api/content/site")
        if (response.ok) {
          const data = await response.json()
          setContent(data)
        }
      } catch (error) {
        console.error("Error fetching content:", error)
      }
    }

    fetchContent()
  }, [])

  // Use dynamic content with fallbacks
  const contactData = content?.contact || {

    office: {
      address: "",
    },
    emails: {
      general: "hi@weareconnected.io",
      business: "business@weareconnected.io",
      careers: "careers@weareconnected.io",
    },
    phone: "+8801318250903",
    hours: "Mon–Sun: 11AM – 9:00 PM (BD Time)",
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)
    setErrorMessage("")

    try {
      if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim() || !formData.subject.trim()) {
        throw new Error("Please fill in all required fields")
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        throw new Error("Please enter a valid email address")
      }

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          company: formData.company.trim() || undefined,
          subject: formData.subject.trim(),
          message: formData.message.trim(),
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to send message")
      }

      setFormData({
        name: "",
        email: "",
        company: "",
        subject: "",
        message: "",
      })
      setSubmitStatus("success")

      setTimeout(() => {
        setSubmitStatus(null)
      }, 5000)
    } catch (error) {
      setSubmitStatus("error")
      setErrorMessage(error.message || "Failed to send message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (submitStatus === "error") {
      setSubmitStatus(null)
      setErrorMessage("")
    }
  }

  return (
    <>
      <Header />
      <div className="relative min-h-[100vh] sm:min-h-[100vh] md:min-h-[100vh] flex items-center justify-center overflow-hidden -mt-[100px] sm:-mt-[120px] md:-mt-[140px] pt-[120px] sm:pt-[160px] md:pt-[200px]">
        {/* Hero section background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-[#E9E6FF]/40 to-[#AA99FF]/30 -top-[120px] -mt-[120px] pt-[120px]">
          {/* Floating particles - only render after mount */}
          {isMounted &&
            particles.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute w-1 h-1 bg-primary/30 rounded-full"
                style={{
                  left: `${particle.left}%`,
                  top: `${particle.top}%`,
                }}
                animate={{
                  y: [0, -100, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: particle.duration,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: particle.delay,
                }}
              />
            ))}
          <div className="absolute inset-0 bg-primary/8" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(101,41,178,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(101,41,178,0.05)_1px,transparent_1px)] bg-[size:100px_100px]" />
        </div>

        <div className="pt-2 pb-8 relative z-10">
          <div className="container mx-auto px-4 sm:px-6 md:px-8 py-8 max-w-7xl">
            <div className="text-center mb-12 mx-auto max-w-4xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-pot-black mb-6 font-syne">
                {contactData.hero?.title || "Contact Us"}
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {contactData.hero?.subtitle ||
                  "Let's start a conversation about your next big idea"}
              </p>
            </div>
            <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                {/* Contact Form */}
                <Card className="mx-auto w-full bg-white relative z-10">
                  <CardHeader>
                    <CardTitle className="text-2xl font-syne">Send us a message</CardTitle>
                    <CardDescription>Fill out the form below and we'll get back to you within 24 hours.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Success Message */}
                    {submitStatus === "success" && (
                      <Alert className="border-green-200 bg-green-50 mb-6">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                          Thank you for your message! We've received your inquiry and will get back to you within 24 hours.
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Error Message */}
                    {submitStatus === "error" && (
                      <Alert className="border-red-200 bg-red-50 mb-6">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-800">{errorMessage}</AlertDescription>
                      </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6 px-14" style={{ scrollBehavior: "auto" }}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Name *</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            required
                            disabled={isSubmitting}
                            className="border-gray-300 bg-white focus:border-purple-500 focus:ring-purple-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            required
                            disabled={isSubmitting}
                            className="border-gray-300 bg-white focus:border-purple-500 focus:ring-purple-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="company">Company</Label>
                        <Input
                          id="company"
                          value={formData.company}
                          onChange={(e) => handleChange("company", e.target.value)}
                          disabled={isSubmitting}
                          className="border-gray-300 bg-white focus:border-purple-500 focus:ring-purple-500"
                        />
                      </div>

                      <div className="space-y-2 relative z-20 overflow-visible">
                        <Label htmlFor="subject">Subject *</Label>
                        <Select
                          value={formData.subject}
                          onValueChange={(value) => handleChange("subject", value)}
                          disabled={isSubmitting}
                        >
                          <SelectTrigger
                            id="subject"
                            className="flex h-11 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm 
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 
      disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <SelectValue placeholder="Select a subject"  />
                          </SelectTrigger>

                          <SelectContent
                            side="bottom"
                            align="start"
                            className="z-50 bg-primary/15 backdrop-blur-xl border border-primary/20 shadow-xl"
                          >
                            <SelectItem value="general">General Inquiry</SelectItem>
                            <SelectItem value="partnership">Partnership</SelectItem>
                            <SelectItem value="investment">Investment Opportunity</SelectItem>
                            <SelectItem value="careers">Careers</SelectItem>
                            <SelectItem value="press">Press & Media</SelectItem>
                            <SelectItem value="support">Support</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>


                      <div className="space-y-2">
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                          id="message"
                          rows={6}
                          value={formData.message}
                          onChange={(e) => handleChange("message", e.target.value)}
                          required
                          disabled={isSubmitting}
                          className="border-gray-300 bg-white focus:border-purple-500 focus:ring-purple-500 resize-none h-52"
                          placeholder="Tell us about your inquiry, how we can help you, or share your message with us..."
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-[#6529b2] hover:bg-purple-700"
                        size="lg"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending Message...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Contact Information */}
                <div className="space-y-8 mx-auto w-full bg-white p-10 rounded-lg">
                  <div>
                    <h2 className="text-2xl font-bold text-pot-black mb-6 font-syne">Contact Information</h2>
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <Mail className="h-6 w-6 text-primary mt-1" />
                        <div>
                          <h3 className="font-semibold mb-1">Email</h3>
                          <p className="text-muted-foreground">
                            {contactData.emails?.general || "hello@weareconnected.io"}
                          </p>
                          <p className="text-muted-foreground">
                            {contactData.emails?.business || "press@weareconnected.io"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <Phone className="h-6 w-6 text-primary mt-1" />
                        <div>
                          <h3 className="font-semibold mb-1">Phone</h3>
                          <p className="text-muted-foreground">{contactData.phone || "+1 (415) 555-0123"}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <MapPin className="h-6 w-6 text-primary mt-1" />
                        <div>
                          <h3 className="font-semibold mb-1">Address</h3>
                          <p className="text-muted-foreground">
                            {(contactData.office?.address && contactData.office?.city)
                              ? `${contactData.office.address}, ${contactData.office.city}`
                              : "Lotus Kamal Tower 2, 59-61, Gulshan South Avenue, Gulshan 1, 1212,Dhaka, Bangladesh"}
                          </p>

                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <Clock className="h-6 w-6 text-primary mt-1" />
                        <div>
                          <h3 className="font-semibold mb-1">Business Hours</h3>
                          <p className="text-muted-foreground">
                            {contactData.hours || "Monday - Friday: 9:00 AM - 6:00 PM PST"}
                            <br />
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Contact Cards */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-pot-black font-syne">Quick Contact</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
                      <Card className="hover:shadow-md transition-shadow cursor-pointer bg-white">
                        <CardContent className="p-4 text-center">
                          <Mail className="h-8 w-8 text-primary mx-auto mb-2" />
                          <h4 className="font-semibold mb-1">General Inquiries</h4>
                          <p className="text-sm text-muted-foreground">
                            {contactData.emails?.general || "hello@weareconnected.io"}
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="hover:shadow-md transition-shadow cursor-pointer bg-white">
                        <CardContent className="p-4 text-center">
                          <Phone className="h-8 w-8 text-primary mx-auto mb-2" />
                          <h4 className="font-semibold mb-1">Call Us</h4>
                          <p className="text-sm text-muted-foreground">{contactData.phone || "+8801318250903"}</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      <OfficesGallerySection />



      <Footer />
    </>
  )
}
