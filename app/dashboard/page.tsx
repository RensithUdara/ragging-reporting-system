"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Clock, FileText, LogOut, Plus, Shield, User } from "lucide-react"
import { getUserComplaints } from "@/app/actions/report-actions"
import { checkUserAuth, logoutUser } from "@/app/actions/auth-actions"
import { formatDate } from "@/lib/utils"

export default function DashboardPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [complaints, setComplaints] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function checkAuth() {
      const { authenticated, user } = await checkUserAuth()

      if (!authenticated) {
        router.push("/auth/login")
        return
      }

      setUser(user)
      loadComplaints()
    }

    checkAuth()
  }, [router])

  async function loadComplaints() {
    setIsLoading(true)
    try {
      const result = await getUserComplaints()
      if (result.success) {
        setComplaints(result.complaints || [])
      } else {
        setError(result.error || "Failed to load complaints")
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
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
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-green-700 to-green-800 text-white py-3 px-4 border-b border-green-800 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Shield className="h-6 w-6 mr-2 animate-pulse" />
              <h1 className="text-xl font-bold">SafeCampus Sri Lanka</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                <span>{user?.fullName || "Student"}</span>
              </div>
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
          <h2 className="text-2xl font-bold">Student Dashboard</h2>
          <p className="text-gray-500">Manage and track your ragging incident reports</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="animate-fade-in-up animation-delay-100">
            <Card className="shadow-md hover:shadow-lg transition-shadow border-t-2 border-green-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{complaints.length}</div>
              </CardContent>
            </Card>
          </div>

          <div className="animate-fade-in-up animation-delay-200">
            <Card className="shadow-md hover:shadow-lg transition-shadow border-t-2 border-amber-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600">
                  {complaints.filter((c) => c.status.toLowerCase() === "pending").length}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="animate-fade-in-up animation-delay-300">
            <Card className="shadow-md hover:shadow-lg transition-shadow border-t-2 border-green-500">
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
        </div>

        <div className="animate-fade-in-up animation-delay-400">
          <Card className="mb-6 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>My Complaints</CardTitle>
                <CardDescription>View and track your reported incidents</CardDescription>
              </div>
              <Button
                asChild
                className="bg-green-600 hover:bg-green-700 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 duration-200"
              >
                <Link href="/report">
                  <Plus className="h-4 w-4 mr-2" />
                  New Report
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4 shadow-md">
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
                    ) : complaints.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <div className="flex flex-col items-center justify-center text-gray-500">
                            <FileText className="h-12 w-12 mb-2 text-gray-400" />
                            <p className="text-lg font-medium">No complaints found</p>
                            <p className="text-sm">You haven't submitted any complaints yet</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      complaints.map((complaint) => (
                        <TableRow key={complaint.id} className="hover:bg-gray-50 transition-colors">
                          <TableCell className="font-medium">{complaint.complaint_number}</TableCell>
                          <TableCell>{formatDate(complaint.submission_date)}</TableCell>
                          <TableCell>{formatDate(complaint.incident_date)}</TableCell>
                          <TableCell>{complaint.incident_location}</TableCell>
                          <TableCell>{getStatusBadge(complaint.status)}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              asChild
                              size="sm"
                              variant="outline"
                              className="hover:bg-green-50 transition-colors shadow-sm hover:shadow-md"
                            >
                              <Link href={`/dashboard/complaints/${complaint.id}`}>View Details</Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
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
    </div>
  )
}
