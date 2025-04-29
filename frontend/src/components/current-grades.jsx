"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Settings2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export default function CurrentGrades() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("All")
  const [currentGradesData, setCurrentGradesData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  useEffect(() => {
    const fetchCurrentGrades = async () => {
      setLoading(true)
      setError(null)
      try {
        const userData = JSON.parse(localStorage.getItem("qcu_user_data"))
        if (!userData?.student_id) {
          setError("Student ID not found in local storage.")
          return
        }
        const studentId = userData.student_id

        const response = await fetch(`http://localhost:5000/current-grades/${studentId}`)
        if (!response.ok) {
          const errorData = await response.json()
          setError(`Failed to fetch current grades: ${errorData.message || response.statusText}`)
          return
        }
        const data = await response.json()
        setCurrentGradesData(data)
      } catch (err) {
        console.error("Error fetching current grades:", err)
        setError("Failed to fetch current grades due to a network error.")
      } finally {
        setLoading(false)
      }
    }

    fetchCurrentGrades()
  }, [])

  // Calculate remarks based on final grade
  const getRemarks = (grade) => {
    if (grade <= 3.0) return "Passed"
    return "Failed"
  }

  // Calculate grade color class
  const getGradeClass = (grade) => {
    if (grade <= 1.25) return "text-green-600 dark:text-green-400"
    if (grade <= 1.75) return "text-blue-600 dark:text-blue-400"
    if (grade <= 2.25) return "text-yellow-600 dark:text-yellow-400"
    if (grade <= 2.75) return "text-orange-600 dark:text-orange-400"
    return "text-red-600 dark:text-red-400"
  }

  // Filter and search grades
  const filteredGrades = currentGradesData.filter((grade) => {
    const matchesSearch =
      grade.subject_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grade.subject_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grade.instructor.toLowerCase().includes(searchTerm.toLowerCase())

    const gradeType = grade.type?.toLowerCase() // Store in a variable
    const matchesFilter =
      filter === "All" || (filter === "Major" && gradeType === "major") || (filter === "Minor" && gradeType === "minor")

    return matchesSearch && matchesFilter
  })

  if (loading) {
    return (
      <div className="py-6">
        <Card className="mb-6 bg-gradient-to-r from-blue-900 to-blue-700 text-white">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold">Current Academic Performance</h2>
            <p className="text-xl mt-2">Loading grades...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-6">
        <Card className="mb-6 bg-gradient-to-r from-red-900 to-red-700 text-white">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold">Error</h2>
            <p className="text-xl mt-2">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="py-6">
      <Card className="mb-6 bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold">Current Academic Performance</h2>
          {/* You might want to fetch and display the current semester/AY from your backend */}
          <p className="text-xl mt-2">Current Semester, AY</p>
        </CardContent>
      </Card>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Search subjects..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2">
            {filter !== "All" && (
              <div className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1.5 rounded-full text-sm">
                <span>{filter} Subjects</span>
                <button
                  onClick={() => setFilter("All")}
                  className="ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Settings2 size={16} />
                <span>Filter</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-4">
              <div className="space-y-4">
                <h4 className="font-medium text-sm">Filter Subjects</h4>
                <RadioGroup value={filter} onValueChange={setFilter}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="All" id="all" />
                    <Label htmlFor="all">All Subjects</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Major" id="major" />
                    <Label htmlFor="major">Major Subjects</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Minor" id="minor" />
                    <Label htmlFor="minor">Minor Subjects</Label>
                  </div>
                </RadioGroup>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Card>
        <CardContent className="p-0 overflow-auto">
          <div className="min-w-full">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Subject Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Subject Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Units
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Midterm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Finals
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Final Grade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Remarks
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Instructor
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredGrades.length > 0 ? (
                  filteredGrades.map((grade, index) => {
                    const remarks = getRemarks(grade.final_grade)
                    return (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {grade.subject_code}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {grade.subject_title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {grade.units}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${getGradeClass(grade.midterm)}`}>
                          {grade.midterm?.toFixed(2) || "-"}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${getGradeClass(grade.finals)}`}>
                          {grade.finals?.toFixed(2) || "-"}
                        </td>
                        <td
                          className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getGradeClass(grade.final_grade)}`}
                        >
                          {grade.final_grade?.toFixed(2) || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              remarks === "Passed"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            }`}
                          >
                            {remarks}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {grade.instructor_name}
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          No subjects found matching your criteria
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSearchTerm("")
                            setFilter("All")
                          }}
                          className="mt-2"
                        >
                          Clear Filters
                        </Button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
