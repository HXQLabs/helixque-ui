"use client";

import * as React from "react";
import { useMemo } from "react";
import { useNavigation } from "@/contexts/navigation-context";
import {
  IconPhoneCall,
  IconMessage,
  IconDotsVertical,
  IconUserMinus,
  IconCheck,
  IconX,
  IconUserPlus,
  IconShield,
  IconFlag,
  IconSearch,
  IconChevronLeft,
  IconChevronRight,
  IconCircleCheckFilled,
  IconLoader,
} from "@tabler/icons-react";
import { Button } from "@workspace/ui/components/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { Input } from "@workspace/ui/components/input";
import { LoaderIcon } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { useHelixque } from "@workspace/state";

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <LoaderIcon
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  );
}

function SpinnerCustom() {
  return (
    <div className="flex items-center gap-4">
      <Spinner />
    </div>
  );
}

// Mock data - with more records for pagination
const generateMockFriends = () => {
  const names = [
    "Sarah",
    "John",
    "Emma",
    "Michael",
    "Jessica",
    "David",
    "Alex",
    "Lisa",
    "Mark",
    "Sophie",
    "James",
    "Rachel",
    "Daniel",
    "Nina",
    "Chris",
  ];
  const surnames = [
    "Anderson",
    "Doe",
    "Wilson",
    "Chen",
    "Brown",
    "Martinez",
    "Thompson",
    "Wong",
    "Johnson",
    "Laurent",
    "Smith",
    "Davis",
    "Miller",
    "Taylor",
    "White",
  ];
  const statuses = ["online", "offline"];
  const availabilities = ["available", "busy"];

  const friends = [];
  for (let i = 1; i <= 30; i++) {
    friends.push({
      id: i,
      name: `${names[Math.floor(Math.random() * names.length)]} ${surnames[Math.floor(Math.random() * surnames.length)]}`,
      displayName: `@user${i}`,
      avatar: `https://github.com/shadcn.png`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      availability:
        availabilities[Math.floor(Math.random() * availabilities.length)],
      lastSeen: ["Active now", "2 hours ago", "Yesterday", "2 days ago"][
        Math.floor(Math.random() * 4)
      ],
    });
  }
  return friends;
};

const mockFriendsData = {
  friends: generateMockFriends(),
  sent: [
    {
      id: 101,
      name: "Alex Thompson",
      displayName: "@alexthompson",
      avatar: "https://github.com/tailwindlabs.png",
      status: "online",
      availability: "available",
      sentAt: "2 days ago",
    },
    {
      id: 102,
      name: "Lisa Wong",
      displayName: "@lisawong",
      avatar: "https://github.com/vercel.png",
      status: "offline",
      availability: "available",
      sentAt: "1 week ago",
    },
  ],
  received: [
    {
      id: 201,
      name: "Mark Johnson",
      displayName: "@markj",
      avatar: "https://github.com/nextjs.png",
      status: "online",
      availability: "available",
      receivedAt: "3 hours ago",
    },
    {
      id: 202,
      name: "Sophie Laurent",
      displayName: "@sophie",
      avatar: "https://github.com/shadcn.png",
      status: "offline",
      availability: "available",
      receivedAt: "1 day ago",
    },
  ],
};

type TabType = "friends" | "sent" | "received";

// Fuzzy search function
function fuzzySearch(haystack: string, needle: string): boolean {
  let haystackIdx = 0;
  let needleIdx = 0;
  const haystackLen = haystack.length;
  const needleLen = needle.length;

  if (needleLen > haystackLen) return false;
  if (needleLen === haystackLen) return haystack === needle;

  outer: while (needleIdx < needleLen) {
    const needleChar = needle[needleIdx]!;
    while (haystackIdx < haystackLen) {
      const haystackChar = haystack[haystackIdx]!;
      if (haystackChar.toLowerCase() === needleChar.toLowerCase()) {
        haystackIdx++;
        needleIdx++;
        continue outer;
      }
      haystackIdx++;
    }
    return false;
  }
  return true;
}

interface Friend {
  id: number;
  name: string;
  displayName: string;
  avatar: string;
  status?: string;
  availability?: string;
  lastSeen?: string;
  sentAt?: string;
  receivedAt?: string;
}

interface FriendCardProps {
  friend: Friend;
  type: TabType;
  isLoading?: boolean;
  onAction?: (id: number, action: string) => void;
}

function FriendCard({ friend, type, onAction }: FriendCardProps) {
  const isOnline = friend.status === "online";
  const isBusy = friend.availability === "busy";

  const renderActions = () => {
    if (type === "friends") {
      return (
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" className="h-8 px-2" title="Call">
            <IconPhoneCall className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 px-2"
            title="Message"
          >
            <IconMessage className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <IconDotsVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={() => onAction?.(friend.id, "unfriend")}
                className="text-destructive"
              >
                <IconUserMinus className="h-4 w-4 mr-2" />
                <span>Unfriend</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onAction?.(friend.id, "block")}
                className="text-destructive"
              >
                <IconShield className="h-4 w-4 mr-2" />
                <span>Block</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onAction?.(friend.id, "report")}
                className="text-destructive"
              >
                <IconFlag className="h-4 w-4 mr-2" />
                <span>Report</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    }

    if (type === "sent") {
      return (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="h-8 px-3 text-xs"
            onClick={() => onAction?.(friend.id, "cancel")}
          >
            Cancel
          </Button>
        </div>
      );
    }

    if (type === "received") {
      return (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="h-8 px-3 text-xs"
            onClick={() => onAction?.(friend.id, "accept")}
          >
            <IconCheck className="h-3.5 w-3.5 mr-1" />
            Accept
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => onAction?.(friend.id, "decline")}
          >
            <IconX className="h-4 w-4" />
          </Button>
        </div>
      );
    }
  };

  const renderMeta = () => {
    if (type === "friends") {
      return (
        <div className="flex items-center gap-2 mt-1">
          {isOnline ? (
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-xs">
              <IconCircleCheckFilled className="h-3 w-3 fill-green-500 text-green-500" />
              <span>{isBusy ? "Busy" : "Available"}</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-xs text-muted-foreground">
              <IconLoader className="h-3 w-3 fill-gray-400 text-gray-400" />
              <span>Offline</span>
            </div>
          )}
          <span className="text-xs text-muted-foreground">
            {friend.lastSeen}
          </span>
        </div>
      );
    }

    if (type === "sent") {
      return (
        <div className="text-xs text-muted-foreground mt-1">
          Sent {friend.sentAt}
        </div>
      );
    }

    if (type === "received") {
      return (
        <div className="text-xs text-muted-foreground mt-1">
          Requested {friend.receivedAt}
        </div>
      );
    }
  };

  return (
    <div className="flex items-center justify-between gap-4 p-3 md:p-4 rounded-xl bg-card/60 backdrop-blur-sm hover:bg-card/80 hover:shadow-sm transition-all duration-200 border border-border/40 hover:border-border/60 hover:scale-[1.01] active:scale-[0.99]">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="relative flex-shrink-0">
          <Avatar className="h-11 w-11 ring-1 ring-border/50 transition-all group-hover:ring-primary/30">
            <AvatarImage
              src={friend.avatar}
              alt={friend.name}
              className="object-cover"
            />
            <AvatarFallback className="text-sm font-medium bg-gradient-to-br from-primary/10 to-primary/5">
              {friend.name
                .split(" ")
                .map((n: string) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          {isOnline && (
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-background" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm leading-tight text-foreground/90">
            {friend.name}
          </h3>
          <p className="text-xs text-muted-foreground/80 truncate">
            {friend.displayName}
          </p>
          <div className="mt-1">{renderMeta()}</div>
        </div>
      </div>

      <div className="flex-shrink-0">{renderActions()}</div>
    </div>
  );
}

export default function FriendsPage() {
  const { setActiveSection } = useNavigation();
  const {
    activeTab,
    searchQuery,
    currentPage,
    isLoading,
    setActiveTab,
    setSearchQuery,
    setCurrentPage,
    setIsLoading,
  } = useHelixque();
  const itemsPerPage = 6;

  React.useEffect(() => {
    setActiveSection("Friends", null);
  }, [setActiveSection]);

  React.useEffect(() => {
    // Simulate lazy loading when tab changes
    setIsLoading(true);
    setCurrentPage(1);
    setSearchQuery("");

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [activeTab]);

  const handleAction = (id: number, action: string) => {
    console.log(`Action: ${action} on user ${id}`);
    // Implement actual actions here
  };

  const getTabs = () => {
    return [
      {
        id: "friends" as TabType,
        label: "Friends",
        count: mockFriendsData.friends.length,
        data: mockFriendsData.friends,
      },
      {
        id: "sent" as TabType,
        label: "Sent Requests",
        count: mockFriendsData.sent.length,
        data: mockFriendsData.sent,
      },
      {
        id: "received" as TabType,
        label: "Incoming Requests",
        count: mockFriendsData.received.length,
        data: mockFriendsData.received,
      },
    ];
  };

  const tabs = getTabs();
  // Move currentTabData inside useMemo
  const filteredData = useMemo(() => {
    const currentTabData = tabs.find((t) => t.id === activeTab)?.data || [];
    if (!searchQuery.trim()) return currentTabData;
    return currentTabData.filter((friend) =>
      fuzzySearch(
        `${friend.name} ${friend.displayName}`.toLowerCase(),
        searchQuery.toLowerCase(),
      ),
    );
  }, [tabs, activeTab, searchQuery]);

  // Paginate filtered data
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    return filteredData.slice(startIdx, endIdx);
  }, [filteredData, currentPage]);

  return (
    <div className="flex h-[90vh] overflow-hidden bg-background/95 backdrop-blur-sm gap-0 md:gap-3">
      <div className="w-full flex flex-col bg-card/50 backdrop-blur-xl overflow-hidden md:rounded-xl shadow-sm transition-all duration-300">
        {/* Header */}
        <div className="border-b border-border/40 p-3 md:p-5 space-y-3 md:space-y-4 flex-shrink-0 bg-gradient-to-b from-background/80 to-transparent">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Friends
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Connect with friends and manage your network
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-muted/30 p-1 rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  {tab.label}
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full ${
                      activeTab === tab.id
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {tab.count}
                  </span>
                </span>
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative group">
            <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground/70 transition-colors group-hover:text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search friends..."
              className="pl-9 pr-4 text-sm h-10 bg-background/60 border-border/50 focus:bg-background transition-colors placeholder:text-muted-foreground/50"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 [scrollbar-width:thin] [scrollbar-color:hsl(var(--muted))_transparent]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <SpinnerCustom />
              <p className="text-sm text-muted-foreground mt-4">
                Loading friends...
              </p>
            </div>
          ) : paginatedData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <IconUserPlus className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <h3 className="font-semibold text-muted-foreground">
                {searchQuery
                  ? "No results found"
                  : activeTab === "friends"
                    ? "No friends yet"
                    : activeTab === "sent"
                      ? "No pending requests"
                      : "No incoming requests"}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {searchQuery
                  ? "Try adjusting your search"
                  : activeTab === "friends"
                    ? "Start connecting with people to see them here"
                    : activeTab === "sent"
                      ? "All your requests have been responded to"
                      : "You're all caught up!"}
              </p>
            </div>
          ) : (
            <>
              {paginatedData.map((friend) => (
                <FriendCard
                  key={friend.id}
                  friend={friend}
                  type={activeTab}
                  onAction={handleAction}
                />
              ))}
            </>
          )}
        </div>

        {/* Pagination */}
        {!isLoading && filteredData.length > 0 && (
          <div className="border-t border-border/40 p-3 md:p-4 flex items-center flex-shrink-0 bg-gradient-to-t from-background/80 to-transparent">
            <div className="flex-1"></div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <IconChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>

              <div className="px-3 py-1 text-sm font-medium">
                Page {currentPage} of {totalPages || 1}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage >= totalPages}
              >
                Next
                <IconChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>

            <div className="flex-1 flex justify-end">
              <div className="text-sm text-muted-foreground">
                Showing{" "}
                {Math.min(
                  (currentPage - 1) * itemsPerPage + 1,
                  filteredData.length,
                )}{" "}
                to {Math.min(currentPage * itemsPerPage, filteredData.length)}{" "}
                of {filteredData.length}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
