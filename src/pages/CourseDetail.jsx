"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { API_URL } from "../utils/api.js"
import { showSuccessToast, showErrorToast } from "../utils/toast.js"
import logo from "../assets/biology-trunk-logo.png"

export default function CourseDetail({ user, onLogout }) {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [content, setContent] = useState([])
  const [loading, setLoading] = useState(true)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [selectedContent, setSelectedContent] = useState(null)
  const [progress, setProgress] = useState({})
  const [completedItems, setCompletedItems] = useState(new Set())
  const [searchTerm, setSearchTerm] = useState("")
  const [contentFilter, setContentFilter] = useState("all")
  const [notes, setNotes] = useState({})
  const [showNotes, setShowNotes] = useState(false)
  const [activeTab, setActiveTab] = useState("content")

  useEffect(() => {
    fetchCourseAndContent()
    checkEnrollment()
  }, [courseId])

  const fetchCourseAndContent = async () => {
    try {
      const [courseRes, contentRes] = await Promise.all([
        axios.get(`${API_URL}/courses/${courseId}`),
        axios.get(`${API_URL}/content/course/${courseId}`),
      ])
      setCourse(courseRes.data)
      const sortedContent = contentRes.data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      setContent(sortedContent)

      if (sortedContent.length > 0) {
        setSelectedContent(sortedContent[0])
      }

      setLoading(false)
    } catch (error) {
      console.error("Failed to fetch course:", error)
      showErrorToast("Failed to load course content")
      setLoading(false)
    }
  }

  const checkEnrollment = async () => {
    try {
      const enrollmentsRes = await axios.get(`${API_URL}/enrollments/student/${user._id}`)
      const isEnrolledInCourse = enrollmentsRes.data.some((e) => e.course._id === courseId)
      setIsEnrolled(isEnrolledInCourse)

      if (isEnrolledInCourse) {
        fetchProgress()
      }
    } catch (error) {
      console.error("Failed to check enrollment:", error)
    }
  }

  const fetchProgress = async () => {
    try {
      const progressRes = await axios.get(`${API_URL}/progress/course/${courseId}/student/${user._id}`)
      setProgress(progressRes.data || {})

      if (progressRes.data?.completedContent) {
        setCompletedItems(new Set(progressRes.data.completedContent))
      }
    } catch (error) {
      console.error("Failed to fetch progress:", error)
      setProgress({ completedContent: [], percentage: 0 })
    }
  }

  const markAsCompleted = async (contentId) => {
    try {
      await axios.post(`${API_URL}/progress/mark-completed`, {
        studentId: user._id,
        courseId,
        contentId,
      })

      const updatedCompleted = new Set(completedItems)
      if (updatedCompleted.has(contentId)) {
        updatedCompleted.delete(contentId)
      } else {
        updatedCompleted.add(contentId)
        showSuccessToast("Content marked as completed!")
      }
      setCompletedItems(updatedCompleted)

      const newProgress = (updatedCompleted.size / content.length) * 100
      setProgress((prev) => ({ ...prev, percentage: Math.round(newProgress) }))
    } catch (error) {
      console.error("Failed to update progress:", error)
      showErrorToast("Failed to update progress")
    }
  }

  const saveNote = (contentId, noteText) => {
    const updatedNotes = { ...notes, [contentId]: noteText }
    setNotes(updatedNotes)
    localStorage.setItem(`notes_${courseId}_${user._id}`, JSON.stringify(updatedNotes))
  }

  const loadNotes = () => {
    const savedNotes = localStorage.getItem(`notes_${courseId}_${user._id}`)
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes))
    }
  }

  useEffect(() => {
    loadNotes()
  }, [courseId, user._id])

  const handleBack = () => {
    const referrer = document.referrer
    const dashboardTab = sessionStorage.getItem("dashboardTab")

    // If coming from student dashboard and we have a saved tab, restore it
    if (referrer.includes("/student-dashboard") && dashboardTab) {
      navigate(`/student-dashboard?tab=${dashboardTab}`)
    } else if (referrer.includes("/student-dashboard")) {
      navigate("/student-dashboard")
    } else {
      navigate("/student-dashboard?tab=my-courses")
    }
  }

  const filteredContent = content.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = contentFilter === "all" || item.type === contentFilter
    return matchesSearch && matchesFilter
  })

  const getContentIcon = (type) => {
    switch (type) {
      case "pdf":
        return "fas fa-file-pdf"
      case "video":
        return "fas fa-video"
      case "live_class":
        return "fas fa-video"
      default:
        return "fas fa-file"
    }
  }

  const getContentTypeColor = (type) => {
    switch (type) {
      case "pdf":
        return "bg-red-100 text-red-800 border-red-200"
      case "video":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "live_class":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Function to get YouTube embed URL
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null

    // Handle YouTube URLs
    if (url.includes("youtube.com/watch?v=")) {
      const videoId = url.split("v=")[1]?.split("&")[0]
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null
    } else if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0]
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null
    } else if (url.includes("youtube.com/embed/")) {
      return url
    }

    // Handle Vimeo URLs
    if (url.includes("vimeo.com/")) {
      const videoId = url.split("vimeo.com/")[1]?.split("/")[1] || url.split("vimeo.com/")[1]
      return videoId ? `https://player.vimeo.com/video/${videoId}` : null
    }

    // Return original URL for other cases (might be direct video URL)
    return url
  }

  // Function to check if URL is a video streaming service
  const isStreamingService = (url) => {
    return url.includes("youtube") || url.includes("youtu.be") || url.includes("vimeo")
  }

  const renderContent = (item) => {
    if (!item) return null

    switch (item.type) {
      case "pdf":
        return (
          <div className="space-y-3 sm:space-y-4">
            <p className="text-gray-700 whitespace-pre-wrap break-words text-sm sm:text-base">
              {item.description || "PDF Document"}
            </p>
            {item.pdfUrl && (
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 flex-wrap">
                <a
                  href={item.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold text-sm sm:text-base"
                >
                  <i className="fas fa-download text-xs sm:text-sm"></i>
                  <span>Download PDF</span>
                </a>
                {item.pdfUrl.includes("drive.google.com") ? (
                  <a
                    href={item.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-sm sm:text-base"
                  >
                    <i className="fas fa-eye text-xs sm:text-sm"></i>
                    <span>View Online</span>
                  </a>
                ) : (
                  <a
                    href={`https://docs.google.com/viewer?url=${encodeURIComponent(item.pdfUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-sm sm:text-base"
                  >
                    <i className="fas fa-eye text-xs sm:text-sm"></i>
                    <span>View Online</span>
                  </a>
                )}
              </div>
            )}
          </div>
        )
      case "video":
        const embedUrl = getYouTubeEmbedUrl(item.videoUrl)
        const isStreaming = isStreamingService(item.videoUrl)

        return (
          <div className="space-y-3 sm:space-y-4">
            <p className="text-gray-700 text-sm sm:text-base">{item.description}</p>

            {item.videoUrl && (
              <div className="space-y-3 sm:space-y-4">
                {isStreaming && embedUrl ? (
                  <div className="bg-black rounded-lg overflow-hidden shadow-lg">
                    <div className="relative pb-[56.25%]">
                      {" "}
                      {/* 16:9 aspect ratio */}
                      <iframe
                        src={embedUrl}
                        className="absolute top-0 left-0 w-full h-full"
                        allowFullScreen
                        title={item.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 sm:space-y-3">
                    <div className="bg-black rounded-lg overflow-hidden shadow-lg">
                      <div className="relative pb-[56.25%]">
                        {" "}
                        {/* 16:9 aspect ratio */}
                        <video
                          controls
                          className="absolute top-0 left-0 w-full h-full"
                          poster={item.thumbnail || "/default-video-thumbnail.jpg"}
                        >
                          <source src={item.videoUrl} type="video/mp4" />
                          <source src={item.videoUrl} type="video/webm" />
                          <source src={item.videoUrl} type="video/ogg" />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    </div>
                    <div className="text-center">
                      <a
                        href={item.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-sm sm:text-base"
                      >
                        <i className="fas fa-external-link-alt text-xs sm:text-sm"></i>
                        <span>Open Video in New Tab</span>
                      </a>
                    </div>
                  </div>
                )}

                {/* Video fallback message */}
                {!isStreaming && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <i className="fas fa-exclamation-triangle text-yellow-600 mt-0.5 text-sm sm:text-base"></i>
                      <div>
                        <p className="text-yellow-800 font-medium text-sm sm:text-base">Video Playback Note</p>
                        <p className="text-yellow-700 text-xs sm:text-sm">
                          If the video doesn't play, try opening it in a new tab using the button above.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      case "live_class":
        const isUpcoming = new Date(item.liveClassDate) > new Date()
        return (
          <div className="space-y-3 sm:space-y-4">
            <p className="text-gray-700 text-sm sm:text-base">{item.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
              <div className="bg-yellow-50 p-3 sm:p-4 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-1 sm:gap-2 mb-1">
                  <i className="fas fa-calendar text-yellow-600 text-sm"></i>
                  <span className="font-semibold text-gray-700">Date:</span>
                </div>
                <span className="text-gray-700">{new Date(item.liveClassDate).toLocaleDateString()}</span>
              </div>
              <div className="bg-yellow-50 p-3 sm:p-4 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-1 sm:gap-2 mb-1">
                  <i className="fas fa-clock text-yellow-600 text-sm"></i>
                  <span className="font-semibold text-gray-700">Time:</span>
                </div>
                <span className="text-gray-700">{item.liveClassTime}</span>
              </div>
            </div>
            {item.liveClassUrl && (
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 flex-wrap">
                <a
                  href={item.liveClassUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 text-white rounded-lg transition font-semibold text-sm sm:text-base ${
                    isUpcoming ? "bg-green-600 hover:bg-green-700" : "bg-gray-600 hover:bg-gray-700"
                  }`}
                >
                  <i className="fas fa-video text-xs sm:text-sm"></i>
                  <span>{isUpcoming ? "Join Live Class" : "Watch Recording"}</span>
                </a>
                {isUpcoming && (
                  <button className="inline-flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-sm sm:text-base">
                    <i className="fas fa-bell text-xs sm:text-sm"></i>
                    <span>Set Reminder</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )
      default:
        return (
          <div className="space-y-3 sm:space-y-4">
            <p className="text-gray-700 text-sm sm:text-base">{item.description}</p>
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-sm sm:text-base"
              >
                <i className="fas fa-external-link-alt text-xs sm:text-sm"></i>
                <span>Open Resource</span>
              </a>
            )}
          </div>
        )
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-3xl sm:text-4xl text-blue-600 mb-3 sm:mb-4"></i>
          <div className="text-gray-600 text-lg sm:text-xl">Loading course content...</div>
        </div>
      </div>
    )
  }

  if (!isEnrolled) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md">
          <i className="fas fa-lock text-4xl sm:text-6xl text-gray-400 mb-3 sm:mb-4"></i>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Access Restricted</h1>
          <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
            You must be enrolled in this course to view its content.
          </p>
          {/* <button
            onClick={() => navigate("/student-dashboard")}
            className="px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-sm sm:text-base flex items-center justify-center gap-1 sm:gap-2 mx-auto"
          >
            <i className="fas fa-arrow-left text-xs sm:text-sm"></i>
            <span>Back to Dashboard</span>
          </button> */}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={handleBack}
                className="text-gray-600 hover:text-gray-900 text-base sm:text-lg flex-shrink-0"
                aria-label="Go back"
              >
                <i className="fas fa-arrow-left"></i>
              </button>
              {/* Logo - Increased size and removed text on mobile */}
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                <img
                  src={logo || "/placeholder.svg"}
                  alt="Biology.Trunk Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="hidden md:block">
                <span className="text-gray-900 font-bold text-lg sm:text-xl">Biology.Trunk</span>
                <p className="text-xs text-gray-500">Course Learning</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden sm:block text-right">
                <span className="text-gray-700 font-medium text-sm sm:text-base block">{user.name}</span>
                <span className="text-gray-500 text-xs">Student</span>
              </div>
              <button
                onClick={onLogout}
                className="px-2.5 sm:px-3 py-1.5 sm:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold text-xs sm:text-sm flex items-center gap-1 flex-shrink-0"
              >
                <i className="fas fa-sign-out-alt text-xs"></i>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {course && (
          <>
            {/* Course Header - Made responsive */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 lg:mb-8 border border-blue-200">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-6 mb-3 sm:mb-4">
                <div className="flex-1">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
                    {course.title}
                  </h1>
                  <p className="text-gray-700 text-sm sm:text-base lg:text-lg mb-3 sm:mb-4 lg:mb-6 line-clamp-2 sm:line-clamp-3">
                    {course.description}
                  </p>
                </div>
                {progress.percentage !== undefined && (
                  <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200 shadow-sm self-start">
                    <div className="text-center">
                      <div className="text-gray-600 text-xs sm:text-sm mb-1">Progress</div>
                      <div className="text-xl sm:text-2xl font-bold text-blue-600">{progress.percentage}%</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
                <div className="bg-white rounded-lg p-2 sm:p-3 lg:p-4 border border-gray-200 shadow-sm">
                  <div className="text-gray-600 text-xs sm:text-sm">Category</div>
                  <div className="text-base sm:text-lg font-bold text-blue-600 truncate">{course.category}</div>
                </div>
                <div className="bg-white rounded-lg p-2 sm:p-3 lg:p-4 border border-gray-200 shadow-sm">
                  <div className="text-gray-600 text-xs sm:text-sm">Instructor</div>
                  <div className="text-base sm:text-lg font-bold text-gray-900 truncate">
                    {course.faculty?.name || "N/A"}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-2 sm:p-3 lg:p-4 border border-gray-200 shadow-sm">
                  <div className="text-gray-600 text-xs sm:text-sm">Students</div>
                  <div className="text-base sm:text-lg font-bold text-green-600">{course.students?.length || 0}</div>
                </div>
                <div className="bg-white rounded-lg p-2 sm:p-3 lg:p-4 border border-gray-200 shadow-sm">
                  <div className="text-gray-600 text-xs sm:text-sm">Content</div>
                  <div className="text-base sm:text-lg font-bold text-purple-600">{content.length}</div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            {progress.percentage !== undefined && (
              <div className="mb-4 sm:mb-6 lg:mb-8">
                <div className="flex justify-between items-center mb-1 sm:mb-2">
                  <span className="text-xs sm:text-sm font-medium text-gray-700">Course Progress</span>
                  <span className="text-xs sm:text-sm text-gray-600">{progress.percentage}% Complete</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                  <div
                    className="bg-blue-600 h-2 sm:h-3 rounded-full transition-all duration-500"
                    style={{ width: `${progress.percentage}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Content Navigation Tabs - Made responsive */}
            <div className="border-b border-gray-200 mb-3 sm:mb-4 lg:mb-6 overflow-x-auto">
              <nav className="flex space-x-2 sm:space-x-4 lg:space-x-8 min-w-max">
                <button
                  onClick={() => setActiveTab("content")}
                  className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                    activeTab === "content"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <i className="fas fa-book mr-1 sm:mr-2 text-xs sm:text-sm"></i>
                  <span>Course Content</span>
                </button>
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                    activeTab === "overview"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <i className="fas fa-info-circle mr-1 sm:mr-2 text-xs sm:text-sm"></i>
                  <span>Course Overview</span>
                </button>
              </nav>
            </div>

            {/* Course Content Section */}
            {activeTab === "content" &&
              (content.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 text-center">
                  <i className="fas fa-book-open text-4xl sm:text-6xl text-gray-300 mb-3 sm:mb-4"></i>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
                    No Content Available
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base">
                    The instructor will upload course materials soon. Check back later!
                  </p>
                </div>
              ) : (
                <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
                  {/* Content Sidebar - Hidden on mobile when content is selected, shown as overlay */}
                  <div className={`lg:w-1/4 ${!selectedContent ? "block" : "hidden lg:block"}`}>
                    <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm lg:sticky lg:top-24">
                      <div className="mb-3 sm:mb-4">
                        <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-2 sm:mb-3 lg:mb-4 flex items-center gap-1 sm:gap-2">
                          <i className="fas fa-list-ul text-sm sm:text-base"></i>
                          <span>Course Materials</span>
                        </h3>

                        {/* Search and Filter */}
                        <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="Search content..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <i className="fas fa-search absolute left-2.5 sm:left-3 top-1.5 sm:top-2.5 text-gray-400 text-xs sm:text-sm"></i>
                          </div>

                          <select
                            value={contentFilter}
                            onChange={(e) => setContentFilter(e.target.value)}
                            className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="all">All Types</option>
                            <option value="pdf">PDF Documents</option>
                            <option value="video">Videos</option>
                            <option value="live_class">Live Classes</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1.5 sm:space-y-2 max-h-64 sm:max-h-80 lg:max-h-96 overflow-y-auto pr-1">
                        {filteredContent.map((item) => (
                          <button
                            key={item._id}
                            onClick={() => {
                              setSelectedContent(item)
                            }}
                            className={`w-full text-left px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-all duration-200 text-xs sm:text-sm ${
                              selectedContent?._id === item._id
                                ? "bg-blue-100 border-2 border-blue-500 shadow-md"
                                : "bg-gray-50 text-gray-900 border border-gray-200 hover:border-blue-300 hover:shadow-md"
                            }`}
                          >
                            <div className="flex items-center gap-2 sm:gap-3">
                              <div
                                className={`p-1.5 sm:p-2 rounded-lg flex-shrink-0 ${
                                  selectedContent?._id === item._id
                                    ? "bg-blue-500 text-white"
                                    : "bg-white text-gray-600"
                                }`}
                              >
                                <i className={`${getContentIcon(item.type)} text-xs sm:text-sm`}></i>
                              </div>
                              <div className="flex-1 overflow-hidden min-w-0">
                                <div
                                  className={`font-semibold truncate ${
                                    selectedContent?._id === item._id ? "text-blue-900" : "text-gray-900"
                                  }`}
                                >
                                  {item.title}
                                </div>
                                <div className="flex items-center justify-between mt-0.5">
                                  <span
                                    className={`text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full capitalize truncate ${
                                      selectedContent?._id === item._id
                                        ? "bg-blue-200 text-blue-800"
                                        : getContentTypeColor(item.type)
                                    }`}
                                  >
                                    {item.type.replace("_", " ")}
                                  </span>
                                  {completedItems.has(item._id) && (
                                    <i
                                      className={`fas fa-check-circle flex-shrink-0 ${
                                        selectedContent?._id === item._id ? "text-blue-600" : "text-green-500"
                                      } text-xs`}
                                    ></i>
                                  )}
                                </div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Content Display Area */}
                  <div className={`${!selectedContent ? "hidden lg:block lg:w-3/4" : "w-full lg:w-3/4"}`}>
                    {selectedContent ? (
                      <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm">
                        {/* Mobile sidebar toggle button */}
                        <div className="lg:hidden mb-4">
                          <button
                            onClick={() => setSelectedContent(null)}
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-semibold"
                          >
                            <i className="fas fa-list-ul"></i>
                            Show Content List
                          </button>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                          <div className="flex items-start gap-3 sm:gap-4">
                            <div
                              className={`p-2.5 sm:p-3 rounded-lg ${getContentTypeColor(selectedContent.type)} flex-shrink-0`}
                            >
                              <i className={`${getContentIcon(selectedContent.type)} text-lg sm:text-xl`}></i>
                            </div>
                            <div className="min-w-0">
                              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 break-words">
                                {selectedContent.title}
                              </h2>
                              <p className="text-gray-600 text-xs sm:text-sm capitalize mt-1">
                                <span
                                  className={`inline-flex items-center gap-1 px-2 py-0.5 sm:py-1 rounded-full ${getContentTypeColor(selectedContent.type)}`}
                                >
                                  <i className={`${getContentIcon(selectedContent.type)} text-xs`}></i>
                                  {selectedContent.type.replace(/_/g, " ")}
                                </span>
                                {" • "}Uploaded {new Date(selectedContent.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2 self-start">
                            <button
                              onClick={() => markAsCompleted(selectedContent._id)}
                              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition font-semibold text-xs sm:text-sm ${
                                completedItems.has(selectedContent._id)
                                  ? "bg-green-600 text-white hover:bg-green-700"
                                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                              }`}
                            >
                              <i
                                className={`fas ${completedItems.has(selectedContent._id) ? "fa-check-circle" : "fa-circle"} mr-1 sm:mr-2`}
                              ></i>
                              {completedItems.has(selectedContent._id) ? "Completed" : "Mark Complete"}
                            </button>
                            <button
                              onClick={() => setShowNotes(!showNotes)}
                              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-xs sm:text-sm flex items-center justify-center gap-1 sm:gap-2"
                            >
                              <i className="fas fa-edit text-xs sm:text-sm"></i>
                              <span>Notes</span>
                            </button>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-3 sm:p-4 lg:p-6 border border-gray-200 mb-3 sm:mb-4">
                          {renderContent(selectedContent)}
                        </div>

                        {/* Notes Section */}
                        {showNotes && (
                          <div className="bg-yellow-50 rounded-lg p-3 sm:p-4 lg:p-6 border border-yellow-200">
                            <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base flex items-center gap-1 sm:gap-2">
                              <i className="fas fa-edit text-sm"></i>
                              <span>Your Notes</span>
                            </h4>
                            <textarea
                              value={notes[selectedContent._id] || ""}
                              onChange={(e) => saveNote(selectedContent._id, e.target.value)}
                              placeholder="Add your notes here..."
                              className="w-full h-24 sm:h-32 text-xs sm:text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mt-2">
                              <span className="text-xs text-gray-500">
                                Auto-saved{" "}
                                {notes[selectedContent._id]
                                  ? `• ${notes[selectedContent._id]?.length || 0} characters`
                                  : ""}
                              </span>
                              <button
                                onClick={() => setShowNotes(false)}
                                className="px-2.5 sm:px-3 py-1 text-xs sm:text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                              >
                                Close
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="bg-white border border-gray-200 rounded-xl p-8 sm:p-10 lg:p-12 text-center hidden lg:block">
                        <i className="fas fa-hand-point-left text-4xl sm:text-6xl text-gray-300 mb-3 sm:mb-4"></i>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">Select Content</h3>
                        <p className="text-gray-600 text-sm sm:text-base">
                          Choose a material from the sidebar to start learning
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}

            {/* Course Overview Tab */}
            {activeTab === "overview" && course && (
              <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 lg:p-8">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Course Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 lg:mb-4">
                      Course Details
                    </h3>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-200">
                        <span className="text-gray-600 text-sm sm:text-base">Category:</span>
                        <span className="font-medium text-sm sm:text-base">{course.category}</span>
                      </div>
                      <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-200">
                        <span className="text-gray-600 text-sm sm:text-base">Instructor:</span>
                        <span className="font-medium text-sm sm:text-base">{course.faculty?.name || "N/A"}</span>
                      </div>
                      <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-200">
                        <span className="text-gray-600 text-sm sm:text-base">Total Students:</span>
                        <span className="font-medium text-sm sm:text-base">{course.students?.length || 0}</span>
                      </div>
                      <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-200">
                        <span className="text-gray-600 text-sm sm:text-base">Content Items:</span>
                        <span className="font-medium text-sm sm:text-base">{content.length}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 lg:mb-4">
                      Your Progress
                    </h3>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-200">
                        <span className="text-gray-600 text-sm sm:text-base">Completion:</span>
                        <span className="font-medium text-blue-600 text-sm sm:text-base">
                          {progress.percentage || 0}%
                        </span>
                      </div>
                      <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-200">
                        <span className="text-gray-600 text-sm sm:text-base">Completed Items:</span>
                        <span className="font-medium text-green-600 text-sm sm:text-base">{completedItems.size}</span>
                      </div>
                      <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-200">
                        <span className="text-gray-600 text-sm sm:text-base">Remaining Items:</span>
                        <span className="font-medium text-orange-600 text-sm sm:text-base">
                          {content.length - completedItems.size}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
