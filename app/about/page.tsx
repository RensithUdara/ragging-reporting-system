import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, ArrowLeft, Users, BookOpen, Scale, Heart } from "lucide-react"

export default function AboutPage() {
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
          <h1 className="text-3xl font-bold mb-6">About SafeCampus Sri Lanka</h1>

          <div className="prose max-w-none">
            <p className="text-lg mb-6">
              SafeCampus Sri Lanka is a dedicated platform designed to combat ragging in Sri Lankan universities by
              providing a safe, anonymous channel for reporting incidents. Our mission is to create a respectful and
              safe learning environment for all students.
            </p>

            <div className="bg-teal-50 p-6 rounded-lg border border-teal-100 mb-8">
              <h2 className="text-xl font-semibold text-teal-800 mb-3">Our Mission</h2>
              <p className="text-teal-700">
                To eliminate ragging culture from Sri Lankan universities by empowering students to report incidents
                without fear, ensuring prompt action by authorities, and fostering a culture of respect and dignity.
              </p>
            </div>

            <h2 className="text-2xl font-bold mb-4">Why We Exist</h2>

            <p className="mb-4">
              Ragging has been a persistent issue in Sri Lankan universities, causing psychological trauma, physical
              harm, and in some cases, even leading to tragic outcomes. Despite existing mechanisms, many incidents go
              unreported due to fear of retaliation, social stigma, or lack of trust in the reporting process.
            </p>

            <p className="mb-6">SafeCampus Sri Lanka was created to address these challenges by providing:</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <div className="flex items-center mb-3">
                  <Users className="h-6 w-6 text-teal-600 mr-2" />
                  <h3 className="text-lg font-semibold">Complete Anonymity</h3>
                </div>
                <p className="text-gray-600">
                  Students can report incidents without revealing their identity, eliminating the fear of retaliation.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <div className="flex items-center mb-3">
                  <BookOpen className="h-6 w-6 text-teal-600 mr-2" />
                  <h3 className="text-lg font-semibold">Transparent Process</h3>
                </div>
                <p className="text-gray-600">
                  A clear, trackable system that allows students to follow the progress of their complaints.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <div className="flex items-center mb-3">
                  <Scale className="h-6 w-6 text-teal-600 mr-2" />
                  <h3 className="text-lg font-semibold">Accountability</h3>
                </div>
                <p className="text-gray-600">
                  Ensuring university administrators take appropriate action on reported incidents.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <div className="flex items-center mb-3">
                  <Heart className="h-6 w-6 text-teal-600 mr-2" />
                  <h3 className="text-lg font-semibold">Support System</h3>
                </div>
                <p className="text-gray-600">Creating a community that stands against ragging and supports victims.</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-4">Our Approach</h2>

            <p className="mb-4">We believe that addressing ragging requires a multi-faceted approach:</p>

            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>
                <strong>Reporting Mechanism:</strong> A user-friendly platform for students to report incidents
                anonymously.
              </li>
              <li>
                <strong>Administrative Action:</strong> A system for university administrators to review, investigate,
                and take action on reported incidents.
              </li>
              <li>
                <strong>Awareness:</strong> Educating students about their rights and the negative impacts of ragging.
              </li>
              <li>
                <strong>Data Collection:</strong> Gathering data on ragging incidents to identify patterns and develop
                targeted interventions.
              </li>
            </ul>

            <h2 className="text-2xl font-bold mb-4">Our Team</h2>

            <p className="mb-6">
              SafeCampus Sri Lanka is a collaborative initiative involving university administrators, student welfare
              officers, counselors, and technology experts committed to creating a safer university environment.
            </p>

            <div className="bg-gray-50 p-6 rounded-lg border mb-8">
              <h2 className="text-xl font-semibold mb-3">Join Our Effort</h2>
              <p className="mb-4">
                We invite all stakeholders - students, faculty, administrators, and parents - to join us in our mission
                to eliminate ragging from Sri Lankan universities.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild className="bg-teal-600 hover:bg-teal-700">
                  <Link href="/report">Report an Incident</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </div>
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
