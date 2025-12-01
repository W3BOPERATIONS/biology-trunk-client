"use client"

import { useState, useEffect } from "react"
import axios from "axios"

const API_URL = "https://biology-trunk-server.vercel.app/api"

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
    activeEnrollments: 0
  })

  // Advanced filters for courses
  const [courseFilters, setCourseFilters] = useState({
    class: "",
    faculty: "",
    category: ""
  })

  // Get unique classes and categories from courses
  const availableClasses = [...new Set(courses.map(course => course.class).filter(Boolean))]
  const availableCategories = [...new Set(courses.map(course => course.category).filter(Boolean))]

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

      // Calculate statistics with proper enrollment counting
      const totalRevenue = calculateTotalRevenue(enrollmentsData, coursesData)
      const totalEnrollments = enrollmentsData.length // Each enrollment is one student in one course
      
      setStats({
        totalStudents: studentsData.length,
        totalFaculty: facultyData.length,
        totalCourses: coursesData.length,
        totalEnrollments: totalEnrollments,
        totalRevenue: totalRevenue,
        activeEnrollments: totalEnrollments // Since all enrollments are considered active
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
      await axios.put(`${API_URL}/courses/${courseId}`, { faculty: facultyId })
      alert("Course assigned successfully")
      fetchData()
    } catch (error) {
      alert("Failed to assign course")
    }
  }

  const removeFacultyFromCourse = async (courseId) => {
    try {
      await axios.put(`${API_URL}/courses/${courseId}`, { faculty: null })
      alert("Faculty removed from course")
      fetchData()
    } catch (error) {
      alert("Failed to remove faculty")
    }
  }

  const calculateTotalRevenue = (enrollmentsData, coursesData) => {
    return enrollmentsData.reduce((total, enrollment) => {
      const course = coursesData.find(c => c._id === enrollment.course?._id || c._id === enrollment.course)
      const price = course?.price || 0
      return total + (typeof price === 'number' ? price : parseInt(price) || 0)
    }, 0)
  }

  const getRevenueByCourse = () => {
    const revenue = {}
    enrollments.forEach((e) => {
      const courseId = e.course?._id || e.course
      if (courseId) {
        const course = courses.find((c) => c._id === courseId)
        const price = course?.price || 0
        const numericPrice = typeof price === 'number' ? price : parseInt(price) || 0
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
          class: course?.class || "Not Specified"
        }
      })
      .sort((a, b) => b.amount - a.amount)
  }

  const getRecentEnrollments = () => {
    return [...enrollments]
      .sort((a, b) => new Date(b.enrolledAt) - new Date(a.enrolledAt))
      .slice(0, 5)
  }

  const getTopCourses = () => {
    return [...courses]
      .sort((a, b) => (b.students?.length || 0) - (a.students?.length || 0))
      .slice(0, 5)
  }

  const handleCloseNotification = () => {
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

    // Apply advanced filters
    if (courseFilters.class) {
      filtered = filtered.filter(course => course.class === courseFilters.class)
    }
    
    if (courseFilters.faculty) {
      filtered = filtered.filter(course => 
        course.faculty?._id === courseFilters.faculty || course.faculty === courseFilters.faculty
      )
    }
    
    if (courseFilters.category) {
      filtered = filtered.filter(course => course.category === courseFilters.category)
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
      setNotifications(notifications.filter(n => n._id !== notificationId))
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
    }
  }

  const clearCourseFilters = () => {
    setCourseFilters({
      class: "",
      faculty: "",
      category: ""
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <i className="fas fa-crown text-white text-lg"></i>
              </div>
              <div>
                <span className="text-gray-900 font-bold text-xl">EduTech Admin</span>
                <span className="text-blue-600 text-sm ml-2 font-medium">Dashboard</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotificationModal(true)}
                  className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
                >
                  <i className="fas fa-bell text-xl"></i>
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>
              </div>

              {/* User Info */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-gray-700 font-medium block">{user.name}</span>
                  <span className="text-gray-500 text-sm">Administrator</span>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {user.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </span>
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
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Total Students</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalStudents}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-users text-blue-600 text-xl"></i>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">Registered learners</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Total Faculty</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalFaculty}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-chalkboard-teacher text-green-600 text-xl"></i>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">Active instructors</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Total Courses</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalCourses}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-book text-purple-600 text-xl"></i>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">Available courses</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Active Enrollments</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activeEnrollments}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-user-graduate text-yellow-600 text-xl"></i>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">Current enrollments</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Total Enrollments</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalEnrollments}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-clipboard-list text-indigo-600 text-xl"></i>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">All enrollments count</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">₹{stats.totalRevenue.toLocaleString("en-IN")}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-rupee-sign text-orange-600 text-xl"></i>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">Generated revenue</p>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6 overflow-x-auto">
              {["overview", "students", "faculty", "courses", "enrollments", "revenue"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab)
                    setSearchTerm("")
                  }}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition ${
                    activeTab === tab
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <i className={`fas fa-${getTabIcon(tab)} mr-2`}></i>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Search Bar */}
            {activeTab !== "overview" && (
              <div className="mb-6">
                <div className="relative max-w-md">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={`Search ${activeTab}...`}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                </div>
              </div>
            )}

            {loading ? (
              <div className="text-center py-20">
                <i className="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
                <div className="text-gray-600 text-xl">Loading dashboard data...</div>
              </div>
            ) : (
              <>
                {/* Overview Tab */}
                {activeTab === "overview" && (
                  <div className="space-y-8">
                    {/* Recent Enrollments */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <i className="fas fa-clock text-blue-600"></i>
                          Recent Enrollments
                        </h3>
                        <div className="space-y-3">
                          {getRecentEnrollments().length > 0 ? (
                            getRecentEnrollments().map((enrollment) => (
                              <div key={enrollment._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                  <p className="font-semibold text-gray-900">{enrollment.student?.name}</p>
                                  <p className="text-sm text-gray-600">{enrollment.course?.title}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm text-gray-500">
                                    {new Date(enrollment.enrolledAt).toLocaleDateString()}
                                  </p>
                                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                    Active
                                  </span>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-500 text-center py-4">No recent enrollments</p>
                          )}
                        </div>
                      </div>

                      {/* Top Courses */}
                      <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <i className="fas fa-trophy text-yellow-600"></i>
                          Top Courses
                        </h3>
                        <div className="space-y-3">
                          {getTopCourses().length > 0 ? (
                            getTopCourses().map((course, index) => (
                              <div key={course._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <span className="text-blue-600 font-bold text-sm">{index + 1}</span>
                                  </div>
                                  <div>
                                    <p className="font-semibold text-gray-900">{course.title}</p>
                                    <p className="text-sm text-gray-600">{course.faculty?.name || "Unassigned"}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-lg font-bold text-blue-600">{course.students?.length || 0}</p>
                                  <p className="text-xs text-gray-500">students</p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-500 text-center py-4">No courses available</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Revenue Overview */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Revenue Overview</h3>
                      <div className="space-y-4">
                        {getRevenueByCourse().length > 0 ? (
                          getRevenueByCourse().slice(0, 3).map((item, idx) => (
                            <div key={idx} className="bg-white p-4 rounded-lg border border-gray-200">
                              <div className="flex justify-between items-center mb-2">
                                <div>
                                  <div className="font-bold text-gray-900">{item.course}</div>
                                  <div className="text-sm text-gray-600">
                                    Faculty: {item.faculty} • Students: {item.students}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-xl font-bold text-blue-600">₹{item.amount.toLocaleString("en-IN")}</div>
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
                          <p className="text-gray-600 text-center py-4">No revenue data available</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Students Tab */}
                {activeTab === "students" && (
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-6 py-4 text-left text-gray-700 font-semibold">Student</th>
                            <th className="px-6 py-4 text-left text-gray-700 font-semibold">Email</th>
                            <th className="px-6 py-4 text-left text-gray-700 font-semibold">Phone</th>
                            <th className="px-6 py-4 text-left text-gray-700 font-semibold">Joined</th>
                            <th className="px-6 py-4 text-left text-gray-700 font-semibold">Enrollments</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {getFilteredStudents().map((student) => {
                            const studentEnrollments = enrollments.filter(e => e.student?._id === student._id).length
                            return (
                              <tr key={student._id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                      <span className="text-blue-600 font-bold text-sm">
                                        {student.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                                      </span>
                                    </div>
                                    <span className="text-gray-900 font-medium">{student.name}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-gray-600">{student.email}</td>
                                <td className="px-6 py-4 text-gray-600">{student.phone || "N/A"}</td>
                                <td className="px-6 py-4 text-gray-600">{new Date(student.createdAt).toLocaleDateString()}</td>
                                <td className="px-6 py-4">
                                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
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

                {/* Faculty Tab */}
                {activeTab === "faculty" && (
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-6 py-4 text-left text-gray-700 font-semibold">Faculty</th>
                            <th className="px-6 py-4 text-left text-gray-700 font-semibold">Email</th>
                            <th className="px-6 py-4 text-left text-gray-700 font-semibold">Phone</th>
                            <th className="px-6 py-4 text-left text-gray-700 font-semibold">Courses</th>
                            <th className="px-6 py-4 text-left text-gray-700 font-semibold">Students</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {getFilteredFaculty().map((fac) => {
                            const assignedCourses = courses.filter((c) => c.faculty === fac._id || c.faculty?._id === fac._id)
                            const totalStudents = assignedCourses.reduce((sum, c) => sum + (c.students?.length || 0), 0)
                            return (
                              <tr key={fac._id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                      <span className="text-green-600 font-bold text-sm">
                                        {fac.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                                      </span>
                                    </div>
                                    <span className="text-gray-900 font-medium">{fac.name}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-gray-600">{fac.email}</td>
                                <td className="px-6 py-4 text-gray-600">{fac.phone || "N/A"}</td>
                                <td className="px-6 py-4">
                                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                    {assignedCourses.length}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
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

                {/* Courses Tab */}
                {activeTab === "courses" && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-2xl font-bold text-gray-900">Course Management</h3>
                      <button
                        onClick={() => setShowCourseManagement(!showCourseManagement)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold flex items-center gap-2"
                      >
                        <i className={`fas fa-${showCourseManagement ? 'times' : 'cogs'}`}></i>
                        {showCourseManagement ? "Close Management" : "Manage Faculty"}
                      </button>
                    </div>

                    {/* Advanced Course Filters */}
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                      <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <i className="fas fa-filter text-blue-600"></i>
                        Advanced Filters
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Class</label>
                          <select
                            value={courseFilters.class}
                            onChange={(e) => setCourseFilters(prev => ({ ...prev, class: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                          <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Faculty</label>
                          <select
                            value={courseFilters.faculty}
                            onChange={(e) => setCourseFilters(prev => ({ ...prev, faculty: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                          <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Category</label>
                          <select
                            value={courseFilters.category}
                            onChange={(e) => setCourseFilters(prev => ({ ...prev, category: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                            className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-semibold flex items-center justify-center gap-2"
                          >
                            <i className="fas fa-times"></i>
                            Clear Filters
                          </button>
                        </div>
                      </div>
                    </div>

                    {showCourseManagement && (
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                        <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <i className="fas fa-user-tie text-blue-600"></i>
                          Faculty Assignment
                        </h4>
                        <div className="space-y-4">
                          {getFilteredCourses().map((course) => (
                            <div key={course._id} className="bg-white p-4 rounded-lg border border-gray-200">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                <div>
                                  <p className="font-semibold text-gray-900">{course.title}</p>
                                  <div className="flex gap-2 mt-1">
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
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                        <span className="text-green-600 font-bold text-xs">
                                          {course.faculty.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                                        </span>
                                      </div>
                                      <span className="text-gray-700">
                                        <strong>{course.faculty.name}</strong>
                                      </span>
                                      <button
                                        onClick={() => removeFacultyFromCourse(course._id)}
                                        className="ml-auto px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition flex items-center gap-1"
                                      >
                                        <i className="fas fa-times"></i>
                                        Remove
                                      </button>
                                    </div>
                                  ) : (
                                    <select
                                      onChange={(e) => assignCourseToFaculty(course._id, e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                                <div className="text-right">
                                  <p className="text-sm text-gray-600">Enrolled: {course.students?.length || 0}</p>
                                  <p className="text-lg font-bold text-blue-600">₹{course.price || 0}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                              <th className="px-6 py-4 text-left text-gray-700 font-semibold">Course Title</th>
                              <th className="px-6 py-4 text-left text-gray-700 font-semibold">Class</th>
                              <th className="px-6 py-4 text-left text-gray-700 font-semibold">Category</th>
                              <th className="px-6 py-4 text-left text-gray-700 font-semibold">Faculty</th>
                              <th className="px-6 py-4 text-left text-gray-700 font-semibold">Price</th>
                              <th className="px-6 py-4 text-left text-gray-700 font-semibold">Students</th>
                              <th className="px-6 py-4 text-left text-gray-700 font-semibold">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {getFilteredCourses().map((course) => (
                              <tr key={course._id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                      <i className="fas fa-book text-purple-600"></i>
                                    </div>
                                    <div>
                                      <p className="text-gray-900 font-medium">{course.title}</p>
                                      <p className="text-sm text-gray-600 truncate max-w-xs">{course.description}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                                    {course.class || "Not Specified"}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                    {course.category}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  {course.faculty ? (
                                    <div className="flex items-center gap-2">
                                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                        <span className="text-green-600 font-bold text-xs">
                                          {course.faculty.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                                        </span>
                                      </div>
                                      <span className="text-gray-700">{course.faculty.name}</span>
                                    </div>
                                  ) : (
                                    <span className="text-gray-400">Unassigned</span>
                                  )}
                                </td>
                                <td className="px-6 py-4 text-gray-900 font-semibold">₹{course.price || 0}</td>
                                <td className="px-6 py-4">
                                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                    {course.students?.length || 0}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
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

                {/* Enrollments Tab */}
                {activeTab === "enrollments" && (
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-6 py-4 text-left text-gray-700 font-semibold">Student</th>
                            <th className="px-6 py-4 text-left text-gray-700 font-semibold">Course</th>
                            <th className="px-6 py-4 text-left text-gray-700 font-semibold">Class</th>
                            <th className="px-6 py-4 text-left text-gray-700 font-semibold">Faculty</th>
                            <th className="px-6 py-4 text-left text-gray-700 font-semibold">Enrolled Date</th>
                            <th className="px-6 py-4 text-left text-gray-700 font-semibold">Amount</th>
                            <th className="px-6 py-4 text-left text-gray-700 font-semibold">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {getFilteredEnrollments().map((enrollment) => {
                            const course = courses.find(c => c._id === enrollment.course?._id || c._id === enrollment.course)
                            return (
                              <tr key={enrollment._id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                      <span className="text-blue-600 font-bold text-sm">
                                        {enrollment.student?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                                      </span>
                                    </div>
                                    <span className="text-gray-900 font-medium">{enrollment.student?.name}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-gray-600">{course?.title}</td>
                                <td className="px-6 py-4">
                                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                                    {course?.class || "Not Specified"}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-gray-600">{course?.faculty?.name || "N/A"}</td>
                                <td className="px-6 py-4 text-gray-600">
                                  {new Date(enrollment.enrolledAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-green-600 font-semibold">
                                  ₹{course?.price || 0}
                                </td>
                                <td className="px-6 py-4">
                                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
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

                {/* Revenue Tab */}
                {activeTab === "revenue" && (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-8 text-white">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-2xl font-bold mb-2">Total Revenue</h3>
                          <p className="text-blue-100">All-time generated revenue from course enrollments</p>
                        </div>
                        <div className="text-right">
                          <div className="text-4xl font-bold">₹{stats.totalRevenue.toLocaleString("en-IN")}</div>
                          <p className="text-blue-100">from {stats.totalEnrollments} enrollments</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h4 className="text-lg font-bold text-gray-900 mb-4">Revenue by Course</h4>
                        <div className="space-y-4">
                          {getRevenueByCourse().length > 0 ? (
                            getRevenueByCourse().map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex-1">
                                  <div className="font-semibold text-gray-900">{item.course}</div>
                                  <div className="text-sm text-gray-600">
                                    {item.faculty} • {item.class}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="font-bold text-blue-600">₹{item.amount.toLocaleString("en-IN")}</div>
                                  <div className="text-xs text-gray-500">
                                    {item.students} students
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-500 text-center py-4">No revenue data available</p>
                          )}
                        </div>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h4 className="text-lg font-bold text-gray-900 mb-4">Revenue Distribution</h4>
                        <div className="space-y-4">
                          {getRevenueByCourse().slice(0, 5).map((item, idx) => (
                            <div key={idx} className="space-y-2">
                              <div className="flex justify-between text-sm">
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

      {/* Notification Modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <i className="fas fa-bell text-blue-600"></i>
                Notifications
              </h3>
              <button
                onClick={handleCloseNotification}
                className="text-gray-600 hover:text-gray-900 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition"
                    onClick={() => {
                      setSelectedNotification(notification)
                      markNotificationAsRead(notification._id)
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-900">{notification.title}</h4>
                        <p className="text-gray-700 text-sm mt-1">{notification.message}</p>
                      </div>
                      <span className="w-2 h-2 bg-blue-600 rounded-full mt-2"></span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No new notifications</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Helper function to get tab icons
function getTabIcon(tab) {
  const icons = {
    overview: "chart-pie",
    students: "users",
    faculty: "chalkboard-teacher",
    courses: "book",
    enrollments: "clipboard-list",
    revenue: "rupee-sign"
  }
  return icons[tab] || "chart-bar"
}