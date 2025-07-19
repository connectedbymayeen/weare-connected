"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Upload, Loader2, X, FileText, CheckCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function JobApplicationForm({ job, isOpen, onClose }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    linkedin: "",
    portfolio: "",
    coverLetter: "",
    experience: "",
    expectedSalary: "",
    availableFrom: "",
    agreeToTerms: false,
  })
  const [files, setFiles] = useState({
    resume: null,
    coverLetterFile: null,
    portfolio: null,
  })
  const [uploadProgress, setUploadProgress] = useState({})
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleCheckboxChange = (checked) => {
    setFormData((prev) => ({ ...prev, agreeToTerms: checked }))
    if (errors.agreeToTerms) {
      setErrors((prev) => ({ ...prev, agreeToTerms: "" }))
    }
  }

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, [fileType]: "File size must be less than 5MB" }))
        return
      }

      // Validate file type
      const allowedTypes = {
        resume: [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
        coverLetterFile: [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
        portfolio: ["application/pdf", "image/jpeg", "image/png", "image/gif"],
      }

      if (!allowedTypes[fileType].includes(file.type)) {
        setErrors((prev) => ({ ...prev, [fileType]: "Invalid file type" }))
        return
      }

      setFiles((prev) => ({ ...prev, [fileType]: file }))
      setErrors((prev) => ({ ...prev, [fileType]: "" }))
    }
  }

  const removeFile = (fileType) => {
    setFiles((prev) => ({ ...prev, [fileType]: null }))
  }

  const uploadFileToCloudinary = async (file, fileType) => {
    try {
      setUploadProgress((prev) => ({ ...prev, [fileType]: 0 }))

      // Convert file to base64
      const base64 = await new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.readAsDataURL(file)
      })

      const response = await fetch("/api/cloudinary/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: base64,
          folder: "job_applications",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to upload file")
      }

      const data = await response.json()
      setUploadProgress((prev) => ({ ...prev, [fileType]: 100 }))
      return data.secure_url
    } catch (error) {
      console.error("Error uploading file:", error)
      setUploadProgress((prev) => ({ ...prev, [fileType]: 0 }))
      throw error
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid"
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
    if (!formData.coverLetter.trim()) newErrors.coverLetter = "Cover letter is required"
    if (!files.resume) newErrors.resume = "Resume is required"
    if (!formData.agreeToTerms) newErrors.agreeToTerms = "You must agree to the terms"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      setIsSubmitting(true)

      // Upload files to Cloudinary
      const uploadedFiles = {}

      for (const [fileType, file] of Object.entries(files)) {
        if (file) {
          uploadedFiles[fileType] = await uploadFileToCloudinary(file, fileType)
        }
      }

      // Submit application
      const applicationData = {
        jobId: job.id,
        jobTitle: job.title,
        jobSlug: job.slug,
        applicantInfo: formData,
        attachments: uploadedFiles,
        appliedAt: new Date().toISOString(),
        status: "pending",
      }

      const response = await fetch("/api/job-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(applicationData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to submit application")
      }

      setSubmitSuccess(true)
    } catch (error) {
      console.error("Error submitting application:", error)
      setErrors({ submit: error.message })
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      linkedin: "",
      portfolio: "",
      coverLetter: "",
      experience: "",
      expectedSalary: "",
      availableFrom: "",
      agreeToTerms: false,
    })
    setFiles({
      resume: null,
      coverLetterFile: null,
      portfolio: null,
    })
    setErrors({})
    setSubmitSuccess(false)
    setUploadProgress({})
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  if (submitSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <div className="text-center py-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Application Submitted!</h3>
            <p className="text-gray-600 mb-6">
              Thank you for applying to {job.title}. We'll review your application and get back to you soon.
            </p>
            <Button onClick={handleClose} className="bg-purple-700 hover:bg-purple-800">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Apply for {job.title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />
                {errors.fullName && <p className="text-sm text-red-500">{errors.fullName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                />
                {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn Profile</Label>
                <Input
                  id="linkedin"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="portfolio">Portfolio/Website</Label>
              <Input
                id="portfolio"
                name="portfolio"
                value={formData.portfolio}
                onChange={handleChange}
                placeholder="https://yourportfolio.com"
              />
            </div>
          </div>

          {/* Professional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Professional Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="experience">Years of Experience</Label>
                <Input
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="e.g. 5 years"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expectedSalary">Expected Salary</Label>
                <Input
                  id="expectedSalary"
                  name="expectedSalary"
                  value={formData.expectedSalary}
                  onChange={handleChange}
                  placeholder="e.g. $120k - $150k"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="availableFrom">Available From</Label>
              <Input
                id="availableFrom"
                name="availableFrom"
                type="date"
                value={formData.availableFrom}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Cover Letter */}
          <div className="space-y-2">
            <Label htmlFor="coverLetter">
              Cover Letter <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="coverLetter"
              name="coverLetter"
              value={formData.coverLetter}
              onChange={handleChange}
              placeholder="Tell us why you're interested in this position and what makes you a great fit..."
              className="min-h-[120px]"
            />
            {errors.coverLetter && <p className="text-sm text-red-500">{errors.coverLetter}</p>}
          </div>

          {/* File Uploads */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Documents</h3>

            {/* Resume Upload */}
            <div className="space-y-2">
              <Label>
                Resume/CV <span className="text-red-500">*</span>
              </Label>
              {!files.resume ? (
                <div className="border border-input rounded-md p-2">
                  <label
                    htmlFor="resume-upload"
                    className="flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <Upload className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Upload Resume (PDF, DOC, DOCX - Max 5MB)</span>
                    <input
                      id="resume-upload"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, "resume")}
                    />
                  </label>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 border rounded-md bg-gray-50">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-600" />
                    <span className="text-sm">{files.resume.name}</span>
                    {uploadProgress.resume > 0 && uploadProgress.resume < 100 && (
                      <span className="text-xs text-blue-600">Uploading... {uploadProgress.resume}%</span>
                    )}
                  </div>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeFile("resume")}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              {errors.resume && <p className="text-sm text-red-500">{errors.resume}</p>}
            </div>

            {/* Cover Letter File Upload (Optional) */}
            <div className="space-y-2">
              <Label>Cover Letter Document (Optional)</Label>
              {!files.coverLetterFile ? (
                <div className="border border-input rounded-md p-2">
                  <label
                    htmlFor="cover-letter-upload"
                    className="flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <Upload className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Upload Cover Letter (PDF, DOC, DOCX - Max 5MB)
                    </span>
                    <input
                      id="cover-letter-upload"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, "coverLetterFile")}
                    />
                  </label>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 border rounded-md bg-gray-50">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-600" />
                    <span className="text-sm">{files.coverLetterFile.name}</span>
                    {uploadProgress.coverLetterFile > 0 && uploadProgress.coverLetterFile < 100 && (
                      <span className="text-xs text-blue-600">Uploading... {uploadProgress.coverLetterFile}%</span>
                    )}
                  </div>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeFile("coverLetterFile")}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              {errors.coverLetterFile && <p className="text-sm text-red-500">{errors.coverLetterFile}</p>}
            </div>

            {/* Portfolio Upload (Optional) */}
            <div className="space-y-2">
              <Label>Portfolio Document (Optional)</Label>
              {!files.portfolio ? (
                <div className="border border-input rounded-md p-2">
                  <label
                    htmlFor="portfolio-upload"
                    className="flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <Upload className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Upload Portfolio (PDF, JPG, PNG - Max 5MB)</span>
                    <input
                      id="portfolio-upload"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.gif"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, "portfolio")}
                    />
                  </label>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 border rounded-md bg-gray-50">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-600" />
                    <span className="text-sm">{files.portfolio.name}</span>
                    {uploadProgress.portfolio > 0 && uploadProgress.portfolio < 100 && (
                      <span className="text-xs text-blue-600">Uploading... {uploadProgress.portfolio}%</span>
                    )}
                  </div>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeFile("portfolio")}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              {errors.portfolio && <p className="text-sm text-red-500">{errors.portfolio}</p>}
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-start space-x-2">
            <Checkbox id="terms" checked={formData.agreeToTerms} onCheckedChange={handleCheckboxChange} />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to the privacy policy and terms of service <span className="text-red-500">*</span>
              </label>
              <p className="text-sm text-muted-foreground">
                Your data will be processed according to our privacy policy.
              </p>
            </div>
          </div>
          {errors.agreeToTerms && <p className="text-sm text-red-500">{errors.agreeToTerms}</p>}

          {/* Submit Error */}
          {errors.submit && <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">{errors.submit}</div>}

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-purple-700 hover:bg-purple-800 flex-1">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Application"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
