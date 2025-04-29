"use client";

import React, { useState, useEffect } from "react";
import { Bell, ArrowLeft, Check, AlertCircle, Info, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNowStrict } from 'date-fns';
import { cn } from "@/lib/utils"; // Assuming you have a utility for conditional class names

// Notification Icon Mapping with Customization
const notificationIcons = {
  "System Update": { icon: Info, color: "text-blue-500" },
  "System Maintenance": { icon: Info, color: "text-blue-500" },
  "Grade Released": { icon: Check, color: "text-green-500" },
  "New Grade Available": { icon: Check, color: "text-green-500" },
  "Class Suspension": { icon: AlertCircle, color: "text-orange-500" },
  "Important Announcement": { icon: AlertCircle, color: "text-red-500" },
  "New Message": { icon: Mail, color: "text-purple-500" },
  default: { icon: Bell, color: "text-gray-400" },
};

const Notifications = ({ onReturn }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      const userData = JSON.parse(localStorage.getItem("qcu_user_data"));
      if (!userData?.student_id) return;

      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/notifications/${userData.student_id}`);
        if (!response.ok) {
          throw new Error(`Error fetching notifications: ${response.status}`);
        }
        const data = await response.json();
        setNotifications(data);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
        setError(err.message || "Failed to fetch");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (notificationId) => {
    const userData = JSON.parse(localStorage.getItem("qcu_user_data"));
    if (!userData?.student_id) return;

    try {
      const response = await fetch(`http://localhost:5000/notifications/read/${notificationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ student_id: userData.student_id }),
      });

      if (response.ok) {
        setNotifications(prevNotifications =>
          prevNotifications.map(notification =>
            notification.id === notificationId ? { ...notification, read: true } : notification
          )
        );
      } else {
        console.error("Failed to mark notification as read");
      }
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  return (
    <div className="py-6">
      <div className="mb-6">
        <Card className="bg-gradient-to-r from-blue-900 to-blue-700 text-white shadow-md">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={onReturn}
                className="mr-4 text-white hover:bg-blue-500/20"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-2xl font-bold">Notifications</h2>
            </div>
            {notifications.filter(n => !n.read).length > 0 && (
              <div className="rounded-full bg-red-500 text-white text-xs font-bold py-1 px-2">
                {notifications.filter(n => !n.read).length} Unread
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-700"></div>
          </div>
        ) : error ? (
          <Card className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 shadow-sm">
            <CardContent className="p-6 flex items-center space-x-4">
              <AlertCircle className="h-6 w-6 text-red-500" />
              <div>
                <h3 className="text-lg font-semibold text-red-700 dark:text-red-400">Error</h3>
                <p className="text-red-700 dark:text-red-400">{error}</p>
              </div>
            </CardContent>
          </Card>
        ) : notifications.length === 0 ? (
          <Card className="shadow-sm">
            <CardContent className="py-8 flex flex-col items-center justify-center">
              <Bell className="h-16 w-16 mb-4 text-gray-400" />
              <p className="text-gray-600 dark:text-gray-400 text-center text-lg">No notifications yet.</p>
            </CardContent>
          </Card>
        ) : (
          notifications.map((notification) => {
            const iconInfo = notificationIcons[notification.title] || notificationIcons.default;
            const isRead = notification.read;

            return (
              <Card
                key={notification.id}
                className={cn(
                  "bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden transition-shadow duration-300 cursor-pointer",
                  isRead ? "opacity-70" : "hover:shadow-lg"
                )}
                onClick={() => !isRead && markAsRead(notification.id)}
              >
                <CardContent className="p-6 flex items-start space-x-4">
                  <div className={cn("p-3 rounded-md", iconInfo.color, "bg-opacity-10")}>
                    {React.createElement(iconInfo.icon, { className: "h-6 w-6 " + iconInfo.color })}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{notification.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{notification.message}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {formatDistanceToNowStrict(new Date(notification.created_at), { addSuffix: true })}
                      </p>
                      {!isRead && (
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent card click
                            markAsRead(notification.id);
                          }}
                          className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-3 py-1 text-xs font-semibold"
                        >
                          <Check className="h-3 w-3 mr-1" /> Read
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Notifications;