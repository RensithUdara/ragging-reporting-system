"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, Shield, XCircle } from "lucide-react"
import { verifyEmail } from "@/app/actions/auth-actions"

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [isVerifying, setIsVerifying] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (token) {
      verifyEmailWithToken(token)
    }
  }, [token])

  async function verifyEmailWithToken(token: string) {
    setIsVerifying(true)
    setError(null)

    try {
      const result = await verifyEmail(token)
      if (result.success) {
        setIsVerified(true)
      } else {
        setError(result.error || "Failed to verify email. The link may be invalid or expired.")
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsVerifying(false)
    }
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

      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Email Verification</CardTitle>
            <CardDescription className="text-center">Verifying your email address</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isVerifying ? (
              <div className="flex flex-col items-center justify-center py-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-700 mb-4"></div>
                <p className="text-center">Verifying your email address...</p>
              </div>
            ) : isVerified ? (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-600">Email Verified</AlertTitle>
                <AlertDescription className="text-green-700">
                  Your email has been successfully verified. You can now log in to your account.
                </AlertDescription>
              </Alert>
            ) : error ? (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Verification Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : (
              <Alert className="bg-amber-50 border-amber-200">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertTitle className="text-amber-600">Verification Required</AlertTitle>
                <AlertDescription className="text-amber-700">
                  Please use the verification link sent to your email to verify your account.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            {isVerified ? (
              <Button asChild className="w-full bg-teal-600 hover:bg-teal-700">
                <Link href="/auth/login">Log In</Link>
              </Button>
            ) : (
              <Button asChild className="w-full bg-teal-600 hover:bg-teal-700">
                <Link href="/auth/register">Back to Registration</Link>
              </Button>
            )}
            <Button asChild variant="outline" className="w-full">
              <Link href="/">Return to Home</Link>
            </Button>
          </CardFooter>
        </Card>
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
