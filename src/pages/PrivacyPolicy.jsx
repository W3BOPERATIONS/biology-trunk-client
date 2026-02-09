"use client"

import { Link } from "react-router-dom"
import logo from "../assets/biology-trunk-logo.png"
import Footer from "../components/Footer"

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation - Same as Home */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3 sm:gap-4">
              <Link to="/" className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center overflow-hidden">
                <img
                  src={logo || "/placeholder.svg"}
                  alt="Biology.Trunk Logo"
                  className="w-full h-full object-contain"
                />
              </Link>
              <span className="text-gray-900 font-bold text-2xl sm:text-3xl hidden sm:block">Biology.Trunk</span>
            </div>
            <Link
              to="/"
              className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
            >
              <i className="fas fa-home text-sm"></i>
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section with Gradient */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-8 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3">
              Privacy Policy
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto">
              Your privacy is our priority. Learn how we protect and manage your personal information.
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <i className="fas fa-shield-alt text-blue-200 text-xl"></i>
              <span className="text-blue-100 font-medium">Committed to Protecting Your Data</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 sm:gap-10">
            {/* Side Navigation */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-5">
                <h3 className="font-bold text-gray-900 mb-3 text-sm sm:text-base uppercase tracking-wide">Contents</h3>
                <ul className="space-y-2">
                  {[
                    { id: "introduction", label: "Introduction" },
                    { id: "collection", label: "Data Collection" },
                    { id: "usage", label: "Data Usage" },
                    { id: "security", label: "Data Security" },
                    { id: "rights", label: "Your Rights" },
                    { id: "contact", label: "Contact Us" },
                  ].map((item) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 text-sm sm:text-base py-1.5 transition-colors"
                      >
                        <i className="fas fa-chevron-right text-xs text-blue-500"></i>
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
                <div className="mt-5 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    <i className="fas fa-clock mr-1"></i>
                    Last updated: January 2025
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    <i className="fas fa-file-alt mr-1"></i>
                    Version 2.0
                  </p>
                </div>
              </div>
            </div>

            {/* Policy Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8">
                {/* Introduction */}
                <section id="introduction" className="mb-8 scroll-mt-20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <i className="fas fa-info-circle text-blue-600 text-lg"></i>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Introduction</h2>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <p className="text-blue-800 font-medium">
                      <i className="fas fa-exclamation-circle mr-2"></i>
                      Biology.Trunk ("we", "us", "our") is committed to protecting your privacy.
                    </p>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    Welcome to Biology.Trunk's Privacy Policy. This document outlines our policies regarding the
                    collection, use, and disclosure of personal data when you use our educational platform and the
                    choices you have associated with that data.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    We use your data to provide and improve our Service. By using the Service, you agree to the
                    collection and use of information in accordance with this policy.
                  </p>
                </section>

                {/* Data Collection */}
                <section id="collection" className="mb-8 scroll-mt-20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <i className="fas fa-database text-green-600 text-lg"></i>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Information Collection and Use</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We collect several different types of information for various purposes to provide and improve our
                    educational services:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <i className="fas fa-user text-blue-600 text-sm"></i>
                        </div>
                        <h3 className="font-bold text-gray-900">Personal Data</h3>
                      </div>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li className="flex items-start gap-1">
                          <i className="fas fa-check text-green-500 text-xs mt-1 flex-shrink-0"></i>
                          Name, email address, phone number
                        </li>
                        <li className="flex items-start gap-1">
                          <i className="fas fa-check text-green-500 text-xs mt-1 flex-shrink-0"></i>
                          Educational background and qualifications
                        </li>
                        <li className="flex items-start gap-1">
                          <i className="fas fa-check text-green-500 text-xs mt-1 flex-shrink-0"></i>
                          Date of birth and demographic information
                        </li>
                      </ul>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <i className="fas fa-chart-line text-purple-600 text-sm"></i>
                        </div>
                        <h3 className="font-bold text-gray-900">Usage Data</h3>
                      </div>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li className="flex items-start gap-1">
                          <i className="fas fa-check text-green-500 text-xs mt=1 flex-shrink-0"></i>
                          Browser type and version
                        </li>
                        <li className="flex items-start gap-1">
                          <i className="fas fa-check text-green-500 text-xs mt-1 flex-shrink-0"></i>
                          Pages visited and time spent
                        </li>
                        <li className="flex items-start gap-1">
                          <i className="fas fa-check text-green-500 text-xs mt-1 flex-shrink-0"></i>
                          Device information and IP address
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <i className="fas fa-lock text-yellow-600 mt-0.5"></i>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">Payment Information</h4>
                        <p className="text-gray-700 text-sm">
                          All payment transactions are processed securely through Razorpay. We do not store your
                          credit card or bank account information on our servers.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Data Usage */}
                <section id="usage" className="mb-8 scroll-mt-20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <i className="fas fa-cogs text-purple-600 text-lg"></i>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Use of Data</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Biology.Trunk uses the collected data for various educational and service improvement purposes:
                  </p>

                  <div className="space-y-3">
                    {[
                      {
                        icon: "fas fa-graduation-cap",
                        color: "bg-blue-100 text-blue-600",
                        title: "Educational Services",
                        description: "To provide and maintain our educational platform and courses"
                      },
                      {
                        icon: "fas fa-bell",
                        color: "bg-green-100 text-green-600",
                        title: "Communication",
                        description: "To notify you about course updates, schedule changes, and important announcements"
                      },
                      {
                        icon: "fas fa-comments",
                        color: "bg-purple-100 text-purple-600",
                        title: "Interactive Features",
                        description: "To enable participation in live classes, discussions, and Q&A sessions"
                      },
                      {
                        icon: "fas fa-headset",
                        color: "bg-orange-100 text-orange-600",
                        title: "Customer Support",
                        description: "To provide personalized academic support and respond to inquiries"
                      },
                      {
                        icon: "fas fa-chart-bar",
                        color: "bg-indigo-100 text-indigo-600",
                        title: "Analytics & Improvement",
                        description: "To analyze learning patterns and improve course content and delivery"
                      },
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className={`w-8 h-8 ${item.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <i className={`${item.icon} text-sm`}></i>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm">{item.title}</h4>
                          <p className="text-gray-600 text-xs">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Data Security */}
                <section id="security" className="mb-8 scroll-mt-20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <i className="fas fa-shield-alt text-red-600 text-lg"></i>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Security of Data</h2>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <p className="text-red-800 font-medium">
                      <i className="fas fa-exclamation-triangle mr-2"></i>
                      We implement industry-standard security measures to protect your data.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <p className="text-gray-700 leading-relaxed">
                      The security of your data is important to us. We implement appropriate technical and organizational
                      measures to protect personal data against unauthorized or unlawful processing, accidental loss,
                      destruction, or damage.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-white border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <i className="fas fa-lock text-green-600"></i>
                          <h4 className="font-bold text-gray-900 text-sm">Encryption</h4>
                        </div>
                        <p className="text-gray-600 text-xs">SSL/TLS encryption for data transmission</p>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <i className="fas fa-server text-blue-600"></i>
                          <h4 className="font-bold text-gray-900 text-sm">Secure Storage</h4>
                        </div>
                        <p className="text-gray-600 text-xs">Data stored on secure, access-controlled servers</p>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <i className="fas fa-user-shield text-purple-600"></i>
                          <h4 className="font-bold text-gray-900 text-sm">Access Control</h4>
                        </div>
                        <p className="text-gray-600 text-xs">Strict access controls and authentication</p>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <i className="fas fa-history text-orange-600"></i>
                          <h4 className="font-bold text-gray-900 text-sm">Regular Audits</h4>
                        </div>
                        <p className="text-gray-600 text-xs">Regular security assessments and updates</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <p className="text-gray-700 text-sm">
                        <strong>Note:</strong> While we strive to use commercially acceptable means to protect your
                        Personal Data, we cannot guarantee its absolute security. No method of transmission over the
                        Internet or electronic storage is 100% secure.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Your Rights */}
                <section id="rights" className="mb-8 scroll-mt-20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <i className="fas fa-user-check text-indigo-600 text-lg"></i>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Your Rights</h2>
                  </div>

                  <p className="text-gray-700 leading-relaxed mb-4">
                    You have certain rights regarding your personal data. You can exercise these rights by contacting us:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        icon: "fas fa-eye",
                        color: "bg-blue-100 text-blue-600",
                        title: "Access Rights",
                        description: "Access the personal data we hold about you"
                      },
                      {
                        icon: "fas fa-edit",
                        color: "bg-green-100 text-green-600",
                        title: "Correction Rights",
                        description: "Request correction of inaccurate or incomplete data"
                      },
                      {
                        icon: "fas fa-trash-alt",
                        color: "bg-red-100 text-red-600",
                        title: "Deletion Rights",
                        description: "Request deletion of your personal data"
                      },
                      {
                        icon: "fas fa-ban",
                        color: "bg-yellow-100 text-yellow-600",
                        title: "Opt-out Rights",
                        description: "Opt-out of marketing communications"
                      },
                    ].map((right, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-10 h-10 ${right.color} rounded-lg flex items-center justify-center`}>
                            <i className={`${right.icon} text-base`}></i>
                          </div>
                          <h3 className="font-bold text-gray-900">{right.title}</h3>
                        </div>
                        <p className="text-gray-600 text-sm">{right.description}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Contact Us */}
                <section id="contact" className="scroll-mt-20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <i className="fas fa-envelope text-gray-600 text-lg"></i>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Contact Us</h2>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <i className="fas fa-headset text-blue-600 text-xl"></i>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Privacy Concerns?</h3>
                        <p className="text-gray-700 mb-3">
                          If you have any questions about this Privacy Policy or wish to exercise your rights,
                          please contact our Data Protection Officer:
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <i className="fas fa-envelope text-blue-600"></i>
                            <a
                              href="mailto:biologytrunk145@gmail.com"
                              className="text-blue-600 hover:text-blue-700 font-medium"
                            >
                              biologytrunk145@gmail.com
                            </a>
                          </div>
                          <div className="flex items-center gap-2">
                            <i className="fas fa-clock text-gray-600"></i>
                            <span className="text-gray-700">Response time: Within 48 hours</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 text-center">
                    <p className="text-gray-600 text-sm">
                      For more information about our data practices, please refer to our{" "}
                      <Link to="/terms-conditions" className="text-blue-600 hover:underline">
                        Terms of Service
                      </Link>
                    </p>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-8 sm:py-12 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Related Documents</h2>
            <p className="text-gray-600">Review our other important policies and documents</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              to="/terms-conditions"
              className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-blue-300 transition-all text-center"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <i className="fas fa-file-contract text-blue-600"></i>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Terms of Service</h3>
              <p className="text-gray-600 text-xs">Our terms and conditions</p>
            </Link>

            <Link
              to="/refund-policy"
              className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-green-300 transition-all text-center"
            >
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <i className="fas fa-money-bill-wave text-green-600"></i>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Refund Policy</h3>
              <p className="text-gray-600 text-xs">Our refund and cancellation policy</p>
            </Link>

            <Link
              to="/contact"
              className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-purple-300 transition-all text-center"
            >
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <i className="fas fa-headset text-purple-600"></i>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Contact Support</h3>
              <p className="text-gray-600 text-xs">Get help with privacy concerns</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
