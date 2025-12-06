"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { API_URL } from "../utils/api.js"
import { showErrorToast } from "../utils/toast.js"
import RazorpayPayment from "../components/RazorpayPayment.jsx"
import logo from "../assets/biology-trunk-logo.png"

export default function CoursePreview({ user, onLogout }) {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    sessionStorage.setItem("previousPath", window.location.pathname)
    fetchCourse()
    checkEnrollment()
  }, [courseId])

  const fetchCourse = async () => {
    try {
      const response = await axios.get(`${API_URL}/courses/${courseId}`)
      setCourse(response.data)
      setLoading(false)
    } catch (error) {
      console.error("Failed to fetch course:", error)
      showErrorToast("Failed to load course details")
      setLoading(false)
    }
  }

  const checkEnrollment = async () => {
    try {
      const response = await axios.get(`${API_URL}/enrollments/student/${user._id}`)
      const isEnrolledInCourse = response.data.some((e) => e.course._id === courseId)
      setIsEnrolled(isEnrolledInCourse)
    } catch (error) {
      console.error("Failed to check enrollment:", error)
    }
  }

  const handleEnrollmentSuccess = () => {
    setIsEnrolled(true)
    navigate(`/course/${courseId}`)
  }

  const handleBack = () => {
    const previousPath = sessionStorage.getItem("previousPath")
    if (previousPath && previousPath !== window.location.pathname) {
      navigate(-1)
    } else {
      navigate("/student-dashboard")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
          <p className="text-gray-600 text-lg">Loading course details...</p>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-exclamation-circle text-4xl text-red-600 mb-4"></i>
          <p className="text-gray-600 text-lg">Course not found</p>
          <button
            onClick={() => navigate("/student-dashboard")}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Consistent with Student Dashboard */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Logo - Same as Student Dashboard */}
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center overflow-hidden">
                <img
                  src={logo || "/placeholder.svg"}
                  alt="Biology.Trunk Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="hidden sm:block">
                <span className="text-gray-900 font-bold text-lg sm:text-xl">Biology.Trunk</span>
                <p className="text-xs text-gray-500">Course Preview</p>
              </div>
              <div className="sm:hidden">
                <span className="text-gray-900 font-bold text-base">Course</span>
                <p className="text-xs text-gray-500">Preview</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => navigate("/student-dashboard")}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
              >
                <i className="fas fa-home text-sm"></i>
                <span className="hidden sm:inline">Dashboard</span>
              </button>
              <button
                onClick={onLogout}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
              >
                <i className="fas fa-sign-out-alt text-sm"></i>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="mb-4 sm:mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm sm:text-base"
        >
          <i className="fas fa-arrow-left"></i>
          Back to Courses
        </button>

        {/* Course Header Card - Enhanced with Dashboard Theme */}
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 border border-blue-200 shadow-sm">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-6 lg:gap-8">
            {/* Course Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 flex-wrap">
                <span className="text-blue-600 font-semibold bg-blue-50 px-3 py-1 rounded-full text-xs sm:text-sm flex items-center gap-1 sm:gap-2 mb-2">
                  <i className="fas fa-tag text-xs sm:text-sm"></i>
                  {course.category}
                </span>
                {course.courseLevel && (
                  <span className="text-green-600 font-semibold bg-green-50 px-3 py-1 rounded-full text-xs sm:text-sm flex items-center gap-1 sm:gap-2 mb-2">
                    <i className="fas fa-chart-line text-xs sm:text-sm"></i>
                    {course.courseLevel}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 text-balance">
                {course.title}
              </h1>
              
              <p className="text-gray-700 text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 line-clamp-2 sm:line-clamp-3">
                {course.description}
              </p>

              {/* Quick Stats - Enhanced with better overflow handling */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200 min-w-0">
                  <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-user text-blue-600 text-sm sm:text-base"></i>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-gray-600 text-xs sm:text-sm font-semibold truncate">Instructor</p>
                      <p className="text-gray-900 font-bold text-sm sm:text-base truncate" title={course.faculty?.name || "N/A"}>
                        {course.faculty?.name || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200 min-w-0">
                  <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-clock text-green-600 text-sm sm:text-base"></i>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-gray-600 text-xs sm:text-sm font-semibold truncate">Duration</p>
                      <p className="text-gray-900 font-bold text-sm sm:text-base truncate">{course.duration}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200 min-w-0">
                  <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-users text-purple-600 text-sm sm:text-base"></i>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-gray-600 text-xs sm:text-sm font-semibold truncate">Students</p>
                      <p className="text-gray-900 font-bold text-sm sm:text-base truncate">
                        {course.students?.length || 0} enrolled
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Card - Enhanced with better sizing */}
            <div className="w-full lg:w-auto lg:min-w-[320px] flex-shrink-0">
              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-gray-200">
                <div className="text-center">
                  <div className="mb-4 sm:mb-6">
                    <p className="text-gray-600 text-xs sm:text-sm font-semibold uppercase tracking-wide mb-1">
                      {course.price > 0 ? "Course Fee" : "Free Course"}
                    </p>
                    {course.price > 0 ? (
                      <div className="text-3xl sm:text-4xl font-bold text-blue-600 flex items-center justify-center gap-1 sm:gap-2">
                        <i className="fas fa-rupee-sign text-xl sm:text-2xl"></i>
                        {course.price}
                      </div>
                    ) : (
                      <div className="text-3xl sm:text-4xl font-bold text-green-600">FREE</div>
                    )}
                  </div>

                  {isEnrolled ? (
                    <button
                      onClick={() => navigate(`/course/${courseId}`)}
                      className="w-full py-3 sm:py-3.5 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                      <i className="fas fa-play-circle text-base"></i>
                      Continue Learning
                    </button>
                  ) : (
                    <RazorpayPayment
                      course={course}
                      student={user}
                      onPaymentSuccess={handleEnrollmentSuccess}
                      onPaymentCancel={() => {}}
                    />
                  )}
                </div>

                {/* Course Features */}
                <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                  <p className="text-gray-600 text-xs sm:text-sm font-semibold uppercase tracking-wide mb-2 sm:mb-3">
                    What You Get
                  </p>
                  <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                    <li className="flex items-center gap-2 text-gray-700">
                      <i className="fas fa-check text-green-600 text-xs"></i>
                      Lifetime access
                    </li>
                    <li className="flex items-center gap-2 text-gray-700">
                      <i className="fas fa-check text-green-600 text-xs"></i>
                      Certificate on completion
                    </li>
                    <li className="flex items-center gap-2 text-gray-700">
                      <i className="fas fa-check text-green-600 text-xs"></i>
                      24/7 support
                    </li>
                    <li className="flex items-center gap-2 text-gray-700">
                      <i className="fas fa-check text-green-600 text-xs"></i>
                      Mobile & TV access
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-4 sm:mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-2 sm:space-x-4 lg:space-x-8 px-3 sm:px-4 lg:px-6 overflow-x-auto">
              {[
                { id: "overview", name: "Overview", icon: "fas fa-info-circle" },
                { id: "curriculum", name: "Curriculum", icon: "fas fa-book" },
                { id: "includes", name: "What's Included", icon: "fas fa-check-circle" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm flex items-center gap-1 sm:gap-2 flex-shrink-0 ${
                    activeTab === tab.id
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <i className={tab.icon}></i>
                  <span className="hidden sm:inline">{tab.name}</span>
                  <span className="sm:hidden">{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-3 sm:p-4 lg:p-6">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                    <i className="fas fa-info-circle text-blue-600 text-lg sm:text-xl"></i>
                    Course Overview
                  </h2>
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
                    <p className="text-gray-700 text-sm sm:text-base leading-relaxed">{course.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  {/* Course Details Card */}
                  <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                      <i className="fas fa-clipboard-list text-blue-600 text-base sm:text-lg"></i>
                      Course Details
                    </h3>
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex justify-between items-center py-2 border-b border-gray-200 min-w-0">
                        <div className="flex items-center gap-2 min-w-0">
                          <i className="fas fa-user text-gray-400 text-sm flex-shrink-0"></i>
                          <span className="text-gray-600 text-sm sm:text-base truncate">Instructor</span>
                        </div>
                        <span className="font-semibold text-gray-900 text-sm sm:text-base truncate ml-2" title={course.faculty?.name || "N/A"}>
                          {course.faculty?.name || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                          <i className="fas fa-clock text-gray-400 text-sm"></i>
                          <span className="text-gray-600 text-sm sm:text-base">Duration</span>
                        </div>
                        <span className="font-semibold text-gray-900 text-sm sm:text-base truncate">{course.duration}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                          <i className="fas fa-chart-line text-gray-400 text-sm"></i>
                          <span className="text-gray-600 text-sm sm:text-base">Level</span>
                        </div>
                        <span className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                          {course.courseLevel || "All Levels"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                          <i className="fas fa-tag text-gray-400 text-sm"></i>
                          <span className="text-gray-600 text-sm sm:text-base">Category</span>
                        </div>
                        <span className="font-semibold text-gray-900 text-sm sm:text-base truncate">{course.category}</span>
                      </div>
                    </div>
                  </div>

                  {/* Prerequisites Card */}
                  <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                      <i className="fas fa-book text-green-600 text-base sm:text-lg"></i>
                      Prerequisites
                    </h3>
                    <div className="bg-green-50 border border-green-100 rounded-lg p-3 sm:p-4">
                      <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                        {course.prerequisites || "No specific prerequisites required. Suitable for beginners."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* What You Will Learn */}
                {course.whatYouWillLearn && course.whatYouWillLearn.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                      <i className="fas fa-graduation-cap text-purple-600 text-base sm:text-lg"></i>
                      What You Will Learn
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {course.whatYouWillLearn.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                          <i className="fas fa-check text-green-600 mt-0.5 flex-shrink-0"></i>
                          <span className="text-gray-700 text-sm sm:text-base break-words">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Curriculum Tab */}
            {activeTab === "curriculum" && (
              <div className="space-y-4 sm:space-y-6">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                  <i className="fas fa-book text-blue-600 text-lg sm:text-xl"></i>
                  Course Curriculum
                </h2>
                {course.curriculum && course.curriculum.length > 0 ? (
                  <div className="space-y-3 sm:space-y-4">
                    {course.curriculum.map((module, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 transition">
                        <div className="bg-blue-50 p-3 sm:p-4 flex items-center gap-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <i className="fas fa-folder text-blue-600 text-sm sm:text-base"></i>
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{module.module}</h3>
                            <p className="text-gray-600 text-xs sm:text-sm">
                              {module.topics.length} topics
                            </p>
                          </div>
                        </div>
                        <ul className="p-3 sm:p-4 space-y-2">
                          {module.topics.map((topic, topicIdx) => (
                            <li key={topicIdx} className="flex items-center gap-3 text-gray-700 p-2 hover:bg-gray-50 rounded-lg">
                              <i className="fas fa-play-circle text-blue-400 text-sm flex-shrink-0"></i>
                              <span className="text-sm sm:text-base break-words">{topic}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 sm:py-12">
                    <i className="fas fa-book-open text-4xl sm:text-6xl mb-3 sm:mb-4 text-gray-300"></i>
                    <div className="text-gray-600 text-base sm:text-lg mb-2">Curriculum details coming soon...</div>
                    <p className="text-gray-500 text-sm sm:text-base">The instructor is preparing the course content</p>
                  </div>
                )}
              </div>
            )}

            {/* What's Included Tab */}
            {activeTab === "includes" && (
              <div className="space-y-4 sm:space-y-6">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                  <i className="fas fa-gift text-green-600 text-lg sm:text-xl"></i>
                  What's Included in This Course
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {course.courseIncludes && (
                    <>
                      {course.courseIncludes.videos && (
                        <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-sm transition">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <i className="fas fa-video text-blue-600 text-lg sm:text-xl"></i>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">HD Video Lectures</p>
                            </div>
                          </div>
                          <p className="text-gray-600 text-xs sm:text-sm">High-quality recorded content for flexible learning</p>
                        </div>
                      )}
                      {course.courseIncludes.liveLectures && (
                        <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-green-300 hover:shadow-sm transition">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <i className="fas fa-broadcast-tower text-green-600 text-lg sm:text-xl"></i>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">Live Lectures</p>
                            </div>
                          </div>
                          <p className="text-gray-600 text-xs sm:text-sm">Interactive sessions with instructor</p>
                        </div>
                      )}
                      {course.courseIncludes.pdfs && (
                        <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-purple-300 hover:shadow-sm transition">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <i className="fas fa-file-pdf text-purple-600 text-lg sm:text-xl"></i>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">Study Materials</p>
                            </div>
                          </div>
                          <p className="text-gray-600 text-xs sm:text-sm">Downloadable PDF notes and resources</p>
                        </div>
                      )}
                      {course.courseIncludes.quizzes && (
                        <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-yellow-300 hover:shadow-sm transition">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <i className="fas fa-question-circle text-yellow-600 text-lg sm:text-xl"></i>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">Quizzes</p>
                            </div>
                          </div>
                          <p className="text-gray-600 text-xs sm:text-sm">Self-assessment tests for knowledge check</p>
                        </div>
                      )}
                      {course.courseIncludes.assignments && (
                        <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-pink-300 hover:shadow-sm transition">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <i className="fas fa-tasks text-pink-600 text-lg sm:text-xl"></i>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">Assignments</p>
                            </div>
                          </div>
                          <p className="text-gray-600 text-xs sm:text-sm">Practical exercises to apply knowledge</p>
                        </div>
                      )}
                      {course.courseIncludes.certificates && (
                        <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-red-300 hover:shadow-sm transition">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <i className="fas fa-certificate text-red-600 text-lg sm:text-xl"></i>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">Certificate</p>
                            </div>
                          </div>
                          <p className="text-gray-600 text-xs sm:text-sm">Official certificate upon completion</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Enrollment CTA - Fixed sizing issue */}
        {!isEnrolled && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4 sm:p-6 text-center">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                Ready to start learning?
              </h3>
              <p className="text-gray-700 text-sm sm:text-base mb-4 sm:mb-6 max-w-lg mx-auto">
                Enroll now and get instant access to all course materials
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <RazorpayPayment
                  course={course}
                  student={user}
                  onPaymentSuccess={handleEnrollmentSuccess}
                  onPaymentCancel={() => {}}
                  className="w-full sm:w-auto"
                />
                <button
                  onClick={handleBack}
                  className="w-full sm:w-auto px-6 py-2.5 sm:py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition font-semibold text-sm sm:text-base whitespace-nowrap"
                >
                  Browse More Courses
                </button>
              </div>
              <p className="text-gray-500 text-xs sm:text-sm mt-4 sm:mt-6">
                <i className="fas fa-shield-alt text-green-600 mr-1"></i>
                {/* Changed from 30-day to 7-day */}
                7-day money-back guarantee • Lifetime access • Certificate included
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}