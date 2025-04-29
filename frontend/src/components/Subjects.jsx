"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Notebook, ArrowLeft, Clock, MapPin, User, FolderOpen } from "lucide-react";
import Pic1 from "/src/assets/elon.png";
import Pic2 from "/src/assets/zayn.png";
import Pic3 from "/src/assets/carti.png";
import Pic4 from "/src/assets/lapu.png";
import Pic5 from "/src/assets/lebron.png";
import Pic6 from "/src/assets/yvet.png";
import Pic7 from "/src/assets/kap.png";
import { cn } from "@/lib/utils";

const Subjects = ({ onReturn }) => {
  const subjects = [
    {
      name: "Advanced Database",
      time: "Mon 3:00 PM - 9:00 PM",
      room: "IL603a / IK503 f1",
      instructor: "Prof. Musk",
      imageUrl: Pic1,
      Type: "Major",
      workUrl: "/path/to/advanced-database/work",
    },
    {
      name: "Integrated Programming",
      time: "Tue 2:00 PM - 8:00 PM",
      room: "IL602a / IK604 f1",
      instructor: "Prof. Malik",
      imageUrl: Pic2,
      Type: "Major",
      workUrl: "/path/to/integrated-programming/work",
    },
    {
      name: "Understanding The Self",
      time: "Thu 7:00 AM - 10:00 AM",
      room: "IL504a",
      instructor: "Prof. Carti",
      imageUrl: Pic3,
      Type: "Minor",
      workUrl: "/path/to/understanding-self/work",
    },
    {
      name: "RIPH",
      time: "Thu 11:00 AM - 2:00 PM",
      room: "IL504a",
      instructor: "Prof. Lapu-lapu",
      imageUrl: Pic4,
      Type: "Minor",
      workUrl: "/path/to/riph/work",
    },
    {
      name: "PE 4",
      time: "Fri 11:00 AM - 1:00 PM",
      room: "SB OG",
      instructor: "Prof. James",
      imageUrl: Pic5,
      Type: "Minor",
      workUrl: "/path/to/pe4/work",
    },
    {
      name: "HCI",
      time: "Fri 2:00 PM - 8:00 PM",
      room: "IL601a / IK504 f1",
      instructor: "Prof. Famador",
      imageUrl: Pic6,
      Type: "Major",
      workUrl: "/path/to/hci/work",
    },
    {
      name: "Software Engineering",
      time: "Sat 2:00 PM - 8:00 PM",
      room: "TBA / IL502a",
      instructor: "Prof. Niño Barzaga",
      imageUrl: Pic7,
      Type: "Major",
      workUrl: "/path/to/software-engineering/work",
    },
  ];

  const openWork = (url) => {
    if (url) {
      window.open(url, "_blank");
    } else {
      alert("Work folder not available for this subject.");
    }
  };

  return (
    <div className="py-6">
      {/* Header Card */}
      <div className="mb-6">
        <Card className="bg-gradient-to-r from-blue-900 to-blue-700 text-white shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={onReturn}
                className="mr-4 text-white hover:bg-indigo-400/20"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-2xl font-bold">Your Subjects</h2>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subject Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject, index) => {
          const isMajor = subject.Type === 'Major';
          const primaryColor = isMajor ? 'bg-emerald-500' : 'bg-orange-500';
          const textColor = 'text-gray-800 dark:text-gray-100';
          const iconColor = 'text-gray-600 dark:text-gray-400';

          return (
            <Card
              key={index}
              className="bg-white dark:bg-gray-900 shadow-lg rounded-xl overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl" // Added hover scale animation
            >
              <CardContent className={`p-6 flex flex-col space-y-3 ${textColor}`}>
                {/* Top Section: Subject and Type */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-md text-white transition-colors duration-300 ${primaryColor} hover:${isMajor ? 'bg-emerald-600' : 'bg-orange-600'}`}> {/* Added hover color change */}
                      <Notebook className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold truncate">{subject.name}</h3>
                  </div>
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold text-white transition-colors duration-300",
                      isMajor && "bg-emerald-500 hover:bg-emerald-600",
                      !isMajor && "bg-orange-500 hover:bg-orange-600"
                    )}
                  >
                    {subject.Type}
                  </span>
                </div>

                {/* Middle Section: Concise Details */}
                <div className="space-y-1">
                  <p className="text-sm flex items-center space-x-2">
                    <Clock className={`h-4 w-4 ${iconColor}`} />
                    <span className="truncate">{subject.time}</span>
                  </p>
                  <p className="text-sm flex items-center space-x-2">
                    <MapPin className={`h-4 w-4 ${iconColor}`} />
                    <span className="truncate">{subject.room}</span>
                  </p>
                </div>
              </CardContent>

              {/* Bottom Section: Action Button and Instructor Info */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between">
                {/* Instructor Profile */}
                <div className="flex items-center space-x-2">
                  <img
                    src={subject.imageUrl}
                    alt={`Profile of ${subject.instructor}`}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <p className="text-xs text-gray-700 dark:text-gray-300 truncate">
                    {subject.instructor}
                  </p>
                </div>
                {/* Action Button */}
                {subject.workUrl && (
                  <Button
                    size="sm"
                    className="rounded-md bg-blue-500 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-transform duration-200 hover:scale-105" // Added button hover animation
                    onClick={() => openWork(subject.workUrl)}
                  >
                    <FolderOpen className="h-4 w-4 mr-2" />
                    View Work
                  </Button>
                )}
                {!subject.workUrl && (
                  <Button
                    size="sm"
                    className="rounded-md bg-gray-300 text-gray-600 cursor-not-allowed"
                    disabled
                  >
                    Work NA
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Subjects;