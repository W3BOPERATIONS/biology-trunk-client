"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"

const API_URL = "https://biology-trunk-server.vercel.app/api"

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
    localStorage.setItem("lastPath", window.location.pathname)
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
    }
  }

  const markAsCompleted = async (contentId) => {
    try {
      await axios.post(`${API_URL}/progress/mark-completed`, {
        studentId: user._id,
        courseId,
        contentId
      })
      
      const updatedCompleted = new Set(completedItems)
      if (updatedCompleted.has(contentId)) {
        updatedCompleted.delete(contentId)
      } else {
        updatedCompleted.add(contentId)
      }
      setCompletedItems(updatedCompleted)
      
      const newProgress = (updatedCompleted.size / content.length) * 100
      setProgress(prev => ({ ...prev, percentage: Math.round(newProgress) }))
      
    } catch (error) {
      console.error("Failed to update progress:", error)
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

  const filteredContent = content.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0]
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null
    } else if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0]
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null
    } else if (url.includes('youtube.com/embed/')) {
      return url
    }
    
    // Handle Vimeo URLs
    if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1]?.split('/')[1] || url.split('vimeo.com/')[1]
      return videoId ? `https://player.vimeo.com/video/${videoId}` : null
    }
    
    // Return original URL for other cases (might be direct video URL)
    return url
  }

  // Function to check if URL is a video streaming service
  const isStreamingService = (url) => {
    return url.includes('youtube') || url.includes('youtu.be') || url.includes('vimeo')
  }

  const renderContent = (item) => {
    switch (item.type) {
      case "pdf":
        return (
          <div className="space-y-4">
            <p className="text-gray-700 whitespace-pre-wrap break-words">
              {item.description || "PDF Document"}
            </p>
            {item.pdfUrl && (
              <div className="flex gap-3 flex-wrap">
                <a
                  href={item.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
                >
                  <i className="fas fa-download"></i>
                  Download PDF
                </a>
                <a
                  href={`https://docs.google.com/viewer?url=${encodeURIComponent(item.pdfUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  <i className="fas fa-eye"></i>
                  View Online
                </a>
              </div>
            )}
          </div>
        )
      case "video":
        const embedUrl = getYouTubeEmbedUrl(item.videoUrl)
        const isStreaming = isStreamingService(item.videoUrl)
        
        return (
          <div className="space-y-4">
            <p className="text-gray-700">{item.description}</p>
            
            {item.videoUrl && (
              <div className="space-y-4">
                {isStreaming && embedUrl ? (
                  <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
                    <iframe
                      src={embedUrl}
                      className="w-full h-full"
                      allowFullScreen
                      title={item.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
                      <video 
                        controls 
                        className="w-full h-full"
                        poster={item.thumbnail || "/default-video-thumbnail.jpg"}
                      >
                        <source src={item.videoUrl} type="video/mp4" />
                        <source src={item.videoUrl} type="video/webm" />
                        <source src={item.videoUrl} type="video/ogg" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                    <div className="text-center">
                      <a
                        href={item.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                      >
                        <i className="fas fa-external-link-alt"></i>
                        Open Video in New Tab
                      </a>
                    </div>
                  </div>
                )}
                
                {/* Video fallback message */}
                {!isStreaming && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <i className="fas fa-exclamation-triangle text-yellow-600 mt-1"></i>
                      <div>
                        <p className="text-yellow-800 font-medium">Video Playback Note</p>
                        <p className="text-yellow-700 text-sm">
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
          <div className="space-y-4">
            <p className="text-gray-700">{item.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-2 mb-1">
                  <i className="fas fa-calendar text-yellow-600"></i>
                  <span className="font-semibold text-gray-700">Date:</span>
                </div>
                <span className="text-gray-700">{new Date(item.liveClassDate).toLocaleDateString()}</span>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-2 mb-1">
                  <i className="fas fa-clock text-yellow-600"></i>
                  <span className="font-semibold text-gray-700">Time:</span>
                </div>
                <span className="text-gray-700">{item.liveClassTime}</span>
              </div>
            </div>
            {item.liveClassUrl && (
              <div className="flex gap-3 flex-wrap">
                <a
                  href={item.liveClassUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-4 py-2 text-white rounded-lg transition font-semibold ${
                    isUpcoming 
                      ? "bg-green-600 hover:bg-green-700" 
                      : "bg-gray-600 hover:bg-gray-700"
                  }`}
                >
                  <i className="fas fa-video"></i>
                  {isUpcoming ? "Join Live Class" : "Watch Recording"}
                </a>
                {isUpcoming && (
                  <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold">
                    <i className="fas fa-bell"></i>
                    Set Reminder
                  </button>
                )}
              </div>
            )}
          </div>
        )
      default:
        return (
          <div className="space-y-4">
            <p className="text-gray-700">{item.description}</p>
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                <i className="fas fa-external-link-alt"></i>
                Open Resource
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
          <i className="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
          <div className="text-gray-600 text-xl">Loading course content...</div>
        </div>
      </div>
    )
  }

  if (!isEnrolled) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="text-center">
          <i className="fas fa-lock text-6xl text-gray-400 mb-4"></i>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Restricted</h1>
          <p className="text-gray-600 mb-8">You must be enrolled in this course to view its content.</p>
          <button
            onClick={() => navigate("/student-dashboard")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/student-dashboard")}
                className="text-gray-600 hover:text-gray-900 text-lg"
              >
                <i className="fas fa-arrow-left"></i>
              </button>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <i className="fas fa-graduation-cap text-white"></i>
              </div>
              <span className="text-gray-900 font-bold text-xl">EduTech</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-gray-700 font-medium block">{user.name}</span>
                <span className="text-gray-500 text-sm">Student</span>
              </div>
              <button
                onClick={onLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
              >
                <i className="fas fa-sign-out-alt mr-2"></i>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {course && (
          <>
            {/* Course Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 mb-8 border border-blue-200">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">{course.title}</h1>
                  <p className="text-gray-700 text-lg mb-6">{course.description}</p>
                </div>
                {progress.percentage !== undefined && (
                  <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                    <div className="text-center">
                      <div className="text-gray-600 text-sm mb-1">Progress</div>
                      <div className="text-2xl font-bold text-blue-600">{progress.percentage}%</div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex gap-6 flex-wrap">
                <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                  <div className="text-gray-600 text-sm">Category</div>
                  <div className="text-lg font-bold text-blue-600">{course.category}</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                  <div className="text-gray-600 text-sm">Instructor</div>
                  <div className="text-lg font-bold text-gray-900">{course.faculty?.name || "N/A"}</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                  <div className="text-gray-600 text-sm">Students Enrolled</div>
                  <div className="text-lg font-bold text-green-600">{course.students?.length || 0}</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                  <div className="text-gray-600 text-sm">Content Items</div>
                  <div className="text-lg font-bold text-purple-600">{content.length}</div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            {progress.percentage !== undefined && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Course Progress</span>
                  <span className="text-sm text-gray-600">{progress.percentage}% Complete</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${progress.percentage}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Content Navigation Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab("content")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "content"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <i className="fas fa-book mr-2"></i>
                  Course Content
                </button>
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "overview"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <i className="fas fa-info-circle mr-2"></i>
                  Course Overview
                </button>
              </nav>
            </div>

            {/* Course Content Section */}
            {activeTab === "content" && (
              content.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
                  <i className="fas fa-book-open text-6xl text-gray-300 mb-4"></i>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">No Content Available</h2>
                  <p className="text-gray-600">The instructor will upload course materials soon. Check back later!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                  {/* Content Sidebar */}
                  <div className="lg:col-span-1">
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm sticky top-24">
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                          <i className="fas fa-list-ul mr-2"></i>
                          Course Materials
                        </h3>
                        
                        {/* Search and Filter */}
                        <div className="space-y-3 mb-4">
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="Search content..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                          </div>
                          
                          <select
                            value={contentFilter}
                            onChange={(e) => setContentFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="all">All Types</option>
                            <option value="pdf">PDF Documents</option>
                            <option value="video">Videos</option>
                            <option value="live_class">Live Classes</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {filteredContent.map((item) => (
                          <button
                            key={item._id}
                            onClick={() => setSelectedContent(item)}
                            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                              selectedContent?._id === item._id
                                ? "bg-blue-100 border-2 border-blue-500 shadow-md" // Changed to light blue background
                                : "bg-gray-50 text-gray-900 border border-gray-200 hover:border-blue-300 hover:shadow-md"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${
                                selectedContent?._id === item._id 
                                  ? 'bg-blue-500 text-white'  // Blue background with white icon for selected
                                  : 'bg-white text-gray-600'
                              }`}>
                                <i className={`${getContentIcon(item.type)}`}></i>
                              </div>
                              <div className="flex-1 overflow-hidden">
                                <div className={`font-semibold truncate text-sm ${
                                  selectedContent?._id === item._id ? 'text-blue-900' : 'text-gray-900'
                                }`}>
                                  {item.title}
                                </div>
                                <div className="flex items-center justify-between mt-1">
                                  <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                                    selectedContent?._id === item._id 
                                      ? 'bg-blue-200 text-blue-800'  // Light blue with dark blue text for selected
                                      : getContentTypeColor(item.type)
                                  }`}>
                                    {item.type.replace("_", " ")}
                                  </span>
                                  {completedItems.has(item._id) && (
                                    <i className={`fas fa-check-circle text-xs ${
                                      selectedContent?._id === item._id ? 'text-blue-600' : 'text-green-500'
                                    }`}></i>
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
                  <div className="lg:col-span-3">
                    {selectedContent ? (
                      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-lg ${getContentTypeColor(selectedContent.type)}`}>
                              <i className={`${getContentIcon(selectedContent.type)} text-xl`}></i>
                            </div>
                            <div>
                              <h2 className="text-2xl font-bold text-gray-900">{selectedContent.title}</h2>
                              <p className="text-gray-600 text-sm capitalize">
                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${getContentTypeColor(selectedContent.type)}`}>
                                  <i className={`${getContentIcon(selectedContent.type)} text-xs`}></i>
                                  {selectedContent.type.replace(/_/g, " ")}
                                </span>
                                {" • "}Uploaded{" "}
                                {new Date(selectedContent.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => markAsCompleted(selectedContent._id)}
                              className={`px-4 py-2 rounded-lg transition font-semibold ${
                                completedItems.has(selectedContent._id)
                                  ? "bg-green-600 text-white hover:bg-green-700"
                                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                              }`}
                            >
                              <i className={`fas ${completedItems.has(selectedContent._id) ? 'fa-check-circle' : 'fa-circle'} mr-2`}></i>
                              {completedItems.has(selectedContent._id) ? "Completed" : "Mark Complete"}
                            </button>
                            <button
                              onClick={() => setShowNotes(!showNotes)}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                            >
                              <i className="fas fa-edit mr-2"></i>
                              Notes
                            </button>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 mb-4">
                          {renderContent(selectedContent)}
                        </div>

                        {/* Notes Section */}
                        {showNotes && (
                          <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
                            <h4 className="font-semibold text-gray-900 mb-3">
                              <i className="fas fa-edit mr-2"></i>
                              Your Notes
                            </h4>
                            <textarea
                              value={notes[selectedContent._id] || ""}
                              onChange={(e) => saveNote(selectedContent._id, e.target.value)}
                              placeholder="Add your notes here..."
                              className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-sm text-gray-500">
                                Auto-saved {notes[selectedContent._id] ? `• ${notes[selectedContent._id]?.length || 0} characters` : ''}
                              </span>
                              <button
                                onClick={() => setShowNotes(false)}
                                className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                              >
                                Close
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
                        <i className="fas fa-hand-point-left text-6xl text-gray-300 mb-4"></i>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Select Content</h3>
                        <p className="text-gray-600">Choose a material from the sidebar to start learning</p>
                      </div>
                    )}
                  </div>
                </div>
              )
            )}

            {/* Course Overview Tab */}
            {activeTab === "overview" && course && (
              <div className="bg-white border border-gray-200 rounded-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-600">Category:</span>
                        <span className="font-medium">{course.category}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-600">Instructor:</span>
                        <span className="font-medium">{course.faculty?.name || "N/A"}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-600">Total Students:</span>
                        <span className="font-medium">{course.students?.length || 0}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-600">Content Items:</span>
                        <span className="font-medium">{content.length}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Progress</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-600">Completion:</span>
                        <span className="font-medium text-blue-600">{progress.percentage || 0}%</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-600">Completed Items:</span>
                        <span className="font-medium text-green-600">{completedItems.size}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-600">Remaining Items:</span>
                        <span className="font-medium text-orange-600">{content.length - completedItems.size}</span>
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