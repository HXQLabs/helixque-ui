"use client";

import * as React from "react";
import { useEffect, useRef, useCallback, useState, useMemo } from "react";
import {
  MessageCircle,
  Search,
  Send,
  Loader2,
  Paperclip,
  Smile,
  X,
} from "lucide-react";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@workspace/ui/components/avatar";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { useHelixque } from "@workspace/state";

// Constants
const INITIAL_LOAD_COUNT = 10;
const LOAD_MORE_COUNT = 10;
const INITIAL_LOAD_DELAY = 800;
const LAZY_LOAD_DELAY = 600;
const MESSAGE_LOAD_DELAY = 1200;
const SCROLL_THRESHOLD = 100;
const ANIMATION_STAGGER_DELAY = 30;

// Types
interface Chat {
  id: number;
  name: string;
  displayName: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount?: number;
  messages: Message[];
}

interface Message {
  id: number;
  sender: string;
  text: string;
  timestamp: string;
}

// Generate mock chats outside component - only once
const generateMockChats = (): Chat[] => {
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
  const lastMessages = [
    "That sounds great! When do you want to meet?",
    "I'll send you the files tomorrow",
    "Let's catch up soon!",
    "Thanks for the update",
    "Perfect, see you then",
    "How's everything going?",
    "Can't wait to hear from you",
    "Let me know what you think",
  ];
  const timestamps = [
    "2 min ago",
    "1 hour ago",
    "3 hours ago",
    "Yesterday",
    "2 days ago",
  ];

  return Array.from({ length: 20 }, (_, i) => {
    const name = `${names[Math.floor(Math.random() * names.length)]} ${surnames[Math.floor(Math.random() * surnames.length)]}`;
    const hasUnread = Math.random() > 0.7;

    return {
      id: i + 1,
      name,
      displayName: `@user${i + 1}`,
      avatar: `https://github.com/shadcn.png`,
      lastMessage:
        lastMessages[Math.floor(Math.random() * lastMessages.length)] || "",
      timestamp:
        timestamps[Math.floor(Math.random() * timestamps.length)] || "Now",
      unreadCount: hasUnread ? Math.floor(Math.random() * 5) + 1 : undefined,
      messages: generateMockMessages(name),
    };
  });
};

const generateMockMessages = (name: string): Message[] => {
  const conversations = [
    { sender: name, text: "Hey! How are you doing?" },
    { sender: "You", text: "I'm doing great! How about you?" },
    { sender: name, text: "That sounds great! When do you want to meet?" },
    { sender: "You", text: "How about this weekend?" },
    { sender: name, text: "This weekend works perfectly for me!" },
    { sender: "You", text: "Great! Let's meet at the coffee shop at 2 PM" },
    { sender: name, text: "Perfect! I'll see you there" },
    { sender: "You", text: "Can't wait! Should I bring anything?" },
    { sender: name, text: "No need, just bring yourself! 😊" },
    { sender: "You", text: "Sounds good. See you soon!" },
    { sender: name, text: "See you!" },
    { sender: "You", text: "Actually, do you like cappuccino or americano?" },
    { sender: name, text: "I prefer cappuccino with an extra shot" },
    { sender: "You", text: "Got it! I'll make sure to order that for you" },
    { sender: name, text: "You're amazing! Thank you" },
    { sender: "You", text: "My pleasure! See you at 2 PM" },
    { sender: name, text: "Looking forward to it!" },
    { sender: "You", text: "Me too! It's been a while since we caught up" },
    { sender: name, text: "I know right? We need to do this more often" },
    { sender: "You", text: "Absolutely! Let's make it a monthly thing" },
  ];

  return conversations.map((msg, idx) => ({
    id: idx + 1,
    ...msg,
    timestamp: `10:${30 + idx} AM`,
  }));
};

const MOCK_CHATS = generateMockChats();

// Skeleton Components - Memoized for performance
const ChatItemSkeleton = React.memo(() => (
  <div className="w-full flex items-center gap-3 p-3 rounded-xl">
    <Skeleton className="h-11 w-11 rounded-full flex-shrink-0" />
    <div className="flex-1 min-w-0 space-y-2">
      <Skeleton className="h-3.5 w-28" />
      <Skeleton className="h-3 w-full max-w-[200px]" />
    </div>
    <div className="space-y-2 items-end flex flex-col">
      <Skeleton className="h-2.5 w-12" />
    </div>
  </div>
));
ChatItemSkeleton.displayName = "ChatItemSkeleton";

// Reusable Avatar Component with online status
const ChatAvatar = React.memo(
  ({
    avatar,
    name,
    size = "default",
    showOnline = false,
  }: {
    avatar: string;
    name: string;
    size?: "small" | "default";
    showOnline?: boolean;
  }) => {
    const sizeClasses = size === "small" ? "h-8 w-8" : "h-11 w-11";
    const onlineIndicatorSize = size === "small" ? "h-2.5 w-2.5" : "h-3 w-3";

    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

    return (
      <div className="relative flex-shrink-0">
        <Avatar
          className={`${sizeClasses} ring-1 ring-border/50 transition-all group-hover:ring-primary/30`}
        >
          <AvatarImage src={avatar} alt={name} className="object-cover" />
          <AvatarFallback className="text-sm font-medium bg-gradient-to-br from-primary/10 to-primary/5">
            {initials}
          </AvatarFallback>
        </Avatar>
        {showOnline && (
          <div
            className={`absolute -bottom-0.5 -right-0.5 ${onlineIndicatorSize} rounded-full bg-emerald-500 ring-2 ring-background`}
          />
        )}
      </div>
    );
  },
);
ChatAvatar.displayName = "ChatAvatar";

// Loading indicator component
const LoadingIndicator = React.memo(({ text }: { text: string }) => (
  <div className="flex justify-center py-4 animate-in fade-in duration-300">
    <div className="flex items-center gap-2.5 bg-muted/60 backdrop-blur-sm px-4 py-2.5 rounded-full shadow-sm ring-1 ring-border/40">
      <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
      <span className="text-xs text-muted-foreground font-medium">{text}</span>
    </div>
  </div>
));
LoadingIndicator.displayName = "LoadingIndicator";

// Empty state component
const EmptyState = React.memo(
  ({
    icon: Icon,
    title,
    description,
  }: {
    icon: React.ElementType;
    title: string;
    description: string;
  }) => (
    <div className="flex-1 flex items-center justify-center animate-in fade-in duration-500">
      <div className="text-center space-y-4 max-w-sm px-6">
        <div className="relative inline-flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-primary/5 to-transparent blur-3xl rounded-full scale-150" />
          <div className="relative bg-muted/50 backdrop-blur-sm p-6 rounded-2xl ring-1 ring-border/40">
            <Icon className="h-12 w-12 text-muted-foreground/40" />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-base font-semibold tracking-tight">{title}</h3>
          <p className="text-sm text-muted-foreground/70 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  ),
);
EmptyState.displayName = "EmptyState";

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

  // Local state
  const [initialLoading, setInitialLoading] = useState(true);
  const [messageInput, setMessageInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Refs
  const chatListRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiButtonRef = useRef<HTMLDivElement>(null);
  const loadMoreTimerRef = useRef<NodeJS.Timeout | null>(null);
  const messagesTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initial load with smooth transition
  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayedChats(MOCK_CHATS.slice(0, INITIAL_LOAD_COUNT));
      setInitialLoading(false);
    }, INITIAL_LOAD_DELAY);

    return () => clearTimeout(timer);
  }, [setDisplayedChats]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (loadMoreTimerRef.current) clearTimeout(loadMoreTimerRef.current);
      if (messagesTimerRef.current) clearTimeout(messagesTimerRef.current);
    };
  }, []);

  // Handle chat list scroll for lazy loading
  const handleScroll = useCallback(() => {
    if (!chatListRef.current || isLoadingMore) return;

    const { scrollTop, scrollHeight, clientHeight } = chatListRef.current;
    if (scrollHeight - scrollTop <= clientHeight + SCROLL_THRESHOLD) {
      setIsLoadingMore(true);
      loadMoreTimerRef.current = setTimeout(() => {
        setDisplayedChats((prev) => {
          const newCount = Math.min(
            prev.length + LOAD_MORE_COUNT,
            MOCK_CHATS.length,
          );
          return MOCK_CHATS.slice(0, newCount);
        });
        setIsLoadingMore(false);
      }, LAZY_LOAD_DELAY);
    }
  }, [isLoadingMore, setIsLoadingMore, setDisplayedChats]);

  // Handle messages scroll for lazy loading older messages
  const handleMessagesScroll = useCallback(() => {
    if (!messagesRef.current || loadingOlderMessages) return;

    const { scrollTop } = messagesRef.current;
    if (scrollTop < SCROLL_THRESHOLD) {
      setLoadingOlderMessages(true);
      messagesTimerRef.current = setTimeout(() => {
        setLoadingOlderMessages(false);
      }, MESSAGE_LOAD_DELAY);
    }
  }, [loadingOlderMessages, setLoadingOlderMessages]);

  useEffect(() => {
    return () => {
      if (loadMoreTimerRef.current) clearTimeout(loadMoreTimerRef.current);
      if (messagesTimerRef.current) clearTimeout(messagesTimerRef.current);
    };
  }, []);

  // Handle emoji selection
  const handleEmojiSelect = useCallback((emojiData: EmojiClickData) => {
    setMessageInput((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  }, []);

  // Handle file selection
  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      setSelectedFiles((prev) => [...prev, ...files]);
    },
    [],
  );

  // Remove selected file
  const removeFile = useCallback((index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Send message handler
  const handleSendMessage = useCallback(() => {
    if (messageInput.trim() || selectedFiles.length > 0) {
      // TODO: Implement actual message sending logic
      console.log("Sending:", messageInput, selectedFiles);
      setMessageInput("");
      setSelectedFiles([]);
    }
  }, [messageInput, selectedFiles]);

  // Handle Enter key to send
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage],
  );

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  // Filter chats based on search - Memoized for performance
  const filteredChats = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return displayedChats;

    return displayedChats.filter(
      (chat) =>
        chat.name.toLowerCase().includes(query) ||
        chat.displayName.toLowerCase().includes(query),
    );
  }, [searchQuery, displayedChats]);

  const showNoResults = searchQuery.trim() && filteredChats.length === 0;
  const canSendMessage = messageInput.trim() || selectedFiles.length > 0;

  return (
    <div className="flex h-[90vh] overflow-hidden bg-background/95 backdrop-blur-sm gap-0 md:gap-3">
      {/* Chat List - Left Side */}
      <div
        className={`w-full md:w-[340px] flex flex-col bg-card/50 backdrop-blur-xl overflow-hidden border border-border/40 md:rounded-xl shadow-sm transition-all duration-300 ${selectedChat ? "hidden md:flex" : "flex"}`}
      >
        <div className="border-b border-border/40 p-3 md:p-5 space-y-3 md:space-y-4 flex-shrink-0 bg-gradient-to-b from-background/80 to-transparent">
          <h2 className="text-lg md:text-xl font-semibold tracking-tight">
            Messages
          </h2>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground/70 transition-colors group-hover:text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              className="pl-9 pr-4 text-sm h-10 bg-background/60 border-border/50 focus:bg-background transition-colors placeholder:text-muted-foreground/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Scrollable Chat List - Fixed height for 10 items */}
        <div
          ref={chatListRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto space-y-1 p-3 md:p-4 [mask-image:linear-gradient(to_bottom,black_0%,black_90%,transparent_100%)] [scrollbar-width:none] [-webkit-scrollbar:none]"
          style={{
            msOverflowStyle: "none",
          }}
        >
          {initialLoading ? (
            // Skeleton loading state
            <>
              {[...Array(8)].map((_, i) => (
                <ChatItemSkeleton key={i} />
              ))}
            </>
          ) : showNoResults ? (
            <div className="flex flex-col items-center justify-center py-16 animate-in fade-in duration-300">
              <div className="relative mb-4">
                <Search className="h-12 w-12 text-muted-foreground/20" />
                <div className="absolute inset-0 bg-primary/5 blur-2xl" />
              </div>
              <p className="text-sm font-medium text-foreground/80">
                No conversations found
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                Try searching with a different term
              </p>
            </div>
          ) : (
            <>
              {filteredChats.map((chat, index) => (
                <button
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  className={`group w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left animate-in fade-in slide-in-from-bottom-2 hover:scale-[1.01] active:scale-[0.99] ${
                    selectedChat?.id === chat.id
                      ? "bg-primary/8 shadow-sm ring-1 ring-primary/20"
                      : "hover:bg-muted/50"
                  }`}
                  style={{
                    animationDelay: `${index * ANIMATION_STAGGER_DELAY}ms`,
                    animationDuration: "400ms",
                    animationFillMode: "backwards",
                  }}
                >
                  <ChatAvatar
                    avatar={chat.avatar}
                    name={chat.name}
                    showOnline
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium truncate text-foreground/90 group-hover:text-foreground">
                      {chat.name}
                    </h3>
                    <p className="text-xs text-muted-foreground/80 truncate mt-0.5">
                      {chat.lastMessage}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="text-xs text-muted-foreground/60 font-medium whitespace-nowrap">
                      {chat.timestamp}
                    </span>
                    {chat.unreadCount && selectedChat?.id !== chat.id && (
                      <div className="h-5 min-w-5 px-1.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold flex items-center justify-center">
                        {chat.unreadCount}
                      </div>
                    )}
                  </div>
                </button>
              ))}
              {isLoadingMore && <LoadingIndicator text="Loading more..." />}
            </>
          )}
        </div>
      </div>

      {/* Chat Window - Right Side */}
      <div
        className={`flex flex-1 flex-col bg-card/50 backdrop-blur-xl overflow-hidden border border-border/40 md:rounded-xl shadow-lg transition-all duration-300 ${selectedChat ? "flex" : "hidden md:flex"}`}
      >
        {selectedChat ? (
          <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Chat Header */}
            <div className="border-b border-border/40 p-4 md:p-5 flex items-center gap-3 flex-shrink-0 bg-gradient-to-b from-background/80 to-transparent backdrop-blur-sm">
              <button
                onClick={() => setSelectedChat(null)}
                className="md:hidden p-2 hover:bg-muted/80 rounded-lg transition-all active:scale-95"
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
              <ChatAvatar
                avatar={selectedChat.avatar}
                name={selectedChat.name}
                showOnline
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base truncate tracking-tight">
                  {selectedChat.name}
                </h3>
                <p className="text-xs text-muted-foreground">Active now</p>
              </div>
              <div className="flex gap-1.5">
                <button className="p-2 hover:bg-muted/80 rounded-lg transition-all active:scale-95">
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
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </button>
                <button className="p-2 hover:bg-muted/80 rounded-lg transition-all active:scale-95">
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
                      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Messages - Scrollable */}
            <div
              ref={messagesRef}
              onScroll={handleMessagesScroll}
              className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-gradient-to-b from-background/30 to-background/60 [scrollbar-width:thin] [scrollbar-color:hsl(var(--muted))_transparent]"
            >
              {loadingOlderMessages && (
                <LoadingIndicator text="Loading older messages..." />
              )}
              {selectedChat?.messages.map((message: Message, index: number) => (
                <div
                  key={message.id}
                  className={`flex animate-in fade-in slide-in-from-bottom-1 ${
                    message.sender === "You" ? "justify-end" : "justify-start"
                  }`}
                  style={{
                    animationDelay: `${index * 20}ms`,
                    animationDuration: "300ms",
                    animationFillMode: "backwards",
                  }}
                >
                  <div
                    className={`group max-w-xs md:max-w-md px-4 py-2.5 rounded-2xl text-sm transition-all hover:scale-[1.02] active:scale-[0.98] ${
                      message.sender === "You"
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 rounded-br-md"
                        : "bg-muted/80 backdrop-blur-sm shadow-sm ring-1 ring-border/40 rounded-bl-md"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    <p
                      className={`text-[10px] mt-1.5 flex items-center gap-1 ${
                        message.sender === "You"
                          ? "opacity-80 justify-end"
                          : "opacity-60"
                      }`}
                    >
                      {message.timestamp}
                      {message.sender === "You" && (
                        <svg
                          className="h-3 w-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input - Sticky */}
            <div className="border-t border-border/40 p-4 md:p-5 flex flex-col gap-3 bg-background/80 backdrop-blur-sm flex-shrink-0">
              {/* Selected Files Preview */}
              {selectedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-muted/60 px-3 py-2 rounded-lg group animate-in fade-in slide-in-from-bottom-2"
                    >
                      <Paperclip className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-xs text-foreground/80 max-w-[150px] truncate">
                        {file.name}
                      </span>
                      <button
                        onClick={() => removeFile(index)}
                        className="ml-1 p-0.5 hover:bg-background rounded transition-colors"
                      >
                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Input Area */}
              <div className="flex gap-3">
                <div className="flex-1 relative" ref={emojiButtonRef}>
                  <Input
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="pr-24 text-sm h-11 bg-muted/50 border-border/50 focus:bg-background transition-all rounded-xl placeholder:text-muted-foreground/50"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                    {/* File Attachment Button */}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 hover:bg-background rounded-lg transition-all active:scale-95"
                      title="Attach files"
                    >
                      <Paperclip className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                    </button>
                    {/* Emoji Picker Button */}
                    <button
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="p-2 hover:bg-background rounded-lg transition-all active:scale-95"
                      title="Add emoji"
                    >
                      <Smile className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                    </button>
                  </div>
                  {/* Emoji Picker */}
                  {showEmojiPicker && (
                    <div className="absolute bottom-full right-0 mb-2 animate-in fade-in slide-in-from-bottom-2 duration-200 z-50">
                      <EmojiPicker
                        onEmojiClick={handleEmojiSelect}
                        autoFocusSearch={false}
                        theme={Theme.AUTO}
                        height={400}
                        width={350}
                        searchPlaceHolder="Search emoji..."
                        previewConfig={{ showPreview: false }}
                      />
                    </div>
                  )}
                  {/* Hidden File Input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileSelect}
                    accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
                  />
                </div>
                <Button
                  size="default"
                  onClick={handleSendMessage}
                  disabled={!canSendMessage}
                  className="h-11 px-5 rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <EmptyState
            icon={MessageCircle}
            title="No conversation selected"
            description="Choose a conversation from the list to start messaging"
          />
        )}
      </div>
    </div>
  );
}
