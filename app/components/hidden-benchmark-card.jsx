"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

export default function HiddenBenchmarkCard() {
  const [isVisible, setIsVisible] = useState(false)
  const [keySequence, setKeySequence] = useState("")
  const [showCard, setShowCard] = useState(false)
  const [imageError, setImageError] = useState(false)
  const secretCode = "mastermhp"

  useEffect(() => {
    const handleKeyPress = (event) => {
      const newSequence = keySequence + event.key.toLowerCase()

      if (secretCode.startsWith(newSequence)) {
        setKeySequence(newSequence)

        if (newSequence === secretCode) {
          setIsVisible(true)
          setShowCard(true)
          setKeySequence("")
        }
      } else {
        setKeySequence("")
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [keySequence])

  const handleClose = () => {
    setShowCard(false)
    setTimeout(() => setIsVisible(false), 500)
  }

  const handleImageError = () => {
    setImageError(true)
  }

  if (!isVisible) return null

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-all duration-500 ${
        showCard ? "bg-black/80 backdrop-blur-sm" : "bg-transparent pointer-events-none"
      }`}
    >
      <div
        className={`relative transition-all duration-700 transform ${
          showCard ? "scale-100 opacity-100" : "scale-0 opacity-0"
        }`}
      >
        {/* Neon Glow Background */}
        <div className="absolute -inset-4 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-75 animate-pulse"></div>
        <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-2xl blur-lg opacity-50 animate-ping"></div>

        {/* Main Card */}
        <div className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl p-8 max-w-md w-full border border-cyan-400/30 shadow-2xl overflow-hidden">
          {/* Animated Border */}
          <div className="absolute inset-0 rounded-2xl">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 opacity-20 animate-spin-slow"></div>
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Content */}
          <div className="relative z-10 text-center">
            {/* Profile Image */}
            <div className="relative mx-auto mb-6 w-24 h-24">
              <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full blur opacity-75 animate-pulse"></div>
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-cyan-400/50 bg-gray-800">
                {!imageError ? (
                  <Image
                    src="https://res.cloudinary.com/dacss7t7h/image/upload/v1755207841/mastermhp_i4nzhf.jpg"
                    alt="Master Developer"
                    fill
                    className="object-cover"
                    unoptimized
                    onError={handleImageError}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-500 to-purple-600">
                    <span className="text-white text-2xl font-bold">MHP</span>
                  </div>
                )}
              </div>
            </div>

            {/* Title with Neon Effect */}
            <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
              MEHEDI HASAN PARASH
            </h2>

            {/* Subtitle */}
            <p className="text-cyan-300 text-sm mb-4 font-medium">Full-Stack WEB & APP Developer & UI/UX Visionary</p>

            {/* Description */}
            <div className="text-gray-300 text-sm leading-relaxed mb-6 space-y-2">
              <p className="text-cyan-200">🚀 Crafted this entire website from scratch</p>
              <p>Built with Next.js, MongoDB, and modern web technologies</p>
              <p>Featuring responsive design, admin panel, and seamless UX</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-cyan-400 text-lg font-bold">100%</div>
                <div className="text-gray-400 text-xs">Custom Built</div>
              </div>
              <div className="text-center">
                <div className="text-purple-400 text-lg font-bold">∞</div>
                <div className="text-gray-400 text-xs">Possibilities</div>
              </div>
              <div className="text-center">
                <div className="text-pink-400 text-lg font-bold">24/7</div>
                <div className="text-gray-400 text-xs">Dedication</div>
              </div>
            </div>

            {/* Signature */}
            <div className="border-t border-gray-700 pt-4">
              <p className="text-xs text-gray-500 italic">
                "Code is poetry, design is art, and innovation is the bridge between dreams and reality."
              </p>
              <p className="text-cyan-400 text-sm font-semibold mt-2">- MasterMHP</p>
            </div>
          </div>

          {/* Floating Particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${3 + Math.random() * 2}s`,
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
