"use client"

import { useState, useEffect } from "react"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import Dashboard from "@/components/dashboard"
import Grades from "@/components/grades"
import CurrentGrades from "@/components/current-grades"
import PastGrades from "@/components/past-grades"
import Curriculum from "@/components/curriculum"
import Clearance from "@/components/clearance"
import ClassSchedule from "@/components/class-schedule"
import Settings from "@/components/settings"
import Support from "@/components/support"
import LoginPage from "@/components/login"
import MyAccount from "@/components/MyAccount"

export default function App() {
  const [activeSection, setActiveSection] = useState("dashboard")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)
  const [sidebarVisible, setSidebarVisible] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  useEffect(() => {
    const checkAuth = () => {
      const authStatus = localStorage.getItem("qcu_authenticated")
      if (authStatus === "true") {
        setIsAuthenticated(true)
      }
      setIsLoading(false)
    }

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkAuth()
    checkMobile()

    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const toggleMobileSidebar = () => {
    setSidebarVisible(!sidebarVisible)
  }

  const toggleSidebar = () => {
    if (isMobile) {
      toggleMobileSidebar()
    } else {
      setSidebarCollapsed(!sidebarCollapsed)
    }
  }

  const handleSectionChange = (section) => {
    setActiveSection(section)
    if (isMobile) {
      setSidebarVisible(false)
    } else {
      setSidebarCollapsed(true)
    }
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("qcu_authenticated")
    localStorage.removeItem("qcu_student_id")
    setActiveSection("dashboard")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-blue-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-white"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} darkMode={darkMode} />
  }

  return (
    <div
      className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}
    >
      <Header 
        toggleDarkMode={toggleDarkMode} 
        darkMode={darkMode} 
        toggleSidebar={toggleSidebar} 
        onLogout={handleLogout}
        onAccountClick={handleSectionChange} 
      />
      <Sidebar
        activeSection={activeSection}
        setActiveSection={handleSectionChange}
        collapsed={sidebarCollapsed}
        visible={sidebarVisible}
        toggleSidebar={toggleSidebar}
      />
        <main
          className={`transition-all duration-300 ${isMobile ? "" : sidebarCollapsed ? "ml-20" : "ml-64"} pt-20 px-4 md:px-8 pb-8`}
        >
          {activeSection === "dashboard" && <Dashboard />}
          {activeSection === "grades" && <Grades setActiveSection={handleSectionChange} />}
          {activeSection === "currentGrades" && <CurrentGrades />}
          {activeSection === "pastGrades" && <PastGrades />}
          {activeSection === "curriculum" && <Curriculum />}
          {activeSection === "clearance" && <Clearance />}
          {activeSection === "schedule" && <ClassSchedule />}
          {activeSection === "settings" && <Settings />}
          {activeSection === "support" && <Support />}
          {activeSection === "myAccount" && <MyAccount />}
        </main>
    </div>
  )
}