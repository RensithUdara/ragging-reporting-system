"use server"

import { createServerSupabaseClient } from "@/lib/supabase"
import { generateComplaintNumber } from "@/lib/utils"
import { checkUserAuth } from "./auth-actions"

// Maximum file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024

// Allowed file types
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]

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
    let evidenceUrl = null
    let evidenceFileName = null
    let evidenceFileType = null

    if (evidence && evidence.size > 0) {
      // Validate file size
      if (evidence.size > MAX_FILE_SIZE) {
        return { success: false, error: "File size exceeds the maximum limit of 5MB" }
      }

      // Validate file type
      if (!ALLOWED_FILE_TYPES.includes(evidence.type)) {
        return { success: false, error: "File type not allowed. Please upload an image, PDF, or document file" }
      }

      const fileExt = evidence.name.split(".").pop()
      const fileName = `${complaintNumber}_${Date.now()}.${fileExt}`
      evidenceFileName = evidence.name
      evidenceFileType = evidence.type

      // Create a storage bucket if it doesn't exist
      const { data: bucketData, error: bucketError } = await supabase.storage.getBucket("evidence")
      if (bucketError && bucketError.message.includes("not found")) {
        await supabase.storage.createBucket("evidence", {
          public: false,
          fileSizeLimit: MAX_FILE_SIZE,
        })
      }

      // Upload to Supabase Storage
      const { data: fileData, error: fileError } = await supabase.storage.from("evidence").upload(fileName, evidence, {
        contentType: evidence.type,
        cacheControl: "3600",
      })

      if (fileError) {
        console.error("Error uploading file:", fileError)
        return { success: false, error: "Failed to upload evidence file. Please try again." }
      }

      evidencePath = fileData.path

      // Get the URL for the uploaded file
      const { data: urlData } = await supabase.storage.from("evidence").createSignedUrl(fileData.path, 60 * 60 * 24 * 7) // 7 days expiry
      evidenceUrl = urlData?.signedUrl
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
        evidence_file_name: evidenceFileName,
        evidence_file_type: evidenceFileType,
        anonymous,
      })
      .select()

    if (complaintError) {
      console.error("Error creating complaint:", complaintError)
      return { success: false, error: complaintError.message }
    }

    // Add initial entry to complaint history
    await supabase.from("complaint_history").insert({
      complaint_id: complaint[0].id,
      status: "Pending",
      notes: "Complaint submitted",
    })

    // Return success with the complaint number and evidence URL if available
    return {
      success: true,
      complaintNumber,
      evidenceUrl: evidenceUrl,
    }
  } catch (error) {
    console.error("Error submitting report:", error)
    return { success: false, error: "Failed to submit report. Please try again." }
  }
}

export async function getEvidenceUrl(complaintId: string) {
  try {
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

    // If there's evidence, get a signed URL
    let evidenceUrl = null
    if (complaint.evidence_path) {
      const { data: urlData } = await supabase.storage
        .from("evidence")
        .createSignedUrl(complaint.evidence_path, 60 * 60) // 1 hour expiry

      evidenceUrl = urlData?.signedUrl
    }

    return {
      success: true,
      complaint: {
        ...complaint,
        evidenceUrl,
      },
    }
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

    // Get signed URLs for evidence files
    const complaintsWithUrls = await Promise.all(
      complaints.map(async (complaint) => {
        if (complaint.evidence_path) {
          const { data: urlData } = await supabase.storage
            .from("evidence")
            .createSignedUrl(complaint.evidence_path, 60 * 60) // 1 hour expiry

          return {
            ...complaint,
            evidenceUrl: urlData?.signedUrl,
          }
        }
        return complaint
      }),
    )

    return { success: true, complaints: complaintsWithUrls }
  } catch (error) {
    console.error("Error fetching user complaints:", error)
    return { success: false, error: "Failed to fetch complaints" }
  }
}
