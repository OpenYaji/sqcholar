"use client"

import { useState, useEffect } from "react"
import { User, Mail, Phone, Calendar, MapPin, BookOpen, Award, Edit, Save, X } from "lucide-react"
import { Button } from "./ui/button"

const MyAccount = () => {
  // State for user data
  const [userData, setUserData] = useState({
    student_id: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    course: "",
    year_level: "",
    birthday: "",
    gender: "",
    emergency_contact: "",
    emergency_phone: "",
    face_data: ""
  })
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [editMode, setEditMode] = useState(false)
  const [editableFields, setEditableFields] = useState({})
  const [saveStatus, setSaveStatus] = useState("")

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true)
      setError("")
      
      try {
        const studentId = localStorage.getItem("qcu_student_id")
        
        if (!studentId) {
          throw new Error("Student ID not found")
        }
        
        // Fetch user data from API
        const response = await fetch(`http://localhost:5000/student/${studentId}`)
        
        if (!response.ok) {
          throw new Error("Failed to fetch user data")
        }
        
        const data = await response.json()
        setUserData(data)
        
        // Initialize editable fields with current values
        setEditableFields({
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
          emergency_contact: data.emergency_contact || "",
          emergency_phone: data.emergency_phone || ""
        })
      } catch (err) {
        console.error("Error fetching user data:", err)
        setError("Failed to load account information")
        
        // If data is in localStorage, use that as fallback
        const storedUserData = JSON.parse(localStorage.getItem("qcu_user_data") || "{}")
        if (storedUserData) {
          setUserData(storedUserData)
          setEditableFields({
            email: storedUserData.email || "",
            phone: storedUserData.phone || "",
            address: storedUserData.address || "",
            emergency_contact: storedUserData.emergency_contact || "",
            emergency_phone: storedUserData.emergency_phone || ""
          })
        }
      } finally {
        setLoading(false)
      }
    }
    
    fetchUserData()
  }, [])

  const handleEditToggle = () => {
    if (editMode && hasChanges()) {
      if (!confirm("You have unsaved changes. Discard changes?")) {
        return
      }
      // Reset editable fields to current values
      setEditableFields({
        email: userData.email || "",
        phone: userData.phone || "",
        address: userData.address || "",
        emergency_contact: userData.emergency_contact || "",
        emergency_phone: userData.emergency_phone || ""
      })
    }
    setEditMode(!editMode)
    setSaveStatus("")
  }

  const hasChanges = () => {
    return (
      editableFields.email !== userData.email ||
      editableFields.phone !== userData.phone ||
      editableFields.address !== userData.address ||
      editableFields.emergency_contact !== userData.emergency_contact ||
      editableFields.emergency_phone !== userData.emergency_phone
    )
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditableFields(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = async () => {
    setSaveStatus("saving")
    
    try {
      const response = await fetch(`http://localhost:5000/student/update/${userData.student_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(editableFields)
      })
      
      if (!response.ok) {
        throw new Error("Failed to update account information")
      }
      
      setUserData(prev => ({
        ...prev,
        ...editableFields
      }))
      
      const storedUserData = JSON.parse(localStorage.getItem("qcu_user_data") || "{}")
      localStorage.setItem("qcu_user_data", JSON.stringify({
        ...storedUserData,
        ...editableFields
      }))
      
      setSaveStatus("success")
      setTimeout(() => {
        setSaveStatus("")
        setEditMode(false)
      }, 2000)
    } catch (err) {
      console.error("Error updating user data:", err)
      setSaveStatus("error")
      setTimeout(() => {
        setSaveStatus("")
      }, 3000)
    }
  }

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-colors duration-300">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 p-6 relative">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-gray-100">
            {userData.face_data ? (
              <img 
                src={userData.face_data} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-500">
                <User size={32} />
              </div>
            )}
          </div>
          
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-bold text-white">
              {userData.first_name} {userData.last_name}
            </h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 mt-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-900 text-white">
                Student ID: {userData.student_id}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-700 text-white">
                {userData.course}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-600 text-white">
                {userData.year_level}
              </span>
            </div>
          </div>
        </div>
        
        <div className="absolute top-4 right-4">
          <Button
            variant={editMode ? "destructive" : "outline"} 
            size="sm"
            onClick={handleEditToggle}
            className={`bg-white dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 ${editMode ? 'border-red-500 text-red-500' : ''}`}
          >
            {editMode ? (
              <>
                <X className="mr-1 h-4 w-4" /> Cancel
              </>
            ) : (
              <>
                <Edit className="mr-1 h-4 w-4" /> Edit
              </>
            )}
          </Button>
        </div>
      </div>
      
      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 m-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Save Status */}
      {saveStatus && (
        <div className={`p-2 m-4 text-center rounded ${
          saveStatus === 'saving' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' :
          saveStatus === 'success' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' :
          'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
        }`}>
          {saveStatus === 'saving' && 'Saving changes...'}
          {saveStatus === 'success' && 'Changes saved successfully!'}
          {saveStatus === 'error' && 'Failed to save changes. Please try again.'}
        </div>
      )}
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
              Personal Information
            </h2>
            
            <div className="space-y-4">
              <div className="flex flex-col">
                <label className="text-sm text-gray-500 dark:text-gray-400">Full Name</label>
                <div className="flex items-center mt-1">
                  <User className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-gray-800 dark:text-gray-200">{userData.first_name} {userData.last_name}</span>
                </div>
              </div>
              
              <div className="flex flex-col">
                <label className="text-sm text-gray-500 dark:text-gray-400">Email</label>
                {editMode ? (
                  <div className="flex items-center mt-1">
                    <Mail className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                    <input 
                      type="email"
                      name="email"
                      value={editableFields.email}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    />
                  </div>
                ) : (
                  <div className="flex items-center mt-1">
                    <Mail className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-800 dark:text-gray-200">{userData.email}</span>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col">
                <label className="text-sm text-gray-500 dark:text-gray-400">Phone Number</label>
                {editMode ? (
                  <div className="flex items-center mt-1">
                    <Phone className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                    <input 
                      type="tel"
                      name="phone"
                      value={editableFields.phone}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    />
                  </div>
                ) : (
                  <div className="flex items-center mt-1">
                    <Phone className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-800 dark:text-gray-200">{userData.phone || "Not provided"}</span>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col">
                <label className="text-sm text-gray-500 dark:text-gray-400">Address</label>
                {editMode ? (
                  <div className="flex items-start mt-1">
                    <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-3 flex-shrink-0" />
                    <textarea 
                      name="address"
                      value={editableFields.address}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    />
                  </div>
                ) : (
                  <div className="flex items-start mt-1">
                    <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-1" />
                    <span className="text-gray-800 dark:text-gray-200">{userData.address || "Not provided"}</span>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col">
                <label className="text-sm text-gray-500 dark:text-gray-400">Birthday</label>
                <div className="flex items-center mt-1">
                  <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-gray-800 dark:text-gray-200">
                    {userData.birthday ? new Date(userData.birthday).toLocaleDateString() : "Not provided"}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col">
                <label className="text-sm text-gray-500 dark:text-gray-400">Gender</label>
                <div className="flex items-center mt-1">
                  <User className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-gray-800 dark:text-gray-200">{userData.gender || "Not provided"}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
              Academic & Emergency Information
            </h2>
            
            <div className="space-y-4">
              <div className="flex flex-col">
                <label className="text-sm text-gray-500 dark:text-gray-400">Course / Program</label>
                <div className="flex items-center mt-1">
                  <BookOpen className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-gray-800 dark:text-gray-200">{userData.course}</span>
                </div>
              </div>
              
              <div className="flex flex-col">
                <label className="text-sm text-gray-500 dark:text-gray-400">Year Level</label>
                <div className="flex items-center mt-1">
                  <Award className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-gray-800 dark:text-gray-200">{userData.year_level}</span>
                </div>
              </div>
              
              <div className="flex flex-col">
                <label className="text-sm text-gray-500 dark:text-gray-400">Emergency Contact Person</label>
                {editMode ? (
                  <div className="flex items-center mt-1">
                    <User className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                    <input 
                      type="text"
                      name="emergency_contact"
                      value={editableFields.emergency_contact}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    />
                  </div>
                ) : (
                  <div className="flex items-center mt-1">
                    <User className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-800 dark:text-gray-200">{userData.emergency_contact || "Not provided"}</span>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col">
                <label className="text-sm text-gray-500 dark:text-gray-400">Emergency Contact Number</label>
                {editMode ? (
                  <div className="flex items-center mt-1">
                    <Phone className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                    <input 
                      type="tel"
                      name="emergency_phone"
                      value={editableFields.emergency_phone}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    />
                  </div>
                ) : (
                  <div className="flex items-center mt-1">
                    <Phone className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-800 dark:text-gray-200">{userData.emergency_phone || "Not provided"}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Save Button for Edit Mode */}
            {editMode && (
              <div className="mt-6">
                <Button
                  onClick={handleSave}
                  disabled={saveStatus === 'saving' || !hasChanges()}
                  className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                >
                  {saveStatus === 'saving' ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" /> Save Changes
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyAccount