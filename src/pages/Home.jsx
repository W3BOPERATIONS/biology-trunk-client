"use client"

import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import axios from "axios"
import API_URL from "../config/api"

export default function Home({ user, onLogout }) {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalCourses: 0,
    premiumCourses: 0,
    totalFaculty: 0,
    totalStudents: 0,
  })
  const [connectionStatus, setConnectionStatus] = useState("Checking...")

  useEffect(() => {
    checkConnection()
    fetchStats()
  }, [])

  const checkConnection = async () => {
    try {
      console.log("[v0] Checking connection to:", API_URL)
      const response = await axios.get(`${API_URL}/health`, { timeout: 5000 })
      console.log("[v0] Connection successful:", response.data)
      setConnectionStatus("Connected")
    } catch (error) {
      console.error("[v0] Connection failed:", {
        message: error.message,
        url: API_URL,
        code: error.code,
        status: error.response?.status,
      })
      setConnectionStatus("Disconnected - Check server")
    }
  }

  const fetchStats = async () => {
    try {
      console.log("[v0] Fetching stats from:", API_URL)
      const [courses, faculty, students] = await Promise.all([
        axios.get(`${API_URL}/courses?limit=1000`, { timeout: 10000 }),
        axios.get(`${API_URL}/users/role/faculty`, { timeout: 10000 }),
        axios.get(`${API_URL}/users/role/student`, { timeout: 10000 }),
      ])

      const courseCount = courses.data.courses ? courses.data.courses.length : courses.data.length
      const premiumCourses = courses.data.courses
        ? courses.data.courses.filter((c) => c.price > 0).length
        : courses.data.filter((c) => c.price > 0).length

      setStats({
        totalCourses: courseCount,
        premiumCourses: premiumCourses,
        totalFaculty: faculty.data.length,
        totalStudents: students.data.length,
      })
    } catch (error) {
      console.error("[v0] Failed to fetch stats:", error.message)
      setConnectionStatus("Stats fetch failed")
    }
  }

  const handleCategoryClick = (category) => {
    if (user && user.role === "student") {
      navigate(`/student-dashboard?category=${category}`)
    } else if (!user) {
      navigate("/login")
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md">
                <i className="fas fa-graduation-cap text-white text-lg"></i>
              </div>
              <span className="text-gray-900 font-bold text-2xl">EduTech Pro</span>
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <span className="text-gray-700 font-medium">{user.name}</span>
                  <button
                    onClick={onLogout}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold flex items-center gap-2"
                  >
                    <i className="fas fa-sign-out-alt"></i>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-gray-700 hover:text-blue-600 transition font-medium flex items-center gap-2"
                  >
                    <i className="fas fa-sign-in-alt"></i>
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold flex items-center gap-2"
                  >
                    <i className="fas fa-user-plus"></i>
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  Transform Your Career with{" "}
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Expert-Led Education
                  </span>
                </h1>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Join India's most trusted online learning platform for competitive exam preparation. Access
                  comprehensive courses, personalized mentorship, and cutting-edge learning technology designed to help
                  you achieve academic excellence.
                </p>
                <div className="flex items-center gap-6 text-gray-600">
                  <div className="flex items-center gap-2">
                    <i className="fas fa-check-circle text-green-500"></i>
                    <span>100% Placement Support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="fas fa-check-circle text-green-500"></i>
                    <span>Live Doubt Sessions</span>
                  </div>
                </div>
              </div>

              {!user && (
                <div className="flex gap-4 flex-wrap">
                  <Link
                    to="/register"
                    className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold shadow-lg hover:shadow-xl flex items-center gap-2"
                  >
                    <i className="fas fa-rocket"></i>
                    Start Free Trial
                  </Link>
                  <Link
                    to="/login"
                    className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition font-semibold flex items-center gap-2"
                  >
                    <i className="fas fa-play-circle"></i>
                    Watch Demo
                  </Link>
                </div>
              )}
              {user && (
                <Link
                  to={`/${user.role}-dashboard`}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold shadow-lg"
                >
                  <i className="fas fa-tachometer-alt"></i>
                  Go to Dashboard
                </Link>
              )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-blue-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-star text-blue-600 text-lg"></i>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{stats.premiumCourses}+</div>
                    <div className="text-gray-700 font-semibold text-sm">Premium Courses</div>
                    <div className="text-gray-500 text-xs">Expert-Curated Content</div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-green-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-users text-green-600 text-lg"></i>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">50K+</div>
                    <div className="text-gray-700 font-semibold text-sm">Active Students</div>
                    <div className="text-gray-500 text-xs">Growing Community</div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-purple-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-chalkboard-teacher text-purple-600 text-lg"></i>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{stats.totalFaculty}+</div>
                    <div className="text-gray-700 font-semibold text-sm">Expert Faculty</div>
                    <div className="text-gray-500 text-xs">Industry Professionals</div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-orange-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-chart-line text-orange-600 text-lg"></i>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">98%</div>
                    <div className="text-gray-700 font-semibold text-sm">Success Rate</div>
                    <div className="text-gray-500 text-xs">Proven Results</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Recognition Section - Replaced Trusted By */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Recognized by Education Leaders</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform is trusted by educators and recommended by top performers across India
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-award text-blue-600 text-2xl"></i>
              </div>
              <p className="font-semibold text-gray-900">Best EdTech Platform 2024</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-medal text-green-600 text-2xl"></i>
              </div>
              <p className="font-semibold text-gray-900">95% Student Satisfaction</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-trophy text-purple-600 text-2xl"></i>
              </div>
              <p className="font-semibold text-gray-900">10,000+ Success Stories</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-star text-orange-600 text-2xl"></i>
              </div>
              <p className="font-semibold text-gray-900">4.9/5 Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Why Choose EduTech Pro?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We combine cutting-edge technology with proven teaching methodologies to deliver exceptional learning
              outcomes for students across all competitive exam segments.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-blue-200 group">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                <i className="fas fa-book-open text-blue-600 text-2xl group-hover:text-white"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Comprehensive Curriculum</h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Structured learning paths covering all major competitive exams with updated syllabus and exam patterns.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-600">
                  <i className="fas fa-check text-green-500 text-sm"></i>
                  <span className="text-sm">Updated Content</span>
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <i className="fas fa-check text-green-500 text-sm"></i>
                  <span className="text-sm">Structured Modules</span>
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <i className="fas fa-check text-green-500 text-sm"></i>
                  <span className="text-sm">Regular Revisions</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-green-200 group">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-600 transition-colors">
                <i className="fas fa-video text-green-600 text-2xl group-hover:text-white"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Live Interactive Classes</h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Real-time learning experience with expert faculty and interactive doubt-solving sessions.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-600">
                  <i className="fas fa-check text-green-500 text-sm"></i>
                  <span className="text-sm">Live Sessions</span>
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <i className="fas fa-check text-green-500 text-sm"></i>
                  <span className="text-sm">Recorded Lectures</span>
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <i className="fas fa-check text-green-500 text-sm"></i>
                  <span className="text-sm">Doubt Resolution</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-purple-200 group">
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-600 transition-colors">
                <i className="fas fa-user-tie text-purple-600 text-2xl group-hover:text-white"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Expert Faculty</h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Learn from IIT/NIT alumni and industry experts with proven track records in competitive exam training.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-600">
                  <i className="fas fa-check text-green-500 text-sm"></i>
                  <span className="text-sm">IIT/NIT Alumni</span>
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <i className="fas fa-check text-green-500 text-sm"></i>
                  <span className="text-sm">10+ Years Experience</span>
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <i className="fas fa-check text-green-500 text-sm"></i>
                  <span className="text-sm">Subject Experts</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-orange-200 group">
              <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-orange-600 transition-colors">
                <i className="fas fa-chart-bar text-orange-600 text-2xl group-hover:text-white"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Performance Analytics</h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Detailed progress tracking with AI-powered insights and personalized improvement recommendations.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-600">
                  <i className="fas fa-check text-green-500 text-sm"></i>
                  <span className="text-sm">Progress Reports</span>
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <i className="fas fa-check text-green-500 text-sm"></i>
                  <span className="text-sm">AI Analysis</span>
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <i className="fas fa-check text-green-500 text-sm"></i>
                  <span className="text-sm">Personalized Feedback</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Course Categories - Fixed hover issue */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Comprehensive Course Catalog</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our extensive range of courses designed for academic excellence and competitive success.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                name: "Class 9",
                icon: "fas fa-atom",
                iconColor: "text-blue-600",
                bgColor: "bg-blue-100",
                hoverBgColor: "group-hover:bg-blue-600",
                students: "10K+",
                courses: "45",
              },
              {
                name: "Class 10",
                icon: "fas fa-square-root-alt",
                iconColor: "text-green-600",
                bgColor: "bg-green-100",
                hoverBgColor: "group-hover:bg-green-600",
                students: "15K+",
                courses: "52",
              },
              {
                name: "Class 11",
                icon: "fas fa-flask",
                iconColor: "text-purple-600",
                bgColor: "bg-purple-100",
                hoverBgColor: "group-hover:bg-purple-600",
                students: "12K+",
                courses: "68",
              },
              {
                name: "Class 12",
                icon: "fas fa-calculator",
                iconColor: "text-orange-600",
                bgColor: "bg-orange-100",
                hoverBgColor: "group-hover:bg-orange-600",
                students: "18K+",
                courses: "72",
              },
              {
                name: "JEE Preparation",
                icon: "fas fa-rocket",
                iconColor: "text-red-600",
                bgColor: "bg-red-100",
                hoverBgColor: "group-hover:bg-red-600",
                students: "25K+",
                courses: "85",
              },
              {
                name: "NEET Preparation",
                icon: "fas fa-stethoscope",
                iconColor: "text-pink-600",
                bgColor: "bg-pink-100",
                hoverBgColor: "group-hover:bg-pink-600",
                students: "22K+",
                courses: "78",
              },
              {
                name: "GUJCET",
                icon: "fas fa-vial",
                iconColor: "text-yellow-600",
                bgColor: "bg-yellow-100",
                hoverBgColor: "group-hover:bg-yellow-600",
                students: "8K+",
                courses: "35",
              },
              {
                name: "All Courses",
                icon: "fas fa-graduation-cap",
                iconColor: "text-indigo-600",
                bgColor: "bg-indigo-100",
                hoverBgColor: "group-hover:bg-indigo-600",
                students: "50K+",
                courses: "400+",
              },
            ].map((cat, index) => (
              <div
                key={cat.name}
                onClick={() => handleCategoryClick(cat.name === "All Courses" ? "" : cat.name)}
                className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className={`w-12 h-12 ${cat.bgColor} rounded-lg flex items-center justify-center transition-colors ${cat.hoverBgColor}`}
                  >
                    <i className={`${cat.icon} ${cat.iconColor} text-lg group-hover:text-white transition-colors`}></i>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-lg">{cat.name}</div>
                    <div className="text-gray-500 text-sm">{cat.courses} Courses</div>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>{cat.students} Students</span>
                  <i className="fas fa-arrow-right text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></i>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Methodology */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Our Proven Learning Methodology</h2>
              <p className="text-xl text-gray-600 mb-8">
                Our structured approach ensures comprehensive concept understanding and exam readiness through
                systematic progression and continuous assessment.
              </p>
              <div className="space-y-6">
                {[
                  {
                    icon: "fas fa-lightbulb",
                    title: "Concept Building",
                    desc: "Strong foundation with fundamental concepts",
                  },
                  {
                    icon: "fas fa-puzzle-piece",
                    title: "Application Training",
                    desc: "Real-world problem solving techniques",
                  },
                  {
                    icon: "fas fa-clipboard-check",
                    title: "Assessment",
                    desc: "Regular tests and performance evaluation",
                  },
                  { icon: "fas fa-sync-alt", title: "Revision", desc: "Spaced repetition for better retention" },
                ].map((step, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <i className={`${step.icon} text-blue-600`}></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">{step.title}</h4>
                      <p className="text-gray-600">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-2xl text-white">
              <h3 className="text-2xl font-bold mb-6">Success Roadmap</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-white text-blue-600 rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <span>Diagnostic Test & Goal Setting</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-white text-blue-600 rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <span>Structured Learning Path</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-white text-blue-600 rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <span>Regular Practice & Assessments</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-white text-blue-600 rounded-full flex items-center justify-center font-bold">
                    4
                  </div>
                  <span>Performance Analysis</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-white text-blue-600 rounded-full flex items-center justify-center font-bold">
                    5
                  </div>
                  <span>Revision & Mock Tests</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-white text-blue-600 rounded-full flex items-center justify-center font-bold">
                    6
                  </div>
                  <span>Exam Readiness</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Student Success Stories</h2>
            <p className="text-xl text-gray-600">
              Hear from our students who have achieved remarkable success in their academic journeys.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Rohit Kumar",
                score: "95%",
                exam: "JEE Main",
                feedback:
                  "The structured curriculum and expert guidance helped me secure a top rank in JEE Main. The faculty's teaching methodology is exceptional.",
                achievement: "AIR 1245",
              },
              {
                name: "Priya Singh",
                score: "680/720",
                exam: "NEET",
                feedback:
                  "Comprehensive biology lectures and regular mock tests made all the difference. The study material is perfectly aligned with the exam pattern.",
                achievement: "MBBS AIIMS",
              },
              {
                name: "Aditya Patel",
                score: "98%",
                exam: "Board Exam",
                feedback:
                  "The personalized attention and doubt-solving sessions helped me achieve 98% in Class 12 Science. Highly recommended platform!",
                achievement: "School Topper",
              },
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="fas fa-star text-yellow-400 text-lg"></i>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic leading-relaxed">"{testimonial.feedback}"</p>
                <div className="border-t border-gray-200 pt-4">
                  <p className="font-bold text-gray-900 text-lg">{testimonial.name}</p>
                  <p className="text-blue-600 font-semibold">
                    {testimonial.score} • {testimonial.exam}
                  </p>
                  <p className="text-green-600 text-sm font-medium mt-1">
                    <i className="fas fa-trophy"></i> {testimonial.achievement}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Academic Journey?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of successful students who have achieved their dreams with EduTech Pro. Start your
            preparation today with our expert-led courses and comprehensive learning ecosystem.
          </p>
          {!user && (
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                to="/register"
                className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition font-bold shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <i className="fas fa-rocket"></i>
                Start Free Trial
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-blue-500 transition font-bold flex items-center gap-2"
              >
                <i className="fas fa-calendar-check"></i>
                Schedule Demo
              </Link>
            </div>
          )}
          {user && (
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                to={`/${user.role}-dashboard`}
                className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition font-bold shadow-lg flex items-center gap-2"
              >
                <i className="fas fa-tachometer-alt"></i>
                Continue Learning
              </Link>
              <Link
                to="/courses"
                className="px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-blue-500 transition font-bold flex items-center gap-2"
              >
                <i className="fas fa-search"></i>
                Explore Courses
              </Link>
            </div>
          )}
          <p className="text-blue-200 mt-6 text-sm">
            <i className="fas fa-shield-alt mr-2"></i>
            7-day money back guarantee • 24/7 student support
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-bold mb-4 text-lg">About EduTech Pro</h4>
              <p className="text-sm text-gray-400 leading-relaxed">
                Leading online learning platform providing quality education to students across India. Empowering the
                next generation of achievers with cutting-edge technology and expert guidance.
              </p>
              <div className="flex gap-4 mt-4">
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <i className="fab fa-facebook text-lg"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <i className="fab fa-twitter text-lg"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <i className="fab fa-linkedin text-lg"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <i className="fab fa-instagram text-lg"></i>
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4 text-lg">Courses</h4>
              <ul className="text-sm space-y-3">
                {[
                  "Classes 9-12",
                  "JEE Preparation",
                  "NEET Preparation",
                  "GUJCET Courses",
                  "Board Exams",
                  "Crash Courses",
                ].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-white transition flex items-center gap-2">
                      <i className="fas fa-chevron-right text-xs"></i>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4 text-lg">Support</h4>
              <ul className="text-sm space-y-3">
                {["Contact Us", "FAQ", "Help Center", "Live Chat", "Student Forum"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-white transition flex items-center gap-2">
                      <i className="fas fa-chevron-right text-xs"></i>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4 text-lg">Legal</h4>
              <ul className="text-sm space-y-3">
                {["Privacy Policy", "Terms of Service", "Refund Policy", "Cookie Policy"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-white transition flex items-center gap-2">
                      <i className="fas fa-chevron-right text-xs"></i>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-sm text-gray-400">
              <i className="fas fa-copyright mr-2"></i>
              2025 EduTech Pro. All rights reserved. | Designed for educational excellence
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
