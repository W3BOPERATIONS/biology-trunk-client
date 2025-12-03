const getApiUrl = () => {
  // Check if VITE_API_URL is set in environment variables
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }

  // For development, use localhost
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    return "http://localhost:5000/api"
  }

  // For production, use the deployed backend URL
  return "https://biology-trunk-server.vercel.app/api"
}

export const API_URL = getApiUrl()
