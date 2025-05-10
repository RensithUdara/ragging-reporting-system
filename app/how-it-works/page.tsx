import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, ArrowLeft, FileText, Search, CheckCircle, AlertTriangle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function HowItWorksPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-teal-700 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Shield className="h-8 w-8 mr-2" />
              <h1 className="text-2xl font-bold">SafeCampus Sri Lanka</h1>
            </div>
            <nav className="flex gap-4">
              <Link href="/" className="hover:underline">
                Home
              </Link>
              <Link href="/report" className="hover:underline">
                Report Incident
              </Link>
              <Link href="/check-status" className="hover:underline">
                Check Status
              </Link>
              <Link href="/auth/login" className="hover:underline">
                Student Login
              </Link>
              <Link href="/admin/login" className="hover:underline">
                Admin Login
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button asChild variant="ghost" className="pl-0">
            <Link href="/" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">How It Works</h1>

          <p className="text-lg text-gray-700 mb-8">
            SafeCampus Sri Lanka provides a secure and anonymous platform for reporting ragging incidents in
            universities. Here's a step-by-step guide to how our system works.
          </p>

          <div className="space-y-12 mb-12">
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-1 bg-teal-200 hidden md:block"></div>

              <div className="grid grid-cols-1 md:grid-cols-[80px_1fr] gap-6">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-bold text-xl relative z-10">
                    1
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4">Report Submission</h2>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start mb-4">
                        <FileText className="h-8 w-8 text-teal-600 mr-4 mt-1" />
                        <div>
                          <h3 className="text-xl font-semibold mb-2">Submit an Anonymous Report</h3>
                          <p className="text-gray-600 mb-4">
                            Fill out the report form with details about the ragging incident, including date, time,
                            location, and a description of what happened. You can optionally upload evidence such as
                            images or documents.
                          </p>
                          <div className="bg-gray-50 p-4 rounded-md border">
                            <h4 className="font-medium mb-2">What information should I include?</h4>
                            <ul className="list-disc pl-6 space-y-1 text-gray-600">
                              <li>Date and time of the incident</li>
                              <li>Location where it occurred</li>
                              <li>Type of ragging (verbal, physical, psychological, etc.)</li>
                              <li>Detailed description of what happened</li>
                              <li>Any evidence you may have (optional)</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="pl-12">
                        <div className="bg-teal-50 p-4 rounded-md border border-teal-100">
                          <h4 className="font-medium text-teal-800 mb-2">Your Privacy is Protected</h4>
                          <p className="text-teal-700">
                            Your identity remains completely anonymous. We do not collect any personal information that
                            could identify you unless you choose to create an account.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-1 bg-teal-200 hidden md:block"></div>

              <div className="grid grid-cols-1 md:grid-cols-[80px_1fr] gap-6">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-bold text-xl relative z-10">
                    2
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4">Receive a Unique Complaint Number</h2>
                  <Card>
                    <CardContent className="p-6">
                      <p className="text-gray-600 mb-4">
                        After submitting your report, you'll receive a unique complaint number. This number is your key
                        to tracking the status of your report while maintaining your anonymity.
                      </p>
                      <div className="bg-amber-50 p-4 rounded-md border border-amber-100 mb-4">
                        <div className="flex items-start">
                          <AlertTriangle className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
                          <p className="text-amber-700">
                            <strong>Important:</strong> Save your complaint number in a safe place. You'll need it to
                            check the status of your report later.
                          </p>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-md border">
                        <p className="text-gray-600 text-sm">Example complaint number:</p>
                        <p className="font-mono text-lg font-medium text-center my-2">RA-2023-4872</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-1 bg-teal-200 hidden md:block"></div>

              <div className="grid grid-cols-1 md:grid-cols-[80px_1fr] gap-6">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-bold text-xl relative z-10">
                    3
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4">Administrative Review</h2>
                  <Card>
                    <CardContent className="p-6">
                      <p className="text-gray-600 mb-4">
                        University administrators review your report and determine the appropriate course of action.
                        They may:
                      </p>
                      <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-4">
                        <li>Investigate the incident further</li>
                        <li>Contact witnesses (if identified in the report)</li>
                        <li>Review any evidence provided</li>
                        <li>Take disciplinary action against the perpetrators</li>
                      </ul>
                      <div className="bg-gray-50 p-4 rounded-md border">
                        <h4 className="font-medium mb-2">The Review Process</h4>
                        <ol className="list-decimal pl-6 space-y-1 text-gray-600">
                          <li>Initial assessment of the report</li>
                          <li>Classification of severity and urgency</li>
                          <li>Assignment to appropriate personnel</li>
                          <li>Investigation and evidence gathering</li>
                          <li>Decision making and action</li>
                        </ol>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-1 bg-teal-200 hidden md:block"></div>

              <div className="grid grid-cols-1 md:grid-cols-[80px_1fr] gap-6">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-bold text-xl relative z-10">
                    4
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4">Track Your Report</h2>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start mb-4">
                        <Search className="h-8 w-8 text-teal-600 mr-4 mt-1" />
                        <div>
                          <h3 className="text-xl font-semibold mb-2">Check the Status of Your Report</h3>
                          <p className="text-gray-600 mb-4">
                            Use your unique complaint number to check the status of your report at any time. You'll be
                            able to see:
                          </p>
                          <ul className="list-disc pl-6 space-y-1 text-gray-600 mb-4">
                            <li>Current status (Pending, Under Review, Investigating, Resolved, Closed)</li>
                            <li>Public notes from administrators about actions taken</li>
                            <li>Any requests for additional information (if needed)</li>
                          </ul>
                        </div>
                      </div>
                      <div className="pl-12">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="bg-amber-50 p-3 rounded-md border border-amber-100 text-center">
                            <p className="font-medium text-amber-800">Pending</p>
                            <p className="text-xs text-amber-700">Report received, awaiting review</p>
                          </div>
                          <div className="bg-purple-50 p-3 rounded-md border border-purple-100 text-center">
                            <p className="font-medium text-purple-800">Under Review</p>
                            <p className="text-xs text-purple-700">Administrators are reviewing the report</p>
                          </div>
                          <div className="bg-teal-50 p-3 rounded-md border border-teal-100 text-center">
                            <p className="font-medium text-teal-800">Investigating</p>
                            <p className="text-xs text-teal-700">Active investigation in progress</p>
                          </div>
                          <div className="bg-green-50 p-3 rounded-md border border-green-100 text-center">
                            <p className="font-medium text-green-800">Resolved</p>
                            <p className="text-xs text-green-700">Action taken, issue addressed</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="grid grid-cols-1 md:grid-cols-[80px_1fr] gap-6">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-bold text-xl relative z-10">
                    5
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4">Resolution</h2>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start mb-4">
                        <CheckCircle className="h-8 w-8 text-teal-600 mr-4 mt-1" />
                        <div>
                          <h3 className="text-xl font-semibold mb-2">Case Resolution</h3>
                          <p className="text-gray-600 mb-4">
                            Once the investigation is complete and appropriate action has been taken, the status of your
                            report will be updated to "Resolved" or "Closed." You'll be able to see a summary of the
                            actions taken.
                          </p>
                        </div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-md border border-green-100">
                        <h4 className="font-medium text-green-800 mb-2">Making a Difference</h4>
                        <p className="text-green-700">
                          By reporting ragging incidents, you're helping to create a safer campus environment for all
                          students. Your report can prevent others from experiencing similar harassment.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-teal-50 p-6 rounded-lg border border-teal-100 mb-8">
            <h2 className="text-xl font-semibold text-teal-800 mb-3">Optional: Create an Account</h2>
            <p className="text-teal-700 mb-4">
              While you can submit reports anonymously without an account, creating an account offers additional
              benefits:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-teal-700 mb-4">
              <li>Track all your submitted reports in one place</li>
              <li>Receive email notifications about status updates (optional)</li>
              <li>Save draft reports to complete later</li>
            </ul>
            <p className="text-teal-700">
              Even with an account, you can still choose to submit reports anonymously. Your account information will
              not be linked to anonymous reports.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-teal-600 hover:bg-teal-700">
              <Link href="/report">Report an Incident</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/auth/register">Create an Account</Link>
            </Button>
          </div>
        </div>
      </main>

      <footer className="bg-gray-100 py-6 mt-8">
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
              <Link href="/contact" className="text-gray-600 hover:text-teal-600">
                Contact
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
