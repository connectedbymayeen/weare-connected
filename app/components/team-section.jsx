"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import { Linkedin, Twitter, Github, Mail, MapPin, Calendar, Award } from "lucide-react"
import Link from "next/link"

export default function TeamSection({ content }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [selectedDepartment, setSelectedDepartment] = useState("All")

  const [teamData, setTeamData] = useState({
    title: "Meet Our Team",
    subtitle: "The brilliant minds behind our success",
    members: [],
  })

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const response = await fetch("/api/content/team")
        if (response.ok) {
          const data = await response.json()
          
          setTeamData((prev) => ({
            ...prev,
            members: data,
          }))
        }
      } catch (error) {
        console.error("Error fetching team data:", error)
      }
    }

    fetchTeamData()

    if (content?.team) {
      setTeamData((prev) => ({
        ...prev,
        title: content.team.title || prev.title,
        subtitle: content.team.subtitle || prev.subtitle,
      }))
    }
  }, [content])

  // Get unique departments
  const departments = ["All", ...new Set(teamData.members?.map((member) => member.department) || [])]

  // Filter members by department
  const filteredMembers =
    selectedDepartment === "All"
      ? teamData.members || []
      : teamData.members?.filter((member) => member.department === selectedDepartment) || []

  // Only show active members
  const activeMembers = filteredMembers.filter((member) => member.status === "Active")

  if (!teamData.members || teamData.members.length === 0) {
    return null
  }

  const getDepartmentColor = (department) => {
    switch (department) {
      case "Leadership":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "Engineering":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Design":
        return "bg-pink-100 text-pink-800 border-pink-200"
      case "Marketing":
        return "bg-green-100 text-green-800 border-green-200"
      case "Sales":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "Operations":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <section ref={ref} className="w-full py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center justify-center space-y-4 text-center mx-auto mb-12"
        >
          <div className="space-y-2 max-w-4xl mx-auto">
            <div className="inline-block rounded-lg bg-accent px-3 py-1 text-sm font-medium text-primary">Our Team</div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter">
              {teamData.title}
            </h2>
            <p className="max-w-[900px] mx-auto text-muted-foreground text-base sm:text-lg md:text-xl leading-relaxed px-4">
              {teamData.subtitle}
            </p>
          </div>
        </motion.div>

        {/* Department Filter */}
        {departments.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-2 mb-12"
          >
            {departments.map((department) => (
              <button
                key={department}
                onClick={() => setSelectedDepartment(department)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedDepartment === department
                    ? "bg-primary text-primary-foreground shadow-lg transform scale-105"
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-primary/30"
                }`}
              >
                {department}
              </button>
            ))}
          </motion.div>
        )}

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {activeMembers.map((member, index) => (
            <motion.div
              key={member._id || index}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              className="group"
            >
              <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 overflow-hidden border border-gray-100">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Profile Image */}
                <div className="relative p-6 pb-4">
                  <div className="relative mx-auto w-32 h-32 mb-4">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/70 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
                    <img
                      src={member.profileImage || "/placeholder.svg?height=128&width=128"}
                      alt={member.name}
                      className="w-full h-full object-cover rounded-full border-4 border-white shadow-lg group-hover:border-primary/20 transition-all duration-500"
                    />
                    {/* Status Indicator */}
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    </div>
                  </div>

                  {/* Department Badge */}
                  <div className="absolute top-4 right-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getDepartmentColor(member.department)}`}
                    >
                      {member.department}
                    </span>
                  </div>
                </div>

                {/* Member Info */}
                <div className="px-6 pb-6">
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors duration-300">
                      {member.name}
                    </h3>
                    <p className="text-primary font-medium text-sm mb-2">{member.role}</p>
                    <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">{member.bio}</p>
                  </div>

                  {/* Member Details */}
                  <div className="space-y-2 mb-4 text-xs text-gray-500">
                    {member.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3" />
                        <span>{member.location}</span>
                      </div>
                    )}
                    {member.joinDate && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        <span>
                          Joined{" "}
                          {new Date(member.joinDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Skills */}
                  {member.skills && member.skills.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {member.skills.slice(0, 3).map((skill, skillIndex) => (
                          <span
                            key={skillIndex}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                        {member.skills.length > 3 && (
                          <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium">
                            +{member.skills.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Social Links */}
                  <div className="flex justify-center gap-3">
                    {member.email && (
                      <Link
                        href={`mailto:${member.email}`}
                        className="w-8 h-8 bg-gray-100 hover:bg-primary hover:text-white rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                        title="Email"
                      >
                        <Mail className="w-4 h-4" />
                      </Link>
                    )}
                    {member.social?.linkedin && (
                      <Link
                        href={member.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 bg-gray-100 hover:bg-blue-600 hover:text-white rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                        title="LinkedIn"
                      >
                        <Linkedin className="w-4 h-4" />
                      </Link>
                    )}
                    {member.social?.twitter && (
                      <Link
                        href={member.social.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 bg-gray-100 hover:bg-blue-400 hover:text-white rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                        title="Twitter"
                      >
                        <Twitter className="w-4 h-4" />
                      </Link>
                    )}
                    {member.social?.github && (
                      <Link
                        href={member.social.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 bg-gray-100 hover:bg-gray-800 hover:text-white rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                        title="GitHub"
                      >
                        <Github className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/20 rounded-2xl transition-all duration-500" />
              </div>
            </motion.div>
          ))}
        </div>

        {activeMembers.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 mb-4">
              <Award className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No team members found</h3>
            <p className="text-gray-500">Try selecting a different department or check back later.</p>
          </motion.div>
        )}
      </div>
    </section>
  )
}
