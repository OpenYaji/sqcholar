"use client"

import Pic from "/src/assets/about.png";

import { useState, useEffect } from "react"
import {
  LayoutDashboard,
  GraduationCap,
  Book,
  ClipboardCheck,
  Clock,
  Settings,
  MessageCircleQuestion,
  ChevronDown,
  Menu,
  X,
} from "lucide-react"

export default function Sidebar({ activeSection, setActiveSection, collapsed, visible, toggleSidebar }) {
  const [openDropdown, setOpenDropdown] = useState(null)
  const [isMobile, setIsMobile] = useState(false)

  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown)
  }

  const handleNavClick = (section) => {
    // Only change the active section without toggling the dropdown
    setActiveSection(section)
  }
  
  // Function to handle submenu item clicks
  const handleSubmenuClick = (section) => {
    setActiveSection(section)
    // Close the dropdown when clicking on a submenu item
    setOpenDropdown(null)
  }

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkMobile()

    // Add resize listener
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen bg-blue-900 dark:bg-gray-800 transition-all duration-300 
        ${isMobile ? "w-64" : collapsed ? "w-20" : "w-64"} 
        ${isMobile ? (visible ? "translate-x-0" : "-translate-x-full") : "translate-x-0"}`}
    >
      <div className="flex flex-col border-b border-blue-800 dark:border-gray-700">
        <div className={`flex items-center p-4 ${!isMobile && collapsed ? "justify-center" : "justify-between"}`}>
          <div className={`flex items-center ${!isMobile && collapsed ? "justify-center w-full" : ""}`}>
          <img src={Pic} alt="Logo" className="h-10 w-10 rounded-full object-cover" />
            <span className={`ml-3 text-white font-semibold ${!isMobile && collapsed ? "hidden" : "block"}`}>
              QC University <br></br>Student Portal
            </span>
          </div>
          {isMobile && (
            <button
              onClick={toggleSidebar}
              className="text-white hover:bg-blue-800 dark:hover:bg-gray-700 p-2 rounded-lg"
              aria-label="Close Sidebar"
            >
              <X size={20} />
              <span className="sr-only">Close Sidebar</span>
            </button>
          )}
          {!isMobile && !collapsed && (
            <button
              onClick={toggleSidebar}
              className="text-white hover:bg-blue-800 dark:hover:bg-gray-700 p-2 rounded-lg relative group"
              aria-label="Toggle Sidebar"
            >
              <Menu size={20} />
              <span className="sr-only">Toggle Sidebar</span>
              <div className="absolute bottom-[-25px] left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap shadow-md z-50">
                Collapse Menu
              </div>
            </button>
          )}
        </div>
        {!isMobile && collapsed && (
          <div className="relative">
            <button
              onClick={toggleSidebar}
              className="text-white hover:bg-blue-800 dark:hover:bg-gray-700 p-2 rounded-lg mx-auto mb-2 flex justify-center relative group"
              aria-label="Toggle Sidebar"
            >
              <Menu size={20} />
              <span className="sr-only">Toggle Sidebar</span>
              <div className="absolute bottom-[-25px] left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap shadow-md z-50">
                Expand Menu
              </div>
            </button>
          </div>
        )}
      </div>

      <nav className="mt-5 px-2">
        <ul className="space-y-2">
          {/* Dashboard */}
          <li className="relative group">
            <button
              onClick={() => handleNavClick("dashboard")}
              className={`flex items-center w-full p-2 text-white rounded-lg hover:bg-blue-800 dark:hover:bg-gray-700 ${
                activeSection === "dashboard" ? "bg-blue-800 dark:bg-gray-700" : ""
              } ${!isMobile && collapsed ? "justify-center" : ""}`}
            >
              <LayoutDashboard size={20} />
              {(isMobile || !collapsed) && <span className="ml-3">Dashboard</span>}
            </button>
            {!isMobile && collapsed && (
              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap shadow-md z-50">
                Dashboard
              </div>
            )}
          </li>

          {/* Grades Dropdown */}
          <li className="relative group">
            <div className="flex items-center justify-between w-full">
              <button
                onClick={() => handleNavClick("grades")}
                className={`flex items-center p-2 text-white rounded-lg hover:bg-blue-800 dark:hover:bg-gray-700 ${
                  activeSection === "grades" ? "bg-blue-800 dark:bg-gray-700" : ""
                } ${!isMobile && collapsed ? "justify-center w-full" : "w-[calc(100%-24px)]"}`}
              >
                <GraduationCap size={20} />
                {(isMobile || !collapsed) && <span className="ml-3">Grades</span>}
              </button>
              {(isMobile || !collapsed) && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown("grades");
                  }}
                  className="p-2 text-white rounded-lg hover:bg-blue-800 dark:hover:bg-gray-700"
                >
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${
                      openDropdown === "grades" ? "transform rotate-180" : ""
                    }`}
                  />
                </button>
              )}
            </div>
            {!isMobile && collapsed && (
              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap shadow-md z-50">
                Grades
              </div>
            )}

            {/* Dropdown Menu */}
            <ul
              className={`${
                !isMobile && collapsed
                  ? "absolute left-full top-0 ml-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
                  : "mt-2 ml-6 space-y-1"
              } ${openDropdown === "grades" ? "block" : "hidden"}`}
            >
              <li>
                <button
                  onClick={() => handleSubmenuClick("currentGrades")}
                  className={`flex items-center w-full p-2 ${!isMobile && collapsed ? "text-gray-800 dark:text-white" : "text-white"} rounded-lg hover:bg-blue-800 dark:hover:bg-gray-700 ${
                    activeSection === "currentGrades" ? "bg-blue-800 dark:bg-gray-700 text-white" : ""
                  }`}
                >
                  {!isMobile && collapsed && <GraduationCap size={20} />}
                  <span className={!isMobile && collapsed ? "ml-3" : ""}>Current Grades</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleSubmenuClick("pastGrades")}
                  className={`flex items-center w-full p-2 ${!isMobile && collapsed ? "text-gray-800 dark:text-white" : "text-white"} rounded-lg hover:bg-blue-800 dark:hover:bg-gray-700 ${
                    activeSection === "pastGrades" ? "bg-blue-800 dark:bg-gray-700 text-white" : ""
                  }`}
                >
                  {!isMobile && collapsed && <GraduationCap size={20} />}
                  <span className={!isMobile && collapsed ? "ml-3" : ""}>Past Grades</span>
                </button>
              </li>
            </ul>
          </li>

          {/* Curriculum */}
          <li className="relative group">
            <button
              onClick={() => handleNavClick("curriculum")}
              className={`flex items-center w-full p-2 text-white rounded-lg hover:bg-blue-800 dark:hover:bg-gray-700 ${
                activeSection === "curriculum" ? "bg-blue-800 dark:bg-gray-700" : ""
              } ${!isMobile && collapsed ? "justify-center" : ""}`}
            >
              <Book size={20} />
              {(isMobile || !collapsed) && <span className="ml-3">Curriculum</span>}
            </button>
            {!isMobile && collapsed && (
              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap shadow-md z-50">
                Curriculum
              </div>
            )}
          </li>

          {/* Clearance */}
          <li className="relative group">
            <button
              onClick={() => handleNavClick("clearance")}
              className={`flex items-center w-full p-2 text-white rounded-lg hover:bg-blue-800 dark:hover:bg-gray-700 ${
                activeSection === "clearance" ? "bg-blue-800 dark:bg-gray-700" : ""
              } ${!isMobile && collapsed ? "justify-center" : ""}`}
            >
              <ClipboardCheck size={20} />
              {(isMobile || !collapsed) && <span className="ml-3">Clearance</span>}
            </button>
            {!isMobile && collapsed && (
              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap shadow-md z-50">
                Clearance
              </div>
            )}
          </li>

          {/* Class Schedule */}
          <li className="relative group">
            <button
              onClick={() => handleNavClick("schedule")}
              className={`flex items-center w-full p-2 text-white rounded-lg hover:bg-blue-800 dark:hover:bg-gray-700 ${
                activeSection === "schedule" ? "bg-blue-800 dark:bg-gray-700" : ""
              } ${!isMobile && collapsed ? "justify-center" : ""}`}
            >
              <Clock size={20} />
              {(isMobile || !collapsed) && <span className="ml-3">Class Schedule</span>}
            </button>
            {!isMobile && collapsed && (
              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap shadow-md z-50">
                Class Schedule
              </div>
            )}
          </li>

          {/* Settings */}
          <li className="relative group">
            <button
              onClick={() => handleNavClick("settings")}
              className={`flex items-center w-full p-2 text-white rounded-lg hover:bg-blue-800 dark:hover:bg-gray-700 ${
                activeSection === "settings" ? "bg-blue-800 dark:bg-gray-700" : ""
              } ${!isMobile && collapsed ? "justify-center" : ""}`}
            >
              <Settings size={20} />
              {(isMobile || !collapsed) && <span className="ml-3">Settings</span>}
            </button>
            {!isMobile && collapsed && (
              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap shadow-md z-50">
                Settings
              </div>
            )}
          </li>
        </ul>

        {/* Secondary Nav */}
        <ul className="absolute bottom-5 w-full left-0 px-2">
          <li className="relative group">
            <button
              onClick={() => handleNavClick("support")}
              className={`flex items-center w-full p-2 text-white rounded-lg hover:bg-blue-800 dark:hover:bg-gray-700 ${
                activeSection === "support" ? "bg-blue-800 dark:bg-gray-700" : ""
              } ${!isMobile && collapsed ? "justify-center" : ""}`}
            >
              <MessageCircleQuestion size={20} />
              {(isMobile || !collapsed) && <span className="ml-3">Support</span>}
            </button>
            {!isMobile && collapsed && (
              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap shadow-md z-50">
                Support
              </div>
            )}
          </li>
        </ul>
      </nav>
    </aside>
  )
}