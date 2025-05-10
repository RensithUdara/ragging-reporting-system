"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, ArrowLeft, CheckCircle, Shield } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { submitReport } from "@/app/actions/report-actions"
import { checkUserAuth } from "@/app/actions/auth-actions"

export default function ReportPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [complaintNumber, setComplaintNumber] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [anonymous, setAnonymous] = useState(true)

  // Form fields
  const [incidentDate, setIncidentDate] = useState("")
  const [incidentTime, setIncidentTime] = useState("")
  const [incidentLocation, setIncidentLocation] = useState("")
  const [incidentCategory, setIncidentCategory] = useState("")
  const [incidentDescription, setIncidentDescription] = useState("")
  const [evidence, setEvidence] = useState<File | null>(null)

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

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
      setEvidence(e.target.files[0])
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
              <p className="text-gray-600 mb-4 md:mb-0">
                &copy; {new Date().getFullYear()} SafeCampus Sri Lanka. All rights reserved.
              </p>
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
                      <Input
                        id="evidence"
                        type="file"
                        onChange={handleFileChange}
                        accept="image/jpeg,image/png,application/pdf"
                      />
                      <p className="text-xs text-gray-500">
                        You can upload images (JPG, PNG) or documents (PDF) up to 5MB
                      </p>
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
            <p className="text-gray-600 mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} SafeCampus Sri Lanka. All rights reserved.
            </p>
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
