"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { X, Check, AlertCircle, FileText, Download } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { updateComplaintStatus } from "@/app/actions/admin-actions"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ComplaintSlideProps {
  complaint: any
  onClose: () => void
  onUpdate: () => void
}

export function ComplaintSlide({ complaint, onClose, onUpdate }: ComplaintSlideProps) {
  const [status, setStatus] = useState(complaint?.status || "")
  const [internalNotes, setInternalNotes] = useState(complaint?.adminNotes || "")
  const [publicNotes, setPublicNotes] = useState(complaint?.publicNotes || "")
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (complaint) {
      setStatus(complaint.status)
      setInternalNotes(complaint.adminNotes || "")
      setPublicNotes(complaint.publicNotes || "")
    }
  }, [complaint])

  async function handleUpdateStatus() {
    if (!complaint) return

    setIsUpdating(true)
    setError(null)
    setUpdateSuccess(false)

    try {
      const result = await updateComplaintStatus(complaint.complaintId, status, internalNotes, publicNotes)

      if (result.success) {
        setUpdateSuccess(true)
        setTimeout(() => {
          onUpdate()
        }, 1500)
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
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900 dark:text-amber-200 dark:border-amber-800"
          >
            Pending
          </Badge>
        )
      case "under review":
        return (
          <Badge
            variant="outline"
            className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900 dark:text-purple-200 dark:border-purple-800"
          >
            Under Review
          </Badge>
        )
      case "investigating":
        return (
          <Badge
            variant="outline"
            className="bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-900 dark:text-teal-200 dark:border-teal-800"
          >
            Investigating
          </Badge>
        )
      case "resolved":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800"
          >
            Resolved
          </Badge>
        )
      case "closed":
        return (
          <Badge
            variant="outline"
            className="bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
          >
            Closed
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (!complaint) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end transition-all duration-300 animate-fade-in">
      <div className="bg-white dark:bg-gray-900 w-full max-w-2xl h-full overflow-y-auto shadow-xl animate-slide-in-right">
        <div className="sticky top-0 bg-green-600 dark:bg-green-800 text-white p-4 flex justify-between items-center z-10">
          <h2 className="text-xl font-bold">Complaint #{complaint.complaintNumber}</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-green-700 dark:hover:bg-green-700 rounded-full transition-all duration-300 transform hover:rotate-90"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Submitted on {new Date(complaint.submissionDate).toLocaleDateString()} at{" "}
                {new Date(complaint.submissionDate).toLocaleTimeString()}
              </p>
            </div>
            <div>{getStatusBadge(complaint.status)}</div>
          </div>

          <Card className="border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-lg">Incident Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Incident Date</h3>
                  <p className="dark:text-gray-300">{new Date(complaint.incidentDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Incident Time</h3>
                  <p className="dark:text-gray-300">{complaint.incidentTime}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</h3>
                  <p className="dark:text-gray-300">{complaint.incidentLocation}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Category</h3>
                  <p className="capitalize dark:text-gray-300">{complaint.category || "Not specified"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-lg">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md border dark:border-gray-700 whitespace-pre-line dark:text-gray-300">
                {complaint.description}
              </div>
            </CardContent>
          </Card>

          {complaint.evidencePath && (
            <Card className="border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-lg">Evidence</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md border dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
                      <span className="dark:text-gray-300">Attached evidence</span>
                    </div>
                    <Button size="sm" variant="outline" className="flex items-center">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Separator className="my-6" />

          <Card className="border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-lg">Update Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {updateSuccess && (
                <Alert className="bg-green-50 border-green-200 dark:bg-green-900 dark:border-green-800 mb-4 animate-pulse">
                  <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertTitle className="text-green-600 dark:text-green-400">Success</AlertTitle>
                  <AlertDescription className="text-green-700 dark:text-green-300">
                    Complaint status has been updated successfully.
                  </AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert variant="destructive" className="mb-4 animate-shake">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger id="status" className="dark:bg-gray-800 dark:border-gray-700">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-800">
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
                  Internal Notes{" "}
                  <span className="text-gray-400 dark:text-gray-500">(visible to administrators only)</span>
                </Label>
                <Textarea
                  id="internal-notes"
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="Add internal notes about this complaint..."
                  className="min-h-[100px] dark:bg-gray-800 dark:border-gray-700"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="public-notes">
                  Public Notes <span className="text-gray-400 dark:text-gray-500">(visible to the reporter)</span>
                </Label>
                <Textarea
                  id="public-notes"
                  value={publicNotes}
                  onChange={(e) => setPublicNotes(e.target.value)}
                  placeholder="Add notes that will be visible to the student who reported this incident..."
                  className="min-h-[100px] dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleUpdateStatus}
                className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Updating...
                  </span>
                ) : (
                  "Update Status"
                )}
              </Button>
            </CardFooter>
          </Card>

          <Card className="border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-lg">Status History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-24 text-sm text-gray-500 dark:text-gray-400">{new Date().toLocaleDateString()}</div>
                  <div className="flex-grow border-l pl-4 pb-4 relative dark:border-gray-700">
                    <div className="absolute w-3 h-3 bg-green-500 rounded-full -left-[6.5px] top-1"></div>
                    <div>
                      <p className="font-medium dark:text-gray-300">Status changed to {complaint.status}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">By Admin</p>
                      {complaint.adminNotes && (
                        <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-md text-sm dark:text-gray-300">
                          {complaint.adminNotes}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-24 text-sm text-gray-500 dark:text-gray-400">
                    {new Date(complaint.submissionDate).toLocaleDateString()}
                  </div>
                  <div className="flex-grow border-l pl-4 relative dark:border-gray-700">
                    <div className="absolute w-3 h-3 bg-green-500 rounded-full -left-[6.5px] top-1"></div>
                    <div>
                      <p className="font-medium dark:text-gray-300">Complaint submitted</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Initial status: Pending</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
