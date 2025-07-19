"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowRight,
  Building2,
  Smartphone,
  Globe,
  Zap,
  Users,
  TrendingUp,
  ChevronRight,
  Sparkles,
  Rocket,
  Lightbulb,
  Target,
} from "lucide-react"
import Link from "next/link"

export default function InnovationEcosystemSection() {
  const [activeNode, setActiveNode] = useState(null)
  const [activeSector, setActiveSector] = useState("all")
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

  const ecosystemNodes = [
    {
      id: "connected",
      title: "Connected",
      category: "core",
      x: 50,
      y: 50,
      size: 80,
      color: "from-purple-500 to-blue-600",
      icon: <Sparkles className="w-8 h-8" />,
      description: "Innovation hub launching bold new ventures",
      status: "Established",
      connections: ["fintech", "ecommerce", "ai", "mobile", "enterprise", "agency"],
    },
    {
      id: "fintech",
      title: "FinTech",
      category: "finance",
      x: 20,
      y: 25,
      size: 60,
      color: "from-green-500 to-emerald-600",
      icon: <TrendingUp className="w-6 h-6" />,
      description: "Reimagining financial experiences",
      status: "Early Stage",
      connections: ["connected", "enterprise"],
    },
    {
      id: "ecommerce",
      title: "E-Commerce",
      category: "retail",
      x: 80,
      y: 30,
      size: 65,
      color: "from-orange-500 to-red-600",
      icon: <Building2 className="w-6 h-6" />,
      description: "Next-gen retail experiences",
      status: "Concept",
      connections: ["connected", "mobile", "ai"],
    },
    {
      id: "ai",
      title: "AI & ML",
      category: "technology",
      x: 30,
      y: 75,
      size: 70,
      color: "from-cyan-500 to-blue-600",
      icon: <Zap className="w-6 h-6" />,
      description: "Intelligent automation solutions",
      status: "Prototype",
      connections: ["connected", "ecommerce", "enterprise"],
    },
    {
      id: "mobile",
      title: "Mobile Apps",
      category: "technology",
      x: 75,
      y: 70,
      size: 55,
      color: "from-pink-500 to-purple-600",
      icon: <Smartphone className="w-6 h-6" />,
      description: "Cross-platform mobile experiences",
      status: "Development",
      connections: ["connected", "ecommerce"],
    },
    {
      id: "enterprise",
      title: "Enterprise",
      category: "business",
      x: 15,
      y: 55,
      size: 58,
      color: "from-indigo-500 to-purple-600",
      icon: <Users className="w-6 h-6" />,
      description: "Scalable business solutions",
      status: "Planning",
      connections: ["connected", "fintech", "ai"],
    },
    {
      id: "agency",
      title: "Agency",
      category: "agency",
      x: 60,
      y: 25,
      size: 62,
      color: "from-pink-500 to-rose-600",
      icon: <Rocket className="w-6 h-6" />,
      description: "Creative solutions and strategic partnerships",
      status: "Scaling",
      connections: ["connected", "ecommerce", "mobile"],
    },
  ]

  const sectors = [
    {
      id: "finance",
      title: "Financial Services",
      description: "Reimagining how people interact with money",
      icon: <TrendingUp className="w-5 h-5" />,
      color: "text-green-400",
      vision: "Creating accessible financial tools for everyone",
      stage: "Concept Development",
    },
    {
      id: "retail",
      title: "Retail & Commerce",
      description: "Building the future of shopping experiences",
      icon: <Building2 className="w-5 h-5" />,
      color: "text-orange-400",
      vision: "Seamless omnichannel experiences that delight customers",
      stage: "Rapid Growth",
    },
    {
      id: "technology",
      title: "Deep Tech",
      description: "Pioneering AI and mobile innovations",
      icon: <Zap className="w-5 h-5" />,
      color: "text-cyan-400",
      vision: "Breakthrough technologies that solve complex problems",
      stage: "Research & Development",
    },
    {
      id: "business",
      title: "Enterprise Solutions",
      description: "Designing platforms for modern businesses",
      icon: <Users className="w-5 h-5" />,
      color: "text-indigo-400",
      vision: "Empowering organizations with next-gen tools",
      stage: "Market Research",
    },
    {
      id: "agency",
      title: "Agency",
      description: "Creative solutions and strategic partnerships",
      icon: <Rocket className="w-5 h-5" />,
      color: "text-pink-400",
      vision: "Delivering exceptional creative and strategic services",
      stage: "Scaling",
    },
  ]

  const resources = [
    {
      title: "Discover",
      description: "We identify powerful ideas, emerging trends, and untapped opportunities ready to scale.",
      icon: <Lightbulb className="w-5 h-5" />,
    },
    {
      title: "Build",
      description: "We develop brands, products, and platforms with speed, precision, and bold execution.",
      icon: <Target className="w-5 h-5" />,
    },
    {
      title: "Elevate",
      description: "We grow ventures through strategic design, marketing, and long-term vision.",
      icon: <TrendingUp className="w-5 h-5" />,
    },
    {
      title: "Lead",
      description: "We set new standards, shape culture, and redefine what's possible across industries.",
      icon: <Rocket className="w-5 h-5" />,
    },
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.2 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  const getConnectionPath = (from, to) => {
    return `M ${from.x} ${from.y} Q ${(from.x + to.x) / 2} ${(from.y + to.y) / 2 - 10} ${to.x} ${to.y}`
  }

  const filteredNodes =
    activeSector === "all"
      ? ecosystemNodes
      : ecosystemNodes.filter((node) => node.category === activeSector || node.id === "connected")

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-24 bg-gradient-to-br from-gray-900 via-black to-gray-900"
    >
      {/* Background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.1),transparent_50%)]"></div>

      <div className="container mx-auto relative z-10 px-4 md:px-6 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-6">
            <Rocket className="w-4 h-4 mr-2" />
            Emerging Ventures
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 font-syne">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
              Tomorrow's Innovations
            </span>
            <br />
            <span className="text-white">Taking Shape Today</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore our ecosystem of emerging ventures and bold ideas that are just beginning their journey from concept
            to reality.
          </p>
        </motion.div>

        {/* Main ecosystem visualization */}
        <div className="grid lg:grid-cols-3 gap-12 mb-16">
          {/* Ecosystem Map */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isVisible ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative h-[500px] rounded-2xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm overflow-hidden"
            >
              {/* SVG connections */}
              <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
                {filteredNodes.map((node) =>
                  node.connections
                    .filter((connId) => filteredNodes.find((n) => n.id === connId))
                    .map((connId) => {
                      const connectedNode = filteredNodes.find((n) => n.id === connId)
                      if (!connectedNode) return null

                      return (
                        <motion.path
                          key={`${node.id}-${connId}`}
                          d={getConnectionPath(node, connectedNode)}
                          stroke="url(#connectionGradient)"
                          strokeWidth="2"
                          strokeDasharray="5,5"
                          fill="none"
                          opacity={activeNode && (activeNode === node.id || activeNode === connId) ? 0.8 : 0.3}
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 1.5, delay: 0.5 }}
                        />
                      )
                    }),
                )}
                <defs>
                  <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Ecosystem nodes */}
              {filteredNodes.map((node, index) => (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="absolute cursor-pointer group"
                  style={{
                    left: `${node.x}%`,
                    top: `${node.y}%`,
                    transform: "translate(-50%, -50%)",
                    zIndex: activeNode === node.id ? 10 : 2,
                  }}
                  onMouseEnter={() => setActiveNode(node.id)}
                  onMouseLeave={() => setActiveNode(null)}
                >
                  <div
                    className={`relative flex items-center justify-center rounded-full bg-gradient-to-br ${node.color} shadow-lg transition-all duration-300 group-hover:scale-110 ${
                      node.id !== "connected" ? "bg-opacity-70" : ""
                    }`}
                    style={{ width: node.size, height: node.size }}
                  >
                    <div className="text-white">{node.icon}</div>

                    {/* Node label */}
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">{node.title}</div>
                    </div>

                    {/* Hover tooltip */}
                    <AnimatePresence>
                      {activeNode === node.id && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-black/90 backdrop-blur-sm border border-gray-700 rounded-lg p-3 min-w-[200px] z-20"
                        >
                          <div className="text-sm font-medium text-white mb-1">{node.title}</div>
                          <div className="text-xs text-gray-300 mb-1">{node.description}</div>
                          <div className="text-xs inline-flex items-center px-2 py-1 rounded-full bg-gray-800">
                            <span
                              className={`w-2 h-2 rounded-full mr-1 ${
                                node.id === "connected" ? "bg-green-400" : "bg-blue-400"
                              }`}
                            ></span>
                            <span className="text-gray-400">Status: {node.status}</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}

              {/* Legend */}
              <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg p-3 border border-gray-800">
                <div className="text-xs text-gray-400 mb-2">Venture Status</div>
                <div className="space-y-1">
                  <div className="flex items-center text-xs text-gray-300">
                    <span className="w-2 h-2 rounded-full bg-green-400 mr-2"></span>
                    <span>Established</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-300">
                    <span className="w-2 h-2 rounded-full bg-blue-400 mr-2"></span>
                    <span>In Development</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sector breakdown */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-6">Emerging Sectors</h3>

            <div className="space-y-3">
              <button
                onClick={() => setActiveSector("all")}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
                  activeSector === "all"
                    ? "border-purple-500 bg-purple-500/10"
                    : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-white">All Ventures</div>
                    <div className="text-sm text-gray-400">Complete ecosystem view</div>
                  </div>
                  <Globe className="w-5 h-5 text-purple-400" />
                </div>
              </button>

              {sectors.map((sector) => (
                <button
                  key={sector.id}
                  onClick={() => setActiveSector(sector.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
                    activeSector === sector.id
                      ? "border-purple-500 bg-purple-500/10"
                      : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className={sector.color}>{sector.icon}</div>
                        <div className="font-medium text-white">{sector.title}</div>
                      </div>
                      <div className="text-sm text-gray-400 mb-2">{sector.description}</div>
                      <div className="flex flex-col gap-1 text-xs">
                        <div className="flex items-center gap-2">
                          <Lightbulb className="w-3 h-3 text-yellow-400" />
                          <span className="text-gray-300">Vision: {sector.vision}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Target className="w-3 h-3 text-blue-400" />
                          <span className="text-gray-300">Stage: {sector.stage}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Resource hub */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Our Process</h3>
              <p className="text-gray-400">How we transform ideas into industry-leading ventures</p>
            </div>
            <Link
              href="/ventures"
              className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors"
            >
              Explore Our Approach
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resources.map((resource, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="p-6 rounded-xl border border-gray-700 bg-gray-800/50 hover:border-purple-500/50 transition-all duration-300 group-hover:bg-gray-800/70 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 rounded-full bg-purple-500/10 text-purple-400">{resource.icon}</div>
                  </div>
                  <h4 className="font-medium text-white mb-3 group-hover:text-purple-300 transition-colors">
                    {resource.title}
                  </h4>
                  <p className="text-sm text-gray-400 flex-1">{resource.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16"
        >
          <h3 className="text-2xl font-bold text-white mb-4">Be Part of What's Next</h3>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Join us at the beginning of something extraordinary. Connect with our team to explore collaboration
            opportunities in our emerging ventures.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-blue-600 text-white font-medium hover:scale-105 transition-transform duration-300 shadow-lg shadow-purple-500/25"
          >
            Connect With Our Team
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
