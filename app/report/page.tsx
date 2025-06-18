"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, ArrowLeft, CheckCircle, FileText, Shield, Trash2, Upload } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { submitReport } from "@/app/actions/report-actions"
import { checkUserAuth } from "@/app/actions/auth-actions"

export default function ReportPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [complaintNumber, setComplaintNumber] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [anonymous, setAnonymous] = useState(true)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [evidenceUrl, setEvidenceUrl] = useState<string | null>(null)

  // Form fields
  const [incidentDate, setIncidentDate] = useState("")
  const [incidentTime, setIncidentTime] = useState("")
  const [incidentLocation, setIncidentLocation] = useState("")
  const [incidentCategory, setIncidentCategory] = useState("")
  const [incidentDescription, setIncidentDescription] = useState("")
  const [evidence, setEvidence] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)

  useEffect(() => {
    async function checkAuth() {
      const { authenticated, user } = await checkUserAuth()
      setIsAuthenticated(authenticated)
      if (authenticated) {
        setUser(user)
      }
    }

    checkAuth()
  }, [])

  // Simulate upload progress
  useEffect(() => {
    if (isSubmitting && evidence) {
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval)
            return prev
          }
          return prev + 5
        })
      }, 100)

      return () => clearInterval(interval)
    }
  }, [isSubmitting, evidence])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setUploadProgress(0)

    if (!incidentDate || !incidentTime || !incidentLocation || !incidentDescription) {
      setError("Please fill in all required fields")
      setIsSubmitting(false)
      return
    }

    try {
      const formData = new FormData()
      formData.append("incidentDate", incidentDate)
      formData.append("incidentTime", incidentTime)
      formData.append("incidentLocation", incidentLocation)
      formData.append("incidentCategory", incidentCategory)
      formData.append("incidentDescription", incidentDescription)
      formData.append("anonymous", anonymous.toString())

      if (evidence) {
        formData.append("evidence", evidence)
      }

      const result = await submitReport(formData)

      if (result.success) {
        setSuccess(true)
        setComplaintNumber(result.complaintNumber)
        setEvidenceUrl(result.evidenceUrl || null)
        setUploadProgress(100)

        // Reset form
        setIncidentDate("")
        setIncidentTime("")
        setIncidentLocation("")
        setIncidentCategory("")
        setIncidentDescription("")
        setEvidence(null)
      } else {
        setError(result.error || "Failed to submit report. Please try again.")
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0])
    }
  }

  function validateAndSetFile(file: File) {
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds the maximum limit of 5MB")
      return
    }

    // Check file type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]
    if (!allowedTypes.includes(file.type)) {
      setError("File type not allowed. Please upload an image, PDF, or document file")
      return
    }

    setError(null)
    setEvidence(file)
  }

  function handleDrag(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0])
    }
  }

  function removeFile() {
    setEvidence(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  function getFileIcon(fileType: string) {
    if (fileType.startsWith("image/")) {
      return "🖼️"
    } else if (fileType.includes("pdf")) {
      return "📄"
    } else if (fileType.includes("word")) {
      return "📝"
    } else {
      return "📎"
    }
  }

  function formatFileSize(bytes: number) {
    if (bytes < 1024) {
      return bytes + " bytes"
    } else if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(1) + " KB"
    } else {
      return (bytes / (1024 * 1024)).toFixed(1) + " MB"
    }
  }

  if (success && complaintNumber) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="bg-teal-700 text-white py-6">
          <div className="container mx-auto px-4">
            <div className="flex items-center">
              <Shield className="h-8 w-8 mr-2" />
              <h1 className="text-2xl font-bold">SafeCampus Sri Lanka</h1>
            </div>
          </div>
        </header>

        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-center text-2xl">Report Submitted Successfully</CardTitle>
              <CardDescription className="text-center">Your ragging incident report has been submitted</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="bg-green-50 border-green-200">
                <AlertCircle className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-600">Success</AlertTitle>
                <AlertDescription className="text-green-700">
                  Your report has been received and will be reviewed by our team.
                </AlertDescription>
              </Alert>

              <div className="p-4 bg-gray-100 rounded-md">
                <p className="text-sm text-gray-500 mb-1">Your complaint number:</p>
                <p className="font-mono text-lg font-medium text-center">{complaintNumber}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Please save this number to check the status of your complaint later.
                </p>
              </div>

              {evidenceUrl && (
                <div className="p-4 bg-gray-100 rounded-md">
                  <p className="text-sm text-gray-500 mb-2">Your evidence file:</p>
                  <div className="flex justify-center">
                    <Button asChild variant="outline" size="sm" className="flex items-center">
                      <a href={evidenceUrl} target="_blank" rel="noopener noreferrer">
                        <FileText className="h-4 w-4 mr-2" />
                        View Uploaded Evidence
                      </a>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button asChild className="w-full bg-teal-600 hover:bg-teal-700">
                <Link href={`/check-status?complaintNumber=${complaintNumber}`}>Check Status</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/">Return to Home</Link>
              </Button>
            </CardFooter>
          </Card>
        </main>

        <footer className="bg-gray-100 py-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-600 mb-4 md:mb-0">&copy; 2025 CodeCraftix Technologies. All rights reserved.</p>
              <div className="flex gap-4">
                <Link href="/about" className="text-gray-600 hover:text-teal-600">
                  About
                </Link>
                <Link href="/faq" className="text-gray-600 hover:text-teal-600">
                  FAQ
                </Link>
                <Link href="/privacy" className="text-gray-600 hover:text-teal-600">
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-teal-700 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Shield className="h-8 w-8 mr-2" />
              <h1 className="text-2xl font-bold">SafeCampus Sri Lanka</h1>
            </div>
            <nav className="flex gap-4">
              <Link href="/" className="hover:underline">
                Home
              </Link>
              <Link href="/report" className="hover:underline">
                Report Incident
              </Link>
              <Link href="/check-status" className="hover:underline">
                Check Status
              </Link>
              {isAuthenticated ? (
                <Link href="/dashboard" className="hover:underline">
                  Dashboard
                </Link>
              ) : (
                <Link href="/auth/login" className="hover:underline">
                  Student Login
                </Link>
              )}
              <Link href="/admin/login" className="hover:underline">
                Admin Login
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button asChild variant="ghost" className="pl-0">
            <Link href="/" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Report a Ragging Incident</h1>
          <p className="text-gray-600 mb-6">
            Use this form to report a ragging incident. All reports are confidential and will be reviewed by our team.
          </p>

          <Tabs defaultValue="report">
            <TabsList className="mb-6">
              <TabsTrigger value="report">Report Form</TabsTrigger>
              <TabsTrigger value="info">Information & Guidelines</TabsTrigger>
            </TabsList>

            <TabsContent value="report">
              <Card>
                <CardHeader>
                  <CardTitle>Incident Report Form</CardTitle>
                  <CardDescription>Please provide as much detail as possible about the incident</CardDescription>
                </CardHeader>
                <CardContent>
                  {error && (
                    <Alert variant="destructive" className="mb-6">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="incidentDate">
                          Date of Incident <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="incidentDate"
                          type="date"
                          value={incidentDate}
                          onChange={(e) => setIncidentDate(e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="incidentTime">
                          Time of Incident <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="incidentTime"
                          type="time"
                          value={incidentTime}
                          onChange={(e) => setIncidentTime(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="incidentLocation">
                        Location <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="incidentLocation"
                        value={incidentLocation}
                        onChange={(e) => setIncidentLocation(e.target.value)}
                        placeholder="Enter the location where the incident occurred"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="incidentCategory">Category of Ragging</Label>
                      <Select value={incidentCategory} onValueChange={setIncidentCategory}>
                        <SelectTrigger id="incidentCategory">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="verbal">Verbal Harassment</SelectItem>
                          <SelectItem value="physical">Physical Harassment</SelectItem>
                          <SelectItem value="psychological">Psychological Harassment</SelectItem>
                          <SelectItem value="sexual">Sexual Harassment</SelectItem>
                          <SelectItem value="cyberbullying">Cyberbullying</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="incidentDescription">
                        Description <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="incidentDescription"
                        value={incidentDescription}
                        onChange={(e) => setIncidentDescription(e.target.value)}
                        placeholder="Provide a detailed description of what happened"
                        className="min-h-[150px]"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="evidence">Evidence (Optional)</Label>
                      <div
                        className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
                          dragActive
                            ? "border-teal-500 bg-teal-50"
                            : evidence
                              ? "border-green-500 bg-green-50"
                              : "border-gray-300 hover:border-teal-500"
                        }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                      >
                        <input
                          ref={fileInputRef}
                          id="evidence"
                          type="file"
                          onChange={handleFileChange}
                          className="hidden"
                          accept="image/jpeg,image/png,image/gif,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        />

                        {evidence ? (
                          <div className="flex items-center justify-between bg-white p-3 rounded-md">
                            <div className="flex items-center">
                              <div className="text-2xl mr-3">{getFileIcon(evidence.type)}</div>
                              <div>
                                <p className="font-medium truncate max-w-[200px]">{evidence.name}</p>
                                <p className="text-xs text-gray-500">{formatFileSize(evidence.size)}</p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={removeFile}
                              className="text-gray-500 hover:text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="text-center py-6">
                            <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm font-medium mb-1">Drag and drop your file here or</p>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => fileInputRef.current?.click()}
                              className="mt-2"
                            >
                              Browse Files
                            </Button>
                            <p className="text-xs text-gray-500 mt-2">
                              Supported formats: JPG, PNG, GIF, PDF, DOC, DOCX (Max 5MB)
                            </p>
                          </div>
                        )}

                        {isSubmitting && evidence && (
                          <div className="mt-3">
                            <div className="flex justify-between text-xs mb-1">
                              <span>Uploading...</span>
                              <span>{uploadProgress}%</span>
                            </div>
                            <Progress value={uploadProgress} className="h-2" />
                          </div>
                        )}
                      </div>
                    </div>

                    {isAuthenticated && (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="anonymous"
                          checked={anonymous}
                          onCheckedChange={(checked) => setAnonymous(checked as boolean)}
                        />
                        <Label htmlFor="anonymous" className="text-sm font-normal">
                          Submit this report anonymously (your identity will not be linked to this report)
                        </Label>
                      </div>
                    )}

                    <div className="bg-amber-50 p-4 rounded-md border border-amber-100">
                      <p className="text-amber-800 text-sm">
                        <strong>Note:</strong> By submitting this form, you confirm that the information provided is
                        accurate to the best of your knowledge. False reporting may lead to disciplinary action.
                      </p>
                    </div>

                    <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700" disabled={isSubmitting}>
                      {isSubmitting ? "Submitting..." : "Submit Report"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="info">
              <Card>
                <CardHeader>
                  <CardTitle>Information & Guidelines</CardTitle>
                  <CardDescription>Important information about reporting ragging incidents</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">What is Ragging?</h3>
                    <p className="text-gray-600 mb-2">
                      Ragging refers to the practice of seniors or existing students harassing, humiliating, or abusing
                      new students in educational institutions. It can take various forms:
                    </p>
                    <ul className="list-disc pl-6 space-y-1 text-gray-600">
                      <li>Verbal abuse and intimidation</li>
                      <li>Physical harassment</li>
                      <li>Psychological harassment</li>
                      <li>Forcing students to perform humiliating acts</li>
                      <li>Cyberbullying</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Confidentiality</h3>
                    <p className="text-gray-600">
                      Your identity will be kept confidential. If you choose to submit anonymously, your personal
                      information will not be linked to the report. Only authorized administrators will have access to
                      the report details.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">What Happens After You Submit?</h3>
                    <ol className="list-decimal pl-6 space-y-2 text-gray-600">
                      <li>
                        You will receive a unique complaint number that you can use to track the status of your report.
                      </li>
                      <li>
                        University administrators will review your report and determine the appropriate course of
                        action.
                      </li>
                      <li>If necessary, an investigation will be conducted to gather more information.</li>
                      <li>
                        Based on the findings, appropriate disciplinary action will be taken against the perpetrators.
                      </li>
                      <li>
                        You can check the status of your report at any time using your complaint number or through your
                        dashboard if you have an account.
                      </li>
                    </ol>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Tips for Reporting</h3>
                    <ul className="list-disc pl-6 space-y-1 text-gray-600">
                      <li>Be as specific as possible about what happened.</li>
                      <li>Include the date, time, and location of the incident.</li>
                      <li>Describe the individuals involved (if comfortable doing so).</li>
                      <li>Mention any witnesses who were present.</li>
                      <li>Upload any evidence you may have (photos, videos, messages).</li>
                    </ul>
                  </div>

                  <div className="bg-teal-50 p-4 rounded-md border border-teal-100">
                    <h3 className="text-teal-800 font-semibold mb-2">Need Help?</h3>
                    <p className="text-teal-700 mb-2">
                      If you need assistance or have questions about reporting an incident, please contact our support
                      team:
                    </p>
                    <p className="text-teal-700">
                      Email: support@safecampus.lk
                      <br />
                      Phone: +94 11 234 5678
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => document.querySelector('[data-value="report"]')?.click()}
                    className="w-full bg-teal-600 hover:bg-teal-700"
                  >
                    Go to Report Form
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <footer className="bg-gray-100 py-6 mt-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 mb-4 md:mb-0">&copy; 2025 CodeCraftix Technologies. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="/about" className="text-gray-600 hover:text-teal-600">
                About
              </Link>
              <Link href="/faq" className="text-gray-600 hover:text-teal-600">
                FAQ
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-teal-600">
                Contact
              </Link>
              <Link href="/privacy" className="text-gray-600 hover:text-teal-600">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
