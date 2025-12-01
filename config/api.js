const API_URL = import.meta.env.VITE_API_URL || "https://biology-trunk-server.vercel.app/api"

console.log("[v0] Environment:", {
  env: import.meta.env.MODE,
  apiUrl: API_URL,
  viteApiUrl: import.meta.env.VITE_API_URL,
})

export default API_URL
