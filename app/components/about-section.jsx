"use client"

import { motion, useInView } from "framer-motion"
import { useEffect, useRef, useState } from "react"

export default function AboutSection({ content }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const defaultAboutData = {
    title: "Who We Are",
    description:
      "Connected began with a vision to nurture and scale innovative ideas into leading market solutions.",
    vision:
      "Our vision is to become the world's leading launchpad for next generation ventures. We aim to create a global ecosystem where bold ideas grow into influential brands that define the future of technology, culture, and commerce.",
    mission:
      "Connected's mission is to build ventures that shape the future. We turn ideas into impactful businesses across tech, digital, media, and lifestyle. Our goal is to empower creators, disrupt industries, and deliver innovation with purpose and precision.",
    values: [
      {
        number: "01",
        title: "Innovation",
        description:
          "We push boundaries and challenge the status quo to create cutting-edge solutions that transform industries.",
      },
      {
        number: "02",
        title: "Collaboration",
        description:
          "We believe in the power of community and partnerships to achieve extraordinary results and sustainable growth.",
      },
      {
        number: "03",
        title: "Impact",
        description:
          "We're committed to creating meaningful change and lasting value that drives transformative growth across markets.",
      },
    ],
  }

  const [aboutData, setAboutData] = useState(defaultAboutData)

  useEffect(() => {
    if (
      content?.about &&
      aboutData.title === defaultAboutData.title &&
      aboutData.description === defaultAboutData.description
    ) {
      setAboutData(content.about)
    }
  }, [content])

  return (
    <section
      ref={ref}
      className="w-full py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 bg-white"
    >
      <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center justify-center space-y-4 text-center mx-auto"
        >
          <div className="space-y-2 max-w-4xl mx-auto">
            <div className="inline-block rounded-lg bg-accent px-3 py-1 text-sm font-medium text-primary">
              About Us
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter">
              {aboutData.title}
            </h2>
            <p className="max-w-[900px] mx-auto text-muted-foreground text-base sm:text-lg md:text-xl leading-relaxed px-4">
              {aboutData.description}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mx-auto grid max-w-6xl items-start gap-6 sm:gap-8 md:gap-12 py-8 sm:py-12 lg:grid-cols-2 lg:gap-16"
        >
          <div className="space-y-4 sm:space-y-6 mx-auto lg:mx-0 max-w-2xl lg:max-w-none">
            <h3 className="text-xl sm:text-2xl font-bold text-center lg:text-left">
              Our Vision & Mission
            </h3>
            <div className="space-y-4">
              <div className="p-4 sm:p-6 rounded-lg bg-purple-50 border-l-4 border-purple-500">
                <h4 className="font-bold text-purple-900 mb-2">Vision</h4>
                <p className="text-purple-800 text-sm sm:text-base">
                  {aboutData.vision}
                </p>
              </div>
              <div className="p-4 sm:p-6 rounded-lg bg-blue-50 border-l-4 border-blue-500">
                <h4 className="font-bold text-blue-900 mb-2">Mission</h4>
                <p className="text-blue-800 text-sm sm:text-base">
                  {aboutData.mission}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6 mx-auto lg:mx-0 max-w-2xl lg:max-w-none">
            <h3 className="text-xl sm:text-2xl font-bold text-center lg:text-left">
              What We Do
            </h3>
            <div className="space-y-3">
              {[
                "We launch future-focused ventures across tech, media, lifestyle, and beyond.",
                "We turn disruptive ideas into scalable businesses with global potential.",
                "We invest in people, products, and platforms that redefine what's possible.",
                "We build brands that inspire, influence, and lead entire industries.",
                "We don't just create companies, we create movements.",
              ].map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  className="flex items-start space-x-3"
                >
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-muted-foreground text-sm sm:text-base">
                    {service}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mx-auto grid max-w-5xl items-center gap-6 sm:gap-8 md:gap-12 py-8 sm:py-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        >
          {aboutData.values.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
              className="flex flex-col items-center text-center space-y-3 sm:space-y-4 mx-auto max-w-lg
        border border-gray-200 rounded-xl p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-md"
            >
              <div className="mb-2 sm:mb-4 flex h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-lg sm:text-xl md:text-2xl font-bold">
                {item.number}
              </div>
              <h3 className="text-lg sm:text-xl font-bold">{item.title}</h3>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
