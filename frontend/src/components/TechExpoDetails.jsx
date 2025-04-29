"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowLeft } from "lucide-react";

// Placeholder for your image import. You'll need to replace this with the actual path.
import TechExpoImage from "/src/assets/event3.jpg"; // Assuming event3.jpg is relevant

const TechExpoDetails = ({ onReturn }) => {
  const event = {
    title: "Tech Expo 2024",
    date: "2024-07-15",
    location: "University Main Hall",
    description: "Explore the latest innovations in technology. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    imageUrl: TechExpoImage,
  };

  return (
    <div className="py-8">
      <div className="mb-8">
        <Card className="bg-gradient-to-r from-blue-900 to-blue-700 text-white shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={onReturn}
                className="mr-4 text-white hover:bg-purple-500/20"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h2 className="text-3xl font-bold">{event.title}</h2>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white dark:bg-gray-800 shadow-md rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="relative h-80 md:h-96">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
        <CardContent className="p-6">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
            {event.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
            Date: {event.date}
          </p>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
            Location: {event.location}
          </p>
          <p className="text-gray-700 dark:text-gray-200">
            {event.description}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TechExpoDetails;