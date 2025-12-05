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
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center overflow-hidden">
                <img
                  src={logo || "/placeholder.svg"}
                  alt="Biology.Trunk Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-gray-900 font-bold text-lg sm:text-xl">Biology.Trunk</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={onLogout}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold text-sm sm:text-base"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <button
          onClick={handleBack}
          className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
        >
          <i className="fas fa-arrow-left"></i>
          Back to Courses
        </button>

        {/* Course Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 sm:p-8 mb-6 sm:mb-8 border border-blue-200">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-6">
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 text-balance">
                {course.title}
              </h1>
              <p className="text-gray-700 text-base sm:text-lg mb-4">{course.description}</p>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-4 text-sm sm:text-base">
                <div className="flex items-center gap-2">
                  <i className="fas fa-user text-blue-600"></i>
                  <span className="text-gray-700">
                    Instructor: <strong>{course.faculty?.name || "N/A"}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fas fa-clock text-green-600"></i>
                  <span className="text-gray-700">
                    Duration: <strong>{course.duration}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fas fa-users text-purple-600"></i>
                  <span className="text-gray-700">
                    Students: <strong>{course.students?.length || 0}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Price Card */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 w-full sm:w-auto">
              <div className="text-center">
                {course.price > 0 ? (
                  <>
                    <p className="text-gray-600 text-sm font-semibold mb-2">Price</p>
                    <div className="text-4xl font-bold text-blue-600 mb-4">₹{course.price}</div>
                  </>
                ) : (
                  <p className="text-2xl font-bold text-green-600 mb-4">FREE</p>
                )}

                {isEnrolled ? (
                  <button
                    onClick={() => navigate(`/course/${courseId}`)}
                    className="w-full py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition flex items-center justify-center gap-2"
                  >
                    <i className="fas fa-play-circle"></i>
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
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-6 px-6 overflow-x-auto">
              {[
                { id: "overview", name: "Overview", icon: "fas fa-info-circle" },
                { id: "curriculum", name: "Curriculum", icon: "fas fa-book" },
                { id: "includes", name: "What's Included", icon: "fas fa-check-circle" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium flex items-center gap-2 text-sm transition ${
                    activeTab === tab.id
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <i className={tab.icon}></i>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6 sm:p-8">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Overview</h2>
                  <p className="text-gray-700 leading-relaxed mb-6">{course.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <i className="fas fa-info-circle text-blue-600"></i>
                      Course Details
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-600">Instructor:</span>
                        <span className="font-medium text-gray-900">{course.faculty?.name || "N/A"}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium text-gray-900">{course.duration}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-600">Level:</span>
                        <span className="font-medium text-gray-900">{course.courseLevel}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-600">Category:</span>
                        <span className="font-medium text-gray-900">{course.category}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <i className="fas fa-book text-green-600"></i>
                      Prerequisites
                    </h3>
                    <p className="text-gray-700 leading-relaxed">{course.prerequisites}</p>
                  </div>
                </div>

                {course.whatYouWillLearn && course.whatYouWillLearn.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <i className="fas fa-graduation-cap text-purple-600"></i>
                      What You Will Learn
                    </h3>
                    <ul className="space-y-2">
                      {course.whatYouWillLearn.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-gray-700">
                          <i className="fas fa-check text-green-600 mt-1 flex-shrink-0"></i>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Curriculum Tab */}
            {activeTab === "curriculum" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Curriculum</h2>
                {course.curriculum && course.curriculum.length > 0 ? (
                  <div className="space-y-4">
                    {course.curriculum.map((module, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-blue-50 p-4 flex items-center gap-3">
                          <i className="fas fa-folder text-blue-600"></i>
                          <h3 className="font-semibold text-gray-900">{module.module}</h3>
                        </div>
                        <ul className="p-4 space-y-2">
                          {module.topics.map((topic, topicIdx) => (
                            <li key={topicIdx} className="flex items-center gap-3 text-gray-700">
                              <i className="fas fa-file text-gray-400 text-sm"></i>
                              {topic}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">Curriculum details coming soon...</p>
                )}
              </div>
            )}

            {/* What's Included Tab */}
            {activeTab === "includes" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">What's Included in This Course</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {course.courseIncludes && (
                    <>
                      {course.courseIncludes.videos && (
                        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                          <i className="fas fa-video text-blue-600 text-xl"></i>
                          <div>
                            <p className="font-semibold text-gray-900">HD Video Lectures</p>
                            <p className="text-sm text-gray-600">High-quality recorded content</p>
                          </div>
                        </div>
                      )}
                      {course.courseIncludes.liveLectures && (
                        <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                          <i className="fas fa-broadcast-tower text-green-600 text-xl"></i>
                          <div>
                            <p className="font-semibold text-gray-900">Live Lectures</p>
                            <p className="text-sm text-gray-600">Interactive sessions with instructor</p>
                          </div>
                        </div>
                      )}
                      {course.courseIncludes.pdfs && (
                        <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                          <i className="fas fa-file-pdf text-purple-600 text-xl"></i>
                          <div>
                            <p className="font-semibold text-gray-900">Study Materials</p>
                            <p className="text-sm text-gray-600">PDF notes and resources</p>
                          </div>
                        </div>
                      )}
                      {course.courseIncludes.quizzes && (
                        <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg">
                          <i className="fas fa-question-circle text-yellow-600 text-xl"></i>
                          <div>
                            <p className="font-semibold text-gray-900">Quizzes</p>
                            <p className="text-sm text-gray-600">Self-assessment tests</p>
                          </div>
                        </div>
                      )}
                      {course.courseIncludes.assignments && (
                        <div className="flex items-center gap-3 p-4 bg-pink-50 rounded-lg">
                          <i className="fas fa-tasks text-pink-600 text-xl"></i>
                          <div>
                            <p className="font-semibold text-gray-900">Assignments</p>
                            <p className="text-sm text-gray-600">Practical exercises</p>
                          </div>
                        </div>
                      )}
                      {course.courseIncludes.certificates && (
                        <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
                          <i className="fas fa-certificate text-red-600 text-xl"></i>
                          <div>
                            <p className="font-semibold text-gray-900">Certificate</p>
                            <p className="text-sm text-gray-600">After course completion</p>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Enrollment CTA */}
        {!isEnrolled && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 sm:p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to start learning?</h3>
            <p className="text-gray-700 mb-6">Enroll now and get access to all course materials and features</p>
            <RazorpayPayment
              course={course}
              student={user}
              onPaymentSuccess={handleEnrollmentSuccess}
              onPaymentCancel={() => {}}
            />
          </div>
        )}
      </div>
    </div>
  )
}
