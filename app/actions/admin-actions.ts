"use server"

import { cookies } from "next/headers"
import { createServerSupabaseClient } from "@/lib/supabase"
import { redirect } from "next/navigation"
import bcrypt from "bcryptjs"

export async function adminLogin(formData: FormData) {
  try {
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (!email || !password) {
      return { success: false, error: "Email and password are required" }
    }

    const supabase = createServerSupabaseClient()

    // Get the user from the database
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .eq("role", "admin")
      .single()

    if (userError || !user) {
      return { success: false, error: "Invalid email or password" }
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return { success: false, error: "Invalid email or password" }
    }

    // Set admin session cookie
    cookies().set("admin_session", JSON.stringify({ id: user.id, email: user.email, role: user.role }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    return { success: true }
  } catch (error) {
    console.error("Error during admin login:", error)
    return { success: false, error: "An unexpected error occurred. Please try again." }
  }
}

export async function adminLogout() {
  cookies().delete("admin_session")
  redirect("/admin/login")
}

export async function checkAdminAuth() {
  try {
    const sessionCookie = cookies().get("admin_session")
    if (!sessionCookie?.value) {
      return { authenticated: false }
    }

    const session = JSON.parse(sessionCookie.value)
    if (!session || !session.id || session.role !== "admin") {
      return { authenticated: false }
    }

    const supabase = createServerSupabaseClient()
    const { data: user, error } = await supabase.from("users").select("*").eq("id", session.id).single()

    if (error || !user || user.role !== "admin") {
      return { authenticated: false }
    }

    return { authenticated: true, user }
  } catch (error) {
    console.error("Error checking admin auth:", error)
    return { authenticated: false }
  }
}

export async function getComplaints(status?: string) {
  try {
    const { authenticated } = await checkAdminAuth()
    if (!authenticated) {
      return { success: false, error: "Not authenticated" }
    }

    const supabase = createServerSupabaseClient()

    let query = supabase.from("complaints").select("*").order("submission_date", { ascending: false })

    if (status && status !== "all") {
      query = query.eq("status", status)
    }

    const { data: complaints, error } = await query

    if (error) {
      return { success: false, error: error.message }
    }

    // Format the complaints for the admin dashboard
    const formattedComplaints = complaints.map((complaint) => ({
      id: complaint.id,
      complaintNumber: complaint.complaint_number,
      submissionDate: complaint.submission_date,
      incidentDate: complaint.incident_date,
      incidentTime: complaint.incident_time,
      incidentLocation: complaint.incident_location,
      category: complaint.category,
      description: complaint.description,
      status: complaint.status,
      adminNotes: complaint.admin_notes,
      publicNotes: complaint.public_notes,
      evidencePath: complaint.evidence_path,
      evidenceFileName: complaint.evidence_file_name,
      evidenceFileType: complaint.evidence_file_type,
      anonymous: complaint.anonymous,
    }))

    return { success: true, complaints: formattedComplaints }
  } catch (error) {
    console.error("Error fetching complaints:", error)
    return { success: false, error: "Failed to fetch complaints" }
  }
}

export async function getComplaintDetails(id: string) {
  try {
    const { authenticated } = await checkAdminAuth()
    if (!authenticated) {
      return { success: false, error: "Not authenticated" }
    }

    const supabase = createServerSupabaseClient()

    const { data: complaint, error } = await supabase.from("complaints").select("*").eq("id", id).single()

    if (error || !complaint) {
      return { success: false, error: "Complaint not found" }
    }

    // Format the complaint for the admin view
    const formattedComplaint = {
      id: complaint.id,
      complaintNumber: complaint.complaint_number,
      submissionDate: complaint.submission_date,
      incidentDate: complaint.incident_date,
      incidentTime: complaint.incident_time,
      incidentLocation: complaint.incident_location,
      category: complaint.category,
      description: complaint.description,
      status: complaint.status,
      adminNotes: complaint.admin_notes,
      publicNotes: complaint.public_notes,
      evidencePath: complaint.evidence_path,
      evidenceFileName: complaint.evidence_file_name,
      evidenceFileType: complaint.evidence_file_type,
      anonymous: complaint.anonymous,
    }

    return { success: true, complaint: formattedComplaint }
  } catch (error) {
    console.error("Error fetching complaint details:", error)
    return { success: false, error: "Failed to fetch complaint details" }
  }
}

export async function updateComplaintStatus(id: string, status: string, adminNotes: string, publicNotes: string) {
  try {
    const { authenticated, user } = await checkAdminAuth()
    if (!authenticated) {
      return { success: false, error: "Not authenticated" }
    }

    const supabase = createServerSupabaseClient()

    // Update the complaint
    const { error: updateError } = await supabase
      .from("complaints")
      .update({
        status,
        admin_notes: adminNotes,
        public_notes: publicNotes,
      })
      .eq("id", id)

    if (updateError) {
      return { success: false, error: updateError.message }
    }

    // Add entry to complaint history
    await supabase.from("complaint_history").insert({
      complaint_id: id,
      status,
      notes: adminNotes,
      admin_id: user.id,
    })

    return { success: true }
  } catch (error) {
    console.error("Error updating complaint status:", error)
    return { success: false, error: "Failed to update complaint status" }
  }
}

export async function getEvidenceUrlAdmin(complaintId: string) {
  try {
    const { authenticated } = await checkAdminAuth()
    if (!authenticated) {
      return { success: false, error: "Not authenticated" }
    }

    const supabase = createServerSupabaseClient()

    // Get the complaint to find the evidence path
    const { data: complaint, error: complaintError } = await supabase
      .from("complaints")
      .select("evidence_path")
      .eq("id", complaintId)
      .single()

    if (complaintError || !complaint || !complaint.evidence_path) {
      return { success: false, error: "Evidence not found" }
    }

    // Generate a signed URL for the evidence file
    const { data: urlData, error: urlError } = await supabase.storage
      .from("evidence")
      .createSignedUrl(complaint.evidence_path, 60 * 60) // 1 hour expiry

    if (urlError) {
      return { success: false, error: "Failed to generate download URL" }
    }

    return { success: true, url: urlData.signedUrl }
  } catch (error) {
    console.error("Error getting evidence URL:", error)
    return { success: false, error: "Failed to get evidence URL" }
  }
}

export async function getDashboardStats() {
  try {
    const { authenticated } = await checkAdminAuth()
    if (!authenticated) {
      return { success: false, error: "Not authenticated" }
    }

    const supabase = createServerSupabaseClient()

    // Get total complaints
    const { count: totalComplaints, error: totalError } = await supabase
      .from("complaints")
      .select("*", { count: "exact", head: true })

    if (totalError) {
      return { success: false, error: totalError.message }
    }

    // Get pending complaints
    const { count: pendingComplaints, error: pendingError } = await supabase
      .from("complaints")
      .select("*", { count: "exact", head: true })
      .eq("status", "Pending")

    if (pendingError) {
      return { success: false, error: pendingError.message }
    }

    // Get resolved complaints
    const { count: resolvedComplaints, error: resolvedError } = await supabase
      .from("complaints")
      .select("*", { count: "exact", head: true })
      .eq("status", "Resolved")

    if (resolvedError) {
      return { success: false, error: resolvedError.message }
    }

    // Get complaints by category
    const { data: categoryCounts, error: categoryError } = await supabase
      .from("complaints")
      .select("category, count")
      .not("category", "is", null)
      .group("category")

    if (categoryError) {
      return { success: false, error: categoryError.message }
    }

    return {
      success: true,
      stats: {
        totalComplaints,
        pendingComplaints,
        resolvedComplaints,
        categoryCounts: categoryCounts || [],
      },
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return { success: false, error: "Failed to fetch dashboard statistics" }
  }
}
