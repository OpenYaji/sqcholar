"use client"

import { useState, useEffect } from "react"
import { Bell, Moon, Sun, Menu, X } from "lucide-react"
import { Button } from "./ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"

export default function Header({ toggleDarkMode, darkMode, toggleSidebar, onLogout,onAccountClick }) {
  const [currentDate, setCurrentDate] = useState("")
  const [currentTime, setCurrentTime] = useState("")
  const [fullName, setFullName] = useState("")
  const [profileName, setProfileName] = useState("")
  const [profileImage, setProfileImage] = useState("./src/assets/about.png")
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date()

      const formattedDate = now.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })

      const formattedTime = now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
      })

      setCurrentDate(formattedDate)
      setCurrentTime(formattedTime)

      const userData = JSON.parse(localStorage.getItem("qcu_user_data"))
      if (userData?.first_name && userData?.last_name) {
        setFullName(`${userData.last_name}, ${userData.first_name}`)
      }

      const profileData = JSON.parse(localStorage.getItem("qcu_user_data"))
      if (profileData?.first_name && profileData?.last_name) {
        setProfileName(`${profileData.first_name} ${profileData.last_name}`)
      }

      // Fetch the profile image after login
      const fetchProfileImage = async () => {
        if (userData?.student_id) {
          try {
            const response = await fetch(`http://localhost:5000/profile-image/${userData.student_id}`);
            const data = await response.json();
            if (data?.profileImage) {
              setProfileImage(data.profileImage);
            }
          } catch (error) {
            console.error("Error fetching profile image:", error);
          }
        }
      };

      fetchProfileImage();
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  // Fetch notifications when user is logged in
  useEffect(() => {
    const fetchNotifications = async () => {
      const userData = JSON.parse(localStorage.getItem("qcu_user_data"));
      if (userData?.student_id) {
        try {
          const response = await fetch(`http://localhost:5000/notifications/${userData.student_id}`);
          if (response.ok) {
            const data = await response.json();
            setNotifications(data);

            // Immediately update unread count after fetching
            const unreadNotifications = data.filter(notification => !notification.read);
            setUnreadCount(unreadNotifications.length);
          }
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      } else {
        // Handle case where user data is not available (e.g., logged out)
        setNotifications([]);
        setUnreadCount(0);
      }
    };

    fetchNotifications();
    // Set up polling for notifications every minute
    const notificationInterval = setInterval(fetchNotifications, 60000);

    return () => clearInterval(notificationInterval);
  }, []);

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    const userData = JSON.parse(localStorage.getItem("qcu_user_data"));
    if (!userData?.student_id) return;

    try {
      const response = await fetch(`http://localhost:5000/notifications/read/${notificationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ student_id: userData.student_id }),
      });

      if (response.ok) {
        setNotifications(prevNotifications =>
          prevNotifications.map(notification =>
            notification.id === notificationId
              ? { ...notification, read: true }
              : notification
          )
        );

        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    const userData = JSON.parse(localStorage.getItem("qcu_user_data"));
    if (!userData?.student_id) return;

    try {
      const response = await fetch(`http://localhost:5000/notifications/read-all`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ student_id: userData.student_id }),
      });

      if (response.ok) {
        setNotifications(prevNotifications =>
          prevNotifications.map(notification => ({ ...notification, read: true }))
        );

        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
  };

  return (
    <header className="fixed top-0 right-0 left-0 z-30 bg-white dark:bg-gray-800 shadow-sm h-16 flex items-center justify-between px-4 transition-colors duration-300">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="relative group">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
          <span className="absolute bottom-[-25px] left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-md z-50">
            Toggle Sidebar
          </span>
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="hidden md:block text-sm text-gray-600 dark:text-gray-300">
          <span>{currentDate}</span> - <span>{currentTime}</span>
        </div>

        <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="relative group">
          {darkMode ? (
            <Sun className="h-5 w-5 text-yellow-400" />
          ) : (
            <Moon className="h-5 w-5 text-blue-900 dark:text-gray-300" />
          )}
          <span className="sr-only">Toggle Dark Mode</span>
          <span className="absolute bottom-[-25px] left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-md z-50">
            {darkMode ? "Light theme" : "Dark theme"}
          </span>
        </Button>

        <div className="relative">
          <Button variant="ghost" size="icon" onClick={toggleNotifications} className="relative group">
            <Bell className="h-5 w-5 text-blue-900 dark:text-gray-300" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
            <span className="sr-only">Notifications</span>
            <span className="absolute bottom-[-25px] left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-md z-50">
              View notifications
            </span>
          </Button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50 border border-gray-200 dark:border-gray-700">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 flex justify-between items-center">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200">Notifications</h3>
                <div className="flex gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-100"
                    >
                      Mark all as read
                    </button>
                  )}
                  <button onClick={toggleNotifications} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    No notifications to display
                  </div>
                ) : (
                  <div>
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 ${
                          !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                        }`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className={`text-sm ${!notification.read ? 'font-semibold' : 'font-normal'} text-gray-800 dark:text-gray-200`}>
                              {notification.title}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                              {new Date(notification.created_at).toLocaleString()}
                            </p>
                          </div>
                          {!notification.read && (
                            <span className="h-2 w-2 bg-blue-600 rounded-full"></span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-2 text-center border-t border-gray-200 dark:border-gray-700">
                <button className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        <span className="hidden md:inline text-sm font-medium text-gray-700 dark:text-gray-300">{fullName || "Student Name"} </span>

        <DropdownMenu open={isProfileDropdownOpen} onOpenChange={setIsProfileDropdownOpen}>
        <DropdownMenuTrigger asChild>
            <div className="cursor-pointer relative h-8 w-8 rounded-full overflow-hidden border border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-gray-300 dark:bg-gray-700"></div>
              )}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="flex items-center gap-2 p-2 border-b border-gray-100 dark:border-gray-700">
              <div className="h-10 w-10 rounded-full overflow-hidden">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gray-300 dark:bg-gray-700"></div>
                )}
              </div>
              <div>
                <p className="text-sm font-medium">{profileName || "Student Name"}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Student</p>
              </div>
            </div>
            <DropdownMenuItem className="cursor-pointer" onClick={() => { onAccountClick("myAccount"); setIsProfileDropdownOpen(false); }}> {/* Call the prop */}          <span>My Account</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-red-500 dark:text-red-400 focus:text-red-500 dark:focus:text-red-400" onClick={onLogout}>
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}