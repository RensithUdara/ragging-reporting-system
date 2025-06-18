"use server"

import { createServerSupabaseClient } from "@/lib/supabase"
import { checkAdminAuth } from "./admin-actions"

export async function getIncidentTrends() {
  try {
    const { authenticated } = await checkAdminAuth()
    if (!authenticated) {
      return { success: false, error: "Not authenticated" }
    }

    const supabase = createServerSupabaseClient()

    // Get incidents by month for the past 12 months
    const endDate = new Date()
    const startDate = new Date()
    startDate.setMonth(startDate.getMonth() - 11)

    const { data, error } = await supabase
      .from("complaints")
      .select("submission_date")
      .gte("submission_date", startDate.toISOString())
      .lte("submission_date", endDate.toISOString())
      .order("submission_date", { ascending: true })

    if (error) {
      return { success: false, error: error.message }
    }

    // Group by month
    const monthlyData: Record<string, number> = {}

    // Initialize all months with 0
    for (let i = 0; i < 12; i++) {
      const date = new Date(startDate)
      date.setMonth(startDate.getMonth() + i)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      monthlyData[monthKey] = 0
    }

    // Count incidents by month
    data.forEach((item) => {
      const date = new Date(item.submission_date)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1
    })

    // Convert to array format for charts
    const trendData = Object.entries(monthlyData).map(([month, count]) => {
      const [year, monthNum] = month.split("-")
      return {
        month: `${getMonthName(Number.parseInt(monthNum))} ${year}`,
        count,
      }
    })

    return { success: true, data: trendData }
  } catch (error) {
    console.error("Error fetching incident trends:", error)
    return { success: false, error: "Failed to fetch incident trends" }
  }
}

export async function getCategoryBreakdown() {
  try {
    const { authenticated } = await checkAdminAuth()
    if (!authenticated) {
      return { success: false, error: "Not authenticated" }
    }

    const supabase = createServerSupabaseClient()

    // Get count of incidents by category
    const { data, error } = await supabase.from("complaints").select("category").not("category", "is", null)

    if (error) {
      return { success: false, error: error.message }
    }

    // Count by category
    const categoryCount: Record<string, number> = {}
    data.forEach((item) => {
      const category = item.category || "Uncategorized"
      categoryCount[category] = (categoryCount[category] || 0) + 1
    })

    // Convert to array format for charts
    const categoryData = Object.entries(categoryCount).map(([category, count]) => ({
      category,
      count,
    }))

    return { success: true, data: categoryData }
  } catch (error) {
    console.error("Error fetching category breakdown:", error)
    return { success: false, error: "Failed to fetch category breakdown" }
  }
}

export async function getStatusDistribution() {
  try {
    const { authenticated } = await checkAdminAuth()
    if (!authenticated) {
      return { success: false, error: "Not authenticated" }
    }

    const supabase = createServerSupabaseClient()

    // Get count of incidents by status
    const { data, error } = await supabase.from("complaints").select("status")

    if (error) {
      return { success: false, error: error.message }
    }

    // Count by status
    const statusCount: Record<string, number> = {}
    data.forEach((item) => {
      const status = item.status || "Unknown"
      statusCount[status] = (statusCount[status] || 0) + 1
    })

    // Convert to array format for charts
    const statusData = Object.entries(statusCount).map(([status, count]) => ({
      status,
      count,
    }))

    return { success: true, data: statusData }
  } catch (error) {
    console.error("Error fetching status distribution:", error)
    return { success: false, error: "Failed to fetch status distribution" }
  }
}

export async function getLocationAnalysis() {
  try {
    const { authenticated } = await checkAdminAuth()
    if (!authenticated) {
      return { success: false, error: "Not authenticated" }
    }

    const supabase = createServerSupabaseClient()

    // Get count of incidents by location
    const { data, error } = await supabase
      .from("complaints")
      .select("incident_location")
      .not("incident_location", "is", null)

    if (error) {
      return { success: false, error: error.message }
    }

    // Count by location
    const locationCount: Record<string, number> = {}
    data.forEach((item) => {
      const location = item.incident_location || "Unknown"
      locationCount[location] = (locationCount[location] || 0) + 1
    })

    // Convert to array format for charts
    const locationData = Object.entries(locationCount)
      .map(([location, count]) => ({
        location,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10) // Get top 10 locations

    return { success: true, data: locationData }
  } catch (error) {
    console.error("Error fetching location analysis:", error)
    return { success: false, error: "Failed to fetch location analysis" }
  }
}

export async function getResponseTimeAnalysis() {
  try {
    const { authenticated } = await checkAdminAuth()
    if (!authenticated) {
      return { success: false, error: "Not authenticated" }
    }

    const supabase = createServerSupabaseClient()

    // Get complaints with status history
    const { data: complaints, error: complaintsError } = await supabase
      .from("complaints")
      .select("id, submission_date, status")
      .in("status", ["Resolved", "Closed"])

    if (complaintsError) {
      return { success: false, error: complaintsError.message }
    }

    // For each resolved complaint, get the history to calculate response time
    const responseTimeData = []

    for (const complaint of complaints) {
      const { data: history, error: historyError } = await supabase
        .from("complaint_history")
        .select("created_at, status")
        .eq("complaint_id", complaint.id)
        .eq("status", "Resolved")
        .order("created_at", { ascending: true })
        .limit(1)

      if (!historyError && history.length > 0) {
        const submissionDate = new Date(complaint.submission_date)
        const resolutionDate = new Date(history[0].created_at)

        // Calculate days to resolve
        const daysToResolve = Math.floor((resolutionDate.getTime() - submissionDate.getTime()) / (1000 * 60 * 60 * 24))

        responseTimeData.push({
          complaintId: complaint.id,
          daysToResolve,
        })
      }
    }

    // Group by response time ranges
    const ranges = [
      { range: "1-3 days", min: 1, max: 3, count: 0 },
      { range: "4-7 days", min: 4, max: 7, count: 0 },
      { range: "8-14 days", min: 8, max: 14, count: 0 },
      { range: "15-30 days", min: 15, max: 30, count: 0 },
      { range: "30+ days", min: 31, max: Number.POSITIVE_INFINITY, count: 0 },
    ]

    responseTimeData.forEach((item) => {
      const range = ranges.find((r) => item.daysToResolve >= r.min && item.daysToResolve <= r.max)
      if (range) {
        range.count++
      }
    })

    return {
      success: true,
      data: ranges.map((r) => ({ range: r.range, count: r.count })),
      averageTime:
        responseTimeData.length > 0
          ? responseTimeData.reduce((sum, item) => sum + item.daysToResolve, 0) / responseTimeData.length
          : 0,
    }
  } catch (error) {
    console.error("Error fetching response time analysis:", error)
    return { success: false, error: "Failed to fetch response time analysis" }
  }
}

// Helper function to get month name
function getMonthName(month: number): string {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  return months[month - 1]
}
