"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  AlertCircle,
  CheckCircle,
  Facebook,
  Instagram,
  Linkedin,
  Loader2,
  Mail,
  MapPin,
  Phone,
  YoutubeIcon
} from "lucide-react"
import { useState } from "react"

const defaultContactData = {
  title: "Get in Touch",
  description:
    "Ready to Start a Revolution? Whether you're a founder, investor, collaborator, or someone with a bold idea, we're always open to conversations that lead to action. Reach out.",
  office: {
    address:
      "Lotus Kamal Tower 2, 59-61, Gulshan South Avenue, Gulshan 1, 1212, Dhaka, Bangladesh",
  },
  emails: {
    general: "hi@weareconnected.io",
    business: "business@weareconnected.io",
    careers: "careers@weareconnected.io",
  },
  phone: "+8801318250903",
  hours: "Mon–Sun: 11AM – 9:00 PM (BD Time)",
}

export default function ContactSection() {
  const [contactData] = useState(defaultContactData)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)
  const [errorMessage, setErrorMessage] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (submitStatus === "error") {
      setSubmitStatus(null)
      setErrorMessage("")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)
    setErrorMessage("")

    try {
      if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
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
          phone: formData.phone.trim() || undefined,
          company: formData.company.trim() || undefined,
          subject: formData.subject.trim() || "General Inquiry",
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
        phone: "",
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

  return (
    <section className="w-full py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">{contactData.title}</h2>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
          {/* Left Column - Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-black mb-4">Contact Us</h3>
              <p className="text-gray-600 text-base leading-relaxed">{contactData.description}</p>
            </div>

            {/* Our Office */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-purple-600" />
                <h4 className="font-semibold text-black">Our Office</h4>
              </div>
              <div className="ml-8 text-gray-600">
                <p
                  style={{
                    whiteSpace: "normal",
                    overflowWrap: "break-word",
                    wordBreak: "break-word",
                  }}
                >
                  {contactData.office.address}
                </p>
              </div>
            </div>

            {/* Email Us */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-purple-600" />
                <h4 className="font-semibold text-black">Email Us</h4>
              </div>
              <div className="ml-8 text-gray-600 space-y-1">
                <p>General: {contactData.emails.general}</p>
                <p>Business: {contactData.emails.business}</p>
                <p>Careers: {contactData.emails.careers}</p>
              </div>
            </div>

            {/* Call Us */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-purple-600" />
                <h4 className="font-semibold text-black">Call Us</h4>
              </div>
              <div className="ml-8 text-gray-600">
                <p>{contactData.phone}</p>
                <p>{contactData.hours}</p>
              </div>
            </div>

            {/* Follow Us */}
            <div className="space-y-4">
              <h4 className="font-semibold text-black">Follow Us</h4>
              <div className="flex space-x-4">
                <a
                  href="https://www.instagram.com/weareconnected.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-[#f4f2ff] rounded-lg flex items-center justify-center hover:bg-purple-100 transition-colors cursor-pointer"
                >
                  <Instagram className="h-5 w-5 text-gray-600 hover:text-purple-600" />
                </a>
                <a
                  href="https://www.youtube.com/@connectedglobal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-[#f4f2ff] rounded-lg flex items-center justify-center hover:bg-purple-100 transition-colors cursor-pointer"
                >
                  <YoutubeIcon className="h-5 w-5 text-gray-600 hover:text-purple-600" />
                </a>
                <a
                  href="https://www.linkedin.com/company/connectedglobal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-[#f4f2ff] rounded-lg flex items-center justify-center hover:bg-purple-100 transition-colors cursor-pointer"
                >
                  <Linkedin className="h-5 w-5 text-gray-600 hover:text-purple-600" />
                </a>
                <a
                  href="https://www.facebook.com/weareconnected.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-[#f4f2ff] rounded-lg flex items-center justify-center hover:bg-purple-100 transition-colors cursor-pointer"
                >
                  <Facebook className="h-5 w-5 text-gray-600 hover:text-purple-600" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="space-y-6 bg-[#f4f2ff] py-10 px-8 rounded-[20px]">
            {/* Success Message */}
            {submitStatus === "success" && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Thank you for your message! We've received your inquiry and will get back to you within 24
                  hours.
                </AlertDescription>
              </Alert>
            )}

            {/* Error Message */}
            {submitStatus === "error" && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{errorMessage}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-black">
                  Full Name *
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              {/* Email Address */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-black">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="hi@weareconnected.io"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              {/* Company Name */}
              <div className="space-y-2">
                <Label htmlFor="company" className="text-sm font-medium text-black">
                  Company Name
                </Label>
                <Input
                  id="company"
                  name="company"
                  placeholder="Your company name"
                  value={formData.company}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              {/* Your Message */}
              <div className="space-y-2">
                <Label htmlFor="message" className="text-sm font-medium text-black">
                  Your Message *
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Tell us about your inquiry, how we can help you, or share your message with us..."
                  className="min-h-[120px] border-gray-300 focus:border-purple-500 focus:ring-purple-500 resize-none"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Send Message Button */}
              <Button
                type="submit"
                className="w-full h-12 bg-[#6529b2] hover:bg-purple-700 text-white font-medium cursor-pointer"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="cursor-pointer mr-2 h-4 w-4 animate-spin" />
                    Sending Message...
                  </>
                ) : (
                  "Send Message"
                )}
              </Button>

              {/* Privacy Policy */}
              <p className="text-xs text-gray-500 text-center">
                By submitting this form, you agree to our{" "}
                <a href="/privacy" className="text-purple-600 hover:underline">
                  Privacy Policy
                </a>{" "}
                and{" "}
                <a href="/terms" className="text-purple-600 hover:underline">
                  Terms of Service
                </a>
                .
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
