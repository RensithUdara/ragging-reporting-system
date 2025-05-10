"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, ArrowLeft, Shield, User } from "lucide-react"
import { registerUser } from "@/app/actions/auth-actions"

export default function RegisterPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isRegistering, setIsRegistering] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [verificationToken, setVerificationToken] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!fullName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("Please fill in all fields")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }

    setIsRegistering(true)
    setError(null)

    try {
      const result = await registerUser(email, password, fullName)
      if (result.success) {
        // In a real app, we would redirect to a "check your email" page
        // For testing purposes, we'll show the verification token
        if (result.verificationToken) {
          setVerificationToken(result.verificationToken)
        } else {
          router.push("/auth/verify-email")
        }
      } else {
        setError(result.error || "Registration failed. Please try again.")
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsRegistering(false)
    }
  }

  if (verificationToken) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="bg-teal-700 text-white py-6">
          <div className="container mx-auto px-4">
            <div className="flex items-center">
              <Shield className="h-8 w-8 mr-2" />
              <h1 className="text-2xl font-bold">SafeCampus Sri Lanka</h1>
            </div>
          </div>
        </header>

        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-center text-2xl">Email Verification Required</CardTitle>
              <CardDescription className="text-center">Please check your email for a verification link</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="bg-teal-50 border-teal-200">
                <AlertCircle className="h-4 w-4 text-teal-600" />
                <AlertTitle className="text-teal-600">Verification Email Sent</AlertTitle>
                <AlertDescription>
                  We've sent a verification email to <strong>{email}</strong>. Please check your inbox and click the
                  verification link to complete your registration.
                </AlertDescription>
              </Alert>

              <div className="p-4 bg-gray-100 rounded-md">
                <p className="text-sm text-gray-500 mb-1">For testing purposes only:</p>
                <p className="text-xs font-mono break-all">{verificationToken}</p>
                <p className="text-xs text-gray-500 mt-1">
                  In a production environment, this token would be sent via email.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button asChild className="w-full bg-teal-600 hover:bg-teal-700">
                <Link href={`/auth/verify-email?token=${verificationToken}`}>Verify Email</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/">Return to Home</Link>
              </Button>
            </CardFooter>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-teal-700 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center">
            <Shield className="h-8 w-8 mr-2" />
            <h1 className="text-2xl font-bold">SafeCampus Sri Lanka</h1>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col">
        <div className="mb-6">
          <Button asChild variant="ghost" className="pl-0">
            <Link href="/" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        <div className="max-w-md mx-auto w-full flex-grow flex items-center">
          <Card className="w-full">
            <CardHeader className="space-y-1">
              <div className="flex justify-center mb-2">
                <User className="h-12 w-12 text-teal-600" />
              </div>
              <CardTitle className="text-2xl text-center">Create an Account</CardTitle>
              <CardDescription className="text-center">Register to track your complaint submissions</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    required
                  />
                  <p className="text-xs text-gray-500">Password must be at least 8 characters long</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    required
                  />
                </div>

                <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700" disabled={isRegistering}>
                  {isRegistering ? "Registering..." : "Register"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <p className="text-sm text-gray-500">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-teal-600 hover:underline">
                  Log in
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </main>

      <footer className="bg-gray-100 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} SafeCampus Sri Lanka. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link href="/about" className="text-gray-600 hover:text-teal-600">
                About
              </Link>
              <Link href="/faq" className="text-gray-600 hover:text-teal-600">
                FAQ
              </Link>
              <Link href="/privacy" className="text-gray-600 hover:text-teal-600">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
