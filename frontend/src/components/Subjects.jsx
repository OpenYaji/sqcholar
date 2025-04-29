"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Book, ArrowLeft } from "lucide-react";
import Pic1 from "/src/assets/elon.png";
import Pic2 from "/src/assets/zayn.png";
import Pic3 from "/src/assets/carti.png";
import Pic4 from "/src/assets/lapu.png";
import Pic5 from "/src/assets/lebron.png";
import Pic6 from "/src/assets/yvet.png";
import Pic7 from "/src/assets/kap.png";

const Subjects = ({ onReturn }) => {
  // Sample subject data
  const subjects = [
    {
      name: "Advanced Database",
      time: "Mon 3:00 PM - 9:00 PM",
      room: "IL603a / IK503 f1",
      instructor: "Prof. Musk",
      imageUrl: Pic1,
      Type: "Major",
    },
    {
      name: "Integrated Programming",
      time: "Tue 2:00 PM - 8:00 PM",
      room: "IL602a / IK604 f1",
      instructor: "Prof. Malik",
      imageUrl: Pic2,
      Type: "Major",
    },
    {
      name: "Understanding The Self",
      time: "Thu 7:00 AM - 10:00 AM",
      room: "IL504a",
      instructor: "Prof. Carti",
      imageUrl: Pic3,
      Type: "Minor",
    },
    {
      name: "RIPH",
      time: "Thu 11:00 AM - 2:00 PM",
      room: "IL504a",
      instructor: "Prof. Lapu-lapu",
      imageUrl: Pic4,
      Type: "Minor",
    },
    {
      name: "PE 4",
      time: "Fri 11:00 AM - 1:00 PM",
      room: "SB OG",
      instructor: "Prof. James",
      imageUrl: Pic5,
      Type: "Minor",
    },
    {
      name: "HCI",
      time: "Fri 2:00 PM - 8:00 PM",
      room: "IL601a / IK504 f1",
      instructor: "Prof. Famador",
      imageUrl: Pic6,
      Type: "Major",
    },
    {
      name: "Software Engineering",
      time: "Sat 2:00 PM - 8:00 PM",
      room: "TBA / IL502a",
      instructor: "Prof. Niño Barzaga",
      imageUrl: Pic7,
      Type: "Major",
    },
  ];

  return (
    <div className="py-6">
      {/* Header Card */}
      <div className="mb-6">
        <Card className="bg-gradient-to-r from-blue-900 to-blue-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={onReturn}
                className="mr-4 text-white hover:bg-blue-500/20"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-2xl font-bold">My Subjects</h2>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subject Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject, index) => {
          const cardClassName = `bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden 
            hover:shadow-lg transition-shadow duration-300 cursor-pointer
            ${
              subject.Type === 'Major'
                ? 'bg-green-100 dark:bg-green-900'
                : subject.Type === 'Minor'
                ? 'bg-yellow-100 dark:bg-yellow-900'
                : ''
            }`;

          const textColorClassName =
            subject.Type === 'Major' || subject.Type === 'Minor'
              ? 'text-gray-800 dark:text-gray-200'
              : 'text-gray-800 dark:text-white';

          return (
            <Card
              key={index}
              className={cardClassName}
              onClick={() => {
                console.log(`Clicked on ${subject.name}`);
              }}
            >
              <CardContent className={`p-6 flex flex-row space-x-6 items-center justify-between ${textColorClassName}`}>
                {/* Left Info */}
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`p-2 rounded-md ${
                        subject.Type === 'Major'
                          ? 'bg-green-500'
                          : subject.Type === 'Minor'
                          ? 'bg-yellow-500'
                          : 'bg-blue-500'
                      } text-white`}
                    >
                      <Book className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-semibold">{subject.name}</h3>
                  </div>

                  {/* Subject Details */}
                  <div className="space-y-1">
                    <p className="text-sm">
                      <span className="font-semibold">Time:</span> {subject.time}
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Room:</span> {subject.room}
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Instructor:</span> {subject.instructor}
                    </p>
                  </div>
                </div>

                {/* Right Profile Pic */}
                <img
                  src={subject.imageUrl}
                  alt={`Profile of ${subject.instructor}`}
                  className="w-16 h-16 rounded-full object-cover"
                />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Subjects;
