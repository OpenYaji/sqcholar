"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Sample data
const pastGradesData = {
  "1st-1st": [
    { code: "MATH 1", description: "Mathematics in the Modern World", units: 3, grade: 2.00, remarks: "Passed" },
    { code: "GEE 1", description: "Gender and Society", units: 3, grade: 1.75, remarks: "Passed" },
    { code: "GEE 2", description: "People and the Earth’s Ecosystems", units: 3, grade: 1.50, remarks: "Passed" },
    { code: "CC101", description: "Introduction to Computing", units: 3, grade: 2.25, remarks: "Passed" },
    { code: "CC102", description: "Fundamentals of Programming", units: 3, grade: 2.50, remarks: "Passed" },
    { code: "WS101", description: "Web Systems and Technologies 1 (Electives)", units: 3, grade: 1.75, remarks: "Passed" },
    { code: "PE 1", description: "Physical Fitness and Wellness", units: 2, grade: 1.25, remarks: "Passed" },
    { code: "NSTP 1", description: "National Service Training Program 1", units: 3, grade: 1.50, remarks: "Passed" }
],
"1st-2nd": [
    { code: "SCI 1", description: "Science, Technology and Society", units: 3, grade: 1.75, remarks: "Passed" },
    { code: "ENG 1", description: "Purposive Communication", units: 3, grade: 2.00, remarks: "Passed" },
    { code: "GEE 3", description: "Philippine Popular Culture", units: 3, grade: 2.25, remarks: "Passed" },
    { code: "CC103", description: "Intermediate Programming", units: 3, grade: 2.50, remarks: "Passed" },
    { code: "PT101", description: "Platform Technologies (Electives)", units: 3, grade: 1.50, remarks: "Passed" },
    { code: "NET101", description: "Networking 1", units: 3, grade: 1.75, remarks: "Passed" },
    { code: "PE 2", description: "Rhythmic Activities", units: 2, grade: 1.25, remarks: "Passed" },
    { code: "NSTP 2", description: "National Service Training Program 2", units: 3, grade: 1.50, remarks: "Passed" }
],
"2nd-1st": [
    { code: "HUM 1", description: "Art Appreciation", units: 3, grade: 1.50, remarks: "Passed" },
    { code: "IS104", description: "Systems Analysis and Design", units: 3, grade: 1.75, remarks: "Passed" },
    { code: "CC104", description: "Data Structures and Algorithms", units: 3, grade: 1.50, remarks: "Passed" },
    { code: "CC105", description: "Information Management", units: 3, grade: 1.75, remarks: "Passed" },
    { code: "PF101", description: "Object-Oriented Programming", units: 3, grade: 1.25, remarks: "Passed" },
    { code: "NET102", description: "Networking 2", units: 3, grade: 1.75, remarks: "Passed" },
    { code: "PE 3", description: "Individual and Dual Sports", units: 2, grade: 1.25, remarks: "Passed" }
],
"2nd-2nd": [
    { code: "SOCSCI 1", description: "Understanding the Self", units: 3, grade: null, remarks: "In Progress" },
    { code: "SOCSCI 2", description: "Readings in Philippine History", units: 3, grade: null, remarks: "In Progress" },
    { code: "HCI101", description: "Introduction to Human Computer Interaction", units: 3, grade: null, remarks: "In Progress" },
    { code: "SE101", description: "Software Engineering", units: 3, grade: null, remarks: "In Progress" },
    { code: "IPT101", description: "Integrative Programming and Technologies 1", units: 3, grade: null, remarks: "In Progress" },
    { code: "IM101", description: "Advanced Database Systems", units: 3, grade: null, remarks: "In Progress" },
    { code: "PE 4", description: "Team Sports", units: 2, grade: null, remarks: "In Progress" }
],
"3rd-1st": [
    { code: "SOCSCI 3", description: "The Contemporary World", units: 3, grade: null, remarks: "Not Taken" },
    { code: "RIZAL", description: "The Life and Works of Rizal", units: 3, grade: null, remarks: "Not Taken" },
    { code: "MS101", description: "Discrete Mathematics", units: 3, grade: null, remarks: "Not Taken" },
    { code: "SPI101", description: "Social Professional Issues 1", units: 3, grade: null, remarks: "Not Taken" },
    { code: "AR101", description: "Architecture and Organization", units: 3, grade: null, remarks: "Not Taken" },
    { code: "IPT102", description: "Integrative Programming and Technologies 2", units: 3, grade: null, remarks: "Not Taken" },
    { code: "SIA101", description: "Systems Integration and Architecture 1", units: 3, grade: null, remarks: "Not Taken" }
],
"3rd-2nd": [
    { code: "HUM 2", description: "Ethics", units: 3, grade: null, remarks: "Not Taken" },
    { code: "AL101", description: "Algorithms and Complexity", units: 3, grade: null, remarks: "Not Taken" },
    { code: "MS102", description: "Quantitative Methods", units: 3, grade: null, remarks: "Not Taken" },
    { code: "CC106", description: "Application Development and Emerging Technologies", units: 3, grade: null, remarks: "Not Taken" },
    { code: "IAS101", description: "Fundamental of Information Assurance and Security 1", units: 3, grade: null, remarks: "Not Taken" },
    { code: "SIA102", description: "Systems Integration and Architecture 2", units: 3, grade: null, remarks: "Not Taken" }
],
"4th-1st": [
    { code: "CAP101*", description: "Capstone Project and Research 1", units: 3, grade: null, remarks: "Not Taken" },
    { code: "PRC101*", description: "Practicum 1", units: 3, grade: null, remarks: "Not Taken" },
    { code: "AL102", description: "Automata Theory and Formal Language", units: 3, grade: null, remarks: "Not Taken" },
    { code: "IAS102", description: "Information Assurance and Security 2", units: 3, grade: null, remarks: "Not Taken" }
],
"4th-2nd": [
    { code: "CAP102", description: "Capstone Project and Research 2", units: 3, grade: null, remarks: "Not Taken" },
    { code: "PRC102", description: "Practicum 2", units: 3, grade: null, remarks: "Not Taken" },
    { code: "SAM101", description: "Systems Administration and Maintenance", units: 3, grade: null, remarks: "Not Taken" }
]
}

export default function PastGrades() {
  const [selectedYear, setSelectedYear] = useState("1st")
  const [selectedSem, setSelectedSem] = useState("1st")

  // Calculate grade color class
  const getGradeClass = (grade) => {
    if (!grade) return ""
    if (grade <= 1.25) return "text-green-600 dark:text-green-400"
    if (grade <= 1.75) return "text-blue-600 dark:text-blue-400"
    if (grade <= 2.25) return "text-yellow-600 dark:text-yellow-400"
    if (grade <= 2.75) return "text-orange-600 dark:text-orange-400"
    return "text-red-600 dark:text-red-400"
  }

  // Get academic standing based on GWA
  const getAcademicStanding = (gwa) => {
    if (gwa <= 1.25) return "Excellent"
    if (gwa <= 1.75) return "Very Good"
    if (gwa <= 2.25) return "Good"
    if (gwa <= 2.75) return "Satisfactory"
    return "Fair"
  }

  // Get filtered grades
  const key = `${selectedYear}-${selectedSem}`
  const grades = pastGradesData[key] || []

  // Calculate GWA and total units
  let totalUnits = 0
  let totalGradePoints = 0

  grades.forEach((grade) => {
    if (grade.grade) {
      totalUnits += grade.units
      totalGradePoints += grade.grade * grade.units
    }
  })

  const gwa = totalUnits > 0 ? totalGradePoints / totalUnits : 0

  return (
    <div className="py-6">
      <Card className="mb-6 bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <h2 className="text-2xl font-bold">Grade History</h2>
            <div className="flex gap-2 mt-4 md:mt-0">
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-[120px] bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1st">1st Year</SelectItem>
                  <SelectItem value="2nd">2nd Year</SelectItem>
                  <SelectItem value="3rd">3rd Year</SelectItem>
                  <SelectItem value="4th">4th Year</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedSem} onValueChange={setSelectedSem}>
                <SelectTrigger className="w-[150px] bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1st">1st Semester</SelectItem>
                  <SelectItem value="2nd">2nd Semester</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="bg-white dark:bg-gray-800 hover:shadow-md transition-all duration-300">
          <CardContent className="p-6 text-center">
            <h4 className="text-gray-500 dark:text-gray-400 text-sm mb-2">General Weighted Average</h4>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{gwa.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 hover:shadow-md transition-all duration-300">
          <CardContent className="p-6 text-center">
            <h4 className="text-gray-500 dark:text-gray-400 text-sm mb-2">Units Earned</h4>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalUnits}</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 hover:shadow-md transition-all duration-300">
          <CardContent className="p-6 text-center">
            <h4 className="text-gray-500 dark:text-gray-400 text-sm mb-2">Academic Standing</h4>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{getAcademicStanding(gwa)}</p>
          </CardContent>
        </Card>
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
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Units
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Grade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Remarks
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {grades.map((grade, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {grade.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {grade.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {grade.units}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getGradeClass(grade.grade)}`}>
                      {grade.grade?.toFixed(2) || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          grade.remarks === "Passed"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : grade.remarks === "Failed"
                              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {grade.remarks}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
