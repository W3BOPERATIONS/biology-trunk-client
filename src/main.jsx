import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "./index.css"
import App from "./App.jsx"
import GlobalErrorBoundary from "./components/GlobalErrorBoundary"

// Suppress console logs in the browser to maintain a clean production-like environment
console.log = () => {}
console.info = () => {}
console.debug = () => {}
console.warn = () => {}
const originalError = console.error
console.error = (...args) => {
  const msg = args[0]
  if (typeof msg === "string" && (msg.includes("Failed to") || msg.includes("[DEBUG]") || msg.includes("Error"))) {
    return // Suppress common application-level API errors like "Failed to fetch course"
  }
  originalError(...args)
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GlobalErrorBoundary>
      <App />
    </GlobalErrorBoundary>
    <ToastContainer />
  </StrictMode>,
)
