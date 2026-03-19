"use client"

import { Link } from "react-router-dom"
import logo from "../assets/biology-trunk-logo.png"
import Footer from "../components/Footer"

export default function RefundPolicy() {
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
              Refund Policy
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto">
              Our clear policy regarding course enrollments and payments
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <i className="fas fa-ban text-red-200 text-xl"></i>
              <span className="text-red-100 font-medium tracking-wide uppercase">No Refund Policy</span>
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
                    { id: "policy-overview", label: "Policy Overview" },
                    { id: "no-refund", label: "No Refund Policy" },
                    { id: "exceptions", label: "Exceptions" },
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
                    Last updated: March 2025
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    <i className="fas fa-file-alt mr-1"></i>
                    Version 3.0
                  </p>
                </div>
              </div>
            </div>

            {/* Policy Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8">
                {/* Important Notice */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <i className="fas fa-exclamation-circle text-red-600 text-xl mt-0.5"></i>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Strict No-Refund Policy</h3>
                      <p className="text-gray-700 text-sm">
                        <strong>Once anybody enrolls in a course and completes the payment, no refund will be provided.</strong> Please ensure you have reviewed the course details and demo videos before making a purchase.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Policy Overview */}
                <section id="policy-overview" className="mb-8 scroll-mt-20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <i className="fas fa-info-circle text-blue-600 text-lg"></i>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Policy Overview</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    At Biology.Trunk, we provide high-quality educational resources, live classes, and expert mentorship led by Ph.D. qualified faculty. Due to the digital nature of our content and the immediate access provided upon enrollment, we follow a strict no-refund policy.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <i className="fas fa-graduation-cap text-blue-600"></i>
                      <h3 className="font-bold text-gray-900">Commitment to Quality</h3>
                    </div>
                    <p className="text-gray-700 mt-2 text-sm">
                      We are committed to providing the best learning experience. We encourage students to watch our demo classes and review the curriculum thoroughly before enrolling.
                    </p>
                  </div>
                </section>

                {/* No Refund Policy Section */}
                <section id="no-refund" className="mb-8 scroll-mt-20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <i className="fas fa-ban text-red-600 text-lg"></i>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">No Refund After Enrollment</h2>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <div className="flex items-start gap-3">
                      <i className="fas fa-times-circle text-red-500 text-xl mt-0.5"></i>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-1">Final Sale</h3>
                        <p className="text-gray-700">
                          <strong>All course enrollments are final. No refunds will be processed under any circumstances, including:</strong>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-white border border-red-100 rounded-lg p-4">
                      <ul className="space-y-3 text-gray-700">
                        <li className="flex items-start gap-2">
                          <i className="fas fa-times text-red-500 mt-1 flex-shrink-0"></i>
                          <span>Change of mind or personal circumstances</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <i className="fas fa-times text-red-500 mt-1 flex-shrink-0"></i>
                          <span>Technical issues on the user's end (internet connection, device compatibility, etc.)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <i className="fas fa-times text-red-500 mt-1 flex-shrink-0"></i>
                          <span>Inability to attend live classes (recordings are provided)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <i className="fas fa-times text-red-500 mt-1 flex-shrink-0"></i>
                          <span>Dissatisfaction with the teaching style (please watch demos beforehand)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <i className="fas fa-times text-red-500 mt-1 flex-shrink-0"></i>
                          <span>Accidental purchase or multiple enrollments</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start gap-2">
                        <i className="fas fa-exclamation-triangle text-orange-600 mt-0.5"></i>
                        <div>
                          <h4 className="font-bold text-gray-900 mb-1">Fair Usage Policy</h4>
                          <p className="text-gray-700 text-sm">
                            Our educational materials are proprietary and digital. Once access is granted, the educational value is considered delivered, making refunds impossible to process while maintaining the integrity of our intellectual property.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Exceptions Section */}
                <section id="exceptions" className="mb-8 scroll-mt-20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <i className="fas fa-shield-alt text-orange-600 text-lg"></i>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Exceptions & Special Cases</h2>
                  </div>

                  <p className="text-gray-700 leading-relaxed mb-4">
                    While we maintain a strict no-refund policy, we may consider course transfers or adjustments in very specific situations:
                  </p>

                  <div className="space-y-3">
                    {[
                      {
                        icon: "fas fa-exchange-alt",
                        color: "bg-blue-100 text-blue-600",
                        title: "Course Transfer",
                        description: "Transferring to another course of equal or higher value within 24 hours of enrollment (difference must be paid)."
                      },
                      {
                        icon: "fas fa-tools",
                        color: "bg-red-100 text-red-600",
                        title: "Double Payment",
                        description: "In case of duplicate transactions for the same course, the extra amount will be refunded after verification."
                      },
                      {
                        icon: "fas fa-university",
                        color: "bg-green-100 text-green-600",
                        title: "Course Cancellation",
                        description: "If Biology.Trunk cancels a course before its commencement, a full refund will be provided."
                      },
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
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
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Questions About Our Policy?</h3>
                        <p className="text-gray-700 mb-3">
                          If you have any questions or concerns regarding our refund policy, please reach out to our support team:
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
                    <p className="text-gray-600 text-sm font-medium italic">
                      Disclaimer: By enrolling in any course at Biology.Trunk, you agree to this No-Refund Policy.
                    </p>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}