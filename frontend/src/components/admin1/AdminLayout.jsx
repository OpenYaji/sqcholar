"use client"

import { useState, useEffect } from "react"
import {
  LayoutDashboard, Users, BookOpen, Bell, Settings, LogOut,
  Menu, X, ChevronDown, ChevronRight, Moon, Sun, BarChart2, Plus, Edit, Trash
} from "lucide-react"
import AdminLogo from "/src/assets/about.png" // Assuming you want to use the same logo
import { useRouter } from 'next/navigation';

const AdminLayout = ({ children, darkMode, toggleDarkMode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("dashboard")
  const [adminName, setAdminName] = useState("")
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const router = useRouter();

  useEffect(() => {
    // Get admin data from localStorage
    const adminData = JSON.parse(localStorage.getItem("qcu_admin_data"))
    if (adminData?.full_name) {
      setAdminName(adminData.full_name)
    }

    // Check if there's a stored active section
    const storedSection = localStorage.getItem("qcu_admin_section")
    if (storedSection) {
      setActiveSection(storedSection)
    }

    // Handle resize events for mobile responsiveness
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true)
      } else {
        setSidebarOpen(false)
      }
    }

    // Set initial state based on window size
    handleResize()

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Save active section to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("qcu_admin_section", activeSection)
  }, [activeSection])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleLogout = () => {
    localStorage.removeItem("qcu_admin_authenticated")
    localStorage.removeItem("qcu_admin_token")
    localStorage.removeItem("qcu_admin_data")
    router.push("/admin");
  }

  const handleSectionChange = (section) => {
    setActiveSection(section)
    if (window.innerWidth < 768) {
      setSidebarOpen(false)
    }
    router.push(`/admin/dashboard?section=${section}`);
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm fixed top-0 left-0 right-0 h-16 z-20 flex items-center justify-between px-4 transition-colors duration-300">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 md:hidden transition-colors"
          >
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          <div className="flex items-center ml-2 md:ml-0">
            <img src={AdminLogo} alt="QCU Logo" className="h-8 w-8" />
            <span className="ml-2 font-bold text-gray-900 dark:text-white">QCU Admin</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white focus:outline-none"
            >
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-medium">
                {adminName.charAt(0)}
              </div>
              <span className="hidden md:block">{adminName}</span>
              <ChevronDown className="h-4 w-4" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-30 border border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-10 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 pt-16 transition-colors`}
      >
        <nav className="mt-6 px-4">
          <div className="space-y-1">
            <button
              onClick={() => handleSectionChange("dashboard")}
              className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeSection === "dashboard"
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              <LayoutDashboard className="h-5 w-5 mr-3" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => handleSectionChange("students")}
              className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeSection === "students"
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              <Users className="h-5 w-5 mr-3" />
              <span>Students</span>
            </button>

            <button
              onClick={() => handleSectionChange("courses")}
              className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeSection === "courses"
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              <BookOpen className="h-5 w-5 mr-3" />
              <span>Courses & Grades</span>
            </button>

            <button
              onClick={() => handleSectionChange("notifications")}
              className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeSection === "notifications"
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              <Bell className="h-5 w-5 mr-3" />
              <span>Notifications</span>
            </button>

            <button
              onClick={() => handleSectionChange("reports")}
              className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeSection === "reports"
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              <BarChart2 className="h-5 w-5 mr-3" />
              <span>Reports</span>
            </button>

            <button
              onClick={() => handleSectionChange("settings")}
              className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeSection === "settings"
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              <Settings className="h-5 w-5 mr-3" />
              <span>Settings</span>
            </button>
          </div>
        </nav>

        <div className="absolute bottom-0 w-full p-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-xs text-blue-800 dark:text-blue-200">
            <p className="font-medium">Admin Portal v1.0</p>
            <p className="mt-1 opacity-75">
              {new Date().toLocaleDateString()} - {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`pt-16 md:pl-64 transition-padding duration-300 ${sidebarOpen && 'md:pl-64'}`}>
        <main className="p-4 md:p-6">
          {/* Conditionally render components based on activeSection */}
          {activeSection === "dashboard" && <div><h2>Dashboard Content</h2><p>Overview of system statistics and recent activity.</p></div>}
          {activeSection === "students" && <StudentManagement />}
          {activeSection === "courses" && <CourseAndGradeManagement />}
          {activeSection === "notifications" && <NotificationManagement />}
          {activeSection === "reports" && <div><h2>Reports Content</h2><p>Generate and view system reports.</p></div>}
          {activeSection === "settings" && <div><h2>Settings Content</h2><p>Configure admin panel settings.</p></div>}
          {children} {/* For any nested routes/content */}
        </main>
      </div>
    </div>
  )
}

// Student Management Component
const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newStudent, setNewStudent] = useState({
    student_id: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    program: '',
    year_level: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem("qcu_admin_token");
    try {
      const response = await fetch("http://localhost:5000/admin/students", {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setStudents(data);
    } catch (err) {
      console.error("Error fetching students:", err);
      setError('Failed to fetch students.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setNewStudent({ ...newStudent, [e.target.name]: e.target.value });
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const token = localStorage.getItem("qcu_admin_token");
    try {
      const response = await fetch("http://localhost:5000/admin/students", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newStudent),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      fetchStudents();
      setIsAdding(false);
      setNewStudent({
        student_id: '',
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address: '',
        password: '',
        program: '',
        year_level: ''
      });
    } catch (err) {
      console.error("Error adding student:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditInputChange = (e) => {
    setEditingStudent({ ...editingStudent, [e.target.name]: e.target.value });
  };

  const handleStartEdit = (student) => {
    setIsEditing(true);
    setEditingStudent({ ...student });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingStudent(null);
  };

  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const token = localStorage.getItem("qcu_admin_token");
    try {
      const response = await fetch(`http://localhost:5000/admin/students/${editingStudent.student_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(editingStudent),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      fetchStudents();
      setIsEditing(false);
      setEditingStudent(null);
    } catch (err) {
      console.error("Error updating student:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = async (studentId) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      setLoading(true);
      setError('');
      const token = localStorage.getItem("qcu_admin_token");
      try {
        const response = await fetch(`http://localhost:5000/admin/students/${studentId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }
        fetchStudents();
      } catch (err) {
        console.error("Error deleting student:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) return <div>Loading students...</div>;
  if (error)return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Student Management</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          <Plus className="h-4 w-4 mr-2 inline-block" /> Add Student
        </button>
      </div>

      {isAdding && (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Add New Student</h3>
          <form onSubmit={handleAddStudent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="student_id" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Student ID:</label>
              <input type="text" id="student_id" name="student_id" value={newStudent.student_id} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
            </div>
            <div>
              <label htmlFor="first_name" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">First Name:</label>
              <input type="text" id="first_name" name="first_name" value={newStudent.first_name} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
            </div>
            <div>
              <label htmlFor="last_name" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Last Name:</label>
              <input type="text" id="last_name" name="last_name" value={newStudent.last_name} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Email:</label>
              <input type="email" id="email" name="email" value={newStudent.email} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
            </div>
            <div>
              <label htmlFor="phone" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Phone:</label>
              <input type="text" id="phone" name="phone" value={newStudent.phone} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
            <div>
              <label htmlFor="address" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Address:</label>
              <input type="text" id="address" name="address" value={newStudent.address} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
            <div>
              <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Password:</label>
              <input type="password" id="password" name="password" value={newStudent.password} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
            </div>
            <div>
              <label htmlFor="program" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Program:</label>
              <input type="text" id="program" name="program" value={newStudent.program} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
            <div>
              <label htmlFor="year_level" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Year Level:</label>
              <input type="text" id="year_level" name="year_level" value={newStudent.year_level} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
            <div className="col-span-full flex justify-end">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                {loading ? 'Adding...' : 'Add Student'}
              </button>
            </div>
          </form>
        </div>
      )}

      {isEditing && editingStudent && (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Edit Student</h3>
          <form onSubmit={handleUpdateStudent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="edit_student_id" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Student ID:</label>
              <input type="text" id="edit_student_id" name="student_id" value={editingStudent.student_id} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-white" readOnly />
            </div>
            <div>
              <label htmlFor="edit_first_name" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">First Name:</label>
              <input type="text" id="edit_first_name" name="first_name" value={editingStudent.first_name} onChange={handleEditInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
            </div>
            <div>
              <label htmlFor="edit_last_name" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Last Name:</label>
              <input type="text" id="edit_last_name" name="last_name" value={editingStudent.last_name} onChange={handleEditInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
            </div>
            <div>
              <label htmlFor="edit_email" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Email:</label>
              <input type="email" id="edit_email" name="email" value={editingStudent.email} onChange={handleEditInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
            </div>
            <div>
              <label htmlFor="edit_phone" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Phone:</label>
              <input type="text" id="edit_phone" name="phone" value={editingStudent.phone} onChange={handleEditInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
            <div>
              <label htmlFor="edit_address" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Address:</label>
              <input type="text" id="edit_address" name="address" value={editingStudent.address} onChange={handleEditInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
            <div>
              <label htmlFor="edit_program" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Program:</label>
              <input type="text" id="edit_program" name="program" value={editingStudent.program} onChange={handleEditInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
            <div>
              <label htmlFor="edit_year_level" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Year Level:</label>
              <input type="text" id="edit_year_level" name="year_level" value={editingStudent.year_level} onChange={handleEditInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
            <div>
              <label htmlFor="edit_status" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Status:</label>
              <select id="edit_status" name="status" value={editingStudent.status} onChange={handleEditInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="on_leave">On Leave</option>
                <option value="graduated">Graduated</option>
              </select>
            </div>
            <div className="col-span-full flex justify-end">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                {loading ? 'Updating...' : 'Update Student'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">First Name</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Last Name</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">Phone</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">Program</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              <th className="py-3 px-6 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {students.map(student => (
              <tr key={student.student_id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                <td className="py-4 px-6 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{student.student_id}</td>
                <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{student.first_name}</td>
                <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{student.last_name}</td>
                <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{student.email}</td>
                <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 hidden md:table-cell">{student.phone}</td>
                <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 hidden lg:table-cell">{student.program}</td>
                <td className="py-4 px-6 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    student.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                    student.status === 'inactive' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                    student.status === 'on_leave' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                    student.status === 'graduated' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                  }`}>
                    {student.status.replace(/_/g, ' ').toUpperCase()}
                  </span>
                </td>
                <td className="py-4 px-6 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleStartEdit(student)}
                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-600 mr-2"
                  >
                    <Edit className="h-4 w-4 inline-block" />
                  </button>
                  <button
                    onClick={() => handleDeleteStudent(student.student_id)}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-600"
                  >
                    <Trash className="h-4 w-4 inline-block" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Course and Grade Management Component
const CourseAndGradeManagement = () => {
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [errorCourses, setErrorCourses] = useState('');
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [newCourse, setNewCourse] = useState({
    subject_code: '',
    subject_title: '',
    units: '',
    instructor_id: ''
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoadingCourses(true);
    setErrorCourses('');
    const token = localStorage.getItem("qcu_admin_token");
    try {
      const response = await fetch("http://localhost:5000/admin/courses", {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCourses(data);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setErrorCourses('Failed to fetch courses.');
    } finally {
      setLoadingCourses(false);
    }
  };

  const handleCourseInputChange = (e) => {
    setNewCourse({ ...newCourse, [e.target.name]: e.target.value });
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    setLoadingCourses(true);
    setErrorCourses('');
    const token = localStorage.getItem("qcu_admin_token");
    try {
      const response = await fetch("http://localhost:5000/admin/courses", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newCourse),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      fetchCourses();
      setIsAddingCourse(false);
      setNewCourse({
        subject_code: '',
        subject_title: '',
        units: '',
        instructor_id: ''
      });
    } catch (err) {
      console.error("Error adding course:", err);
      setErrorCourses(err.message);
    } finally {
      setLoadingCourses(false);
    }
  };

  if (loadingCourses) return <div>Loading courses...</div>;
  if (errorCourses) return <div className="text-red-500">{errorCourses}</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Course Management</h2>
        <button
          onClick={() => setIsAddingCourse(true)}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          <Plus className="h-4 w-4 mr-2 inline-block" /> Add Course
        </button>
      </div>

      {isAddingCourse && (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Add New Course</h3>
          <form onSubmit={handleAddCourse} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="subject_code" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Subject Code:</label>
              <input type="text" id="subject_code" name="subject_code" value={newCourse.subject_code} onChange={handleCourseInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
            </div>
            <div>
              <label htmlFor="subject_title" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Subject Title:</label>
              <input type="text" id="subject_title" name="subject_title" value={newCourse.subject_title} onChange={handleCourseInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
            </div>
            <div>
              <label htmlFor="units" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Units:</label>
              <input type="number" id="units" name="units" value={newCourse.units} onChange={handleCourseInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
            </div>
            <div>
              <label htmlFor="instructor_id" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Instructor ID (Optional):</label>
              <input type="text" id="instructor_id" name="instructor_id" value={newCourse.instructor_id} onChange={handleCourseInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
            <div className="col-span-full flex justify-end">
              <button
                type="button"
                onClick={() => setIsAddingCourse(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loadingCourses}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                {loadingCourses ? 'Adding...' : 'Add Course'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Code</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Units</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">Instructor ID</th>
              <th className="py-3 px-6 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {courses.map(course => (
              <tr key={course.course_id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                <td className="py-4 px-6 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{course.subject_code}</td>
                <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{course.subject_title}</td>
                <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{course.units}</td>
                <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 hidden md:table-cell">{course.instructor_id || 'N/A'}</td>
                <td className="py-4 px-6 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-600 mr-2">
                    <Edit className="h-4 w-4 inline-block" />
                  </button>
                  <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-600">
                    <Trash className="h-4 w-4 inline-block" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Manage Student Grades</h2>
        <p className="text-gray-600 dark:text-gray-400">
          This section will allow you to update grades for students. You might want to implement a more detailed UI for this,
          such as selecting a student and then updating their grades for specific courses.
        </p>
        {/* You can add a component here to manage student grades */}
      </div>
    </div>
  );
};

// Notification Management Component
const NotificationManagement = () => {
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [errorNotifications, setErrorNotifications] = useState('');
  const [isCreatingNotification, setIsCreatingNotification] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    student_id: '',
    recipient_type: 'specific'
  });

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoadingNotifications(true);
    setErrorNotifications('');
    const token = localStorage.getItem("qcu_admin_token");
    try {
      const response = await fetch("http://localhost:5000/admin/dashboard-stats", { // Assuming notifications are part of dashboard stats for now
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setNotifications(data.recent_notifications || []); // Adjust based on your API response
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setErrorNotifications('Failed to fetch notifications.');
    } finally {
      setLoadingNotifications(false);
    }
  };

  const handleNotificationInputChange = (e) => {
    setNewNotification({ ...newNotification, [e.target.name]: e.target.value });
  };

  const handleCreateNotification = async (e) => {
    e.preventDefault();
    setLoadingNotifications(true);
    setErrorNotifications('');
    const token = localStorage.getItem("qcu_admin_token");
    try {
      const response = await fetch("http://localhost:5000/admin/notifications", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newNotification),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      fetchNotifications();
      setIsCreatingNotification(false);
      setNewNotification({
        title: '',
        message: '',
        student_id: '',
        recipient_type: 'specific'
      });
    } catch (err) {
      console.error("Error creating notification:", err);
      setErrorNotifications(err.message);
    } finally {
      setLoadingNotifications(false);
    }
  };

  if (loadingNotifications) return <div>Loading notifications...</div>;
  if (errorNotifications) return <div className="text-red-500">{errorNotifications}</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Notifications</h2>
        <button
          onClick={() => setIsCreatingNotification(true)}
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          <Plus className="h-4 w-4 mr-2 inline-block" /> Create Notification
        </button>
      </div>

      {isCreatingNotification && (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Create New Notification</h3>
          <form onSubmit={handleCreateNotification} className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="title" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Title:</label>
              <input type="text" id="title" name="title" value={newNotification.title} onChange={handleNotificationInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
            </div>
            <div>
              <label htmlFor="message" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Message:</label>
              <textarea id="message" name="message" value={newNotification.message} onChange={handleNotificationInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-white" rows="3" required></textarea>
            </div>
            <div>
              <label htmlFor="recipient_type" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Recipient Type:</label>
              <select id="recipient_type" name="recipient_type" value={newNotification.recipient_type} onChange={handleNotificationInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <option value="specific">Specific Student</option>
                <option value="all">All Students</option>
              </select>
            </div>
            {newNotification.recipient_type === 'specific' && (
              <div>
                <label htmlFor="student_id" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Student ID (if specific):</label>
                <input type="text" id="student_id" name="student_id" value={newNotification.student_id} onChange={handleNotificationInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
            )}
            <div className="col-span-full flex justify-end">
              <button
                type="button"
                onClick={() => setIsCreatingNotification(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loadingNotifications}
                className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                {loadingNotifications ? 'Creating...' : 'Create Notification'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Recent Notifications</h3>
        {notifications.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No recent notifications.</p>
        ) : (
          <ul className="space-y-3">
            {notifications.map(notification => (
              <li key={notification.notification_id} className="bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white">{notification.title}</h4>
                <p className="text-gray-700 dark:text-gray-300 text-sm">{notification.message}</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                  Sent to: {notification.recipient_type === 'all' ? 'All Students' : `Student ID: ${notification.student_id || 'N/A'}`} | Created at: {new Date(notification.created_at).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminLayout;