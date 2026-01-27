"use client";

import React from "react";
import { Card } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import {
  Bell,
  Trash2,
  CheckCircle,
  UserPlus,
  MessageCircle,
  Info,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

type Notification = {
  id: string;
  type: "FRIEND_REQ" | "REQUEST_ACCEPTED" | "MESSAGE";
  message: string;
  read: boolean;
  createdAt: string;
  referenceId?: string;
};

const BACKEND_URI =
  process.env.NEXT_PUBLIC_BACKEND_URI || "http://localhost:4001";

export default function NotificationsPage() {
  const { data: session } = useSession();

  const {
    data: notifications,
    isLoading: loading,
    mutate,
  } = useSWR<Notification[]>(
    session?.user?.id
      ? `${BACKEND_URI}/notifications?userId=${session.user.id}`
      : null,
    fetcher,
    {
      fallbackData: [],
    },
  );

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      // Optimistic update
      mutate(
        (notifications || []).filter((n) => n.id !== id),
        false,
      );

      const res = await fetch(`${BACKEND_URI}/notifications/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Notification removed");
        mutate(); // Revalidate to be sure
      } else {
        throw new Error("Failed to delete");
      }
    } catch (e) {
      toast.error("Failed to delete");
      mutate(); // Revert on error
    }
  };

  const handleClearAll = async () => {
    if (!session?.user?.id) return;
    try {
      // Optimistic clear
      mutate([], false);

      const res = await fetch(`${BACKEND_URI}/notifications/all`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.id }),
      });
      if (res.ok) {
        toast.success("All notifications cleared");
        mutate();
      } else {
        throw new Error("Failed");
      }
    } catch (e) {
      toast.error("Failed to clear all");
      mutate(); // Revert
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "FRIEND_REQ":
        return <UserPlus className="w-5 h-5 text-blue-500" />;
      case "REQUEST_ACCEPTED":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "MESSAGE":
        return <MessageCircle className="w-5 h-5 text-purple-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] p-4 gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            Stay updated with your network.
          </p>
        </div>
        {notifications && notifications.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearAll}
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-2" /> Clear All
          </Button>
        )}
      </div>

      <Card className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-2">
            {loading ? (
              <div className="text-center py-10 text-muted-foreground">
                Loading...
              </div>
            ) : !notifications || notifications.length === 0 ? (
              <div className="text-center py-20 flex flex-col items-center gap-4 text-muted-foreground">
                <div className="p-4 bg-muted/50 rounded-full">
                  <Bell className="w-8 h-8 opacity-50" />
                </div>
                <p>No new notifications</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`flex items-start gap-4 p-4 rounded-lg transition-colors border ${notif.read ? "bg-background hover:bg-muted/50" : "bg-primary/5 border-primary/20 hover:bg-primary/10"}`}
                >
                  <div className="mt-1 shrink-0 p-2 bg-background rounded-full border shadow-sm">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0 pt-1">
                    <p className="text-sm font-medium leading-none mb-1">
                      {notif.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(notif.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-red-500 shrink-0"
                    onClick={(e) => handleDelete(notif.id, e)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}
