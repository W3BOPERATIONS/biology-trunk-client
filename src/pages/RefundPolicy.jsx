"use client"

import { Link } from "react-router-dom"
import logo from "../assets/biology-trunk-logo.png"

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
              Clear and transparent refund policy for our educational services
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <i className="fas fa-money-bill-wave text-blue-200 text-xl"></i>
              <span className="text-blue-100 font-medium">7-Day Money Back Guarantee</span>
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
                    { id: "commitment", label: "Our Commitment" },
                    { id: "eligibility", label: "Refund Eligibility" },
                    { id: "no-refund", label: "No Refund After 7 Days" },
                    { id: "non-refundable", label: "Non-Refundable" },
                    { id: "process", label: "Refund Process" },
                    { id: "partial", label: "Partial Refunds" },
                    { id: "quality", label: "Quality Guarantee" },
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
                {/* Important Notice */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <i className="fas fa-exclamation-triangle text-yellow-600 text-xl mt-0.5"></i>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Important Notice</h3>
                      <p className="text-gray-700 text-sm">
                        <strong>No refunds will be processed after 7 days from the date of enrollment.</strong> This is a strict policy to ensure fair business practices and prevent misuse of our educational resources.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Our Commitment */}
                <section id="commitment" className="mb-8 scroll-mt-20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <i className="fas fa-handshake text-blue-600 text-lg"></i>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Our Commitment to You</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    At Biology.Trunk, we are confident in the quality of our courses and the expertise of our Ph.D. qualified faculty. We believe in providing exceptional value for your investment in education. This refund policy outlines the terms under which we process refunds.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <i className="fas fa-star text-yellow-500"></i>
                      <h3 className="font-bold text-gray-900">Quality Education Guarantee</h3>
                    </div>
                    <p className="text-gray-700 mt-2 text-sm">
                      We stand by the quality of our educational content and faculty expertise. If you're not satisfied within the refund period, we'll process your refund promptly.
                    </p>
                  </div>
                </section>

                {/* Refund Eligibility */}
                <section id="eligibility" className="mb-8 scroll-mt-20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <i className="fas fa-check-circle text-green-600 text-lg"></i>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Refund Eligibility</h2>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <p className="text-green-800 font-medium">
                      <i className="fas fa-calendar-check mr-2"></i>
                      <strong>7-Day Money Back Guarantee</strong> from the date of enrollment
                    </p>
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed mb-4">
                    You are eligible for a full refund if you meet ALL of the following conditions:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-white border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <i className="fas fa-clock text-green-600 text-sm"></i>
                        </div>
                        <h3 className="font-bold text-gray-900 text-sm">Time Limit</h3>
                      </div>
                      <p className="text-gray-600 text-xs">Refund request submitted within 7 days of enrollment</p>
                    </div>
                    
                    <div className="bg-white border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <i className="fas fa-video text-green-600 text-sm"></i>
                        </div>
                        <h3 className="font-bold text-gray-900 text-sm">Content Access</h3>
                      </div>
                      <p className="text-gray-600 text-xs">Not accessed more than 30% of course content</p>
                    </div>
                    
                    <div className="bg-white border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <i className="fas fa-users text-green-600 text-sm"></i>
                        </div>
                        <h3 className="font-bold text-gray-900 text-sm">Live Classes</h3>
                      </div>
                      <p className="text-gray-600 text-xs">Not participated in more than 2 live classes</p>
                    </div>
                    
                    <div className="bg-white border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <i className="fas fa-star-half-alt text-green-600 text-sm"></i>
                        </div>
                        <h3 className="font-bold text-gray-900 text-sm">Quality Issues</h3>
                      </div>
                      <p className="text-gray-600 text-xs">Course did not meet your expectations</p>
                    </div>
                  </div>
                </section>

                {/* NO REFUND AFTER 7 DAYS - STRICT POLICY */}
                <section id="no-refund" className="mb-8 scroll-mt-20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <i className="fas fa-ban text-red-600 text-lg"></i>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">No Refund After 7 Days</h2>
                  </div>
                  
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <div className="flex items-start gap-3">
                      <i className="fas fa-times-circle text-red-500 text-xl mt-0.5"></i>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-1">Strict Policy</h3>
                        <p className="text-gray-700">
                          <strong>No refunds will be processed for any course after 7 days from the date of enrollment.</strong> This is a firm policy to maintain the integrity of our educational offerings and prevent misuse of our resources.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-white border border-red-100 rounded-lg p-4">
                      <h3 className="font-bold text-gray-900 mb-2 text-lg">Important Considerations</h3>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <i className="fas fa-times text-red-500 mt-0.5"></i>
                          <span>Refund requests received on the 8th day or later will not be processed</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <i className="fas fa-times text-red-500 mt-0.5"></i>
                          <span>No exceptions for personal circumstances, technical issues (after 7 days), or change of mind</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <i className="fas fa-times text-red-500 mt-0.5"></i>
                          <span>Course completion status does not affect the 7-day refund window</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start gap-2">
                        <i className="fas fa-info-circle text-blue-600 mt-0.5"></i>
                        <div>
                          <h4 className="font-bold text-gray-900 mb-1">Why This Policy?</h4>
                          <p className="text-gray-700 text-sm">
                            This policy ensures fairness for all students and allows us to maintain high-quality educational content. Once significant course materials have been accessed, refunds cannot be granted as the educational value has been provided.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Non-Refundable Courses */}
                <section id="non-refundable" className="mb-8 scroll-mt-20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <i className="fas fa-exclamation text-orange-600 text-lg"></i>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Non-Refundable Courses & Conditions</h2>
                  </div>
                  
                  <div className="space-y-3">
                    {[
                      {
                        icon: "fas fa-tags",
                        color: "bg-orange-100 text-orange-600",
                        title: "Promotional Courses",
                        description: "Courses purchased during promotional periods or with discount codes"
                      },
                      {
                        icon: "fas fa-chart-line",
                        color: "bg-red-100 text-red-600",
                        title: "High Access Courses",
                        description: "Courses where more than 30% of content has been accessed"
                      },
                      {
                        icon: "fas fa-certificate",
                        color: "bg-purple-100 text-purple-600",
                        title: "Certified Courses",
                        description: "Courses for which certificates have been awarded"
                      },
                      {
                        icon: "fas fa-calendar-day",
                        color: "bg-blue-100 text-blue-600",
                        title: "Special Sessions",
                        description: "Live workshop sessions or one-on-one consulting services"
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

                {/* Refund Process */}
                <section id="process" className="mb-8 scroll-mt-20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <i className="fas fa-cogs text-indigo-600 text-lg"></i>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Refund Process</h2>
                  </div>
                  
                  <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-4">
                    <p className="text-indigo-800 font-medium">
                      <i className="fas fa-list-ol mr-2"></i>
                      To request a refund (within 7 days), follow these steps:
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      {
                        step: "1",
                        icon: "fas fa-envelope",
                        title: "Contact Support",
                        description: "Email biologytrunk145@gmail.com with your enrollment ID"
                      },
                      {
                        step: "2",
                        icon: "fas fa-comment",
                        title: "State Reason",
                        description: "Provide a clear reason for your refund request"
                      },
                      {
                        step: "3",
                        icon: "fas fa-clock",
                        title: "Review Period",
                        description: "Our team reviews requests within 48 hours"
                      },
                      {
                        step: "4",
                        icon: "fas fa-check-circle",
                        title: "Processing",
                        description: "Approved refunds processed within 5-7 business days"
                      },
                    ].map((step, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                          {step.step}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <i className={`${step.icon} text-indigo-600`}></i>
                            <h3 className="font-bold text-gray-900">{step.title}</h3>
                          </div>
                          <p className="text-gray-700 text-sm">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h3 className="font-bold text-gray-900 mb-2">Refund Method</h3>
                    <p className="text-gray-700 text-sm">
                      Refunds will be credited back to the original payment method. For transactions via Razorpay, refunds go directly to your account/card. Allow 5-7 business days for the refund to appear.
                    </p>
                  </div>
                </section>

                {/* Partial Refunds */}
                <section id="partial" className="mb-8 scroll-mt-20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <i className="fas fa-percentage text-yellow-600 text-lg"></i>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Partial Refunds</h2>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <p className="text-yellow-800 font-medium">
                      <i className="fas fa-exclamation-circle mr-2"></i>
                      Partial refunds are rare and evaluated on a case-by-case basis
                    </p>
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed mb-3">
                    In exceptional cases where students have accessed significant course content but still wish to withdraw, we may consider a partial refund (typically up to 50% of the course fee).
                  </p>
                  
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex items-start gap-2">
                      <i className="fas fa-circle text-xs text-yellow-500 mt-1.5"></i>
                      <span>Only considered for requests submitted within 7 days</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <i className="fas fa-circle text-xs text-yellow-500 mt-1.5"></i>
                      <span>Based on the amount of content accessed and time remaining</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <i className="fas fa-circle text-xs text-yellow-500 mt=1.5"></i>
                      <span>Requires approval from management team</span>
                    </div>
                  </div>
                </section>

                {/* Course Quality Guarantee */}
                <section id="quality" className="mb-8 scroll-mt-20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <i className="fas fa-award text-green-600 text-lg"></i>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Course Quality Guarantee</h2>
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We stand by the quality of our educational content and faculty expertise. If you experience any of the following within the 7-day refund period, we will work to resolve the issue or provide a full refund:
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-white border border-green-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <i className="fas fa-tools text-green-600"></i>
                        <h4 className="font-bold text-gray-900 text-sm">Technical Issues</h4>
                      </div>
                      <p className="text-gray-600 text-xs">Platform accessibility problems</p>
                    </div>
                    
                    <div className="bg-white border border-green-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <i className="fas fa-book text-green-600"></i>
                        <h4 className="font-bold text-gray-900 text-sm">Content Problems</h4>
                      </div>
                      <p className="text-gray-600 text-xs">Inaccurate or incomplete course materials</p>
                    </div>
                    
                    <div className="bg-white border border-green-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <i className="fas fa-chalkboard-teacher text-green-600"></i>
                        <h4 className="font-bold text-gray-900 text-sm">Faculty Issues</h4>
                      </div>
                      <p className="text-gray-600 text-xs">Instructor unavailability or quality concerns</p>
                    </div>
                    
                    <div className="bg-white border border-green-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <i className="fas fa-video text-green-600"></i>
                        <h4 className="font-bold text-gray-900 text-sm">Live Class Problems</h4>
                      </div>
                      <p className="text-gray-600 text-xs">Scheduling or technical issues with live sessions</p>
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
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Questions About Refunds?</h3>
                        <p className="text-gray-700 mb-3">
                          For any questions about our refund policy or to submit a refund request (within 7 days of enrollment), please contact our support team:
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
                      Please note: Refund requests received after 7 days of enrollment will not be processed under any circumstances.
                    </p>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Refund Timeline Section */}
      <section className="py-8 sm:py-12 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Refund Timeline</h2>
            <p className="text-gray-600">Clear understanding of our refund process timeframe</p>
          </div>
          <div className="relative">
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-0.5 bg-gray-300"></div>
            <div className="relative flex justify-between">
              {[
                { day: "Day 0-7", icon: "fas fa-check", color: "bg-green-500", text: "Refund Eligible" },
                { day: "Day 8+", icon: "fas fa-times", color: "bg-red-500", text: "No Refund" },
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center relative z-10">
                  <div className={`w-12 h-12 ${item.color} rounded-full flex items-center justify-center mb-2`}>
                    <i className={`${item.icon} text-white`}></i>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
                    <h3 className="font-bold text-gray-900">{item.day}</h3>
                    <p className="text-gray-600 text-xs">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Same as Home */}
      <footer className="bg-gray-900 text-gray-300 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-6">
            <div>
              <h4 className="text-white font-bold mb-2 sm:mb-3 text-sm sm:text-base">About Biology.Trunk</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                India's premier online learning platform providing quality education led by Ph.D. experts, NET & GATE
                qualified faculty with 15+ years of government college teaching experience.
              </p>
              <div className="flex gap-2 sm:gap-3 mt-2">
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <i className="fab fa-facebook text-sm"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <i className="fab fa-twitter text-sm"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <i className="fab fa-linkedin text-sm"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <i className="fab fa-instagram text-sm"></i>
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-2 sm:mb-3 text-sm sm:text-base">Courses</h4>
              <ul className="text-xs space-y-1.5">
                {[
                  "Classes 9-12",
                  "JEE Preparation",
                  "NEET Preparation",
                  "AIIMS Paramedical",
                  "Nursing Entrance",
                  "CUET (UG)",
                  "TGT/PGT Preparation",
                  "KVS/NVS",
                  "NET & GATE",
                  "KYPS Olympiad",
                  "Foreign Languages",
                ].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-white transition flex items-center gap-1">
                      <i className="fas fa-chevron-right text-xs"></i>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-2 sm:mb-3 text-sm sm:text-base">Faculty Credentials</h4>
              <ul className="text-xs space-y-1.5">
                {[
                  "Ph.D. Holders",
                  "NET & GATE Qualified",
                  // "Ex Government College Lecturers",
                  "15+ Years Experience",
                  "IIT/NIT Alumni",
                  "Subject Matter Experts",
                ].map((item) => (
                  <li key={item}>
                    <div className="text-gray-400 flex items-center gap-1">
                      <i className="fas fa-check text-green-500 text-xs"></i>
                      {item}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-2 sm:mb-3 text-sm sm:text-base">Legal</h4>
              <ul className="text-xs space-y-1.5">
                <li>
                  <Link
                    to="/privacy-policy"
                    className="text-gray-400 hover:text-white transition flex items-center gap-1"
                  >
                    <i className="fas fa-chevron-right text-xs"></i>
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms-conditions"
                    className="text-gray-400 hover:text-white transition flex items-center gap-1"
                  >
                    <i className="fas fa-chevron-right text-xs"></i>
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link
                    to="/refund-policy"
                    className="text-gray-400 hover:text-white transition flex items-center gap-1 bg-blue-900/20 px-2 rounded"
                  >
                    <i className="fas fa-chevron-right text-xs"></i>
                    Refund Policy
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-400 hover:text-white transition flex items-center gap-1">
                    <i className="fas fa-chevron-right text-xs"></i>
                    Contact Support
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-4 text-center">
            <p className="text-xs text-gray-400">
              <i className="fas fa-copyright mr-1"></i>
              2025 Biology.Trunk. All rights reserved. | Excellence in Education through Expert Guidance
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}