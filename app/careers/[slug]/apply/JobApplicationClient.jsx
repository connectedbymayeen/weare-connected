"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Loader2, X, FileText, CheckCircle, ArrowLeft, MapPin, Briefcase, DollarSign } from "lucide-react"
import Link from "next/link"

export default function JobApplicationClient({ job }) {
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

  useEffect(() => {
    console.log("JobApplicationClient loaded for job:", job.title, "slug:", job.slug)
  }, [job])

  const testNavigation = () => {
    console.log("Test button clicked - job slug:", job.slug)
    console.log("Current URL would be:", `/careers/${job.slug}/apply`)
  }

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
      console.log(`Starting upload for ${fileType}:`, {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
      })

      setUploadProgress((prev) => ({ ...prev, [fileType]: 0 }))

      // Convert file to base64
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
        reader.readAsDataURL(file)
      })

      console.log(`Base64 conversion complete for ${fileType}`)
      setUploadProgress((prev) => ({ ...prev, [fileType]: 25 }))

      const uploadData = {
        image: base64,
        folder: "job_applications",
        requireAuth: false, // Don't require authentication for job applications
      }

      console.log(`Sending upload request for ${fileType}...`)

      const response = await fetch("/api/cloudinary/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(uploadData),
      })

      console.log(`Upload response status for ${fileType}:`, response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error(`Upload failed for ${fileType}:`, errorData)
        throw new Error(errorData.error || `Failed to upload ${fileType}`)
      }

      const data = await response.json()
      console.log(`Upload successful for ${fileType}:`, data.secure_url)

      setUploadProgress((prev) => ({ ...prev, [fileType]: 100 }))
      return data.secure_url
    } catch (error) {
      console.error(`Error uploading ${fileType}:`, error)
      setUploadProgress((prev) => ({ ...prev, [fileType]: 0 }))
      throw new Error(`Failed to upload ${fileType}: ${error.message}`)
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

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <Card>
            <CardContent className="text-center py-12">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Application Submitted Successfully!</h1>
              <p className="text-lg text-gray-600 mb-8">
                Thank you for applying to <strong>{job.title}</strong>. We've received your application and will review
                it carefully. We'll be in touch soon!
              </p>
              <div className="space-y-4">
                <Button asChild className="bg-purple-700 hover:bg-purple-800">
                  <Link href={`/careers/${job.slug}`}>Back to Job Details</Link>
                </Button>
                <div>
                  <Button variant="outline" asChild>
                    <Link href="/careers">Browse More Jobs</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Button variant="ghost" asChild className="flex items-center text-gray-600 hover:text-gray-900">
              <Link href={`/careers/${job.slug}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Job Details
              </Link>
            </Button>
          </div>
          <div className="mt-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Apply for {job.title}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center">
                <Briefcase className="h-4 w-4 mr-1" />
                <span>{job.type}</span>
              </div>
              {job.salary && (
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-1" />
                  <span>{job.salary}</span>
                </div>
              )}
            </div>
            <div className="mt-3">
              <Badge className="bg-purple-100 text-purple-800">{job.department}</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* DEBUG: Test button - remove after testing */}
      {/* <div className="bg-yellow-100 border border-yellow-400 p-4 rounded-md mb-4">
        <p className="text-sm text-yellow-800 mb-2">Debug Info:</p>
        <p className="text-xs text-yellow-700">Job Slug: {job.slug}</p>
        <p className="text-xs text-yellow-700">Current Path: /careers/{job.slug}/apply</p>
        <Button onClick={testNavigation} variant="outline" size="sm">
          Test Console Log
        </Button>
      </div> */}

      {/* Application Form */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Application Form</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Personal Information */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Personal Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Professional Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Cover Letter</h3>
                    <div className="space-y-2">
                      <Label htmlFor="coverLetter">
                        Why are you interested in this position? <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="coverLetter"
                        name="coverLetter"
                        value={formData.coverLetter}
                        onChange={handleChange}
                        placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                        className="min-h-[150px]"
                      />
                      {errors.coverLetter && <p className="text-sm text-red-500">{errors.coverLetter}</p>}
                    </div>
                  </div>

                  {/* File Uploads */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Documents</h3>

                    {/* Resume Upload */}
                    <div className="space-y-2">
                      <Label>
                        Resume/CV <span className="text-red-500">*</span>
                      </Label>
                      {!files.resume ? (
                        <div className="border border-input rounded-md p-2">
                          <label
                            htmlFor="resume-upload"
                            className="flex items-center justify-center gap-2 p-6 border-2 border-dashed rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
                          >
                            <Upload className="h-6 w-6 text-muted-foreground" />
                            <div className="text-center">
                              <span className="text-sm font-medium text-muted-foreground">Upload Resume</span>
                              <p className="text-xs text-muted-foreground mt-1">PDF, DOC, DOCX - Max 5MB</p>
                            </div>
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
                        <div className="flex items-center justify-between p-4 border rounded-md bg-gray-50">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-gray-600" />
                            <div>
                              <span className="text-sm font-medium">{files.resume.name}</span>
                              {uploadProgress.resume > 0 && uploadProgress.resume < 100 && (
                                <p className="text-xs text-blue-600">Uploading... {uploadProgress.resume}%</p>
                              )}
                            </div>
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
                            <div className="text-center">
                              <span className="text-sm text-muted-foreground">Upload Cover Letter</span>
                              <p className="text-xs text-muted-foreground mt-1">PDF, DOC, DOCX - Max 5MB</p>
                            </div>
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
                        <div className="flex items-center justify-between p-4 border rounded-md bg-gray-50">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-gray-600" />
                            <span className="text-sm font-medium">{files.coverLetterFile.name}</span>
                            {uploadProgress.coverLetterFile > 0 && uploadProgress.coverLetterFile < 100 && (
                              <span className="text-xs text-blue-600">
                                Uploading... {uploadProgress.coverLetterFile}%
                              </span>
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
                            <div className="text-center">
                              <span className="text-sm text-muted-foreground">Upload Portfolio</span>
                              <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG - Max 5MB</p>
                            </div>
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
                        <div className="flex items-center justify-between p-4 border rounded-md bg-gray-50">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-gray-600" />
                            <span className="text-sm font-medium">{files.portfolio.name}</span>
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
                  <div className="space-y-6">
                    <div className="flex items-start space-x-3">
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
                  </div>

                  {/* Submit Error */}
                  {errors.submit && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md text-sm">
                      {errors.submit}
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="flex gap-4 pt-6 border-t">
                    <Button type="button" variant="outline" asChild className="flex-1">
                      <Link href={`/careers/${job.slug}`}>Cancel</Link>
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="bg-purple-700 hover:bg-purple-800 flex-1">
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting Application...
                        </>
                      ) : (
                        "Submit Application"
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Job Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Job Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">{job.title}</h4>
                  <p className="text-sm text-gray-600">{job.department}</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium">{job.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium">{job.type}</span>
                  </div>
                  {job.salary && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Salary:</span>
                      <span className="font-medium">{job.salary}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Experience:</span>
                    <span className="font-medium">{job.experienceLevel}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Application Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Application Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Tailor your cover letter to highlight relevant experience for this specific role.</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Ensure your resume is up-to-date and clearly formatted.</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Include links to your portfolio or relevant work samples if applicable.</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Double-check all information before submitting your application.</p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Questions?</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p className="text-gray-600 mb-3">
                  If you have any questions about this position or the application process, feel free to reach out.
                </p>
                <Button variant="outline" size="sm" asChild className="w-full">
                  <Link href="/contact">Contact HR Team</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
