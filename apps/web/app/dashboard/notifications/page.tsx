"use client";

import * as React from "react";
import {
  Bell,
  Check,
  UserPlus,
  Briefcase,
  MessageCircle,
  Clock,
  Settings,
} from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@workspace/ui/components/avatar";
import { toast } from "sonner";
import { cn } from "@workspace/ui/lib/utils";

interface NotificationItem {
    id: number;
    type: string;
    title: string;
    description: string;
    time: string;
    read: boolean;
    user?: { name: string; avatar: string };
    actionRequired?: boolean;
    icon?: any;
}

// Mock Data
const NOTIFICATIONS: NotificationItem[] = [
  {
    id: 1,
    type: "connect",
    title: "Connection Request",
    description: "Sarah Connor wants to connect with you.",
    time: "2 min ago",
    read: false,
    user: { name: "Sarah Connor", avatar: "https://avatar.vercel.sh/sarah" },
    actionRequired: true,
  },
  {
    id: 2,
    type: "job",
    title: "New Job Match",
    description: "A new 'Senior React Developer' role matches your profile.",
    time: "1 hour ago",
    read: false,
    icon: Briefcase,
  },
  {
    id: 3,
    type: "message",
    title: "New Message",
    description: "TechFlow Systems: 'Hi, we received your application...'",
    time: "3 hours ago",
    read: true,
    user: { name: "TechFlow", avatar: "https://avatar.vercel.sh/techflow" },
  },
  {
    id: 4,
    type: "system",
    title: "Profile Viewed",
    description: "Your profile appeared in 12 searches this week.",
    time: "1 day ago",
    read: true,
    icon: TrendingUpIcon,
  },
];

function TrendingUpIcon(props: any) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = React.useState(NOTIFICATIONS);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const handleAction = (id: number, action: string) => {
      toast.success(`${action} request.`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, actionRequired: false, read: true } : n));
  }

  return (
    <div className="flex flex-col gap-6 p-6 max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
            <p className="text-muted-foreground">
            Stay updated with your latest activity.
            </p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={markAllRead}>
                <Check className="mr-2 h-4 w-4" /> Mark all read
            </Button>
            <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
            </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
         {notifications.map((notification) => (
             <div 
                key={notification.id} 
                className={cn(
                    "flex gap-4 p-4 rounded-lg border transition-colors",
                    notification.read ? "bg-background" : "bg-muted/30 border-primary/20"
                )}
             >
                <div className="mt-1">
                    {notification.user ? (
                        <Avatar>
                            <AvatarImage src={notification.user.avatar} />
                            <AvatarFallback>{notification.user.name[0]}</AvatarFallback>
                        </Avatar>
                    ) : (
                        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                            {notification.icon ? <notification.icon className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
                        </div>
                    )}
                </div>
                <div className="flex-1 flex flex-col gap-1">
                    <div className="flex justify-between items-start">
                        <p className="text-sm font-medium leading-none">
                            {notification.title}
                            {!notification.read && <span className="ml-2 inline-block h-2 w-2 rounded-full bg-primary" />}
                        </p>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {notification.time}
                        </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.description}</p>
                    
                    {notification.actionRequired && (
                        <div className="flex gap-2 mt-2">
                            <Button size="sm" onClick={() => handleAction(notification.id, "Accepted")}>Accept</Button>
                            <Button size="sm" variant="outline" onClick={() => handleAction(notification.id, "Declined")}>Decline</Button>
                        </div>
                    )}
                </div>
             </div>
         ))}
      </div>
    </div>
  );
}
