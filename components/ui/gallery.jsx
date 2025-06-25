"use client"

import React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Users,
  Calendar,
  Building2,
  Play,
  Pause,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Download,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Gallery({ gallery }) {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isSlideshow, setIsSlideshow] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)

  const images = gallery.images || []
  const hasImages = images.length > 0

  // Auto slideshow effect
  React.useEffect(() => {
    let interval
    if (isSlideshow && hasImages && images.length > 1) {
      interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length)
      }, 3000)
    }
    return () => clearInterval(interval)
  }, [isSlideshow, hasImages, images.length])

  const openGallery = (index = 0) => {
    setCurrentImageIndex(index)
    setIsGalleryOpen(true)
    setZoomLevel(1)
  }

  const closeGallery = () => {
    setIsGalleryOpen(false)
    setIsSlideshow(false)
    setZoomLevel(1)
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
    setZoomLevel(1)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
    setZoomLevel(1)
  }

  const toggleSlideshow = () => {
    setIsSlideshow(!isSlideshow)
  }

  const resetView = () => {
    setZoomLevel(1)
  }

  const zoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 3))
  }

  const zoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.5, 0.5))
  }

  const downloadImage = () => {
    if (images[currentImageIndex]) {
      const link = document.createElement("a")
      link.href = images[currentImageIndex]
      link.download = `${gallery.name}-${currentImageIndex + 1}.jpg`
      link.click()
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case "Headquarters":
        return "bg-gradient-to-r from-purple-500 to-purple-600 text-white"
      case "Regional Office":
        return "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
      case "Co-working Space":
        return "bg-gradient-to-r from-green-500 to-green-600 text-white"
      case "Innovation Hub":
        return "bg-gradient-to-r from-orange-500 to-orange-600 text-white"
      case "Remote Office":
        return "bg-gradient-to-r from-gray-500 to-gray-600 text-white"
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600 text-white"
    }
  }

  return (
    <>
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group cursor-pointer border border-gray-100 h-full flex flex-col"
      >
        {/* Main Image */}
        <div className="relative h-64 overflow-hidden flex-shrink-0" onClick={() => openGallery(0)}>
          {gallery.mainImage ? (
            <motion.img
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              src={gallery.mainImage || "/placeholder.svg"}
              alt={gallery.name || "Office"}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 flex items-center justify-center">
              <Building2 className="w-16 h-16 text-gray-400" />
            </div>
          )}

          {/* Category Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="absolute top-4 left-4"
          >
            <span
              className={`px-4 py-2 rounded-full text-xs font-bold shadow-lg ${getCategoryColor(gallery.category)}`}
            >
              {gallery.category || "Office"}
            </span>
          </motion.div>

          {/* Image Count Badge */}
          {hasImages && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-2 rounded-full text-xs font-medium"
            >
              +{images.length} photos
            </motion.div>
          )}

          {/* Different Hover Overlay - "Explore Gallery" */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                className="text-center text-white"
              >
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-3 mx-auto">
                  <Building2 className="w-8 h-8" />
                </div>
                <p className="text-lg font-bold mb-1">Explore Gallery</p>
                <p className="text-sm opacity-90">Interactive Office Tour</p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Content - Same as before */}
        <div className="p-6 flex-1 flex flex-col">
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl font-bold text-gray-900 mb-4 group-hover:text-[#6529B2] transition-colors duration-300 line-clamp-2"
          >
            {gallery.name || "Office Location"}
          </motion.h3>

          {/* Fixed Office Details Layout */}
          <div className="space-y-3 mb-4 flex-1">
            {gallery.location && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors duration-200"
              >
                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm flex-shrink-0">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Location</p>
                  <p className="text-sm font-semibold text-gray-900 truncate">{gallery.location}</p>
                </div>
              </motion.div>
            )}

            {gallery.capacity && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors duration-200"
              >
                <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-sm flex-shrink-0">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Capacity</p>
                  <p className="text-sm font-semibold text-gray-900">{gallery.capacity} people</p>
                </div>
              </motion.div>
            )}

            {gallery.establishedYear && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors duration-200"
              >
                <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-sm flex-shrink-0">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Established</p>
                  <p className="text-sm font-semibold text-gray-900">{gallery.establishedYear}</p>
                </div>
              </motion.div>
            )}
          </div>

          {gallery.description && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3 flex-shrink-0"
            >
              {gallery.description}
            </motion.p>
          )}

          {/* Image Preview Grid - Fixed at bottom */}
          {hasImages && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-4 gap-2 mt-auto"
            >
              {images.slice(0, 4).map((image, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05, rotate: 1 }}
                  transition={{ duration: 0.2 }}
                  className="relative aspect-square rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-shadow duration-200"
                  onClick={(e) => {
                    e.stopPropagation()
                    openGallery(index)
                  }}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${gallery.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {index === 3 && images.length > 4 && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                      <span className="text-white text-xs font-bold">+{images.length - 4}</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Enhanced Interactive Gallery Modal */}
      <AnimatePresence>
        {isGalleryOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={closeGallery}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full h-full max-w-7xl max-h-[95vh] bg-black rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Enhanced Control Bar */}
              <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent z-10 p-6">
                <div className="flex items-center justify-between">
                  <div className="text-white">
                    <h2 className="text-2xl font-bold mb-1">{gallery.name}</h2>
                    <p className="text-white/70">{gallery.location}</p>
                  </div>

                  {/* Interactive Controls */}
                  <div className="flex items-center gap-2">
                    {hasImages && images.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleSlideshow}
                        className="text-white hover:bg-white/20"
                      >
                        {isSlideshow ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                    )}

                    <Button variant="ghost" size="sm" onClick={resetView} className="text-white hover:bg-white/20">
                      <RotateCcw className="w-4 h-4" />
                    </Button>

                    <Button variant="ghost" size="sm" onClick={zoomOut} className="text-white hover:bg-white/20">
                      <ZoomOut className="w-4 h-4" />
                    </Button>

                    <Button variant="ghost" size="sm" onClick={zoomIn} className="text-white hover:bg-white/20">
                      <ZoomIn className="w-4 h-4" />
                    </Button>

                    <Button variant="ghost" size="sm" onClick={downloadImage} className="text-white hover:bg-white/20">
                      <Download className="w-4 h-4" />
                    </Button>

                    <Button variant="ghost" size="sm" onClick={closeGallery} className="text-white hover:bg-white/20">
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Image Display with Zoom */}
              <div className="relative h-full bg-black flex items-center justify-center overflow-hidden">
                {hasImages && images[currentImageIndex] ? (
                  <motion.img
                    key={currentImageIndex}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: zoomLevel }}
                    transition={{ duration: 0.3 }}
                    src={images[currentImageIndex] || "/placeholder.svg"}
                    alt={`${gallery.name} ${currentImageIndex + 1}`}
                    className="max-w-full max-h-full object-contain cursor-move"
                    style={{ transform: `scale(${zoomLevel})` }}
                  />
                ) : (
                  <div className="flex items-center justify-center">
                    <Building2 className="w-20 h-20 text-gray-400" />
                  </div>
                )}

                {/* Navigation Arrows */}
                {hasImages && images.length > 1 && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.1, x: -2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={prevImage}
                      className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-lg"
                    >
                      <ChevronLeft className="w-7 h-7" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1, x: 2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={nextImage}
                      className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-lg"
                    >
                      <ChevronRight className="w-7 h-7" />
                    </motion.button>
                  </>
                )}
              </div>

              {/* Bottom Info Bar */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <div className="flex items-center justify-between">
                  <div className="text-white">
                    {hasImages && images.length > 1 && (
                      <p className="text-sm opacity-75">
                        {currentImageIndex + 1} of {images.length}
                      </p>
                    )}
                    {isSlideshow && <p className="text-xs opacity-60 mt-1">Slideshow active</p>}
                  </div>

                  {/* Enhanced Thumbnail Strip */}
                  {hasImages && images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto max-w-md">
                      {images.map((image, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.1, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                            index === currentImageIndex
                              ? "border-white ring-2 ring-white/30"
                              : "border-white/30 hover:border-white/60"
                          }`}
                        >
                          <img
                            src={image || "/placeholder.svg"}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </motion.button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
