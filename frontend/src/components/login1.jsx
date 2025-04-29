"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import Logo from "/src/assets/about.png"
import BG from "/src/assets/qcu.mp4"
import FaceVerification from "./FaceVerification" // Import the new component

const LoginPage = ({ onLogin, darkMode }) => {
  const [studentId, setStudentId] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showFaceVerification, setShowFaceVerification] = useState(false)
  const [userData, setUserData] = useState(null)

  // ID format validation (6 digits)
  const validateStudentId = (id) => {
    const pattern = /^\d{6}$/;
    return pattern.test(id);
  }

  // Password validation (at least 7 letters and 1 number)
  const validatePassword = (pass) => {
    const letterPattern = /[a-zA-Z]/g
    const numberPattern = /[0-9]/g
    const letterMatches = pass.match(letterPattern) || []
    const numberMatches = pass.match(numberPattern) || []

    return letterMatches.length >= 7 && numberMatches.length >= 1
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    // Validate student ID format
    if (!validateStudentId(studentId)) {
      setError("Invalid Student ID. It should be a 6-digit number like 230001.");
      return;
    }
    
    // Validate password format
    if (!validatePassword(password)) {
      setError("Wrong Password")
      return
    }

    setLoading(true)

    try {
      // Make API call to your server.js backend
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId,
          password,
        }),
      })
      
      const data = await response.json()

      if (response.ok) {
        // Store temporarily but don't complete login yet
        setUserData(data.userData)
        setLoading(false)
        // Show face verification step
        setShowFaceVerification(true)
      } else {
        // Handle error from server
        setError(data.message || "Authentication failed. Please try again.")
        setLoading(false)
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("Connection error. Please try again later.")
      setLoading(false)
    }
  }
  
  // Handle successful face verification
  const handleVerificationSuccess = () => {
    // Store authentication info in localStorage
    localStorage.setItem("qcu_authenticated", "true")
    localStorage.setItem("qcu_student_id", studentId)
    localStorage.setItem("qcu_user_data", JSON.stringify(userData))

    // Either call the onLogin prop if it exists, or redirect directly
    if (onLogin) {
      onLogin(userData)
    } else {
      window.location.href = "/dashboard"
    }
  }
  
  // Handle cancellation of face verification
  const handleVerificationCancel = () => {
    setShowFaceVerification(false)
    setUserData(null)
  }

  return (
    <div className="flex min-h-screen relative overflow-hidden">
    {/* Video Background */}
    <div className="absolute inset-0 w-full h-full z-0">
      <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
        <source src={BG} type="video/mp4" />
      </video>
      {/* Blue overlay/mask on top of video */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/80 to-blue-700/80 z-10"></div>
    </div>
    {/* Content container with z-index to appear above the video */}
    <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto relative z-20">
        {/* Left side with logo and university info */}
        <div className="flex-1 p-8 flex flex-col items-center justify-center text-white text-center md:text-left animate-fadeIn">
          <div className="mb-8 animate-float">
            <img src={Logo || "/placeholder.svg"} alt="QCU Logo" className="w-32 h-32 mx-auto md:mx-0" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Quezon City University</h1>
          <h2 className="text-xl md:text-2xl mb-6">Student Portal</h2>
          <p className="text-blue-200 max-w-md">
            Access your academic information, class schedules, grades, and more through the official QCU student portal.
          </p>
        </div>

        {/* Right side with login form or face verification */}
        <div className="flex-1 p-4 md:p-8">
          {showFaceVerification ? (
            <FaceVerification 
              studentId={studentId} 
              onSuccess={handleVerificationSuccess} 
              onCancel={handleVerificationCancel}
            />
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8 animate-slideInDown">
              <div className="flex justify-center mb-6">
                <img src={Logo || "/placeholder.svg"} alt="QCU Logo" className="w-24 h-24" />
              </div>
              <h2 className="text-xl font-bold text-center text-gray-800 dark:text-white mb-6">Student Login</h2>

              {error && (
                <div
                  className="bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded relative mb-6"
                  role="alert"
                >
                  <span className="block sm:inline">{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Student ID
                  </label>
                  <input
                  type="text"
                  id="studentId"
                  placeholder="Enter 6-digit Student ID"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  required
                />

                </div>

                <div className="mb-6">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      placeholder="Enter your password"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex justify-center"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <a
                  href="#"
                  className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Forgot Password?
                </a>
              </div>
            </div>
          )}

          <div className="mt-6 text-center text-white text-sm">
            <p>&copy; 1994-2025 Quezon City University. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage