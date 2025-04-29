"use client";

import React, { useState, useEffect } from "react";
import { Book, Calendar, Bell, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Welcome from "/src/assets/about.png";
import Announce1 from "/src/assets/announce1.jpg";
import Announce2 from "/src/assets/announcement5.jpg";
import Event1 from "/src/assets/event1.jpg";
import Event2 from "/src/assets/event3.jpg";
import News1 from "/src/assets/news5.jpg";
import News2 from "/src/assets/news2.jpg";
import News3 from "/src/assets/slider1.jpeg";
import Subjects from "./Subjects"; // Import Subjects component
import Events from "./Events"; // Import Events component
import Notifications from "./Notifications"; // Import Notifications component

export default function Dashboard() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeComponent, setActiveComponent] = useState(null);
  const [totalSlides] = useState(3);
  const [firstname, setFirstname] = useState(""); // State to store the first name
  const [notificationCount, setNotificationCount] = useState(0); // Add state for notification count

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);

    return () => clearInterval(interval);
  }, [totalSlides]);

  useEffect(() => {
    // Get user data from local storage on component mount
    const userData = JSON.parse(localStorage.getItem("qcu_user_data"));
    if (userData?.first_name) {
      setFirstname(`${userData.first_name}`);
    }
    
    // Fetch notifications to get the unread count
    if (userData?.student_id) {
      fetchNotificationCount(userData.student_id);
    }
  }, []);

  // Function to fetch notification count
  const fetchNotificationCount = async (studentId) => {
    try {
      const response = await fetch(`http://localhost:5000/notifications/${studentId}`);
      if (response.ok) {
        const data = await response.json();
        // Count unread notifications
        const unreadNotifications = data.filter(notification => !notification.read);
        setNotificationCount(unreadNotifications.length);
      }
    } catch (error) {
      console.error("Error fetching notifications count:", error);
    }
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const handleCardClick = (componentName) => {
    setActiveComponent(componentName);
  };

  const handleReturnToDashboard = () => {
    setActiveComponent(null); // Set activeComponent to null to show the dashboard
  };

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case 'subjects':
        return <Subjects onReturn={handleReturnToDashboard} />; // Pass the onReturn prop
      case 'events':
        return <Events onReturn={handleReturnToDashboard}/>;
      case 'notifications':
        return <Notifications onReturn={handleReturnToDashboard}/>;
      default:
        return (
          <>
            {/* Welcome Box */}
            <div className="mb-8">
              <Card className="bg-gradient-to-r from-blue-900 to-blue-700 text-white overflow-hidden">
                <CardContent className="p-6 flex flex-col md:flex-row justify-between items-center">
                  <div className="space-y-4 mb-4 md:mb-0">
                    <p className="text-sm opacity-90">
                      {new Date().toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <h1 className="text-3xl font-bold">Welcome Back, {firstname}!</h1>
                    <h3 className="text-xl">Always updated in your portal.</h3>
                  </div>
                  <div className="relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0 animate-float flex items-center justify-center">
                    <img
                      src={Welcome}
                      alt="Welcome"
                      className="w-full h-full object-contain rounded-lg transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <button onClick={() => handleCardClick('subjects')} className="block">
                <Card className="bg-gradient-to-r from-blue-900 to-blue-700 text-white hover:translate-y-[-10px] transition-transform duration-300 h-full cursor-pointer">
                  <CardContent className="p-6 flex items-center space-x-4">
                    <div className="bg-white/20 p-3 rounded-full">
                      <Book className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Subjects</h3>
                      <p className="text-lg">7 Active</p>
                    </div>
                  </CardContent>
                </Card>
              </button>

              <button onClick={() => handleCardClick('events')} className="block">
                <Card className="bg-gradient-to-r from-blue-900 to-blue-700 text-white hover:translate-y-[-10px] transition-transform duration-300 h-full cursor-pointer">
                  <CardContent className="p-6 flex items-center space-x-4">
                    <div className="bg-white/20 p-3 rounded-full">
                      <Calendar className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Events</h3>
                      <p className="text-lg">4 Ongoing</p>
                    </div>
                  </CardContent>
                </Card>
              </button>

              <button onClick={() => handleCardClick('notifications')} className="block">
                <Card className="bg-gradient-to-r from-blue-900 to-blue-700 text-white hover:translate-y-[-10px] transition-transform duration-300 h-full cursor-pointer">
                  <CardContent className="p-6 flex items-center space-x-4">
                    <div className="bg-white/20 p-3 rounded-full">
                      <Bell className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Notifications</h3>
                      <p className="text-lg">{notificationCount > 0 ? `${notificationCount} New` : 'No new notifications'}</p>
                    </div>
                  </CardContent>
                </Card>
              </button>
            </div>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Announcements Section */}
              <Card className="col-span-1">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Announcements</h2>
                    <button className="text-blue-900 dark:text-blue-400 hover:text-blue-700">
                      <ExternalLink className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="relative overflow-hidden rounded-lg group h-64">
                      <img
                        src={Announce1}
                        alt="QCUCAT"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-blue-900 dark:bg-gray-800 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="font-bold text-white dark:text-white">QCUCAT</h3>
                        <p className="text-white dark:text-gray-300 text-sm">Latest updates on college admission test.</p>
                        <a href="#" className="text-white dark:text-blue-400 inline-block mt-2">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </div>

                    <div className="relative overflow-hidden rounded-lg group h-64">
                      <img
                        src={Announce2}
                        alt="Web Design"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="font-bold text-gray-800 dark:text-white">Web Design</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">New web design workshop schedule.</p>
                        <a href="#" className="text-blue-900 dark:text-blue-400 inline-block mt-2">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Events Section */}
              <Card className="col-span-1">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Upcoming Events</h2>
                    <button className="text-blue-900 dark:text-blue-400 hover:text-blue-700">
                      <ExternalLink className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="relative overflow-hidden rounded-lg group h-64">
                      <img
                        src={Event1}
                        alt="Campus Event"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-blue-900 dark:bg-gray-800 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="font-bold text-white dark:text-white">Campus Event</h3>
                        <p className="text-white dark:text-gray-300 text-sm">Join us for the upcoming campus event.</p>
                        <a href="#" className="text-white dark:text-blue-400 inline-block mt-2">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </div>

                    <div className="relative overflow-hidden rounded-lg group h-64">
                      <img
                        src={Event2}
                        alt="Workshop"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="font-bold text-gray-800 dark:text-white">Workshop</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">Technical skills workshop this weekend.</p>
                        <a href="#" className="text-blue-900 dark:text-blue-400 inline-block mt-2">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* News Slider Section */}
              <Card className="col-span-1">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Latest News</h2>
                  </div>
                  <div className="relative overflow-hidden rounded-lg h-[400px]">
                    <div
                      className="flex transition-transform duration-500 h-full"
                      style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                    >
                      <div className="min-w-full h-full">
                        <img
                          src={News1}
                          alt="News 1"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-full h-full">
                        <img
                          src={News2}
                          alt="News 2"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-full h-full">
                        <img
                          src={News3}
                          alt="News 3"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    <button
                      className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 rounded-full p-1 text-blue-900 dark:text-white"
                      onClick={() => setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>

                    <button
                      className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 rounded-full p-1 text-blue-900 dark:text-white"
                      onClick={() => setCurrentSlide((prev) => (prev + 1) % totalSlides)}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>

                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {Array.from({ length: totalSlides }).map((_, index) => (
                        <button
                          key={index}
                          className={`w-3 h-3 rounded-full ${
                            currentSlide === index ? "bg-blue-900 dark:bg-blue-400" : "bg-gray-300 dark:bg-gray-600"
                          }`}
                          onClick={() => goToSlide(index)}
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        );
    }
  };

  return (
    <>
      {renderActiveComponent()}
    </>
  );
}