import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, ArrowLeft } from "lucide-react"

export default function PrivacyPolicyPage() {
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
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

          <div className="prose max-w-none">
            <p className="text-lg mb-6">
              At SafeCampus Sri Lanka, we are committed to protecting your privacy and ensuring the security of your
              information. This Privacy Policy explains how we collect, use, and safeguard your information when you use
              our platform.
            </p>

            <div className="bg-teal-50 p-6 rounded-lg border border-teal-100 mb-8">
              <h2 className="text-xl font-semibold text-teal-800 mb-3">Our Commitment to Anonymity</h2>
              <p className="text-teal-700">
                We understand the sensitive nature of ragging reports and the importance of protecting the identity of
                reporters. Our system is designed with anonymity as a core principle, ensuring that students can report
                incidents without fear of identification or retaliation.
              </p>
            </div>

            <h2 className="text-2xl font-bold mb-4">Information We Collect</h2>

            <h3 className="text-xl font-semibold mb-2">For Anonymous Reports:</h3>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Incident details (date, time, location, description)</li>
              <li>Category of ragging (if provided)</li>
              <li>Any evidence uploaded (without metadata that could identify you)</li>
            </ul>
            <p className="mb-4">
              <strong>We do not collect:</strong> Your name, IP address, device information, or any other data that
              could identify you when you submit anonymous reports.
            </p>

            <h3 className="text-xl font-semibold mb-2">For Registered Users:</h3>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Email address</li>
              <li>Full name</li>
              <li>Password (stored in encrypted form)</li>
              <li>Reports submitted through your account (if not submitted anonymously)</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4">How We Use Your Information</h2>

            <p className="mb-2">We use the information collected for the following purposes:</p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>To process and investigate ragging reports</li>
              <li>To communicate with you about your reports (if you've provided contact information)</li>
              <li>To improve our platform and services</li>
              <li>To generate anonymous statistics about ragging incidents</li>
              <li>To comply with legal obligations</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4">Data Security</h2>

            <p className="mb-4">
              We implement robust security measures to protect your information from unauthorized access, alteration,
              disclosure, or destruction. These measures include:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Encryption of sensitive data</li>
              <li>Secure database storage</li>
              <li>Regular security audits</li>
              <li>Strict access controls for administrators</li>
              <li>Anonymization of report data</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4">Data Sharing and Disclosure</h2>

            <p className="mb-2">
              We do not share your personal information with third parties except in the following circumstances:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>
                With university administrators responsible for addressing ragging incidents (report details only, not
                personal information for anonymous reports)
              </li>
              <li>When required by law or legal process</li>
              <li>To protect the rights, property, or safety of our users, the public, or our platform</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4">Your Rights</h2>

            <p className="mb-2">You have the right to:</p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Access the personal information we hold about you</li>
              <li>Correct inaccurate or incomplete information</li>
              <li>Delete your personal information (for registered users)</li>
              <li>Withdraw consent for processing your data</li>
              <li>Object to certain processing of your data</li>
            </ul>
            <p className="mb-4">To exercise these rights, please contact us at privacy@safecampus.lk.</p>

            <h2 className="text-2xl font-bold mb-4">Cookies and Tracking</h2>

            <p className="mb-4">
              Our platform uses cookies only for essential functions such as maintaining your session when logged in. We
              do not use cookies for tracking or advertising purposes. You can configure your browser to refuse cookies,
              but this may limit some functionality of our platform.
            </p>

            <h2 className="text-2xl font-bold mb-4">Changes to This Policy</h2>

            <p className="mb-4">
              We may update this Privacy Policy from time to time to reflect changes in our practices or for other
              operational, legal, or regulatory reasons. We will notify registered users of any material changes via
              email and post a notice on our platform.
            </p>

            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>

            <p className="mb-4">
              If you have any questions or concerns about this Privacy Policy or our data practices, please contact us
              at:
            </p>
            <p className="mb-6">
              Email: privacy@safecampus.lk
              <br />
              Address: University Grants Commission, 20 Ward Place, Colombo 7, Sri Lanka
            </p>

            <div className="bg-gray-50 p-6 rounded-lg border">
              <p className="text-sm text-gray-500">Last Updated: May 10, 2023</p>
            </div>
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
