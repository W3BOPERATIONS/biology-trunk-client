"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { API_URL } from "../utils/api.js"
import { showErrorToast, showSuccessToast } from "../utils/toast.js"
import logo from "../assets/biology-trunk-logo.png"

export default function FacultyAddCourse({ user, onLogout }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Class 10",
    price: 0,
    duration: "8 weeks",
    courseLevel: "Intermediate",
    prerequisites: "",
    whatYouWillLearn: [""],
    curriculum: [{ module: "", topics: [""] }],
    courseIncludes: {
      videos: true,
      liveLectures: true,
      pdfs: true,
      quizzes: false,
      assignments: false,
      certificates: true,
    },
  })

  const categories = ["Class 9", "Class 10", "Class 11", "Class 12", "JEE", "GUJCET", "NEET"]
  const levels = ["Beginner", "Intermediate", "Advanced"]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleArrayItemChange = (field, index, value) => {
    setFormData((prev) => {
      const newArray = [...prev[field]]
      newArray[index] = value
      return { ...prev, [field]: newArray }
    })
  }

  const addArrayItem = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], field === "whatYouWillLearn" ? "" : { module: "", topics: [""] }],
    }))
  }

  const removeArrayItem = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }))
  }

  const handleCurriculumChange = (moduleIndex, field, value) => {
    setFormData((prev) => {
      const newCurriculum = [...prev.curriculum]
      if (field === "module") {
        newCurriculum[moduleIndex].module = value
      }
      return { ...prev, curriculum: newCurriculum }
    })
  }

  const handleTopicChange = (moduleIndex, topicIndex, value) => {
    setFormData((prev) => {
      const newCurriculum = [...prev.curriculum]
      newCurriculum[moduleIndex].topics[topicIndex] = value
      return { ...prev, curriculum: newCurriculum }
    })
  }

  const addTopic = (moduleIndex) => {
    setFormData((prev) => {
      const newCurriculum = [...prev.curriculum]
      newCurriculum[moduleIndex].topics.push("")
      return { ...prev, curriculum: newCurriculum }
    })
  }

  const addCurriculumModule = () => {
    setFormData((prev) => ({
      ...prev,
      curriculum: [...prev.curriculum, { module: "", topics: [""] }],
    }))
  }

  const toggleInclude = (key) => {
    setFormData((prev) => ({
      ...prev,
      courseIncludes: {
        ...prev.courseIncludes,
        [key]: !prev.courseIncludes[key],
      },
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const courseData = {
        ...formData,
        faculty: user._id,
      }

      const response = await axios.post(`${API_URL}/courses`, courseData)
      showSuccessToast("Course created successfully!")
      navigate("/faculty-dashboard")
    } catch (error) {
      console.error("Failed to create course:", error)
      showErrorToast(error.response?.data?.message || "Failed to create course")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center overflow-hidden">
                <img
                  src={logo || "/placeholder.svg"}
                  alt="Biology.Trunk Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-gray-900 font-bold text-lg sm:text-xl">Biology.Trunk</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={onLogout}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold text-sm sm:text-base"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
        >
          <i className="fas fa-arrow-left"></i>
          Back to Dashboard
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Course</h1>
          <p className="text-gray-600 mb-8">Add a new course with complete description and structure</p>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Basic Information</h2>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Course Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="e.g., Class 10 Biology"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Course description..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Duration</label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="e.g., 8 weeks"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Level</label>
                  <select
                    name="courseLevel"
                    value={formData.courseLevel}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    {levels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Prerequisites</label>
                <textarea
                  name="prerequisites"
                  value={formData.prerequisites}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="What students should know before taking this course"
                />
              </div>
            </div>

            {/* What You Will Learn */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">What You Will Learn</h2>
                <button
                  type="button"
                  onClick={() => addArrayItem("whatYouWillLearn")}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  <i className="fas fa-plus mr-2"></i>Add Item
                </button>
              </div>

              {formData.whatYouWillLearn.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleArrayItemChange("whatYouWillLearn", index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Learning outcome..."
                  />
                  {formData.whatYouWillLearn.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem("whatYouWillLearn", index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Curriculum */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Curriculum</h2>
                <button
                  type="button"
                  onClick={addCurriculumModule}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  <i className="fas fa-plus mr-2"></i>Add Module
                </button>
              </div>

              {formData.curriculum.map((module, moduleIndex) => (
                <div key={moduleIndex} className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <input
                    type="text"
                    value={module.module}
                    onChange={(e) => handleCurriculumChange(moduleIndex, "module", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Module name..."
                  />

                  <div className="space-y-2">
                    {module.topics.map((topic, topicIndex) => (
                      <div key={topicIndex} className="flex gap-2">
                        <input
                          type="text"
                          value={topic}
                          onChange={(e) => handleTopicChange(moduleIndex, topicIndex, e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                          placeholder="Topic..."
                        />
                        {module.topics.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              setFormData((prev) => {
                                const newCurriculum = [...prev.curriculum]
                                newCurriculum[moduleIndex].topics = newCurriculum[moduleIndex].topics.filter(
                                  (_, i) => i !== topicIndex,
                                )
                                return { ...prev, curriculum: newCurriculum }
                              })
                            }}
                            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => addTopic(moduleIndex)}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    <i className="fas fa-plus mr-1"></i>Add Topic
                  </button>
                </div>
              ))}
            </div>

            {/* Course Includes */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">What's Included</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(formData.courseIncludes).map(([key, value]) => (
                  <label
                    key={key}
                    className="flex items-center gap-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-blue-50"
                  >
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={() => toggleInclude(key)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-gray-700 font-medium capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Course"}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
