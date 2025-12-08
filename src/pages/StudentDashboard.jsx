"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { API_URL } from "../utils/api.js"
import { useNavigate } from "react-router-dom"
import { useLocation } from "react-router-dom"
import logo from "../assets/biology-trunk-logo.png" // Add logo import
import { showErrorToast, showWarningToast } from "../utils/toast.js"

const ITEMS_PER_PAGE = 9

export default function StudentDashboard({ user, onLogout }) {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [enrolledCoursesData, setEnrolledCoursesData] = useState([]) // New state for enrolled courses data
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
    streakDays: 7,
  })

  const categories = ["Class 9", "Class 10", "Class 11", "Class 12", "JEE", "NEET"]

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
      showErrorToast("Failed to load courses")
      setLoading(false)
    }
  }

  const fetchEnrolledCourses = async () => {
    try {
      const response = await axios.get(`${API_URL}/enrollments/student/${user._id}`)
      const enrolledIds = response.data.map((e) => e.course._id)
      const enrolledCoursesData = response.data.map((e) => e.course) // Get full course data
      setEnrolledCourses(enrolledIds)
      setEnrolledCoursesData(enrolledCoursesData) // Store enrolled courses data
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

  const handleEnrollmentSuccess = async (paymentData) => {
    // Refresh enrolled courses
    fetchCourses(currentPage)
    // Optional: navigate to course if desired
  }

  const handleViewCourse = (courseId) => {
    if (enrolledCourses.includes(courseId)) {
      navigate(`/course/${courseId}`)
    } else {
      showWarningToast("Please enroll in this course first to view content")
    }
  }

  const handleViewDetails = (courseId) => {
    sessionStorage.setItem("previousPath", window.location.pathname)
    navigate(`/course-preview/${courseId}`)
  }

  const handleCloseNotificationModal = async () => {
    if (notifications.length > 0) {
      try {
        // Mark all visible notifications as read when closing modal
        await Promise.all(
          notifications.map((n) =>
            axios.put(`${API_URL}/notifications/${n._id}`).catch((err) => {
              console.error(`Failed to mark notification ${n._id} as read:`, err)
            }),
          ),
        )
        setNotifications([])
      } catch (error) {
        console.error("Error closing notification modal:", error)
      }
    }
    setShowNotificationModal(false)
    setSelectedNotification(null)
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
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Logo - Same as Home page */}
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center overflow-hidden">
                <img
                  src={logo || "/placeholder.svg"}
                  alt="Biology.Trunk Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="hidden sm:block">
                <span className="text-gray-900 font-bold text-lg sm:text-xl">Biology.Trunk</span>
                <p className="text-xs text-gray-500">Welcome back, {user.name}</p>
              </div>
              <div className="sm:hidden">
                <span className="text-gray-900 font-bold text-base">Student</span>
                <p className="text-xs text-gray-500">Hi, {user.name.split(" ")[0]}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="relative">
                <button
                  onClick={() => setShowNotificationModal(true)}
                  className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <i className="fas fa-bell text-lg sm:text-xl"></i>
                  {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 sm:w-5 sm:h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>
              </div>
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
        {/* Dashboard Stats - Made responsive */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm font-semibold uppercase tracking-wide">Courses</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">
                  {enrolledCourses.length}
                </p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-book-open text-blue-600 text-sm sm:text-base lg:text-xl"></i>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1 sm:mt-2">Active courses</p>
          </div>

          <div className="bg-white rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm font-semibold uppercase tracking-wide">Hours</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">
                  {learningStats.totalHours}+
                </p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-clock text-green-600 text-sm sm:text-base lg:text-xl"></i>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1 sm:mt-2">Study time</p>
          </div>

          <div className="bg-white rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm font-semibold uppercase tracking-wide">Certificates</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">
                  {learningStats.certificates}
                </p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-award text-purple-600 text-sm sm:text-base lg:text-xl"></i>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1 sm:mt-2">Achievements</p>
          </div>

          <div className="bg-white rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm font-semibold uppercase tracking-wide">Streak</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">
                  {learningStats.streakDays} days
                </p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-fire text-orange-600 text-sm sm:text-base lg:text-xl"></i>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1 sm:mt-2">Keep learning!</p>
          </div>
        </div>

        {/* Navigation Tabs - Made responsive */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-4 sm:mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-2 sm:space-x-4 lg:space-x-8 px-3 sm:px-4 lg:px-6 overflow-x-auto">
              {[
                { id: "discover", name: "Discover", icon: "fas fa-compass" },
                { id: "my-courses", name: "My Courses", icon: "fas fa-book" },
                { id: "progress", name: "Progress", icon: "fas fa-chart-line" },
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
            {/* Discover Courses Tab */}
            {activeTab === "discover" && (
              <div className="space-y-4 sm:space-y-6">
                {/* Header Section */}
                <div className="mb-4 sm:mb-6 lg:mb-8">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
                    Discover Premium Courses
                  </h1>
                  <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-6">
                    Find courses matching your learning goals
                  </p>

                  {/* Search Bar */}
                  <div className="relative">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search courses..."
                      className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 lg:py-4 bg-white border border-gray-300 rounded-lg sm:rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition text-sm sm:text-base"
                    />
                    <i className="fas fa-search absolute left-3 sm:left-4 top-2.5 sm:top-3.5 lg:top-4 text-gray-400 text-sm sm:text-base"></i>
                  </div>
                </div>

                {/* Category Filter */}
                <div className="mb-4 sm:mb-6 lg:mb-8">
                  <p className="text-gray-600 text-xs sm:text-sm font-semibold uppercase tracking-wide mb-2 sm:mb-4 flex items-center gap-1 sm:gap-2">
                    <i className="fas fa-filter text-xs sm:text-sm"></i>
                    Filter by Category
                  </p>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    <button
                      onClick={() => {
                        setSelectedCategory("")
                        setCurrentPage(1)
                      }}
                      className={`px-3 sm:px-4 lg:px-5 py-2 sm:py-3 rounded-lg sm:rounded-xl transition font-medium flex items-center gap-1 sm:gap-2 text-xs sm:text-sm ${
                        selectedCategory === ""
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-white text-gray-700 border border-gray-300 hover:border-blue-500 hover:shadow-sm"
                      }`}
                    >
                      <i className="fas fa-th-large text-xs sm:text-sm"></i>
                      All
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setSelectedCategory(cat)
                          setCurrentPage(1)
                        }}
                        className={`px-3 sm:px-4 lg:px-5 py-2 sm:py-3 rounded-lg sm:rounded-xl transition font-medium flex items-center gap-1 sm:gap-2 text-xs sm:text-sm ${
                          selectedCategory === cat
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-white text-gray-700 border border-gray-300 hover:border-blue-500 hover:shadow-sm"
                        }`}
                      >
                        <i className="fas fa-tag text-xs sm:text-sm"></i>
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Courses Grid */}
                {loading ? (
                  <div className="text-center py-12 sm:py-16 lg:py-20">
                    <i className="fas fa-spinner fa-spin text-3xl sm:text-4xl mb-3 sm:mb-4 text-blue-600"></i>
                    <div className="text-gray-600 text-base sm:text-lg">Loading courses...</div>
                  </div>
                ) : filteredCourses.length === 0 ? (
                  <div className="text-center py-12 sm:py-16 lg:py-20">
                    <i className="fas fa-search text-4xl sm:text-6xl mb-3 sm:mb-4 text-gray-300"></i>
                    <div className="text-gray-600 text-base sm:text-lg mb-2">No courses found</div>
                    <p className="text-gray-500 text-sm sm:text-base">Try adjusting your search</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 mb-6 sm:mb-8">
                      {filteredCourses.map((course) => (
                        <div
                          key={course._id}
                          className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-blue-600 hover:shadow-lg transition-all duration-300 group flex flex-col h-full"
                        >
                          {/* Course Image/Header - Updated with white background and logo */}
                          <div className="h-28 sm:h-32 lg:h-36 bg-white border-b border-gray-200 flex items-center justify-center relative overflow-hidden">
                            <img
                              src={logo || "/placeholder.svg"}
                              alt="Biology.Trunk Logo"
                              className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 object-contain"
                            />
                            {enrolledCourses.includes(course._id) && (
                              <div className="absolute top-2 right-2 bg-green-500 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-bold flex items-center gap-0.5 sm:gap-1">
                                <i className="fas fa-check text-xs"></i>
                                <span className="hidden sm:inline">Enrolled</span>
                              </div>
                            )}
                          </div>

                          {/* Course Content */}
                          <div className="p-3 sm:p-4 lg:p-5 flex-grow flex flex-col">
                            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2 line-clamp-2 min-h-[2.8rem] sm:min-h-[3rem]">
                              {course.title}
                            </h3>
                            <div className="flex-grow">
                              <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3 lg:mb-4 line-clamp-3 h-[3.6rem] sm:h-[3.9rem] overflow-hidden">
                                {course.description}
                              </p>
                            </div>

                            {/* Course Meta */}
                            <div className="flex justify-between items-center mb-2 sm:mb-3 py-2 border-y border-gray-200">
                              <div>
                                <span className="text-blue-600 text-xs font-semibold bg-blue-50 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full flex items-center gap-0.5 sm:gap-1 whitespace-nowrap">
                                  <i className="fas fa-tag text-xs"></i>
                                  {course.category}
                                </span>
                              </div>
                              <span className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-0.5 sm:gap-1 whitespace-nowrap">
                                <i className="fas fa-rupee-sign text-xs sm:text-sm"></i>
                                {course.price}
                              </span>
                            </div>

                            {/* Student Count */}
                            <div className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 flex items-center gap-1 sm:gap-2 whitespace-nowrap">
                              <i className="fas fa-users text-xs sm:text-sm"></i>
                              {course.students?.length || 0} students
                            </div>

                            {/* Buttons */}
                            <div className="mt-auto pt-2">
                              {enrolledCourses.includes(course._id) ? (
                                <button
                                  onClick={() => handleViewCourse(course._id)}
                                  className="w-full py-2 sm:py-2.5 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition flex items-center justify-center gap-1 sm:gap-2 text-sm"
                                >
                                  <i className="fas fa-play-circle text-xs sm:text-sm"></i>
                                  Continue Learning
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleViewDetails(course._id)}
                                  className="w-full py-2 sm:py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold flex items-center justify-center gap-2 text-sm"
                                >
                                  <i className="fas fa-eye"></i>
                                  <span>View Details & Enroll</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex justify-center items-center gap-1 sm:gap-2 mb-6 sm:mb-8 lg:mb-10">
                        <button
                          onClick={() => fetchCourses(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-200 text-gray-900 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm"
                        >
                          <i className="fas fa-chevron-left text-xs"></i>
                          <span className="hidden sm:inline">Previous</span>
                          <span className="sm:hidden">Prev</span>
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => fetchCourses(page)}
                            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition flex items-center gap-0.5 sm:gap-1 text-xs sm:text-sm ${
                              page === currentPage
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                        <button
                          onClick={() => fetchCourses(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-200 text-gray-900 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm"
                        >
                          <span className="hidden sm:inline">Next</span>
                          <span className="sm:hidden">Next</span>
                          <i className="fas fa-chevron-right text-xs"></i>
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
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                  Your Learning Journey
                </h2>

                {enrolledCoursesData.length === 0 ? (
                  <div className="text-center py-8 sm:py-12 lg:py-16">
                    <i className="fas fa-book-open text-4xl sm:text-6xl mb-3 sm:mb-4 text-gray-300"></i>
                    <div className="text-gray-600 text-base sm:text-lg mb-2 sm:mb-4">No courses enrolled yet</div>
                    <p className="text-gray-500 text-sm sm:text-base mb-4 sm:mb-6">Start by exploring our courses</p>
                    <button
                      onClick={() => setActiveTab("discover")}
                      className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold flex items-center justify-center gap-1 sm:gap-2 mx-auto text-sm sm:text-base"
                    >
                      <i className="fas fa-compass text-sm"></i>
                      Explore Courses
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                    {enrolledCoursesData.map((course) => (
                      <div
                        key={course._id}
                        className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-green-600/50 rounded-xl p-3 sm:p-4 lg:p-5 hover:shadow-lg transition-all duration-300 flex flex-col h-full"
                      >
                        <div className="flex items-start justify-between mb-2 sm:mb-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <i className="fas fa-check text-green-600 text-base sm:text-lg lg:text-xl"></i>
                          </div>
                          <span className="text-green-600 font-bold flex items-center gap-0.5 sm:gap-1 text-xs sm:text-sm whitespace-nowrap">
                            <i className="fas fa-circle text-xs"></i>
                            Active
                          </span>
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2 line-clamp-2 min-h-[2.8rem] sm:min-h-[3rem]">
                          {course.title}
                        </h3>
                        <div className="flex-grow">
                          <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-3 h-[3.6rem] sm:h-[3.9rem] overflow-hidden">
                            {course.description}
                          </p>
                        </div>

                        <div className="mb-3 sm:mb-4">
                          <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-1 whitespace-nowrap">
                            <span>Progress</span>
                            <span>65%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                            <div className="bg-green-600 h-1.5 sm:h-2 rounded-full" style={{ width: "65%" }}></div>
                          </div>
                        </div>

                        <div className="mt-auto pt-2">
                          <button
                            onClick={() => handleViewCourse(course._id)}
                            className="w-full py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition flex items-center justify-center gap-1 sm:gap-2 text-sm"
                          >
                            <i className="fas fa-play text-xs sm:text-sm"></i>
                            Continue Learning
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Progress Tab */}
            {activeTab === "progress" && (
              <div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                  Your Learning Progress
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                  {/* Progress Overview */}
                  <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 lg:p-6">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3 lg:mb-4 flex items-center gap-1 sm:gap-2">
                      <i className="fas fa-chart-bar text-blue-600 text-sm sm:text-base"></i>
                      Learning Analytics
                    </h3>
                    <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm sm:text-base">Courses Completed</span>
                        <span className="font-semibold text-green-600 text-sm sm:text-base">
                          {learningStats.completedCourses}/5
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm sm:text-base">Average Score</span>
                        <span className="font-semibold text-blue-600 text-sm sm:text-base">87%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm sm:text-base">Study Streak</span>
                        <span className="font-semibold text-orange-600 text-sm sm:text-base">
                          {learningStats.streakDays} days
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm sm:text-base">Time Spent</span>
                        <span className="font-semibold text-purple-600 text-sm sm:text-base">
                          {learningStats.totalHours} hours
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 lg:p-6">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3 lg:mb-4 flex items-center gap-1 sm:gap-2">
                      <i className="fas fa-history text-green-600 text-sm sm:text-base"></i>
                      Recent Activity
                    </h3>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-blue-50 rounded-lg">
                        <i className="fas fa-video text-blue-600 text-sm sm:text-base"></i>
                        <div>
                          <p className="font-medium text-gray-900 text-sm sm:text-base">Watched: Algebra Basics</p>
                          <p className="text-xs sm:text-sm text-gray-600">2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-green-50 rounded-lg">
                        <i className="fas fa-check-circle text-green-600 text-sm sm:text-base"></i>
                        <div>
                          <p className="font-medium text-gray-900 text-sm sm:text-base">Completed: Physics Quiz</p>
                          <p className="text-xs sm:text-sm text-gray-600">1 day ago</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-purple-50 rounded-lg">
                        <i className="fas fa-book text-purple-600 text-sm sm:text-base"></i>
                        <div>
                          <p className="font-medium text-gray-900 text-sm sm:text-base">Enrolled: Chemistry Advanced</p>
                          <p className="text-xs sm:text-sm text-gray-600">3 days ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Achievement Badges */}
                <div className="mt-4 sm:mt-6 lg:mt-8">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3 lg:mb-4 flex items-center gap-1 sm:gap-2">
                    <i className="fas fa-trophy text-yellow-600 text-sm sm:text-base"></i>
                    Your Achievements
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
                    {[
                      { name: "Quick Learner", icon: "fas fa-bolt", color: "yellow" },
                      { name: "Perfect Score", icon: "fas fa-star", color: "gold" },
                      { name: "Week Warrior", icon: "fas fa-calendar", color: "blue" },
                      { name: "Course Master", icon: "fas fa-graduation-cap", color: "purple" },
                    ].map((badge, index) => (
                      <div key={index} className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div
                          className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 ${getBadgeColor(badge.color)} rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2`}
                        >
                          <i className={`${badge.icon} text-white text-sm sm:text-base lg:text-lg`}></i>
                        </div>
                        <p className="text-xs sm:text-sm font-medium text-gray-900">{badge.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notification Modal - Made responsive */}
      {showNotificationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-full w-full sm:max-w-md max-h-[80vh] sm:max-h-96 overflow-y-auto">
            {selectedNotification ? (
              <div className="p-4 sm:p-6">
                <div className="flex justify-between items-start mb-3 sm:mb-4">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">{selectedNotification.title}</h3>
                  <button
                    onClick={() => setSelectedNotification(null)}
                    className="text-gray-500 hover:text-gray-700 text-xl sm:text-2xl font-bold"
                  >
                    ×
                  </button>
                </div>
                <p className="text-gray-700 mb-3 sm:mb-4 text-sm sm:text-base">{selectedNotification.message}</p>
                <div className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 flex items-center gap-1 sm:gap-2">
                  <i className="fas fa-clock text-xs"></i>
                  {new Date(selectedNotification.createdAt).toLocaleString()}
                </div>
                {selectedNotification.course && (
                  <div className="bg-blue-50 p-2 sm:p-3 rounded-lg text-xs sm:text-sm text-gray-700 flex items-center gap-1 sm:gap-2">
                    <i className="fas fa-book text-blue-600 text-xs sm:text-sm"></i>
                    Course: {selectedNotification.course?.title}
                  </div>
                )}
                <button
                  onClick={() => markNotificationAsRead(selectedNotification._id)}
                  className="w-full mt-3 sm:mt-4 px-4 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base"
                >
                  <i className="fas fa-check text-xs sm:text-sm"></i>
                  Mark as Read
                </button>
              </div>
            ) : (
              <div className="p-4 sm:p-6">
                <div className="flex justify-between items-center mb-3 sm:mb-4">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-1 sm:gap-2">
                    <i className="fas fa-bell text-blue-600 text-sm sm:text-base"></i>
                    Course Updates ({notifications.length})
                  </h3>
                  <button
                    onClick={handleCloseNotificationModal}
                    className="text-gray-500 hover:text-gray-700 text-xl sm:text-2xl font-bold"
                  >
                    ×
                  </button>
                </div>
                {notifications.length > 0 ? (
                  <div className="space-y-2 sm:space-y-3">
                    {notifications.map((notif) => (
                      <button
                        key={notif._id}
                        onClick={() => setSelectedNotification(notif)}
                        className="w-full text-left p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition"
                      >
                        <div className="font-semibold text-gray-900 flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
                          <i className="fas fa-bullhorn text-blue-600 text-xs sm:text-sm"></i>
                          {notif.title}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-700 mt-1 line-clamp-2">{notif.message}</div>
                        {notif.course && (
                          <div className="text-xs text-blue-600 font-semibold mt-1 sm:mt-2 flex items-center gap-0.5 sm:gap-1">
                            <i className="fas fa-book text-xs"></i>
                            Course: {notif.course?.title}
                          </div>
                        )}
                        <div className="text-xs text-gray-500 mt-1 sm:mt-2 flex items-center gap-0.5 sm:gap-1">
                          <i className="fas fa-clock text-xs"></i>
                          {new Date(notif.createdAt).toLocaleDateString()}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 sm:py-8 text-gray-500">
                    <i className="fas fa-bell-slash text-2xl sm:text-3xl mb-2"></i>
                    <p className="text-sm sm:text-base">No new course updates</p>
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
    yellow: "bg-yellow-500",
    gold: "bg-yellow-600",
    blue: "bg-blue-500",
    purple: "bg-purple-500",
  }
  return colors[color] || "bg-gray-500"
}
