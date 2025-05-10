"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, ArrowLeft, Clock, Download, FileText, Shield } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getComplaintDetails, updateComplaintStatus, checkAdminAuth } from "@/app/actions/admin-actions"

export default function ComplaintDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [complaint, setComplaint] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState("")
  const [internalNotes, setInternalNotes] = useState("")
  const [publicNotes, setPublicNotes] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateSuccess, setUpdateSuccess] = useState(false)

  useEffect(() => {
    async function checkAuth() {
      const authResult = await checkAdminAuth()
      if (!authResult.authenticated) {
        router.push("/admin/login")
        return
      }

      loadComplaintDetails()
    }

    checkAuth()
  }, [router, params.id])

  async function loadComplaintDetails() {
    setIsLoading(true)
    setError(null)

    try {
      const result = await getComplaintDetails(params.id)
      if (result.success) {
        setComplaint(result.complaint)
        setStatus(result.complaint.status)
        setInternalNotes(result.complaint.adminNotes || "")
        setPublicNotes(result.complaint.publicNotes || "")
      } else {
        setError(result.error || "Failed to load complaint details")
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleUpdateStatus() {
    setIsUpdating(true)
    setError(null)
    setUpdateSuccess(false)

    try {
      const result = await updateComplaintStatus(params.id, status, internalNotes, publicNotes)

      if (result.success) {
        setUpdateSuccess(true)
        // Update the local complaint object
        setComplaint({
          ...complaint,
          status,
          adminNotes: internalNotes,
          publicNotes,
        })
      } else {
        setError(result.error || "Failed to update complaint status")
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsUpdating(false)
    }
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

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-teal-700 text-white py-3 px-4 border-b border-teal-800">
        <div className="container mx-auto">
          <div className="flex items-center">
            <Shield className="h-6 w-6 mr-2" />
            <h1 className="text-xl font-bold">SafeCampus Admin</h1>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="mb-6">
          <Button asChild variant="ghost" className="pl-0">
            <Link href="/admin/dashboard" className="flex items-center">
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Complaint #{complaint.complaintNumber}</CardTitle>
                      <CardDescription>
                        Submitted on {new Date(complaint.submissionDate).toLocaleDateString()} at{" "}
                        {new Date(complaint.submissionDate).toLocaleTimeString()}
                      </CardDescription>
                    </div>
                    <div>{getStatusBadge(complaint.status)}</div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Incident Date</h3>
                      <p>{new Date(complaint.incidentDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Incident Time</h3>
                      <p>{complaint.incidentTime}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Location</h3>
                      <p>{complaint.incidentLocation}</p>
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

                  {complaint.evidencePath && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Evidence</h3>
                      <div className="p-4 bg-gray-50 rounded-md border">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 mr-2 text-gray-500" />
                            <span>Attached evidence</span>
                          </div>
                          <Button size="sm" variant="outline" className="flex items-center">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Tabs defaultValue="update">
                <TabsList className="mb-4">
                  <TabsTrigger value="update">Update Status</TabsTrigger>
                  <TabsTrigger value="history">Status History</TabsTrigger>
                </TabsList>

                <TabsContent value="update">
                  <Card>
                    <CardHeader>
                      <CardTitle>Update Complaint Status</CardTitle>
                      <CardDescription>Change the status and add notes to this complaint</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {updateSuccess && (
                        <Alert className="bg-green-50 border-green-200 mb-4">
                          <AlertCircle className="h-4 w-4 text-green-600" />
                          <AlertTitle className="text-green-600">Success</AlertTitle>
                          <AlertDescription className="text-green-700">
                            Complaint status has been updated successfully.
                          </AlertDescription>
                        </Alert>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select value={status} onValueChange={setStatus}>
                          <SelectTrigger id="status">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Under Review">Under Review</SelectItem>
                            <SelectItem value="Investigating">Investigating</SelectItem>
                            <SelectItem value="Resolved">Resolved</SelectItem>
                            <SelectItem value="Closed">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="internal-notes">
                          Internal Notes <span className="text-gray-400">(visible to administrators only)</span>
                        </Label>
                        <Textarea
                          id="internal-notes"
                          value={internalNotes}
                          onChange={(e) => setInternalNotes(e.target.value)}
                          placeholder="Add internal notes about this complaint..."
                          className="min-h-[100px]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="public-notes">
                          Public Notes <span className="text-gray-400">(visible to the reporter)</span>
                        </Label>
                        <Textarea
                          id="public-notes"
                          value={publicNotes}
                          onChange={(e) => setPublicNotes(e.target.value)}
                          placeholder="Add notes that will be visible to the student who reported this incident..."
                          className="min-h-[100px]"
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        onClick={handleUpdateStatus}
                        className="bg-teal-600 hover:bg-teal-700"
                        disabled={isUpdating}
                      >
                        {isUpdating ? "Updating..." : "Update Status"}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="history">
                  <Card>
                    <CardHeader>
                      <CardTitle>Status History</CardTitle>
                      <CardDescription>Timeline of status changes for this complaint</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex gap-4">
                          <div className="w-24 text-sm text-gray-500">{new Date().toLocaleDateString()}</div>
                          <div className="flex-grow border-l pl-4 pb-4 relative">
                            <div className="absolute w-3 h-3 bg-teal-500 rounded-full -left-[6.5px] top-1"></div>
                            <div>
                              <p className="font-medium">Status changed to {complaint.status}</p>
                              <p className="text-sm text-gray-500">By Admin</p>
                              {complaint.adminNotes && (
                                <div className="mt-2 p-3 bg-gray-50 rounded-md text-sm">{complaint.adminNotes}</div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-4">
                          <div className="w-24 text-sm text-gray-500">
                            {new Date(complaint.submissionDate).toLocaleDateString()}
                          </div>
                          <div className="flex-grow border-l pl-4 relative">
                            <div className="absolute w-3 h-3 bg-teal-500 rounded-full -left-[6.5px] top-1"></div>
                            <div>
                              <p className="font-medium">Complaint submitted</p>
                              <p className="text-sm text-gray-500">Initial status: Pending</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full bg-teal-600 hover:bg-teal-700">Print Report</Button>
                  <Button variant="outline" className="w-full">
                    Export as PDF
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Similar Complaints</CardTitle>
                  <CardDescription>Other complaints from the same location</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 border rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">RA-2023-0042</p>
                        <p className="text-sm text-gray-500">{complaint.incidentLocation}</p>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Resolved
                      </Badge>
                    </div>
                  </div>

                  <div className="p-3 border rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">RA-2023-0039</p>
                        <p className="text-sm text-gray-500">{complaint.incidentLocation}</p>
                      </div>
                      <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200">
                        Investigating
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Not Found</AlertTitle>
            <AlertDescription>The requested complaint could not be found.</AlertDescription>
          </Alert>
        )}
      </main>

      <footer className="bg-gray-100 py-4 border-t mt-8">
        <div className="container mx-auto px-4">
          <p className="text-sm text-gray-500 text-center">
            &copy; {new Date().getFullYear()} SafeCampus Sri Lanka. Administrator Portal.
          </p>
        </div>
      </footer>
    </div>
  )
}
