import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, ArrowLeft } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FAQPage() {
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

        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>

          <div className="mb-8">
            <p className="text-lg text-gray-700">
              Find answers to common questions about using the SafeCampus Sri Lanka ragging reporting system.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>What is ragging?</AccordionTrigger>
              <AccordionContent>
                <p className="mb-2">
                  Ragging refers to the practice of seniors or existing students harassing, humiliating, or abusing new
                  students in educational institutions. It can take various forms:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Verbal abuse and intimidation</li>
                  <li>Physical harassment</li>
                  <li>Psychological harassment</li>
                  <li>Forcing students to perform humiliating acts</li>
                  <li>Cyberbullying</li>
                </ul>
                <p className="mt-2">
                  Ragging is illegal in Sri Lanka and is prohibited in all educational institutions.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>Is my identity protected when I report an incident?</AccordionTrigger>
              <AccordionContent>
                <p>Yes, your identity is completely protected. Our system is designed to ensure anonymity:</p>
                <ul className="list-disc pl-6 mt-2">
                  <li>
                    We do not collect any personal information that could identify you unless you choose to provide it.
                  </li>
                  <li>Your IP address is not stored with your report.</li>
                  <li>You can choose to submit reports without creating an account.</li>
                  <li>
                    If you create an account, you can still submit anonymous reports that won't be linked to your
                    profile.
                  </li>
                </ul>
                <p className="mt-2">
                  Only authorized administrators can access report details, and they cannot see who submitted the report
                  unless you explicitly choose to reveal your identity.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>What happens after I submit a report?</AccordionTrigger>
              <AccordionContent>
                <p>After you submit a report, the following process takes place:</p>
                <ol className="list-decimal pl-6 mt-2 space-y-2">
                  <li>
                    <strong>Submission:</strong> You receive a unique complaint number that you can use to track the
                    status of your report.
                  </li>
                  <li>
                    <strong>Initial Review:</strong> University administrators review the report to determine its
                    severity and the appropriate course of action.
                  </li>
                  <li>
                    <strong>Investigation:</strong> If necessary, an investigation is conducted to gather more
                    information about the incident.
                  </li>
                  <li>
                    <strong>Action:</strong> Based on the findings, appropriate disciplinary action is taken against the
                    perpetrators.
                  </li>
                  <li>
                    <strong>Resolution:</strong> The complaint is resolved, and you can view updates on the status of
                    your report using your complaint number.
                  </li>
                </ol>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>What information should I include in my report?</AccordionTrigger>
              <AccordionContent>
                <p>To help administrators address your complaint effectively, please include:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Date, time, and location of the incident</li>
                  <li>A detailed description of what happened</li>
                  <li>The type of ragging (verbal, physical, psychological, etc.)</li>
                  <li>Any evidence you may have (photos, videos, messages)</li>
                </ul>
                <p className="mt-2">
                  You don't need to include the names of the perpetrators if you're uncomfortable doing so, but
                  providing as much detail as possible will help with the investigation.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>Can I check the status of my complaint?</AccordionTrigger>
              <AccordionContent>
                <p>
                  Yes, you can check the status of your complaint at any time using the unique complaint number provided
                  to you after submission. Simply:
                </p>
                <ol className="list-decimal pl-6 mt-2">
                  <li>Go to the "Check Status" page</li>
                  <li>Enter your complaint number</li>
                  <li>View the current status and any public notes added by administrators</li>
                </ol>
                <p className="mt-2">
                  If you created an account and submitted the complaint while logged in, you can also view all your
                  complaints and their statuses in your dashboard.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger>What types of evidence can I upload?</AccordionTrigger>
              <AccordionContent>
                <p>You can upload the following types of evidence to support your report:</p>
                <ul className="list-disc pl-6 mt-2">
                  <li>Images (JPG, PNG) - maximum size 5MB</li>
                  <li>Documents (PDF) - maximum size 5MB</li>
                </ul>
                <p className="mt-2">
                  Please ensure that any evidence you upload is directly related to the incident and does not contain
                  inappropriate content.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7">
              <AccordionTrigger>Is there any legal protection for students who report ragging?</AccordionTrigger>
              <AccordionContent>
                <p>
                  Yes, Sri Lankan law provides protection for students who report ragging incidents. The Prohibition of
                  Ragging and Other Forms of Violence in Educational Institutions Act, No. 20 of 1998 makes ragging a
                  criminal offense and protects those who report such incidents.
                </p>
                <p className="mt-2">
                  Additionally, universities have their own anti-ragging policies that prohibit any form of retaliation
                  against students who report ragging incidents.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8">
              <AccordionTrigger>Why should I create an account?</AccordionTrigger>
              <AccordionContent>
                <p>Creating an account offers several benefits:</p>
                <ul className="list-disc pl-6 mt-2">
                  <li>Track all your submitted complaints in one place</li>
                  <li>Receive email notifications about status updates (optional)</li>
                  <li>Save draft reports to complete later</li>
                  <li>Easier communication with administrators if you choose to allow it</li>
                </ul>
                <p className="mt-2">
                  Even with an account, you can still choose to submit reports anonymously. Your account information
                  will not be linked to anonymous reports.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="mt-8 p-6 bg-teal-50 rounded-lg border border-teal-100">
            <h2 className="text-xl font-semibold text-teal-800 mb-3">Still have questions?</h2>
            <p className="text-teal-700 mb-4">
              If you couldn't find the answer to your question, please feel free to contact us.
            </p>
            <Button asChild className="bg-teal-600 hover:bg-teal-700">
              <Link href="/contact">Contact Us</Link>
            </Button>
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
