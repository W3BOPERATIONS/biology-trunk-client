"use client"

import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom"
import { useEffect, useState } from "react"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import StudentDashboard from "./pages/StudentDashboard"
import FacultyDashboard from "./pages/FacultyDashboard"
import AdminDashboard from "./pages/AdminDashboard"
import CourseDetail from "./pages/CourseDetail"
import CoursePreview from "./pages/CoursePreview"
import ViewAllCourses from "./pages/ViewAllCourses"
import FacultyCourseEdit from "./pages/FacultyCourseEdit"
import FacultyAddCourse from "./pages/FacultyAddCourse"
import ProtectedRoute from "./components/ProtectedRoute"
import Contact from "./pages/Contact"
import PrivacyPolicy from "./pages/PrivacyPolicy"
import TermsAndConditions from "./pages/TermsAndConditions"
import RefundPolicy from "./pages/RefundPolicy"
import SocialComingSoon from "./pages/SocialComingSoon"
import NotFound from "./pages/NotFound"

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")

    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "user" || e.key === "token") {
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        } else {
          setUser(null)
          if (window.location.pathname !== "/" && !["/login", "/register", "/contact"].includes(window.location.pathname)) {
            window.location.href = "/login"
          }
        }
      }
    }

    const handlePopState = () => {
      const previousPath = sessionStorage.getItem("previousPath")
      if (previousPath) {
        sessionStorage.removeItem("previousPath")
      }
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("popstate", handlePopState)
    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("popstate", handlePopState)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    sessionStorage.clear()
    setUser(null)
    window.location.href = "/"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-gray-900 text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home user={user} onLogout={handleLogout} />} />
        <Route
          path="/login"
          element={user ? <Navigate to={`/${user.role}-dashboard`} /> : <Login setUser={setUser} />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to={`/${user.role}-dashboard`} /> : <Register setUser={setUser} />}
        />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-conditions" element={<TermsAndConditions />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/course-preview/:courseId" element={<CoursePreview user={user} onLogout={handleLogout} />} />
        {/* Add new ViewAllCourses route - accessible to all */}
        <Route path="/view-all-courses" element={<ViewAllCourses />} />
        <Route
          path="/course/:courseId"
          element={
            <ProtectedRoute user={user} role="student">
              <CourseDetail user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/faculty/course/:courseId/edit"
          element={
            <ProtectedRoute user={user} role="faculty">
              <FacultyCourseEdit user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/faculty/course/create"
          element={
            <ProtectedRoute user={user} role="faculty">
              <FacultyAddCourse user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student-dashboard/*"
          element={
            <ProtectedRoute user={user} role="student">
              <StudentDashboard user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/faculty-dashboard/*"
          element={
            <ProtectedRoute user={user} role="faculty">
              <FacultyDashboard user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard/*"
          element={
            <ProtectedRoute user={user} role="admin">
              <AdminDashboard user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route path="/social-coming-soon" element={<SocialComingSoon />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}
