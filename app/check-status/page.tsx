"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, ArrowLeft, Clock, FileText, Shield } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { checkComplaintStatus } from "@/app/actions/report-actions"
import { formatDate } from "@/lib/utils"
import { motion } from "framer-motion"

export default function CheckStatusPage() {
  const searchParams = useSearchParams()
  const initialComplaintNumber = searchParams.get("complaintNumber") || ""

  const [complaintNumber, setComplaintNumber] = useState(initialComplaintNumber)
  const [isChecking, setIsChecking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [complaint, setComplaint] = useState<any>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!complaintNumber.trim()) {
      setError("Please enter a complaint number")
      return
    }

    setIsChecking(true)
    setError(null)
    setComplaint(null)

    try {
      const result = await checkComplaintStatus(complaintNumber)
      if (result.success) {
        setComplaint(result.complaint)
      } else {
        setError(result.error || "Failed to find complaint. Please check the number and try again.")
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsChecking(false)
    }
  }

  function getStatusBadge(status: string) {
    switch (status.toLowerCase()) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 shadow-sm">
            Pending
          </Badge>
        )
      case "under review":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 shadow-sm">
            Under Review
          </Badge>
        )
      case "investigating":
        return (
          <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200 shadow-sm">
            Investigating
          </Badge>
        )
      case "resolved":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 shadow-sm">
            Resolved
          </Badge>
        )
      case "closed":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 shadow-sm">
            Closed
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="shadow-sm">
            {status}
          </Badge>
        )
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="bg-gradient-to-r from-teal-700 to-teal-800 text-white py-6 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Shield className="h-8 w-8 mr-2 animate-pulse" />
              <h1 className="text-2xl font-bold">SafeCampus Sri Lanka</h1>
            </div>
            <nav className="flex gap-4">
              <Link href="/" className="hover:underline hover:text-teal-200 transition-colors">
                Home
              </Link>
              <Link href="/report" className="hover:underline hover:text-teal-200 transition-colors">
                Report Incident
              </Link>
              <Link href="/check-status" className="hover:underline hover:text-teal-200 transition-colors">
                Check Status
              </Link>
              <Link href="/auth/login" className="hover:underline hover:text-teal-200 transition-colors">
                Student Login
              </Link>
              <Link href="/admin/login" className="hover:underline hover:text-teal-200 transition-colors">
                Admin Login
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <Button asChild variant="ghost" className="pl-0 hover:bg-white/20 transition-colors">
            <Link href="/" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-3xl font-bold mb-2">Check Complaint Status</h1>
            <p className="text-gray-600 mb-6">
              Enter your complaint number to check the status of your ragging incident report.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="mb-8 shadow-lg hover:shadow-xl transition-shadow border-t-4 border-teal-500">
              <CardHeader>
                <CardTitle>Enter Complaint Number</CardTitle>
                <CardDescription>
                  The complaint number was provided to you when you submitted your report
                </CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                  >
                    <Alert variant="destructive" className="mb-6 shadow-md">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="complaintNumber">Complaint Number</Label>
                    <div className="flex gap-2">
                      <Input
                        id="complaintNumber"
                        value={complaintNumber}
                        onChange={(e) => setComplaintNumber(e.target.value)}
                        placeholder="e.g., RA-2023-1234"
                        className="flex-1 border-gray-300 focus:border-teal-500 focus:ring-teal-500 transition-all"
                      />
                      <Button
                        type="submit"
                        className="bg-teal-600 hover:bg-teal-700 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 duration-200"
                        disabled={isChecking}
                      >
                        {isChecking ? (
                          <>
                            <span className="animate-spin mr-2">⏳</span> Checking...
                          </>
                        ) : (
                          "Check Status"
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Example format: RA-2023-1234. The complaint number is case-sensitive.
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {complaint && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="shadow-lg hover:shadow-xl transition-shadow border-t-4 border-teal-500">
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
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Status</h3>
                    <div className="p-4 bg-gray-50 rounded-md border shadow-inner">
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
                    <div className="bg-amber-50 p-4 rounded-md border border-amber-100 shadow-sm">
                      <p className="text-amber-800 text-sm">
                        Your complaint has been received and is pending review. We aim to review all complaints within
                        48 hours. Thank you for your patience.
                      </p>
                    </div>
                  )}

                  {complaint.status.toLowerCase() === "resolved" && (
                    <div className="bg-green-50 p-4 rounded-md border border-green-100 shadow-sm">
                      <p className="text-green-800 text-sm">
                        Your complaint has been resolved. If you have any further concerns, please submit a new report
                        or contact our support team.
                      </p>
                    </div>
                  )}

                  <Button
                    onClick={() => {
                      setComplaint(null)
                      setComplaintNumber("")
                    }}
                    variant="outline"
                    className="w-full hover:bg-teal-50 transition-colors shadow-sm hover:shadow-md"
                  >
                    Check Another Complaint
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {!complaint && !isChecking && !error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="bg-gray-50 p-6 rounded-lg border shadow-md text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">No Complaint Information</h3>
                <p className="text-gray-600 mb-4">
                  Enter your complaint number above to check the status of your report.
                </p>
                <p className="text-sm text-gray-500">
                  If you've lost your complaint number, please contact our support team at support@safecampus.lk
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <footer className="bg-gray-100 py-6 mt-8 border-t border-gray-200 shadow-inner">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 mb-4 md:mb-0">&copy; 2025 CodeCraftix Technologies. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="/about" className="text-gray-600 hover:text-teal-600 transition-colors">
                About
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
