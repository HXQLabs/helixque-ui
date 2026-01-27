"use client";

import React, { useState, useEffect } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { Badge } from "@workspace/ui/components/badge";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import {
  Search,
  UserPlus,
  Users,
  MessageSquare,
  Check,
  X,
  Clock,
  Loader2,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const BACKEND_URI =
  process.env.NEXT_PUBLIC_BACKEND_URI || "http://localhost:4001";

export default function SocialsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("search");
  const [loading, setLoading] = useState(false);

  // Data States
  const [friends, setFriends] = useState<any[]>([]); // Deprecated for now
  const [requestsReceived, setRequestsReceived] = useState<any[]>([]); // Deprecated for now
  const [requestsSent, setRequestsSent] = useState<any[]>([]); // Deprecated for now
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const userId = session?.user?.id;

  // --- FETCHERS ---
  const performSearch = async () => {
    if (!userId) return;

    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const endpoint = `${BACKEND_URI}/socials/search?query=${searchQuery}&userId=${userId}`;

      const res = await fetch(endpoint);
      const data = await res.json();
      if (Array.isArray(data)) setSearchResults(data);
    } catch (e) {
      toast.error("Search failed");
    } finally {
      setLoading(false);
    }
  };

  // --- ACTIONS ---
  const handleSendRequest = async (targetId: string) => {
    toast("Connection features are coming soon!", {
      description: "We are upgrading our social graph database.",
      icon: <Clock className="w-4 h-4 text-orange-500" />,
    });
  };

  const startChat = (friendshipId: string, friendId: string) => {
    // router.push(`/dashboard/chat/${friendshipId}`);
    toast("Chat is under maintenance", {
      description: "We are improving messaging reliability.",
    });
  };

  // History State
  const [history, setHistory] = useState<any[]>([]);

  // Debounce Search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim()) {
        performSearch();
      } else {
        setSearchResults([]);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Load History
  useEffect(() => {
    const saved = localStorage.getItem("helixque_search_history");
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const addToHistory = (user: any) => {
    const newHistory = [user, ...history.filter((u) => u.id !== user.id)].slice(
      0,
      10,
    ); // Keep last 10
    setHistory(newHistory);
    localStorage.setItem("helixque_search_history", JSON.stringify(newHistory));
    router.push(`/dashboard/profile/${user.id}`);
  };

  const removeFromHistory = (e: React.MouseEvent, userId: string) => {
    e.stopPropagation();
    const newHistory = history.filter((u) => u.id !== userId);
    setHistory(newHistory);
    localStorage.setItem("helixque_search_history", JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("helixque_search_history");
  };

  // --- EFFECTS ---
  useEffect(() => {
    // if (activeTab === 'friends') fetchFriends(); // Disabled
    // if (activeTab === 'requests') fetchRequests(); // Disabled
    // if (activeTab === 'search') performSearch(); // Debounced now
  }, [activeTab, userId]);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] p-4 gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Socials</h1>
          <p className="text-muted-foreground">
            Connect with professionals and friends.
          </p>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col"
      >
        <div className="flex items-center justify-between border-b pb-2">
          <TabsList className="bg-transparent p-0 gap-2">
            <TabsTrigger
              value="friends"
              className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-full px-4"
            >
              <Users className="w-4 h-4 mr-2" />
              Friends
              {friends.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 min-w-5 px-1">
                  {friends.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="requests"
              className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-full px-4 relative"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Requests
              {requestsReceived.length > 0 && (
                <Badge
                  variant="destructive"
                  className="ml-2 h-5 min-w-5 px-1 animate-pulse"
                >
                  {requestsReceived.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="search"
              className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-full px-4"
            >
              <Search className="w-4 h-4 mr-2" />
              Find People
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 mt-4 overflow-hidden relative">
          {/* FRIENDS TAB */}
          {/* FRIENDS TAB - DISABLED */}
          <TabsContent
            value="friends"
            className="h-full m-0 absolute inset-0 flex flex-col items-center justify-center text-center p-8"
          >
            <div className="bg-primary/5 p-4 rounded-full mb-4">
              <Clock className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Connections are upgrading</h3>
            <p className="text-muted-foreground max-w-sm mt-2">
              We are moving to a graph database to support millions of
              connections. Access to your friends list will return soon.
            </p>
            <Button
              variant="outline"
              className="mt-6"
              onClick={() => setActiveTab("search")}
            >
              Find People
            </Button>
          </TabsContent>

          {/* REQUESTS TAB - DISABLED */}
          <TabsContent
            value="requests"
            className="h-full m-0 absolute inset-0 flex flex-col items-center justify-center text-center p-8"
          >
            <div className="bg-primary/5 p-4 rounded-full mb-4">
              <Clock className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Requests Paused</h3>
            <p className="text-muted-foreground max-w-sm mt-2">
              Connection requests are temporarily paused while we upgrade our
              infrastructure.
            </p>
          </TabsContent>

          {/* SEARCH TAB */}
          <TabsContent
            value="search"
            className="h-full m-0 flex flex-col gap-4 absolute inset-0"
          >
            <div className="flex gap-2">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, role, or skill..."
                  className="pl-9 h-10 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {loading && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                )}
              </div>
            </div>

            <ScrollArea className="flex-1 pr-4">
              {!searchQuery && history.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3 px-1">
                    <h3 className="font-semibold text-sm text-foreground">
                      Recent
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 text-blue-500 hover:text-blue-600 text-xs"
                      onClick={clearHistory}
                    >
                      Clear All
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {history.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-md cursor-pointer group"
                        onClick={() => addToHistory(user)} // Updates order and navigates
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.imageUrl} />
                          <AvatarFallback>{user.username?.[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {user.username}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {user.role}
                          </p>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => removeFromHistory(e, user.id)}
                        >
                          <X className="w-3 h-3 text-muted-foreground" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {searchResults.length === 0 && !loading && !searchQuery ? (
                history.length === 0 && (
                  <div className="text-center py-20 flex flex-col items-center justify-center text-muted-foreground h-full">
                    <Search className="w-12 h-12 mb-4 opacity-20" />
                    <p className="text-lg font-medium text-foreground">
                      Search for people
                    </p>
                    <p className="text-sm">Type a name to live search...</p>
                  </div>
                )
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {searchResults.map((user) => (
                    <Card
                      key={user.id}
                      className="group overflow-hidden hover:shadow-md transition-all cursor-pointer"
                      onClick={() => addToHistory(user)}
                    >
                      <div className="h-16 bg-gradient-to-r from-blue-500/10 to-indigo-500/10" />
                      <CardContent className="p-4 pt-0 relative">
                        <Avatar className="h-14 w-14 border-4 border-background absolute -top-7 left-4">
                          <AvatarImage src={user.imageUrl} />
                          <AvatarFallback>{user.username?.[0]}</AvatarFallback>
                        </Avatar>
                        <div className="mt-8">
                          <h4 className="font-semibold text-lg truncate">
                            {user.username}
                          </h4>
                          <p className="text-sm text-muted-foreground truncate">
                            {user.role}
                          </p>
                          <div className="flex gap-1 mt-2 flex-wrap">
                            <Badge
                              variant="secondary"
                              className="text-[10px] px-1 h-5"
                            >
                              {user.domain}
                            </Badge>
                          </div>
                          <Button
                            className="w-full mt-4 bg-primary/90 hover:bg-primary z-10 relative"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSendRequest(user.id);
                            }}
                          >
                            <UserPlus className="w-4 h-4 mr-2" /> Connect
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
