"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"

const API_URL = "https://biology-trunk-server.vercel.app/api"

export default function Register({ setUser }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
    phone: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    setLoading(true)

    try {
      const response = await axios.post(`${API_URL}/users/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        phone: formData.phone,
      })

      localStorage.setItem("user", JSON.stringify(response.data.user))
      setUser(response.data.user)
      navigate(`/${response.data.user.role}-dashboard`)
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl p-8 shadow-2xl border border-gray-100">
          {/* Enhanced Header Section */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3">
                  <i className="fas fa-user-graduate text-white text-3xl"></i>
                </div>
                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full border-4 border-white"></div>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Join EduTech Pro
            </h1>
            <p className="text-gray-600 font-medium">Start your learning journey with India's most trusted platform</p>
          </div>

          {/* Enhanced Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium flex items-center gap-3">
              <i className="fas fa-exclamation-circle text-red-500 text-lg"></i>
              <span>{error}</span>
            </div>
          )}

          {/* Enhanced Registration Form */}
          <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information Column */}
            <div className="space-y-5">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <i className="fas fa-user text-blue-500"></i>
                Personal Information
              </h3>
              
              <div className="space-y-2">
                <label className="block text-gray-700 text-sm font-semibold mb-2 flex items-center gap-2">
                  <i className="fas fa-user text-blue-500 text-sm"></i>
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-4 pl-11 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                    placeholder="John Doe"
                    required
                  />
                  <i className="fas fa-user absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-gray-700 text-sm font-semibold mb-2 flex items-center gap-2">
                  <i className="fas fa-envelope text-blue-500 text-sm"></i>
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-4 pl-11 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                    placeholder="your@email.com"
                    required
                  />
                  <i className="fas fa-envelope absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-gray-700 text-sm font-semibold mb-2 flex items-center gap-2">
                  <i className="fas fa-phone text-blue-500 text-sm"></i>
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-4 pl-11 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                    placeholder="+91 9876543210"
                  />
                  <i className="fas fa-phone absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
                </div>
              </div>
            </div>

            {/* Account Information Column */}
            <div className="space-y-5">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <i className="fas fa-lock text-blue-500"></i>
                Account Information
              </h3>

              <div className="space-y-2">
                <label className="block text-gray-700 text-sm font-semibold mb-2 flex items-center gap-2">
                  <i className="fas fa-user-tag text-blue-500 text-sm"></i>
                  Role
                </label>
                <div className="relative">
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-4 py-4 pl-11 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 appearance-none"
                  >
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                  </select>
                  <i className="fas fa-chevron-down absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
                  <i className="fas fa-user-tag absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-gray-700 text-sm font-semibold mb-2 flex items-center gap-2">
                  <i className="fas fa-key text-blue-500 text-sm"></i>
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-4 pl-11 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                    placeholder="••••••••"
                    required
                  />
                  <i className="fas fa-key absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
                </div>
                <p className="text-xs text-gray-500 mt-2 flex items-center gap-2">
                  <i className="fas fa-info-circle text-blue-500"></i>
                  At least 6 characters
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-gray-700 text-sm font-semibold mb-2 flex items-center gap-2">
                  <i className="fas fa-check-circle text-blue-500 text-sm"></i>
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-4 pl-11 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                    placeholder="••••••••"
                    required
                  />
                  <i className="fas fa-check-circle absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
                </div>
              </div>
            </div>

            {/* Full Width Submit Button */}
            <div className="md:col-span-2 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Creating Your Account...
                  </>
                ) : (
                  <>
                    <i className="fas fa-rocket"></i>
                    Start Learning Journey
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Enhanced Login Link */}
          <div className="text-center mt-8 pt-6 border-t border-gray-100">
            <p className="text-gray-600 font-medium">
              Already have an account?{" "}
              <Link 
                to="/login" 
                className="text-blue-600 hover:text-blue-700 font-bold transition-colors duration-200 flex items-center justify-center gap-2 mt-2"
              >
                <i className="fas fa-sign-in-alt text-sm"></i>
                Sign in to your account
              </Link>
            </p>
          </div>

          {/* Benefits Section */}
          <div className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
            <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider mb-4 flex items-center justify-center gap-2">
              <i className="fas fa-gift text-blue-600"></i>
              Start your journey with amazing benefits
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              {[
                { icon: "fas fa-play-circle", text: "Free Trial Classes", color: "text-green-600" },
                { icon: "fas fa-chart-line", text: "Progress Tracking", color: "text-blue-600" },
                { icon: "fas fa-users", text: "Expert Faculty", color: "text-purple-600" }
              ].map((benefit, index) => (
                <div key={index} className="flex items-center justify-center gap-2 text-sm text-gray-700">
                  <i className={`${benefit.icon} ${benefit.color} text-lg`}></i>
                  <span className="font-medium">{benefit.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}