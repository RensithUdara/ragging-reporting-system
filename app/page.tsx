"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, FileText, Search, User, Info, HelpCircle, Mail, BookOpen } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gradient-to-r from-teal-700 to-teal-800 text-white py-6 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Shield className="h-8 w-8 mr-2 animate-pulse" />
              <h1 className="text-2xl font-bold">SafeCampus Sri Lanka</h1>
            </div>
            <nav className="flex gap-4">
              <Link href="/" className="hover:underline hover:text-teal-200 transition-colors">
                Home
              </Link>
              <Link href="/report" className="hover:underline hover:text-teal-200 transition-colors">
                Report Incident
              </Link>
              <Link href="/check-status" className="hover:underline hover:text-teal-200 transition-colors">
                Check Status
              </Link>
              <Link href="/auth/login" className="hover:underline hover:text-teal-200 transition-colors">
                Student Login
              </Link>
              <Link href="/admin/login" className="hover:underline hover:text-teal-200 transition-colors">
                Admin Login
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <section className="bg-gradient-to-b from-teal-700 to-teal-800 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">
                Stand Against Ragging in Sri Lankan Universities
              </h1>
              <p className="text-xl mb-8 animate-fade-in-delay">
                A safe, anonymous platform to report ragging incidents and help create a respectful campus environment.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-delay-2">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-teal-700 hover:bg-gray-100 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
                >
                  <Link href="/report">Report an Incident</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="bg-transparent text-white border-white hover:bg-white/10 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
                >
                  <Link href="/check-status">Check Report Status</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 relative">
              How It Works
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-teal-500 mt-2"></span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-1 duration-300 border-t-4 border-teal-500">
                <CardHeader className="text-center">
                  <div className="mx-auto bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-inner">
                    <FileText className="h-8 w-8 text-teal-600" />
                  </div>
                  <CardTitle>1. Submit a Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">
                    Fill out the report form with details about the ragging incident. Your identity remains anonymous.
                  </p>
                </CardContent>
                <CardFooter className="flex justify-center pt-0">
                  <Button asChild variant="link" className="text-teal-600 hover:text-teal-800 transition-colors">
                    <Link href="/report">Report Now</Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-1 duration-300 border-t-4 border-teal-500">
                <CardHeader className="text-center">
                  <div className="mx-auto bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-inner">
                    <Search className="h-8 w-8 text-teal-600" />
                  </div>
                  <CardTitle>2. Track Your Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">
                    Use your unique complaint number to check the status of your report at any time.
                  </p>
                </CardContent>
                <CardFooter className="flex justify-center pt-0">
                  <Button asChild variant="link" className="text-teal-600 hover:text-teal-800 transition-colors">
                    <Link href="/check-status">Check Status</Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-1 duration-300 border-t-4 border-teal-500">
                <CardHeader className="text-center">
                  <div className="mx-auto bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-inner">
                    <Shield className="h-8 w-8 text-teal-600" />
                  </div>
                  <CardTitle>3. Action Taken</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">
                    University administrators review, investigate, and take appropriate action on reported incidents.
                  </p>
                </CardContent>
                <CardFooter className="flex justify-center pt-0">
                  <Button asChild variant="link" className="text-teal-600 hover:text-teal-800 transition-colors">
                    <Link href="/how-it-works">Learn More</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12 relative">
                Why Use SafeCampus Sri Lanka?
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-teal-500 mt-2"></span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex items-start group">
                  <div className="bg-teal-100 p-3 rounded-full mr-4 shadow-md group-hover:shadow-lg group-hover:bg-teal-200 transition-all">
                    <Shield className="h-6 w-6 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-teal-700 transition-colors">
                      Complete Anonymity
                    </h3>
                    <p className="text-gray-600">
                      Your identity is protected. Report incidents without fear of retaliation.
                    </p>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="bg-teal-100 p-3 rounded-full mr-4 shadow-md group-hover:shadow-lg group-hover:bg-teal-200 transition-all">
                    <Search className="h-6 w-6 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-teal-700 transition-colors">
                      Transparent Process
                    </h3>
                    <p className="text-gray-600">
                      Track the status of your report and see what actions have been taken.
                    </p>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="bg-teal-100 p-3 rounded-full mr-4 shadow-md group-hover:shadow-lg group-hover:bg-teal-200 transition-all">
                    <User className="h-6 w-6 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-teal-700 transition-colors">
                      User Accounts
                    </h3>
                    <p className="text-gray-600">
                      Create an account to track all your reports in one place (optional).
                    </p>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="bg-teal-100 p-3 rounded-full mr-4 shadow-md group-hover:shadow-lg group-hover:bg-teal-200 transition-all">
                    <Info className="h-6 w-6 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-teal-700 transition-colors">
                      Comprehensive Support
                    </h3>
                    <p className="text-gray-600">
                      Access resources and information to help you through the reporting process.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 relative">
              Resources & Information
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-teal-500 mt-2"></span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-1 duration-300">
                <CardHeader>
                  <div className="flex items-center mb-2">
                    <Info className="h-5 w-5 text-teal-600 mr-2" />
                    <CardTitle className="text-lg">About</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 mb-4">
                    Learn about our mission to combat ragging in Sri Lankan universities.
                  </CardDescription>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" className="w-full hover:bg-teal-50 transition-colors">
                    <Link href="/about">Learn More</Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-1 duration-300">
                <CardHeader>
                  <div className="flex items-center mb-2">
                    <HelpCircle className="h-5 w-5 text-teal-600 mr-2" />
                    <CardTitle className="text-lg">FAQ</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 mb-4">
                    Find answers to common questions about reporting ragging incidents.
                  </CardDescription>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" className="w-full hover:bg-teal-50 transition-colors">
                    <Link href="/faq">View FAQ</Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-1 duration-300">
                <CardHeader>
                  <div className="flex items-center mb-2">
                    <BookOpen className="h-5 w-5 text-teal-600 mr-2" />
                    <CardTitle className="text-lg">How It Works</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 mb-4">
                    Understand the reporting process and what happens after you submit a report.
                  </CardDescription>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" className="w-full hover:bg-teal-50 transition-colors">
                    <Link href="/how-it-works">View Guide</Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-1 duration-300">
                <CardHeader>
                  <div className="flex items-center mb-2">
                    <Mail className="h-5 w-5 text-teal-600 mr-2" />
                    <CardTitle className="text-lg">Contact Us</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 mb-4">
                    Get in touch with our team for support or additional information.
                  </CardDescription>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" className="w-full hover:bg-teal-50 transition-colors">
                    <Link href="/contact">Contact</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-r from-teal-700 to-teal-800 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Take a Stand Against Ragging?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Your report can make a difference. Help create a safer campus environment for all students.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-white text-teal-700 hover:bg-gray-100 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
              >
                <Link href="/report">Report an Incident</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-transparent text-white border-white hover:bg-white/10 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
              >
                <Link href="/auth/register">Create an Account</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-100 py-8 border-t border-gray-200 shadow-inner">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 mb-4 md:mb-0">&copy; 2025 CodeCraftix Technologies. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/about" className="text-gray-600 hover:text-teal-600 transition-colors">
                About
              </Link>
              <Link href="/faq" className="text-gray-600 hover:text-teal-600 transition-colors">
                FAQ
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-teal-600 transition-colors">
                Contact
              </Link>
              <Link href="/privacy" className="text-gray-600 hover:text-teal-600 transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        .animate-fade-in-delay {
          opacity: 0;
          animation: fadeIn 0.8s ease-out 0.3s forwards;
        }
        
        .animate-fade-in-delay-2 {
          opacity: 0;
          animation: fadeIn 0.8s ease-out 0.6s forwards;
        }
      `}</style>
    </div>
  )
}
