"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, ArrowLeft, Clock, Download, FileText, LogOut, Shield, User, ImageIcon } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { checkUserAuth, logoutUser } from "@/app/actions/auth-actions"
import { formatDate } from "@/lib/utils"
import { createServerSupabaseClient } from "@/lib/supabase"
import { getEvidenceUrl } from "@/app/actions/report-actions"

export default function ComplaintDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [complaint, setComplaint] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [evidenceUrl, setEvidenceUrl] = useState<string | null>(null)
  const [isLoadingEvidence, setIsLoadingEvidence] = useState(false)

  useEffect(() => {
    async function checkAuth() {
      const { authenticated, user } = await checkUserAuth()

      if (!authenticated) {
        router.push("/auth/login")
        return
      }

      setUser(user)
      loadComplaintDetails()
    }

    checkAuth()
  }, [router, params.id])

  async function loadComplaintDetails() {
    setIsLoading(true)
    try {
      // Create a server-side Supabase client
      const supabase = createServerSupabaseClient()

      // Get the complaint details
      const { data, error } = await supabase
        .from("complaints")
        .select("*")
        .eq("id", params.id)
        .eq("user_id", user?.id)
        .single()

      if (error || !data) {
        setError("Failed to load complaint details. Please try again.")
        return
      }

      setComplaint(data)

      // If there's evidence, get the URL
      if (data.evidence_path) {
        loadEvidenceUrl()
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  async function loadEvidenceUrl() {
    setIsLoadingEvidence(true)
    try {
      const result = await getEvidenceUrl(params.id)
      if (result.success) {
        setEvidenceUrl(result.url)
      }
    } catch (err) {
      console.error("Error loading evidence URL:", err)
    } finally {
      setIsLoadingEvidence(false)
    }
  }

  async function handleLogout() {
    await logoutUser()
    router.push("/")
  }

  function getStatusBadge(status: string) {
    switch (status.toLowerCase()) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            Pending
          </Badge>
        )
      case "under review":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            Under Review
          </Badge>
        )
      case "investigating":
        return (
          <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200">
            Investigating
          </Badge>
        )
      case "resolved":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Resolved
          </Badge>
        )
      case "closed":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            Closed
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  function getFileIcon(fileType: string | null) {
    if (!fileType) return <FileText className="h-5 w-5 mr-2 text-gray-500" />

    if (fileType.startsWith("image/")) {
      return <ImageIcon className="h-5 w-5 mr-2 text-blue-500" />
    } else if (fileType.includes("pdf")) {
      return <FileText className="h-5 w-5 mr-2 text-red-500" />
    } else if (fileType.includes("word")) {
      return <FileText className="h-5 w-5 mr-2 text-blue-600" />
    } else {
      return <FileText className="h-5 w-5 mr-2 text-gray-500" />
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-green-700 text-white py-3 px-4 border-b border-green-800">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Shield className="h-6 w-6 mr-2" />
              <h1 className="text-xl font-bold">SafeCampus Sri Lanka</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                <span>{user?.fullName || "Student"}</span>
              </div>
              <Button variant="ghost" className="text-white hover:bg-green-800" onClick={handleLogout}>
                <LogOut className="h-5 w-5 mr-2" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="mb-6">
          <Button asChild variant="ghost" className="pl-0">
            <Link href="/dashboard" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Clock className="h-6 w-6 mr-2 animate-spin" />
            <span>Loading complaint details...</span>
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : complaint ? (
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Complaint #{complaint.complaint_number}</CardTitle>
                    <CardDescription>Submitted on {formatDate(complaint.submission_date)}</CardDescription>
                  </div>
                  <div>{getStatusBadge(complaint.status)}</div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Incident Date</h3>
                    <p>{formatDate(complaint.incident_date)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Incident Time</h3>
                    <p>{complaint.incident_time}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Location</h3>
                    <p>{complaint.incident_location}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Category</h3>
                    <p className="capitalize">{complaint.category || "Not specified"}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
                  <div className="p-4 bg-gray-50 rounded-md border whitespace-pre-line">{complaint.description}</div>
                </div>

                {complaint.evidence_path && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Evidence</h3>
                    <div className="p-4 bg-gray-50 rounded-md border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {getFileIcon(complaint.evidence_file_type)}
                          <span>{complaint.evidence_file_name || "Attached evidence"}</span>
                        </div>
                        {isLoadingEvidence ? (
                          <Button size="sm" variant="outline" disabled className="flex items-center">
                            <Clock className="h-4 w-4 mr-1 animate-spin" />
                            Loading...
                          </Button>
                        ) : evidenceUrl ? (
                          <div className="flex gap-2">
                            {complaint.evidence_file_type?.startsWith("image/") && (
                              <Button size="sm" variant="outline" className="flex items-center" asChild>
                                <a href={evidenceUrl} target="_blank" rel="noopener noreferrer">
                                  <ImageIcon className="h-4 w-4 mr-1" />
                                  View
                                </a>
                              </Button>
                            )}
                            <Button size="sm" variant="outline" className="flex items-center" asChild>
                              <a
                                href={evidenceUrl}
                                download={complaint.evidence_file_name || "evidence"}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Download className="h-4 w-4 mr-1" />
                                Download
                              </a>
                            </Button>
                          </div>
                        ) : (
                          <Button size="sm" variant="outline" className="flex items-center" onClick={loadEvidenceUrl}>
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <Separator />

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Status</h3>
                  <div className="p-4 bg-gray-50 rounded-md border">
                    <div className="flex items-center gap-2 mb-2">
                      {complaint.status.toLowerCase() === "pending" ? (
                        <Clock className="h-5 w-5 text-amber-600" />
                      ) : complaint.status.toLowerCase() === "resolved" ? (
                        <FileText className="h-5 w-5 text-green-600" />
                      ) : (
                        <FileText className="h-5 w-5 text-teal-600" />
                      )}
                      <span className="font-medium">
                        {complaint.status === "Pending"
                          ? "Your complaint is pending review"
                          : complaint.status === "Under Review"
                            ? "Your complaint is under review"
                            : complaint.status === "Investigating"
                              ? "Your complaint is being investigated"
                              : complaint.status === "Resolved"
                                ? "Your complaint has been resolved"
                                : complaint.status === "Closed"
                                  ? "Your complaint has been closed"
                                  : "Status: " + complaint.status}
                      </span>
                    </div>
                    {complaint.public_notes && (
                      <div className="text-gray-600 whitespace-pre-line">{complaint.public_notes}</div>
                    )}
                  </div>
                </div>

                {complaint.status.toLowerCase() === "pending" && (
                  <div className="bg-amber-50 p-4 rounded-md border border-amber-100">
                    <p className="text-amber-800 text-sm">
                      Your complaint has been received and is pending review. We aim to review all complaints within 48
                      hours. Thank you for your patience.
                    </p>
                  </div>
                )}

                {complaint.status.toLowerCase() === "resolved" && (
                  <div className="bg-green-50 p-4 rounded-md border border-green-100">
                    <p className="text-green-800 text-sm">
                      Your complaint has been resolved. If you have any further concerns, please submit a new report or
                      contact our support team.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Not Found</AlertTitle>
            <AlertDescription>The requested complaint could not be found.</AlertDescription>
          </Alert>
        )}
      </main>

      <footer className="bg-gray-100 py-4 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} CodeCraftix Technologies. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link href="/about" className="text-gray-600 hover:text-green-600">
                About
              </Link>
              <Link href="/faq" className="text-gray-600 hover:text-green-600">
                FAQ
              </Link>
              <Link href="/privacy" className="text-gray-600 hover:text-green-600">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
