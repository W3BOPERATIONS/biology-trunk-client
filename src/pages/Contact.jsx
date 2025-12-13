"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { API_URL } from "../utils/api.js"
import logo from "../assets/biology-trunk-logo.png"
import { showSuccessToast, showErrorToast } from "../utils/toast.js"

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await axios.post(`${API_URL}/contact/send-email`, formData)
      if (response.data.success) {
        showSuccessToast("Message sent successfully! We'll get back to you soon.")
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        })
      }
    } catch (error) {
      console.error("Error sending message:", error)
      showErrorToast(error.response?.data?.message || "Failed to send message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

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
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Contact Our Expert Team
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto">
              Have questions about our courses, faculty, or learning methodology? Our team of Ph.D. experts and support staff is here to help you.
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <i className="fas fa-headset text-blue-200 text-xl"></i>
              <span className="text-blue-100 font-medium">24/7 Student Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-6 sm:p-8">
              <div className="mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Send us a Message</h2>
                <p className="text-gray-600">Fill out the form below and we'll get back to you within 24 hours.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                      Full Name <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i className="fas fa-user text-gray-400"></i>
                      </div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                      Email Address <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i className="fas fa-envelope text-gray-400"></i>
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-900 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i className="fas fa-phone text-gray-400"></i>
                      </div>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-semibold text-gray-900 mb-2">
                      Subject <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i className="fas fa-tag text-gray-400"></i>
                      </div>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="How can we help?"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-900 mb-2">
                    Message <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3">
                      <i className="fas fa-comment text-gray-400"></i>
                    </div>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="6"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Tell us what's on your mind..."
                    ></textarea>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
                >
                  <i className="fas fa-paper-plane"></i>
                  {isSubmitting ? "Sending Message..." : "Send Message"}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  By submitting this form, you agree to our{" "}
                  <Link to="/privacy-policy" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </Link>
                </p>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <div className="mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Get in Touch</h2>
                <p className="text-gray-600">
                  We're committed to providing exceptional support to our students. Reach out to us through any of the following channels.
                </p>
              </div>

              {/* Contact Cards */}
              <div className="space-y-4 sm:space-y-6">
                {/* Email Card */}
                <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-envelope text-blue-600 text-xl"></i>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">Email Support</h3>
                      <p className="text-gray-600 mb-2">For course inquiries and general questions</p>
                      <a 
                        href="mailto:biologytrunk145@gmail.com" 
                        className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
                      >
                        biologytrunk145@gmail.com
                        <i className="fas fa-external-link-alt text-xs"></i>
                      </a>
                      <p className="text-sm text-gray-500 mt-1">Response time: Within 24 hours</p>
                    </div>
                  </div>
                </div>

                {/* Phone Card */}
                <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-phone text-green-600 text-xl"></i>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">Phone Support</h3>
                      <p className="text-gray-600 mb-2">For urgent queries and technical assistance</p>
                      <a 
                        href="tel:+91XXXXXXXXXX" 
                        className="text-green-600 hover:text-green-700 font-medium inline-flex items-center gap-1"
                      >
                        +91 XXXXX XXXXX
                        <i className="fas fa-phone-alt text-xs"></i>
                      </a>
                      <p className="text-sm text-gray-500 mt-1">Available: Mon-Sat, 9 AM - 8 PM IST</p>
                    </div>
                  </div>
                </div>

                {/* Faculty Support Card */}
                <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-user-graduate text-purple-600 text-xl"></i>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">Faculty Support</h3>
                      <p className="text-gray-600 mb-2">Connect with our Ph.D. qualified faculty</p>
                      <p className="text-gray-700 font-medium">Academic guidance and doubt resolution</p>
                      <p className="text-sm text-gray-500 mt-1">Schedule available through student dashboard</p>
                    </div>
                  </div>
                </div>

                {/* Location Card */}
                <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-map-marker-alt text-orange-600 text-xl"></i>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">Office Location</h3>
                      <p className="text-gray-600 mb-2">For in-person consultations and meetings</p>
                      <p className="text-gray-700 font-medium">Noida, Uttar Pradesh, India</p>
                      <p className="text-sm text-gray-500 mt-1">By appointment only</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ Link */}
              {/* <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-question-circle text-blue-600"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Check our FAQ First</h3>
                    <p className="text-gray-600 text-sm mb-2">
                      Many common questions are already answered in our FAQ section.
                    </p>
                    <Link 
                      to="/faq" 
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      Visit FAQ
                      <i className="fas fa-arrow-right text-xs"></i>
                    </Link>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </section>

      {/* Support Hours Section */}
      <section className="py-8 sm:py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Support Hours</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our dedicated support team is available to assist you during these hours
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white p-5 rounded-xl border border-gray-200 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <i className="fas fa-calendar-day text-blue-600 text-xl"></i>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Weekdays</h3>
              <p className="text-gray-700">9:00 AM - 8:00 PM IST</p>
              <p className="text-gray-500 text-sm">Monday to Friday</p>
            </div>
            
            <div className="bg-white p-5 rounded-xl border border-gray-200 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <i className="fas fa-calendar-alt text-green-600 text-xl"></i>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Weekends</h3>
              <p className="text-gray-700">10:00 AM - 6:00 PM IST</p>
              <p className="text-gray-500 text-sm">Saturday & Sunday</p>
            </div>
            
            <div className="bg-white p-5 rounded-xl border border-gray-200 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <i className="fas fa-headset text-purple-600 text-xl"></i>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">24/7 Email Support</h3>
              <p className="text-gray-700">Round the Clock</p>
              <p className="text-gray-500 text-sm">For urgent academic queries</p>
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
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    to="/refund-policy"
                    className="text-gray-400 hover:text-white transition flex items-center gap-1"
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