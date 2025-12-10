"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { API_URL } from "../utils/api.js"
import { showSuccessToast, showErrorToast } from "../utils/toast.js"
import logo from "../assets/biology-trunk-logo.png"
import { useNavigate } from "react-router-dom" // Assuming you are using react-router-dom for navigation

export default function FacultyDashboard({ user, onLogout }) {
  const navigate = useNavigate() // Initialize navigate

  const [courses, setCourses] = useState([])
  const [allEnrollments, setAllEnrollments] = useState({})
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [showNotificationModal, setShowNotificationModal] = useState(false)
  const [contentForm, setContentForm] = useState({
    title: "",
    type: "pdf",
    description: "",
    pdfUrl: "",
    videoUrl: "",
    liveClassUrl: "",
    liveClassDate: "",
    liveClassTime: "",
  })
  const [loading, setLoading] = useState(true)
  const [totalStudents, setTotalStudents] = useState(0)
  const [totalEarnings, setTotalEarnings] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [activeTab, setActiveTab] = useState("overview")
  const [courseContent, setCourseContent] = useState([])
  const [performanceStats, setPerformanceStats] = useState({
    totalViews: 0,
    completionRate: 0,
    avgRating: 0,
    activeStudents: 0,
  })
  const [editingContentId, setEditingContentId] = useState(null)
  const [editingContent, setEditingContent] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteContentId, setDeleteContentId] = useState(null)

  useEffect(() => {
    fetchFacultyCourses()
    fetchNotifications()
  }, [])

  useEffect(() => {
    if (courses.length > 0) {
      fetchAllEnrollments()
      fetchPerformanceStats()
    }
  }, [courses])

  useEffect(() => {
    if (selectedCourse) {
      fetchCourseContent()
    }
  }, [selectedCourse])

  const fetchFacultyCourses = async () => {
    try {
      const response = await axios.get(`${API_URL}/courses/faculty/${user._id}`)
      setCourses(response.data)
      if (response.data.length > 0) {
        setSelectedCourse(response.data[0])
      }
      setLoading(false)
    } catch (error) {
      console.error("Failed to fetch courses:", error)
      showErrorToast("Failed to load courses")
      setLoading(false)
    }
  }

  const fetchAllEnrollments = async () => {
    try {
      const enrollmentsByCourse = {}
      let total = 0
      let earnings = 0

      for (const course of courses) {
        const response = await axios.get(`${API_URL}/enrollments/course/${course._id}`)
        enrollmentsByCourse[course._id] = response.data
        total += response.data.length
        earnings += response.data.reduce((sum, enrollment) => {
          return sum + (enrollment.payment?.amount || 0)
        }, 0)
      }

      setAllEnrollments(enrollmentsByCourse)
      setTotalStudents(total)
      setTotalEarnings(earnings)
    } catch (error) {
      console.error("Failed to fetch enrollments:", error)
      showErrorToast("Failed to load enrollment data")
    }
  }

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`${API_URL}/notifications/user/${user._id}`)
      setNotifications(response.data.filter((n) => !n.read))
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
      showErrorToast("Failed to load notifications")
    }
  }

  const fetchCourseContent = async () => {
    try {
      const response = await axios.get(`${API_URL}/content/course/${selectedCourse._id}`)
      setCourseContent(response.data)
    } catch (error) {
      console.error("Failed to fetch course content:", error)
      showErrorToast("Failed to load course content")
    }
  }

  const fetchPerformanceStats = async () => {
    // Mock performance data - replace with actual API calls
    setPerformanceStats({
      totalViews: 12540,
      completionRate: 78,
      avgRating: 4.7,
      activeStudents: 234,
    })
  }

  const handleUploadContent = async (e) => {
    e.preventDefault()
    try {
      const formData = {
        course: selectedCourse._id,
        faculty: user._id,
        type: contentForm.type,
        title: contentForm.title,
        description: contentForm.description,
        pdfUrl: contentForm.type === "pdf" ? contentForm.pdfUrl : "",
        videoUrl: contentForm.type === "video" ? contentForm.videoUrl : "",
        liveClassUrl: contentForm.type === "live_class" ? contentForm.liveClassUrl : "",
        liveClassDate: contentForm.type === "live_class" ? contentForm.liveClassDate : "",
        liveClassTime: contentForm.type === "live_class" ? contentForm.liveClassTime : "",
      }

      await axios.post(`${API_URL}/content`, formData)
      showSuccessToast("Content uploaded successfully! Students will be notified.")
      setContentForm({
        title: "",
        type: "pdf",
        description: "",
        pdfUrl: "",
        videoUrl: "",
        liveClassUrl: "",
        liveClassDate: "",
        liveClassTime: "",
      })
      fetchCourseContent() // Refresh content list
    } catch (error) {
      console.error("Failed to upload content:", error)
      showErrorToast("Failed to upload content")
    }
  }

  const markNotificationAsRead = async (notificationId) => {
    try {
      await axios.put(`${API_URL}/notifications/${notificationId}`)
      setNotifications((prev) => prev.filter((n) => n._id !== notificationId))
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
      showErrorToast("Failed to mark notification as read")
    }
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
  }

  const deleteContent = async (contentId) => {
    setDeleteContentId(contentId)
    setShowDeleteConfirm(true)
  }

  const confirmDeleteContent = async () => {
    try {
      await axios.delete(`${API_URL}/content/${deleteContentId}`)
      showSuccessToast("Content deleted successfully!")
      setShowDeleteConfirm(false)
      setDeleteContentId(null)
      fetchCourseContent()
    } catch (error) {
      console.error("Failed to delete content:", error)
      showErrorToast("Failed to delete content")
    }
  }

  const startEditContent = (content) => {
    setEditingContentId(content._id)
    setEditingContent({
      title: content.title,
      description: content.description,
      type: content.type,
      pdfUrl: content.pdfUrl || "",
      videoUrl: content.videoUrl || "",
      liveClassUrl: content.liveClassUrl || "",
      liveClassDate: content.liveClassDate || "",
      liveClassTime: content.liveClassTime || "",
    })
    setActiveTab("upload")
  }

  const handleUpdateContent = async (e) => {
    e.preventDefault()
    try {
      const updateData = {
        title: editingContent.title,
        description: editingContent.description,
        type: editingContent.type,
        pdfUrl: editingContent.type === "pdf" ? editingContent.pdfUrl : "",
        videoUrl: editingContent.type === "video" ? editingContent.videoUrl : "",
        liveClassUrl: editingContent.type === "live_class" ? editingContent.liveClassUrl : "",
        liveClassDate: editingContent.type === "live_class" ? editingContent.liveClassDate : "",
        liveClassTime: editingContent.type === "live_class" ? editingContent.liveClassTime : "",
      }

      await axios.put(`${API_URL}/content/${editingContentId}`, updateData)
      showSuccessToast("Content updated successfully!")
      cancelEdit()
      fetchCourseContent()
    } catch (error) {
      console.error("Failed to update content:", error)
      showErrorToast("Failed to update content")
    }
  }

  const cancelEdit = () => {
    setEditingContentId(null)
    setEditingContent(null)
    setContentForm({
      title: "",
      type: "pdf",
      description: "",
      pdfUrl: "",
      videoUrl: "",
      liveClassUrl: "",
      liveClassDate: "",
      liveClassTime: "",
    })
  }

  const currentEnrollments = selectedCourse ? allEnrollments[selectedCourse._id] || [] : []

  const filteredEnrollments = currentEnrollments.filter((enrollment) =>
    enrollment.student.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getFilteredCourses = () => {
    if (filterType === "all") return courses
    if (filterType === "popular") return courses.filter((c) => (allEnrollments[c._id] || []).length > 0)
    return courses
  }

  const getContentIcon = (type) => {
    switch (type) {
      case "pdf":
        return "fas fa-file-pdf"
      case "video":
        return "fas fa-video"
      case "live_class":
        return "fas fa-chalkboard-teacher"
      default:
        return "fas fa-file"
    }
  }

  const getContentColor = (type) => {
    switch (type) {
      case "pdf":
        return "text-red-600 bg-red-100"
      case "video":
        return "text-blue-600 bg-blue-100"
      case "live_class":
        return "text-green-600 bg-green-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Content?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this content? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false)
                  setDeleteContentId(null)
                }}
                className="px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 transition font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteContent}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header - Same responsive design as StudentDashboard */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Logo - Same as StudentDashboard */}
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center overflow-hidden">
                <img
                  src={logo || "/placeholder.svg"}
                  alt="Biology.Trunk Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="hidden sm:block">
                <span className="text-gray-900 font-bold text-lg sm:text-xl">Biology.Trunk</span>
                <p className="text-xs text-gray-500">Faculty Portal - Welcome, {user.name}</p>
              </div>
              <div className="sm:hidden">
                <span className="text-gray-900 font-bold text-base">Faculty</span>
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
        {loading ? (
          <div className="text-center text-gray-600 py-16 sm:py-20">
            <i className="fas fa-spinner fa-spin text-3xl sm:text-4xl mb-3 sm:mb-4 text-blue-600"></i>
            <p className="text-lg sm:text-xl font-medium">Loading your dashboard...</p>
            <p className="text-sm text-gray-500 mt-2">Please wait while we fetch your courses</p>
          </div>
        ) : (
          <>
            {/* Dashboard Stats - Responsive like StudentDashboard */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
              <div className="bg-white rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-xs sm:text-sm font-semibold uppercase tracking-wide">
                      Total Courses
                    </p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">
                      {courses.length}
                    </p>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-book-open text-blue-600 text-sm sm:text-base lg:text-xl"></i>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1 sm:mt-2">Active courses assigned</p>
              </div>

              <div className="bg-white rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-xs sm:text-sm font-semibold uppercase tracking-wide">
                      Total Students
                    </p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">
                      {totalStudents}
                    </p>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-users text-green-600 text-sm sm:text-base lg:text-xl"></i>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1 sm:mt-2">Across all courses</p>
              </div>

              <div className="bg-white rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-xs sm:text-sm font-semibold uppercase tracking-wide">
                      Total Earnings
                    </p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">
                      ₹{totalEarnings.toLocaleString()}
                    </p>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-rupee-sign text-purple-600 text-sm sm:text-base lg:text-xl"></i>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1 sm:mt-2">From all enrollments</p>
              </div>

              <div className="bg-white rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-xs sm:text-sm font-semibold uppercase tracking-wide">
                      Avg. Rating
                    </p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">
                      {performanceStats.avgRating}/5
                    </p>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-star text-yellow-600 text-sm sm:text-base lg:text-xl"></i>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1 sm:mt-2">Based on student feedback</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
              {/* Sidebar - Course Selection */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 sticky top-24">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                    <i className="fas fa-list-ul text-blue-600"></i>
                    <span className="hidden sm:inline">Your Courses</span>
                    <span className="sm:hidden">Courses</span>
                  </h2>

                  {/* Filter Buttons */}
                  <div className="flex gap-2 mb-4 sm:mb-6">
                    <button
                      onClick={() => setFilterType("all")}
                      className={`flex-1 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-1 ${filterType === "all" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                    >
                      <i className="fas fa-layer-group text-xs sm:text-sm"></i>
                      <span className="hidden sm:inline">All</span>
                      <span className="sm:hidden">All</span>
                    </button>
                    <button
                      onClick={() => setFilterType("popular")}
                      className={`flex-1 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-1 ${filterType === "popular" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                    >
                      <i className="fas fa-fire text-xs sm:text-sm"></i>
                      <span className="hidden sm:inline">Popular</span>
                      <span className="sm:hidden">Top</span>
                    </button>
                  </div>

                  <div className="space-y-2 sm:space-y-3 max-h-80 sm:max-h-96 overflow-y-auto">
                    {getFilteredCourses().length === 0 ? (
                      <div className="text-center py-6 sm:py-8 text-gray-500">
                        <i className="fas fa-inbox text-xl sm:text-2xl mb-2"></i>
                        <p className="text-sm">No courses assigned yet</p>
                      </div>
                    ) : (
                      getFilteredCourses().map((course) => (
                        <button
                          key={course._id}
                          onClick={() => setSelectedCourse(course)}
                          className={`w-full text-left p-3 sm:p-4 rounded-lg transition-all duration-200 flex items-start gap-2 sm:gap-3 ${
                            selectedCourse?._id === course._id
                              ? "bg-blue-600 text-white shadow-md"
                              : "bg-gray-50 text-gray-900 border border-gray-200 hover:border-blue-300 hover:shadow-sm"
                          }`}
                        >
                          <div
                            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center ${
                              selectedCourse?._id === course._id
                                ? "bg-white text-blue-600"
                                : "bg-blue-100 text-blue-600"
                            }`}
                          >
                            <i className="fas fa-graduation-cap text-sm sm:text-base"></i>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-xs sm:text-sm leading-tight truncate">
                              {course.title}
                            </div>
                            <div className="text-xs opacity-75 mt-0.5 truncate">{course.category}</div>
                            <div className="text-xs mt-1 sm:mt-2 opacity-60 flex items-center gap-1">
                              <i className="fas fa-users text-xs"></i>
                              {(allEnrollments[course._id] || []).length} students
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="lg:col-span-3">
                {/* ADDED: Button to create new course */}
                <div className="mb-6">
                  <button
                    onClick={() => navigate("/faculty/course/create")}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold flex items-center gap-2"
                  >
                    <i className="fas fa-plus"></i>
                    Create New Course
                  </button>
                </div>

                {selectedCourse && (
                  <>
                    {/* Course Header */}
                    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 mb-4 sm:mb-6">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 sm:mb-4 gap-3 sm:gap-4">
                        <div className="flex-1 min-w-0">
                          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2 truncate">
                            {selectedCourse.title}
                          </h2>
                          <p className="text-gray-600 text-sm sm:text-base mb-2 sm:mb-3 lg:mb-4 line-clamp-2">
                            {selectedCourse.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3 lg:gap-4 text-xs sm:text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <i className="fas fa-clock text-xs"></i>
                              Created: {new Date(selectedCourse.createdAt).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <i className="fas fa-tag text-xs"></i>
                              {selectedCourse.category}
                            </span>
                            <span className="flex items-center gap-1">
                              <i className="fas fa-rupee-sign text-xs"></i>₹{selectedCourse.price}
                            </span>
                          </div>
                        </div>
                        <div className="bg-blue-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap self-start">
                          {selectedCourse.level || "All Levels"}
                        </div>
                      </div>

                      {/* Quick Stats */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-4 sm:mt-6">
                        <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <i className="fas fa-users text-blue-600 text-lg sm:text-xl mb-1 sm:mb-2"></i>
                          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600">
                            {(allEnrollments[selectedCourse._id] || []).length}
                          </div>
                          <div className="text-xs text-gray-600">Enrolled</div>
                        </div>
                        {/* Added Course Content count to quick stats */}
                        <div className="text-center p-3 sm:p-4 bg-green-50 rounded-lg border border-green-200">
                          <i className="fas fa-file-alt text-green-600 text-lg sm:text-xl mb-1 sm:mb-2"></i>
                          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">
                            {courseContent.length}
                          </div>
                          <div className="text-xs text-gray-600">Content</div>
                        </div>
                        <div className="text-center p-3 sm:p-4 bg-purple-50 rounded-lg border border-purple-200">
                          <i className="fas fa-eye text-purple-600 text-lg sm:text-xl mb-1 sm:mb-2"></i>
                          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-600">
                            {performanceStats.totalViews}
                          </div>
                          <div className="text-xs text-gray-600">Views</div>
                        </div>
                        <div className="text-center p-3 sm:p-4 bg-orange-50 rounded-lg border border-orange-200">
                          <i className="fas fa-chart-line text-orange-600 text-lg sm:text-xl mb-1 sm:mb-2"></i>
                          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-600">
                            {performanceStats.completionRate}%
                          </div>
                          <div className="text-xs text-gray-600">Completion</div>
                        </div>
                      </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-4 sm:mb-6 overflow-hidden">
                      <div className="border-b border-gray-200 overflow-x-auto">
                        <nav className="flex space-x-4 sm:space-x-8 px-3 sm:px-4 lg:px-6 min-w-max">
                          {/* Simplified tab structure and added conditional label for upload/edit */}
                          {[
                            { id: "overview", name: "Content", icon: "fas fa-list" },
                            { id: "students", name: "Students", icon: "fas fa-users" },
                            {
                              id: "upload",
                              name: editingContentId ? "Edit Content" : "Upload",
                              icon: editingContentId ? "fas fa-edit" : "fas fa-plus",
                            },
                          ].map((tab) => (
                            <button
                              key={tab.id}
                              onClick={() => {
                                setActiveTab(tab.id)
                                // Reset edit state if switching away from upload tab
                                if (tab.id !== "upload" && editingContentId) {
                                  cancelEdit()
                                }
                              }}
                              className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm flex items-center gap-1 sm:gap-2 flex-shrink-0 transition ${
                                activeTab === tab.id
                                  ? "border-blue-600 text-blue-600"
                                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                              }`}
                            >
                              <i className={tab.icon}></i>
                              <span className="hidden sm:inline">{tab.name}</span>
                              {/* Shortened mobile tab name */}
                              <span className="sm:hidden">{tab.name.split(" ")[0]}</span>
                            </button>
                          ))}
                        </nav>
                      </div>

                      <div className="p-3 sm:p-4 lg:p-6">
                        {/* Overview Tab - Renamed to Content List Tab */}
                        {activeTab === "overview" && (
                          <div>
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
                              Course Content ({courseContent.length})
                            </h3>
                            {courseContent.length === 0 ? (
                              <div className="text-center py-8 sm:py-12">
                                <i className="fas fa-inbox text-3xl sm:text-4xl text-gray-300 mb-3 sm:mb-4"></i>
                                <p className="text-gray-600 text-base sm:text-lg">No content uploaded yet</p>
                                <p className="text-gray-500 text-sm sm:text-base mt-2">
                                  Go to the Upload tab to add course content
                                </p>
                              </div>
                            ) : (
                              <div className="space-y-3 sm:space-y-4">
                                {courseContent.map((content) => (
                                  <div
                                    key={content._id}
                                    className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4"
                                  >
                                    <div
                                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${getContentColor(content.type)}`}
                                    >
                                      <i className={`${getContentIcon(content.type)} text-sm sm:text-base`}></i>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                                        {content.title}
                                      </h4>
                                      <p className="text-gray-600 text-xs sm:text-sm mt-0.5 line-clamp-1">
                                        {content.description}
                                      </p>
                                      <div className="flex items-center gap-2 sm:gap-3 mt-1 text-xs text-gray-500">
                                        <span className="flex items-center gap-1">
                                          <i className="fas fa-calendar text-xs"></i>
                                          {new Date(content.createdAt).toLocaleDateString()}
                                        </span>
                                        <span className="flex items-center gap-1">
                                          <i className="fas fa-eye text-xs"></i>
                                          245 views
                                        </span>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-1 sm:gap-2 self-end sm:self-center">
                                      <button
                                        onClick={() => startEditContent(content)}
                                        className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors text-xs sm:text-sm"
                                      >
                                        <i className="fas fa-edit text-xs sm:text-sm"></i>
                                        <span className="sr-only">Edit</span>
                                      </button>
                                      <button
                                        onClick={() => deleteContent(content._id)}
                                        className="p-1.5 sm:p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors text-xs sm:text-sm"
                                      >
                                        <i className="fas fa-trash text-xs sm:text-sm"></i>
                                        <span className="sr-only">Delete</span>
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Students Tab */}
                        {activeTab === "students" && (
                          <div>
                            {/* Added Search bar for students */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-4">
                              <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                                Enrolled Students ({filteredEnrollments.length})
                              </h3>
                              <div className="relative w-full sm:w-auto">
                                <input
                                  type="text"
                                  placeholder="Search students..."
                                  value={searchTerm}
                                  onChange={(e) => setSearchTerm(e.target.value)}
                                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 w-full text-sm"
                                />
                                <i className="fas fa-search absolute left-3 top-2.5 text-gray-400 text-sm"></i>
                              </div>
                            </div>
                            {filteredEnrollments.length === 0 ? (
                              <div className="text-center py-8 sm:py-12">
                                <i className="fas fa-users text-3xl sm:text-4xl text-gray-300 mb-3 sm:mb-4"></i>
                                <p className="text-gray-600 text-base sm:text-lg">No students enrolled yet</p>
                              </div>
                            ) : (
                              // Changed student list to a scrollable div instead of table
                              <div className="space-y-2 sm:space-y-3 max-h-96 overflow-y-auto">
                                {filteredEnrollments.map((enrollment) => (
                                  <div
                                    key={enrollment._id}
                                    className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4 flex items-center justify-between"
                                  >
                                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                                        <span className="text-white font-semibold text-sm sm:text-base">
                                          {enrollment.student.name.charAt(0).toUpperCase()}
                                        </span>
                                      </div>
                                      <div className="min-w-0">
                                        <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                                          {enrollment.student.name}
                                        </p>
                                        <p className="text-gray-600 text-xs sm:text-sm truncate">
                                          {enrollment.student.email}
                                        </p>
                                      </div>
                                    </div>
                                    <span className="px-2 sm:px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap ml-2 flex-shrink-0">
                                      Active
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Upload Tab - now Upload/Edit Tab */}
                        {activeTab === "upload" && (
                          <div>
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
                              {editingContentId ? "Edit Content" : "Upload New Content"}
                            </h3>
                            {/* Combined upload and edit forms */}
                            <form
                              onSubmit={editingContentId ? handleUpdateContent : handleUploadContent}
                              className="space-y-4 sm:space-y-6"
                            >
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                <div>
                                  <label className="block text-gray-700 text-xs sm:text-sm font-semibold mb-1 sm:mb-2 flex items-center gap-1 sm:gap-2">
                                    <i className="fas fa-heading text-xs sm:text-sm"></i>
                                    Content Title
                                  </label>
                                  <input
                                    type="text"
                                    value={editingContentId ? editingContent.title : contentForm.title}
                                    onChange={(e) =>
                                      editingContentId
                                        ? setEditingContent({ ...editingContent, title: e.target.value })
                                        : setContentForm({ ...contentForm, title: e.target.value })
                                    }
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition text-sm"
                                    placeholder="e.g., Lecture 1 - Algebra Basics"
                                    required
                                  />
                                </div>

                                <div>
                                  <label className="block text-gray-700 text-xs sm:text-sm font-semibold mb-1 sm:mb-2 flex items-center gap-1 sm:gap-2">
                                    <i className="fas fa-file-alt text-xs sm:text-sm"></i>
                                    Content Type
                                  </label>
                                  <select
                                    value={editingContentId ? editingContent.type : contentForm.type}
                                    onChange={(e) =>
                                      editingContentId
                                        ? setEditingContent({ ...editingContent, type: e.target.value })
                                        : setContentForm({ ...contentForm, type: e.target.value })
                                    }
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition text-sm"
                                  >
                                    <option value="pdf">PDF Materials</option>
                                    <option value="video">Video Lecture</option>
                                    <option value="live_class">Live Class</option>
                                  </select>
                                </div>
                              </div>

                              <div>
                                <label className="block text-gray-700 text-xs sm:text-sm font-semibold mb-1 sm:mb-2 flex items-center gap-1 sm:gap-2">
                                  <i className="fas fa-align-left text-xs sm:text-sm"></i>
                                  Description
                                </label>
                                <textarea
                                  value={editingContentId ? editingContent.description : contentForm.description}
                                  onChange={(e) =>
                                    editingContentId
                                      ? setEditingContent({ ...editingContent, description: e.target.value })
                                      : setContentForm({ ...contentForm, description: e.target.value })
                                  }
                                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition text-sm"
                                  placeholder="Describe the content for your students..."
                                  rows="3"
                                />
                              </div>

                              {/* Dynamic Fields Based on Content Type */}
                              {(editingContentId ? editingContent.type : contentForm.type) === "pdf" && (
                                <div>
                                  <label className="block text-gray-700 text-xs sm:text-sm font-semibold mb-1 sm:mb-2 flex items-center gap-1 sm:gap-2">
                                    <i className="fas fa-file-pdf text-xs sm:text-sm"></i>
                                    PDF URL
                                  </label>
                                  <input
                                    type="url"
                                    value={editingContentId ? editingContent.pdfUrl : contentForm.pdfUrl}
                                    onChange={(e) =>
                                      editingContentId
                                        ? setEditingContent({ ...editingContent, pdfUrl: e.target.value })
                                        : setContentForm({ ...contentForm, pdfUrl: e.target.value })
                                    }
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition text-sm"
                                    placeholder="https://example.com/file.pdf"
                                    required
                                  />
                                </div>
                              )}

                              {(editingContentId ? editingContent.type : contentForm.type) === "video" && (
                                <div>
                                  <label className="block text-gray-700 text-xs sm:text-sm font-semibold mb-1 sm:mb-2 flex items-center gap-1 sm:gap-2">
                                    <i className="fas fa-video text-xs sm:text-sm"></i>
                                    Video URL
                                  </label>
                                  <input
                                    type="url"
                                    value={editingContentId ? editingContent.videoUrl : contentForm.videoUrl}
                                    onChange={(e) =>
                                      editingContentId
                                        ? setEditingContent({ ...editingContent, videoUrl: e.target.value })
                                        : setContentForm({ ...contentForm, videoUrl: e.target.value })
                                    }
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition text-sm"
                                    placeholder="https://example.com/video.mp4 or YouTube link"
                                    required
                                  />
                                </div>
                              )}

                              {(editingContentId ? editingContent.type : contentForm.type) === "live_class" && (
                                <>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                    <div>
                                      <label className="block text-gray-700 text-xs sm:text-sm font-semibold mb-1 sm:mb-2 flex items-center gap-1 sm:gap-2">
                                        <i className="fas fa-link text-xs sm:text-sm"></i>
                                        Live Class URL
                                      </label>
                                      <input
                                        type="url"
                                        value={
                                          editingContentId ? editingContent.liveClassUrl : contentForm.liveClassUrl
                                        }
                                        onChange={(e) =>
                                          editingContentId
                                            ? setEditingContent({ ...editingContent, liveClassUrl: e.target.value })
                                            : setContentForm({ ...contentForm, liveClassUrl: e.target.value })
                                        }
                                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition text-sm"
                                        placeholder="https://meet.google.com/..."
                                        required
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-gray-700 text-xs sm:text-sm font-semibold mb-1 sm:mb-2 flex items-center gap-1 sm:gap-2">
                                        <i className="fas fa-calendar text-xs sm:text-sm"></i>
                                        Date
                                      </label>
                                      <input
                                        type="date"
                                        value={
                                          editingContentId ? editingContent.liveClassDate : contentForm.liveClassDate
                                        }
                                        onChange={(e) =>
                                          editingContentId
                                            ? setEditingContent({ ...editingContent, liveClassDate: e.target.value })
                                            : setContentForm({ ...contentForm, liveClassDate: e.target.value })
                                        }
                                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition text-sm"
                                        required
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <label className="block text-gray-700 text-xs sm:text-sm font-semibold mb-1 sm:mb-2 flex items-center gap-1 sm:gap-2">
                                      <i className="fas fa-clock text-xs sm:text-sm"></i>
                                      Time
                                    </label>
                                    <input
                                      type="time"
                                      value={
                                        editingContentId ? editingContent.liveClassTime : contentForm.liveClassTime
                                      }
                                      onChange={(e) =>
                                        editingContentId
                                          ? setEditingContent({ ...editingContent, liveClassTime: e.target.value })
                                          : setContentForm({ ...contentForm, liveClassTime: e.target.value })
                                      }
                                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition text-sm"
                                      required
                                    />
                                  </div>
                                </>
                              )}

                              <div className="flex gap-3 sm:gap-4 pt-4 sm:pt-6">
                                <button
                                  type="submit"
                                  className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-sm sm:text-base flex items-center justify-center gap-2"
                                >
                                  <i className="fas fa-check text-sm"></i>
                                  {editingContentId ? "Update Content" : "Upload Content"}
                                </button>
                                {editingContentId && (
                                  <button
                                    type="button"
                                    onClick={cancelEdit}
                                    className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 transition font-semibold text-sm sm:text-base"
                                  >
                                    Cancel
                                  </button>
                                )}
                              </div>
                            </form>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* ADDED: Your Courses Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <i className="fas fa-list text-blue-600"></i>
                    Your Courses
                  </h2>

                  {courses.length === 0 ? (
                    <div className="text-center py-12">
                      <i className="fas fa-book text-4xl text-gray-300 mb-4"></i>
                      <p className="text-gray-600 text-lg">No courses created yet</p>
                      <button
                        onClick={() => navigate("/faculty/course/create")}
                        className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      >
                        Create Your First Course
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {getFilteredCourses().map((course) => (
                        <div
                          key={course._id}
                          className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 hover:shadow-lg transition"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-bold text-gray-900 flex-1">{course.title}</h3>
                            <button
                              onClick={() => navigate(`/faculty/course/${course._id}/edit`)}
                              className="ml-2 p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                              title="Edit course description"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                          </div>

                          <p className="text-gray-700 text-sm mb-4 line-clamp-3">{course.description}</p>

                          <div className="space-y-2 text-sm mb-4">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Duration:</span>
                              <span className="font-semibold text-gray-900">{course.duration}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Price:</span>
                              <span className="font-semibold text-gray-900">₹{course.price}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Students:</span>
                              <span className="font-semibold text-gray-900">
                                {(allEnrollments[course._id] || []).length}
                              </span>
                            </div>
                          </div>

                          {course.courseIncludes && (
                            <div className="border-t pt-4">
                              <p className="text-xs font-semibold text-gray-600 mb-2">INCLUDES:</p>
                              <div className="flex flex-wrap gap-2">
                                {course.courseIncludes.videos && (
                                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Videos</span>
                                )}
                                {course.courseIncludes.liveLectures && (
                                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                    Live Lectures
                                  </span>
                                )}
                                {course.courseIncludes.pdfs && (
                                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">PDFs</span>
                                )}
                                {course.courseIncludes.quizzes && (
                                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                                    Quizzes
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Moved the course content/upload/student tabs to be under the selected course */}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Notification Modal - Responsive like StudentDashboard */}
      {showNotificationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Notifications ({notifications.length})</h2>
              <button
                onClick={handleCloseNotificationModal}
                className="text-gray-500 hover:text-gray-700 text-xl font-bold"
              >
                ×
              </button>
            </div>
            {notifications.length === 0 ? (
              <div className="text-center py-8">
                <i className="fas fa-bell text-3xl text-gray-300 mb-2"></i>
                <p className="text-gray-600">No new notifications</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex justify-between items-start gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm">{notification.title}</p>
                      <p className="text-gray-600 text-xs mt-1">{notification.message}</p>
                    </div>
                    <button
                      onClick={() => markNotificationAsRead(notification._id)}
                      className="text-blue-600 hover:text-blue-700 text-xs font-semibold flex-shrink-0 ml-2"
                    >
                      Mark read
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={handleCloseNotificationModal}
              className="w-full mt-4 px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 transition font-semibold text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
