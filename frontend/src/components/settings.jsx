"use client"

import { useState } from "react"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Checkbox } from "./ui/checkbox"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

export default function Settings() {
  const [activeTab, setActiveTab] = useState("notifications")

  return (
    <div className="py-6">
      <Card className="mb-6 bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold">Settings</h2>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2 mb-6">

        <Button
          variant={activeTab === "notifications" ? "default" : "outline"}
          onClick={() => setActiveTab("notifications")}
          className={activeTab === "notifications" ? "bg-blue-900 hover:bg-blue-800" : ""}
        >
          Notifications
        </Button>
        <Button
          variant={activeTab === "appearance" ? "default" : "outline"}
          onClick={() => setActiveTab("appearance")}
          className={activeTab === "appearance" ? "bg-blue-900 hover:bg-blue-800" : ""}
        >
          Appearance
        </Button>
        <Button
          variant={activeTab === "security" ? "default" : "outline"}
          onClick={() => setActiveTab("security")}
          className={activeTab === "security" ? "bg-blue-900 hover:bg-blue-800" : ""}
        >
          Security
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">

          {activeTab === "notifications" && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Notification Settings</h3>

              <div className="flex items-center space-x-2">
                <Checkbox id="email-notifications" defaultChecked />
                <Label htmlFor="email-notifications">Email Notifications</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="grade-updates" defaultChecked />
                <Label htmlFor="grade-updates">Grade Updates</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="announcements" />
                <Label htmlFor="announcements">Announcements</Label>
              </div>
            </div>
          )}

          {activeTab === "appearance" && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Appearance Settings</h3>

              <div className="flex flex-col gap-2">
                <Label htmlFor="theme">Theme:</Label>
                <Select defaultValue="light">
                  <SelectTrigger id="theme">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light Mode</SelectItem>
                    <SelectItem value="dark">Dark Mode</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="font-size">Font Size:</Label>
                <Input id="font-size" type="range" min="12" max="20" defaultValue="16" />
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Security Settings</h3>

              <div className="flex items-center space-x-2">
                <Checkbox id="two-factor" />
                <Label htmlFor="two-factor">Two-Factor Authentication</Label>
              </div>

              <Button className="bg-blue-900 hover:bg-blue-800">Login History</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
