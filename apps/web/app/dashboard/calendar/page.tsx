"use client";

import * as React from "react";
import {
  Plus,
  Video,
  Clock,
  MapPin,
  Users,
  MoreHorizontal,
  CalendarIcon,
  ChevronDownIcon,
  Filter,
  Eye,
  Archive,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Input } from "@workspace/ui/components/input";
import { Calendar } from "@workspace/ui/components/calendar";
import { Separator } from "@workspace/ui/components/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { format } from "date-fns";

interface Meeting {
  id: string;
  title: string;
  date: Date;
  endDate?: Date;
  duration: string;
  type: "anonymous" | "professional";
  participants: { name: string; avatar: string }[];
  color: string;
  location?: string;
  description?: string;
}

export default function CalendarPage() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [view, setView] = React.useState<"month" | "week" | "day">("month");

  const meetings: Meeting[] = [
    {
      id: "1",
      title: "Product Design Review",
      date: new Date(2025, 11, 20, 10, 0),
      duration: "1 hour",
      type: "professional",
      participants: [
        { name: "Sarah Chen", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
        { name: "Mike Ross", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike" },
      ],
      color: "blue",
    },
    {
      id: "2",
      title: "Anonymous Career Chat",
      date: new Date(2025, 11, 20, 14, 30),
      duration: "30 min",
      type: "anonymous",
      participants: [
        { name: "Anonymous", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anon1" },
      ],
      color: "purple",
    },
    {
      id: "3",
      title: "Team Sync",
      date: new Date(2025, 11, 21, 15, 0),
      duration: "45 min",
      type: "professional",
      participants: [
        { name: "Jessica", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica" },
        { name: "Tom", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tom" },
        { name: "Anna", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anna" },
      ],
      color: "green",
    },
  ];

  const todaysMeetings = meetings.filter((m) => {
    const today = date || new Date();
    return (
      m.date.getDate() === today.getDate() &&
      m.date.getMonth() === today.getMonth() &&
      m.date.getFullYear() === today.getFullYear()
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">
            Manage your meetings and schedule
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search meetings..."
              className="pl-9 w-[200px]"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Schedule Meeting
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Schedule New Meeting</DialogTitle>
                <DialogDescription>
                  Create a new meeting with your connections
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <p className="text-sm text-muted-foreground">
                  Meeting scheduling form coming soon...
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        {/* Calendar View */}
        <div className="lg:col-span-5 space-y-4">
          {/* View Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-lg font-semibold">
                {date?.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </h2>
              <Button variant="ghost" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
              {["month", "week", "day"].map((v) => (
                <Button
                  key={v}
                  variant={view === v ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setView(v as typeof view)}
                  className="capitalize"
                >
                  {v}
                </Button>
              ))}
            </div>
          </div>

          {/* Calendar Component */}
          <div className="bg-card border border-border/50 rounded-xl p-6">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md"
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-2 space-y-4">
          {/* Selected Date Info */}
          <div className="bg-card border border-border/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Selected Date</h3>
              <Badge variant="outline">
                {date?.toLocaleDateString("en-US", { weekday: "short" })}
              </Badge>
            </div>
            <div className="text-4xl font-bold mb-2">
              {date?.getDate()}
            </div>
            <p className="text-sm text-muted-foreground">
              {date?.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          {/* Today's Meetings */}
          <div className="bg-card border border-border/50 rounded-xl p-6">
            <h3 className="font-semibold mb-4">
              Today's Schedule ({todaysMeetings.length})
            </h3>
            <div className="space-y-3">
              {todaysMeetings.length > 0 ? (
                todaysMeetings.map((meeting) => (
                  <MeetingCard key={meeting.id} meeting={meeting} />
                ))
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 mx-auto text-muted-foreground/50 mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No meetings scheduled
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-card border border-border/50 rounded-xl p-6">
            <h3 className="font-semibold mb-4">This Week</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total Meetings</span>
                <span className="font-semibold">8</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Hours Scheduled</span>
                <span className="font-semibold">6.5</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Participants</span>
                <span className="font-semibold">12</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MeetingCard({ meeting }: { meeting: Meeting }) {
  const colorClasses = {
    blue: "border-l-blue-500",
    purple: "border-l-purple-500",
    green: "border-l-green-500",
  };

  const typeColors = {
    anonymous: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    professional: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  };

  return (
    <div
      className={`bg-muted/30 rounded-lg p-3 border-l-4 ${
        colorClasses[meeting.color as keyof typeof colorClasses]
      } hover:bg-muted/50 transition-colors group`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold truncate">{meeting.title}</h4>
          <div className="flex items-center gap-2 mt-1">
            <Clock className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {meeting.date.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
              })}{" "}
              • {meeting.duration}
            </span>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" className="opacity-0 group-hover:opacity-100">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Video className="h-4 w-4 mr-2" />
              Join Meeting
            </DropdownMenuItem>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Cancel</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {meeting.participants.slice(0, 3).map((participant, i) => (
            <Avatar key={i} className="h-6 w-6 border-2 border-background">
              <AvatarImage src={participant.avatar} />
              <AvatarFallback>
                {participant.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          ))}
          {meeting.participants.length > 3 && (
            <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-[10px] font-medium">
              +{meeting.participants.length - 3}
            </div>
          )}
        </div>
        <Badge variant="secondary" className={`text-xs ${typeColors[meeting.type]}`}>
          {meeting.type}
        </Badge>
      </div>
    </div>
  );
}
