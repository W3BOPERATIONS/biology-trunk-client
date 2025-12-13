"use client";

import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { API_URL } from "../utils/api.js";
import logo from "../assets/biology-trunk-logo.png";
import roadmapVideo from "../assets/biology-trunk-introduction.mp4";
import { showErrorToast } from "../utils/toast.js";

// Import all 8 gallery images from assets/image-gallery folder
import gallery1 from "../assets/image-gallery/study1.jpg";
import gallery2 from "../assets/image-gallery/study2.jpg";
import gallery3 from "../assets/image-gallery/study3.jpg";
import gallery4 from "../assets/image-gallery/study4.jpg";
import gallery5 from "../assets/image-gallery/study5.jpg";
import gallery6 from "../assets/image-gallery/study6.jpg";
import gallery7 from "../assets/image-gallery/study7.jpg";
import gallery8 from "../assets/image-gallery/study8.jpg";

export default function Home({ user, onLogout }) {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const galleryIntervalRef = useRef(null);
  const [stats, setStats] = useState({
    totalCourses: 0,
    premiumCourses: 0,
    totalFaculty: 0,
    totalStudents: 0,
  });
  const [faqOpen, setFaqOpen] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoScroll, setIsAutoScroll] = useState(true);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const DEMO_VIDEO_URL = "https://youtu.be/mNs8ewx5JrU?si=MROQVRQY3eCVCcdP";

  // Gallery images array with imported images
  const [galleryImages] = useState([
    { src: gallery1, alt: "Biology Trunk Classroom" },
    { src: gallery2, alt: "Biology Trunk Study Session" },
    { src: gallery3, alt: "Biology Trunk Laboratory" },
    { src: gallery4, alt: "Biology Trunk Study Group" },
    { src: gallery5, alt: "Biology Trunk Faculty Teaching" },
    { src: gallery6, alt: "Biology Trunk Students Learning" },
    { src: gallery7, alt: "Biology Trunk Interactive Session" },
    { src: gallery8, alt: "Biology Trunk Success Celebration" },
  ]);

  const hasCalledFetchStatsRef = useRef(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (!hasCalledFetchStatsRef.current) {
      fetchStats();
      fetchCategories();
      hasCalledFetchStatsRef.current = true;
    }

    // Start auto-scroll only if enabled
    if (isAutoScroll) {
      startAutoScroll();
    }

    return () => {
      // Cleanup interval on component unmount
      if (galleryIntervalRef.current) {
        clearInterval(galleryIntervalRef.current);
      }
    };
  }, [isAutoScroll]); // Re-run when auto-scroll state changes

  const startAutoScroll = () => {
    // Clear existing interval
    if (galleryIntervalRef.current) {
      clearInterval(galleryIntervalRef.current);
    }

    // Start new interval for auto-scroll
    galleryIntervalRef.current = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
    }, 3000); // Change image every 3 seconds
  };

  const stopAutoScroll = () => {
    setIsAutoScroll(false);
    if (galleryIntervalRef.current) {
      clearInterval(galleryIntervalRef.current);
      galleryIntervalRef.current = null;
    }
  };

  const handlePrevClick = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + galleryImages.length) % galleryImages.length
    );
    stopAutoScroll();
  };

  const handleNextClick = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
    stopAutoScroll();
  };

  const handleWatchDemo = () => {
    setShowDemoModal(true);
  };

  const getEmbedUrl = (url) => {
    try {
      let videoId = "";
      if (url.includes("youtube.com")) {
        videoId = url.split("v=")[1]?.split("&")[0];
      } else if (url.includes("youtu.be")) {
        videoId = url.split("/").pop()?.split("?")[0];
      }
      return videoId
        ? `https://www.youtube.com/embed/${videoId}?autoplay=1`
        : "";
    } catch (error) {
      return "";
    }
  };

  const fetchStats = async () => {
    try {
      const [courses, faculty, students] = await Promise.all([
        axios.get(`${API_URL}/courses?limit=1000`),
        axios.get(`${API_URL}/users/role/faculty`),
        axios.get(`${API_URL}/users/role/student`),
      ]);

      const courseCount = courses.data.courses
        ? courses.data.courses.length
        : courses.data.length;
      const premiumCourses = courses.data.courses
        ? courses.data.courses.filter((c) => c.price > 0).length
        : courses.data.filter((c) => c.price > 0).length;

      setStats({
        totalCourses: courseCount,
        premiumCourses: premiumCourses,
        totalFaculty: faculty.data.length,
        totalStudents: students.data.length,
      });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
      if (stats.totalCourses > 0) {
        showErrorToast("Failed to reload homepage statistics");
      }
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/courses/categories/list`);
      // Limit to only 8 categories as requested
      setCategories(response.data.slice(0, 8));
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const handleCategoryClick = (category) => {
    navigate(`/view-all-courses?category=${encodeURIComponent(category)}`);
  };

  const handleFooterCourseClick = (course) => {
    navigate(`/view-all-courses?category=${encodeURIComponent(course)}`);
  };

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
      question: "What is the refund policy?",
      answer:
        "We offer a 7-day money-back guarantee from the date of enrollment if you are not satisfied with the course or if it doesn't meet your expectations. Please refer to our refund policy page for complete details.",
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
  ];

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
              <span className="text-gray-900 font-bold text-2xl sm:text-3xl hidden sm:block">
                Biology.Trunk
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              {user ? (
                <>
                  <span className="text-gray-700 font-medium text-sm sm:text-base hidden sm:inline">
                    {user.name}
                  </span>
                  <button
                    onClick={onLogout}
                    className="px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold flex items-center gap-1 sm:gap-2 text-sm sm:text-base cursor-pointer"
                  >
                    <i className="fas fa-sign-out-alt text-sm"></i>
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-3 sm:px-4 py-2 text-gray-700 hover:text-blue-600 transition font-medium flex items-center gap-1 sm:gap-2 text-sm sm:text-base cursor-pointer"
                  >
                    <i className="fas fa-sign-in-alt text-sm"></i>
                    <span className="hidden sm:inline">Login</span>
                  </Link>
                  <Link
                    to="/register"
                    className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold flex items-center gap-1 sm:gap-2 text-sm sm:text-base cursor-pointer"
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

      {/* Hero Section - Reduced padding and font size */}
      <section className="bg-white py-8 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
            <div className="space-y-4 sm:space-y-6">
              <div>
                {/* Reduced font size for main headline */}
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                  Transform Your Academic Career with {/* Ph.D. */}
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Ph.D. Expert Faculty
                  </span>{" "}
                  <span className="text-black">&</span> {/* IIT */}
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    IIT
                  </span>{" "}
                  <span className="text-black">&</span> {/* NITian */}
                  <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    NITian Faculty
                  </span>
                </h1>

                <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                  Join India's premier online learning platform led by Ph.D.
                  holders, NET & GATE qualified experts with 15+ years of teaching experience. Access comprehensive
                  courses and personalized mentorship for academic excellence.
                </p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 text-gray-600">
                  <div className="flex items-center gap-2">
                    <i className="fas fa-check-circle text-green-500 text-lg"></i>
                    <span className="text-base sm:text-lg">
                      Ph.D. Qualified Faculty
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="fas fa-check-circle text-green-500 text-lg"></i>
                    <span className="text-base sm:text-lg">
                      15+ Years Experience
                    </span>
                  </div>
                </div>
              </div>

              {!user && (
                <div className="flex gap-3 sm:gap-4 flex-wrap">
                  <Link
                    to="/register"
                    className="px-5 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold shadow-lg hover:shadow-xl flex items-center gap-2 text-base sm:text-lg cursor-pointer"
                  >
                    <i className="fas fa-rocket"></i>
                    Enroll Now
                  </Link>
                  <button
                    onClick={handleWatchDemo}
                    className="px-5 sm:px-6 py-2.5 sm:py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition font-semibold flex items-center gap-2 text-base sm:text-lg cursor-pointer"
                  >
                    <i className="fas fa-play-circle"></i>
                    Watch Demo
                  </button>
                </div>
              )}
              {user && (
                <Link
                  to={`/${user.role}-dashboard`}
                  className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold shadow-lg text-base sm:text-lg cursor-pointer"
                >
                  <i className="fas fa-tachometer-alt"></i>
                  Go to Dashboard
                </Link>
              )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white p-5 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-blue-200 cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-star text-blue-600 text-xl"></i>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {stats.premiumCourses}+
                    </div>
                    <div className="text-gray-700 font-semibold">
                      Premium Courses
                    </div>
                    <div className="text-gray-500 text-sm">
                      Expert-Curated Content
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-green-200 cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-users text-green-600 text-xl"></i>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">50K+</div>
                    <div className="text-gray-700 font-semibold">
                      Successful Students
                    </div>
                    <div className="text-gray-500 text-sm">Proven Results</div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-purple-200 cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-user-graduate text-purple-600 text-xl"></i>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {stats.totalFaculty}+
                    </div>
                    <div className="text-gray-700 font-semibold">
                      Ph.D. Faculty
                    </div>
                    <div className="text-gray-500 text-sm">
                      NET & GATE Qualified
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-orange-200 cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-chart-line text-orange-600 text-xl"></i>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">98%</div>
                    <div className="text-gray-700 font-semibold">
                      Success Track Record
                    </div>
                    <div className="text-gray-500 text-sm">
                      Exceptional Results
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Gallery Section - Simplified */}
      <section className="py-8 sm:py-12 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Our Learning Environment
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our state-of-the-art facilities
            </p>
          </div>

          {/* Main Gallery - Simplified */}
          <div className="relative">
            <div className="bg-white p-2 sm:p-3 rounded-xl shadow-lg">
              <div className="relative overflow-hidden rounded-lg aspect-video">
                <img
                  src={
                    galleryImages[currentImageIndex].src || "/placeholder.svg"
                  }
                  alt={galleryImages[currentImageIndex].alt}
                  className="w-full h-full object-cover transition-opacity duration-500"
                  onClick={stopAutoScroll}
                />

                {/* Navigation Buttons Only */}
                <button
                  onClick={handlePrevClick}
                  className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all cursor-pointer"
                >
                  <i className="fas fa-chevron-left text-lg"></i>
                </button>
                <button
                  onClick={handleNextClick}
                  className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all cursor-pointer"
                >
                  <i className="fas fa-chevron-right text-lg"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expert Faculty Qualifications Section - Updated */}
      <section className="py-8 sm:py-12 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            {/* Slightly increased heading font size */}
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Our Esteemed Faculty Credentials
            </h2>
            {/* Slightly increased description font size */}
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Learn from the best in the industry with exceptional
              qualifications and experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {/* Ph.D. Holders Card */}
            <div className="bg-white p-6 sm:p-7 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-blue-200 group h-full flex flex-col cursor-pointer">
              {/* Icon with hover effect - slightly larger */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 transition-colors">
                <i className="fas fa-graduation-cap text-blue-600 text-xl sm:text-2xl group-hover:text-white transition-colors"></i>
              </div>
              {/* Heading with fixed height for alignment - slightly larger */}
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 text-center min-h-[48px] flex items-center justify-center leading-tight">
                Ph.D. Holders
              </h3>
              {/* Description with consistent alignment - slightly larger */}
              <p className="text-gray-600 text-sm sm:text-base text-center">
                Doctoral degree holders with research expertise
              </p>
            </div>

            {/* NET & GATE Qualified Card */}
            <div className="bg-white p-6 sm:p-7 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-green-200 group h-full flex flex-col cursor-pointer">
              {/* Icon with hover effect - slightly larger */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-600 transition-colors">
                <i className="fas fa-award text-green-600 text-xl sm:text-2xl group-hover:text-white transition-colors"></i>
              </div>
              {/* Heading with fixed height for alignment - slightly larger */}
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 text-center min-h-[48px] flex items-center justify-center leading-tight">
                NET & GATE Qualified
              </h3>
              {/* Description with consistent alignment - slightly larger */}
              <p className="text-gray-600 text-sm sm:text-base text-center">
                Nationally recognized qualification holders
              </p>
            </div>

            {/* Ex Government College Lecturers Card */}
            <div className="bg-white p-6 sm:p-7 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-purple-200 group h-full flex flex-col cursor-pointer">
              {/* Icon with hover effect - slightly larger */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-600 transition-colors">
                <i className="fas fa-university text-purple-600 text-xl sm:text-2xl group-hover:text-white transition-colors"></i>
              </div>
              {/* Heading with fixed height for alignment - slightly larger */}
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 text-center min-h-[48px] flex items-center justify-center leading-tight">
                College Lecturers
              </h3>
              {/* Description with consistent alignment - slightly larger */}
              <p className="text-gray-600 text-sm sm:text-base text-center">
                Former lecturers with institutional teaching experience
              </p>
            </div>

            {/* 15+ Years Experience Card */}
            <div className="bg-white p-6 sm:p-7 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-orange-200 group h-full flex flex-col cursor-pointer">
              {/* Icon with hover effect - slightly larger */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-600 transition-colors">
                <i className="fas fa-chart-line text-orange-600 text-xl sm:text-2xl group-hover:text-white transition-colors"></i>
              </div>
              {/* Heading with fixed height for alignment - slightly larger */}
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 text-center min-h-[48px] flex items-center justify-center leading-tight">
                15+ Years Experience
              </h3>
              {/* Description with consistent alignment - slightly larger */}
              <p className="text-gray-600 text-sm sm:text-base text-center">
                Decades of proven teaching methodology
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-8 sm:py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Why Choose Biology.Trunk?
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
              We combine decades of teaching experience with cutting-edge
              technology to deliver exceptional learning outcomes across all
              competitive exam segments.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Card 1: Ph.D. Expert Faculty */}
            <div className="bg-white p-5 sm:p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-blue-200 group h-full flex flex-col cursor-pointer">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-blue-600 transition-colors flex-shrink-0">
                <i className="fas fa-user-graduate text-blue-600 text-lg sm:text-xl group-hover:text-white"></i>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 min-h-[60px] sm:min-h-[72px] flex items-center">
                Ph.D. Expert Faculty
              </h3>
              <p className="text-gray-700 mb-3 leading-relaxed text-sm flex-grow">
                Learn from Ph.D. holders, NET & GATE qualified experts with 15+
                years of government college teaching experience.
              </p>
              <ul className="space-y-1.5">
                <li className="flex items-start gap-2 text-gray-600">
                  <i className="fas fa-check text-green-500 text-xs mt-0.5 flex-shrink-0"></i>
                  <span className="text-xs">Ph.D. Qualified</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <i className="fas fa-check text-green-500 text-xs mt-0.5 flex-shrink-0"></i>
                  <span className="text-xs">NET & GATE Experts</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <i className="fas fa-check text-green-500 text-xs mt-0.5 flex-shrink-0"></i>
                  <span className="text-xs">Government College Experience</span>
                </li>
              </ul>
            </div>

            {/* Card 2: Comprehensive Curriculum */}
            <div className="bg-white p-5 sm:p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-green-200 group h-full flex flex-col cursor-pointer">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-100 rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-green-600 transition-colors flex-shrink-0">
                <i className="fas fa-book-open text-green-600 text-lg sm:text-xl group-hover:text-white"></i>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 min-h-[60px] sm:min-h-[72px] flex items-center">
                Comprehensive Curriculum
              </h3>
              <p className="text-gray-700 mb-3 leading-relaxed text-sm flex-grow">
                Structured learning paths covering all major competitive exams
                with updated syllabus and exam patterns.
              </p>
              <ul className="space-y-1.5">
                <li className="flex items-start gap-2 text-gray-600">
                  <i className="fas fa-check text-green-500 text-xs mt-0.5 flex-shrink-0"></i>
                  <span className="text-xs">Updated Content</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <i className="fas fa-check text-green-500 text-xs mt-0.5 flex-shrink-0"></i>
                  <span className="text-xs">Structured Modules</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <i className="fas fa-check text-green-500 text-xs mt-0.5 flex-shrink-0"></i>
                  <span className="text-xs">Research-Based Material</span>
                </li>
              </ul>
            </div>

            {/* Card 3: Live Interactive Classes */}
            <div className="bg-white p-5 sm:p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-purple-200 group h-full flex flex-col cursor-pointer">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-purple-600 transition-colors flex-shrink-0">
                <i className="fas fa-video text-purple-600 text-lg sm:text-xl group-hover:text-white"></i>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 min-h-[60px] sm:min-h-[72px] flex items-center">
                Live Interactive Classes
              </h3>
              <p className="text-gray-700 mb-3 leading-relaxed text-sm flex-grow">
                Real-time learning experience with expert faculty and
                interactive doubt-solving sessions.
              </p>
              <ul className="space-y-1.5">
                <li className="flex items-start gap-2 text-gray-600">
                  <i className="fas fa-check text-green-500 text-xs mt-0.5 flex-shrink-0"></i>
                  <span className="text-xs">Live Sessions</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <i className="fas fa-check text-green-500 text-xs mt-0.5 flex-shrink-0"></i>
                  <span className="text-xs">Recorded Lectures</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <i className="fas fa-check text-green-500 text-xs mt-0.5 flex-shrink-0"></i>
                  <span className="text-xs">Personalized Doubt Solving</span>
                </li>
              </ul>
            </div>

            {/* Card 4: Performance Analytics */}
            <div className="bg-white p-5 sm:p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-orange-200 group h-full flex flex-col cursor-pointer">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-orange-600 transition-colors flex-shrink-0">
                <i className="fas fa-chart-bar text-orange-600 text-lg sm:text-xl group-hover:text-white"></i>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 min-h-[60px] sm:min-h-[72px] flex items-center">
                Performance Analytics
              </h3>
              <p className="text-gray-700 mb-3 leading-relaxed text-sm flex-grow">
                Detailed progress tracking with AI-powered insights and
                personalized improvement recommendations.
              </p>
              <ul className="space-y-1.5">
                <li className="flex items-start gap-2 text-gray-600">
                  <i className="fas fa-check text-green-500 text-xs mt-0.5 flex-shrink-0"></i>
                  <span className="text-xs">Progress Reports</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <i className="fas fa-check text-green-500 text-xs mt-0.5 flex-shrink-0"></i>
                  <span className="text-xs">AI Analysis</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <i className="fas fa-check text-green-500 text-xs mt-0.5 flex-shrink-0"></i>
                  <span className="text-xs">Exam Performance Predictions</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Course Categories - Limited to 8 categories as requested */}
      <section className="py-8 sm:py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Comprehensive Course Catalog
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our extensive range of courses designed for academic
              excellence and competitive success.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
            {categories.length > 0 ? (
              categories.map((cat) => (
                <div
                  key={cat._id}
                  onClick={() =>
                    navigate(
                      `/view-all-courses?category=${encodeURIComponent(
                        cat._id
                      )}`
                    )
                  }
                  className="bg-white p-4 sm:p-5 rounded-xl border border-gray-200 hover:shadow-xl hover:border-blue-300 transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 rounded-xl flex items-center justify-center transition-colors group-hover:bg-blue-600">
                      <i className="fas fa-book text-blue-600 text-lg sm:text-xl group-hover:text-white transition-colors"></i>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-gray-900 text-sm sm:text-base line-clamp-1">
                        {cat._id}
                      </div>
                      <div className="text-gray-500 text-xs sm:text-sm">
                        {cat.count} Courses
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-xs sm:text-sm text-gray-600">
                    <span className="font-medium">
                      {Math.round(cat.count * 1.2)}K+ Students
                    </span>
                    <i className="fas fa-arrow-right text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity text-base"></i>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                Loading categories...
              </div>
            )}
          </div>

          {/* View All Courses Button */}
          <div className="mt-8 sm:mt-10 flex justify-center">
            <Link to="/view-all-courses">
              <button className="px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-bold flex items-center gap-2 text-base sm:text-lg cursor-pointer">
                <i className="fas fa-arrow-right"></i>
                View All Courses
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Additional Courses Section */}
      <section className="py-8 sm:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Specialized Preparation Courses
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Advanced courses for specialized competitive examinations
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {
                name: "KVS/NVS",
                icon: "fas fa-school",
                color: "text-blue-600",
                students: "3K+",
              },
              {
                name: "NET & GATE",
                icon: "fas fa-award",
                color: "text-green-600",
                students: "4K+",
              },
              {
                name: "KYPS Olympiad",
                icon: "fas fa-medal",
                color: "text-purple-600",
                students: "2K+",
              },
              {
                name: "Foreign Languages",
                icon: "fas fa-globe",
                color: "text-orange-600",
                students: "1.5K+",
              },
            ].map((course) => (
              <div
                key={course.name}
                className="bg-gray-50 p-3 sm:p-4 rounded-xl border border-gray-200 hover:shadow-md transition cursor-pointer"
                onClick={() => handleCategoryClick(course.name)}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-lg flex items-center justify-center">
                    <i
                      className={`${course.icon} ${course.color} text-base`}
                    ></i>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {course.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {course.students} Students
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Methodology with Video */}
      <section className="py-8 sm:py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                Our Proven Learning Methodology
              </h2>
              <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6">
                Our structured approach ensures comprehensive concept
                understanding and exam readiness through systematic progression
                and continuous assessment.
              </p>
              <div className="space-y-3 sm:space-y-4">
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
                  <div key={index} className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <i
                        className={`${step.icon} text-blue-600 text-sm sm:text-base`}
                      ></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm sm:text-base">
                        {step.title}
                      </h4>
                      <p className="text-gray-600 text-xs sm:text-sm">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-100 p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 text-center">
                Success Roadmap Video
              </h3>
              <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-3 sm:mb-4">
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
              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex items-center gap-1.5 sm:gap-2 text-gray-700">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                    1
                  </div>
                  <span className="text-xs sm:text-sm">
                    Diagnostic Test & Goal Setting
                  </span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 text-gray-700">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                    2
                  </div>
                  <span className="text-xs sm:text-sm">
                    Structured Learning Path
                  </span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 text-gray-700">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                    3
                  </div>
                  <span className="text-xs sm:text-sm">
                    Regular Practice & Assessments
                  </span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 text-gray-700">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                    4
                  </div>
                  <span className="text-xs sm:text-sm">
                    Performance Analysis
                  </span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 text-gray-700">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                    5
                  </div>
                  <span className="text-xs sm:text-sm">
                    Revision & Mock Tests
                  </span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 text-gray-700">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                    6
                  </div>
                  <span className="text-xs sm:text-sm">Exam Readiness</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-8 sm:py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Student Success Stories
            </h2>
            <p className="text-base sm:text-lg text-gray-600">
              Hear from our students who have achieved remarkable success in
              their academic journeys.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
                className="bg-white p-4 sm:p-5 md:p-6 rounded-xl border border-gray-200 hover:shadow-lg transition cursor-pointer"
              >
                <div className="flex items-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <i
                      key={i}
                      className="fas fa-star text-yellow-400 text-sm"
                    ></i>
                  ))}
                </div>
                <p className="text-gray-700 mb-3 sm:mb-4 italic leading-relaxed text-sm">
                  "{testimonial.feedback}"
                </p>
                <div className="border-t border-gray-200 pt-2 sm:pt-3">
                  <p className="font-bold text-gray-900 text-sm sm:text-base">
                    {testimonial.name}
                  </p>
                  <p className="text-blue-600 font-semibold text-xs sm:text-sm">
                    {testimonial.score} • {testimonial.exam}
                  </p>
                  <p className="text-green-600 text-xs font-medium mt-1">
                    <i className="fas fa-trophy"></i> {testimonial.achievement}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-8 sm:py-12 md:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about Biology.Trunk courses,
              enrollment, and learning experience.
            </p>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-xl overflow-hidden"
              >
                <button
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left flex justify-between items-center hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setFaqOpen(faqOpen === index ? null : index)}
                >
                  <span className="font-semibold text-gray-900 text-sm sm:text-base text-left pr-3">
                    {item.question}
                  </span>
                  <i
                    className={`fas fa-chevron-${
                      faqOpen === index ? "up" : "down"
                    } text-blue-600 flex-shrink-0 text-sm`}
                  ></i>
                </button>
                {faqOpen === index && (
                  <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-700 text-xs sm:text-sm">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-6 sm:mt-8">
            <p className="text-gray-600 mb-2 sm:mb-3">Still have questions?</p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-sm cursor-pointer"
            >
              <i className="fas fa-headset"></i>
              Contact Support
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-8 sm:py-12 md:py-16 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4">
            Ready to Transform Your Academic Journey?
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-blue-100 mb-4 sm:mb-6 max-w-2xl mx-auto">
            Join thousands of successful students who have achieved their dreams
            with Biology.Trunk. Start your preparation today with our Ph.D.
            expert-led courses and comprehensive learning ecosystem.
          </p>
          {!user && (
            <div className="flex gap-2 sm:gap-3 justify-center flex-wrap">
              <Link
                to="/register"
                className="px-3 sm:px-4 py-1.5 sm:py-2.5 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition font-bold shadow-lg hover:shadow-xl flex items-center gap-1 text-sm cursor-pointer"
              >
                <i className="fas fa-rocket"></i>
                Get Started Now
              </Link>
              <button
                onClick={handleWatchDemo}
                className="px-3 sm:px-4 py-1.5 sm:py-2.5 border-2 border-white text-white rounded-lg hover:bg-blue-500 transition font-bold flex items-center gap-1 text-sm cursor-pointer"
              >
                <i className="fas fa-play"></i>
                Watch Demo
              </button>
            </div>
          )}
          {user && (
            <div className="flex gap-2 sm:gap-3 justify-center flex-wrap">
              <Link
                to={`/${user.role}-dashboard`}
                className="px-3 sm:px-4 py-1.5 sm:py-2.5 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition font-bold shadow-lg flex items-center gap-1 text-sm cursor-pointer"
              >
                <i className="fas fa-tachometer-alt"></i>
                Continue Learning
              </Link>
              <Link
                to="/courses"
                className="px-3 sm:px-4 py-1.5 sm:py-2.5 border-2 border-white text-white rounded-lg hover:bg-blue-500 transition font-bold flex items-center gap-1 text-sm cursor-pointer"
              >
                <i className="fas fa-search"></i>
                Explore Courses
              </Link>
            </div>
          )}
          <p className="text-blue-200 mt-3 sm:mt-4 text-xs">
            <i className="fas fa-shield-alt mr-1"></i>
            7-day money back guarantee • 24/7 student support
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-6">
            <div>
              <h4 className="text-white font-bold mb-2 sm:mb-3 text-sm sm:text-base">
                About Biology.Trunk
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                India's premier online learning platform providing quality
                education led by Ph.D. experts, NET & GATE qualified faculty
                with 15+ years of government college teaching experience.
              </p>
              <div className="flex gap-2 sm:gap-3 mt-2">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition cursor-pointer"
                >
                  <i className="fab fa-facebook text-sm"></i>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition cursor-pointer"
                >
                  <i className="fab fa-twitter text-sm"></i>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition cursor-pointer"
                >
                  <i className="fab fa-linkedin text-sm"></i>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition cursor-pointer"
                >
                  <i className="fab fa-instagram text-sm"></i>
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-2 sm:mb-3 text-sm sm:text-base">
                Courses
              </h4>
              <ul className="text-xs space-y-1.5">
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
                      onClick={() => handleFooterCourseClick(item)}
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
              <h4 className="text-white font-bold mb-2 sm:mb-3 text-sm sm:text-base">
                Faculty Credentials
              </h4>
              <ul className="text-xs space-y-1.5">
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
              <h4 className="text-white font-bold mb-2 sm:mb-3 text-sm sm:text-base">
                Legal
              </h4>
              <ul className="text-xs space-y-1.5">
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
                  <Link
                    to="/contact"
                    className="text-gray-400 hover:text-white transition flex items-center gap-1 cursor-pointer"
                  >
                    <i className="fas fa-chevron-right text-xs"></i>
                    Contact Support
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-4 text-center">
            <p className="text-xs text-gray-400">
              <i className="fas fa-copyright mr-1"></i>
              2025 Biology.Trunk. All rights reserved. | Excellence in Education
              through Expert Guidance
            </p>
          </div>
        </div>
      </footer>

      {showDemoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Watch Demo</h2>
              <button
                onClick={() => {
                  setShowDemoModal(false);
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl cursor-pointer"
              >
                ×
              </button>
            </div>
            <div className="p-4">
              {getEmbedUrl(DEMO_VIDEO_URL) ? (
                <div className="aspect-video">
                  <iframe
                    width="100%"
                    height="100%"
                    src={getEmbedUrl(DEMO_VIDEO_URL)}
                    title="Demo Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <div className="aspect-video bg-gray-100 flex items-center justify-center rounded-lg">
                  <p className="text-gray-500">Invalid YouTube URL</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
