"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { API_URL } from "../utils/api.js"
import { showSuccessToast, showErrorToast } from "../utils/toast.js"
import logo from "../assets/biology-trunk-logo.png"

export default function FacultyCourseEdit({ user, onLogout }) {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [course, setCourse] = useState(null)
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
  })

  useEffect(() => {
    fetchCourse()
  }, [courseId])

  const fetchCourse = async () => {
    try {
      const response = await axios.get(`${API_URL}/courses/${courseId}`)
      if (response.data.faculty._id !== user._id) {
        showErrorToast("You can only edit your own courses")
        navigate("/faculty-dashboard")
        return
      }
      setCourse(response.data)
      setFormData({
        title: response.data.title,
        description: response.data.description,
        duration: response.data.duration,
        courseLevel: response.data.courseLevel,
        prerequisites: response.data.prerequisites,
        curriculum: response.data.curriculum || [],
        whatYouWillLearn: response.data.whatYouWillLearn || [],
        courseIncludes: response.data.courseIncludes || {
          videos: false,
          liveLectures: false,
          pdfs: false,
          quizzes: false,
          assignments: false,
          certificates: false,
        },
      })
      setLoading(false)
    } catch (error) {
      console.error("Failed to fetch course:", error)
      showErrorToast("Failed to load course")
      navigate("/faculty-dashboard")
    }
  }

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

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await axios.put(`${API_URL}/courses/${courseId}`, {
        ...formData,
        facultyId: user._id,
      })
      showSuccessToast("Course updated successfully!")
      navigate("/faculty-dashboard")
    } catch (error) {
      console.error("Failed to update course:", error)
      showErrorToast(error.response?.data?.message || "Failed to update course")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
          <p className="text-gray-600 text-lg">Loading course...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <button
          onClick={() => navigate("/faculty-dashboard")}
          className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
        >
          <i className="fas fa-arrow-left"></i>
          Back to Dashboard
        </button>

        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Course: {course?.title}</h1>

          <form onSubmit={handleSave} className="space-y-8">
            {/* Basic Info */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Course Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    required
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                    <input
                      type="text"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      placeholder="e.g., 12 weeks"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Course Level</label>
                    <select
                      name="courseLevel"
                      value={formData.courseLevel}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Level</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prerequisites</label>
                  <textarea
                    name="prerequisites"
                    value={formData.prerequisites}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="List any prerequisites for this course"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* What You Will Learn */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">What Students Will Learn</h2>
              <div className="space-y-2">
                {formData.whatYouWillLearn.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleArrayInputChange("whatYouWillLearn", index, e.target.value)}
                      placeholder="Enter learning outcome"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveArrayItem("whatYouWillLearn", index)}
                      className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleAddArrayItem("whatYouWillLearn")}
                  className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition font-semibold"
                >
                  <i className="fas fa-plus"></i> Add Learning Outcome
                </button>
              </div>
            </div>

            {/* Curriculum */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Course Curriculum</h2>
              <div className="space-y-4">
                {formData.curriculum.map((module, moduleIndex) => (
                  <div key={moduleIndex} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-center mb-3">
                      <input
                        type="text"
                        value={module.module}
                        onChange={(e) => handleModuleChange(moduleIndex, "module", e.target.value)}
                        placeholder="Module name"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveModule(moduleIndex)}
                        className="ml-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>

                    <div className="space-y-2 ml-4">
                      {module.topics.map((topic, topicIndex) => (
                        <div key={topicIndex} className="flex gap-2">
                          <input
                            type="text"
                            value={topic}
                            onChange={(e) => handleTopicChange(moduleIndex, topicIndex, e.target.value)}
                            placeholder="Topic title"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveTopic(moduleIndex, topicIndex)}
                            className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => handleAddTopic(moduleIndex)}
                        className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition text-sm font-semibold"
                      >
                        <i className="fas fa-plus"></i> Add Topic
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddModule}
                  className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition font-semibold"
                >
                  <i className="fas fa-plus"></i> Add Module
                </button>
              </div>
            </div>

            {/* Course Includes */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">What's Included in This Course</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.keys(formData.courseIncludes).map((key) => (
                  <label
                    key={key}
                    className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={formData.courseIncludes[key]}
                      onChange={() => handleIncludesChange(key)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-700 capitalize font-medium">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate("/faculty-dashboard")}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save"></i>
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
