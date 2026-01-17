"use client";

import { useNavigation } from "@/contexts/navigation-context";
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Calendar, Users, MapPin, ExternalLink } from "lucide-react";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  attendees: number;
  type: "Webinar" | "Workshop" | "Meetup";
  description: string;
  image: string;
}

const EVENTS: Event[] = [
  {
    id: "1",
    title: "System Design Masterclass",
    date: "Oct 25, 2026",
    time: "10:00 AM PST",
    attendees: 1240,
    type: "Webinar",
    description: "Learn how to design scalable systems from Senior Engineers at Netflix and Uber.",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80",
  },
  {
    id: "2",
    title: "React Server Components Workshop",
    date: "Nov 02, 2026",
    time: "2:00 PM PST",
    attendees: 450,
    type: "Workshop",
    description: "Hands-on workshop building a Next.js 15 application with the latest features.",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
  },
  {
    id: "3",
    title: "Tech Career Meetup: Bangalore",
    date: "Nov 15, 2026",
    time: "6:00 PM IST",
    attendees: 85,
    type: "Meetup",
    description: "Connect with local developers and tech leaders. Pizza and networking included!",
    image: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&q=80",
  },
];

export default function EventsPage() {
  const { setActiveSection, setActiveSubSection } = useNavigation();

  useEffect(() => {
    setActiveSection("Community");
    setActiveSubSection("Events");
  }, [setActiveSection, setActiveSubSection]);

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Community Events</h1>
        <p className="text-muted-foreground mt-2">Join webinars, workshops, and local meetups to level up your skills.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {EVENTS.map((event) => (
          <Card key={event.id} className="overflow-hidden flex flex-col group">
            <div className="relative h-48 w-full overflow-hidden">
               <img 
                src={event.image} 
                alt={event.title} 
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" 
               />
               <Badge className="absolute top-3 right-3 bg-background/80 hover:bg-background/90 text-foreground backdrop-blur-md">
                 {event.type}
               </Badge>
            </div>
            <CardHeader>
              <CardTitle className="line-clamp-1">{event.title}</CardTitle>
              <CardDescription className="flex items-center gap-4 mt-1">
                 <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {event.date}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                {event.description}
              </p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
                <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {event.attendees} Attending</span>
                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> Online</span>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
               <Button className="w-full">Register Now</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
