import { Navigate } from "react-router-dom"

export default function ProtectedRoute({ user, role, children }) {
  // Check if we're in the process of logging out (user is null but we're on a protected route)
  // In this case, redirect to home instead of login
  if (!user) {
    const currentPath = window.location.pathname
    const isProtectedRoute = currentPath.includes("dashboard") || currentPath.includes("course") || currentPath.includes("faculty")
    
    // If we're on a protected route and user is null, we're likely logging out
    // Redirect to home directly instead of login
    if (isProtectedRoute) {
      return <Navigate to="/" replace />
    }
    return <Navigate to="/login" />
  }

  if (user.role !== role) {
    return <Navigate to="/" />
  }

  return children
}
