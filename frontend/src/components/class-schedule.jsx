"use client"

import { Card, CardContent } from "./ui/card"

export default function ClassSchedule() {
  return (
    <div className="py-6">
      <Card className="mb-6 bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold">Class Schedule - 2nd Year, 2nd Semester</h2>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0 overflow-auto">
          <div className="min-w-full">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-blue-900 dark:bg-blue-800 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Day</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Room</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Instructor</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    Monday
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    Advanced Database
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    3:00 PM - 9:00 PM
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">IL603a / IK503 f1</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">Prof. Santos</td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    Tuesday
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    Integrated Programming
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    2:00 PM - 8:00 PM
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">IL602a / IK604 f1</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    Prof. Soriano
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    Wednesday
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 text-center"
                    colSpan={3}
                  >
                    Rest Day
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    Thursday
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">UTS and RIPH</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    7:00 AM - 10:00 AM / 11:00 AM - 2:00 PM
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">IL504a</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    Prof. Randy / Prof. Palmiano
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    Friday
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">PE 4 and HCI</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    11:00 AM - 1:00 PM / 2:00PM - 8:00PM
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">SB OG/ IL601a / IK504 f1</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    Prof. Denver/ Prof. Tanjente
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    Saturday
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    Software Engineering
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    2:00 PM - 8:00 PM
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">TBA / IL502a</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">Prof. Distor</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
