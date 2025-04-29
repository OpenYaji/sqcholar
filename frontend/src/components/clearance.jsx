"use client"

import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"

export default function Clearance() {
  return (
    <div className="py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="col-span-1 md:col-span-2 bg-gradient-to-r from-blue-900 to-blue-700 text-white animate-fadeIn">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">Clearance Summary</h2>
            <div className="flex items-center">
              <span className="h-3 w-3 rounded-full bg-green-500 mr-2"></span>
              <span className="font-bold">CLEARED</span>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2 border-l-4 border-blue-900 dark:border-blue-700">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Office Status</h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">OSAS</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Return Slip: CLEARED</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs font-semibold rounded-full">
                  CLEARED
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">Registrar</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Reason: SF10 Copy for QCU</p>
                </div>
                <span className="px-3 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 text-xs font-semibold rounded-full">
                  NOT CLEARED
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">Accounting</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Current Balance: ₱ 0.00</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Previous Balance: ₱ 0.00</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs font-semibold rounded-full">
                  CLEARED
                </span>
              </div>
            </div>
          </CardContent>
        </Card>





        <Card className="col-span-1 md:col-span-2 border-l-4 border-blue-900 dark:border-blue-700">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Payment History</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-center">
                <p className="text-gray-600 dark:text-gray-300">Tuition Fee (2024-03-15)</p>
                <p className="font-semibold text-gray-800 dark:text-white">₱ 5,000.00</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-center">
                <p className="text-gray-600 dark:text-gray-300">Miscellaneous Fee (2024-02-28)</p>
                <p className="font-semibold text-gray-800 dark:text-white">₱ 1,500.00</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-center">
                <p className="text-gray-600 dark:text-gray-300">Library Fee (2024-01-10)</p>
                <p className="font-semibold text-gray-800 dark:text-white">₱ 500.00</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-blue-900 dark:border-blue-700">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Document Requests</h3>
            <div className="space-y-2">
              <Button className="w-full bg-blue-900 hover:bg-blue-800 dark:bg-blue-700 dark:hover:bg-blue-600">
                Transcript of Records
              </Button>
              <Button className="w-full bg-blue-900 hover:bg-blue-800 dark:bg-blue-700 dark:hover:bg-blue-600">
                Certificate of Enrollment
              </Button>
              <Button className="w-full bg-blue-900 hover:bg-blue-800 dark:bg-blue-700 dark:hover:bg-blue-600">
                Good Moral Certificate
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
