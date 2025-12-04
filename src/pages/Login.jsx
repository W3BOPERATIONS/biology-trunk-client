"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { API_URL } from "../utils/api.js"
import { showSuccessToast, showErrorToast } from "../utils/toast.js"

export default function Login({ setUser }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await axios.post(`${API_URL}/users/login`, {
        email,
        password,
      })

      localStorage.setItem("user", JSON.stringify(response.data.user))
      localStorage.setItem("loginTime", new Date().toISOString())
      setUser(response.data.user)
      showSuccessToast(`Welcome back, ${response.data.user.name}!`)
      navigate(`/${response.data.user.role}-dashboard`)
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed"
      setError(errorMessage)
      showErrorToast(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Enhanced Card with Better Shadow and Border */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-2xl border border-gray-100">
          {/* Enhanced Logo Section */}
          <div className="flex justify-center mb-6 md:mb-8">
            <div className="relative">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
                <i className="fas fa-graduation-cap text-white text-2xl md:text-3xl"></i>
              </div>
              <div className="absolute -bottom-2 -right-2 w-5 h-5 md:w-6 md:h-6 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full border-4 border-white"></div>
            </div>
          </div>

          {/* Enhanced Header */}
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-gray-600 font-medium text-sm md:text-base">Sign in to continue your learning journey</p>
          </div>

          {/* Enhanced Error Message */}
          {error && (
            <div className="mb-4 md:mb-6 p-3 md:p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs md:text-sm font-medium flex items-center gap-2 md:gap-3">
              <i className="fas fa-exclamation-circle text-red-500 text-base md:text-lg"></i>
              <span>{error}</span>
            </div>
          )}

          {/* Enhanced Login Form */}
          <form onSubmit={handleLogin} className="space-y-4 md:space-y-6">
            <div className="space-y-2">
              <label className="block text-gray-700 text-xs md:text-sm font-semibold mb-1 md:mb-2 flex items-center gap-1 md:gap-2">
                <i className="fas fa-envelope text-blue-500 text-xs md:text-sm"></i>
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 md:py-4 pl-10 md:pl-11 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 md:focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-sm md:text-base"
                  placeholder="your@email.com"
                  required
                />
                <i className="fas fa-envelope absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs md:text-sm"></i>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-gray-700 text-xs md:text-sm font-semibold mb-1 md:mb-2 flex items-center gap-1 md:gap-2">
                <i className="fas fa-lock text-blue-500 text-xs md:text-sm"></i>
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 md:py-4 pl-10 md:pl-11 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 md:focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-sm md:text-base"
                  placeholder="••••••••"
                  required
                />
                <i className="fas fa-lock absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs md:text-sm"></i>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 md:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 flex items-center justify-center gap-2 md:gap-3 text-sm md:text-base"
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin text-sm md:text-base"></i>
                  Signing in...
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt text-sm md:text-base"></i>
                  Sign In to Your Account
                </>
              )}
            </button>
          </form>

          {/* Enhanced Register Link */}
          <div className="text-center mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-100">
            <p className="text-gray-600 font-medium text-xs md:text-sm">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-700 font-bold transition-colors duration-200 flex items-center justify-center gap-1 md:gap-2 mt-1 md:mt-2 text-sm md:text-base"
              >
                <i className="fas fa-user-plus text-xs md:text-sm"></i>
                Create your account here
              </Link>
            </p>
          </div>

          {/* Enhanced Divider */}
          <div className="my-6 md:my-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 md:px-4 bg-white text-gray-500 font-medium text-xs md:text-sm flex items-center gap-1 md:gap-2">
                <i className="fas fa-key text-blue-500 text-xs md:text-sm"></i>
                Demo Credentials
              </span>
            </div>
          </div>

          {/* Enhanced Demo Credentials - Fixed for mobile */}
          <div className="space-y-3 md:space-y-4 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-6 rounded-2xl border border-blue-200">
            <div className="text-center">
              <h3 className="font-bold text-gray-800 text-xs md:text-sm uppercase tracking-wider flex items-center justify-center gap-1 md:gap-2">
                <i className="fas fa-users text-blue-600 text-xs md:text-sm"></i>
                Test the platform with these accounts
              </h3>
            </div>

            <div className="grid gap-3 md:gap-4">
              {[
                { role: "Student", email: "ajha97575@gmail.com", password: "password123", color: "green" },
                { role: "Faculty", email: "abhishekjha2707@gmail.com", password: "faculty123", color: "purple" },
                { role: "Admin", email: "abhishek.flyanytrip@gmail.com", password: "admin123", color: "red" },
              ].map((account, index) => (
                <div
                  key={index}
                  className="bg-white p-3 md:p-4 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-200 overflow-hidden"
                >
                  <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                    <div
                      className={`w-6 h-6 md:w-8 md:h-8 bg-${account.color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}
                    >
                      <i className={`fas fa-user text-${account.color}-600 text-xs md:text-sm`}></i>
                    </div>
                    <span className="font-bold text-gray-800 text-xs md:text-sm truncate">{account.role}</span>
                  </div>
                  <div className="space-y-1 md:space-y-2">
                    <div className="flex items-start md:items-center gap-1 md:gap-2 text-gray-700">
                      <i className="fas fa-envelope text-gray-400 text-xs mt-0.5 md:mt-0 flex-shrink-0"></i>
                      <span className="font-mono text-xs md:text-sm truncate">{account.email}</span>
                    </div>
                    <div className="flex items-start md:items-center gap-1 md:gap-2 text-gray-700">
                      <i className="fas fa-lock text-gray-400 text-xs mt-0.5 md:mt-0 flex-shrink-0"></i>
                      <span className="font-mono text-xs md:text-sm truncate">{account.password}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
