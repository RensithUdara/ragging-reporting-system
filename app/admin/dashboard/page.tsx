"use client"

import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Clock, FileText, LogOut, Shield, User, ChevronRight, RefreshCw, BarChart3 } from "lucide-react"
import { checkAdminAuth, adminLogout, getComplaints, updateComplaintStatus } from "@/app/actions/admin-actions"
import { formatDate } from "@/lib/utils"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

export default function AdminDashboardPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [complaints, setComplaints] = useState<any[]>([])
  const [filteredComplaints, setFilteredComplaints] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newStatus, setNewStatus] = useState("")
  const [adminNotes, setAdminNotes] = useState("")
  const [publicNotes, setPublicNotes] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateSuccess, setUpdateSuccess] = useState(false)

  useEffect(() => {
    async function checkAuth() {
      const { authenticated } = await checkAdminAuth()

      if (!authenticated) {
        router.push("/admin/login")
        return
      }

      loadComplaints()
    }

    checkAuth()
  }, [router])

  async function loadComplaints() {
    setIsLoading(true)
    try {
      const result = await getComplaints()
      if (result.success) {
        setComplaints(result.complaints || [])
        setFilteredComplaints(result.complaints || [])
      } else {
        setError(result.error || "Failed to load complaints")
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    let filtered = [...complaints]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (complaint) =>
          complaint.complaintNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          complaint.incidentLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
          complaint.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((complaint) => complaint.status.toLowerCase() === statusFilter.toLowerCase())
    }

    setFilteredComplaints(filtered)
  }, [searchTerm, statusFilter, complaints])

  async function handleLogout() {
    await adminLogout()
    router.push("/admin/login")
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

  function handleViewComplaint(complaint: any) {
    setSelectedComplaint(complaint)
    setNewStatus(complaint.status)
    setAdminNotes(complaint.adminNotes || "")
    setPublicNotes(complaint.publicNotes || "")
    setIsDialogOpen(true)
    setUpdateSuccess(false)
  }

  async function handleUpdateStatus() {
    if (!selectedComplaint) return

    setIsUpdating(true)
    setError(null)

    try {
      const result = await updateComplaintStatus(selectedComplaint.complaintId, newStatus, adminNotes, publicNotes)

      if (result.success) {
        // Update the complaint in the local state
        const updatedComplaints = complaints.map((c) => {
          if (c.complaintId === selectedComplaint.complaintId) {
            return {
              ...c,
              status: newStatus,
              adminNotes,
              publicNotes,
            }
          }
          return c
        })

        setComplaints(updatedComplaints)
        setUpdateSuccess(true)

        // Reload complaints after a short delay
        setTimeout(() => {
          loadComplaints()
        }, 2000)
      } else {
        setError(result.error || "Failed to update status")
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-green-700 to-green-800 text-white py-3 px-4 border-b border-green-800 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Shield className="h-6 w-6 mr-2 animate-pulse" />
              <h1 className="text-xl font-bold">SafeCampus Admin</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                <span>Administrator</span>
              </div>
              <Button
                variant="ghost"
                className="text-white hover:bg-green-800 transition-colors"
                onClick={() => router.push("/admin/analytics")}
              >
                <BarChart3 className="h-5 w-5 mr-2" />
                <span>Analytics</span>
              </Button>
              <Button
                variant="ghost"
                className="text-white hover:bg-green-800 transition-colors"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5 mr-2" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="mb-6 animate-fade-in-up">
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
          <p className="text-gray-500">Manage and track ragging incident reports</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="shadow-md hover:shadow-lg transition-shadow border-t-2 border-green-500 animate-fade-in-up animation-delay-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{complaints.length}</div>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow border-t-2 border-amber-500 animate-fade-in-up animation-delay-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">
                {complaints.filter((c) => c.status.toLowerCase() === "pending").length}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow border-t-2 border-purple-500 animate-fade-in-up animation-delay-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Under Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {complaints.filter((c) => c.status.toLowerCase() === "under review").length}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow border-t-2 border-green-500 animate-fade-in-up animation-delay-400">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Resolved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {complaints.filter((c) => c.status.toLowerCase() === "resolved").length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6 shadow-lg animate-fade-in-up animation-delay-500">
          <CardHeader>
            <CardTitle>Complaint Management</CardTitle>
            <CardDescription>View and manage all ragging incident reports</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="mb-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                <TabsList className="mb-2 md:mb-0">
                  <TabsTrigger value="all" onClick={() => setStatusFilter("all")}>
                    All
                  </TabsTrigger>
                  <TabsTrigger value="pending" onClick={() => setStatusFilter("pending")}>
                    Pending
                  </TabsTrigger>
                  <TabsTrigger value="under review" onClick={() => setStatusFilter("under review")}>
                    Under Review
                  </TabsTrigger>
                  <TabsTrigger value="investigating" onClick={() => setStatusFilter("investigating")}>
                    Investigating
                  </TabsTrigger>
                  <TabsTrigger value="resolved" onClick={() => setStatusFilter("resolved")}>
                    Resolved
                  </TabsTrigger>
                </TabsList>

                <div className="flex w-full md:w-auto gap-2">
                  <div className="relative w-full md:w-64">
                    <Input
                      placeholder="Search complaints..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 absolute left-2.5 top-3 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>

                  <Button variant="outline" size="icon" onClick={() => loadComplaints()} className="hover:bg-green-50">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive" className="mb-4 animate-shake">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="rounded-md border shadow-sm overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead>Complaint #</TableHead>
                      <TableHead>Date Reported</TableHead>
                      <TableHead>Incident Date</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <div className="flex justify-center items-center">
                            <Clock className="h-5 w-5 mr-2 animate-spin" />
                            Loading complaints...
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : filteredComplaints.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <div className="flex flex-col items-center justify-center text-gray-500">
                            <FileText className="h-12 w-12 mb-2 text-gray-400" />
                            <p className="text-lg font-medium">No complaints found</p>
                            <p className="text-sm">
                              {searchTerm || statusFilter !== "all"
                                ? "Try adjusting your filters"
                                : "There are no complaints in the system yet"}
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredComplaints.map((complaint) => (
                        <TableRow
                          key={complaint.complaintId}
                          className="hover:bg-gray-50 transition-colors cursor-pointer"
                          onClick={() => handleViewComplaint(complaint)}
                        >
                          <TableCell className="font-medium">{complaint.complaintNumber}</TableCell>
                          <TableCell>{formatDate(complaint.submissionDate)}</TableCell>
                          <TableCell>{formatDate(complaint.incidentDate)}</TableCell>
                          <TableCell>{complaint.incidentLocation}</TableCell>
                          <TableCell>{getStatusBadge(complaint.status)}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="hover:bg-green-50 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleViewComplaint(complaint)
                              }}
                            >
                              View Details
                              <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </main>

      <footer className="bg-gray-100 py-4 border-t shadow-inner">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 mb-4 md:mb-0">&copy; 2025 CodeCraftix Technologies. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="/about" className="text-gray-600 hover:text-green-600 transition-colors">
                About
              </Link>
              <Link href="/faq" className="text-gray-600 hover:text-green-600 transition-colors">
                FAQ
              </Link>
              <Link href="/privacy" className="text-gray-600 hover:text-green-600 transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Complaint Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Complaint Details</DialogTitle>
            <DialogDescription>
              {selectedComplaint && `Complaint #${selectedComplaint.complaintNumber}`}
            </DialogDescription>
          </DialogHeader>

          {selectedComplaint && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Submission Date</h3>
                  <p>{formatDate(selectedComplaint.submissionDate)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Incident Date</h3>
                  <p>{formatDate(selectedComplaint.incidentDate)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Incident Time</h3>
                  <p>{selectedComplaint.incidentTime}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Location</h3>
                  <p>{selectedComplaint.incidentLocation}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Category</h3>
                  <p>{selectedComplaint.category || "Not specified"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Current Status</h3>
                  <p>{getStatusBadge(selectedComplaint.status)}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                <p className="mt-1 p-3 bg-gray-50 rounded-md">{selectedComplaint.description}</p>
              </div>

              {selectedComplaint.evidencePath && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Evidence</h3>
                  <div className="mt-1">
                    <a
                      href={selectedComplaint.evidencePath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-800 flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10.172 13.828a4 4 0 005.656 0l4-4a4 4 0 10-5.656-5.656l-1.102 1.101"
                        />
                      </svg>
                      View Evidence
                    </a>
                  </div>
                </div>
              )}

              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Update Status</h3>

                {updateSuccess && (
                  <Alert className="mb-4 bg-green-50 border-green-200">
                    <AlertCircle className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-600">Success</AlertTitle>
                    <AlertDescription className="text-green-700">
                      Complaint status has been updated successfully.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={newStatus} onValueChange={setNewStatus}>
                      <SelectTrigger id="status" className="w-full">
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

                  <div>
                    <Label htmlFor="adminNotes">Admin Notes (Internal Only)</Label>
                    <Textarea
                      id="adminNotes"
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      className="min-h-[100px]"
                      placeholder="Add internal notes about this complaint..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="publicNotes">Public Notes (Visible to Reporter)</Label>
                    <Textarea
                      id="publicNotes"
                      value={publicNotes}
                      onChange={(e) => setPublicNotes(e.target.value)}
                      className="min-h-[100px]"
                      placeholder="Add notes that will be visible to the person who reported this incident..."
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleUpdateStatus}
                      disabled={isUpdating}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isUpdating ? "Updating..." : "Update Status"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
