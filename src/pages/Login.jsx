"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { API_URL } from "../utils/api.js"

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
      navigate(`/${response.data.user.role}-dashboard`)
    } catch (err) {
      setError(err.response?.data?.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Enhanced Card with Better Shadow and Border */}
        <div className="bg-white rounded-2xl p-8 shadow-2xl border border-gray-100">
          {/* Enhanced Logo Section */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
                <i className="fas fa-graduation-cap text-white text-3xl"></i>
              </div>
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full border-4 border-white"></div>
            </div>
          </div>

          {/* Enhanced Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-gray-600 font-medium">Sign in to continue your learning journey</p>
          </div>

          {/* Enhanced Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium flex items-center gap-3">
              <i className="fas fa-exclamation-circle text-red-500 text-lg"></i>
              <span>{error}</span>
            </div>
          )}

          {/* Enhanced Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-gray-700 text-sm font-semibold mb-2 flex items-center gap-2">
                <i className="fas fa-envelope text-blue-500 text-sm"></i>
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-4 pl-11 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                  placeholder="your@email.com"
                  required
                />
                <i className="fas fa-envelope absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-gray-700 text-sm font-semibold mb-2 flex items-center gap-2">
                <i className="fas fa-lock text-blue-500 text-sm"></i>
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-4 pl-11 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                  placeholder="••••••••"
                  required
                />
                <i className="fas fa-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Signing in...
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt"></i>
                  Sign In to Your Account
                </>
              )}
            </button>
          </form>

          {/* Enhanced Register Link */}
          <div className="text-center mt-8 pt-6 border-t border-gray-100">
            <p className="text-gray-600 font-medium">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-700 font-bold transition-colors duration-200 flex items-center justify-center gap-2 mt-2"
              >
                <i className="fas fa-user-plus text-sm"></i>
                Create your account here
              </Link>
            </p>
          </div>

          {/* Enhanced Divider */}
          <div className="my-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-white text-gray-500 font-medium text-sm flex items-center gap-2">
                <i className="fas fa-key text-blue-500"></i>
                Demo Credentials
              </span>
            </div>
          </div>

          {/* Enhanced Demo Credentials */}
          <div className="space-y-4 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
            <div className="text-center">
              <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider flex items-center justify-center gap-2">
                <i className="fas fa-users text-blue-600"></i>
                Test the platform with these accounts
              </h3>
            </div>

            <div className="grid gap-4">
              {[
                { role: "Student", email: "ajha97575@gmail.com", password: "password123", color: "green" },
                { role: "Faculty", email: "abhishekjha2707@gmail.com", password: "faculty123", color: "purple" },
                { role: "Admin", email: "abhishek.flyanytrip@gmail.com", password: "admin123", color: "red" },
              ].map((account, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-200"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-8 h-8 bg-${account.color}-100 rounded-lg flex items-center justify-center`}>
                      <i className={`fas fa-user text-${account.color}-600 text-sm`}></i>
                    </div>
                    <span className="font-bold text-gray-800 text-sm">{account.role}</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-gray-700">
                      <i className="fas fa-envelope text-gray-400 text-xs"></i>
                      <span className="font-mono">{account.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <i className="fas fa-lock text-gray-400 text-xs"></i>
                      <span className="font-mono">{account.password}</span>
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
