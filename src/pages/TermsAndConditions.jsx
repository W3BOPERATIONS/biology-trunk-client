"use client"

import { Link } from "react-router-dom"
import logo from "../assets/biology-trunk-logo.png"
import Footer from "../components/Footer"

export default function TermsAndConditions() {
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
              Terms & Conditions
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto">
              Please read these terms carefully before using our educational platform. By accessing Biology.Trunk, you agree to be bound by these terms.
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <i className="fas fa-file-contract text-blue-200 text-xl"></i>
              <span className="text-blue-100 font-medium">Legal Agreement for Educational Services</span>
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
                    { id: "acceptance", label: "Acceptance of Terms" },
                    { id: "license", label: "Use License" },
                    { id: "content", label: "Course Content" },
                    { id: "responsibilities", label: "User Responsibilities" },
                    { id: "liability", label: "Limitation of Liability" },
                    { id: "modifications", label: "Modifications" },
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

            {/* Terms Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8">
                {/* Important Notice */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <i className="fas fa-exclamation-triangle text-yellow-600 text-xl mt-0.5"></i>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Important Notice</h3>
                      <p className="text-gray-700 text-sm">
                        By accessing or using Biology.Trunk, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions. If you do not agree to these terms, please do not use our platform.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Acceptance of Terms */}
                <section id="acceptance" className="mb-8 scroll-mt-20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <i className="fas fa-check-circle text-blue-600 text-lg"></i>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Acceptance of Terms</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    These Terms & Conditions constitute a legally binding agreement between you and Biology.Trunk governing your access to and use of our educational platform, including any content, functionality, and services offered on or through our website.
                  </p>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-700">
                      <strong>Key Points:</strong> By creating an account or using our services, you confirm that you are at least 18 years old or have parental consent. Continued use of our platform constitutes acceptance of any revised terms.
                    </p>
                  </div>
                </section>

                {/* Use License */}
                <section id="license" className="mb-8 scroll-mt-20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <i className="fas fa-key text-green-600 text-lg"></i>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Use License</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Subject to your compliance with these Terms, Biology.Trunk grants you a limited, non-exclusive, non-transferable, revocable license to access and use our educational platform for your personal, non-commercial educational purposes.
                  </p>

                  <div className="mb-4">
                    <h3 className="font-bold text-gray-900 mb-3 text-lg">Restrictions:</h3>
                    <div className="space-y-3">
                      {[
                        {
                          icon: "fas fa-ban text-red-500",
                          title: "Commercial Use",
                          description: "You may not use our materials for any commercial purpose or public display"
                        },
                        {
                          icon: "fas fa-ban text-red-500",
                          title: "Content Modification",
                          description: "Modification or copying of course materials is strictly prohibited"
                        },
                        {
                          icon: "fas fa-ban text-red-500",
                          title: "Reverse Engineering",
                          description: "You may not attempt to decompile or reverse engineer our software"
                        },
                        {
                          icon: "fas fa-ban text-red-500",
                          title: "Copyright Violation",
                          description: "Removal of copyright or proprietary notations is not permitted"
                        },
                        {
                          icon: "fas fa-ban text-red-500",
                          title: "Unauthorized Sharing",
                          description: "Transferring or mirroring materials on other servers is prohibited"
                        },
                      ].map((restriction, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-red-50 border border-red-100 rounded-lg">
                          <i className={`${restriction.icon} text-lg mt-0.5 flex-shrink-0`}></i>
                          <div>
                            <h4 className="font-bold text-gray-900 text-sm">{restriction.title}</h4>
                            <p className="text-gray-600 text-xs">{restriction.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Course Content & Learning Materials */}
                <section id="content" className="mb-8 scroll-mt-20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <i className="fas fa-book text-purple-600 text-lg"></i>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Course Content & Learning Materials</h2>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                    <p className="text-purple-800 font-medium">
                      <i className="fas fa-copyright mr-2"></i>
                      All educational content on Biology.Trunk is protected by copyright and intellectual property laws.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">Ownership</h3>
                      <p className="text-gray-700 text-sm">
                        All course content, videos, lecture notes, study materials, assessments, and other educational resources provided by Biology.Trunk are the exclusive property of Biology.Trunk or its licensors.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">Permitted Use</h3>
                      <div className="space-y-2 ml-4">
                        <div className="flex items-start gap-2">
                          <i className="fas fa-check text-green-500 mt-0.5"></i>
                          <p className="text-gray-700 text-sm">Personal educational use by enrolled students</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <i className="fas fa-check text-green-500 mt-0.5"></i>
                          <p className="text-gray-700 text-sm">Note-taking for individual study purposes</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <i className="fas fa-check text-green-500 mt-0.5"></i>
                          <p className="text-gray-700 text-sm">Completion of assigned coursework and assessments</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-start gap-2">
                        <i className="fas fa-times-circle text-red-500 mt-0.5"></i>
                        <div>
                          <h4 className="font-bold text-gray-900 mb-1">Prohibited Activities</h4>
                          <p className="text-gray-700 text-sm">
                            Reproduction, distribution, transmission, sharing, or commercial exploitation of any course content without prior written consent from Biology.Trunk is strictly prohibited and may result in immediate account termination and legal action.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* User Responsibilities */}
                <section id="responsibilities" className="mb-8 scroll-mt-20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <i className="fas fa-user-shield text-indigo-600 text-lg"></i>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">User Responsibilities</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {[
                      {
                        icon: "fas fa-lock",
                        color: "bg-blue-100 text-blue-600",
                        title: "Account Security",
                        description: "Maintain confidentiality of your account credentials and password"
                      },
                      {
                        icon: "fas fa-user-check",
                        color: "bg-green-100 text-green-600",
                        title: "Account Activity",
                        description: "Accept responsibility for all activities under your account"
                      },
                      {
                        icon: "fas fa-info-circle",
                        color: "bg-purple-100 text-purple-600",
                        title: "Accurate Information",
                        description: "Provide accurate and complete registration information"
                      },
                      {
                        icon: "fas fa-balance-scale",
                        color: "bg-orange-100 text-orange-600",
                        title: "Legal Compliance",
                        description: "Comply with all applicable laws and regulations"
                      },
                    ].map((responsibility, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-10 h-10 ${responsibility.color} rounded-lg flex items-center justify-center`}>
                            <i className={`${responsibility.icon} text-base`}></i>
                          </div>
                          <h3 className="font-bold text-gray-900">{responsibility.title}</h3>
                        </div>
                        <p className="text-gray-600 text-sm">{responsibility.description}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <i className="fas fa-exclamation-circle text-blue-600 mt-0.5"></i>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">Additional Responsibilities</h4>
                        <ul className="space-y-1 text-sm text-gray-700">
                          <li className="flex items-start gap-1">
                            <i className="fas fa-circle text-xs text-blue-500 mt-1.5"></i>
                            Not sharing your account access with others
                          </li>
                          <li className="flex items-start gap-1">
                            <i className="fas fa-circle text-xs text-blue-500 mt-1.5"></i>
                            Not using the platform for any illegal or unauthorized purpose
                          </li>
                          <li className="flex items-start gap-1">
                            <i className="fas fa-circle text-xs text-blue-500 mt-1.5"></i>
                            Not interfering with the proper working of the platform
                          </li>
                          <li className="flex items-start gap-1">
                            <i className="fas fa-circle text-xs text-blue-500 mt-1.5"></i>
                            Not attempting to gain unauthorized access to any part of the platform
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Limitation of Liability */}
                <section id="liability" className="mb-8 scroll-mt-20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <i className="fas fa-exclamation-triangle text-red-600 text-lg"></i>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Limitation of Liability</h2>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <p className="text-red-800 font-medium">
                      <i className="fas fa-gavel mr-2"></i>
                      Important Disclaimer of Warranties and Limitation of Liability
                    </p>
                  </div>

                  <div className="space-y-4">
                    <p className="text-gray-700 leading-relaxed">
                      To the maximum extent permitted by applicable law, Biology.Trunk shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from:
                    </p>

                    <div className="space-y-2 ml-4">
                      <div className="flex items-start gap-2">
                        <i className="fas fa-times text-red-500 mt-0.5"></i>
                        <p className="text-gray-700 text-sm">Your use or inability to use our platform</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <i className="fas fa-times text-red-500 mt-0.5"></i>
                        <p className="text-gray-700 text-sm">Any unauthorized access to or use of our servers</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <i className="fas fa-times text-red-500 mt-0.5"></i>
                        <p className="text-gray-700 text-sm">Any interruption or cessation of transmission to or from our platform</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <i className="fas fa-times text-red-500 mt-0.5"></i>
                        <p className="text-gray-700 text-sm">Any errors or omissions in any content</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <p className="text-gray-700 text-sm">
                        <strong>Educational Disclaimer:</strong> While we strive to provide high-quality educational content, Biology.Trunk makes no guarantees regarding exam results, admission outcomes, or any other specific academic achievements. Individual results may vary based on multiple factors including personal effort, learning ability, and external circumstances.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Modifications to Terms */}
                <section id="modifications" className="mb-8 scroll-mt-20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <i className="fas fa-sync-alt text-yellow-600 text-lg"></i>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Modifications to Terms</h2>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <p className="text-yellow-800 font-medium">
                      <i className="fas fa-bell mr-2"></i>
                      We reserve the right to update these Terms & Conditions at any time
                    </p>
                  </div>

                  <div className="space-y-3">
                    <p className="text-gray-700 leading-relaxed">
                      Biology.Trunk reserves the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect.
                    </p>

                    <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                      <i className="fas fa-info-circle text-blue-600 mt-0.5"></i>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">Notification of Changes</h4>
                        <p className="text-gray-700 text-sm">
                          We will notify you of any material changes by posting the new Terms on this page and updating the "Last updated" date. Your continued use of the platform after any such changes constitutes your acceptance of the new Terms.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                      <i className="fas fa-calendar-check text-green-600 mt-0.5"></i>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">Review Responsibility</h4>
                        <p className="text-gray-700 text-sm">
                          You are responsible for periodically reviewing these Terms to stay informed of updates. The most current version will always be available on this page.
                        </p>
                      </div>
                    </div>
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
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Questions About Our Terms?</h3>
                        <p className="text-gray-700 mb-3">
                          If you have any questions, concerns, or require clarification about these Terms & Conditions, please contact our legal team:
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
                            <span className="text-gray-700">Response time: Within 3 business days</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 text-center">
                    <p className="text-gray-600 text-sm">
                      For privacy-related inquiries, please refer to our{" "}
                      <Link to="/privacy-policy" className="text-blue-600 hover:underline">
                        Privacy Policy
                      </Link>
                    </p>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Documents Section */}
      <section className="py-8 sm:py-12 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Related Legal Documents</h2>
            <p className="text-gray-600">Review our other important policies and documents</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              to="/privacy-policy"
              className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-blue-300 transition-all text-center"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <i className="fas fa-shield-alt text-blue-600"></i>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Privacy Policy</h3>
              <p className="text-gray-600 text-xs">How we protect your personal data</p>
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
              <p className="text-gray-600 text-xs">Get help with legal questions</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}