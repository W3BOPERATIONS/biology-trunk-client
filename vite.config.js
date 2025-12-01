import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "https://biology-trunk-server.vercel.app",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'), // Optional: keep as-is
      },
    },
  },
  // For production builds
  build: {
    outDir: 'dist',
    sourcemap: false,
  }
})