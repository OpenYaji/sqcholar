"use client"

import { useState } from "react"
import { Facebook, Instagram, Twitter,BadgeHelp, Music } from "lucide-react";
import Logo from "/src/assets/about.png"
import BG from"/src/assets/qcu.mp4"
import song from "/src/assets/hymn.mp3"


const LoginPage = ({ onLogin, darkMode }) => {
  const [studentId, setStudentId] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  // ID format validation (00-0000)
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
        // Store authentication info in localStorage
        localStorage.setItem("qcu_authenticated", "true")
        localStorage.setItem("qcu_student_id", studentId)
        localStorage.setItem("qcu_user_data", JSON.stringify(data.userData))

        // Either call the onLogin prop if it exists, or redirect directly
        if (onLogin) {
          onLogin(data.userData)
        } else {
          window.location.href = "/dashboard"
        }
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

  return (
    <div className="flex min-h-screen relative overflow-hidden">
    {/* Video Background */}
    <div className="absolute inset-0 w-full h-full z-0">
      <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
        <source src={BG} type="video/mp4" />
      </video>
      <audio autoPlay loop>
    <source src={song}type="audio/mp3" />
    Your browser does not support the audio element.
  </audio>
      {/* Blue overlay/mask on top of video */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/80 to-blue-700/80 z-10"></div>
    </div>
    {/* Content container with z-index to appear above the video */}
    <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto relative z-20">
{/* Left side with logo and university info */}
<div className="flex-1 p-8 flex flex-col items-center justify-center text-white text-center md:text-left animate-fadeIn">
  <div className="mb-8 animate-float">
    {/* Logo Container with transparent background */}
    <div className="h-72 w-72 bg-transparent flex items-center justify-center rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300">
      <img src={Logo || "/placeholder.svg"} alt="QCU Logo" className="w-72 h-72 object-contain" />
    </div>
  </div>
  <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">Quezon City University</h1>
  <h2 className="text-xl md:text-2xl mb-6 text-white">Student Portal</h2>
  <p className="text-blue-200 max-w-md mb-8">
    Access your academic information, class schedules, grades, and more through the official QCU student portal. #1 Local university
  </p>

        {/* Social Media Icons */}
        <div className="flex space-x-6 mt-2">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-500 transition duration-300">
            <Facebook className="w-10 h-10" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-pink-500 transition duration-300">
            <Instagram className="w-10 h-10" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-sky-400 transition duration-300">
            <Twitter className="w-10 h-10" />
          </a>
        </div>
      </div>

        {/* Right side with login form */}
        <div className="flex-1 p-4 md:p-8">
          <div className="max-w-md mx-auto bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-6 md:p-8 border border-white/60">
            <div className="flex justify-center mb-8">
              <div className="h-24 w-24 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300">
                <img src={Logo || "/placeholder.svg"} alt="QCU Logo" className="w-16 h-16" />
              </div>
            </div>

            <h2 className="text-xl font-bold text-center text-gray-900 mb-6">
              {showReset ? "Reset Password" : "Student Login"}
            </h2>

            {error && !showReset && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg relative mb-6 shadow-sm" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            {showReset ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setResetMessage("Reset link sent to your email.");
                }}
              >
                <div className="mb-5">
                  <label htmlFor="resetEmail" className="block text-sm font-medium text-gray-800 mb-2">
                    Enter your email to reset password
                  </label>
                  <input
                    type="email"
                    id="resetEmail"
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                  />
                </div>

                {resetMessage && (
                  <div className="bg-green-100 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded-lg relative mb-6 shadow-sm">
                    <span>{resetMessage}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-600 hover:to-blue-800 text-white font-bold py-3 px-4 rounded-xl transition duration-300"
                >
                  Send Reset Link
                </button>

                <div className="mt-4 text-center">
                  <button
                    type="button"
                    className="text-sm text-blue-700 hover:text-blue-900"
                    onClick={() => setShowReset(false)}
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-5">
                  <label htmlFor="studentId" className="block text-sm font-medium text-gray-800 mb-2">
                    Student ID
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="studentId"
                      placeholder="Enter 6-digit Student ID"
                      className="w-full pl-10 pr-3 py-3 bg-white/80 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-800 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-10 py-3 bg-white/80 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-600 hover:to-blue-800 text-white font-bold py-3 px-4 rounded-xl transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-md flex justify-center items-center relative overflow-hidden group"
                >
                  <span className="absolute top-0 left-0 w-full h-full bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                  <div className="relative flex items-center justify-center">
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-t-transparent border-white"></div>
                    ) : (
                      <>
                        <span>Sign In</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </>
                    )}
                  </div>
                </button>

                <div className="mt-6 text-center">
                  <button
                    type="button"
                    className="text-sm text-blue-700 hover:text-blue-900 transition-colors duration-200 group inline-flex items-center font-medium"
                    onClick={() => setShowReset(true)}
                  >
                    <span>Forgot Password?</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </form>
            )}
          </div>
          <div className="mt-6 text-center text-white font-medium text-sm">
            <p>&copy; 1994-2025 Quezon City University. All rights reserved.</p>
          </div>
        </div>
{/* Chat Support sa leftside corner */}
          <div className="relative">
            <div className="fixed bottom-8 left-8 group">
              <div className="flex items-center justify-center bg-blue-700 text-white h-12 w-12 rounded-full shadow-lg cursor-pointer hover:bg-blue-800 transition duration-300">
                <BadgeHelp className="w-8 h-8" />
              </div>

              <span className="absolute bottom-13 left-1/2 -translate-x-1/2 bg-blue-700 text-white text-xs rounded-md py-1 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                Help & FAQ
              </span>
            </div>
          </div>
      </div>
    </div>
  )
}

export default LoginPage
