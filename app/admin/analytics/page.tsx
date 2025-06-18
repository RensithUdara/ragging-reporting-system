"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import {
  AlertCircle,
  BarChart3,
  Clock,
  Download,
  FileText,
  LogOut,
  PieChartIcon,
  RefreshCw,
  Shield,
  TrendingUp,
  User,
} from "lucide-react"
import { checkAdminAuth, adminLogout } from "@/app/actions/admin-actions"
import {
  getIncidentTrends,
  getCategoryBreakdown,
  getStatusDistribution,
  getLocationAnalysis,
  getResponseTimeAnalysis,
} from "@/app/actions/analytics-actions"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Colors for charts
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
  "#FF6B6B",
  "#6B66FF",
  "#FFD166",
  "#06D6A0",
]

export default function AnalyticsDashboard() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Chart data states
  const [trendData, setTrendData] = useState<any[]>([])
  const [categoryData, setCategoryData] = useState<any[]>([])
  const [statusData, setStatusData] = useState<any[]>([])
  const [locationData, setLocationData] = useState<any[]>([])
  const [responseTimeData, setResponseTimeData] = useState<any[]>([])
  const [averageResponseTime, setAverageResponseTime] = useState<number>(0)

  useEffect(() => {
    async function checkAuth() {
      const { authenticated } = await checkAdminAuth()
      if (!authenticated) {
        router.push("/admin/login")
        return
      }

      loadAnalyticsData()
    }

    checkAuth()
  }, [router])

  async function loadAnalyticsData() {
    setIsLoading(true)
    setError(null)

    try {
      // Load all analytics data in parallel
      const [trendsResult, categoryResult, statusResult, locationResult, responseTimeResult] = await Promise.all([
        getIncidentTrends(),
        getCategoryBreakdown(),
        getStatusDistribution(),
        getLocationAnalysis(),
        getResponseTimeAnalysis(),
      ])

      if (trendsResult.success) {
        setTrendData(trendsResult.data)
      }

      if (categoryResult.success) {
        setCategoryData(categoryResult.data)
      }

      if (statusResult.success) {
        setStatusData(statusResult.data)
      }

      if (locationResult.success) {
        setLocationData(locationResult.data)
      }

      if (responseTimeResult.success) {
        setResponseTimeData(responseTimeResult.data)
        setAverageResponseTime(responseTimeResult.averageTime)
      }

      if (
        !trendsResult.success ||
        !categoryResult.success ||
        !statusResult.success ||
        !locationResult.success ||
        !responseTimeResult.success
      ) {
        setError("Some data could not be loaded. Please try refreshing.")
      }
    } catch (err) {
      console.error("Error loading analytics data:", err)
      setError("Failed to load analytics data. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleLogout() {
    await adminLogout()
    router.push("/admin/login")
  }

  function exportToCSV(data: any[], filename: string) {
    if (!data.length) return

    // Convert data to CSV format
    const headers = Object.keys(data[0]).join(",")
    const rows = data.map((item) => Object.values(item).join(","))
    const csv = [headers, ...rows].join("\n")

    // Create download link
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${filename}-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
              <p className="text-gray-500">Visualize and analyze ragging incident data</p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={loadAnalyticsData} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Refresh Data
              </Button>
            </div>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6 animate-shake">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="shadow-md hover:shadow-lg transition-shadow border-t-2 border-blue-500 animate-fade-in-up animation-delay-100">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-sm font-medium text-gray-500">
                <TrendingUp className="h-4 w-4 mr-2 text-blue-500" />
                Incident Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {trendData.length > 0 ? trendData[trendData.length - 1].count : 0}
                <span className="text-sm font-normal text-gray-500 ml-1">this month</span>
              </div>
              <div className="text-sm text-gray-500">
                {trendData.length > 1 && trendData[trendData.length - 2].count > 0
                  ? `${Math.round(((trendData[trendData.length - 1].count - trendData[trendData.length - 2].count) / trendData[trendData.length - 2].count) * 100)}% from last month`
                  : "No data for comparison"}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow border-t-2 border-green-500 animate-fade-in-up animation-delay-200">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-sm font-medium text-gray-500">
                <PieChartIcon className="h-4 w-4 mr-2 text-green-500" />
                Resolution Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statusData.length > 0
                  ? `${Math.round(((statusData.find((s) => s.status === "Resolved")?.count || 0) / statusData.reduce((sum, item) => sum + item.count, 0)) * 100)}%`
                  : "0%"}
              </div>
              <div className="text-sm text-gray-500">
                {statusData.find((s) => s.status === "Resolved")?.count || 0} resolved out of{" "}
                {statusData.reduce((sum, item) => sum + item.count, 0)} total
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow border-t-2 border-amber-500 animate-fade-in-up animation-delay-300">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-sm font-medium text-gray-500">
                <Clock className="h-4 w-4 mr-2 text-amber-500" />
                Avg. Response Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {averageResponseTime > 0 ? `${Math.round(averageResponseTime)} days` : "N/A"}
              </div>
              <div className="text-sm text-gray-500">From submission to resolution</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="trends" className="mb-6">
          <TabsList className="mb-6">
            <TabsTrigger value="trends" className="flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Incident Trends
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              Categories
            </TabsTrigger>
            <TabsTrigger value="status" className="flex items-center">
              <PieChartIcon className="h-4 w-4 mr-2" />
              Status Distribution
            </TabsTrigger>
            <TabsTrigger value="locations" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Top Locations
            </TabsTrigger>
          </TabsList>

          <Card className="shadow-lg animate-fade-in-up animation-delay-400">
            <CardContent className="pt-6">
              <TabsContent value="trends" className="mt-0">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Monthly Incident Trends</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportToCSV(trendData, "incident-trends")}
                    disabled={trendData.length === 0}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>

                <div className="h-[400px]">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <Clock className="h-8 w-8 mr-2 animate-spin text-green-600" />
                      <span>Loading data...</span>
                    </div>
                  ) : trendData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                      <FileText className="h-16 w-16 mb-2 text-gray-400" />
                      <p className="text-lg font-medium">No trend data available</p>
                      <p className="text-sm">There are no incidents recorded in the system yet</p>
                    </div>
                  ) : (
                    <ChartContainer
                      config={{
                        count: {
                          label: "Incidents",
                          color: "hsl(var(--chart-1))",
                        },
                      }}
                      className="h-[400px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trendData} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" angle={-45} textAnchor="end" height={70} tick={{ fontSize: 12 }} />
                          <YAxis allowDecimals={false} />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="count"
                            stroke="var(--color-count)"
                            name="Incidents"
                            strokeWidth={2}
                            activeDot={{ r: 8 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="categories" className="mt-0">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Incidents by Category</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportToCSV(categoryData, "category-breakdown")}
                    disabled={categoryData.length === 0}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>

                <div className="h-[400px]">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <Clock className="h-8 w-8 mr-2 animate-spin text-green-600" />
                      <span>Loading data...</span>
                    </div>
                  ) : categoryData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                      <FileText className="h-16 w-16 mb-2 text-gray-400" />
                      <p className="text-lg font-medium">No category data available</p>
                      <p className="text-sm">There are no categorized incidents in the system yet</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={categoryData.sort((a, b) => b.count - a.count)}
                        margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" angle={-45} textAnchor="end" height={70} tick={{ fontSize: 12 }} />
                        <YAxis allowDecimals={false} />
                        <Tooltip
                          formatter={(value) => [`${value} incidents`, "Count"]}
                          labelFormatter={(label) => `Category: ${label}`}
                        />
                        <Legend />
                        <Bar dataKey="count" name="Incidents" fill="#0088FE">
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="status" className="mt-0">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Status Distribution</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportToCSV(statusData, "status-distribution")}
                    disabled={statusData.length === 0}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>

                <div className="h-[400px]">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <Clock className="h-8 w-8 mr-2 animate-spin text-green-600" />
                      <span>Loading data...</span>
                    </div>
                  ) : statusData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                      <FileText className="h-16 w-16 mb-2 text-gray-400" />
                      <p className="text-lg font-medium">No status data available</p>
                      <p className="text-sm">There are no incidents in the system yet</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                      <div className="flex items-center justify-center">
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={statusData}
                              cx="50%"
                              cy="50%"
                              labelLine={true}
                              outerRadius={100}
                              fill="#8884d8"
                              dataKey="count"
                              nameKey="status"
                              label={({ status, count, percent }) =>
                                `${status}: ${count} (${(percent * 100).toFixed(0)}%)`
                              }
                            >
                              {statusData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip
                              formatter={(value) => [`${value} incidents`, "Count"]}
                              labelFormatter={(label) => `Status: ${label}`}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="flex flex-col justify-center">
                        <h4 className="text-lg font-medium mb-4">Status Breakdown</h4>
                        <div className="space-y-4">
                          {statusData.map((item, index) => (
                            <div key={index} className="flex items-center">
                              <div
                                className="w-4 h-4 rounded-full mr-2"
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                              />
                              <div className="flex-1">
                                <div className="flex justify-between">
                                  <span className="font-medium">{item.status}</span>
                                  <span>{item.count} incidents</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                  <div
                                    className="h-2 rounded-full"
                                    style={{
                                      width: `${(item.count / statusData.reduce((sum, i) => sum + i.count, 0)) * 100}%`,
                                      backgroundColor: COLORS[index % COLORS.length],
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="locations" className="mt-0">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Top Incident Locations</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportToCSV(locationData, "location-analysis")}
                    disabled={locationData.length === 0}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>

                <div className="h-[400px]">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <Clock className="h-8 w-8 mr-2 animate-spin text-green-600" />
                      <span>Loading data...</span>
                    </div>
                  ) : locationData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                      <FileText className="h-16 w-16 mb-2 text-gray-400" />
                      <p className="text-lg font-medium">No location data available</p>
                      <p className="text-sm">There are no incidents with location data in the system yet</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={locationData}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" allowDecimals={false} />
                        <YAxis type="category" dataKey="location" width={140} tick={{ fontSize: 12 }} />
                        <Tooltip
                          formatter={(value) => [`${value} incidents`, "Count"]}
                          labelFormatter={(label) => `Location: ${label}`}
                        />
                        <Legend />
                        <Bar dataKey="count" name="Incidents" fill="#0088FE">
                          {locationData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-lg animate-fade-in-up animation-delay-500">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-amber-500" />
                Response Time Analysis
              </CardTitle>
              <CardDescription>Time taken to resolve complaints</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Clock className="h-8 w-8 mr-2 animate-spin text-green-600" />
                    <span>Loading data...</span>
                  </div>
                ) : responseTimeData.length === 0 || responseTimeData.every((item) => item.count === 0) ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <FileText className="h-16 w-16 mb-2 text-gray-400" />
                    <p className="text-lg font-medium">No response time data available</p>
                    <p className="text-sm">There are no resolved incidents in the system yet</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={responseTimeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="range" />
                      <YAxis allowDecimals={false} />
                      <Tooltip
                        formatter={(value) => [`${value} complaints`, "Count"]}
                        labelFormatter={(label) => `Resolution Time: ${label}`}
                      />
                      <Legend />
                      <Bar dataKey="count" name="Complaints" fill="#FFBB28" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              {averageResponseTime > 0 && (
                <div className="mt-4 p-3 bg-amber-50 rounded-md border border-amber-200">
                  <div className="flex items-center text-amber-800">
                    <Clock className="h-5 w-5 mr-2 text-amber-600" />
                    <span className="font-medium">Average Resolution Time: {Math.round(averageResponseTime)} days</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-lg animate-fade-in-up animation-delay-600">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
                Incident Summary
              </CardTitle>
              <CardDescription>Key metrics and insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-md border">
                  <h4 className="font-medium text-gray-700 mb-2">Total Incidents</h4>
                  <div className="text-3xl font-bold">{statusData.reduce((sum, item) => sum + item.count, 0)}</div>
                  <div className="mt-2 text-sm text-gray-500">Across all categories and locations</div>
                </div>

                <div className="p-4 bg-gray-50 rounded-md border">
                  <h4 className="font-medium text-gray-700 mb-2">Most Common Category</h4>
                  <div className="text-xl font-bold">
                    {categoryData.length > 0 ? categoryData.sort((a, b) => b.count - a.count)[0].category : "N/A"}
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    {categoryData.length > 0
                      ? `${categoryData.sort((a, b) => b.count - a.count)[0].count} incidents (${Math.round((categoryData.sort((a, b) => b.count - a.count)[0].count / categoryData.reduce((sum, item) => sum + item.count, 0)) * 100)}% of total)`
                      : "No category data available"}
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-md border">
                  <h4 className="font-medium text-gray-700 mb-2">Most Frequent Location</h4>
                  <div className="text-xl font-bold">{locationData.length > 0 ? locationData[0].location : "N/A"}</div>
                  <div className="mt-2 text-sm text-gray-500">
                    {locationData.length > 0
                      ? `${locationData[0].count} incidents reported at this location`
                      : "No location data available"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="bg-gray-100 py-4 border-t shadow-inner mt-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 mb-4 md:mb-0">&copy; 2025 CodeCraftix Technologies. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="/about" className="text-gray-600 hover:text-green-600 transition-colors">
                About
              </a>
              <a href="/faq" className="text-gray-600 hover:text-green-600 transition-colors">
                FAQ
              </a>
              <a href="/privacy" className="text-gray-600 hover:text-green-600 transition-colors">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
