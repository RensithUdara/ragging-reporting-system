"use server"

import { cookies } from "next/headers"
import { createServerSupabaseClient } from "@/lib/supabase"
import { generateVerificationToken } from "@/lib/utils"
import bcrypt from "bcryptjs"

export async function adminLogin(email: string, password: string) {
  try {
    // Check for hardcoded admin credentials
    if (email === "admin@gmail.com" && password === "@Admin123") {
      // Set session cookie for admin
      cookies().set(
        "admin-session",
        JSON.stringify({
          id: "admin-1",
          email: "admin@gmail.com",
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

    const supabase = createServerSupabaseClient()

    // Get the admin user
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

    // Set session cookie
    cookies().set(
      "admin-session",
      JSON.stringify({
        id: user.id,
        email: user.email,
        role: user.role,
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
    console.error("Error during login:", error)
    return { success: false, error: "An error occurred during login" }
  }
}

export async function adminLogout() {
  cookies().delete("admin-session")
  return { success: true }
}

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

export async function registerUser(email: string, password: string, fullName: string) {
  try {
    const supabase = createServerSupabaseClient()

    // Check if user already exists
    const { data: existingUser } = await supabase.from("users").select("*").eq("email", email).single()

    if (existingUser) {
      return { success: false, error: "Email already registered" }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Generate verification token
    const verificationToken = generateVerificationToken()

    // Create user in our database
    const { data: user, error: userError } = await supabase
      .from("users")
      .insert({
        email,
        password: hashedPassword,
        full_name: fullName,
        role: "student",
        email_verified: false,
        verification_token: verificationToken,
      })
      .select()

    if (userError) {
      return { success: false, error: userError.message }
    }

    // In a real app, send verification email with the token
    // For now, we'll just return the token for testing
    return {
      success: true,
      message: "Registration successful. Please check your email for verification.",
      verificationToken, // In production, remove this and send via email
    }
  } catch (error) {
    console.error("Error during registration:", error)
    return { success: false, error: "An error occurred during registration" }
  }
}

export async function verifyEmail(token: string) {
  try {
    const supabase = createServerSupabaseClient()

    // Find user with this verification token
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("verification_token", token)
      .single()

    if (userError || !user) {
      return { success: false, error: "Invalid verification token" }
    }

    // Update user to verified
    const { error: updateError } = await supabase
      .from("users")
      .update({
        email_verified: true,
        verification_token: null,
      })
      .eq("id", user.id)

    if (updateError) {
      return { success: false, error: updateError.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error during email verification:", error)
    return { success: false, error: "An error occurred during email verification" }
  }
}

export async function loginUser(email: string, password: string) {
  try {
    const supabase = createServerSupabaseClient()

    // Get the user
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .eq("role", "student")
      .single()

    if (userError || !user) {
      return { success: false, error: "Invalid email or password" }
    }

    // Check if email is verified
    if (!user.email_verified) {
      return { success: false, error: "Please verify your email before logging in" }
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return { success: false, error: "Invalid email or password" }
    }

    // Set session cookie
    cookies().set(
      "user-session",
      JSON.stringify({
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
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
    console.error("Error during login:", error)
    return { success: false, error: "An error occurred during login" }
  }
}

export async function logoutUser() {
  cookies().delete("user-session")
  return { success: true }
}

export async function checkUserAuth() {
  try {
    const session = cookies().get("user-session")

    if (!session || !session.value) {
      return { authenticated: false }
    }

    const userData = JSON.parse(session.value)

    if (userData.role !== "student") {
      return { authenticated: false }
    }

    return { authenticated: true, user: userData }
  } catch (error) {
    console.error("Error checking user auth:", error)
    return { authenticated: false }
  }
}
