import React from "react"
import { Link } from "react-router-dom"

const NotFound = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 text-center">
      <div className="mb-8">
        <h1 className="text-9xl font-black text-gray-100 relative">
          404
          <span className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-gray-900 mt-2">
            Oops!
          </span>
        </h1>
      </div>
      
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        Page Not Available
      </h2>
      
      <p className="text-gray-600 max-w-md mb-10 leading-relaxed">
        The URL you're looking for might be wrong, or the page has been moved. 
        Don't worry, even the best scientists get lost sometimes!
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to="/"
          className="px-10 py-4 bg-gray-900 text-white rounded-full font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2"
        >
          <i className="fas fa-home"></i>
          Go to Homepage
        </Link>
        <button
          onClick={() => window.history.back()}
          className="px-10 py-4 bg-white text-gray-900 border-2 border-gray-900 rounded-full font-bold hover:bg-gray-50 transition-all shadow-md transform hover:-translate-y-1 flex items-center gap-2"
        >
          <i className="fas fa-arrow-left"></i>
          Go Back
        </button>
      </div>
      
      <div className="mt-16 text-gray-400 animate-bounce">
        <i className="fas fa-search text-2xl"></i>
      </div>
    </div>
  )
}

export default NotFound
