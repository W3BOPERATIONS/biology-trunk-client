"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { showSuccessToast, showErrorToast } from "../utils/toast.js"
import { API_URL } from "../utils/api.js"

export default function RazorpayPayment({ course, student, onPaymentSuccess, onPaymentCancel }) {
  const [loading, setLoading] = useState(false)
  const [scriptLoaded, setScriptLoaded] = useState(false)

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

  const handlePayment = async () => {
    try {
      if (!scriptLoaded || !window.Razorpay) {
        showErrorToast("Payment system not ready. Please refresh and try again.")
        return
      }

      setLoading(true)

      // Create order on backend
      const orderResponse = await axios.post(`${API_URL}/payments/create-order`, {
        courseId: course._id,
        studentId: student._id,
      })

      if (!orderResponse.data.success) {
        showErrorToast(orderResponse.data.error || "Failed to create payment order")
        setLoading(false)
        return
      }

      const { orderId, courseName, coursePrice } = orderResponse.data

      // Razorpay payment options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: coursePrice * 100, // Amount in paise
        currency: "INR",
        name: "Biology.Trunk",
        description: `Enrollment for ${courseName}`,
        order_id: orderId,
        handler: async (response) => {
          try {
            // Verify payment signature on backend
            const verifyResponse = await axios.post(`${API_URL}/payments/verify-payment`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              courseId: course._id,
              studentId: student._id,
            })

            if (verifyResponse.data.success) {
              showSuccessToast(`🎉 Enrolled successfully! Confirmation email sent to ${student.email}`)
              if (onPaymentSuccess) {
                onPaymentSuccess(verifyResponse.data)
              }
            } else {
              showErrorToast("Payment verification failed. Please contact support.")
            }
          } catch (error) {
            console.error("[v0] Verification error:", error)
            showErrorToast(error.response?.data?.error || "Payment verification failed")
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
            setLoading(false)
            if (onPaymentCancel) {
              onPaymentCancel()
            }
          },
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (error) {
      console.error("[v0] Payment error:", error)
      showErrorToast(error.response?.data?.error || "Payment failed. Please try again.")
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handlePayment}
      disabled={loading || !scriptLoaded}
      className="w-full py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-bold shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base"
    >
      {loading ? (
        <>
          <i className="fas fa-spinner fa-spin text-xs sm:text-sm"></i>
          <span>Processing...</span>
        </>
      ) : !scriptLoaded ? (
        <>
          <i className="fas fa-hourglass-half text-xs sm:text-sm"></i>
          <span>Loading...</span>
        </>
      ) : (
        <>
          <i className="fas fa-shopping-cart text-xs sm:text-sm"></i>
          <span>Pay ₹{course.price} - Enroll Now</span>
        </>
      )}
    </button>
  )
}
