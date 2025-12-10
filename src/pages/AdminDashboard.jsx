"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { API_URL } from "../utils/api.js"
import logo from "../assets/biology-trunk-logo.png"
import { showSuccessToast, showErrorToast } from "../utils/toast.js"

export default function AdminDashboard({ user, onLogout }) {
  const [students, setStudents] = useState([])
  const [faculty, setFaculty] = useState([])
  const [courses, setCourses] = useState([])
  const [enrollments, setEnrollments] = useState([])
  const [notifications, setNotifications] = useState([])
  const [activeTab, setActiveTab] = useState("overview")
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedNotification, setSelectedNotification] = useState(null)
  const [showNotificationModal, setShowNotificationModal] = useState(false)
  const [showCourseManagement, setShowCourseManagement] = useState(false)
  const [availableFaculty, setAvailableFaculty] = useState([])
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalFaculty: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    totalRevenue: 0,
    activeEnrollments: 0,
  })

  const [courseFilters, setCourseFilters] = useState({
    class: "",
    faculty: "",
    category: "",
  })

  const availableClasses = [...new Set(courses.map((course) => course.class).filter(Boolean))]
  const availableCategories = [...new Set(courses.map((course) => course.category).filter(Boolean))]

  useEffect(() => {
    fetchData()
    loadAvailableFaculty()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [studentsRes, facultyRes, coursesRes, enrollmentsRes, notificationsRes] = await Promise.all([
        axios.get(`${API_URL}/users/role/student`),
        axios.get(`${API_URL}/users/role/faculty`),
        axios.get(`${API_URL}/courses?limit=100`),
        axios.get(`${API_URL}/enrollments`),
        axios.get(`${API_URL}/notifications/user/${user._id}`),
      ])

      const studentsData = studentsRes.data || []
      const facultyData = facultyRes.data || []
      const coursesData = coursesRes.data.courses || coursesRes.data || []
      const enrollmentsData = enrollmentsRes.data || []

      setStudents(studentsData)
      setFaculty(facultyData)
      setCourses(coursesData)
      setEnrollments(enrollmentsData)
      setNotifications(notificationsRes.data?.filter((n) => !n.read) || [])

      const totalRevenue = calculateTotalRevenue(enrollmentsData, coursesData)
      const totalEnrollments = enrollmentsData.length

      setStats({
        totalStudents: studentsData.length,
        totalFaculty: facultyData.length,
        totalCourses: coursesData.length,
        totalEnrollments: totalEnrollments,
        totalRevenue: totalRevenue,
        activeEnrollments: totalEnrollments,
      })

      setLoading(false)
    } catch (error) {
      console.error("Failed to fetch data:", error)
      setLoading(false)
    }
  }

  const loadAvailableFaculty = async () => {
    try {
      const res = await axios.get(`${API_URL}/users/role/faculty`)
      setAvailableFaculty(res.data || [])
    } catch (error) {
      console.error("Failed to fetch faculty:", error)
    }
  }

  const assignCourseToFaculty = async (courseId, facultyId) => {
    try {
      await axios.put(`${API_URL}/courses/${courseId}`, {
        faculty: facultyId,
        isAdmin: true,
      })
      // Replace: alert("Course assigned successfully")
      // With: showSuccessToast("Course assigned successfully")
      showSuccessToast("Course assigned successfully")
      fetchData()
    } catch (error) {
      // Replace: alert("Failed to assign course")
      // With: showErrorToast("Failed to assign course")
      showErrorToast("Failed to assign course")
    }
  }

  const removeFacultyFromCourse = async (courseId) => {
    try {
      await axios.put(`${API_URL}/courses/${courseId}`, {
        faculty: null,
        isAdmin: true,
      })
      // Replace: alert("Faculty removed from course")
      // With: showSuccessToast("Faculty removed from course")
      showSuccessToast("Faculty removed from course")
      fetchData()
    } catch (error) {
      // Replace: alert("Failed to remove faculty")
      // With: showErrorToast("Failed to remove faculty")
      showErrorToast("Failed to remove faculty")
    }
  }

  const calculateTotalRevenue = (enrollmentsData, coursesData) => {
    return enrollmentsData.reduce((total, enrollment) => {
      const course = coursesData.find((c) => c._id === enrollment.course?._id || c._id === enrollment.course)
      const price = course?.price || 0
      return total + (typeof price === "number" ? price : Number.parseInt(price) || 0)
    }, 0)
  }

  const getRevenueByCourse = () => {
    const revenue = {}
    enrollments.forEach((e) => {
      const courseId = e.course?._id || e.course
      if (courseId) {
        const course = courses.find((c) => c._id === courseId)
        const price = course?.price || 0
        const numericPrice = typeof price === "number" ? price : Number.parseInt(price) || 0
        revenue[courseId] = (revenue[courseId] || 0) + numericPrice
      }
    })
    return Object.entries(revenue)
      .map(([courseId, amount]) => {
        const course = courses.find((c) => c._id === courseId)
        return {
          course: course?.title || "Unknown Course",
          amount,
          faculty: course?.faculty?.name || "Unassigned",
          students: course?.students?.length || 0,
          class: course?.class || "Not Specified",
        }
      })
      .sort((a, b) => b.amount - a.amount)
  }

  const getRecentEnrollments = () => {
    return [...enrollments].sort((a, b) => new Date(b.enrolledAt) - new Date(a.enrolledAt)).slice(0, 5)
  }

  const getTopCourses = () => {
    return [...courses].sort((a, b) => (b.students?.length || 0) - (a.students?.length || 0)).slice(0, 5)
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

  const getFilteredStudents = () => {
    return students.filter(
      (s) =>
        s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }

  const getFilteredFaculty = () => {
    return faculty.filter(
      (f) =>
        f.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.email?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }

  const getFilteredCourses = () => {
    let filtered = courses.filter(
      (c) =>
        c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.class?.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    if (courseFilters.class) {
      filtered = filtered.filter((course) => course.class === courseFilters.class)
    }

    if (courseFilters.faculty) {
      filtered = filtered.filter(
        (course) => course.faculty?._id === courseFilters.faculty || course.faculty === courseFilters.faculty,
      )
    }

    if (courseFilters.category) {
      filtered = filtered.filter((course) => course.category === courseFilters.category)
    }

    return filtered
  }

  const getFilteredEnrollments = () => {
    return enrollments.filter(
      (e) =>
        e.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.course?.title?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }

  const markNotificationAsRead = async (notificationId) => {
    try {
      await axios.put(`${API_URL}/notifications/${notificationId}/read`)
      setNotifications(notifications.filter((n) => n._id !== notificationId))
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
    }
  }

  const clearCourseFilters = () => {
    setCourseFilters({
      class: "",
      faculty: "",
      category: "",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
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
                <p className="text-xs text-gray-500">Admin Portal - Welcome, {user.name}</p>
              </div>
              <div className="sm:hidden">
                <span className="text-gray-900 font-bold text-base">Admin</span>
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

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm font-semibold uppercase tracking-wide">Total Students</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">
                  {stats.totalStudents}
                </p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-users text-blue-600 text-sm sm:text-base lg:text-xl"></i>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1 sm:mt-2 lg:mt-3">Registered learners</p>
          </div>

          <div className="bg-white rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm font-semibold uppercase tracking-wide">Total Faculty</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">
                  {stats.totalFaculty}
                </p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-chalkboard-teacher text-green-600 text-sm sm:text-base lg:text-xl"></i>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1 sm:mt-2 lg:mt-3">Active instructors</p>
          </div>

          <div className="bg-white rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm font-semibold uppercase tracking-wide">Total Courses</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">
                  {stats.totalCourses}
                </p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-book text-purple-600 text-sm sm:text-base lg:text-xl"></i>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1 sm:mt-2 lg:mt-3">Available courses</p>
          </div>

          <div className="bg-white rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm font-semibold uppercase tracking-wide">
                  Active Enrollments
                </p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">
                  {stats.activeEnrollments}
                </p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-user-graduate text-yellow-600 text-sm sm:text-base lg:text-xl"></i>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1 sm:mt-2 lg:mt-3">Current enrollments</p>
          </div>

          <div className="bg-white rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm font-semibold uppercase tracking-wide">
                  Total Enrollments
                </p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">
                  {stats.totalEnrollments}
                </p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-clipboard-list text-indigo-600 text-sm sm:text-base lg:text-xl"></i>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1 sm:mt-2 lg:mt-3">All enrollments count</p>
          </div>

          <div className="bg-white rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm font-semibold uppercase tracking-wide">Total Revenue</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">
                  ₹{stats.totalRevenue.toLocaleString("en-IN")}
                </p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-rupee-sign text-orange-600 text-sm sm:text-base lg:text-xl"></i>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1 sm:mt-2 lg:mt-3">Generated revenue</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 sm:mb-8 overflow-hidden">
          <div className="border-b border-gray-200 overflow-x-auto">
            <nav className="flex space-x-2 sm:space-x-4 lg:space-x-8 px-3 sm:px-4 lg:px-6 min-w-max">
              {["overview", "students", "faculty", "courses", "enrollments", "revenue"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab)
                    setSearchTerm("")
                  }}
                  className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition ${
                    activeTab === tab
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <i className={`fas fa-${getTabIcon(tab)} mr-1 sm:mr-2 text-xs sm:text-sm`}></i>
                  <span className="hidden sm:inline">{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
                  <span className="sm:hidden">
                    {tab === "overview"
                      ? "Home"
                      : tab === "enrollments"
                        ? "Enroll"
                        : tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-3 sm:p-4 lg:p-6">
            {activeTab !== "overview" && (
              <div className="mb-4 sm:mb-6">
                <div className="relative max-w-full sm:max-w-md">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={`Search ${activeTab}...`}
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                  <i className="fas fa-search absolute left-3 top-2.5 sm:top-3 text-gray-400 text-sm"></i>
                </div>
              </div>
            )}

            {loading ? (
              <div className="text-center py-12 sm:py-16 lg:py-20">
                <i className="fas fa-spinner fa-spin text-3xl sm:text-4xl text-blue-600 mb-3 sm:mb-4"></i>
                <div className="text-gray-600 text-base sm:text-lg">Loading dashboard data...</div>
              </div>
            ) : (
              <>
                {activeTab === "overview" && (
                  <div className="space-y-6 sm:space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                          <i className="fas fa-clock text-blue-600 text-sm sm:text-base"></i>
                          Recent Enrollments
                        </h3>
                        <div className="space-y-2 sm:space-y-3">
                          {getRecentEnrollments().length > 0 ? (
                            getRecentEnrollments().map((enrollment) => (
                              <div
                                key={enrollment._id}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                              >
                                <div className="min-w-0">
                                  <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                                    {enrollment.student?.name}
                                  </p>
                                  <p className="text-xs sm:text-sm text-gray-600 truncate">
                                    {enrollment.course?.title}
                                  </p>
                                </div>
                                <div className="text-right pl-2">
                                  <p className="text-xs sm:text-sm text-gray-500">
                                    {new Date(enrollment.enrolledAt).toLocaleDateString()}
                                  </p>
                                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium mt-1">
                                    Active
                                  </span>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-500 text-center py-4 text-sm sm:text-base">No recent enrollments</p>
                          )}
                        </div>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                          <i className="fas fa-trophy text-yellow-600 text-sm sm:text-base"></i>
                          Top Courses
                        </h3>
                        <div className="space-y-2 sm:space-y-3">
                          {getTopCourses().length > 0 ? (
                            getTopCourses().map((course, index) => (
                              <div
                                key={course._id}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                              >
                                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <span className="text-blue-600 font-bold text-xs sm:text-sm">{index + 1}</span>
                                  </div>
                                  <div className="min-w-0">
                                    <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                                      {course.title}
                                    </p>
                                    <p className="text-xs sm:text-sm text-gray-600 truncate">
                                      {course.faculty?.name || "Unassigned"}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right pl-2 flex-shrink-0">
                                  <p className="text-base sm:text-lg font-bold text-blue-600">
                                    {course.students?.length || 0}
                                  </p>
                                  <p className="text-xs text-gray-500">students</p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-500 text-center py-4 text-sm sm:text-base">No courses available</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6 border border-blue-200">
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Revenue Overview</h3>
                      <div className="space-y-3 sm:space-y-4">
                        {getRevenueByCourse().length > 0 ? (
                          getRevenueByCourse()
                            .slice(0, 3)
                            .map((item, idx) => (
                              <div key={idx} className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-2">
                                  <div className="min-w-0">
                                    <div className="font-bold text-gray-900 text-sm sm:text-base truncate">
                                      {item.course}
                                    </div>
                                    <div className="text-xs sm:text-sm text-gray-600 truncate">
                                      Faculty: {item.faculty} • Students: {item.students}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-lg sm:text-xl font-bold text-blue-600">
                                      ₹{item.amount.toLocaleString("en-IN")}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {Math.round((item.amount / stats.totalRevenue) * 100)}% of total
                                    </div>
                                  </div>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${(item.amount / stats.totalRevenue) * 100}%` }}
                                  />
                                </div>
                              </div>
                            ))
                        ) : (
                          <p className="text-gray-600 text-center py-4 text-sm sm:text-base">
                            No revenue data available
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "students" && (
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-max">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-3 sm:px-4 lg:px-6 py-3 text-left text-gray-700 font-semibold text-xs sm:text-sm">
                              Student
                            </th>
                            <th className="px-3 sm:px-4 lg:px-6 py-3 text-left text-gray-700 font-semibold text-xs sm:text-sm">
                              Email
                            </th>
                            <th className="px-3 sm:px-4 lg:px-6 py-3 text-left text-gray-700 font-semibold text-xs sm:text-sm">
                              Phone
                            </th>
                            <th className="px-3 sm:px-4 lg:px-6 py-3 text-left text-gray-700 font-semibold text-xs sm:text-sm">
                              Joined
                            </th>
                            <th className="px-3 sm:px-4 lg:px-6 py-3 text-left text-gray-700 font-semibold text-xs sm:text-sm">
                              Enrollments
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {getFilteredStudents().map((student) => {
                            const studentEnrollments = enrollments.filter((e) => e.student?._id === student._id).length
                            return (
                              <tr key={student._id} className="hover:bg-gray-50 transition">
                                <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                                  <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                      <span className="text-blue-600 font-bold text-xs">
                                        {student.name
                                          ?.split(" ")
                                          .map((n) => n[0])
                                          .join("")
                                          .toUpperCase()}
                                      </span>
                                    </div>
                                    <span className="text-gray-900 font-medium text-xs sm:text-sm truncate">
                                      {student.name}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-gray-600 text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none">
                                  {student.email}
                                </td>
                                <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-gray-600 text-xs sm:text-sm">
                                  {student.phone || "N/A"}
                                </td>
                                <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-gray-600 text-xs sm:text-sm">
                                  {new Date(student.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                    {studentEnrollments}
                                  </span>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeTab === "faculty" && (
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-max">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-3 sm:px-4 lg:px-6 py-3 text-left text-gray-700 font-semibold text-xs sm:text-sm">
                              Faculty
                            </th>
                            <th className="px-3 sm:px-4 lg:px-6 py-3 text-left text-gray-700 font-semibold text-xs sm:text-sm">
                              Email
                            </th>
                            <th className="px-3 sm:px-4 lg:px-6 py-3 text-left text-gray-700 font-semibold text-xs sm:text-sm">
                              Phone
                            </th>
                            <th className="px-3 sm:px-4 lg:px-6 py-3 text-left text-gray-700 font-semibold text-xs sm:text-sm">
                              Courses
                            </th>
                            <th className="px-3 sm:px-4 lg:px-6 py-3 text-left text-gray-700 font-semibold text-xs sm:text-sm">
                              Students
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {getFilteredFaculty().map((fac) => {
                            const assignedCourses = courses.filter(
                              (c) => c.faculty === fac._id || c.faculty?._id === fac._id,
                            )
                            const totalStudents = assignedCourses.reduce((sum, c) => sum + (c.students?.length || 0), 0)
                            return (
                              <tr key={fac._id} className="hover:bg-gray-50 transition">
                                <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                                  <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                      <span className="text-green-600 font-bold text-xs">
                                        {fac.name
                                          ?.split(" ")
                                          .map((n) => n[0])
                                          .join("")
                                          .toUpperCase()}
                                      </span>
                                    </div>
                                    <span className="text-gray-900 font-medium text-xs sm:text-sm truncate">
                                      {fac.name}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-gray-600 text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none">
                                  {fac.email}
                                </td>
                                <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-gray-600 text-xs sm:text-sm">
                                  {fac.phone || "N/A"}
                                </td>
                                <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                    {assignedCourses.length}
                                  </span>
                                </td>
                                <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                    {totalStudents}
                                  </span>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeTab === "courses" && (
                  <div className="space-y-4 sm:space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Course Management</h3>
                      <button
                        onClick={() => setShowCourseManagement(!showCourseManagement)}
                        className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold flex items-center gap-1 sm:gap-2 text-sm w-full sm:w-auto justify-center"
                      >
                        <i className={`fas fa-${showCourseManagement ? "times" : "cogs"} text-xs sm:text-sm`}></i>
                        <span className="hidden sm:inline">
                          {showCourseManagement ? "Close Management" : "Manage Faculty"}
                        </span>
                        <span className="sm:hidden">{showCourseManagement ? "Close" : "Manage"}</span>
                      </button>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-6">
                      <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                        <i className="fas fa-filter text-blue-600 text-sm sm:text-base"></i>
                        Advanced Filters
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                            Filter by Class
                          </label>
                          <select
                            value={courseFilters.class}
                            onChange={(e) => setCourseFilters((prev) => ({ ...prev, class: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          >
                            <option value="">All Classes</option>
                            {availableClasses.map((classItem) => (
                              <option key={classItem} value={classItem}>
                                {classItem}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                            Filter by Faculty
                          </label>
                          <select
                            value={courseFilters.faculty}
                            onChange={(e) => setCourseFilters((prev) => ({ ...prev, faculty: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          >
                            <option value="">All Faculty</option>
                            {availableFaculty.map((fac) => (
                              <option key={fac._id} value={fac._id}>
                                {fac.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                            Filter by Category
                          </label>
                          <select
                            value={courseFilters.category}
                            onChange={(e) => setCourseFilters((prev) => ({ ...prev, category: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          >
                            <option value="">All Categories</option>
                            {availableCategories.map((category) => (
                              <option key={category} value={category}>
                                {category}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="flex items-end">
                          <button
                            onClick={clearCourseFilters}
                            className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-semibold flex items-center justify-center gap-2 text-sm"
                          >
                            <i className="fas fa-times text-xs"></i>
                            Clear Filters
                          </button>
                        </div>
                      </div>
                    </div>

                    {showCourseManagement && (
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6">
                        <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                          <i className="fas fa-user-tie text-blue-600 text-sm sm:text-base"></i>
                          Faculty Assignment
                        </h4>
                        <div className="space-y-3 sm:space-y-4">
                          {getFilteredCourses().map((course) => (
                            <div key={course._id} className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 items-center">
                                <div>
                                  <p className="font-semibold text-gray-900 text-sm sm:text-base">{course.title}</p>
                                  <div className="flex gap-1 sm:gap-2 mt-1">
                                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                                      {course.class}
                                    </span>
                                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                                      {course.category}
                                    </span>
                                  </div>
                                </div>
                                <div>
                                  {course.faculty ? (
                                    <div className="flex items-center gap-2 sm:gap-3">
                                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-green-600 font-bold text-xs">
                                          {course.faculty.name
                                            ?.split(" ")
                                            .map((n) => n[0])
                                            .join("")
                                            .toUpperCase()}
                                        </span>
                                      </div>
                                      <span className="text-gray-700 text-sm sm:text-base">
                                        <strong>{course.faculty.name}</strong>
                                      </span>
                                      <button
                                        onClick={() => removeFacultyFromCourse(course._id)}
                                        className="ml-auto px-2 sm:px-3 py-1 bg-red-500 text-white text-xs sm:text-sm rounded hover:bg-red-600 transition flex items-center gap-1"
                                      >
                                        <i className="fas fa-times text-xs"></i>
                                        Remove
                                      </button>
                                    </div>
                                  ) : (
                                    <select
                                      onChange={(e) => assignCourseToFaculty(course._id, e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                      defaultValue=""
                                    >
                                      <option value="">Select Faculty...</option>
                                      {availableFaculty.map((fac) => (
                                        <option key={fac._id} value={fac._id}>
                                          {fac.name}
                                        </option>
                                      ))}
                                    </select>
                                  )}
                                </div>
                                {course.faculty && (
                                  <div>
                                    <select
                                      onChange={(e) => {
                                        if (e.target.value) {
                                          assignCourseToFaculty(course._id, e.target.value)
                                          // Reset the select value after assignment to allow re-selection
                                          e.target.value = ""
                                        }
                                      }}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                      defaultValue=""
                                    >
                                      <option value="">Change Faculty...</option>
                                      {availableFaculty.map((fac) => (
                                        <option key={fac._id} value={fac._id}>
                                          {fac.name}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-max">
                          <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                              <th className="px-3 sm:px-4 lg:px-6 py-3 text-left text-gray-700 font-semibold text-xs sm:text-sm">
                                Course Title
                              </th>
                              <th className="px-3 sm:px-4 lg:px-6 py-3 text-left text-gray-700 font-semibold text-xs sm:text-sm">
                                Class
                              </th>
                              <th className="px-3 sm:px-4 lg:px-6 py-3 text-left text-gray-700 font-semibold text-xs sm:text-sm">
                                Category
                              </th>
                              <th className="px-3 sm:px-4 lg:px-6 py-3 text-left text-gray-700 font-semibold text-xs sm:text-sm">
                                Faculty
                              </th>
                              <th className="px-3 sm:px-4 lg:px-6 py-3 text-left text-gray-700 font-semibold text-xs sm:text-sm">
                                Price
                              </th>
                              <th className="px-3 sm:px-4 lg:px-6 py-3 text-left text-gray-700 font-semibold text-xs sm:text-sm">
                                Students
                              </th>
                              <th className="px-3 sm:px-4 lg:px-6 py-3 text-left text-gray-700 font-semibold text-xs sm:text-sm">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {getFilteredCourses().map((course) => (
                              <tr key={course._id} className="hover:bg-gray-50 transition">
                                <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                                  <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                      <i className="fas fa-book text-purple-600 text-sm"></i>
                                    </div>
                                    <div className="min-w-0">
                                      <p className="text-gray-900 font-medium text-sm sm:text-base truncate">
                                        {course.title}
                                      </p>
                                      <p className="text-xs sm:text-sm text-gray-600 truncate max-w-[200px]">
                                        {course.description}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm">
                                    {course.class || "Not Specified"}
                                  </span>
                                </td>
                                <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs sm:text-sm">
                                    {course.category}
                                  </span>
                                </td>
                                <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                                  {course.faculty ? (
                                    <div className="flex items-center gap-2">
                                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-green-600 font-bold text-xs">
                                          {course.faculty.name
                                            ?.split(" ")
                                            .map((n) => n[0])
                                            .join("")
                                            .toUpperCase()}
                                        </span>
                                      </div>
                                      <span className="text-gray-700 text-xs sm:text-sm truncate">
                                        {course.faculty.name}
                                      </span>
                                    </div>
                                  ) : (
                                    <span className="text-gray-400 text-xs sm:text-sm">Unassigned</span>
                                  )}
                                </td>
                                <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-gray-900 font-semibold text-sm sm:text-base">
                                  ₹{course.price || 0}
                                </td>
                                <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                    {course.students?.length || 0}
                                  </span>
                                </td>
                                <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                    Active
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "enrollments" && (
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-max">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-3 sm:px-4 lg:px-6 py-3 text-left text-gray-700 font-semibold text-xs sm:text-sm">
                              Student
                            </th>
                            <th className="px-3 sm:px-4 lg:px-6 py-3 text-left text-gray-700 font-semibold text-xs sm:text-sm">
                              Course
                            </th>
                            <th className="px-3 sm:px-4 lg:px-6 py-3 text-left text-gray-700 font-semibold text-xs sm:text-sm">
                              Class
                            </th>
                            <th className="px-3 sm:px-4 lg:px-6 py-3 text-left text-gray-700 font-semibold text-xs sm:text-sm">
                              Faculty
                            </th>
                            <th className="px-3 sm:px-4 lg:px-6 py-3 text-left text-gray-700 font-semibold text-xs sm:text-sm">
                              Enrolled Date
                            </th>
                            <th className="px-3 sm:px-4 lg:px-6 py-3 text-left text-gray-700 font-semibold text-xs sm:text-sm">
                              Amount
                            </th>
                            <th className="px-3 sm:px-4 lg:px-6 py-3 text-left text-gray-700 font-semibold text-xs sm:text-sm">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {getFilteredEnrollments().map((enrollment) => {
                            const course = courses.find(
                              (c) => c._id === enrollment.course?._id || c._id === enrollment.course,
                            )
                            return (
                              <tr key={enrollment._id} className="hover:bg-gray-50 transition">
                                <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                                  <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                      <span className="text-blue-600 font-bold text-xs">
                                        {enrollment.student?.name
                                          ?.split(" ")
                                          .map((n) => n[0])
                                          .join("")
                                          .toUpperCase()}
                                      </span>
                                    </div>
                                    <span className="text-gray-900 font-medium text-xs sm:text-sm truncate">
                                      {enrollment.student?.name}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-gray-600 text-xs sm:text-sm truncate">
                                  {course?.title}
                                </td>
                                <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                                    {course?.class || "Not Specified"}
                                  </span>
                                </td>
                                <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-gray-600 text-xs sm:text-sm truncate">
                                  {course?.faculty?.name || "N/A"}
                                </td>
                                <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-gray-600 text-xs sm:text-sm">
                                  {new Date(enrollment.enrolledAt).toLocaleDateString()}
                                </td>
                                <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-green-600 font-semibold text-sm sm:text-base">
                                  ₹{course?.price || 0}
                                </td>
                                <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                    {enrollment.status || "Active"}
                                  </span>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeTab === "revenue" && (
                  <div className="space-y-4 sm:space-y-6">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 sm:p-8 text-white">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                        <div>
                          <h3 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">Total Revenue</h3>
                          <p className="text-blue-100 text-sm sm:text-base">
                            All-time generated revenue from course enrollments
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                            ₹{stats.totalRevenue.toLocaleString("en-IN")}
                          </div>
                          <p className="text-blue-100 text-sm">from {stats.totalEnrollments} enrollments</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
                        <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Revenue by Course</h4>
                        <div className="space-y-3 sm:space-y-4">
                          {getRevenueByCourse().length > 0 ? (
                            getRevenueByCourse().map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex-1 min-w-0">
                                  <div className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                                    {item.course}
                                  </div>
                                  <div className="text-xs sm:text-sm text-gray-600 truncate">
                                    {item.faculty} • {item.class}
                                  </div>
                                </div>
                                <div className="text-right pl-2 flex-shrink-0">
                                  <div className="font-bold text-blue-600 text-sm sm:text-base">
                                    ₹{item.amount.toLocaleString("en-IN")}
                                  </div>
                                  <div className="text-xs text-gray-500">{item.students} students</div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-500 text-center py-4 text-sm sm:text-base">
                              No revenue data available
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
                        <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">
                          Revenue Distribution
                        </h4>
                        <div className="space-y-3 sm:space-y-4">
                          {getRevenueByCourse()
                            .slice(0, 5)
                            .map((item, idx) => (
                              <div key={idx} className="space-y-2">
                                <div className="flex justify-between text-xs sm:text-sm">
                                  <span className="text-gray-700 truncate">{item.course}</span>
                                  <span className="text-gray-900 font-medium">
                                    {Math.round((item.amount / stats.totalRevenue) * 100)}%
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${(item.amount / stats.totalRevenue) * 100}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {showNotificationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-full sm:max-w-md w-full mx-4 shadow-xl">
            <div className="flex justify-between items-center mb-3 sm:mb-4 p-4 sm:p-6 border-b">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-1 sm:gap-2">
                <i className="fas fa-bell text-blue-600 text-sm sm:text-base"></i>
                Notifications
              </h3>
              {/* CHANGE: Updated close button to call handleCloseNotificationModal for auto-dismiss */}
              <button
                onClick={handleCloseNotificationModal}
                className="text-gray-600 hover:text-gray-900 text-xl sm:text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="space-y-2 sm:space-y-3 max-h-[60vh] sm:max-h-96 overflow-y-auto p-4 sm:p-6">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className="p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition"
                    onClick={() => {
                      setSelectedNotification(notification)
                      markNotificationAsRead(notification._id)
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{notification.title}</h4>
                        <p className="text-gray-700 text-xs sm:text-sm mt-1 line-clamp-2">{notification.message}</p>
                      </div>
                      <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 ml-2 flex-shrink-0"></span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 sm:mt-2">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4 text-sm sm:text-base">No new notifications</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function getTabIcon(tab) {
  const icons = {
    overview: "chart-pie",
    students: "users",
    faculty: "chalkboard-teacher",
    courses: "book",
    enrollments: "clipboard-list",
    revenue: "rupee-sign",
  }
  return icons[tab] || "chart-bar"
}
