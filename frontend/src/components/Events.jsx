"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink } from "lucide-react";

import Pic1 from "/src/assets/event3.jpg";
import Pic2 from "/src/assets/event1.jpg";
import Pic3 from "/src/assets/event2.jpg";
import Pic4 from "/src/assets/announcement5.jpg";

const Events = ({ onReturn }) => {
  const [events] = useState([
    {
      title: "Tech Expo 2024",
      date: "2024-07-15",
      location: "University Main Hall",
      shortDescription: "Explore the latest innovations in technology.",
      fullDescription:
        "Join us for Tech Expo 2024, where you'll experience groundbreaking innovations in AI, robotics, virtual reality, and more. Attend keynote speeches from industry leaders, participate in hands-on workshops, and network with top tech companies and startups shaping the future.",
      imageUrl: Pic1,
      link: "#",
    },
    {
      title: "Career Fair",
      date: "2024-07-22",
      location: "Student Activity Center",
      shortDescription: "Meet top employers and find your dream job.",
      fullDescription:
        "The Career Fair offers students and graduates an exceptional opportunity to meet recruiters from leading companies. Prepare your resume, polish your elevator pitch, and discover internship and job opportunities across various industries. Seminars on resume writing and interview skills will also be available.",
      imageUrl: Pic2,
      link: "#",
    },
    {
      title: "Campus Music Festival",
      date: "2024-07-29",
      location: "University Quadrangle",
      shortDescription: "Enjoy live music performances by local artists.",
      fullDescription:
        "Celebrate summer with the Campus Music Festival! Featuring a diverse lineup of bands, solo artists, and DJs from around the city. Enjoy food stalls, art installations, and a night of dancing under the stars. Bring your friends and don't miss out on the biggest musical event of the year!",
      imageUrl: Pic3,
      link: "#",
    },
    {
      title: "Alumni Homecoming",
      date: "2024-08-05",
      location: "University Grounds",
      shortDescription: "Reconnect with fellow alumni and celebrate our alma mater.",
      fullDescription:
        "The Alumni Homecoming invites past graduates to revisit their cherished campus memories. Enjoy a day filled with campus tours, sports matches, networking sessions, and an evening gala dinner. Celebrate our shared journey and strengthen the bonds that unite our university community.",
      imageUrl: Pic4,
      link: "#",
    },
  ]);

  const [selectedEvent, setSelectedEvent] = useState(null);

  if (selectedEvent) {
    return (
      <div className="py-8">
        <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-center mb-6">
              <Button
                variant="ghost"
                onClick={() => setSelectedEvent(null)}
                className="mr-4 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                {selectedEvent.title}
              </h2>
            </div>
            {/* Modified image container with max-width and center alignment */}
            <div className="mb-6 rounded-lg overflow-hidden mx-auto max-w-lg">
              <img
                src={selectedEvent.imageUrl}
                alt={selectedEvent.title}
                className="w-full h-auto object-contain"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Date:
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{selectedEvent.date}</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Location:
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{selectedEvent.location}</p>
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Description:
              </h3>
              <p className="text-gray-700 dark:text-gray-200 text-lg">
                {selectedEvent.fullDescription}
              </p>
            </div>
            {selectedEvent.link && (
              <a
                href={selectedEvent.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center mt-6 text-blue-600 dark:text-blue-400 hover:underline transition-colors text-lg"
              >
                Learn More
                <ExternalLink className="ml-1 h-5 w-5" />
              </a>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

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
              <h2 className="text-3xl font-bold">Ongoing Events</h2>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {events.map((event, index) => (
          <Card
            key={index}
            className="bg-white dark:bg-gray-800 shadow-md rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border border-gray-100 dark:border-gray-700 cursor-pointer"
            onClick={() => setSelectedEvent(event)}
          >
            <div className="relative h-[200px]">
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {event.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                Date: {event.date}
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Location: {event.location}
              </p>
              <p className="text-gray-700 dark:text-gray-200 text-sm">
                {event.shortDescription}
              </p>
              <Button
                variant="link"
                className="mt-4 p-0 text-blue-600 dark:text-blue-400 text-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedEvent(event);
                }}
              >
                Read more
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Events;