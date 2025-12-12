"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { API_URL } from "../utils/api.js"
import { useNavigate } from "react-router-dom"
import { useLocation } from "react-router-dom"
import logo from "../assets/biology-trunk-logo.png"
import { showErrorToast, showWarningToast } from "../utils/toast.js"

const ITEMS_PER_PAGE = 9

export default function StudentDashboard({ user, onLogout }) {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [courses, setCourses] = useState([])
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [enrolledCoursesData, setEnrolledCoursesData] = useState([])
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
  // const [learningStats, setLearningStats] = useState({ // Replaced with studentAnalytics
  //   totalHours: 45,
  //   completedCourses: 3,
  //   certificates: 2,
  //   streakDays: 7,
  // })

  const [courseProgress, setCourseProgress] = useState({})
  const [studentAnalytics, setStudentAnalytics] = useState({
    totalCoursesCompleted: 0,
    totalEnrolled: 0,
    averageProgress: 0,
    totalStudyTime: 0,
    recentActivities: [],
    studyStreak: 0,
  })

  useEffect(() => {
    localStorage.setItem("lastPath", window.location.pathname)
    localStorage.setItem("studentDashboardCategory", selectedCategory)
    localStorage.setItem("studentDashboardPage", currentPage.toString())
    localStorage.setItem("studentDashboardSearch", searchTerm)
  }, [selectedCategory, currentPage, searchTerm])

  useEffect(() => {
    const fetchAvailableCategories = async () => {
      try {
        const response = await axios.get(`${API_URL}/courses/categories/list`)
        setCategories(response.data || [])
      } catch (error) {
        console.error("Error fetching categories:", error)
        setCategories([])
      }
    }
    fetchAvailableCategories()
    fetchCourses(1)
  }, [])

  useEffect(() => {
    fetchCourses(currentPage)
    fetchEnrolledCourses()
    fetchNotifications()
  }, [selectedCategory, currentPage]) // Dependency added for currentPage

  useEffect(() => {
    if (user && user._id) {
      fetchEnrolledCourses() // Fetch enrolled courses when user info is available
      fetchNotifications() // Fetch notifications when user info is available
    }
  }, [user]) // Fetch when user object changes

  const fetchCourseProgress = async (courseId, studentId) => {
    try {
      const response = await axios.get(`${API_URL}/progress/course/${courseId}/student/${studentId}`)
      return response.data.percentage || 0
    } catch (error) {
      console.error(`Failed to fetch progress for course ${courseId}:`, error)
      return 0
    }
  }

  const fetchCourses = async (page) => {
    try {
      const url = selectedCategory
        ? `${API_URL}/courses/category/${encodeURIComponent(selectedCategory)}?page=${page}&limit=${ITEMS_PER_PAGE}`
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
    if (!user || !user._id) return // Ensure user and user._id exist

    try {
      const response = await axios.get(`${API_URL}/enrollments/student/${user._id}`)
      const enrolledIds = response.data.map((e) => e.course._id)
      const enrolledCoursesData = response.data.map((e) => e.course)
      setEnrolledCourses(enrolledIds)
      setEnrolledCoursesData(enrolledCoursesData)

      const progressData = {}
      for (const enrollment of response.data) {
        progressData[enrollment.course._id] = enrollment.progress || 0
      }
      setCourseProgress(progressData)

      const totalEnrolled = response.data.length
      const completedCourses = response.data.filter((e) => e.progress === 100).length
      const totalProgress = response.data.reduce((sum, e) => sum + (e.progress || 0), 0)
      const averageProgress = totalEnrolled > 0 ? Math.round(totalProgress / totalEnrolled) : 0

      // Calculate study time based on content consumed (rough estimate)
      const totalStudyTime = Math.round(averageProgress * totalEnrolled * 0.5) // Rough estimate: 50 minutes per course percentage

      // Calculate study streak (days with activity)
      const studyStreak = calculateStudyStreak(response.data)

      setStudentAnalytics({
        totalCoursesCompleted: completedCourses,
        totalEnrolled,
        averageProgress,
        totalStudyTime,
        studyStreak,
        recentActivities: generateRecentActivities(response.data),
      })
    } catch (error) {
      showErrorToast("Failed to load enrolled courses")
      console.error("Failed to fetch enrolled courses:", error)
    }
  }

  const fetchNotifications = async () => {
    if (!user || !user._id) return // Ensure user and user._id exist
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
    fetchCourses(currentPage)
    fetchEnrolledCourses() // Refresh enrolled courses after enrollment
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

  const shouldShowViewAll = !selectedCategory && !searchTerm && currentPage === 1 && courses.length > ITEMS_PER_PAGE
  const displayedCourses = shouldShowViewAll ? filteredCourses.slice(0, ITEMS_PER_PAGE) : filteredCourses

  const calculateStudyStreak = (enrollments) => {
    // Simple calculation based on recent enrollments and progress
    // In a real app, you'd track daily activity
    const recentEnrollments = enrollments.filter((e) => {
      const enrollDate = new Date(e.enrolledAt)
      const daysSince = Math.floor((Date.now() - enrollDate) / (1000 * 60 * 60 * 24))
      return daysSince <= 7 && e.progress > 0
    })
    return recentEnrollments.length > 0 ? Math.min(recentEnrollments.length * 2, 30) : 0
  }

  const generateRecentActivities = (enrollments) => {
    const activities = []
    const sortedEnrollments = [...enrollments].sort((a, b) => new Date(b.enrolledAt) - new Date(a.enrolledAt))

    sortedEnrollments.slice(0, 3).forEach((enrollment) => {
      if (enrollment.progress === 100) {
        activities.push({
          type: "completed",
          course: enrollment.course.title,
          icon: "check-circle",
          color: "green",
          time: formatRelativeTime(enrollment.enrolledAt),
        })
      } else if (enrollment.progress > 0) {
        activities.push({
          type: "in-progress",
          course: enrollment.course.title,
          icon: "play-circle",
          color: "blue",
          time: formatRelativeTime(enrollment.enrolledAt),
        })
      } else {
        activities.push({
          type: "enrolled",
          course: enrollment.course.title,
          icon: "book",
          color: "purple",
          time: formatRelativeTime(enrollment.enrolledAt),
        })
      }
    })

    return activities
  }

  const formatRelativeTime = (date) => {
    const days = Math.floor((Date.now() - new Date(date)) / (1000 * 60 * 60 * 24))
    if (days === 0) return "Today"
    if (days === 1) return "Yesterday"
    if (days < 7) return `${days} days ago`
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`
    return `${Math.floor(days / 30)} months ago`
  }

  const getAchievements = () => {
    const achievements = []

    // Quick Learner - enrolled in 3+ courses
    if (studentAnalytics.totalEnrolled >= 3) {
      achievements.push({
        id: "quick-learner",
        name: "Quick Learner",
        description: "Enrolled in 3+ courses",
        icon: "⚡",
        color: "orange",
        earned: true,
      })
    }

    // Perfect Score - completed at least 1 course
    if (studentAnalytics.totalCoursesCompleted >= 1) {
      achievements.push({
        id: "perfect-score",
        name: "Course Completer",
        description: "Completed a course",
        icon: "⭐",
        color: "yellow",
        earned: true,
      })
    }

    // Week Warrior - 7+ day streak
    if (studentAnalytics.studyStreak >= 7) {
      achievements.push({
        id: "week-warrior",
        name: "Week Warrior",
        description: "7+ day study streak",
        icon: "🏆",
        color: "blue",
        earned: true,
      })
    }

    // Course Master - average progress > 80%
    if (studentAnalytics.averageProgress >= 80) {
      achievements.push({
        id: "course-master",
        name: "Course Master",
        description: "80%+ average progress",
        icon: "🎓",
        color: "purple",
        earned: true,
      })
    }

    // Add locked achievements if not earned
    if (studentAnalytics.totalEnrolled < 3) {
      achievements.push({
        id: "quick-learner",
        name: "Quick Learner",
        description: "Enroll in 3+ courses",
        icon: "🔒",
        color: "gray",
        earned: false,
      })
    }
    if (studentAnalytics.totalCoursesCompleted < 1) {
      achievements.push({
        id: "perfect-score",
        name: "Course Completer",
        description: "Complete a course",
        icon: "🔒",
        color: "gray",
        earned: false,
      })
    }

    return achievements
  }

  // Helper function for badge colors, adapted for Tailwind CSS classes
  function getBadgeColor(color) {
    switch (color) {
      case "yellow":
        return "bg-yellow-500"
      case "gold":
        return "bg-yellow-600"
      case "blue":
        return "bg-blue-500"
      case "purple":
        return "bg-purple-500"
      case "orange":
        return "bg-orange-500"
      case "gray":
        return "bg-gray-400"
      default:
        return "bg-gray-500"
    }
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
      {/* Using a container class for better control over padding and max-width */}
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Dashboard Stats */}
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
                <i className="fas fa-book-open text-blue-600 text-sm"></i>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1 sm:mt-2">Active courses</p>
          </div>

          <div className="bg-white rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm font-semibold uppercase tracking-wide">Study time</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">
                  {studentAnalytics.totalStudyTime}h
                </p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-clock text-green-600 text-sm"></i>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1 sm:mt-2">Study time</p>
          </div>

          <div className="bg-white rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm font-semibold uppercase tracking-wide">Achievements</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">
                  {getAchievements().filter((a) => a.earned).length}
                </p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-trophy text-yellow-600 text-sm"></i>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1 sm:mt-2">Achievements</p>
          </div>

          <div className="bg-white rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm font-semibold uppercase tracking-wide">Progress</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">
                  {studentAnalytics.averageProgress}%
                </p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-chart-line text-purple-600 text-sm"></i>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1 sm:mt-2">Keep learning!</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-4 sm:mb-6">
          <div className="border-b border-gray-200 px-4 sm:px-6">
            <nav className="flex space-x-2 sm:space-x-4 lg:space-x-8 overflow-x-auto">
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
            {/* Discover Courses Tab - UPDATED COURSE CARDS */}
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
                        key={cat._id || cat}
                        onClick={() => {
                          setSelectedCategory(cat._id || cat)
                          setCurrentPage(1)
                        }}
                        className={`px-3 sm:px-4 lg:px-5 py-2 sm:py-3 rounded-lg sm:rounded-xl transition font-medium flex items-center gap-1 sm:gap-2 text-xs sm:text-sm ${
                          selectedCategory === (cat._id || cat)
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-white text-gray-700 border border-gray-300 hover:border-blue-500 hover:shadow-sm"
                        }`}
                      >
                        <i className="fas fa-tag text-xs sm:text-sm"></i>
                        {cat._id || cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Courses Grid - UPDATED TO MATCH VIEW ALL COURSES */}
                {loading ? (
                  <div className="text-center py-12 sm:py-16 lg:py-20">
                    <i className="fas fa-spinner fa-spin text-3xl sm:text-4xl mb-3 sm:mb-4 text-blue-600"></i>
                    <div className="text-gray-600 text-base sm:text-lg">Loading courses...</div>
                  </div>
                ) : displayedCourses.length === 0 ? (
                  <div className="text-center py-12 sm:py-16 lg:py-20">
                    <i className="fas fa-search text-4xl sm:text-6xl mb-3 sm:mb-4 text-gray-300"></i>
                    <div className="text-gray-600 text-base sm:text-lg mb-2">No courses found</div>
                    <p className="text-gray-500 text-sm sm:text-base">Try adjusting your search</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-8">
                      {displayedCourses.map((course) => (
                        <div
                          key={course._id}
                          className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-blue-300 transition-all duration-300 cursor-pointer group flex flex-col h-full"
                        >
                          {/* Course Image/Thumbnail Area - Matches View All Courses */}
                          <div
                            className="relative h-40 sm:h-44 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center overflow-hidden border-b border-gray-200"
                            onClick={() => handleViewDetails(course._id)}
                          >
                            <div className="w-24 h-24 sm:w-28 sm:h-28">
                              <img
                                src={logo || "/placeholder.svg"}
                                alt="Biology.Trunk Logo"
                                className="w-full h-full object-contain opacity-90 group-hover:opacity-100 transition-opacity"
                              />
                            </div>

                            {/* Course Category Badge */}
                            <div className="absolute top-2 left-2">
                              <span className="bg-blue-600 text-white px-2 py-1 rounded-lg text-xs font-semibold shadow-md">
                                {course.category || "General"}
                              </span>
                            </div>

                            {/* Enrolled Badge */}
                            {enrolledCourses.includes(course._id) && (
                              <div className="absolute top-2 right-2">
                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-lg text-xs font-semibold">
                                  Enrolled
                                </span>
                              </div>
                            )}

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-1 transition-opacity"></div>
                          </div>

                          {/* Course Content - Matches View All Courses styling */}
                          <div className="p-4 sm:p-5 flex flex-col flex-grow">
                            {/* Course Title with consistent height */}
                            <h3
                              className="font-bold text-gray-900 text-lg sm:text-xl mb-2 group-hover:text-blue-600 transition cursor-pointer min-h-[56px] flex items-start"
                              onClick={() => handleViewDetails(course._id)}
                            >
                              {course.title || "Untitled Course"}
                            </h3>

                            {/* Course Description with consistent height */}
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[40px] flex-grow">
                              {course.description || "No description available"}
                            </p>

                            {/* Instructor Info */}
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                <i className="fas fa-user text-gray-600 text-xs"></i>
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-xs text-gray-500">Instructor</p>
                                <p className="text-xs font-semibold text-gray-900 truncate">
                                  {course.faculty?.name || "Unknown Instructor"}
                                </p>
                              </div>
                            </div>

                            {/* Course Stats - Made consistent across cards */}
                            <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                              <div className="flex items-center gap-2">
                                <i className="fas fa-clock text-blue-500"></i>
                                <span>{course.duration || "Flexible"}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <i className="fas fa-users text-green-500"></i>
                                <span>{course.students?.length || 0} students</span>
                              </div>
                            </div>

                            {/* Price and Action Button - At bottom with consistent spacing */}
                            <div className="mt-auto pt-3 border-t border-gray-100">
                              <div className="flex items-center justify-between">
                                <div>
                                  {course.price > 0 ? (
                                    <div className="flex items-baseline gap-1">
                                      <i className="fas fa-rupee-sign text-gray-600 text-sm"></i>
                                      <span className="text-xl font-bold text-gray-900">{course.price}</span>
                                    </div>
                                  ) : (
                                    <span className="text-xl font-bold text-green-600">FREE</span>
                                  )}
                                </div>
                                {enrolledCourses.includes(course._id) ? (
                                  <button
                                    onClick={() => handleViewCourse(course._id)}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold text-sm flex items-center gap-2 cursor-pointer shadow hover:shadow-md"
                                  >
                                    <i className="fas fa-play text-xs"></i>
                                    Continue
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleViewDetails(course._id)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-sm flex items-center gap-2 cursor-pointer shadow hover:shadow-md"
                                  >
                                    <i className="fas fa-eye text-xs"></i>
                                    View Details
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* View All Courses button */}
                    {shouldShowViewAll && (
                      <div className="flex justify-center">
                        <button
                          onClick={() => navigate("/view-all-courses")}
                          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold flex items-center justify-center gap-1 sm:gap-2 text-base shadow-md"
                        >
                          <i className="fas fa-eye text-base"></i>
                          View All Courses
                        </button>
                      </div>
                    )}

                    {/* Pagination */}
                    {(totalPages > 1 || selectedCategory || searchTerm) && !shouldShowViewAll && (
                      <div className="flex justify-center items-center gap-2 mt-6 sm:mt-8 flex-wrap">
                        {currentPage > 1 && (
                          <button
                            onClick={() => fetchCourses(currentPage - 1)}
                            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                          >
                            <i className="fas fa-chevron-left"></i>
                          </button>
                        )}

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => fetchCourses(page)}
                            className={`px-3 sm:px-4 py-2 rounded-lg transition ${
                              currentPage === page
                                ? "bg-blue-600 text-white"
                                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            {page}
                          </button>
                        ))}

                        {currentPage < totalPages && (
                          <button
                            onClick={() => fetchCourses(currentPage + 1)}
                            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                          >
                            <i className="fas fa-chevron-right"></i>
                          </button>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* My Courses Tab - UPDATED TO MATCH VIEW ALL COURSES STYLING */}
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                    {enrolledCoursesData.map((course) => {
                      const progress = courseProgress[course._id] || 0
                      return (
                        <div
                          key={course._id}
                          className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-green-300 transition-all duration-300 cursor-pointer group flex flex-col h-full"
                        >
                          {/* Course Image/Thumbnail Area */}
                          <div
                            className="relative h-40 sm:h-44 bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center overflow-hidden border-b border-gray-200"
                            onClick={() => handleViewCourse(course._id)}
                          >
                            <div className="w-24 h-24 sm:w-28 sm:h-28">
                              <img
                                src={logo || "/placeholder.svg"}
                                alt="Biology.Trunk Logo"
                                className="w-full h-full object-contain opacity-90 group-hover:opacity-100 transition-opacity"
                              />
                            </div>

                            {/* Enrolled Badge */}
                            <div className="absolute top-2 left-2">
                              <span className="bg-green-600 text-white px-2 py-1 rounded-lg text-xs font-semibold shadow-md">
                                {course.category || "General"}
                              </span>
                            </div>

                            <div className="absolute top-2 right-2">
                              <span className="bg-green-100 text-green-700 px-2 py-1 rounded-lg text-xs font-semibold">
                                Enrolled
                              </span>
                            </div>

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-green-600 opacity-0 group-hover:opacity-1 transition-opacity"></div>
                          </div>

                          {/* Course Content */}
                          <div className="p-4 sm:p-5 flex flex-col flex-grow">
                            {/* Course Title */}
                            <h3
                              className="font-bold text-gray-900 text-lg sm:text-xl mb-2 group-hover:text-green-600 transition cursor-pointer min-h-[56px] flex items-start"
                              onClick={() => handleViewCourse(course._id)}
                            >
                              {course.title || "Untitled Course"}
                            </h3>

                            {/* Course Description */}
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[40px] flex-grow">
                              {course.description || "No description available"}
                            </p>

                            {/* Instructor Info */}
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                <i className="fas fa-user text-gray-600 text-xs"></i>
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-xs text-gray-500">Instructor</p>
                                <p className="text-xs font-semibold text-gray-900 truncate">
                                  {course.faculty?.name || "Dr. Abhishek Jha"}
                                </p>
                              </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-3">
                              <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-1">
                                <span>Progress</span>
                                <span>{progress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                                <div
                                  className="bg-green-600 h-1.5 sm:h-2 rounded-full transition-all"
                                  style={{ width: `${progress}%` }}
                                ></div>
                              </div>
                            </div>

                            {/* Continue Learning Button */}
                            <div className="mt-auto pt-3 border-t border-gray-100">
                              <button
                                onClick={() => handleViewCourse(course._id)}
                                className="w-full py-2 sm:py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2 text-sm"
                              >
                                <i className="fas fa-play text-xs"></i>
                                Continue Learning
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
                  {/* Learning Analytics */}
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 sm:p-6 border border-blue-200">
                    <div className="flex items-center gap-2 sm:gap-3 mb-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <i className="fas fa-chart-bar text-white text-sm"></i>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-gray-900">Learning Analytics</h3>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">Courses Completed</span>
                        <span className="text-base sm:text-lg font-bold text-blue-600">
                          {studentAnalytics.totalCoursesCompleted}/{studentAnalytics.totalEnrolled}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">Average Progress</span>
                        <span className="text-base sm:text-lg font-bold text-blue-600">
                          {studentAnalytics.averageProgress}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">Study Streak</span>
                        <span className="text-base sm:text-lg font-bold text-orange-600">
                          {studentAnalytics.studyStreak} days
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">Time Spent</span>
                        <span className="text-base sm:text-lg font-bold text-purple-600">
                          {studentAnalytics.totalStudyTime} hours
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-4 sm:p-6 border border-green-200">
                    <div className="flex items-center gap-2 sm:gap-3 mb-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-600 rounded-lg flex items-center justify-center">
                        <i className="fas fa-history text-white text-sm"></i>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-gray-900">Recent Activity</h3>
                    </div>

                    <div className="space-y-3">
                      {studentAnalytics.recentActivities.length === 0 ? (
                        <p className="text-sm text-gray-600">No recent activity</p>
                      ) : (
                        studentAnalytics.recentActivities.map((activity, idx) => (
                          <div key={idx} className="flex items-start gap-3 bg-white p-3 rounded-lg">
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-${activity.color}-100`}
                            >
                              <i className={`fas fa-${activity.icon} text-${activity.color}-600 text-xs`}></i>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-gray-900 truncate">{activity.course}</p>
                              <p className="text-xs text-gray-500">{activity.time}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Course Progress List */}
                <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 mb-6">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">Course Progress</h3>
                  <div className="space-y-4">
                    {enrolledCoursesData.length === 0 ? (
                      <p className="text-sm text-gray-600">No enrolled courses yet</p>
                    ) : (
                      enrolledCoursesData.map((course) => {
                        const progress = courseProgress[course._id] || 0
                        return (
                          <div
                            key={course._id}
                            className="flex items-center gap-3 sm:gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                            onClick={() => handleViewCourse(course._id)}
                          >
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                              <img
                                src={logo || "/placeholder.svg"}
                                alt="Course"
                                className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-gray-900 truncate">{course.title}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                                  <div
                                    className="bg-green-600 h-1.5 rounded-full transition-all"
                                    style={{ width: `${progress}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs font-semibold text-gray-600">{progress}%</span>
                              </div>
                            </div>
                            <i className="fas fa-chevron-right text-gray-400 text-xs"></i>
                          </div>
                        )
                      })
                    )}
                  </div>
                </div>

                {/* Your Achievements */}
                <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
                  <div className="flex items-center gap-2 sm:gap-3 mb-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <i className="fas fa-trophy text-yellow-600 text-sm"></i>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900">Your Achievements</h3>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    {getAchievements().map((achievement) => (
                      <div
                        key={achievement.id}
                        className={`text-center p-3 sm:p-4 rounded-xl border-2 transition ${
                          achievement.earned
                            ? `bg-${achievement.color}-50 border-${achievement.color}-200`
                            : "bg-gray-50 border-gray-200 opacity-50"
                        }`}
                      >
                        <div className="text-2xl sm:text-3xl mb-2">{achievement.icon}</div>
                        <div className="text-xs sm:text-sm font-bold text-gray-900 mb-1">{achievement.name}</div>
                        <div className="text-xs text-gray-600">{achievement.description}</div>
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
                  <div className="bg-blue-50 p-2 sm:p-3 rounded-lg text-xs sm:text-base text-gray-700 flex items-center gap-1 sm:gap-2">
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
