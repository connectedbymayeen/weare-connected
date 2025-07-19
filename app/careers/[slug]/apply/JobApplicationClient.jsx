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

  // Initialize form data based on job's form fields
  const [formData, setFormData] = useState(() => {
    const initialData = {
      agreeToTerms: false,
    }

    // Initialize form fields from job configuration
    if (job.applicationFormFields && Array.isArray(job.applicationFormFields)) {
      job.applicationFormFields.forEach((field) => {
        if (field.visible) {
          initialData[field.id] = field.type === "checkbox" ? false : ""
        }
      })
    }

    return initialData
  })

  const [files, setFiles] = useState({})
  const [uploadProgress, setUploadProgress] = useState({})
  const [errors, setErrors] = useState({})

  useEffect(() => {
    console.log("=== JobApplicationClient LOADED ===")
    console.log("Job title:", job.title)
    console.log("Job slug:", job.slug)
    console.log("Job applicationFormFields:", job.applicationFormFields)
    console.log("Form fields count:", job.applicationFormFields?.length || 0)
    console.log("Form data initialized:", formData)
    console.log("=== END LOAD ===")
  }, [job, formData])

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

  const handleFileChange = (e, fieldId) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, [fieldId]: "File size must be less than 5MB" }))
        return
      }

      // Validate file type based on field
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
        portfolioFile: ["application/pdf", "image/jpeg", "image/png", "image/gif"],
      }

      const fieldAllowedTypes = allowedTypes[fieldId] || allowedTypes.resume

      if (!fieldAllowedTypes.includes(file.type)) {
        setErrors((prev) => ({ ...prev, [fieldId]: "Invalid file type" }))
        return
      }

      setFiles((prev) => ({ ...prev, [fieldId]: file }))
      setErrors((prev) => ({ ...prev, [fieldId]: "" }))
    }
  }

  const removeFile = (fieldId) => {
    setFiles((prev) => ({ ...prev, [fieldId]: null }))
  }

  const uploadFileToCloudinary = async (file, fieldId) => {
    try {
      console.log(`Starting upload for ${fieldId}:`, {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
      })

      setUploadProgress((prev) => ({ ...prev, [fieldId]: 0 }))

      // Convert file to base64
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
        reader.readAsDataURL(file)
      })

      console.log(`Base64 conversion complete for ${fieldId}`)
      setUploadProgress((prev) => ({ ...prev, [fieldId]: 25 }))

      const uploadData = {
        image: base64,
        folder: "job_applications",
        requireAuth: false,
      }

      console.log(`Sending upload request for ${fieldId}...`)

      const response = await fetch("/api/cloudinary/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(uploadData),
      })

      console.log(`Upload response status for ${fieldId}:`, response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error(`Upload failed for ${fieldId}:`, errorData)
        throw new Error(errorData.error || `Failed to upload ${fieldId}`)
      }

      const data = await response.json()
      console.log(`Upload successful for ${fieldId}:`, data.secure_url)

      setUploadProgress((prev) => ({ ...prev, [fieldId]: 100 }))
      return data.secure_url
    } catch (error) {
      console.error(`Error uploading ${fieldId}:`, error)
      setUploadProgress((prev) => ({ ...prev, [fieldId]: 0 }))
      throw new Error(`Failed to upload ${fieldId}: ${error.message}`)
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Validate custom form fields
    if (job.applicationFormFields && Array.isArray(job.applicationFormFields)) {
      job.applicationFormFields.forEach((field) => {
        if (field.visible && field.required) {
          if (field.type === "file") {
            if (!files[field.id]) {
              newErrors[field.id] = `${field.label} is required`
            }
          } else if (!formData[field.id] || !formData[field.id].toString().trim()) {
            newErrors[field.id] = `${field.label} is required`
          }
        }
      })
    }

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

      for (const [fieldId, file] of Object.entries(files)) {
        if (file) {
          uploadedFiles[fieldId] = await uploadFileToCloudinary(file, fieldId)
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

  // Group fields by category
  const groupedFields = {
    personal: [],
    professional: [],
    documents: [],
  }

  console.log("=== GROUPING FIELDS ===")
  console.log("Available applicationFormFields:", job.applicationFormFields)

  if (job.applicationFormFields && Array.isArray(job.applicationFormFields)) {
    job.applicationFormFields.forEach((field) => {
      console.log(`Processing field: ${field.id}, visible: ${field.visible}, category: ${field.category}`)
      if (field.visible && groupedFields[field.category]) {
        groupedFields[field.category].push(field)
      }
    })
  }

  console.log("Grouped fields:", groupedFields)
  console.log("=== END GROUPING ===")

  const renderField = (field) => {
    if (!field.visible) return null

    console.log(`Rendering field: ${field.id} (${field.type})`)

    switch (field.type) {
      case "textarea":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Textarea
              id={field.id}
              name={field.id}
              value={formData[field.id] || ""}
              onChange={handleChange}
              placeholder={`Enter your ${field.label.toLowerCase()}`}
              className="min-h-[150px]"
            />
            {errors[field.id] && <p className="text-sm text-red-500">{errors[field.id]}</p>}
          </div>
        )

      case "file":
        return (
          <div key={field.id} className="space-y-2">
            <Label>
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
            {!files[field.id] ? (
              <div className="border border-input rounded-md p-2">
                <label
                  htmlFor={`${field.id}-upload`}
                  className="flex items-center justify-center gap-2 p-6 border-2 border-dashed rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <Upload className="h-6 w-6 text-muted-foreground" />
                  <div className="text-center">
                    <span className="text-sm font-medium text-muted-foreground">Upload {field.label}</span>
                    <p className="text-xs text-muted-foreground mt-1">PDF, DOC, DOCX - Max 5MB</p>
                  </div>
                  <input
                    id={`${field.id}-upload`}
                    type="file"
                    accept={field.id === "portfolioFile" ? ".pdf,.jpg,.jpeg,.png,.gif" : ".pdf,.doc,.docx"}
                    className="hidden"
                    onChange={(e) => handleFileChange(e, field.id)}
                  />
                </label>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 border rounded-md bg-gray-50">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-gray-600" />
                  <div>
                    <span className="text-sm font-medium">{files[field.id].name}</span>
                    {uploadProgress[field.id] > 0 && uploadProgress[field.id] < 100 && (
                      <p className="text-xs text-blue-600">Uploading... {uploadProgress[field.id]}%</p>
                    )}
                  </div>
                </div>
                <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(field.id)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            {errors[field.id] && <p className="text-sm text-red-500">{errors[field.id]}</p>}
          </div>
        )

      default:
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={field.id}
              name={field.id}
              type={field.type}
              value={formData[field.id] || ""}
              onChange={handleChange}
              placeholder={`Enter your ${field.label.toLowerCase()}`}
            />
            {errors[field.id] && <p className="text-sm text-red-500">{errors[field.id]}</p>}
          </div>
        )
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
                  <p className="font-bold mr-1" >BDT</p>
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
                  {/* Debug Info */}
                  {/* {process.env.NODE_ENV === "development" && (
                    <div className="bg-blue-50 p-4 rounded-md text-sm">
                      <p>
                        <strong>Debug Info:</strong>
                      </p>
                      <p>Form fields available: {job.applicationFormFields?.length || 0}</p>
                      <p>Personal fields: {groupedFields.personal.length}</p>
                      <p>Professional fields: {groupedFields.professional.length}</p>
                      <p>Document fields: {groupedFields.documents.length}</p>
                    </div>
                  )} */}

                  {/* Personal Information */}
                  {groupedFields.personal.length > 0 && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Personal Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {groupedFields.personal.map((field) => renderField(field))}
                      </div>
                    </div>
                  )}

                  {/* Professional Information */}
                  {groupedFields.professional.length > 0 && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Professional Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {groupedFields.professional.map((field) => renderField(field))}
                      </div>
                    </div>
                  )}

                  {/* Documents */}
                  {groupedFields.documents.length > 0 && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Documents</h3>
                      <div className="space-y-6">{groupedFields.documents.map((field) => renderField(field))}</div>
                    </div>
                  )}

                  {/* Show message if no fields are configured */}
                  {groupedFields.personal.length === 0 &&
                    groupedFields.professional.length === 0 &&
                    groupedFields.documents.length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No application form fields have been configured for this job.</p>
                        <p className="text-sm text-gray-400 mt-2">
                          Available fields: {job.applicationFormFields?.length || 0}
                        </p>
                      </div>
                    )}

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
                    <Button type="button" variant="outline" asChild className="flex-1 bg-transparent">
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
                <Button variant="outline" size="sm" asChild className="w-full bg-transparent">
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
