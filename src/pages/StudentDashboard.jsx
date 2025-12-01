"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import axios from "axios"

const API_URL = "https://biology-trunk-server.vercel.app/api"
const ITEMS_PER_PAGE = 9

export default function StudentDashboard({ user, onLogout }) {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(() => {
    return localStorage.getItem("studentDashboardCategory") || searchParams.get("category") || ""
  })
  const [loading, setLoading] = useState(true)
  const [enrollmentLoading, setEnrollmentLoading] = useState({})
  const [searchTerm, setSearchTerm] = useState(() => {
    return localStorage.getItem("studentDashboardSearch") || ""
  })
  const [currentPage, setCurrentPage] = useState(() => {
    return Number.parseInt(localStorage.getItem("studentDashboardPage")) || 1
  })
  const [totalPages, setTotalPages] = useState(1)
  const [notifications, setNotifications] = useState([])
  const [showNotificationModal, setShowNotificationModal] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState(null)
  const [activeTab, setActiveTab] = useState("discover")
  const [learningStats, setLearningStats] = useState({
    totalHours: 45,
    completedCourses: 3,
    certificates: 2,
    streakDays: 7
  })

  const categories = ["Class 9", "Class 10", "Class 11", "Class 12", "JEE", "GUJCET", "NEET"]

  useEffect(() => {
    localStorage.setItem("lastPath", window.location.pathname)
    localStorage.setItem("studentDashboardCategory", selectedCategory)
    localStorage.setItem("studentDashboardPage", currentPage.toString())
    localStorage.setItem("studentDashboardSearch", searchTerm)
  }, [selectedCategory, currentPage, searchTerm])

  useEffect(() => {
    fetchCourses(currentPage)
    fetchEnrolledCourses()
    fetchNotifications()
  }, [selectedCategory])

  const fetchCourses = async (page) => {
    try {
      const url = selectedCategory
        ? `${API_URL}/courses/category/${selectedCategory}?page=${page}&limit=${ITEMS_PER_PAGE}`
        : `${API_URL}/courses?page=${page}&limit=${ITEMS_PER_PAGE}`
      const response = await axios.get(url)

      // Handle both paginated and non-paginated responses
      if (response.data.courses) {
        setCourses(response.data.courses)
        setTotalPages(response.data.pages)
      } else {
        setCourses(response.data)
        setTotalPages(1)
      }

      setCurrentPage(page)
      setLoading(false)
    } catch (error) {
      console.error("Failed to fetch courses:", error)
      setLoading(false)
    }
  }

  const fetchEnrolledCourses = async () => {
    try {
      const response = await axios.get(`${API_URL}/enrollments/student/${user._id}`)
      const enrolledIds = response.data.map((e) => e.course._id)
      setEnrolledCourses(enrolledIds)
    } catch (error) {
      console.error("Failed to fetch enrolled courses:", error)
    }
  }

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`${API_URL}/notifications/user/${user._id}`)
      setNotifications(response.data.filter((n) => !n.read))
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
    }
  }

  const markNotificationAsRead = async (notificationId) => {
    try {
      await axios.put(`${API_URL}/notifications/${notificationId}`)
      setNotifications((prev) => prev.filter((n) => n._id !== notificationId))
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
    }
  }

  const handleEnroll = async (courseId) => {
    setEnrollmentLoading((prev) => ({ ...prev, [courseId]: true }))
    try {
      await axios.post(`${API_URL}/enrollments`, {
        student: user._id,
        course: courseId,
        paymentStatus: "completed",
      })
      setEnrolledCourses((prev) => [...prev, courseId])
      alert("Enrolled successfully!")
      fetchCourses(currentPage)
    } catch (error) {
      alert(error.response?.data?.message || "Enrollment failed")
    } finally {
      setEnrollmentLoading((prev) => ({ ...prev, [courseId]: false }))
    }
  }

  const handleViewCourse = (courseId) => {
    if (enrolledCourses.includes(courseId)) {
      navigate(`/course/${courseId}`)
    } else {
      alert("Please enroll in this course first to view content")
    }
  }

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md">
                <i className="fas fa-graduation-cap text-white text-lg"></i>
              </div>
              <div>
                <span className="text-gray-900 font-bold text-xl">EduTech Student</span>
                <p className="text-xs text-gray-500">Welcome back, {user.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  onClick={() => setShowNotificationModal(true)}
                  className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <i className="fas fa-bell text-xl"></i>
                  {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>
              </div>
              <button
                onClick={onLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold flex items-center gap-2"
              >
                <i className="fas fa-sign-out-alt"></i>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Courses Enrolled</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{enrolledCourses.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-book-open text-blue-600 text-xl"></i>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Active learning courses</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Learning Hours</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{learningStats.totalHours}+</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-clock text-green-600 text-xl"></i>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Total study time</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Certificates</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{learningStats.certificates}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-award text-purple-600 text-xl"></i>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Achievements earned</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Current Streak</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{learningStats.streakDays} days</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-fire text-orange-600 text-xl"></i>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Keep learning!</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: "discover", name: "Discover Courses", icon: "fas fa-compass" },
                { id: "my-courses", name: "My Courses", icon: "fas fa-book" },
                { id: "progress", name: "Progress", icon: "fas fa-chart-line" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
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

          <div className="p-6">
            {/* Discover Courses Tab */}
            {activeTab === "discover" && (
              <div className="space-y-6">
                {/* Header Section */}
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Premium Courses</h1>
                  <p className="text-gray-600 mb-6">Find and enroll in courses that match your learning goals</p>

                  {/* Search Bar */}
                  <div className="relative">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search courses by title, description, or faculty..."
                      className="w-full pl-12 pr-6 py-4 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                    />
                    <i className="fas fa-search absolute left-4 top-4 text-gray-400 text-lg"></i>
                  </div>
                </div>

                {/* Category Filter */}
                <div className="mb-8">
                  <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide mb-4 flex items-center gap-2">
                    <i className="fas fa-filter"></i>
                    Filter by Category
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => {
                        setSelectedCategory("")
                        setCurrentPage(1)
                      }}
                      className={`px-5 py-3 rounded-xl transition font-medium flex items-center gap-2 ${
                        selectedCategory === ""
                          ? "bg-blue-600 text-white shadow-lg"
                          : "bg-white text-gray-700 border border-gray-300 hover:border-blue-500 hover:shadow-md"
                      }`}
                    >
                      <i className="fas fa-th-large"></i>
                      All Courses
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setSelectedCategory(cat)
                          setCurrentPage(1)
                        }}
                        className={`px-5 py-3 rounded-xl transition font-medium flex items-center gap-2 ${
                          selectedCategory === cat
                            ? "bg-blue-600 text-white shadow-lg"
                            : "bg-white text-gray-700 border border-gray-300 hover:border-blue-500 hover:shadow-md"
                        }`}
                      >
                        <i className="fas fa-tag"></i>
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Courses Grid */}
                {loading ? (
                  <div className="text-center py-20">
                    <i className="fas fa-spinner fa-spin text-4xl mb-4 text-blue-600"></i>
                    <div className="text-gray-600 text-xl">Loading courses...</div>
                  </div>
                ) : filteredCourses.length === 0 ? (
                  <div className="text-center py-20">
                    <i className="fas fa-search text-6xl mb-4 text-gray-300"></i>
                    <div className="text-gray-600 text-xl mb-2">No courses found</div>
                    <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                      {filteredCourses.map((course) => (
                        <div
                          key={course._id}
                          className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-blue-600 hover:shadow-2xl transition-all duration-300 group"
                        >
                          {/* Course Image/Header */}
                          <div className="h-40 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition"></div>
                            <i className="fas fa-graduation-cap text-white text-4xl relative z-10"></i>
                            {enrolledCourses.includes(course._id) && (
                              <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                <i className="fas fa-check"></i>
                                Enrolled
                              </div>
                            )}
                          </div>

                          {/* Course Content */}
                          <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>

                            {/* Course Meta */}
                            <div className="flex justify-between items-center mb-4 py-3 border-y border-gray-200">
                              <div>
                                <span className="text-blue-600 text-sm font-semibold bg-blue-50 px-3 py-1 rounded-full flex items-center gap-1">
                                  <i className="fas fa-tag"></i>
                                  {course.category}
                                </span>
                              </div>
                              <span className="text-lg font-bold text-gray-900 flex items-center gap-1">
                                <i className="fas fa-rupee-sign"></i>
                                {course.price}
                              </span>
                            </div>

                            {/* Student Count */}
                            <div className="text-sm text-gray-600 mb-4 flex items-center gap-2">
                              <i className="fas fa-users"></i>
                              {course.students?.length || 0} students enrolled
                            </div>

                            {/* Buttons */}
                            {enrolledCourses.includes(course._id) ? (
                              <button
                                onClick={() => handleViewCourse(course._id)}
                                className="w-full py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition flex items-center justify-center gap-2"
                              >
                                <i className="fas fa-play-circle"></i>
                                Continue Learning
                              </button>
                            ) : (
                              <button
                                onClick={() => handleEnroll(course._id)}
                                disabled={enrollmentLoading[course._id]}
                                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                              >
                                {enrollmentLoading[course._id] ? (
                                  <>
                                    <i className="fas fa-spinner fa-spin"></i>
                                    Enrolling...
                                  </>
                                ) : (
                                  <>
                                    <i className="fas fa-shopping-cart"></i>
                                    Enroll Now
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex justify-center items-center gap-2 mb-10">
                        <button
                          onClick={() => fetchCourses(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 flex items-center gap-2"
                        >
                          <i className="fas fa-chevron-left"></i>
                          Previous
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => fetchCourses(page)}
                            className={`px-4 py-2 rounded-lg transition flex items-center gap-1 ${
                              page === currentPage ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                        <button
                          onClick={() => fetchCourses(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 flex items-center gap-2"
                        >
                          Next
                          <i className="fas fa-chevron-right"></i>
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* My Courses Tab */}
            {activeTab === "my-courses" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Learning Journey</h2>
                
                {enrolledCourses.length === 0 ? (
                  <div className="text-center py-16">
                    <i className="fas fa-book-open text-6xl mb-4 text-gray-300"></i>
                    <div className="text-gray-600 text-xl mb-4">You haven't enrolled in any courses yet</div>
                    <p className="text-gray-500 mb-6">Start your learning journey by exploring our courses</p>
                    <button
                      onClick={() => setActiveTab("discover")}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold flex items-center gap-2 mx-auto"
                    >
                      <i className="fas fa-compass"></i>
                      Explore Courses
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses
                      .filter((course) => enrolledCourses.includes(course._id))
                      .map((course) => (
                        <div
                          key={course._id}
                          className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-green-600/50 rounded-xl p-6 hover:shadow-xl transition-all duration-300"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                              <i className="fas fa-check text-green-600 text-xl"></i>
                            </div>
                            <span className="text-green-600 font-bold flex items-center gap-1">
                              <i className="fas fa-circle"></i>
                              Active
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                          
                          <div className="mb-4">
                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                              <span>Progress</span>
                              <span>65%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-green-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                            </div>
                          </div>

                          <button
                            onClick={() => handleViewCourse(course._id)}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2"
                          >
                            <i className="fas fa-play"></i>
                            Continue Learning
                          </button>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

            {/* Progress Tab */}
            {activeTab === "progress" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Learning Progress</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Progress Overview */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <i className="fas fa-chart-bar text-blue-600"></i>
                      Learning Analytics
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Courses Completed</span>
                        <span className="font-semibold text-green-600">{learningStats.completedCourses}/5</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Average Score</span>
                        <span className="font-semibold text-blue-600">87%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Study Streak</span>
                        <span className="font-semibold text-orange-600">{learningStats.streakDays} days</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Time Spent</span>
                        <span className="font-semibold text-purple-600">{learningStats.totalHours} hours</span>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <i className="fas fa-history text-green-600"></i>
                      Recent Activity
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <i className="fas fa-video text-blue-600"></i>
                        <div>
                          <p className="font-medium text-gray-900">Watched: Algebra Basics</p>
                          <p className="text-sm text-gray-600">2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                        <i className="fas fa-check-circle text-green-600"></i>
                        <div>
                          <p className="font-medium text-gray-900">Completed: Physics Quiz</p>
                          <p className="text-sm text-gray-600">1 day ago</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                        <i className="fas fa-book text-purple-600"></i>
                        <div>
                          <p className="font-medium text-gray-900">Enrolled: Chemistry Advanced</p>
                          <p className="text-sm text-gray-600">3 days ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Achievement Badges */}
                <div className="mt-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <i className="fas fa-trophy text-yellow-600"></i>
                    Your Achievements
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { name: "Quick Learner", icon: "fas fa-bolt", color: "yellow" },
                      { name: "Perfect Score", icon: "fas fa-star", color: "gold" },
                      { name: "Week Warrior", icon: "fas fa-calendar", color: "blue" },
                      { name: "Course Master", icon: "fas fa-graduation-cap", color: "purple" }
                    ].map((badge, index) => (
                      <div key={index} className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className={`w-12 h-12 ${getBadgeColor(badge.color)} rounded-full flex items-center justify-center mx-auto mb-2`}>
                          <i className={`${badge.icon} text-white text-lg`}></i>
                        </div>
                        <p className="text-sm font-medium text-gray-900">{badge.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notification Modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-96 overflow-y-auto">
            {selectedNotification ? (
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{selectedNotification.title}</h3>
                  <button
                    onClick={() => setSelectedNotification(null)}
                    className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                  >
                    ×
                  </button>
                </div>
                <p className="text-gray-700 mb-4">{selectedNotification.message}</p>
                <div className="text-sm text-gray-500 mb-4 flex items-center gap-2">
                  <i className="fas fa-clock"></i>
                  {new Date(selectedNotification.createdAt).toLocaleString()}
                </div>
                {selectedNotification.course && (
                  <div className="bg-blue-50 p-3 rounded-lg text-sm text-gray-700 flex items-center gap-2">
                    <i className="fas fa-book text-blue-600"></i>
                    Course: {selectedNotification.course?.title}
                  </div>
                )}
                <button
                  onClick={() => markNotificationAsRead(selectedNotification._id)}
                  className="w-full mt-4 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold flex items-center justify-center gap-2"
                >
                  <i className="fas fa-check"></i>
                  Mark as Read
                </button>
              </div>
            ) : (
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <i className="fas fa-bell text-blue-600"></i>
                    Course Updates ({notifications.length})
                  </h3>
                  <button
                    onClick={() => setShowNotificationModal(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                  >
                    ×
                  </button>
                </div>
                {notifications.length > 0 ? (
                  <div className="space-y-3">
                    {notifications.map((notif) => (
                      <button
                        key={notif._id}
                        onClick={() => setSelectedNotification(notif)}
                        className="w-full text-left p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition"
                      >
                        <div className="font-semibold text-gray-900 flex items-center gap-2">
                          <i className="fas fa-bullhorn text-blue-600"></i>
                          {notif.title}
                        </div>
                        <div className="text-sm text-gray-700 mt-1">{notif.message}</div>
                        {notif.course && (
                          <div className="text-xs text-blue-600 font-semibold mt-2 flex items-center gap-1">
                            <i className="fas fa-book"></i>
                            Course: {notif.course?.title}
                          </div>
                        )}
                        <div className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                          <i className="fas fa-clock"></i>
                          {new Date(notif.createdAt).toLocaleDateString()}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <i className="fas fa-bell-slash text-3xl mb-2"></i>
                    <p>No new course updates</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// Helper function for badge colors
function getBadgeColor(color) {
  const colors = {
    yellow: 'bg-yellow-500',
    gold: 'bg-yellow-600',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500'
  }
  return colors[color] || 'bg-gray-500'
}