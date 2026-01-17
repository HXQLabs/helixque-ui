"use client";

import { useNavigation } from "@/contexts/navigation-context";
import * as React from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
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
  DialogFooter,
} from "@workspace/ui/components/dialog";
import {
  ChevronDownIcon,
  VideoIcon,
  UsersIcon,
  CalendarIcon,
  ClockIcon,
  GlobeIcon,
  Plus,
} from "lucide-react";
import { format } from "date-fns";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { toast } from "sonner";
import { Textarea } from "@workspace/ui/components/textarea";

interface Meeting {
  id: string;
  title: string;
  description?: string;
  startTime: string; // ISO string from API
  endTime: string; // ISO string from API
  type: string;
  status: string;
  participants: any[];
}

interface DashboardStats {
  meetingsCount: number;
  upcomingMeetingsCount: number;
  connectionsCount: number;
  profileViews: number;
}

export default function Page() {
  const { setActiveSection, setActiveSubSection } = useNavigation();
  const router = useRouter();
  const { data: session } = useSession();
  const userId = (session?.user as any)?.id;

  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());
  const [showMeetingDetails, setShowMeetingDetails] = React.useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = React.useState(false);
  
  const [stats, setStats] = React.useState<DashboardStats>({
    meetingsCount: 0,
    upcomingMeetingsCount: 0,
    connectionsCount: 0,
    profileViews: 0
  });
  const [meetings, setMeetings] = React.useState<Meeting[]>([]);
  const [selectedDateMeetings, setSelectedDateMeetings] = React.useState<Meeting[]>([]);

  // New Meeting Form State
  const [newMeeting, setNewMeeting] = React.useState({
    title: "",
    description: "",
    date: format(new Date(), "yyyy-MM-dd"),
    startTime: "09:00",
    endTime: "10:00",
  });

  // Initialize Breadcrumbs
  React.useEffect(() => {
    setActiveSection("Dashboard");
    setActiveSubSection("Overview");
  }, [setActiveSection, setActiveSubSection]);

  // Fetch Data
  React.useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URI || "http://localhost:4001";
        
        // Fetch Stats
        const statsRes = await fetch(`${backendUrl}/users/${userId}/stats`);
        if (statsRes.ok) {
          setStats(await statsRes.json());
        } else {
           throw new Error("Stats fetch failed");
        }

        // Fetch Meetings
        const meetingsRes = await fetch(`${backendUrl}/meetings/user/${userId}`);
        if (meetingsRes.ok) {
          const data = await meetingsRes.json();
          setMeetings(data);
        } else {
           throw new Error("Meetings fetch failed");
        }
      } catch (error) {
        console.warn("Backend unreachable, using mock data:", error);
        toast.error("Backend unavailable. Loading demo data.");
        
        // Mock Stats
        setStats({
          meetingsCount: 12,
          upcomingMeetingsCount: 3,
          connectionsCount: 45,
          profileViews: 128
        });

        // Mock Upcoming Meetings
        setMeetings([
            {
                id: "1",
                title: "Team Sync",
                startTime: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // Tomorrow
                endTime: new Date(Date.now() + 1000 * 60 * 60 * 25).toISOString(),
                type: "scheduled",
                status: "confirmed",
                participants: []
            },
             {
                id: "2",
                title: "Project Review",
                startTime: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(), // Day after tomorrow
                endTime: new Date(Date.now() + 1000 * 60 * 60 * 49).toISOString(),
                type: "scheduled",
                status: "confirmed",
                participants: []
            }
        ]);
      }
    };

    fetchData();
  }, [userId]);

  const upcomingMeetings = React.useMemo(() => {
    return meetings
      .filter(m => new Date(m.startTime) > new Date())
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }, [meetings]);

  // Calculate meetings count by date for the calendar
  const getMeetingCountByDate = (date: Date): number => {
    return meetings.filter(
      (m) => new Date(m.startTime).toDateString() === date.toDateString()
    ).length;
  };

  // Get meetings for selected date
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const meetingsForDate = meetings.filter(
        (m) => new Date(m.startTime).toDateString() === date.toDateString()
      );
      setSelectedDateMeetings(meetingsForDate);
      if (meetingsForDate.length > 0) {
        setShowMeetingDetails(true);
      }
    }
  };

  const handleCreateMeeting = async () => {
    if (!userId) return;

    try {
      const startDateTime = new Date(`${newMeeting.date}T${newMeeting.startTime}:00`);
      const endDateTime = new Date(`${newMeeting.date}T${newMeeting.endTime}:00`);

      if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
        toast.error("Invalid date or time selected");
        return;
      }

      if (endDateTime <= startDateTime) {
        toast.error("End time must be after start time");
        return;
      }

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URI || "http://localhost:4001";
      const res = await fetch(`${backendUrl}/meetings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newMeeting.title,
          description: newMeeting.description,
          startTime: startDateTime.toISOString(),
          endTime: endDateTime.toISOString(),
          hostId: userId,
          type: "scheduled"
        }),
      });

      if (!res.ok) throw new Error("Failed to create meeting");

      const createdMeeting = await res.json();
      setMeetings([...meetings, createdMeeting]);
      setShowScheduleDialog(false);
      toast.success("Meeting scheduled successfully!");
      
      // Reset form
      setNewMeeting({
        title: "",
        description: "",
        date: format(new Date(), "yyyy-MM-dd"),
        startTime: "09:00",
        endTime: "10:00",
      });

    } catch (error) {
      toast.error("Failed to schedule meeting");
      console.error(error);
    }
  };

  const goToMeet = (identity: "anonymous" | "exposed") => {
    router.push(`/meet?identity=${identity}`);
  };

  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

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
            <DropdownMenuItem onClick={() => setShowScheduleDialog(true)} className="gap-3 py-2.5">
              <Plus className="size-4 text-muted-foreground" />
              <div className="flex-1">
                <div className="font-medium text-sm">Schedule Meeting</div>
                <div className="text-xs text-muted-foreground">
                  Plan a future connection
                </div>
              </div>
            </DropdownMenuItem>
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
            <p className="text-2xl font-bold">{stats.meetingsCount}</p>
            <p className="text-xs text-muted-foreground">All time</p>
          </div>

          {/* This Week Card (Upcoming) */}
          <div className="bg-card border border-border/50 rounded-xl p-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Upcoming</span>
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <CalendarIcon className="size-4 text-blue-500" />
              </div>
            </div>
            <p className="text-2xl font-bold">{stats.upcomingMeetingsCount}</p>
            <p className="text-xs text-muted-foreground">Scheduled meetings</p>
          </div>

          {/* Timezone Card */}
          <div className="bg-card border border-border/50 rounded-xl p-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Timezone</span>
              <div className="p-2 bg-green-500/10 rounded-lg">
                <GlobeIcon className="size-4 text-green-500" />
              </div>
            </div>
            <p className="text-lg font-semibold truncate" title={userTimezone}>{userTimezone}</p>
            <p className="text-xs text-muted-foreground">Local timezone</p>
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
                  {format(new Date(upcomingMeetings[0].startTime), "MMM d, HH:mm")}
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
                      <span>{format(new Date(meeting.startTime), "MMM d, HH:mm")}</span>
                      {meeting.participants?.length > 0 && (
                        <>
                          <span className="text-border">•</span>
                          <UsersIcon className="size-3" />
                          <span>{meeting.participants.length}</span>
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
                      {format(new Date(meeting.startTime), "HH:mm")} - {format(new Date(meeting.endTime), "HH:mm")}
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
              Details for selected date
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
                    {format(new Date(meeting.startTime), "HH:mm")} - {format(new Date(meeting.endTime), "HH:mm")}
                  </p>
                  {meeting.description && <p className="text-xs text-muted-foreground">{meeting.description}</p>}
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No meetings scheduled</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Schedule Meeting Dialog */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Schedule Meeting</DialogTitle>
            <DialogDescription>
              Create a new scheduled meeting.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newMeeting.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                placeholder="Team Sync"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newMeeting.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewMeeting({ ...newMeeting, description: e.target.value })}
                placeholder="Meeting agenda..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newMeeting.date}
                  onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="grid gap-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={newMeeting.startTime}
                  onChange={(e) => setNewMeeting({ ...newMeeting, startTime: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={newMeeting.endTime}
                  onChange={(e) => setNewMeeting({ ...newMeeting, endTime: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
             <Button variant="outline" onClick={() => setShowScheduleDialog(false)}>Cancel</Button>
             <Button onClick={handleCreateMeeting}>Schedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
