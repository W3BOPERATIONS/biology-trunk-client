// Navigation helper to manage back button state across the app
export const saveCurrentPath = () => {
  sessionStorage.setItem("previousPath", window.location.pathname)
}

export const getPreviousPath = () => {
  return sessionStorage.getItem("previousPath") || "/student-dashboard"
}

export const clearNavigationHistory = () => {
  sessionStorage.removeItem("previousPath")
}
