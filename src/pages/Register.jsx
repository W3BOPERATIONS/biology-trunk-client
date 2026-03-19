"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { API_URL } from "../utils/api.js"
import { showSuccessToast, showErrorToast } from "../utils/toast.js"

export default function Register({ setUser }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
    phone: "",
    otp: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [otpLoading, setOtpLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handlePopState = (e) => {
      e.preventDefault()
      navigate("/login", { replace: true })
    }

    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSendOtp = async () => {
    if (!formData.name || !formData.email) {
      showErrorToast("Please enter your name and email first")
      return
    }

    setOtpLoading(true)
    setError("")

    try {
      await axios.post(`${API_URL}/users/student/send-otp`, {
        email: formData.email,
      })
      showSuccessToast("Verification OTP sent to your email!")
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to send OTP"
      setError(msg)
      showErrorToast(msg)
    } finally {
      setOtpLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.confirmPassword) {
      const errorMsg = "Passwords do not match"
      setError(errorMsg)
      showErrorToast(errorMsg)
      return
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-={}[\]|:;"'<>,.?/~`]).{6,}$/
    if (!passwordRegex.test(formData.password)) {
      const errorMsg = "Password must be at least 6 characters and contain uppercase, lowercase, number, and special character (# is allowed)"
      setError(errorMsg)
      showErrorToast(errorMsg)
      return
    }

    if (!formData.otp) {
      showErrorToast("Please enter the verification OTP")
      return
    }

    setLoading(true)

    try {
      const response = await axios.post(`${API_URL}/users/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: "student",
        phone: formData.phone,
        otp: formData.otp,
      })

      localStorage.setItem("user", JSON.stringify(response.data.user))
      // localStorage.setItem("token", response.data.token) // Do not auto-login
      // setUser(response.data.user) // Do not auto-login
      showSuccessToast(`Account created successfully. Please login to continue.`)
      navigate(`/login`, { replace: true })
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Registration failed"
      setError(errorMessage)
      showErrorToast(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl p-8 shadow-2xl border border-gray-100">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3">
                  <i className="fas fa-user-graduate text-white text-3xl"></i>
                </div>
                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-gradient-to-br from-blue-400 to-indigo-50 rounded-full border-4 border-white"></div>
              </div>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
              Create Your Student Account
            </h1>
            <p className="text-gray-600 font-medium">Join Biology.Trunk and start your success journey</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium flex items-center gap-3 animate-shake">
              <i className="fas fa-exclamation-circle text-red-500 text-lg"></i>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Row 1: Name and Email */}
              <div className="space-y-1.5 text-left">
                <label className="block text-gray-700 text-sm font-bold flex items-center gap-2">
                  <i className="fas fa-user text-blue-500 text-xs"></i>
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 pl-11 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                    placeholder="Enter your full name"
                    required
                  />
                  <i className="fas fa-user absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="block text-gray-700 text-sm font-bold flex items-center gap-2">
                  <i className="fas fa-envelope text-blue-500 text-xs"></i>
                  Email Address
                </label>
                <div className="relative flex flex-col md:flex-row gap-2">
                  <div className="relative flex-1 w-full">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 pl-11 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                      placeholder="name@example.com"
                      required
                    />
                    <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                  </div>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={otpLoading}
                    className="w-full md:w-auto px-4 py-3.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-bold text-sm whitespace-nowrap shadow-md hover:shadow-lg disabled:opacity-50 flex items-center gap-2 min-w-[110px] justify-center"
                  >
                    {otpLoading ? (
                      <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane text-xs"></i>
                        Send OTP
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Row 2: OTP and Phone Number */}
              <div className="space-y-1.5 text-left">
                <label className="block text-gray-700 text-sm font-bold flex items-center gap-2">
                  <i className="fas fa-shield-alt text-blue-500 text-xs"></i>
                  Verification OTP
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="otp"
                    maxLength="6"
                    value={formData.otp}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 pl-11 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all font-bold tracking-widest"
                    placeholder="123456"
                    required
                  />
                  <i className="fas fa-key absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="block text-gray-700 text-sm font-bold flex items-center gap-2">
                  <i className="fas fa-phone text-blue-500 text-xs"></i>
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 pl-11 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                    placeholder="+91 98765-43210"
                    required
                  />
                  <i className="fas fa-phone absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                </div>
              </div>

              {/* Row 3: Password side by side */}
              <div className="space-y-1.5 text-left">
                <label className="block text-gray-700 text-sm font-bold flex items-center gap-2">
                  <i className="fas fa-lock text-blue-500 text-xs"></i>
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 pl-11 pr-10 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                    placeholder="Create a strong password"
                    required
                  />
                  <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"} text-xs`}></i>
                  </button>
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="block text-gray-700 text-sm font-bold flex items-center gap-2">
                  <i className="fas fa-check-double text-blue-500 text-xs"></i>
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 pl-11 pr-10 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                    placeholder="Repeat your password"
                    required
                  />
                  <i className="fas fa-check-double absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    <i className={`fas ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"} text-xs`}></i>
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all font-bold shadow-xl hover:shadow-2xl transform active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : (
                  <i className="fas fa-rocket"></i>
                )}
                Register Account
              </button>
            </div>
          </form>

          {/* Footer Section */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-gray-600 text-sm flex items-center justify-center gap-2">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-bold transition-all flex items-center gap-1">
                <i className="fas fa-sign-in-alt text-xs"></i>
                Sign in here
              </Link>
            </p>
          </div>

          {/* Benefits Section - Reverting to previous design */}
          <div className="mt-8 bg-blue-50/50 p-5 rounded-xl border border-blue-100">
            <h3 className="font-bold text-blue-800 text-[10px] uppercase tracking-wider mb-4 flex items-center justify-center gap-2">
              <i className="fas fa-gift"></i>
              START YOUR JOURNEY WITH AMAZING BENEFITS
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-gray-700 font-semibold">
              <div className="flex items-center gap-2">
                <i className="fas fa-play-circle text-green-600 text-sm"></i>
                <span>Free Trial Classes</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="fas fa-chart-line text-blue-600 text-sm"></i>
                <span>Progress Tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="fas fa-users text-purple-600 text-sm"></i>
                <span>Expert Faculty</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
