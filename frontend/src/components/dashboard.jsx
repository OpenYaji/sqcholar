"use client";

import React, { useState, useEffect } from "react";
import { Calendar, Bell, ExternalLink, ChevronLeft, ChevronRight, Lightbulb, Notebook} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Welcome from "/src/assets/about.png";
import Announce1 from "/src/assets/announce1.jpg";
import Announce2 from "/src/assets/announcement5.jpg";
import Event1 from "/src/assets/event1.jpg";
import Event2 from "/src/assets/event3.jpg";
import News1 from "/src/assets/news5.jpg";
import News2 from "/src/assets/news2.jpg";
import News3 from "/src/assets/slider1.jpeg";
import Subjects from "./Subjects";
import Events from "./Events";
import Notifications from "./Notifications";

const upcomingDeadline = "May 5, 2025";
const newsImages = [News1, News2, News3];

const NewsSlide = ({ imageUrl, alt }) => (
  <div className="min-w-full h-full">
    <img src={imageUrl} alt={alt} className="w-full h-full object-cover rounded-md" />
  </div>
);

const TipOfDayPopup = ({ tip, onClose }) => (
  <div className="fixed bottom-4 right-4 bg-yellow-100 border-yellow-400 text-yellow-700 px-4 py-3 rounded-md shadow-lg z-50">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Lightbulb className="h-5 w-5" />
        <h2 className="font-semibold text-sm">Tip of the Day</h2>
      </div>
      <button onClick={onClose} className="text-yellow-700 hover:text-yellow-900 focus:outline-none">
        <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
      </button>
    </div>
    <p className="text-sm mt-2">{tip}</p>
  </div>
);

export default function Dashboard() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeComponent, setActiveComponent] = useState(null);
  const [totalSlides] = useState(newsImages.length);
  const [firstname, setFirstname] = useState("");
  const [notificationCount, setNotificationCount] = useState(0);
  const [showTip, setShowTip] = useState(true); // State to control tip visibility

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(interval);
  }, [totalSlides]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("qcu_user_data"));
    if (userData?.first_name) {
      setFirstname(`${userData.first_name}`);
    }
    if (userData?.student_id) {
      fetchNotificationCount(userData.student_id);
    }
  }, []);

  const fetchNotificationCount = async (studentId) => {
    try {
      const response = await fetch(`http://localhost:5000/notifications/${studentId}`);
      if (response.ok) {
        const data = await response.json();
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
    setActiveComponent(null);
  };

  const closeTip = () => {
    setShowTip(false);
  };

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case 'subjects':
        return <Subjects onReturn={handleReturnToDashboard} />;
      case 'events':
        return <Events onReturn={handleReturnToDashboard} />;
      case 'notifications':
        return <Notifications onReturn={handleReturnToDashboard} />;
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
                      <Notebook className="h-6 w-6" />
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
                    <div className="relative overflow-hidden rounded-lg group h-45"> {/* Reduced height */}
                      <img
                        src={Announce1}
                        alt="QCUCAT"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-blue-900 dark:bg-gray-800 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="font-bold text-white dark:text-white text-sm">QCUCAT</h3>
                        <p className="text-white dark:text-gray-300 text-xs">Latest updates on college admission test.</p>
                        <a href="#" className="text-white dark:text-blue-400 inline-block mt-1 text-xs">
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>

                    <div className="relative overflow-hidden rounded-lg group h-45"> {/* Reduced height */}
                      <img
                        src={Announce2}
                        alt="Web Design"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="font-bold text-gray-800 dark:text-white text-sm">Web Design</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-xs">New web design workshop schedule.</p>
                        <a href="#" className="text-blue-900 dark:text-blue-400 inline-block mt-1 text-xs">
                          <ExternalLink className="h-3 w-3" />
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
                    <div className="relative overflow-hidden rounded-lg group h-45"> {/* Reduced height */}
                      <img
                        src={Event1}
                        alt="Campus Event"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-blue-900 dark:bg-gray-800 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="font-bold text-white dark:text-white text-sm">Campus Event</h3>
                        <p className="text-white dark:text-gray-300 text-xs">Join us for the upcoming campus event.</p>
                        <a href="#" className="text-white dark:text-blue-400 inline-block mt-1 text-xs">
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>

                    <div className="relative overflow-hidden rounded-lg group h-45"> {/* Reduced height */}
                      <img
                        src={Event2}
                        alt="Workshop"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="font-bold text-gray-800 dark:text-white text-sm">Workshop</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-xs">Technical skills workshop this weekend.</p>
                        <a href="#" className="text-blue-900 dark:text-blue-400 inline-block mt-1 text-xs">
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Container for Upcoming Deadline and Latest News */}
              <div className="lg:col-span-1">
                {/* Upcoming Deadline */}
                <Card className="shadow-md rounded-lg lg:h-[180px] mb-6 ">
                  <CardContent className="p-4 flex flex-col justify-between h-full">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white tracking-tight mb-2">Coming Up</h2>
                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-lg font-medium">
                      <Calendar className="h-5 w-5" />
                      <span>{upcomingDeadline}</span>
                    </div>
                    <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-400">Research Paper Due</p>
                    <Button variant="contained" size="sm" className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white">
                      View Task
                    </Button>
                  </CardContent>
                </Card>
                {/* Latest News Slider - Integrated */}
                <div className="lg:col-span-1">
                  <Card className="shadow-md rounded-lg lg:h-[auto]">  {/* Added fixed height */}
                    <CardContent className="p-4 flex flex-col justify-between h-full">
                      <div>
                        <div className="mb-2 flex justify-between items-center">
                          <h2 className="text-lg font-semibold text-gray-800 dark:text-white tracking-tight">What's New</h2>
                          <Button variant="link" className="text-blue-500 dark:text-blue-400 hover:underline text-sm">
                            More News
                            <ExternalLink className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                        <div className="relative overflow-hidden rounded-md h-30">
                          <div
                            className="flex transition-transform duration-500 h-full"
                            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                          >
                            {newsImages.map((src, index) => (
                              <NewsSlide key={index} imageUrl={src} alt={`News ${index + 1}`} />
                            ))}
                          </div>
                          {totalSlides > 1 && (
                            <>
                              <button
                                className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/70 dark:bg-gray-800/70 rounded-full p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-gray-700"
                                onClick={() => setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)}
                              >
                                <ChevronLeft className="h-5 w-5" />
                              </button>
                              <button
                                className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/70 dark:bg-gray-800/70 rounded-full p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-gray-700"
                                onClick={() => setCurrentSlide((prev) => (prev + 1) % totalSlides)}
                              >
                                <ChevronRight className="h-5 w-5" />
                              </button>
                              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                                {newsImages.map((_, index) => (
                                  <button
                                    key={index}
                                    className={`w-2 h-2 rounded-full ${currentSlide === index ? "bg-blue-600 dark:bg-blue-400" : "bg-gray-300 dark:bg-gray-600 opacity-70 hover:opacity-100"}`}
                                    onClick={() => goToSlide(index)}
                                  />
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {showTip && (
              <TipOfDayPopup
                tip="Try the Pomodoro Technique: study in focused 25-minuteintervals followed by short breaks."
                onClose={closeTip}
              />
            )}
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

