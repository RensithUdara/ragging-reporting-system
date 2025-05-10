"use server"

import { cookies } from "next/headers"
import { createServerSupabaseClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

// Admin credentials
const ADMIN_EMAIL = "admin@gmail.com"
const ADMIN_PASSWORD = "@Admin123"

export async function checkAdminAuth() {
  try {
    const session = cookies().get("admin-session")

    if (!session || !session.value) {
      return { authenticated: false }
    }

    const userData = JSON.parse(session.value)

    if (userData.role !== "admin") {
      return { authenticated: false }
    }

    return { authenticated: true, user: userData }
  } catch (error) {
    console.error("Error checking admin auth:", error)
    return { authenticated: false }
  }
}

export async function adminLogin(email: string, password: string) {
  try {
    // Check if using hardcoded admin credentials
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Set session cookie for admin
      cookies().set(
        "admin-session",
        JSON.stringify({
          id: "admin-1",
          email: ADMIN_EMAIL,
          role: "admin",
        }),
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24 * 7, // 1 week
          path: "/",
        },
      )
      return { success: true }
    }

    // Otherwise, use Supabase authentication
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { success: false, error: error.message }
    }

    // Check if the user has admin role
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single()

    if (profile?.role !== "admin") {
      await supabase.auth.signOut()
      return { success: false, error: "Unauthorized access. Admin privileges required." }
    }

    // Set session cookie
    cookies().set(
      "admin-session",
      JSON.stringify({
        id: data.user.id,
        email: data.user.email,
        role: "admin",
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
      },
    )

    return { success: true }
  } catch (error) {
    console.error("Error during admin login:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function adminLogout() {
  cookies().delete("admin-session")
  return { success: true }
}

export async function getComplaints() {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase.from("complaints").select("*").order("submission_date", { ascending: false })

    if (error) {
      return { success: false, error: error.message }
    }

    return {
      success: true,
      complaints: data.map((complaint) => ({
        complaintId: complaint.id,
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
      })),
    }
  } catch (error) {
    console.error("Error fetching complaints:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function getComplaintDetails(complaintId: string) {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase.from("complaints").select("*").eq("id", complaintId).single()

    if (error) {
      return { success: false, error: error.message }
    }

    return {
      success: true,
      complaint: {
        complaintId: data.id,
        complaintNumber: data.complaint_number,
        submissionDate: data.submission_date,
        incidentDate: data.incident_date,
        incidentTime: data.incident_time,
        incidentLocation: data.incident_location,
        category: data.category,
        description: data.description,
        status: data.status,
        adminNotes: data.admin_notes,
        publicNotes: data.public_notes,
        evidencePath: data.evidence_path,
      },
    }
  } catch (error) {
    console.error("Error fetching complaint details:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function updateComplaintStatus(
  complaintId: string,
  status: string,
  adminNotes: string,
  publicNotes: string,
) {
  try {
    const supabase = createServerSupabaseClient()

    const { error } = await supabase
      .from("complaints")
      .update({
        status,
        admin_notes: adminNotes,
        public_notes: publicNotes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", complaintId)

    if (error) {
      return { success: false, error: error.message }
    }

    // Add status update to history
    await supabase.from("complaint_history").insert({
      complaint_id: complaintId,
      status,
      notes: adminNotes,
      created_at: new Date().toISOString(),
    })

    revalidatePath(`/admin/complaints/${complaintId}`)
    revalidatePath("/admin/dashboard")

    return { success: true }
  } catch (error) {
    console.error("Error updating complaint status:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
