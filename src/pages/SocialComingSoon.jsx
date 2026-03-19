import React from "react"
import { Link, useLocation } from "react-router-dom"

const SocialComingSoon = () => {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const activeType = queryParams.get("type")

  const socialIcons = [
    { type: "facebook", icon: "fab fa-facebook", color: "hover:text-blue-600", activeColor: "text-blue-600" },
    { type: "instagram", icon: "fab fa-instagram", color: "hover:text-pink-600", activeColor: "text-pink-600" },
    { type: "twitter", icon: "fab fa-twitter", color: "hover:text-blue-400", activeColor: "text-blue-400" },
    { type: "linkedin", icon: "fab fa-linkedin", color: "hover:text-blue-700", activeColor: "text-blue-700" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full text-center">
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center transform rotate-12 hover:rotate-0 transition-transform duration-300">
            <i className="fas fa-share-alt text-4xl text-blue-600"></i>
          </div>
        </div>
        
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Coming Soon!
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          We're currently setting up our social media presence to bring you even more value and updates.
        </p>
        
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-8">
          <p className="text-gray-700 font-medium italic">
            "Something exciting is brewing! We'll add our social media accounts as soon as they're ready to provide you with the best experience."
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <i className="fas fa-home"></i>
            Back to Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="px-8 py-3 bg-white text-gray-700 border border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-colors shadow-md transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <i className="fas fa-arrow-left"></i>
            Go Back
          </button>
        </div>
        
        <div className="mt-12 flex justify-center gap-8 text-3xl">
          {socialIcons.map((social) => (
            <div
              key={social.type}
              className={`transition-all duration-300 transform hover:scale-125 cursor-pointer ${
                activeType === social.type ? `${social.activeColor} scale-125 drop-shadow-lg` : `text-gray-300 ${social.color}`
              }`}
              title={social.type.charAt(0).toUpperCase() + social.type.slice(1)}
            >
              <i className={social.icon}></i>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SocialComingSoon
