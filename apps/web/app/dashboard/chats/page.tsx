"use client";

import * as React from "react";
import { useEffect, useRef, useCallback } from "react";
import { MessageCircle, Search, Send } from "lucide-react";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@workspace/ui/components/avatar";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { useHelixque } from "@workspace/state";

// Generate mock chats with proper avatars and data like friends page
const generateMockChats = () => {
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

  const chats = [];
  for (let i = 1; i <= 20; i++) {
    const name = `${names[Math.floor(Math.random() * names.length)]} ${surnames[Math.floor(Math.random() * surnames.length)]}`;
    chats.push({
      id: i,
      name: name,
      displayName: `@user${i}`,
      avatar: `https://github.com/shadcn.png`,
      lastMessage: [
        "That sounds great! When do you want to meet?",
        "I'll send you the files tomorrow",
        "Let's catch up soon!",
        "Thanks for the update",
        "Perfect, see you then",
        "How's everything going?",
        "Can't wait to hear from you",
        "Let me know what you think",
      ][Math.floor(Math.random() * 8)],
      timestamp: [
        "2 min ago",
        "1 hour ago",
        "3 hours ago",
        "Yesterday",
        "2 days ago",
      ][Math.floor(Math.random() * 5)],
      messages: [
        {
          id: 1,
          sender: name,
          text: "Hey! How are you doing?",
          timestamp: "10:30 AM",
        },
        {
          id: 2,
          sender: "You",
          text: "I'm doing great! How about you?",
          timestamp: "10:32 AM",
        },
        {
          id: 3,
          sender: name,
          text: "That sounds great! When do you want to meet?",
          timestamp: "10:35 AM",
        },
        {
          id: 4,
          sender: "You",
          text: "How about this weekend?",
          timestamp: "10:37 AM",
        },
        {
          id: 5,
          sender: name,
          text: "This weekend works perfectly for me!",
          timestamp: "10:38 AM",
        },
        {
          id: 6,
          sender: "You",
          text: "Great! Let's meet at the coffee shop at 2 PM",
          timestamp: "10:40 AM",
        },
        {
          id: 7,
          sender: name,
          text: "Perfect! I'll see you there",
          timestamp: "10:41 AM",
        },
        {
          id: 8,
          sender: "You",
          text: "Can't wait! Should I bring anything?",
          timestamp: "10:42 AM",
        },
        {
          id: 9,
          sender: name,
          text: "No need, just bring yourself! 😊",
          timestamp: "10:43 AM",
        },
        {
          id: 10,
          sender: "You",
          text: "Sounds good. See you soon!",
          timestamp: "10:44 AM",
        },
        { id: 11, sender: name, text: "See you!", timestamp: "10:45 AM" },
        {
          id: 12,
          sender: "You",
          text: "Actually, do you like cappuccino or americano?",
          timestamp: "10:46 AM",
        },
        {
          id: 13,
          sender: name,
          text: "I prefer cappuccino with an extra shot",
          timestamp: "10:47 AM",
        },
        {
          id: 14,
          sender: "You",
          text: "Got it! I'll make sure to order that for you",
          timestamp: "10:48 AM",
        },
        {
          id: 15,
          sender: name,
          text: "You're amazing! Thank you",
          timestamp: "10:49 AM",
        },
        {
          id: 16,
          sender: "You",
          text: "My pleasure! See you at 2 PM",
          timestamp: "10:50 AM",
        },
        {
          id: 17,
          sender: name,
          text: "Looking forward to it!",
          timestamp: "10:51 AM",
        },
        {
          id: 18,
          sender: "You",
          text: "Me too! It's been a while since we caught up",
          timestamp: "10:52 AM",
        },
        {
          id: 19,
          sender: name,
          text: "I know right? We need to do this more often",
          timestamp: "10:53 AM",
        },
        {
          id: 20,
          sender: "You",
          text: "Absolutely! Let's make it a monthly thing",
          timestamp: "10:54 AM",
        },
      ],
    });
  }
  return chats;
};

const allChats = generateMockChats();

export default function ChatsPage() {
  const {
    loadingOlderMessages,
    searchQuery,
    isLoadingMore,
    selectedChat,
    displayedChats,
    setLoadingOlderMessages,
    setSearchQuery,
    setIsLoadingMore,
    setSelectedChat,
    setDisplayedChats,
  } = useHelixque();

  useEffect(() => {
    setDisplayedChats(allChats.slice(0, 10));
  }, [setDisplayedChats]);
  const chatListRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const loadMoreTimerRef = useRef<NodeJS.Timeout | null>(null);
  const messagesTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Handle chat list scroll for lazy loading
  const handleScroll = useCallback(() => {
    if (!chatListRef.current || isLoadingMore) return;

    const { scrollTop, scrollHeight, clientHeight } = chatListRef.current;
    if (scrollHeight - scrollTop <= clientHeight + 100) {
      setIsLoadingMore(true);
      loadMoreTimerRef.current = setTimeout(() => {
        setDisplayedChats((prev) => {
          const newCount = Math.min(prev.length + 10, allChats.length);
          return allChats.slice(0, newCount);
        });
        setIsLoadingMore(false);
      }, 300);
    }
  }, [isLoadingMore]);

  // Handle messages scroll for lazy loading older messages
  const handleMessagesScroll = useCallback(() => {
    if (!messagesRef.current || loadingOlderMessages) return;

    const { scrollTop } = messagesRef.current;
    // When user scrolls up to the top (near 0), load older messages
    if (scrollTop < 100) {
      setLoadingOlderMessages(true);
      messagesTimerRef.current = setTimeout(() => {
        // Simulate loading older messages (in real app, fetch from backend)
        setLoadingOlderMessages(false);
      }, 1000);
    }
  }, [loadingOlderMessages]);

  useEffect(() => {
    return () => {
      if (loadMoreTimerRef.current) clearTimeout(loadMoreTimerRef.current);
      if (messagesTimerRef.current) clearTimeout(messagesTimerRef.current);
    };
  }, []);

  // Filter chats based on search
  const filteredChats = searchQuery.trim()
    ? displayedChats.filter(
        (chat) =>
          chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          chat.displayName.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : displayedChats;

  return (
    <div className="flex h-[90vh] overflow-hidden bg-background gap-0 md:gap-4">
      {/* Chat List - Left Side */}
      <div
        className={`w-full md:w-80 flex flex-col bg-card overflow-hidden border-r transition-all duration-300 ${selectedChat ? "hidden md:flex" : "flex"}`}
      >
        <div className="border-b p-2 md:p-4 space-y-2 md:space-y-3 flex-shrink-0">
          <h2 className="text-base md:text-lg font-semibold px-1">Chats</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
            <Input
              placeholder="Search chats..."
              className="pl-8 md:pl-9 text-xs md:text-sm h-7 md:h-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Scrollable Chat List - Fixed height for 10 items */}
        <div
          ref={chatListRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto space-y-1 p-2 [mask-image:linear-gradient(to_bottom,black_0%,black_85%,transparent_100%)] [scrollbar-width:none] [-webkit-scrollbar:none]"
          style={{
            msOverflowStyle: "none",
          }}
        >
          {filteredChats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={`w-full flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-lg transition-all text-left ${
                selectedChat?.id === chat.id ? "bg-accent" : "hover:bg-muted/50"
              }`}
            >
              <Avatar className="h-8 w-8 md:h-10 md:w-10 flex-shrink-0">
                <AvatarImage src={chat.avatar} alt={chat.name} />
                <AvatarFallback className="text-xs md:text-base">
                  {chat.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="text-xs md:text-sm font-medium truncate">
                  {chat.name}
                </h3>
                <p className="text-xs text-muted-foreground truncate">
                  {chat.lastMessage}
                </p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">
                {chat.timestamp}
              </span>
            </button>
          ))}
          {isLoadingMore && (
            <div className="flex justify-center py-2">
              <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          )}
        </div>
      </div>

      {/* Chat Window - Right Side */}
      <div
        className={`flex flex-1 flex-col bg-card overflow-hidden border border-border transition-all duration-300 ${selectedChat ? "flex" : "hidden md:flex"}`}
      >
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="border-b p-3 md:p-4 flex items-center gap-2 md:gap-3 flex-shrink-0">
              <button
                onClick={() => setSelectedChat(null)}
                className="md:hidden p-1 hover:bg-muted rounded-lg transition-colors"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <Avatar className="h-8 w-8 md:h-10 md:w-10">
                <AvatarImage
                  src={selectedChat.avatar}
                  alt={selectedChat.name}
                />
                <AvatarFallback>
                  {selectedChat.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-xs md:text-sm truncate">
                  {selectedChat.name}
                </h3>
                <p className="text-xs text-muted-foreground">Active now</p>
              </div>
            </div>

            {/* Messages - Scrollable */}
            <div
              ref={messagesRef}
              onScroll={handleMessagesScroll}
              className="flex-1 overflow-y-auto p-2 md:p-4 space-y-3 md:space-y-4"
            >
              {loadingOlderMessages && (
                <div className="flex justify-center py-4">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                    <span className="text-xs text-muted-foreground">
                      Loading older messages...
                    </span>
                  </div>
                </div>
              )}
              {selectedChat?.messages.map((message: any) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "You" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs px-3 py-2 md:px-4 md:py-2 rounded-lg text-sm md:text-base ${
                      message.sender === "You"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input - Sticky */}
            <div className="border-t p-2 md:p-4 flex gap-2 bg-card flex-shrink-0">
              <Input
                placeholder="Type a message..."
                className="flex-1 text-sm md:text-base h-8 md:h-10"
              />
              <Button size="sm" className="px-2 md:px-3 h-8 md:h-10">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-2">
              <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground/50" />
              <p className="text-muted-foreground">
                Select a chat to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
