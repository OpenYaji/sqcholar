"use client"

import { useState } from "react"
import { Card, CardContent } from "./ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

// Sample data
const curriculumData = {
  "1st-1st": [
    { code: "MATH 1", title: "Mathematics in the Modern World", units: 3, prereq: "None" },
    { code: "GEE 1", title: "Gender and Society", units: 3, prereq: "None" },
    { code: "GEE 2", title: "People and the Earth's Ecosystems", units: 3, prereq: "None" },
    { code: "CC101", title: "Introduction to Computing", units: 3, prereq: "None" },
    { code: "CC102", title: "Fundamentals of Programming", units: 3, prereq: "None" },
    { code: "WS101", title: "Web Systems and Technologies 1 (Electives)", units: 3, prereq: "None" },
    { code: "PE 1", title: "Physical Fitness and Wellness", units: 2, prereq: "None" },
    { code: "NSTP 1", title: "National Service Training Program 1", units: 3, prereq: "None" },
  ],
  "1st-2nd": [
    { code: "SCI 1", title: "Science, Technology and Society", units: 3, prereq: "None" },
    { code: "ENG 1", title: "Purposive Communication", units: 3, prereq: "None" },
    { code: "GEE 3", title: "Philippine Popular Culture", units: 3, prereq: "None" },
    { code: "CC103", title: "Intermediate Programming", units: 3, prereq: "CC101, CC102" },
    { code: "PT101", title: "Platform Technologies (Electives)", units: 3, prereq: "CC101, CC102" },
    { code: "NET101", title: "Networking 1", units: 3, prereq: "None" },
    { code: "PE 2", title: "Rhythmic Activities", units: 2, prereq: "PE 1" },
    { code: "NSTP 2", title: "National Service Training Program 2", units: 3, prereq: "NSTP 1" },
  ],
  "2nd-1st": [
    { code: "HUM 1", title: "Art Appreciation", units: 3, prereq: "None" },
    { code: "IS104", title: "Systems Analysis and Design", units: 3, prereq: "2nd Year Standing, CC103" },
    { code: "CC104", title: "Data Structures and Algorithms", units: 3, prereq: "CC103" },
    { code: "CC105", title: "Information Management", units: 3, prereq: "CC103" },
    { code: "PF101", title: "Object-Oriented Programming", units: 3, prereq: "CC103, PT101, NET101" },
    { code: "NET102", title: "Networking 2", units: 3, prereq: "NET101, PT101" },
    { code: "PE 3", title: "Individual and Dual Sports", units: 2, prereq: "PE 1" },
  ],
  "2nd-2nd": [
        { code: "SOCSCI 1", title: "Understanding the Self", units: 3, prereq: "None" },
        { code: "SOCSCI 2", title: "Readings in Philippine History", units: 3, prereq: "None" },
        { code: "HCI101", title: "Introduction to Human Computer Interaction", units: 3, prereq: "None" },
        { code: "SE101", title: "Software Engineering", units: 3, prereq: "CC105, PF101, IS104" },
        { code: "IPT101", title: "Integrative Programming and Technologies 1", units: 3, prereq: "PT101, PF101" },
        { code: "IM101", title: "Advanced Database Systems", units: 3, prereq: "CC105, PF101, IS104" },
        { code: "PE 4", title: "Team Sports", units: 2, prereq: "PE 1" }
    ],
    "3rd-1st": [
        { code: "SOCSCI 3", title: "The Contemporary World", units: 3, prereq: "None" },
        { code: "RIZAL", title: "The Life and Works of Rizal", units: 3, prereq: "None" },
        { code: "MS101", title: "Discrete Mathematics", units: 3, prereq: "3rd Year Standing, CC104, PF101" },
        { code: "SPI101", title: "Social Professional Issues 1", units: 3, prereq: "3rd Year Standing, SE101" },
        { code: "AR101", title: "Architecture and Organization", units: 3, prereq: "3rd Year Standing, CC103" },
        { code: "IPT102", title: "Integrative Programming and Technologies 2 (Electives)", units: 3, prereq: "3rd Year Standing, IPT101" },
        { code: "SIA101", title: "Systems Integration and Architecture 1", units: 3, prereq: "3rd Year Standing, IPT101" }
    ],
    "3rd-2nd": [
        { code: "HUM 2", title: "Ethics", units: 3, prereq: "None" },
        { code: "AL101", title: "Algorithms and Complexity", units: 3, prereq: "MS101" },
        { code: "MS102", title: "Quantitative Methods", units: 3, prereq: "3rd Year Standing, MS101" },
        { code: "CC106", title: "Application Development and Emerging Technologies", units: 3, prereq: "3rd Year Standing, SE101" },
        { code: "IAS101", title: "Fundamental of Information Assurance and Security 1", units: 3, prereq: "3rd Year Standing, SIA101" },
        { code: "SIA102", title: "Systems Integration and Architecture 2 (Electives)", units: 3, prereq: "3rd Year Standing, SIA101" }
    ],
    "4th-1st": [
        { code: "CAP101*", title: "Capstone Project and Research 1", units: 3, prereq: "4th Year Standing, IAS101, MS102" },
        { code: "PRC101*", title: "Practicum 1", units: 3, prereq: "4th Year Standing, MS102, IAS101, CC106" },
        { code: "AL102", title: "Automata Theory and Formal Language", units: 3, prereq: "AL101" },
        { code: "IAS102", title: "Information Assurance and Security 2", units: 3, prereq: "IAS101" }
    ],
    "4th-2nd": [
        { code: "CAP102", title: "Capstone Project and Research 2", units: 3, prereq: "CAP101" },
        { code: "PRC102", title: "Practicum 2", units: 3, prereq: "PRC101" },
        { code: "SAM101", title: "Systems Administration and Maintenance", units: 3, prereq: "IAS102" }
    ]
}

export default function Curriculum() {
  const [selectedYear, setSelectedYear] = useState("1st")
  const [selectedSem, setSelectedSem] = useState("1st")

  // Get filtered curriculum
  const key = `${selectedYear}-${selectedSem}`
  const curriculum = curriculumData[key] || []

  return (
    <div className="py-6">
      <Card className="mb-6 bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold">Curriculum Overview</h2>
          <p className="text-xl mt-2">Bachelor of Science in Information Technology</p>
        </CardContent>
      </Card>
        <div className="mb-6 flex flex-wrap gap-4">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1st">1st</SelectItem>
              <SelectItem value="2nd">2nd</SelectItem>
              <SelectItem value="3rd">3rd</SelectItem>
              <SelectItem value="4th">4th</SelectItem>
            </SelectContent>
          </Select>
          <span className="self-center" style={{ fontSize: '1.2em' }} >Year</span>

          <Select value={selectedSem} onValueChange={setSelectedSem}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Semester" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1st">1st</SelectItem>
              <SelectItem value="2nd">2nd</SelectItem>
            </SelectContent>
          </Select>
          <span className="self-center" style={{ fontSize: '1.2em' }} >Semester</span>
        </div>
      <Card>
        <CardContent className="p-0 overflow-auto">
          <div className="min-w-full">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Units
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Prerequisites
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {curriculum.map((subject, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {subject.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {subject.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {subject.units}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {subject.prereq}
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
