"use client";

import { useNavigation } from "@/contexts/navigation-context";
import * as React from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Button } from "@workspace/ui/components/button";
import { Calendar } from "@workspace/ui/components/calendar";
import { Badge } from "@workspace/ui/components/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import {
  ChevronDownIcon,
  VideoIcon,
  UsersIcon,
  CalendarIcon,
  ClockIcon,
  GlobeIcon,
} from "lucide-react";
import { format } from "date-fns";


interface Meeting {
  id: string;
  title: string;
  date: Date;
  endDate: Date;
  type: "anonymous" | "exposed" | "scheduled";
  participants?: number;
  status?: "upcoming" | "completed" | "cancelled";
  timezone?: string;
  location?: string;
}

export default function Page() {
  const { /* activeSection, activeSubSection */ } = useNavigation();
  const router = useRouter();

  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    new Date()
  );
  const [showMeetingDetails, setShowMeetingDetails] = React.useState(false);
  const [selectedDateMeetings, setSelectedDateMeetings] = React.useState<Meeting[]>([]);
  const [showProfileCompleteDialog, setShowProfileCompleteDialog] = React.useState(false);

  // Mock profile check
  React.useEffect(() => {
    // Check if profile is marked as completed in localStorage
    // In a real app, this would check the user object from the backend/context
    const isProfileCompleted = localStorage.getItem("helixque-profile-completed");
    
    if (!isProfileCompleted) {
      // Delay slightly for better UX
      const timer = setTimeout(() => {
        setShowProfileCompleteDialog(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleCompleteProfile = () => {
    setShowProfileCompleteDialog(false);
    // Mark as completed for now so it doesn't show again immediately (optional logic)
    // localStorage.setItem("helixque-profile-completed", "true");
    router.push("/dashboard/edit-profile");
  };

  // User timezone
  const userTimezone = "PST (UTC-8)";

  // Mock data for upcoming meetings - extended with endDate and timezone
  const upcomingMeetings: Meeting[] = [
    {
      id: "1",
      title: "Team Sync",
      date: new Date(2025, 11, 19, 10, 0),
      endDate: new Date(2025, 11, 19, 11, 0),
      type: "scheduled",
      participants: 5,
      status: "upcoming",
      timezone: "PST (UTC-8)",
      location: "Conference Room A",
    },
    {
      id: "2",
      title: "Quick Connect",
      date: new Date(2025, 11, 19, 14, 30),
      endDate: new Date(2025, 11, 19, 15, 0),
      type: "anonymous",
      participants: 2,
      status: "upcoming",
      timezone: "PST (UTC-8)",
    },
    {
      id: "3",
      title: "Client Review",
      date: new Date(2025, 11, 20, 15, 0),
      endDate: new Date(2025, 11, 20, 16, 30),
      type: "exposed",
      participants: 3,
      status: "upcoming",
      timezone: "EST (UTC-5)",
      location: "Virtual - Zoom",
    },
    {
      id: "4",
      title: "Project Kickoff",
      date: new Date(2025, 11, 21, 9, 0),
      endDate: new Date(2025, 11, 21, 10, 0),
      type: "scheduled",
      participants: 8,
      status: "upcoming",
      timezone: "PST (UTC-8)",
      location: "Main Office",
    },
    {
      id: "5",
      title: "1:1 Sync",
      date: new Date(2025, 11, 22, 16, 0),
      endDate: new Date(2025, 11, 22, 16, 30),
      type: "scheduled",
      participants: 2,
      status: "upcoming",
      timezone: "PST (UTC-8)",
    },
  ];

  // Calculate meetings count by date for the calendar
  const getMeetingCountByDate = (date: Date): number => {
    return upcomingMeetings.filter(
      (m) =>
        m.date.toDateString() === date.toDateString()
    ).length;
  };

  // Get meetings for selected date
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const meetingsForDate = upcomingMeetings.filter(
        (m) => m.date.toDateString() === date.toDateString()
      );
      setSelectedDateMeetings(meetingsForDate);
      if (meetingsForDate.length > 0) {
        setShowMeetingDetails(true);
      }
    }
  };

  const goToMeet = (identity: "anonymous" | "exposed") => {
    router.push(`/meet?identity=${identity}`);
  };

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-background">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between px-4 py-3 border-b border-border/50 bg-background">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your schedule and meetings
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="default" className="gap-2">
              <VideoIcon className="size-4" />
              New Meeting
              <ChevronDownIcon className="size-4 opacity-60" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={() => goToMeet("anonymous")} className="gap-3 py-2.5">
              <UsersIcon className="size-4 text-muted-foreground" />
              <div className="flex-1">
                <div className="font-medium text-sm">Anonymous Mode</div>
                <div className="text-xs text-muted-foreground">
                  Connect without showing identity
                </div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => goToMeet("exposed")} className="gap-3 py-2.5">
              <VideoIcon className="size-4 text-muted-foreground" />
              <div className="flex-1">
                <div className="font-medium text-sm">Exposed Mode</div>
                <div className="text-xs text-muted-foreground">
                  Connect with full profile visible
                </div>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-h-0 flex flex-col gap-3 p-4 overflow-y-auto">
        {/* Top Row: Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Total Meetings Card */}
          <div className="bg-card border border-border/50 rounded-xl p-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Meetings</span>
              <div className="p-2 bg-primary/10 rounded-lg">
                <VideoIcon className="size-4 text-primary" />
              </div>
            </div>
            <p className="text-2xl font-bold">{upcomingMeetings.length}</p>
            <p className="text-xs text-muted-foreground">Scheduled this month</p>
          </div>

          {/* This Week Card */}
          <div className="bg-card border border-border/50 rounded-xl p-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">This Week</span>
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <CalendarIcon className="size-4 text-blue-500" />
              </div>
            </div>
            <p className="text-2xl font-bold">
              {upcomingMeetings.filter((m) => {
                const now = new Date();
                const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
                return m.date >= now && m.date <= weekFromNow;
              }).length}
            </p>
            <p className="text-xs text-muted-foreground">Upcoming meetings</p>
          </div>

          {/* Timezone Card */}
          <div className="bg-card border border-border/50 rounded-xl p-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Timezone</span>
              <div className="p-2 bg-green-500/10 rounded-lg">
                <GlobeIcon className="size-4 text-green-500" />
              </div>
            </div>
            <p className="text-lg font-semibold">{userTimezone}</p>
            <p className="text-xs text-muted-foreground">All times in local timezone</p>
          </div>

          {/* Next Meeting Card */}
          <div className="bg-card border border-border/50 rounded-xl p-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Next Meeting</span>
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <ClockIcon className="size-4 text-orange-500" />
              </div>
            </div>
            {upcomingMeetings[0] ? (
              <>
                <p className="text-lg font-semibold truncate">{upcomingMeetings[0].title}</p>
                <p className="text-xs text-muted-foreground">
                  {format(upcomingMeetings[0].date, "MMM d, HH:mm")}
                </p>
              </>
            ) : (
              <>
                <p className="text-lg font-semibold">No meetings</p>
                <p className="text-xs text-muted-foreground">You're all caught up!</p>
              </>
            )}
          </div>
        </div>

        {/* Middle Row: Calendar + Upcoming */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Mini Calendar */}
          <div className="lg:col-span-1 bg-card border border-border/50 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border/50">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <CalendarIcon className="size-4 text-primary" />
                Calendar
              </h3>
            </div>
            <div className="p-4 flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                className="[--cell-size:2.25rem]"
                modifiers={{
                  hasEvent: (date) => getMeetingCountByDate(date) > 0,
                }}
                modifiersStyles={{
                  hasEvent: {
                    color: "hsl(var(--primary))",
                    fontWeight: "bold",
                  },
                }}
              />
            </div>
          </div>

          {/* Upcoming Meetings */}
          <div className="lg:col-span-2 bg-card border border-border/50 rounded-xl overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <ClockIcon className="size-4 text-primary" />
                Upcoming Meetings
              </h3>
              <Badge variant="secondary" className="text-xs">
                {upcomingMeetings.length} total
              </Badge>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {upcomingMeetings.slice(0, 6).map((meeting) => (
                  <div 
                    key={meeting.id} 
                    className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors border border-transparent hover:border-border/50"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="font-medium text-sm text-foreground truncate">{meeting.title}</p>
                      <Badge variant="outline" className="capitalize text-xs shrink-0">
                        {meeting.type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CalendarIcon className="size-3" />
                      <span>{format(meeting.date, "MMM d, HH:mm")}</span>
                      {meeting.participants && (
                        <>
                          <span className="text-border">•</span>
                          <UsersIcon className="size-3" />
                          <span>{meeting.participants}</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
                {upcomingMeetings.length === 0 && (
                  <div className="col-span-2 text-center py-8">
                    <p className="text-sm text-muted-foreground">No upcoming meetings</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row: Gantt Chart */}




        {/* Selected Date Meetings Details */}
        {selectedDate && selectedDateMeetings.length > 0 && (
          <div className="bg-card border border-border/50 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <CalendarIcon className="size-4 text-primary" />
                {selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </h3>
              <Badge variant="secondary" className="text-xs">
                {selectedDateMeetings.length} meeting{selectedDateMeetings.length !== 1 ? "s" : ""}
              </Badge>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {selectedDateMeetings.map((meeting) => (
                  <div
                    key={meeting.id}
                    className="p-4 bg-muted/50 border border-border/50 rounded-lg hover:bg-muted transition-colors"
                  >
                    <p className="font-medium text-sm text-foreground truncate mb-1">{meeting.title}</p>
                    <p className="text-muted-foreground text-xs mb-2">
                      {format(meeting.date, "HH:mm")} - {format(meeting.endDate, "HH:mm")}
                    </p>
                    <Badge variant="outline" className="capitalize text-xs">
                      {meeting.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Meeting Details Dialog */}
      <Dialog open={showMeetingDetails} onOpenChange={setShowMeetingDetails}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Meetings on {selectedDate?.toLocaleDateString()}</DialogTitle>
            <DialogDescription>
              Click a meeting to view details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {selectedDateMeetings.length > 0 ? (
              selectedDateMeetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="p-3 bg-secondary/50 rounded-lg space-y-2 cursor-pointer hover:bg-secondary transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">{meeting.title}</p>
                    <Badge variant="outline" className="capitalize text-xs">
                      {meeting.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {format(meeting.date, "HH:mm")} - {format(meeting.endDate, "HH:mm")}
                  </p>
                  {meeting.participants && (
                    <p className="text-xs text-muted-foreground">
                      {meeting.participants} participants
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No meetings scheduled</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={showProfileCompleteDialog} onOpenChange={setShowProfileCompleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Complete Your Profile</DialogTitle>
            <DialogDescription>
              To help us find the best matches for you, please complete your profile with your skills and preferences.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <UsersIcon className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Better Matches</p>
                <p className="text-sm text-muted-foreground">
                  Get matched with developers who share your interests.
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowProfileCompleteDialog(false)}>
              Remind me later
            </Button>
            <Button onClick={handleCompleteProfile}>
              Complete Profile
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
