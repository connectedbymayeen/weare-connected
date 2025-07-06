"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
// import Gallery from "@/components/gallery"
import { Building } from "lucide-react"
import Gallery from "@/components/ui/gallery"

const OfficesGallerySection = ({ content }) => {
  const [officesData, setOfficesData] = useState({
    title: "Our Workspace",
    subtitle:
      "Where innovation meets execution. Our modern office space is designed to foster creativity, collaboration, and peak performance.",
    galleries: [],
  })
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [loading, setLoading] = useState(true)
  const [featuredOffice, setFeaturedOffice] = useState(null)

  const categories = ["All", "Headquarters", "Regional Office", "Co-working Space", "Innovation Hub", "Remote Office"]

  useEffect(() => {
    const fetchOfficesData = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/content/offices")
        if (response.ok) {
          const offices = await response.json()
          setOfficesData((prev) => ({
            ...prev,
            galleries: offices,
          }))
          // Set first office as featured
          if (offices.length > 0) {
            setFeaturedOffice(offices[0])
          }
        }
      } catch (error) {
        console.error("Error fetching offices data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOfficesData()

    if (content?.offices) {
      setOfficesData((prev) => ({
        ...prev,
        title: content.offices.title || prev.title,
        subtitle: content.offices.subtitle || prev.subtitle,
        showCategoryFilter: content.offices.showCategoryFilter !== false, // Default to true
      }))
    }
  }, [content])

  const filteredGalleries = officesData.galleries.filter(
    (gallery) => selectedCategory === "All" || gallery.category === selectedCategory,
  )

  const features = [
    {
      title: "Modern Design",
      description: "Clean, contemporary spaces that reflect our innovative approach",
    },
    {
      title: "Natural Light",
      description: "Floor-to-ceiling windows providing abundant natural illumination",
    },
    {
      title: "Flexible Spaces",
      description: "Adaptable environments for collaboration, focus, and creativity",
    },
  ]

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="h-12 bg-gray-200 rounded-lg w-80 mx-auto mb-6 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded-lg w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="h-96 bg-gray-200 rounded-3xl animate-pulse mb-16"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (officesData.galleries.length === 0) {
    return null
  }

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">{officesData.title}</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            <span className="font-semibold text-gray-800">Where innovation meets execution.</span> Our modern office
            space is designed to foster creativity, collaboration, and peak performance.
          </p>
        </motion.div>

        {/* Category Filter - Conditionally Rendered */}
        {content?.offices?.showCategoryFilter !== false && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap justify-center gap-3 mb-16"
          >
            {categories.map((category, index) => (
              <motion.button
                key={category}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-[#6529B2] text-white shadow-lg"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {category}
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Featured Office Hero */}
        {featuredOffice && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="mb-16"
          >
            <div className="relative h-[500px] rounded-3xl overflow-hidden group cursor-pointer">
              <img
                src={featuredOffice.mainImage || "/placeholder.svg?height=500&width=1200"}
                alt={featuredOffice.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Hover Overlay with Details */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300">
                {/* Bottom Left Text Overlay - Only on Hover */}
                <div className="absolute bottom-8 left-8 text-white transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <h3 className="text-2xl md:text-3xl font-bold mb-2">{featuredOffice.name}</h3>
                  <p className="text-base opacity-90 mb-4">
                    {featuredOffice.description || "Open collaboration space with panoramic city views"}
                  </p>
                </div>

                {/* Center Explore Gallery - Only on Hover */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    className="text-center text-white transform scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300"
                  >
                    {/* <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-3 mx-auto">
                      <Building className="w-8 h-8" />
                    </div>
                    <p className="text-lg font-bold mb-1">Explore Gallery</p>
                    <p className="text-sm opacity-90">Interactive Office Tour</p> */}
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Use the existing Gallery component for functionality */}
            <div className="hidden">
              <Gallery gallery={featuredOffice} />
            </div>
          </motion.div>
        )}

        {/* Office Gallery Grid - 2x3 Layout */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-16"
          >
            {filteredGalleries.slice(0, 6).map((gallery, index) => (
              <motion.div
                key={gallery._id || index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="relative h-64 rounded-2xl overflow-hidden"
              >
                {/* Use the existing Gallery component with custom styling */}
                <div className="w-full h-full">
                  <Gallery gallery={gallery} customClassName="w-full h-full" hideDetails={true} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Features Section with Purple Dots */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="text-center"
            >
              {/* Purple Dot Indicator */}
              <div className="flex justify-center mb-4">
                <div className="w-3 h-3 bg-[#6529B2] rounded-full"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Our workspace isn't just an office — it's a{" "}
            <span className="font-semibold text-gray-900">launchpad for innovation</span>. Every detail is designed to
            empower our team to build the future.
          </p>
        </motion.div>

        {/* Empty State */}
        {filteredGalleries.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
              <Building className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No offices found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Try selecting a different category to explore our workspace locations.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  )
}

export default OfficesGallerySection
