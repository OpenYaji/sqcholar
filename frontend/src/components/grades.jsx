"use client"

import { Card, CardContent } from "@/components/ui/card"
import { BarChart, BarChartIcon as ChartSquare, Download, History } from "lucide-react"

export default function Grades({ setActiveSection }) {
  return (
    <div className="py-6">
      <div className="max-w-6xl mx-auto">
        {/* Grade Summary Card */}
        <Card className="mb-8 bg-gradient-to-r from-blue-900 to-blue-700 text-white animate-fadeIn">
          <CardContent className="p-6">
            <div className="mb-4">
              <h2 className="text-2xl font-bold">Grade Summary</h2>
              <p>Academic Year 2024-2025</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 p-4 rounded-lg text-center">
                <h3 className="text-sm font-medium mb-2 opacity-90">GWA</h3>
                <p className="text-2xl font-bold">1.75</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg text-center">
                <h3 className="text-sm font-medium mb-2 opacity-90">Units</h3>
                <p className="text-2xl font-bold">21</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg text-center">
                <h3 className="text-sm font-medium mb-2 opacity-90">Standing</h3>
                <p className="text-2xl font-bold">Good</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grade Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card
            className="bg-white dark:bg-gray-800 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 cursor-pointer"
            onClick={() => setActiveSection("currentGrades")}
          >
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="text-blue-900 dark:text-blue-400 mb-4">
                <BarChart className="h-10 w-10" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Current Grades</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">View your current semester grades</p>
            </CardContent>
          </Card>

          <Card
            className="bg-white dark:bg-gray-800 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 cursor-pointer"
            onClick={() => setActiveSection("pastGrades")}
          >
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="text-blue-900 dark:text-blue-400 mb-4">
                <History className="h-10 w-10" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Grade History</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">View your previous semester grades</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 cursor-pointer">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="text-blue-900 dark:text-blue-400 mb-4">
                <Download className="h-10 w-10" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Download Report</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Get your grade reports</p>
            </CardContent>
          </Card>
        </div>

{/* Grading System */}
<Card className="bg-white dark:bg-gray-800">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Grading System</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Green */}
              <div className="flex items-center justify-between bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full py-2 px-4">
                <span className="font-semibold">98-100</span>
                <span className="font-bold">1.0</span>
              </div>
              <div className="flex items-center justify-between bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full py-2 px-4">
                <span className="font-semibold">95-97</span>
                <span className="font-bold">1.25</span>
              </div>
              {/* Blue */}
              <div className="flex items-center justify-between bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full py-2 px-4">
                <span className="font-semibold">92-94</span>
                <span className="font-bold">1.50</span>
              </div>
              <div className="flex items-center justify-between bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full py-2 px-4">
                <span className="font-semibold">89-91</span>
                <span className="font-bold">1.75</span>
              </div>
              {/* Yellow */}
              <div className="flex items-center justify-between bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded-full py-2 px-4">
                <span className="font-semibold">86-88</span>
                <span className="font-bold">2.0</span>
              </div>
              <div className="flex items-center justify-between bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded-full py-2 px-4">
                <span className="font-semibold">83-85</span>
                <span className="font-bold">2.25</span>
              </div>
              {/* Orange */}
              <div className="flex items-center justify-between bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded-full py-2 px-4">
                <span className="font-semibold">80-82</span>
                <span className="font-bold">2.50</span>
              </div>
              <div className="flex items-center justify-between bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded-full py-2 px-4">
                <span className="font-semibold">77-79</span>
                <span className="font-bold">2.75</span>
              </div>
              {/* Red */}
              <div className="flex items-center justify-between bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-full py-2 px-4">
                <span className="font-semibold">75-76</span>
                <span className="font-bold">3.0</span>
              </div>
              <div className="flex items-center justify-between bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-full py-2 px-4">
                <span className="font-semibold">Below 75</span>
                <span className="font-bold">5.0</span>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
              <h4 className="font-semibold mb-2">Remarks:</h4>
              <p className="mb-1">INC - Incomplete</p>
              <p className="mb-1">OD - Officially Dropped</p>
              <p>UD - Unofficially Dropped</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}