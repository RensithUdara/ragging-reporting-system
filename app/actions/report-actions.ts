"use server"

import { createServerSupabaseClient } from "@/lib/supabase"
import { generateComplaintNumber } from "@/lib/utils"
import { checkUserAuth } from "./auth-actions"

export async function submitReport(formData: FormData) {
  try {
    const supabase = createServerSupabaseClient()

    // Generate a unique complaint number
    const complaintNumber = generateComplaintNumber()

    // Extract form data
    const incidentDate = formData.get("incidentDate") as string
    const incidentTime = formData.get("incidentTime") as string
    const incidentLocation = formData.get("incidentLocation") as string
    const incidentCategory = formData.get("incidentCategory") as string
    const incidentDescription = formData.get("incidentDescription") as string
    const anonymous = formData.get("anonymous") === "true"
    const evidence = formData.get("evidence") as File

    // Validate required fields
    if (!incidentDate || !incidentTime || !incidentLocation || !incidentDescription) {
      return { success: false, error: "Please fill in all required fields" }
    }

    // Check if user is authenticated
    const { authenticated, user } = await checkUserAuth()
    const userId = authenticated ? user.id : null

    // Process evidence file if provided
    let evidencePath = null
    if (evidence && evidence.size > 0) {
      const fileExt = evidence.name.split(".").pop()
      const fileName = `${complaintNumber}.${fileExt}`

      // Upload to Supabase Storage
      const { data: fileData, error: fileError } = await supabase.storage.from("evidence").upload(fileName, evidence)

      if (fileError) {
        console.error("Error uploading file:", fileError)
      } else {
        evidencePath = fileData.path
      }
    }

    // Create new complaint in database
    const { data: complaint, error: complaintError } = await supabase
      .from("complaints")
      .insert({
        complaint_number: complaintNumber,
        user_id: userId,
        incident_date: incidentDate,
        incident_time: incidentTime,
        incident_location: incidentLocation,
        category: incidentCategory || null,
        description: incidentDescription,
        status: "Pending",
        evidence_path: evidencePath,
        anonymous,
      })
      .select()

    if (complaintError) {
      return { success: false, error: complaintError.message }
    }

    // Add initial entry to complaint history
    await supabase.from("complaint_history").insert({
      complaint_id: complaint[0].id,
      status: "Pending",
      notes: "Complaint submitted",
    })

    // Return success with the complaint number
    return { success: true, complaintNumber }
  } catch (error) {
    console.error("Error submitting report:", error)
    return { success: false, error: "Failed to submit report. Please try again." }
  }
}

export async function checkComplaintStatus(complaintNumber: string) {
  try {
    const supabase = createServerSupabaseClient()

    // Find the complaint by number
    const { data: complaint, error } = await supabase
      .from("complaints")
      .select("*")
      .eq("complaint_number", complaintNumber)
      .single()

    if (error || !complaint) {
      return {
        success: false,
        error: "No complaint found with that number. Please check and try again.",
      }
    }

    return { success: true, complaint }
  } catch (error) {
    console.error("Error checking complaint status:", error)
    return {
      success: false,
      error: "Failed to check complaint status. Please try again.",
    }
  }
}

export async function getUserComplaints() {
  try {
    const { authenticated, user } = await checkUserAuth()

    if (!authenticated) {
      return { success: false, error: "Not authenticated" }
    }

    const supabase = createServerSupabaseClient()

    // Get all complaints for this user
    const { data: complaints, error } = await supabase
      .from("complaints")
      .select("*")
      .eq("user_id", user.id)
      .order("submission_date", { ascending: false })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, complaints }
  } catch (error) {
    console.error("Error fetching user complaints:", error)
    return { success: false, error: "Failed to fetch complaints" }
  }
}
