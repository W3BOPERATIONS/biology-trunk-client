"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"
import axios from "axios"
import { API_URL } from "../utils/api.js"
import { showErrorToast } from "../utils/toast.js"
import logo from "../assets/biology-trunk-logo.png"

const COURSES_PER_PAGE = 9

export default function ViewAllCourses() {
  const navigate = useNavigate()
  const location = useLocation()
  const [courses, setCourses] = useState([])
  const [filteredCourses, setFilteredCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [categories, setCategories] = useState([])
  const [courseLevels, setCourseLevels] = useState([])
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const categoryParam = searchParams.get("category")
    if (categoryParam) {
      setSelectedCategory(decodeURIComponent(categoryParam))
      // Scroll to courses section after state update and data load
      setTimeout(() => {
        const coursesSection = document.getElementById("courses-section")
        if (coursesSection) {
          const headerOffset = 100
          const elementPosition = coursesSection.getBoundingClientRect().top
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset
          
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          })
        }
      }, 500) // Increased timeout to ensure data is loaded
    }
  }, [location.search])

  useEffect(() => {
    fetchCourses()
  }, [])

  useEffect(() => {
    filterAndSortCourses()
  }, [courses, searchTerm, selectedCategory, selectedLevel, sortBy, currentPage])

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${API_URL}/courses`)

      // Handle both array response and object with courses property
      let coursesData = []
      if (Array.isArray(response.data)) {
        coursesData = response.data
      } else if (response.data && response.data.courses && Array.isArray(response.data.courses)) {
        coursesData = response.data.courses
      } else {
        console.error("Unexpected API response format:", response.data)
        showErrorToast("Failed to parse courses data")
        return
      }

      setCourses(coursesData)

      // Extract unique categories with course counts
      const categoryMap = {}
      coursesData.forEach((course) => {
        if (course.category) {
          if (!categoryMap[course.category]) {
            categoryMap[course.category] = { name: course.category, count: 0 }
          }
          categoryMap[course.category].count++
        }
      })

      const uniqueCategories = Object.values(categoryMap)
      setCategories(uniqueCategories)

      // Extract unique course levels
      const levels = [...new Set(coursesData.map((course) => course.courseLevel).filter(Boolean))]
      setCourseLevels(levels)

      setLoading(false)
    } catch (error) {
      console.error("Failed to fetch courses:", error)
      showErrorToast("Failed to load courses")
      setLoading(false)
    }
  }

  const filterAndSortCourses = () => {
    let filtered = [...courses]

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (course) =>
          course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.faculty?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((course) => course.category === selectedCategory)
    }

    // Apply level filter
    if (selectedLevel !== "all") {
      filtered = filtered.filter((course) => course.courseLevel === selectedLevel)
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        case "oldest":
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
        case "price-low":
          return (a.price || 0) - (b.price || 0)
        case "price-high":
          return (b.price || 0) - (a.price || 0)
        case "popular":
          return (b.students?.length || 0) - (a.students?.length || 0)
        default:
          return 0
      }
    })

    const total = Math.ceil(filtered.length / COURSES_PER_PAGE)
    setTotalPages(total)

    // Get courses for current page
    const startIndex = (currentPage - 1) * COURSES_PER_PAGE
    const paginatedCourses = filtered.slice(startIndex, startIndex + COURSES_PER_PAGE)

    setFilteredCourses(paginatedCourses)
  }

  const handleCourseClick = (courseId) => {
    navigate(`/course-preview/${courseId}`)
  }

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName)
    setCurrentPage(1) // Reset to first page when category changes
    // Update URL without page reload
    if (categoryName === "all") {
      navigate("/view-all-courses", { replace: true })
    } else {
      navigate(`/view-all-courses?category=${encodeURIComponent(categoryName)}`, { replace: true })
    }
    
    // Scroll to courses section with delay to ensure rendering
    setTimeout(() => {
      const coursesSection = document.getElementById("courses-section")
      if (coursesSection) {
        const headerOffset = 100
        const elementPosition = coursesSection.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset
        
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        })
      }
    }, 100)
  }

  const handleResetFilters = () => {
    setSearchTerm("")
    setSelectedCategory("all")
    setSelectedLevel("all")
    setSortBy("newest")
    setCurrentPage(1) // Reset pagination
    navigate("/view-all-courses", { replace: true })
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 100)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
          <p className="text-gray-600 text-lg">Loading courses...</p>
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
            <div className="flex items-center gap-2 sm:gap-3 cursor-pointer" onClick={() => navigate("/")}>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center overflow-hidden">
                <img
                  src={logo || "/placeholder.svg"}
                  alt="Biology.Trunk Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="hidden sm:block">
                <span className="text-gray-900 font-bold text-lg sm:text-xl">Biology.Trunk</span>
                <p className="text-xs text-gray-500">All Courses</p>
              </div>
              <div className="sm:hidden">
                <span className="text-gray-900 font-bold text-base">Courses</span>
                <p className="text-xs text-gray-500">Browse All</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => navigate("/")}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold flex items-center gap-1 sm:gap-2 text-sm sm:text-base cursor-pointer"
              >
                <i className="fas fa-home text-sm"></i>
                <span className="hidden sm:inline">Home</span>
              </button>
              <button
                onClick={() => navigate("/login")}
                className="px-3 sm:px-4 py-1.5 sm:py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition font-semibold flex items-center gap-1 sm:gap-2 text-sm sm:text-base cursor-pointer"
              >
                <i className="fas fa-sign-in-alt text-sm"></i>
                <span className="hidden sm:inline">Login</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8 lg:mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Explore All Courses</h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Discover {courses.length}+ courses to enhance your biology knowledge
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600 text-sm sm:text-base">
                Showing {Math.min(currentPage * COURSES_PER_PAGE - COURSES_PER_PAGE + 1, courses.length)} -{" "}
                {Math.min(currentPage * COURSES_PER_PAGE, courses.length)} of {courses.length} courses
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4 sm:mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fas fa-search text-gray-400"></i>
            </div>
            <input
              type="text"
              placeholder="Search courses by title, description, or instructor..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1) // Reset to first page on search
              }}
              className="w-full pl-10 pr-4 py-3 sm:py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base hover:border-blue-300 transition cursor-pointer"
            />
          </div>

          {/* Categories Section - UPDATED TO MATCH HOME PAGE STYLING */}
          <div className="mb-8 sm:mb-10 lg:mb-12">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <i className="fas fa-tags text-blue-600"></i>
              Browse by Category
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {/* All Categories Card */}
              <div
                onClick={() => handleCategoryClick("all")}
                className={`bg-white p-4 sm:p-5 rounded-xl border border-gray-200 hover:shadow-xl hover:border-blue-300 transition-all duration-300 cursor-pointer group ${selectedCategory === "all" ? "border-blue-600 bg-blue-50" : ""}`}
              >
                <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 rounded-xl flex items-center justify-center transition-colors group-hover:bg-blue-600 ${selectedCategory === "all" ? "bg-blue-600" : ""}`}>
                    <i className={`fas fa-th-large text-blue-600 text-lg sm:text-xl group-hover:text-white transition-colors ${selectedCategory === "all" ? "text-white" : ""}`}></i>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-gray-900 text-sm sm:text-base line-clamp-1">
                      All Categories
                    </div>
                    <div className="text-gray-500 text-xs sm:text-sm">
                      {courses.length} Courses
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center text-xs sm:text-sm text-gray-600">
                  <span className="font-medium">
                    {Math.round(courses.length * 1.2)}K+ Students
                  </span>
                  <i className="fas fa-arrow-right text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity text-base"></i>
                </div>
              </div>

              {/* Category Cards */}
              {categories.map((category) => (
                <div
                  key={category.name}
                  onClick={() => handleCategoryClick(category.name)}
                  className={`bg-white p-4 sm:p-5 rounded-xl border border-gray-200 hover:shadow-xl hover:border-blue-300 transition-all duration-300 cursor-pointer group ${selectedCategory === category.name ? "border-blue-600 bg-blue-50" : ""}`}
                >
                  <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 rounded-xl flex items-center justify-center transition-colors group-hover:bg-blue-600 ${selectedCategory === category.name ? "bg-blue-600" : ""}`}>
                      <i className={`fas fa-book text-blue-600 text-lg sm:text-xl group-hover:text-white transition-colors ${selectedCategory === category.name ? "text-white" : ""}`}></i>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-gray-900 text-sm sm:text-base line-clamp-1" title={category.name}>
                        {category.name}
                      </div>
                      <div className="text-gray-500 text-xs sm:text-sm">
                        {category.count} Courses
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-xs sm:text-sm text-gray-600">
                    <span className="font-medium">
                      {Math.round(category.count * 1.2)}K+ Students
                    </span>
                    <i className="fas fa-arrow-right text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity text-base"></i>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Filters and Sort Section */}
          <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 mb-6 sm:mb-8 lg:mb-10 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-wrap">
                {/* Level Filter */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Level</label>
                  <select
                    value={selectedLevel}
                    onChange={(e) => {
                      setSelectedLevel(e.target.value)
                      setCurrentPage(1) // Reset pagination on filter change
                    }}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[140px] cursor-pointer hover:border-blue-300 transition"
                  >
                    <option value="all">All Levels</option>
                    {courseLevels.map((level, idx) => (
                      <option key={idx} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value)
                      setCurrentPage(1) // Reset pagination on sort change
                    }}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[160px] cursor-pointer hover:border-blue-300 transition"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="popular">Most Popular</option>
                  </select>
                </div>

                {/* Reset Filters Button */}
                {(selectedCategory !== "all" || selectedLevel !== "all" || searchTerm || sortBy !== "newest") && (
                  <div className="flex items-end">
                    <button
                      onClick={handleResetFilters}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm flex items-center gap-2 cursor-pointer hover:border-blue-300"
                    >
                      <i className="fas fa-redo text-xs"></i>
                      Reset Filters
                    </button>
                  </div>
                )}
              </div>

              <div className="text-sm text-gray-600">
                {selectedCategory !== "all" && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Category:</span>
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                      {selectedCategory}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Courses Grid Section - UNCHANGED */}
          <div id="courses-section" className="mb-8 sm:mb-10 lg:mb-12">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
                <i className="fas fa-book-open text-blue-600"></i>
                {selectedCategory === "all" ? "All Courses" : `${selectedCategory} Courses`}
              </h2>
            </div>

            {filteredCourses.length === 0 ? (
              <div className="text-center py-12 sm:py-16 lg:py-20 bg-white rounded-xl border border-gray-200 shadow-sm">
                <i className="fas fa-search text-4xl sm:text-5xl lg:text-6xl mb-4 text-gray-300"></i>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">No courses found</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto text-sm sm:text-base">
                  {searchTerm
                    ? `No courses match "${searchTerm}"`
                    : "Try adjusting your filters to find what you're looking for."}
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-sm sm:text-base cursor-pointer shadow hover:shadow-lg"
                >
                  <i className="fas fa-redo mr-2"></i>
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                {/* Course cards - UNCHANGED */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-8">
                  {filteredCourses.map((course) => (
                    <div
                      key={course._id}
                      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-blue-300 transition-all duration-300 cursor-pointer group flex flex-col h-full"
                    >
                      {/* Course Image/Thumbnail Area */}
                      <div
                        className="relative h-40 sm:h-44 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center overflow-hidden border-b border-gray-200"
                        onClick={() => handleCourseClick(course._id)}
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

                        {/* Course Level Badge */}
                        {course.courseLevel && (
                          <div className="absolute top-2 right-2">
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-lg text-xs font-semibold">
                              {course.courseLevel}
                            </span>
                          </div>
                        )}

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                      </div>

                      {/* Course Content - Improved spacing and parallel alignment */}
                      <div className="p-4 sm:p-5 flex flex-col flex-grow">
                        {/* Course Title with consistent height */}
                        <h3
                          className="font-bold text-gray-900 text-lg sm:text-xl mb-2 group-hover:text-blue-600 transition cursor-pointer min-h-[56px] flex items-start"
                          onClick={() => handleCourseClick(course._id)}
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
                            <button
                              onClick={() => handleCourseClick(course._id)}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-sm flex items-center gap-2 cursor-pointer shadow hover:shadow-md"
                            >
                              <i className="fas fa-eye text-xs"></i>
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 py-6 mb-8">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer hover:border-blue-300"
                    >
                      <i className="fas fa-chevron-left"></i>
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 rounded-lg font-semibold transition cursor-pointer ${currentPage === page
                            ? "bg-blue-600 text-white shadow-md"
                            : "border border-gray-300 hover:bg-gray-100 hover:border-blue-300"
                          }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer hover:border-blue-300"
                    >
                      <i className="fas fa-chevron-right"></i>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Call to Action Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 sm:p-8 lg:p-10 text-center shadow-sm">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                Ready to start learning?
              </h3>
              <p className="text-gray-700 text-sm sm:text-base mb-4 sm:mb-6 max-w-lg mx-auto">
                Browse courses, view details, and enroll to start your learning journey. Login is only required for
                enrollment.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <button
                  onClick={() => navigate("/")}
                  className="w-full sm:w-auto px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-sm sm:text-base whitespace-nowrap cursor-pointer shadow hover:shadow-lg"
                >
                  <i className="fas fa-home mr-2"></i>
                  Back to Home
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="w-full sm:w-auto px-6 py-2.5 sm:py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition font-semibold text-sm sm:text-base whitespace-nowrap cursor-pointer hover:border-blue-700"
                >
                  <i className="fas fa-sign-in-alt mr-2"></i>
                  Login to Enroll
                </button>
              </div>
              <p className="text-gray-500 text-xs sm:text-sm mt-4 sm:mt-6">
                <i className="fas fa-shield-alt text-green-600 mr-1"></i>
                7-day money-back guarantee • Lifetime access • Certificate included
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Same as home page */}
      <footer className="bg-gray-900 text-gray-300 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-6">
            <div>
              <h4 className="text-white font-bold mb-2 sm:mb-3 text-base sm:text-lg">About Biology.Trunk</h4>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                India's premier online learning platform providing quality education led by Ph.D. experts, NET & GATE
                qualified faculty with 15+ years of government college teaching experience.
              </p>
              <div className="flex gap-2 sm:gap-3 mt-2">
                <a href="#" className="text-gray-400 hover:text-white transition cursor-pointer">
                  <i className="fab fa-facebook text-sm"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition cursor-pointer">
                  <i className="fab fa-twitter text-sm"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition cursor-pointer">
                  <i className="fab fa-linkedin text-sm"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition cursor-pointer">
                  <i className="fab fa-instagram text-sm"></i>
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-2 sm:mb-3 text-base sm:text-lg">Courses</h4>
              <ul className="text-xs sm:text-sm space-y-1.5">
                {[
                  "Classes 9-12",
                  "JEE Preparation",
                  "NEET Preparation",
                  "AIIMS Paramedical",
                  "Nursing Entrance",
                  "CUET (UG)",
                  "TGT/PGT Preparation",
                  "KVS/NVS",
                  "NET & GATE",
                  "KYPS Olympiad",
                  "Foreign Languages",
                ].map((item) => (
                  <li key={item}>
                    <div 
                      onClick={() => handleCategoryClick(item)}
                      className="text-gray-400 hover:text-white transition flex items-center gap-1 cursor-pointer"
                    >
                      <i className="fas fa-chevron-right text-xs"></i>
                      {item}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-2 sm:mb-3 text-base sm:text-lg">Faculty Credentials</h4>
              <ul className="text-xs sm:text-sm space-y-1.5">
                {[
                  "Ph.D. Holders",
                  "NET & GATE Qualified",
                  // "Ex Government College Lecturers",
                  "15+ Years Experience",
                  "IIT/NIT Alumni",
                  "Subject Matter Experts",
                ].map((item) => (
                  <li key={item}>
                    <div className="text-gray-400 flex items-center gap-1">
                      <i className="fas fa-check text-green-500 text-xs"></i>
                      {item}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-2 sm:mb-3 text-base sm:text-lg">Legal</h4>
              <ul className="text-xs sm:text-sm space-y-1.5">
                <li>
                  <Link
                    to="/privacy-policy"
                    className="text-gray-400 hover:text-white transition flex items-center gap-1 cursor-pointer"
                  >
                    <i className="fas fa-chevron-right text-xs"></i>
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms-conditions"
                    className="text-gray-400 hover:text-white transition flex items-center gap-1 cursor-pointer"
                  >
                    <i className="fas fa-chevron-right text-xs"></i>
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    to="/refund-policy"
                    className="text-gray-400 hover:text-white transition flex items-center gap-1 cursor-pointer"
                  >
                    <i className="fas fa-chevron-right text-xs"></i>
                    Refund Policy
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-400 hover:text-white transition flex items-center gap-1 cursor-pointer">
                    <i className="fas fa-chevron-right text-xs"></i>
                    Contact Support
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-4 text-center">
            <p className="text-xs sm:text-sm text-gray-400">
              <i className="fas fa-copyright mr-1"></i>
              2025 Biology.Trunk. All rights reserved. | Excellence in Education through Expert Guidance
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}