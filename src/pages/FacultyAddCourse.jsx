"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { API_URL } from "../utils/api.js"
import { showSuccessToast, showErrorToast } from "../utils/toast.js"
import logo from "../assets/biology-trunk-logo.png"

export default function FacultyAddCourse({ user, onLogout }) {
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    courseLevel: "",
    prerequisites: "",
    curriculum: [],
    whatYouWillLearn: [],
    courseIncludes: {
      videos: false,
      liveLectures: false,
      pdfs: false,
      quizzes: false,
      assignments: false,
      certificates: false,
    },
    category: "",
    price: "",
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleIncludesChange = (key) => {
    setFormData((prev) => ({
      ...prev,
      courseIncludes: {
        ...prev.courseIncludes,
        [key]: !prev.courseIncludes[key],
      },
    }))
  }

  const handleArrayInputChange = (field, index, value) => {
    setFormData((prev) => {
      const updated = [...prev[field]]
      updated[index] = value
      return { ...prev, [field]: updated }
    })
  }

  const handleAddArrayItem = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }))
  }

  const handleRemoveArrayItem = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }))
  }

  const handleAddModule = () => {
    setFormData((prev) => ({
      ...prev,
      curriculum: [...prev.curriculum, { module: "", topics: [""] }],
    }))
  }

  const handleRemoveModule = (index) => {
    setFormData((prev) => ({
      ...prev,
      curriculum: prev.curriculum.filter((_, i) => i !== index),
    }))
  }

  const handleModuleChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.curriculum]
      updated[index] = { ...updated[index], [field]: value }
      return { ...prev, curriculum: updated }
    })
  }

  const handleTopicChange = (moduleIndex, topicIndex, value) => {
    setFormData((prev) => {
      const updated = [...prev.curriculum]
      updated[moduleIndex].topics[topicIndex] = value
      return { ...prev, curriculum: updated }
    })
  }

  const handleAddTopic = (moduleIndex) => {
    setFormData((prev) => {
      const updated = [...prev.curriculum]
      updated[moduleIndex].topics.push("")
      return { ...prev, curriculum: updated }
    })
  }

  const handleRemoveTopic = (moduleIndex, topicIndex) => {
    setFormData((prev) => {
      const updated = [...prev.curriculum]
      updated[moduleIndex].topics = updated[moduleIndex].topics.filter((_, i) => i !== topicIndex)
      return { ...prev, curriculum: updated }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const courseData = {
        ...formData,
        faculty: user._id,
        students: [],
      }
      const response = await axios.post(`${API_URL}/courses`, courseData)
      showSuccessToast("Course created successfully!")
      setTimeout(() => {
        navigate("/faculty-dashboard")
      }, 500)
    } catch (error) {
      console.error("Failed to create course:", error)
      showErrorToast(error.response?.data?.message || "Failed to create course")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Consistent with FacultyDashboard */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center overflow-hidden">
                <img
                  src={logo || "/placeholder.svg"}
                  alt="Biology.Trunk Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="hidden sm:block">
                <span className="text-gray-900 font-bold text-lg sm:text-xl">Biology.Trunk</span>
                <p className="text-xs text-gray-500">Create New Course - {user.name}</p>
              </div>
              <div className="sm:hidden">
                <span className="text-gray-900 font-bold text-base">Create Course</span>
                <p className="text-xs text-gray-500">Faculty</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => navigate("/faculty-dashboard")}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
              >
                <i className="fas fa-home text-sm"></i>
                <span className="hidden sm:inline">Dashboard</span>
              </button>
              <button
                onClick={onLogout}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
              >
                <i className="fas fa-sign-out-alt text-sm"></i>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/faculty-dashboard")}
          className="mb-4 sm:mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm sm:text-base"
        >
          <i className="fas fa-arrow-left"></i>
          Back to Dashboard
        </button>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200 rounded-t-xl p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Create New Course</h1>
                <p className="text-gray-600 text-sm sm:text-base">
                  Fill in the details below to create your new course
                </p>
              </div>
              <div className="text-sm sm:text-base text-gray-600">
                <i className="fas fa-lightbulb text-yellow-600 mr-1"></i>
                Create once, teach thousands!
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 lg:p-8">
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              {/* Basic Information Section */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <i className="fas fa-info-circle text-blue-600 text-lg sm:text-xl"></i>
                  Basic Information
                </h2>
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <label className="block text-gray-700 text-sm sm:text-base font-semibold mb-2 flex items-center gap-2">
                      <i className="fas fa-heading text-blue-600 text-sm"></i>
                      Course Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition text-sm sm:text-base"
                      placeholder="e.g., Introduction to Computer Science"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm sm:text-base font-semibold mb-2 flex items-center gap-2">
                      <i className="fas fa-align-left text-blue-600 text-sm"></i>
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition text-sm sm:text-base"
                      placeholder="Describe what students will learn in this course..."
                      required
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-gray-700 text-sm sm:text-base font-semibold mb-2 flex items-center gap-2">
                        <i className="fas fa-tag text-green-600 text-sm"></i>
                        Category *
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition text-sm sm:text-base"
                        required
                      >
                        <option value="">Select Category</option>
                        <option value="Class 9">Class 9</option>
                        <option value="Class 10">Class 10</option>
                        <option value="Class 11">Class 11</option>
                        <option value="Class 12">Class 12</option>
                        <option value="JEE">JEE</option>
                        <option value="NEET">NEET</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm sm:text-base font-semibold mb-2 flex items-center gap-2">
                        <i className="fas fa-rupee-sign text-purple-600 text-sm"></i>
                        Price (₹) *
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition text-sm sm:text-base"
                        placeholder="Enter course price"
                        min="0"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-gray-700 text-sm sm:text-base font-semibold mb-2 flex items-center gap-2">
                        <i className="fas fa-clock text-green-600 text-sm"></i>
                        Duration
                      </label>
                      <input
                        type="text"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        placeholder="e.g., 12 weeks, 3 months"
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition text-sm sm:text-base"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm sm:text-base font-semibold mb-2 flex items-center gap-2">
                        <i className="fas fa-chart-line text-purple-600 text-sm"></i>
                        Course Level
                      </label>
                      <select
                        name="courseLevel"
                        value={formData.courseLevel}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition text-sm sm:text-base"
                      >
                        <option value="">Select Level</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm sm:text-base font-semibold mb-2 flex items-center gap-2">
                      <i className="fas fa-book text-green-600 text-sm"></i>
                      Prerequisites
                    </label>
                    <textarea
                      name="prerequisites"
                      value={formData.prerequisites}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="What should students know before taking this course?"
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition text-sm sm:text-base"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* What Students Will Learn Section */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <i className="fas fa-graduation-cap text-green-600 text-lg sm:text-xl"></i>
                  What Students Will Learn
                </h2>
                <div className="space-y-3 sm:space-y-4">
                  {formData.whatYouWillLearn.map((item, index) => (
                    <div key={index} className="flex gap-2 sm:gap-3">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => handleArrayInputChange("whatYouWillLearn", index, e.target.value)}
                          placeholder="Enter learning outcome"
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition text-sm sm:text-base"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveArrayItem("whatYouWillLearn", index)}
                        className="px-3 sm:px-4 py-2.5 sm:py-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition flex items-center justify-center"
                      >
                        <i className="fas fa-trash text-sm"></i>
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleAddArrayItem("whatYouWillLearn")}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <i className="fas fa-plus text-sm"></i>
                    Add Learning Outcome
                  </button>
                </div>
              </div>

              {/* Course Curriculum Section */}
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <i className="fas fa-book text-purple-600 text-lg sm:text-xl"></i>
                  Course Curriculum
                </h2>
                <div className="space-y-4 sm:space-y-6">
                  {formData.curriculum.map((module, moduleIndex) => (
                    <div key={moduleIndex} className="bg-white border border-gray-300 rounded-lg p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={module.module}
                            onChange={(e) => handleModuleChange(moduleIndex, "module", e.target.value)}
                            placeholder="Module name (e.g., Introduction to Algebra)"
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition text-sm sm:text-base font-semibold"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveModule(moduleIndex)}
                          className="px-3 sm:px-4 py-2.5 sm:py-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition flex items-center gap-2 text-sm"
                        >
                          <i className="fas fa-trash text-sm"></i>
                          <span className="hidden sm:inline">Remove Module</span>
                          <span className="sm:hidden">Remove</span>
                        </button>
                      </div>

                      <div className="space-y-3 ml-3 sm:ml-6">
                        <p className="text-gray-700 text-sm sm:text-base font-semibold">Topics:</p>
                        {module.topics.map((topic, topicIndex) => (
                          <div key={topicIndex} className="flex gap-2 sm:gap-3">
                            <div className="flex-1">
                              <input
                                type="text"
                                value={topic}
                                onChange={(e) => handleTopicChange(moduleIndex, topicIndex, e.target.value)}
                                placeholder="Topic title (e.g., What is Algebra?)"
                                className="w-full px-3 sm:px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition text-sm"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveTopic(moduleIndex, topicIndex)}
                              className="px-3 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                            >
                              <i className="fas fa-times text-sm"></i>
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => handleAddTopic(moduleIndex)}
                          className="px-4 py-2.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition font-semibold flex items-center gap-2 text-sm"
                        >
                          <i className="fas fa-plus text-xs"></i>
                          Add Topic
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddModule}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <i className="fas fa-plus text-sm"></i>
                    Add Module
                  </button>
                </div>
              </div>

              {/* Course Includes Section */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <i className="fas fa-gift text-yellow-600 text-lg sm:text-xl"></i>
                  What's Included in This Course
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {Object.keys(formData.courseIncludes).map((key) => (
                    <label
                      key={key}
                      className="flex items-center gap-3 p-3 sm:p-4 bg-white border border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:shadow-sm transition"
                    >
                      <input
                        type="checkbox"
                        checked={formData.courseIncludes[key]}
                        onChange={() => handleIncludesChange(key)}
                        className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <span className="text-gray-700 text-sm sm:text-base font-semibold capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </span>
                        <p className="text-gray-500 text-xs sm:text-sm mt-1">
                          {key === "videos" && "HD video lectures"}
                          {key === "liveLectures" && "Live interactive sessions"}
                          {key === "pdfs" && "Downloadable study materials"}
                          {key === "quizzes" && "Knowledge assessment tests"}
                          {key === "assignments" && "Practical exercises"}
                          {key === "certificates" && "Course completion certificate"}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate("/faculty-dashboard")}
                  className="flex-1 px-4 sm:px-6 py-3 sm:py-3.5 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition font-semibold text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 sm:px-6 py-3 sm:py-3.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  {saving ? (
                    <>
                      <i className="fas fa-spinner fa-spin text-sm sm:text-base"></i>
                      Creating Course...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-plus-circle text-sm sm:text-base"></i>
                      Create Course
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
