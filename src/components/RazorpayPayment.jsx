"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { showSuccessToast, showErrorToast } from "../utils/toast.js"
import { API_URL } from "../utils/api.js"

export default function RazorpayPayment({ course, student, onPaymentSuccess, onPaymentCancel }) {
  const [loading, setLoading] = useState(false)
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [dataReady, setDataReady] = useState(false)

  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        if (window.Razorpay) {
          setScriptLoaded(true)
          resolve(true)
          return
        }

        const script = document.createElement("script")
        script.src = "https://checkout.razorpay.com/v1/checkout.js"
        script.onload = () => {
          setScriptLoaded(true)
          resolve(true)
        }
        script.onerror = () => {
          console.error("[v0] Failed to load Razorpay script")
          resolve(false)
        }
        document.body.appendChild(script)
      })
    }

    loadRazorpayScript()
  }, [])

  useEffect(() => {
    console.log("[DEBUG] Course data:", { 
      course, 
      hasCourse: !!course,
      hasCourseId: course?._id,
      courseId: course?._id 
    })
    console.log("[DEBUG] Student data:", { 
      student, 
      hasStudent: !!student,
      hasStudentId: student?._id,
      studentId: student?._id 
    })
    
    const ready = course?._id && student?._id
    setDataReady(ready)
    
    if (!ready) {
      console.warn("[DEBUG] Data not ready. Course ID:", course?._id, "Student ID:", student?._id)
    }
  }, [course, student])

  const handlePayment = async () => {
    try {
      console.log("[DEBUG] Starting payment process...")
      console.log("[DEBUG] Script loaded:", scriptLoaded)
      console.log("[DEBUG] Window.Razorpay:", !!window.Razorpay)
      console.log("[DEBUG] Data ready:", dataReady)
      console.log("[DEBUG] Course ID:", course?._id)
      console.log("[DEBUG] Student ID:", student?._id)

      if (!scriptLoaded || !window.Razorpay) {
        showErrorToast("Payment system not ready. Please refresh and try again.")
        return
      }

      if (!course?._id || !student?._id) {
        showErrorToast("Invalid course or student information. Please refresh and try again.")
        return
      }

      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID
      console.log("[DEBUG] Razorpay Key from env:", razorpayKey)
      
      if (!razorpayKey) {
        console.error("[v0] VITE_RAZORPAY_KEY_ID environment variable not set")
        showErrorToast("Payment system configuration error. Please contact support. (Missing frontend Razorpay key)")
        return
      }

      setLoading(true)

      // Create order on backend
      console.log("[DEBUG] Creating order for course:", course._id, "student:", student._id)
      const orderResponse = await axios.post(`${API_URL}/payments/create-order`, {
        courseId: course._id,
        studentId: student._id,
      })

      console.log("[DEBUG] Order response:", orderResponse.data)

      if (!orderResponse.data.success) {
        console.error("[v0] Order creation failed:", orderResponse.data)
        showErrorToast(orderResponse.data.error || "Failed to create payment order")
        setLoading(false)
        return
      }

      const { orderId, courseName, coursePrice } = orderResponse.data
      console.log("[DEBUG] Order created:", { orderId, courseName, coursePrice })

      // Razorpay payment options
      const options = {
        key: razorpayKey,
        amount: coursePrice * 100, // Amount in paise
        currency: "INR",
        name: "Biology.Trunk",
        description: `Enrollment for ${courseName}`,
        order_id: orderId,
        handler: async (response) => {
          try {
            console.log("[DEBUG] Payment handler called with response:", response)

            // Verify payment signature on backend
            const verifyResponse = await axios.post(`${API_URL}/payments/verify-payment`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              courseId: course._id,
              studentId: student._id,
            })

            console.log("[DEBUG] Verification response:", verifyResponse.data)

            if (verifyResponse.data.success) {
              showSuccessToast(`🎉 Enrolled successfully! Confirmation email sent to ${student.email}`)
              if (onPaymentSuccess) {
                onPaymentSuccess(verifyResponse.data)
              }
            } else {
              console.error("[v0] Verification failed:", verifyResponse.data)
              showErrorToast(verifyResponse.data.error || "Payment verification failed. Please contact support.")
            }
          } catch (error) {
            console.error("[DEBUG] Verification error:", {
              message: error.message,
              status: error.response?.status,
              data: error.response?.data,
            })
            const errorMsg = error.response?.data?.error || "Payment verification failed"
            const suggestion = error.response?.data?.suggestion || ""
            showErrorToast(suggestion ? `${errorMsg}\n\n${suggestion}` : errorMsg)
          } finally {
            setLoading(false)
          }
        },
        prefill: {
          name: student.name || "",
          email: student.email || "",
          contact: student.phone || "",
        },
        theme: {
          color: "#2563EB",
        },
        modal: {
          ondismiss: () => {
            console.log("[DEBUG] Payment modal dismissed")
            setLoading(false)
            if (onPaymentCancel) {
              onPaymentCancel()
            }
          },
        },
      }

      console.log("[DEBUG] Razorpay options:", { ...options, key: `${options.key.substring(0, 10)}...` })
      
      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (error) {
      console.error("[DEBUG] Payment error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        stack: error.stack,
      })
      const errorMsg = error.response?.data?.error || "Payment failed. Please try again."
      const suggestion = error.response?.data?.suggestion || ""
      showErrorToast(suggestion ? `${errorMsg}\n\n${suggestion}` : errorMsg)
      setLoading(false)
    }
  }

  // Show disabled button if data not ready
  if (!dataReady) {
    console.warn("[RazorpayPayment] Missing required data:", {
      hasCourse: !!course,
      hasStudent: !!student,
      courseId: course?._id,
      studentId: student?._id
    })
    
    return (
      <button disabled className="w-full py-3 bg-gray-400 text-white rounded-lg cursor-not-allowed font-bold shadow-md">
        <span>Loading payment details...</span>
      </button>
    )
  }

  return (
    <button
      onClick={handlePayment}
      disabled={loading || !scriptLoaded || !dataReady}
      className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-bold shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400 flex items-center justify-center gap-2"
    >
      {loading ? (
        <>
          <i className="fas fa-spinner fa-spin"></i>
          <span>Processing...</span>
        </>
      ) : !scriptLoaded ? (
        <>
          <i className="fas fa-hourglass-half"></i>
          <span>Loading payment...</span>
        </>
      ) : !dataReady ? (
        <>
          <i className="fas fa-exclamation-triangle"></i>
          <span>Payment details loading...</span>
        </>
      ) : (
        <>
          <i className="fas fa-shopping-cart"></i>
          <span>Pay ₹{course.price} - Enroll Now</span>
        </>
      )}
    </button>
  )
}