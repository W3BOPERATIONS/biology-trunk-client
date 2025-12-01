"use client"

import { useState, useEffect } from "react"
import axios from "axios"

const API_URL = "https://biology-trunk-server.vercel.app/api"

export default function FacultyDashboard({ user, onLogout }) {
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
    activeStudents: 0
  })

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
        earnings += response.data.length * course.price
      }

      setAllEnrollments(enrollmentsByCourse)
      setTotalStudents(total)
      setTotalEarnings(earnings)
    } catch (error) {
      console.error("Failed to fetch enrollments:", error)
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

  const fetchCourseContent = async () => {
    try {
      const response = await axios.get(`${API_URL}/content/course/${selectedCourse._id}`)
      setCourseContent(response.data)
    } catch (error) {
      console.error("Failed to fetch course content:", error)
    }
  }

  const fetchPerformanceStats = async () => {
    // Mock performance data - replace with actual API calls
    setPerformanceStats({
      totalViews: 12540,
      completionRate: 78,
      avgRating: 4.7,
      activeStudents: 234
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
      alert("Content uploaded successfully! Students will be notified.")
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
      alert("Failed to upload content")
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

  const deleteContent = async (contentId) => {
    if (window.confirm("Are you sure you want to delete this content?")) {
      try {
        await axios.delete(`${API_URL}/content/${contentId}`)
        fetchCourseContent() // Refresh content list
        alert("Content deleted successfully!")
      } catch (error) {
        alert("Failed to delete content")
      }
    }
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
      case 'pdf': return 'fas fa-file-pdf'
      case 'video': return 'fas fa-video'
      case 'live_class': return 'fas fa-chalkboard-teacher'
      default: return 'fas fa-file'
    }
  }

  const getContentColor = (type) => {
    switch (type) {
      case 'pdf': return 'text-red-600 bg-red-100'
      case 'video': return 'text-blue-600 bg-blue-100'
      case 'live_class': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md">
                <i className="fas fa-chalkboard-teacher text-white text-lg"></i>
              </div>
              <div>
                <span className="text-gray-900 font-bold text-xl">EduTech Faculty</span>
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
        {loading ? (
          <div className="text-center text-gray-600 py-20">
            <i className="fas fa-spinner fa-spin text-3xl mb-4 text-blue-600"></i>
            <p className="text-lg">Loading your dashboard...</p>
          </div>
        ) : (
          <>
            {/* Dashboard Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Total Courses</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{courses.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-book-open text-blue-600 text-xl"></i>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Active courses assigned</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Total Students</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{totalStudents}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-users text-green-600 text-xl"></i>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Across all courses</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Total Earnings</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">₹{totalEarnings}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-rupee-sign text-purple-600 text-xl"></i>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">From all enrollments</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Avg. Rating</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{performanceStats.avgRating}/5</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-star text-yellow-600 text-xl"></i>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Based on student feedback</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar - Course Selection */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 sticky top-24">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <i className="fas fa-list-ul text-blue-600"></i>
                    Your Courses
                  </h2>

                  {/* Filter Buttons */}
                  <div className="flex gap-2 mb-6">
                    <button
                      onClick={() => setFilterType("all")}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-1 ${
                        filterType === "all" 
                          ? "bg-blue-600 text-white" 
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <i className="fas fa-layer-group"></i>
                      All
                    </button>
                    <button
                      onClick={() => setFilterType("popular")}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-1 ${
                        filterType === "popular" 
                          ? "bg-blue-600 text-white" 
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <i className="fas fa-fire"></i>
                      Popular
                    </button>
                  </div>

                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {getFilteredCourses().length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <i className="fas fa-inbox text-3xl mb-2"></i>
                        <p>No courses assigned yet</p>
                      </div>
                    ) : (
                      getFilteredCourses().map((course) => (
                        <button
                          key={course._id}
                          onClick={() => setSelectedCourse(course)}
                          className={`w-full text-left p-4 rounded-lg transition-all duration-200 flex items-start gap-3 ${
                            selectedCourse?._id === course._id
                              ? "bg-blue-600 text-white shadow-lg transform scale-105"
                              : "bg-gray-50 text-gray-900 border border-gray-200 hover:border-blue-300 hover:shadow-md"
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            selectedCourse?._id === course._id ? 'bg-white text-blue-600' : 'bg-blue-100 text-blue-600'
                          }`}>
                            <i className="fas fa-graduation-cap"></i>
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-sm leading-tight">{course.title}</div>
                            <div className="text-xs opacity-75 mt-1">{course.category}</div>
                            <div className="text-xs mt-2 opacity-60 flex items-center gap-1">
                              <i className="fas fa-users"></i>
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
                {selectedCourse && (
                  <>
                    {/* Course Header */}
                    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 mb-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedCourse.title}</h2>
                          <p className="text-gray-600 mb-4">{selectedCourse.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <i className="fas fa-clock"></i>
                              Created: {new Date(selectedCourse.createdAt).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <i className="fas fa-tag"></i>
                              {selectedCourse.category}
                            </span>
                            <span className="flex items-center gap-1">
                              <i className="fas fa-rupee-sign"></i>
                              ₹{selectedCourse.price}
                            </span>
                          </div>
                        </div>
                        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                          {selectedCourse.level || "All Levels"}
                        </div>
                      </div>

                      {/* Quick Stats */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                        <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <i className="fas fa-users text-blue-600 text-xl mb-2"></i>
                          <div className="text-2xl font-bold text-blue-600">{(allEnrollments[selectedCourse._id] || []).length}</div>
                          <div className="text-xs text-gray-600">Enrolled</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                          <i className="fas fa-eye text-green-600 text-xl mb-2"></i>
                          <div className="text-2xl font-bold text-green-600">{performanceStats.totalViews}</div>
                          <div className="text-xs text-gray-600">Total Views</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                          <i className="fas fa-chart-line text-purple-600 text-xl mb-2"></i>
                          <div className="text-2xl font-bold text-purple-600">{performanceStats.completionRate}%</div>
                          <div className="text-xs text-gray-600">Completion</div>
                        </div>
                        <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                          <i className="fas fa-star text-orange-600 text-xl mb-2"></i>
                          <div className="text-2xl font-bold text-orange-600">{performanceStats.avgRating}</div>
                          <div className="text-xs text-gray-600">Rating</div>
                        </div>
                      </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 mb-6">
                      <div className="border-b border-gray-200">
                        <nav className="flex space-x-8 px-6">
                          {[
                            { id: "overview", name: "Overview", icon: "fas fa-chart-pie" },
                            { id: "students", name: "Students", icon: "fas fa-users" },
                            { id: "content", name: "Content", icon: "fas fa-file-alt" },
                            { id: "upload", name: "Upload", icon: "fas fa-upload" }
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
                        {/* Overview Tab */}
                        {activeTab === "overview" && (
                          <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                  <i className="fas fa-trending-up text-green-600"></i>
                                  Performance Overview
                                </h3>
                                <div className="space-y-3">
                                  <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Course Completion Rate</span>
                                    <span className="font-semibold text-green-600">{performanceStats.completionRate}%</span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Student Engagement</span>
                                    <span className="font-semibold text-blue-600">High</span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Average Watch Time</span>
                                    <span className="font-semibold text-purple-600">45 min</span>
                                  </div>
                                </div>
                              </div>
                              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                  <i className="fas fa-calendar-alt text-blue-600"></i>
                                  Recent Activity
                                </h3>
                                <div className="space-y-3">
                                  <div className="flex items-center gap-3 text-sm">
                                    <i className="fas fa-user-plus text-green-600"></i>
                                    <span>5 new students enrolled today</span>
                                  </div>
                                  <div className="flex items-center gap-3 text-sm">
                                    <i className="fas fa-comment text-blue-600"></i>
                                    <span>12 new discussion posts</span>
                                  </div>
                                  <div className="flex items-center gap-3 text-sm">
                                    <i className="fas fa-star text-yellow-600"></i>
                                    <span>3 new course ratings</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Students Tab */}
                        {activeTab === "students" && (
                          <div>
                            <div className="flex justify-between items-center mb-6">
                              <h3 className="text-xl font-bold text-gray-900">Enrolled Students ({filteredEnrollments.length})</h3>
                              <div className="relative">
                                <input
                                  type="text"
                                  placeholder="Search students..."
                                  value={searchTerm}
                                  onChange={(e) => setSearchTerm(e.target.value)}
                                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                />
                                <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                              </div>
                            </div>
                            
                            {filteredEnrollments.length === 0 ? (
                              <div className="text-center py-12 text-gray-500">
                                <i className="fas fa-users text-4xl mb-4 text-gray-300"></i>
                                <p className="text-lg">No students enrolled yet</p>
                                <p className="text-sm mt-2">Students will appear here once they enroll in your course</p>
                              </div>
                            ) : (
                              <div className="overflow-x-auto">
                                <table className="w-full">
                                  <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                      <th className="px-6 py-3 text-left text-gray-700 font-semibold">Student</th>
                                      <th className="px-6 py-3 text-left text-gray-700 font-semibold">Progress</th>
                                      <th className="px-6 py-3 text-left text-gray-700 font-semibold">Last Active</th>
                                      <th className="px-6 py-3 text-left text-gray-700 font-semibold">Enrolled Date</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-200">
                                    {filteredEnrollments.map((enrollment) => (
                                      <tr key={enrollment._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                          <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                              <i className="fas fa-user text-blue-600 text-sm"></i>
                                            </div>
                                            <div>
                                              <div className="font-medium text-gray-900">{enrollment.student.name}</div>
                                              <div className="text-sm text-gray-500">{enrollment.student.email}</div>
                                            </div>
                                          </div>
                                        </td>
                                        <td className="px-6 py-4">
                                          <div className="flex items-center gap-2">
                                            <div className="w-16 bg-gray-200 rounded-full h-2">
                                              <div className="bg-green-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                                            </div>
                                            <span className="text-sm text-gray-600">65%</span>
                                          </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                          {new Date().toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                          {new Date(enrollment.enrolledAt).toLocaleDateString()}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Content Tab */}
                        {activeTab === "content" && (
                          <div>
                            <div className="flex justify-between items-center mb-6">
                              <h3 className="text-xl font-bold text-gray-900">Course Content ({courseContent.length})</h3>
                              <button
                                onClick={() => setActiveTab("upload")}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold flex items-center gap-2"
                              >
                                <i className="fas fa-plus"></i>
                                Add Content
                              </button>
                            </div>

                            {courseContent.length === 0 ? (
                              <div className="text-center py-12 text-gray-500">
                                <i className="fas fa-folder-open text-4xl mb-4 text-gray-300"></i>
                                <p className="text-lg">No content uploaded yet</p>
                                <p className="text-sm mt-2">Start by uploading your first piece of content</p>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                {courseContent.map((content) => (
                                  <div key={content._id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getContentColor(content.type)}`}>
                                          <i className={`${getContentIcon(content.type)} text-lg`}></i>
                                        </div>
                                        <div>
                                          <h4 className="font-semibold text-gray-900">{content.title}</h4>
                                          <p className="text-sm text-gray-600">{content.description}</p>
                                          <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                                            <span className="flex items-center gap-1">
                                              <i className="fas fa-calendar"></i>
                                              {new Date(content.createdAt).toLocaleDateString()}
                                            </span>
                                            <span className="flex items-center gap-1">
                                              <i className="fas fa-eye"></i>
                                              245 views
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
                                          <i className="fas fa-edit"></i>
                                        </button>
                                        <button 
                                          onClick={() => deleteContent(content._id)}
                                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                        >
                                          <i className="fas fa-trash"></i>
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Upload Tab */}
                        {activeTab === "upload" && (
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Upload New Content</h3>
                            <form onSubmit={handleUploadContent} className="space-y-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                  <label className="block text-gray-700 text-sm font-semibold mb-2 flex items-center gap-2">
                                    <i className="fas fa-heading"></i>
                                    Content Title
                                  </label>
                                  <input
                                    type="text"
                                    value={contentForm.title}
                                    onChange={(e) => setContentForm({ ...contentForm, title: e.target.value })}
                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                                    placeholder="e.g., Lecture 1 - Algebra Basics"
                                    required
                                  />
                                </div>

                                <div>
                                  <label className="block text-gray-700 text-sm font-semibold mb-2 flex items-center gap-2">
                                    <i className="fas fa-file-alt"></i>
                                    Content Type
                                  </label>
                                  <select
                                    value={contentForm.type}
                                    onChange={(e) => setContentForm({ ...contentForm, type: e.target.value })}
                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                                  >
                                    <option value="pdf">PDF Materials</option>
                                    <option value="video">Video Lecture</option>
                                    <option value="live_class">Live Class</option>
                                  </select>
                                </div>
                              </div>

                              <div>
                                <label className="block text-gray-700 text-sm font-semibold mb-2 flex items-center gap-2">
                                  <i className="fas fa-align-left"></i>
                                  Description
                                </label>
                                <textarea
                                  value={contentForm.description}
                                  onChange={(e) => setContentForm({ ...contentForm, description: e.target.value })}
                                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                                  placeholder="Describe the content for your students..."
                                  rows="3"
                                />
                              </div>

                              {/* Dynamic Fields Based on Content Type */}
                              {contentForm.type === "pdf" && (
                                <div>
                                  <label className="block text-gray-700 text-sm font-semibold mb-2 flex items-center gap-2">
                                    <i className="fas fa-file-pdf"></i>
                                    PDF URL
                                  </label>
                                  <input
                                    type="url"
                                    value={contentForm.pdfUrl}
                                    onChange={(e) => setContentForm({ ...contentForm, pdfUrl: e.target.value })}
                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                                    placeholder="https://example.com/file.pdf"
                                    required
                                  />
                                </div>
                              )}

                              {contentForm.type === "video" && (
                                <div>
                                  <label className="block text-gray-700 text-sm font-semibold mb-2 flex items-center gap-2">
                                    <i className="fas fa-video"></i>
                                    Video URL
                                  </label>
                                  <input
                                    type="url"
                                    value={contentForm.videoUrl}
                                    onChange={(e) => setContentForm({ ...contentForm, videoUrl: e.target.value })}
                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                                    placeholder="https://youtube.com/watch?v=... or video file URL"
                                    required
                                  />
                                </div>
                              )}

                              {contentForm.type === "live_class" && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div>
                                    <label className="block text-gray-700 text-sm font-semibold mb-2 flex items-center gap-2">
                                      <i className="fas fa-link"></i>
                                      Live Class URL
                                    </label>
                                    <input
                                      type="url"
                                      value={contentForm.liveClassUrl}
                                      onChange={(e) => setContentForm({ ...contentForm, liveClassUrl: e.target.value })}
                                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                                      placeholder="https://meet.google.com/..."
                                      required
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-gray-700 text-sm font-semibold mb-2 flex items-center gap-2">
                                      <i className="fas fa-calendar"></i>
                                      Class Date
                                    </label>
                                    <input
                                      type="date"
                                      value={contentForm.liveClassDate}
                                      onChange={(e) => setContentForm({ ...contentForm, liveClassDate: e.target.value })}
                                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                                      required
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-gray-700 text-sm font-semibold mb-2 flex items-center gap-2">
                                      <i className="fas fa-clock"></i>
                                      Class Time
                                    </label>
                                    <input
                                      type="time"
                                      value={contentForm.liveClassTime}
                                      onChange={(e) => setContentForm({ ...contentForm, liveClassTime: e.target.value })}
                                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                                      required
                                    />
                                  </div>
                                </div>
                              )}

                              <button
                                type="submit"
                                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-bold shadow-lg flex items-center justify-center gap-2"
                              >
                                <i className="fas fa-upload"></i>
                                Upload Content
                              </button>
                            </form>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Notification Modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <i className="fas fa-bell text-blue-600"></i>
                  Notifications ({notifications.length})
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
                    <div
                      key={notif._id}
                      className="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition cursor-pointer"
                      onClick={() => markNotificationAsRead(notif._id)}
                    >
                      <div className="font-semibold text-gray-900 flex items-center gap-2">
                        <i className="fas fa-user-plus text-green-600"></i>
                        {notif.title}
                      </div>
                      <div className="text-sm text-gray-700 mt-1">{notif.message}</div>
                      <div className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                        <i className="fas fa-clock"></i>
                        {new Date(notif.createdAt).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <i className="fas fa-bell-slash text-3xl mb-2"></i>
                  <p>No new notifications</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}