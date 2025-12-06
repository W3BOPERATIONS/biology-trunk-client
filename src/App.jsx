"use client"

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useEffect, useState } from "react"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import StudentDashboard from "./pages/StudentDashboard"
import FacultyDashboard from "./pages/FacultyDashboard"
import AdminDashboard from "./pages/AdminDashboard"
import CourseDetail from "./pages/CourseDetail"
import CoursePreview from "./pages/CoursePreview"
import FacultyCourseEdit from "./pages/FacultyCourseEdit"
import FacultyAddCourse from "./pages/FacultyAddCourse"
import ProtectedRoute from "./components/ProtectedRoute"
import Contact from "./pages/Contact"
import PrivacyPolicy from "./pages/PrivacyPolicy"
import TermsAndConditions from "./pages/TermsAndConditions"
import RefundPolicy from "./pages/RefundPolicy"

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
    const handlePopState = () => {
      const previousPath = sessionStorage.getItem("previousPath")
      if (previousPath) {
        sessionStorage.removeItem("previousPath")
      }
    }

    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    sessionStorage.removeItem("previousPath")
    setUser(null)
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
        <Route
          path="/course/:courseId"
          element={
            <ProtectedRoute user={user} role="student">
              <CourseDetail user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/course-preview/:courseId"
          element={
            <ProtectedRoute user={user} role="student">
              <CoursePreview user={user} onLogout={handleLogout} />
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
          path="/student-dashboard"
          element={
            <ProtectedRoute user={user} role="student">
              <StudentDashboard user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/faculty-dashboard"
          element={
            <ProtectedRoute user={user} role="faculty">
              <FacultyDashboard user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute user={user} role="admin">
              <AdminDashboard user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  )
}
