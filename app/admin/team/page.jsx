"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Mail,
  Linkedin,
  Twitter,
  Github,
  MapPin,
  Calendar,
  Users,
  Loader2,
} from "lucide-react"

// Move this outside the main OfficesPage component
const TeamMemberForm = ({
  isEdit = false,
  formData,
  handleInputChange,
  handleSubmit,
  handleImageUpload,
  uploadingImage,
  isSubmitting,
  resetForm,
  setIsCreateModalOpen,
  setIsEditModalOpen,
  departments,
  statuses,
}) => (
  <form onSubmit={handleSubmit} className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="name">Full Name *</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Enter full name"
          required
        />
      </div>
      <div>
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Enter email address"
          required
        />
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="role">Role *</Label>
        <Input
          id="role"
          name="role"
          value={formData.role}
          onChange={handleInputChange}
          placeholder="e.g., Senior Developer"
          required
        />
      </div>
      <div>
        <Label htmlFor="department">Department</Label>
        <select
          name="department"
          value={formData.department}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          {departments
            .filter((d) => d !== "All")
            .map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
        </select>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
          placeholder="e.g., San Francisco, CA"
        />
      </div>
      <div>
        <Label htmlFor="joinDate">Join Date</Label>
        <Input id="joinDate" name="joinDate" type="date" value={formData.joinDate} onChange={handleInputChange} />
      </div>
    </div>

    <div>
      <Label htmlFor="profileImage">Profile Image</Label>
      <div className="flex items-center gap-4">
        {formData.profileImage && (
          <img
            src={formData.profileImage || "/placeholder.svg"}
            alt="Profile preview"
            className="w-16 h-16 rounded-full object-cover"
          />
        )}
        <div className="flex-1">
          <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} />
          {uploadingImage && (
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              Uploading image...
            </div>
          )}
        </div>
      </div>
    </div>

    <div>
      <Label htmlFor="bio">Bio</Label>
      <Textarea
        id="bio"
        name="bio"
        value={formData.bio}
        onChange={handleInputChange}
        placeholder="Brief description about the team member..."
        rows={3}
        key="bio-textarea"
      />
    </div>

    <div>
      <Label htmlFor="skills">Skills (comma-separated)</Label>
      <Input
        id="skills"
        name="skills"
        value={formData.skills}
        onChange={handleInputChange}
        placeholder="React, Node.js, AWS, Leadership..."
      />
    </div>

    <div className="grid grid-cols-3 gap-4">
      <div>
        <Label htmlFor="linkedin">LinkedIn URL</Label>
        <Input
          id="linkedin"
          name="linkedin"
          value={formData.linkedin}
          onChange={handleInputChange}
          placeholder="https://linkedin.com/in/..."
        />
      </div>
      <div>
        <Label htmlFor="twitter">Twitter URL</Label>
        <Input
          id="twitter"
          name="twitter"
          value={formData.twitter}
          onChange={handleInputChange}
          placeholder="https://twitter.com/..."
        />
      </div>
      <div>
        <Label htmlFor="github">GitHub URL</Label>
        <Input
          id="github"
          name="github"
          value={formData.github}
          onChange={handleInputChange}
          placeholder="https://github.com/..."
        />
      </div>
    </div>

    <div>
      <Label htmlFor="status">Status</Label>
      <select
        name="status"
        value={formData.status}
        onChange={handleInputChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md"
      >
        {statuses
          .filter((s) => s !== "All")
          .map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
      </select>
    </div>

    <div className="flex justify-end gap-2 pt-4">
      <Button
        type="button"
        variant="outline"
        onClick={() => {
          resetForm()
          setIsCreateModalOpen(false)
          setIsEditModalOpen(false)
        }}
      >
        Cancel
      </Button>
      <Button type="submit" className="bg-[#6529B2] hover:bg-[#5420A0] text-white" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {isEdit ? "Updating..." : "Adding..."}
          </>
        ) : (
          <>{isEdit ? "Update Member" : "Add Member"}</>
        )}
      </Button>
    </div>
  </form>
)

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("All")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingMember, setEditingMember] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    department: "Engineering",
    location: "",
    joinDate: "",
    bio: "",
    skills: "",
    linkedin: "",
    twitter: "",
    github: "",
    profileImage: "",
    status: "Active",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)

  const departments = ["All", "Leadership", "Engineering", "Design", "Marketing", "Sales", "Operations"]
  const statuses = ["All", "Active", "On Leave", "Inactive"]

  const fetchTeamMembers = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/team")
      if (response.ok) {
        const data = await response.json()
        setTeamMembers(data)
      }
    } catch (error) {
      console.error("Error fetching team members:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTeamMembers()
  }, [])

  const filteredMembers = teamMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = selectedDepartment === "All" || member.department === selectedDepartment
    const matchesStatus = selectedStatus === "All" || member.status === selectedStatus
    return matchesSearch && matchesDepartment && matchesStatus
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploadingImage(true)
    try {
      const formDataUpload = new FormData()
      formDataUpload.append("file", file)
      formDataUpload.append("folder", "team_members")

      const response = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: formDataUpload,
      })

      if (response.ok) {
        const data = await response.json()
        setFormData((prev) => ({
          ...prev,
          profileImage: data.media.url,
        }))
      }
    } catch (error) {
      console.error("Error uploading image:", error)
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const skillsArray = formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean)

      const memberData = {
        ...formData,
        skills: skillsArray,
        social: {
          linkedin: formData.linkedin || null,
          twitter: formData.twitter || null,
          github: formData.github || null,
        },
      }

      const url = editingMember ? `/api/admin/team/${editingMember._id}` : "/api/admin/team"
      const method = editingMember ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(memberData),
      })

      if (response.ok) {
        await fetchTeamMembers()
        resetForm()
        setIsCreateModalOpen(false)
        setIsEditModalOpen(false)
      }
    } catch (error) {
      console.error("Error saving team member:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (member) => {
    setEditingMember(member)
    setFormData({
      name: member.name || "",
      email: member.email || "",
      role: member.role || "",
      department: member.department || "Engineering",
      location: member.location || "",
      joinDate: member.joinDate ? new Date(member.joinDate).toISOString().split("T")[0] : "",
      bio: member.bio || "",
      skills: member.skills ? member.skills.join(", ") : "",
      linkedin: member.social?.linkedin || "",
      twitter: member.social?.twitter || "",
      github: member.social?.github || "",
      profileImage: member.profileImage || "",
      status: member.status || "Active",
    })
    setIsEditModalOpen(true)
  }

  const handleDelete = async (memberId) => {
    if (!confirm("Are you sure you want to delete this team member?")) return

    try {
      const response = await fetch(`/api/admin/team/${memberId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchTeamMembers()
      }
    } catch (error) {
      console.error("Error deleting team member:", error)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      role: "",
      department: "Engineering",
      location: "",
      joinDate: "",
      bio: "",
      skills: "",
      linkedin: "",
      twitter: "",
      github: "",
      profileImage: "",
      status: "Active",
    })
    setEditingMember(null)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-200"
      case "On Leave":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Inactive":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getDepartmentColor = (department) => {
    switch (department) {
      case "Leadership":
        return "bg-purple-100 text-purple-800"
      case "Engineering":
        return "bg-blue-100 text-blue-800"
      case "Design":
        return "bg-pink-100 text-pink-800"
      case "Marketing":
        return "bg-green-100 text-green-800"
      case "Sales":
        return "bg-orange-100 text-orange-800"
      case "Operations":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
          <p className="text-gray-600 mt-1">Manage team members and their information</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#6529B2] hover:bg-[#5420A0] text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Team Member
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Team Member</DialogTitle>
              <DialogDescription>Add a new member to your team</DialogDescription>
            </DialogHeader>
            <TeamMemberForm
              isEdit={false}
              formData={formData}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              handleImageUpload={handleImageUpload}
              uploadingImage={uploadingImage}
              isSubmitting={isSubmitting}
              resetForm={resetForm}
              setIsCreateModalOpen={setIsCreateModalOpen}
              setIsEditModalOpen={setIsEditModalOpen}
              departments={departments}
              statuses={statuses}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Members</p>
                <p className="text-2xl font-bold text-gray-900">{teamMembers.length}</p>
              </div>
              <div className="p-3 bg-[#6529B2] bg-opacity-10 rounded-full">
                <Users className="w-6 h-6 text-[#6529B2]" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Members</p>
                <p className="text-2xl font-bold text-gray-900">
                  {teamMembers.filter((m) => m.status === "Active").length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Departments</p>
                <p className="text-2xl font-bold text-gray-900">{new Set(teamMembers.map((m) => m.department)).size}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Remote Workers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {teamMembers.filter((m) => m.location === "Remote").length}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <MapPin className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search team members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept} {dept !== "All" ? "Department" : ""}
                  </option>
                ))}
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status} {status !== "All" ? "Status" : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Members Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <Card key={member._id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={member.profileImage || "/placeholder.svg?height=64&width=64"}
                    alt={member.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">{member.name}</h3>
                        <p className="text-sm text-gray-600">{member.role}</p>
                      </div>
                      <Badge className={getStatusColor(member.status)}>{member.status}</Badge>
                    </div>
                    <Badge className={getDepartmentColor(member.department)} variant="secondary">
                      {member.department}
                    </Badge>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{member.bio}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    {member.email}
                  </div>
                  {member.location && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      {member.location}
                    </div>
                  )}
                  {member.joinDate && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      Joined {new Date(member.joinDate).toLocaleDateString()}
                    </div>
                  )}
                </div>

                {member.skills && member.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {member.skills.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {member.skills.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{member.skills.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {member.social?.linkedin && (
                      <Button size="sm" variant="outline" className="p-2" asChild>
                        <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer">
                          <Linkedin className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                    {member.social?.twitter && (
                      <Button size="sm" variant="outline" className="p-2" asChild>
                        <a href={member.social.twitter} target="_blank" rel="noopener noreferrer">
                          <Twitter className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                    {member.social?.github && (
                      <Button size="sm" variant="outline" className="p-2" asChild>
                        <a href={member.social.github} target="_blank" rel="noopener noreferrer">
                          <Github className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(member)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDelete(member._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Team Member</DialogTitle>
            <DialogDescription>Update team member information</DialogDescription>
          </DialogHeader>
          <TeamMemberForm
            isEdit={true}
            formData={formData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            handleImageUpload={handleImageUpload}
            uploadingImage={uploadingImage}
            isSubmitting={isSubmitting}
            resetForm={resetForm}
            setIsCreateModalOpen={setIsCreateModalOpen}
            setIsEditModalOpen={setIsEditModalOpen}
            departments={departments}
            statuses={statuses}
          />
        </DialogContent>
      </Dialog>

      {filteredMembers.length === 0 && !loading && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Users className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No team members found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
