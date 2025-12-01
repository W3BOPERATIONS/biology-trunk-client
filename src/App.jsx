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
import ProtectedRoute from "./components/ProtectedRoute"

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    const currentPath = localStorage.getItem("lastPath")

    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!loading && user) {
      const handleNavigate = () => {
        localStorage.setItem("lastPath", window.location.pathname)
      }
      window.addEventListener("popstate", handleNavigate)
      return () => window.removeEventListener("popstate", handleNavigate)
    }
  }, [loading, user])

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("lastPath")
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
        <Route
          path="/course/:courseId"
          element={
            <ProtectedRoute user={user} role="student">
              <CourseDetail user={user} onLogout={handleLogout} />
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
