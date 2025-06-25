"use client"
import { motion } from "framer-motion"

export default function HeroSection() {
  const heroData = {
    title: "THE LAUNCHPAD FOR LIMITLESS REVOLUTIONS",
    subtitle:
      "We don’t build products. We ignite revolutions. From disruptive software to category-defining brands. Connected turns bold ideas into global forces that reshape industries.",
    stats: [
      { value: "5+", label: "Ventures Built" },
      { value: "$20M+", label: "Value Created" },
      { value: "15", label: "Countries" },
    ],
  }

  const titleWords = heroData.title.split(" ")
  const lastWord = titleWords.pop()
  const firstPart = titleWords.join(" ")

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden -mt-[90px] sm:-mt-[140px] md:-mt-[140px] pt-[120px] sm:pt-[160px] md:pt-[200px]">
      {/* Background */}
      <div className="absolute inset-0 -top-[80px] sm:-top-[100px] md:-top-[120px] bg-gradient-to-br from-gray-100 via-[#E9E6FF]/50 to-[#AA99FF]/40">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/20" />
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{ y: [0, -100, 0], opacity: [0, 1, 0] }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 10,
            }}
          />
        ))}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(101,41,178,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(101,41,178,0.08)_1px,transparent_1px)] bg-[size:60px_60px] sm:bg-[size:80px_80px] md:bg-[size:100px_100px]" />
      </div>

      <div className="container mx-auto px-10 sm:px-6 md:px-13 relative z-10 w-full max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center min-h-[50vh] sm:min-h-[55vh] md:min-h-[60vh] py-6 sm:py-8">
          {/* Left Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="space-y-6 sm:space-y-8 text-center lg:text-left mx-auto lg:mx-0 max-w-2xl lg:max-w-none"
          >
            <div className="flex items-center gap-3 justify-center lg:justify-start">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-primary text-sm font-medium">Currently building the future</span>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-pot-black leading-tight">
                {firstPart}{" "}
                <span className="block text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
                  {lastWord}
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                {heroData.subtitle}
              </p>
            </div>

            <div className={`grid grid-cols-${heroData.stats.length} gap-4 sm:gap-6 md:gap-8 pt-6 sm:pt-8 border-t border-white/10 max-w-md mx-auto lg:mx-0`}>
              {heroData.stats.map((stat, index) => (
                <div key={index} className="text-center lg:text-left">
                  <div className="text-2xl sm:text-3xl font-bold text-pot-black">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative order-first lg:order-last flex justify-center"
          >
            <div className="relative w-full h-64 sm:h-80 md:h-96 flex items-center justify-center max-w-md mx-auto">
              <motion.div className="absolute w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full border-2 border-primary/30" animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} />
              <motion.div className="absolute w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full border-2 border-pink-400/40" animate={{ rotate: -360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} />
              <motion.div className="absolute w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full bg-gradient-to-r from-primary to-secondary opacity-80" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 4, repeat: Infinity }} />
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 sm:w-3 sm:h-3 bg-primary/60 rounded-full"
                  style={{
                    left: `${50 + 25 * Math.cos((i * Math.PI * 2) / 8)}%`,
                    top: `${50 + 25 * Math.sin((i * Math.PI * 2) / 8)}%`,
                  }}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
                {[...Array(4)].map((_, i) => (
                  <motion.line
                    key={i}
                    x1="200"
                    y1="200"
                    x2={200 + 100 * Math.cos((i * Math.PI * 2) / 4)}
                    y2={200 + 100 * Math.sin((i * Math.PI * 2) / 4)}
                    stroke="rgba(101,41,178,0.3)"
                    strokeWidth="1"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{
                      duration: 2,
                      delay: i * 0.3,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  />
                ))}
              </svg>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 text-gray-400"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-xs sm:text-sm text-center"
        >
          ↓ SCROLL TO EXPLORE
        </motion.div>
      </motion.div>
    </section>
  )
}
