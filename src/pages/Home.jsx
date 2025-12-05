"use client"

import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import axios from "axios"
import { API_URL } from "../utils/api.js"
import logo from "../assets/biology-trunk-logo.png"
import roadmapVideo from "../assets/biology-trunk-introduction.mp4"
import { showErrorToast } from "../utils/toast.js"

// Import all 8 gallery images from assets/image-gallery folder
import gallery1 from "../assets/image-gallery/catalog1.jpg"
import gallery2 from "../assets/image-gallery/study2.jpg"
import gallery3 from "../assets/image-gallery/Study3.jpg"
import gallery4 from "../assets/image-gallery/study4.jpg"
import gallery5 from "../assets/image-gallery/study5.jpg"
import gallery6 from "../assets/image-gallery/study6.jpg"
import gallery7 from "../assets/image-gallery/study7.jpg"
import gallery8 from "../assets/image-gallery/study8.jpg"

export default function Home({ user, onLogout }) {
  const navigate = useNavigate()
  const videoRef = useRef(null)
  const galleryIntervalRef = useRef(null)
  const [stats, setStats] = useState({
    totalCourses: 0,
    premiumCourses: 0,
    totalFaculty: 0,
    totalStudents: 0,
  })
  const [faqOpen, setFaqOpen] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isAutoScroll, setIsAutoScroll] = useState(true)

  // Gallery images array with imported images
  const [galleryImages] = useState([
    { src: gallery1, alt: "Biology Trunk Classroom 1" },
    { src: gallery2, alt: "Biology Trunk Study Session 2" },
    { src: gallery3, alt: "Biology Trunk Laboratory 3" },
    { src: gallery4, alt: "Biology Trunk Study Group 4" },
    { src: gallery5, alt: "Biology Trunk Faculty Teaching 5" },
    { src: gallery6, alt: "Biology Trunk Students Learning 6" },
    { src: gallery7, alt: "Biology Trunk Interactive Session 7" },
    { src: gallery8, alt: "Biology Trunk Success Celebration 8" },
  ])

  useEffect(() => {
    fetchStats()

    // Start auto-scroll only if enabled
    if (isAutoScroll) {
      startAutoScroll()
    }

    return () => {
      // Cleanup interval on component unmount
      if (galleryIntervalRef.current) {
        clearInterval(galleryIntervalRef.current)
      }
    }
  }, [isAutoScroll]) // Re-run when auto-scroll state changes

  const startAutoScroll = () => {
    // Clear existing interval
    if (galleryIntervalRef.current) {
      clearInterval(galleryIntervalRef.current)
    }

    // Start new interval for auto-scroll
    galleryIntervalRef.current = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length)
    }, 3000) // Change image every 3 seconds
  }

  const stopAutoScroll = () => {
    setIsAutoScroll(false)
    if (galleryIntervalRef.current) {
      clearInterval(galleryIntervalRef.current)
      galleryIntervalRef.current = null
    }
  }

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index)
    stopAutoScroll() // Stop auto-scroll when user clicks on thumbnail
  }

  const handlePrevClick = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)
    stopAutoScroll() // Stop auto-scroll when user clicks navigation
  }

  const handleNextClick = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length)
    stopAutoScroll() // Stop auto-scroll when user clicks navigation
  }

  const toggleAutoScroll = () => {
    if (isAutoScroll) {
      stopAutoScroll()
    } else {
      setIsAutoScroll(true)
      startAutoScroll()
    }
  }

  const fetchStats = async () => {
    try {
      const [courses, faculty, students] = await Promise.all([
        axios.get(`${API_URL}/courses?limit=1000`),
        axios.get(`${API_URL}/users/role/faculty`),
        axios.get(`${API_URL}/users/role/student`),
      ])

      const courseCount = courses.data.courses ? courses.data.courses.length : courses.data.length
      const premiumCourses = courses.data.courses
        ? courses.data.courses.filter((c) => c.price > 0).length
        : courses.data.filter((c) => c.price > 0).length

      setStats({
        totalCourses: courseCount,
        premiumCourses: premiumCourses,
        totalFaculty: faculty.data.length,
        totalStudents: students.data.length,
      })
    } catch (error) {
      console.error("Failed to fetch stats:", error)
      showErrorToast("Failed to load homepage statistics")
    }
  }

  const handleCategoryClick = (category) => {
    if (user && user.role === "student") {
      navigate(`/student-dashboard?category=${category}`)
    } else if (!user) {
      navigate("/login")
    }
  }

  const faqItems = [
    {
      question: "What courses does Biology.Trunk offer?",
      answer:
        "Biology.Trunk offers comprehensive courses for Classes 9-12, JEE Preparation, NEET Preparation, AIIMS Paramedical, Nursing Entrance, CUET (UG), TGT/PGT Preparation, KVS/NVS, NET & GATE, KYPS Olympiad, and Foreign Language Courses. Our curriculum is designed by Ph.D. qualified expert faculty with 15+ years of experience.",
    },
    {
      question: "How do I access the live classes?",
      answer:
        "Once you enroll in a course, you'll get access to our learning platform. Live classes are scheduled at specific times which you can see in your dashboard. All live sessions are also recorded for later viewing.",
    },
    {
      question: "Is there a free trial available?",
      answer:
        "Yes! We offer a 7-day free trial for most of our premium courses. You can access limited content and attend demo classes to experience our teaching methodology before making a purchase.",
    },
    {
      question: "How are the faculty members selected?",
      answer:
        "Our faculty members are Ph.D. holders, NET & GATE qualified, and ex-lecturers from government colleges with minimum 15+ years of teaching experience. They undergo rigorous training and evaluation to ensure the highest quality of education.",
    },
    {
      question: "What is the track record of Biology.Trunk students?",
      answer:
        "Our students have an exceptional track record with 98% success rate in competitive exams. Many have secured top ranks in JEE, NEET, AIIMS, CUET, and teaching examinations with our structured learning approach.",
    },
    {
      question: "Do you provide study materials?",
      answer:
        "Yes, we provide comprehensive study materials including PDF notes, practice questions, previous year papers, mock tests, and research papers. All materials are regularly updated according to the latest exam patterns.",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center overflow-hidden">
                <img
                  src={logo || "/placeholder.svg"}
                  alt="Biology.Trunk Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-gray-900 font-bold text-2xl sm:text-3xl hidden sm:block">Biology.Trunk</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              {user ? (
                <>
                  <span className="text-gray-700 font-medium text-sm sm:text-base hidden sm:inline">{user.name}</span>
                  <button
                    onClick={onLogout}
                    className="px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
                  >
                    <i className="fas fa-sign-out-alt text-sm"></i>
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-3 sm:px-4 py-2 text-gray-700 hover:text-blue-600 transition font-medium flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
                  >
                    <i className="fas fa-sign-in-alt text-sm"></i>
                    <span className="hidden sm:inline">Login</span>
                  </Link>
                  <Link
                    to="/register"
                    className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
                  >
                    <i className="fas fa-user-plus text-sm"></i>
                    <span className="hidden sm:inline">Register</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-white py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
            <div className="space-y-6 sm:space-y-8">
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                  Transform Your Academic Career with{" "}
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Ph.D. Expert Faculty
                  </span>
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                  Join India's premier online learning platform led by Ph.D. holders, NET & GATE qualified experts with
                  15+ years of government college teaching experience. Access comprehensive courses and personalized
                  mentorship for academic excellence.
                </p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 text-gray-600">
                  <div className="flex items-center gap-2">
                    <i className="fas fa-check-circle text-green-500 text-lg"></i>
                    <span className="text-base sm:text-lg">Ph.D. Qualified Faculty</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="fas fa-check-circle text-green-500 text-lg"></i>
                    <span className="text-base sm:text-lg">15+ Years Experience</span>
                  </div>
                </div>
              </div>

              {!user && (
                <div className="flex gap-4 sm:gap-6 flex-wrap">
                  <Link
                    to="/register"
                    className="px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold shadow-lg hover:shadow-xl flex items-center gap-2 text-base sm:text-lg"
                  >
                    <i className="fas fa-rocket"></i>
                    Start Free Trial
                  </Link>
                  <Link
                    to="/login"
                    className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition font-semibold flex items-center gap-2 text-base sm:text-lg"
                  >
                    <i className="fas fa-play-circle"></i>
                    Watch Demo
                  </Link>
                </div>
              )}
              {user && (
                <Link
                  to={`/${user.role}-dashboard`}
                  className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold shadow-lg text-base sm:text-lg"
                >
                  <i className="fas fa-tachometer-alt"></i>
                  Go to Dashboard
                </Link>
              )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-blue-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-star text-blue-600 text-xl"></i>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{stats.premiumCourses}+</div>
                    <div className="text-gray-700 font-semibold">Premium Courses</div>
                    <div className="text-gray-500 text-sm">Expert-Curated Content</div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-green-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-users text-green-600 text-xl"></i>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">50K+</div>
                    <div className="text-gray-700 font-semibold">Successful Students</div>
                    <div className="text-gray-500 text-sm">Proven Results</div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-purple-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-user-graduate text-purple-600 text-xl"></i>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{stats.totalFaculty}+</div>
                    <div className="text-gray-700 font-semibold">Ph.D. Faculty</div>
                    <div className="text-gray-500 text-sm">NET & GATE Qualified</div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-orange-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-chart-line text-orange-600 text-xl"></i>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">98%</div>
                    <div className="text-gray-700 font-semibold">Success Track Record</div>
                    <div className="text-gray-500 text-sm">Exceptional Results</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Gallery Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Learning Environment Gallery</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our state-of-the-art facilities and vibrant learning community
            </p>
            <div className="flex items-center justify-center gap-4 mt-4">
              <button
                onClick={toggleAutoScroll}
                className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
                  isAutoScroll
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <i className={`fas ${isAutoScroll ? "fa-pause" : "fa-play"}`}></i>
                {isAutoScroll ? "Pause Auto-scroll" : "Start Auto-scroll"}
              </button>
              <div className="text-sm text-gray-500">
                <i className="fas fa-info-circle mr-2"></i>
                Click any image to stop auto-scroll
              </div>
            </div>
          </div>

          {/* Main Gallery */}
          <div className="relative max-w-6xl mx-auto">
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg">
              <div className="relative overflow-hidden rounded-lg aspect-video">
                <img
                  src={galleryImages[currentImageIndex].src || "/placeholder.svg"}
                  alt={galleryImages[currentImageIndex].alt}
                  className="w-full h-full object-cover transition-opacity duration-500"
                  onClick={stopAutoScroll} // Stop auto-scroll when clicking main image
                />

                {/* Navigation Buttons */}
                <button
                  onClick={handlePrevClick}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                <button
                  onClick={handleNextClick}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
                >
                  <i className="fas fa-chevron-right"></i>
                </button>

                {/* Image Counter */}
                <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {currentImageIndex + 1} / {galleryImages.length}
                </div>

                {/* Auto-scroll Indicator */}
                {isAutoScroll && (
                  <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                    <i className="fas fa-sync-alt fa-spin"></i>
                    Auto-scrolling
                  </div>
                )}

                {/* Image Title */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-lg">
                  {galleryImages[currentImageIndex].alt}
                </div>
              </div>
            </div>

            {/* Thumbnail Strip */}
            <div className="mt-6 overflow-x-auto pb-2">
              <div className="flex gap-3 min-w-max">
                {galleryImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => handleThumbnailClick(index)}
                    className={`relative overflow-hidden rounded-lg aspect-video w-32 md:w-40 flex-shrink-0 transition-all duration-300 ${
                      index === currentImageIndex
                        ? "ring-4 ring-blue-500 scale-105 shadow-lg"
                        : "ring-1 ring-gray-200 hover:ring-2 hover:ring-blue-300"
                    }`}
                  >
                    <img
                      src={image.src || "/placeholder.svg"}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {index === currentImageIndex && <div className="absolute inset-0 bg-blue-500/20"></div>}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 text-center">
                      Image {index + 1}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Thumbnail Navigation Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {galleryImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleThumbnailClick(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentImageIndex ? "bg-blue-600 scale-125" : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>

            {/* Gallery Controls */}
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={handlePrevClick}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium flex items-center gap-2"
              >
                <i className="fas fa-chevron-left"></i>
                Previous
              </button>
              <button
                onClick={handleNextClick}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium flex items-center gap-2"
              >
                Next
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Expert Faculty Qualifications Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Esteemed Faculty Credentials</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Learn from the best in the industry with exceptional qualifications and experience
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-graduation-cap text-blue-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Ph.D. Holders</h3>
              <p className="text-gray-600">Doctoral degree holders with research expertise</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-award text-green-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">NET & GATE Qualified</h3>
              <p className="text-gray-600">Nationally recognized qualification holders</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-university text-purple-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Ex Government College Lecturers</h3>
              <p className="text-gray-600">Former lecturers with institutional teaching experience</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-chart-line text-orange-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">15+ Years Experience</h3>
              <p className="text-gray-600">Decades of proven teaching methodology</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Why Choose Biology.Trunk?</h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              We combine decades of teaching experience with cutting-edge technology to deliver exceptional learning
              outcomes across all competitive exam segments.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {/* Card 1: Ph.D. Expert Faculty */}
            <div className="bg-white p-6 md:p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-blue-200 group h-full flex flex-col">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-4 md:mb-6 group-hover:bg-blue-600 transition-colors flex-shrink-0">
                <i className="fas fa-user-graduate text-blue-600 text-xl md:text-2xl group-hover:text-white"></i>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4 min-h-[72px] md:min-h-[96px] flex items-center">
                Ph.D. Expert Faculty
              </h3>
              <p className="text-gray-700 mb-4 md:mb-6 leading-relaxed text-sm md:text-base flex-grow">
                Learn from Ph.D. holders, NET & GATE qualified experts with 15+ years of government college teaching
                experience.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-gray-600">
                  <i className="fas fa-check text-green-500 text-sm mt-0.5 flex-shrink-0"></i>
                  <span className="text-xs md:text-sm">Ph.D. Qualified</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <i className="fas fa-check text-green-500 text-sm mt-0.5 flex-shrink-0"></i>
                  <span className="text-xs md:text-sm">NET & GATE Experts</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <i className="fas fa-check text-green-500 text-sm mt-0.5 flex-shrink-0"></i>
                  <span className="text-xs md:text-sm">Government College Experience</span>
                </li>
              </ul>
            </div>

            {/* Card 2: Comprehensive Curriculum */}
            <div className="bg-white p-6 md:p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-green-200 group h-full flex flex-col">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-green-100 rounded-xl flex items-center justify-center mb-4 md:mb-6 group-hover:bg-green-600 transition-colors flex-shrink-0">
                <i className="fas fa-book-open text-green-600 text-xl md:text-2xl group-hover:text-white"></i>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4 min-h-[72px] md:min-h-[96px] flex items-center">
                Comprehensive Curriculum
              </h3>
              <p className="text-gray-700 mb-4 md:mb-6 leading-relaxed text-sm md:text-base flex-grow">
                Structured learning paths covering all major competitive exams with updated syllabus and exam patterns.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-gray-600">
                  <i className="fas fa-check text-green-500 text-sm mt-0.5 flex-shrink-0"></i>
                  <span className="text-xs md:text-sm">Updated Content</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <i className="fas fa-check text-green-500 text-sm mt-0.5 flex-shrink-0"></i>
                  <span className="text-xs md:text-sm">Structured Modules</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <i className="fas fa-check text-green-500 text-sm mt-0.5 flex-shrink-0"></i>
                  <span className="text-xs md:text-sm">Research-Based Material</span>
                </li>
              </ul>
            </div>

            {/* Card 3: Live Interactive Classes */}
            <div className="bg-white p-6 md:p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-purple-200 group h-full flex flex-col">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-4 md:mb-6 group-hover:bg-purple-600 transition-colors flex-shrink-0">
                <i className="fas fa-video text-purple-600 text-xl md:text-2xl group-hover:text-white"></i>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4 min-h-[72px] md:min-h-[96px] flex items-center">
                Live Interactive Classes
              </h3>
              <p className="text-gray-700 mb-4 md:mb-6 leading-relaxed text-sm md:text-base flex-grow">
                Real-time learning experience with expert faculty and interactive doubt-solving sessions.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-gray-600">
                  <i className="fas fa-check text-green-500 text-sm mt-0.5 flex-shrink-0"></i>
                  <span className="text-xs md:text-sm">Live Sessions</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <i className="fas fa-check text-green-500 text-sm mt-0.5 flex-shrink-0"></i>
                  <span className="text-xs md:text-sm">Recorded Lectures</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <i className="fas fa-check text-green-500 text-sm mt-0.5 flex-shrink-0"></i>
                  <span className="text-xs md:text-sm">Personalized Doubt Solving</span>
                </li>
              </ul>
            </div>

            {/* Card 4: Performance Analytics */}
            <div className="bg-white p-6 md:p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-orange-200 group h-full flex flex-col">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-orange-100 rounded-xl flex items-center justify-center mb-4 md:mb-6 group-hover:bg-orange-600 transition-colors flex-shrink-0">
                <i className="fas fa-chart-bar text-orange-600 text-xl md:text-2xl group-hover:text-white"></i>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4 min-h-[72px] md:min-h-[96px] flex items-center">
                Performance Analytics
              </h3>
              <p className="text-gray-700 mb-4 md:mb-6 leading-relaxed text-sm md:text-base flex-grow">
                Detailed progress tracking with AI-powered insights and personalized improvement recommendations.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-gray-600">
                  <i className="fas fa-check text-green-500 text-sm mt-0.5 flex-shrink-0"></i>
                  <span className="text-xs md:text-sm">Progress Reports</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <i className="fas fa-check text-green-500 text-sm mt-0.5 flex-shrink-0"></i>
                  <span className="text-xs md:text-sm">AI Analysis</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <i className="fas fa-check text-green-500 text-sm mt-0.5 flex-shrink-0"></i>
                  <span className="text-xs md:text-sm">Exam Performance Predictions</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Course Categories - Updated with new courses */}
      <section className="py-16 md:py-20 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Comprehensive Course Catalog
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our extensive range of courses designed for academic excellence and competitive success.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              {
                name: "Class 9-12",
                shortName: "Class 9-12",
                icon: "fas fa-atom",
                iconColor: "text-blue-600",
                bgColor: "bg-blue-100",
                hoverBgColor: "group-hover:bg-blue-600",
                students: "25K+",
                courses: "45",
              },
              {
                name: "JEE Preparation",
                shortName: "JEE",
                icon: "fas fa-rocket",
                iconColor: "text-green-600",
                bgColor: "bg-green-100",
                hoverBgColor: "group-hover:bg-green-600",
                students: "25K+",
                courses: "85",
              },
              {
                name: "NEET Preparation",
                shortName: "NEET",
                icon: "fas fa-stethoscope",
                iconColor: "text-purple-600",
                bgColor: "bg-purple-100",
                hoverBgColor: "group-hover:bg-purple-600",
                students: "22K+",
                courses: "78",
              },
              {
                name: "AIIMS Paramedical",
                shortName: "AIIMS",
                icon: "fas fa-hospital",
                iconColor: "text-red-600",
                bgColor: "bg-red-100",
                hoverBgColor: "group-hover:bg-red-600",
                students: "8K+",
                courses: "25",
              },
              {
                name: "Nursing Entrance",
                shortName: "Nursing",
                icon: "fas fa-user-nurse",
                iconColor: "text-pink-600",
                bgColor: "bg-pink-100",
                hoverBgColor: "group-hover:bg-pink-600",
                students: "6K+",
                courses: "20",
              },
              {
                name: "CUET (UG)",
                shortName: "CUET",
                icon: "fas fa-graduation-cap",
                iconColor: "text-yellow-600",
                bgColor: "bg-yellow-100",
                hoverBgColor: "group-hover:bg-yellow-600",
                students: "12K+",
                courses: "35",
              },
              {
                name: "TGT/PGT Preparation",
                shortName: "Teaching",
                icon: "fas fa-chalkboard-teacher",
                iconColor: "text-indigo-600",
                bgColor: "bg-indigo-100",
                hoverBgColor: "group-hover:bg-indigo-600",
                students: "5K+",
                courses: "28",
              },
              {
                name: "All Courses",
                shortName: "All",
                icon: "fas fa-book",
                iconColor: "text-gray-600",
                bgColor: "bg-gray-100",
                hoverBgColor: "group-hover:bg-gray-600",
                students: "50K+",
                courses: "400+",
              },
            ].map((cat, index) => (
              <div
                key={cat.name}
                onClick={() => handleCategoryClick(cat.name === "All Courses" ? "" : cat.name)}
                className="bg-white p-4 md:p-6 rounded-xl border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                  <div
                    className={`w-10 h-10 md:w-12 md:h-12 ${cat.bgColor} rounded-lg flex items-center justify-center transition-colors ${cat.hoverBgColor}`}
                  >
                    <i
                      className={`${cat.icon} ${cat.iconColor} text-base md:text-lg group-hover:text-white transition-colors`}
                    ></i>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-gray-900 text-sm md:text-lg line-clamp-1">
                      <span className="md:hidden">{cat.shortName}</span>
                      <span className="hidden md:inline">{cat.name}</span>
                    </div>
                    <div className="text-gray-500 text-xs md:text-sm">{cat.courses} Courses</div>
                  </div>
                </div>
                <div className="flex justify-between items-center text-xs md:text-sm text-gray-600">
                  <span>{cat.students} Students</span>
                  <i className="fas fa-arrow-right text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></i>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Courses Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Specialized Preparation Courses</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Advanced courses for specialized competitive examinations
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "KVS/NVS", icon: "fas fa-school", color: "text-blue-600", students: "3K+" },
              { name: "NET & GATE", icon: "fas fa-award", color: "text-green-600", students: "4K+" },
              { name: "KYPS Olympiad", icon: "fas fa-medal", color: "text-purple-600", students: "2K+" },
              { name: "Foreign Languages", icon: "fas fa-globe", color: "text-orange-600", students: "1.5K+" },
            ].map((course) => (
              <div
                key={course.name}
                className="bg-gray-50 p-4 rounded-xl border border-gray-200 hover:shadow-md transition cursor-pointer"
                onClick={() => handleCategoryClick(course.name)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                    <i className={`${course.icon} ${course.color} text-lg`}></i>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{course.name}</div>
                    <div className="text-xs text-gray-500">{course.students} Students</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Methodology with Video */}
      <section className="py-16 md:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 lg:gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
                Our Proven Learning Methodology
              </h2>
              <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8">
                Our structured approach ensures comprehensive concept understanding and exam readiness through
                systematic progression and continuous assessment.
              </p>
              <div className="space-y-4 md:space-y-6">
                {[
                  {
                    icon: "fas fa-lightbulb",
                    title: "Concept Building",
                    desc: "Strong foundation with fundamental concepts by Ph.D. experts",
                  },
                  {
                    icon: "fas fa-puzzle-piece",
                    title: "Application Training",
                    desc: "Real-world problem solving techniques",
                  },
                  {
                    icon: "fas fa-clipboard-check",
                    title: "Assessment",
                    desc: "Regular tests and performance evaluation",
                  },
                  {
                    icon: "fas fa-sync-alt",
                    title: "Revision",
                    desc: "Spaced repetition for better retention",
                  },
                ].map((step, index) => (
                  <div key={index} className="flex items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <i className={`${step.icon} text-blue-600 text-base md:text-lg`}></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-base md:text-lg">{step.title}</h4>
                      <p className="text-gray-600 text-sm md:text-base">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-100 p-6 md:p-8 rounded-2xl">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6 text-center">
                Success Roadmap Video
              </h3>
              <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-4 md:mb-6">
                <video
                  ref={videoRef}
                  src={roadmapVideo}
                  className="w-full h-full object-cover"
                  controls
                  poster=""
                  preload="metadata"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="space-y-2 md:space-y-3">
                <div className="flex items-center gap-2 md:gap-3 text-gray-700">
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs md:text-sm font-bold flex-shrink-0">
                    1
                  </div>
                  <span className="text-sm md:text-base">Diagnostic Test & Goal Setting</span>
                </div>
                <div className="flex items-center gap-2 md:gap-3 text-gray-700">
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs md:text-sm font-bold flex-shrink-0">
                    2
                  </div>
                  <span className="text-sm md:text-base">Structured Learning Path</span>
                </div>
                <div className="flex items-center gap-2 md:gap-3 text-gray-700">
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs md:text-sm font-bold flex-shrink-0">
                    3
                  </div>
                  <span className="text-sm md:text-base">Regular Practice & Assessments</span>
                </div>
                <div className="flex items-center gap-2 md:gap-3 text-gray-700">
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs md:text-sm font-bold flex-shrink-0">
                    4
                  </div>
                  <span className="text-sm md:text-base">Performance Analysis</span>
                </div>
                <div className="flex items-center gap-2 md:gap-3 text-gray-700">
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs md:text-sm font-bold flex-shrink-0">
                    5
                  </div>
                  <span className="text-sm md:text-base">Revision & Mock Tests</span>
                </div>
                <div className="flex items-center gap-2 md:gap-3 text-gray-700">
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs md:text-sm font-bold flex-shrink-0">
                    6
                  </div>
                  <span className="text-sm md:text-base">Exam Readiness</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-20 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Student Success Stories</h2>
            <p className="text-lg md:text-xl text-gray-600">
              Hear from our students who have achieved remarkable success in their academic journeys.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                name: "Rohit Kumar",
                score: "95%",
                exam: "JEE Main",
                feedback:
                  "The Ph.D. faculty's structured curriculum and expert guidance helped me secure a top rank in JEE Main. Their teaching methodology is exceptional.",
                achievement: "AIR 1245",
              },
              {
                name: "Priya Singh",
                score: "680/720",
                exam: "NEET",
                feedback:
                  "Comprehensive biology lectures by Ph.D. experts and regular mock tests made all the difference. The research-based study material is perfectly aligned.",
                achievement: "MBBS AIIMS",
              },
              {
                name: "Aditya Patel",
                score: "98%",
                exam: "CUET (UG)",
                feedback:
                  "The personalized attention by NET qualified faculty and doubt-solving sessions helped me achieve 98% in CUET. Highly recommended platform!",
                achievement: "Delhi University",
              },
            ].map((testimonial, idx) => (
              <div
                key={idx}
                className="bg-white p-6 md:p-8 rounded-xl border border-gray-200 hover:shadow-lg transition"
              >
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="fas fa-star text-yellow-400 text-base md:text-lg"></i>
                  ))}
                </div>
                <p className="text-gray-700 mb-4 md:mb-6 italic leading-relaxed text-sm md:text-base">
                  "{testimonial.feedback}"
                </p>
                <div className="border-t border-gray-200 pt-3 md:pt-4">
                  <p className="font-bold text-gray-900 text-base md:text-lg">{testimonial.name}</p>
                  <p className="text-blue-600 font-semibold text-sm md:text-base">
                    {testimonial.score} • {testimonial.exam}
                  </p>
                  <p className="text-green-600 text-xs md:text-sm font-medium mt-1">
                    <i className="fas fa-trophy"></i> {testimonial.achievement}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-20 lg:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about Biology.Trunk courses, enrollment, and learning experience.
            </p>
          </div>
          <div className="space-y-3 md:space-y-4">
            {faqItems.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  className="w-full px-4 md:px-6 py-3 md:py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                  onClick={() => setFaqOpen(faqOpen === index ? null : index)}
                >
                  <span className="font-semibold text-gray-900 text-sm md:text-lg text-left pr-4">{item.question}</span>
                  <i className={`fas fa-chevron-${faqOpen === index ? "up" : "down"} text-blue-600 flex-shrink-0`}></i>
                </button>
                {faqOpen === index && (
                  <div className="px-4 md:px-6 py-3 md:py-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-700 text-sm md:text-base">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-8 md:mt-12">
            <p className="text-gray-600 mb-3 md:mb-4">Still have questions?</p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 md:px-8 py-2.5 md:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-sm md:text-base"
            >
              <i className="fas fa-headset"></i>
              Contact Support
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 md:mb-6">
            Ready to Transform Your Academic Journey?
          </h2>
          <p className="text-base md:text-xl text-blue-100 mb-6 md:mb-8 max-w-2xl mx-auto">
            Join thousands of successful students who have achieved their dreams with Biology.Trunk. Start your
            preparation today with our Ph.D. expert-led courses and comprehensive learning ecosystem.
          </p>
          {!user && (
            <div className="flex gap-3 md:gap-4 justify-center flex-wrap">
              <Link
                to="/register"
                className="px-4 md:px-6 lg:px-8 py-2.5 md:py-3 lg:py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition font-bold shadow-lg hover:shadow-xl flex items-center gap-1 md:gap-2 text-sm md:text-base"
              >
                <i className="fas fa-rocket"></i>
                Start Free Trial
              </Link>
              <Link
                to="/login"
                className="px-4 md:px-6 lg:px-8 py-2.5 md:py-3 lg:py-4 border-2 border-white text-white rounded-lg hover:bg-blue-500 transition font-bold flex items-center gap-1 md:gap-2 text-sm md:text-base"
              >
                <i className="fas fa-calendar-check"></i>
                Schedule Demo
              </Link>
            </div>
          )}
          {user && (
            <div className="flex gap-3 md:gap-4 justify-center flex-wrap">
              <Link
                to={`/${user.role}-dashboard`}
                className="px-4 md:px-6 lg:px-8 py-2.5 md:py-3 lg:py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition font-bold shadow-lg flex items-center gap-1 md:gap-2 text-sm md:text-base"
              >
                <i className="fas fa-tachometer-alt"></i>
                Continue Learning
              </Link>
              <Link
                to="/courses"
                className="px-4 md:px-6 lg:px-8 py-2.5 md:py-3 lg:py-4 border-2 border-white text-white rounded-lg hover:bg-blue-500 transition font-bold flex items-center gap-1 md:gap-2 text-sm md:text-base"
              >
                <i className="fas fa-search"></i>
                Explore Courses
              </Link>
            </div>
          )}
          <p className="text-blue-200 mt-4 md:mt-6 text-xs md:text-sm">
            <i className="fas fa-shield-alt mr-1 md:mr-2"></i>
            7-day money back guarantee • 24/7 student support
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-6 md:mb-8">
            <div>
              <h4 className="text-white font-bold mb-3 md:mb-4 text-base md:text-lg">About Biology.Trunk</h4>
              <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
                India's premier online learning platform providing quality education led by Ph.D. experts, NET & GATE
                qualified faculty with 15+ years of government college teaching experience.
              </p>
              <div className="flex gap-3 md:gap-4 mt-3 md:mt-4">
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <i className="fab fa-facebook text-base md:text-lg"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <i className="fab fa-twitter text-base md:text-lg"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <i className="fab fa-linkedin text-base md:text-lg"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <i className="fab fa-instagram text-base md:text-lg"></i>
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-3 md:mb-4 text-base md:text-lg">Courses</h4>
              <ul className="text-xs md:text-sm space-y-2 md:space-y-3">
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
                    <a href="#" className="text-gray-400 hover:text-white transition flex items-center gap-1 md:gap-2">
                      <i className="fas fa-chevron-right text-xs"></i>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-3 md:mb-4 text-base md:text-lg">Faculty Credentials</h4>
              <ul className="text-xs md:text-sm space-y-2 md:space-y-3">
                {[
                  "Ph.D. Holders",
                  "NET & GATE Qualified",
                  "Ex Government College Lecturers",
                  "15+ Years Experience",
                  "IIT/NIT Alumni",
                  "Subject Matter Experts",
                ].map((item) => (
                  <li key={item}>
                    <div className="text-gray-400 flex items-center gap-1 md:gap-2">
                      <i className="fas fa-check text-green-500 text-xs"></i>
                      {item}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-3 md:mb-4 text-base md:text-lg">Legal</h4>
              <ul className="text-xs md:text-sm space-y-2 md:space-y-3">
                {["Privacy Policy", "Terms of Service", "Refund Policy", "Cookie Policy"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-white transition flex items-center gap-1 md:gap-2">
                      <i className="fas fa-chevron-right text-xs"></i>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 md:pt-8 text-center">
            <p className="text-xs md:text-sm text-gray-400">
              <i className="fas fa-copyright mr-1 md:mr-2"></i>
              2025 Biology.Trunk. All rights reserved. | Excellence in Education through Expert Guidance
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
