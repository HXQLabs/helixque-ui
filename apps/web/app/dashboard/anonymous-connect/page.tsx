"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Script from "next/script";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  MonitorUp,
  PhoneOff,
  RefreshCw,
  MessageSquare,
  Flag,
  Loader2,
  User,
  ChevronDown,
  Settings,
  Shield,
  Globe,
  Heart,
  GraduationCap,
  Code,
  Brain,
  Database,
  Cpu,
  Cloud,
  Smartphone,
  Palette,
  Lock,
  Blocks,
  Rocket,
  PenTool,
  X,
} from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Badge } from "@workspace/ui/components/badge";
import { Separator } from "@workspace/ui/components/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";
import { useFullscreen } from "@/contexts/fullscreen-context";
import { useCall } from "@/contexts/call-context";

const ExcalidrawWithClientOnly = dynamic(
  async () => (await import("@/components/excalidraw-wrapper")).default,
  { ssr: false },
);

type ConnectionStatus = "waiting" | "connected" | "disconnected";
type PageView = "lobby" | "videochat";

// ─── Professional Interest Categories ───
const TECH_INTERESTS = [
  { label: "Web Development", icon: Code },
  { label: "AI / ML", icon: Brain },
  { label: "Data Science", icon: Database },
  { label: "Cloud & DevOps", icon: Cloud },
  { label: "Mobile Dev", icon: Smartphone },
  { label: "Cybersecurity", icon: Lock },
  { label: "UI/UX Design", icon: Palette },
  { label: "Blockchain", icon: Blocks },
  { label: "IoT & Hardware", icon: Cpu },
  { label: "Product Management", icon: Rocket },
];

const STUDENT_YEARS = [
  "1st Year",
  "2nd Year",
  "3rd Year",
  "4th Year",
  "Post-Graduate",
  "PhD / Research",
];

// ═══════════════════════════════════════
// Main Page
// ═══════════════════════════════════════
export default function AnonymousConnectPage() {
  const [view, setView] = useState<PageView>("lobby");
  const [isMicOn, setIsMicOn] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("waiting");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isExcalidrawOpen, setIsExcalidrawOpen] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const { setFullscreen } = useFullscreen();
  const { setIsInCall, setCallVideoOn, setCallMicOn } = useCall();
  const router = useRouter();

  // Restore sidebar if user navigates away while in videochat
  useEffect(() => {
    return () => setFullscreen(false);
  }, [setFullscreen]);

  // ── Webcam for video-chat view ──
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const chatStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (view !== "videochat") return;

    if (isVideoOn) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((stream) => {
          chatStreamRef.current = stream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.error("Camera access failed:", err);
          setIsVideoOn(false);
        });
    } else {
      if (chatStreamRef.current) {
        chatStreamRef.current.getTracks().forEach((t) => t.stop());
        chatStreamRef.current = null;
      }
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null;
      }
    }

    return () => {
      if (chatStreamRef.current) {
        chatStreamRef.current.getTracks().forEach((t) => t.stop());
        chatStreamRef.current = null;
      }
    };
  }, [isVideoOn, view]);

  if (view === "lobby") {
    return (
      <LobbyScreen
        isMicOn={isMicOn}
        setIsMicOn={setIsMicOn}
        isVideoOn={isVideoOn}
        setIsVideoOn={setIsVideoOn}
        onJoin={() => {
          setFullscreen(true);
          setIsInCall(true);
          setCallVideoOn(isVideoOn);
          setCallMicOn(isMicOn);
          setView("videochat");
        }}
      />
    );
  }

  const handleNext = () => {
    setConnectionStatus("waiting");
  };

  const handleLeave = () => {
    setIsLeaving(true);
    setTimeout(() => {
      if (chatStreamRef.current) {
        chatStreamRef.current.getTracks().forEach((t) => t.stop());
        chatStreamRef.current = null;
      }
      setFullscreen(false);
      setIsInCall(false);
      setConnectionStatus("disconnected");
      setIsChatOpen(false);
      setIsExcalidrawOpen(false);
      setIsLeaving(false);
      setView("lobby");
    }, 500);
  };

  const toggleExcalidraw = () => {
    setIsExcalidrawOpen((v) => {
      if (!v) setIsChatOpen(false); // close chat when opening excalidraw
      return !v;
    });
  };

  const toggleChat = () => {
    setIsChatOpen((v) => {
      if (!v) setIsExcalidrawOpen(false); // close excalidraw when opening chat
      return !v;
    });
  };

  const rightPanelOpen = isChatOpen;

  return (
    <div
      className={`relative flex h-full flex-col bg-neutral-950 transition-all duration-500 ease-in-out ${
        isLeaving ? "scale-95 opacity-0" : "scale-100 opacity-100"
      }`}
    >
      {/* Main content area */}
      <div className="flex flex-1 gap-3 p-3 overflow-hidden">
        {/* Video / Excalidraw content */}
        <div
          className={`flex min-w-0 flex-col transition-all duration-300 ease-in-out ${
            rightPanelOpen ? "w-[65%]" : "w-full"
          }`}
        >
          {isExcalidrawOpen ? (
            /* ── Center Stage Layout: Excalidraw ── */
            <div className="flex h-full flex-col gap-3">
              {/* Top strip: small participant thumbnails */}
              <div className="flex justify-center gap-3 flex-shrink-0">
                {/* Your video tile */}
                <div className="relative aspect-video w-56 shrink-0 overflow-hidden rounded-xl border border-white/[0.08] bg-neutral-900 shadow-lg">
                  {isVideoOn ? (
                    <video
                      ref={localVideoRef}
                      className="absolute inset-0 h-full w-full scale-x-[-1] object-cover"
                      autoPlay
                      muted
                      playsInline
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-neutral-900">
                      <div className="flex size-14 items-center justify-center rounded-full bg-gradient-to-b from-white/[0.08] to-white/[0.03]">
                        <User className="size-7 text-white/30" />
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 rounded-md bg-black/60 backdrop-blur-sm px-2 py-0.5 text-[10px] font-medium text-white/80">
                    You
                  </div>
                </div>

                {/* Peer video tile */}
                <div className="relative aspect-video w-56 shrink-0 overflow-hidden rounded-xl border border-white/[0.08] bg-neutral-900 shadow-lg">
                  {connectionStatus === "connected" ? (
                    <video
                      className="absolute inset-0 h-full w-full object-cover"
                      autoPlay
                      playsInline
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-neutral-900">
                      <div className="flex size-14 items-center justify-center rounded-full bg-gradient-to-b from-white/[0.08] to-white/[0.03]">
                        <User className="size-7 text-white/30" />
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 rounded-md bg-black/60 backdrop-blur-sm px-2 py-0.5 text-[10px] font-medium text-white/80">
                    {connectionStatus === "connected" ? "Stranger" : "—"}
                  </div>
                </div>
              </div>

              {/* Center: Excalidraw canvas */}
              <div className="relative flex-1 overflow-hidden rounded-2xl border border-white/[0.08] bg-neutral-900 shadow-xl">
                <div className="absolute inset-0 z-10">
                  <div className="custom-styles flex w-full h-full absolute inset-0 [&>div]:w-full! [&>div]:h-full!">
                    <Script id="load-excalidraw-env" strategy="beforeInteractive">
                      {`window["EXCALIDRAW_ASSET_PATH"] = window.origin;`}
                    </Script>
                    <ExcalidrawWithClientOnly />
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 z-20 rounded-lg bg-black/60 backdrop-blur-sm px-3 py-2 text-sm ring-1 ring-white/10">
                  <span className="flex items-center gap-2 text-white/90">
                    <PenTool className="h-4 w-4" />
                    Whiteboard
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* ── Normal 2-up Video Layout ── */
            <div className="flex h-full gap-3 flex-row">
              {/* Left panel - Your video */}
              <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-2xl border border-white/[0.08] bg-neutral-900">
                {isVideoOn ? (
                  <video
                    ref={localVideoRef}
                    className="size-full scale-x-[-1] object-cover"
                    autoPlay
                    muted
                    playsInline
                  />
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex size-20 items-center justify-center rounded-full bg-gradient-to-b from-white/[0.08] to-white/[0.03]">
                      <User className="size-10 text-white/30" />
                    </div>
                    <p className="text-xs font-medium text-white/25">
                      Camera is off
                    </p>
                  </div>
                )}

                {/* Status overlays */}
                {connectionStatus === "waiting" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative">
                        <div className="absolute inset-0 animate-ping rounded-full border-2 border-primary/30" />
                        <Loader2 className="size-8 animate-spin text-white/70" />
                      </div>
                      <p className="text-xs font-medium text-white/60">
                        Finding someone...
                      </p>
                    </div>
                  </div>
                )}
                {connectionStatus === "disconnected" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
                    <p className="text-xs font-medium text-white/60">
                      Disconnected — click Next
                    </p>
                  </div>
                )}

                <div className="absolute bottom-3 left-3">
                  <span className="rounded-lg bg-black/60 backdrop-blur-sm px-2.5 py-1 text-xs font-medium text-white ring-1 ring-white/10">
                    You
                  </span>
                </div>
              </div>

              {/* Right panel - Peer video */}
              <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-2xl border border-white/[0.08] bg-neutral-900">
                {connectionStatus === "connected" ? (
                  <video
                    className="size-full object-cover"
                    autoPlay
                    playsInline
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex size-20 items-center justify-center rounded-full bg-gradient-to-b from-white/[0.08] to-white/[0.03]">
                      <User className="size-10 text-white/30" />
                    </div>
                  </div>
                )}

                <div className="absolute bottom-3 left-3">
                  <span className="rounded-lg bg-black/60 backdrop-blur-sm px-2.5 py-1 text-xs font-medium text-white ring-1 ring-white/10">
                    {connectionStatus === "connected" ? "Stranger" : "—"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chat panel - side drawer */}
        <div
          className={`flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-neutral-900/95 backdrop-blur-sm transition-all duration-300 ease-in-out ${
            isChatOpen ? "w-[35%] opacity-100" : "w-0 border-0 opacity-0"
          }`}
        >
          <div className="flex min-w-0 items-center justify-between border-b border-white/[0.08] px-4 py-3">
            <h3 className="text-sm font-semibold text-white">Chat</h3>
            <Button
              variant="ghost"
              size="icon"
              className="size-7 shrink-0 text-white/60 hover:text-white hover:bg-white/10"
              onClick={() => setIsChatOpen(false)}
            >
              <X className="size-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <p className="text-center text-xs text-white/40">
              Messages will appear here when connected
            </p>
          </div>
          <div className="border-t border-white/[0.08] p-3">
            <input
              type="text"
              placeholder="Type a message..."
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-white/20 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Bottom controls bar */}
      <div className="relative z-30 flex items-center justify-center px-4 py-4">
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-2.5 py-2 backdrop-blur-xl">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleNext}
                className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <RefreshCw className="size-4" />
                <span className="hidden sm:inline">Next</span>
              </button>
            </TooltipTrigger>
            <TooltipContent>Next match</TooltipContent>
          </Tooltip>

          <MeetControlButton
            icon={isMicOn ? <Mic className="size-5" /> : <MicOff className="size-5" />}
            onClick={() => setIsMicOn(!isMicOn)}
            isActive={!isMicOn}
            tooltip={isMicOn ? "Mute (M)" : "Unmute (M)"}
          />

          <MeetControlButton
            icon={isVideoOn ? <Video className="size-5" /> : <VideoOff className="size-5" />}
            onClick={() => setIsVideoOn(!isVideoOn)}
            isActive={!isVideoOn}
            tooltip={isVideoOn ? "Turn off camera (V)" : "Turn on camera (V)"}
          />

          <MeetControlButton
            icon={<MonitorUp className="size-5" />}
            onClick={() => {}}
            tooltip="Share screen"
          />

          <MeetControlButton
            icon={<PenTool className="size-5" />}
            onClick={toggleExcalidraw}
            isActive={false}
            isHighlighted={isExcalidrawOpen}
            tooltip="Excalidraw whiteboard"
          />

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleLeave}
                className="ml-1 flex items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700"
              >
                <PhoneOff className="size-4" />
                <span className="hidden sm:inline">Leave</span>
              </button>
            </TooltipTrigger>
            <TooltipContent>Leave call</TooltipContent>
          </Tooltip>
        </div>

        <div className="absolute right-6">
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-2 py-1.5 backdrop-blur-xl">
            <MeetControlButton
              icon={<MessageSquare className="size-5" />}
              onClick={toggleChat}
              isHighlighted={isChatOpen}
              tooltip={isChatOpen ? "Close chat" : "Open chat"}
              variant="ghost"
            />
            <MeetControlButton
              icon={<Flag className="size-5" />}
              onClick={() => {}}
              tooltip="Report"
              variant="ghost"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// Lobby / Pre-join Screen
// ═══════════════════════════════════════
function LobbyScreen({
  isMicOn,
  setIsMicOn,
  isVideoOn,
  setIsVideoOn,
  onJoin,
}: {
  isMicOn: boolean;
  setIsMicOn: (v: boolean) => void;
  isVideoOn: boolean;
  setIsVideoOn: (v: boolean) => void;
  onJoin: () => void;
}) {
  const [displayName, setDisplayName] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [language, setLanguage] = useState("English");
  const [connectWith, setConnectWith] = useState<"anyone" | "students">(
    "anyone",
  );
  const [studentYear, setStudentYear] = useState("");

  // ── Webcam preview ──
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const previewStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (isVideoOn) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((stream) => {
          previewStreamRef.current = stream;
          if (previewVideoRef.current) {
            previewVideoRef.current.srcObject = stream;
          }
        })
        .catch(() => {
          setIsVideoOn(false);
        });
    } else {
      if (previewStreamRef.current) {
        previewStreamRef.current.getTracks().forEach((t) => t.stop());
        previewStreamRef.current = null;
      }
      if (previewVideoRef.current) {
        previewVideoRef.current.srcObject = null;
      }
    }

    return () => {
      if (previewStreamRef.current) {
        previewStreamRef.current.getTracks().forEach((t) => t.stop());
        previewStreamRef.current = null;
      }
    };
  }, [isVideoOn, setIsVideoOn]);

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : prev.length < 5
          ? [...prev, interest]
          : prev,
    );
  };

  return (
    <div className="flex h-full overflow-auto">
      <div className="m-auto flex w-full max-w-6xl flex-col gap-6 p-4 md:p-8 lg:flex-row lg:gap-8">
        {/* ─── Left side: Preferences ─── */}
        <div className="flex flex-1 flex-col gap-0 overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm">
          {/* Header */}
          <div className="border-b border-border/50 bg-background/60 backdrop-blur-sm px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
                <Heart className="size-5 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">
                  Anonymous Connect
                </h1>
                <p className="text-xs text-muted-foreground">
                  Set your preferences before connecting
                </p>
              </div>
            </div>
          </div>

          {/* Scrollable content */}
          <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-6 [scrollbar-width:thin] [scrollbar-color:hsl(var(--border))_transparent]">
            {/* Display name */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Display Name
              </Label>
              <Input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter a nickname (optional)"
                className="h-11 rounded-xl"
              />
            </div>

            {/* Connect with */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Connect with
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    {
                      value: "anyone",
                      label: "Anyone",
                      icon: Globe,
                      desc: "Random match",
                    },
                    {
                      value: "students",
                      label: "Students",
                      icon: GraduationCap,
                      desc: "Academic peers",
                    },
                  ] as const
                ).map((option) => (
                  <Button
                    key={option.value}
                    variant={connectWith === option.value ? "default" : "outline"}
                    onClick={() => setConnectWith(option.value)}
                    className={cn(
                      "h-auto flex-col items-center gap-1.5 py-3.5 transition-all",
                      connectWith === option.value && "shadow-md"
                    )}
                  >
                    <option.icon className="size-5" />
                    <span className="text-xs font-medium">{option.label}</span>
                    <span className="text-[10px] opacity-70">{option.desc}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Student Year */}
            {connectWith === "students" && (
              <div className="animate-in fade-in slide-in-from-top-2 space-y-2 duration-200">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Year of Study
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {STUDENT_YEARS.map((year) => (
                    <Button
                      key={year}
                      variant={studentYear === year ? "default" : "outline"}
                      size="sm"
                      onClick={() =>
                        setStudentYear(studentYear === year ? "" : year)
                      }
                      className="text-xs"
                    >
                      {year}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Language */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Preferred Language
              </Label>
              <div className="relative">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="h-11 w-full appearance-none rounded-xl border border-border bg-background px-4 pr-10 text-sm transition-all focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Telugu">Telugu</option>
                  <option value="Japanese">Japanese</option>
                  <option value="Korean">Korean</option>
                  <option value="Portuguese">Portuguese</option>
                  <option value="Chinese">Chinese</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            {/* Interests */}
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Topics & Interests
                </Label>
                <span className="text-[10px] text-muted-foreground">
                  {selectedInterests.length}/5 selected
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {TECH_INTERESTS.map((interest) => {
                  const selected = selectedInterests.includes(interest.label);
                  return (
                    <Badge
                      key={interest.label}
                      variant={selected ? "default" : "outline"}
                      className={cn(
                        "cursor-pointer gap-1.5 px-3 py-1.5 transition-all hover:scale-105",
                        selected && "shadow-sm"
                      )}
                      onClick={() => toggleInterest(interest.label)}
                    >
                      <interest.icon className="size-3" />
                      {interest.label}
                    </Badge>
                  );
                })}
              </div>
            </div>

            {/* Safety note */}
            <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3">
              <Shield className="mt-0.5 size-4 shrink-0 text-emerald-500" />
              <p className="text-xs leading-relaxed text-muted-foreground">
                All conversations are anonymous and end-to-end encrypted. You
                can leave or report at any time. Be respectful to others.
              </p>
            </div>
          </div>
        </div>

        {/* ─── Right side: Camera / Mic preview ─── */}
        <div className="flex w-full flex-col gap-4 lg:w-[400px]">
          {/* Camera preview */}
          <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-2xl border border-border/50 bg-neutral-900">
            {isVideoOn ? (
              <video
                ref={previewVideoRef}
                className="size-full scale-x-[-1] object-cover"
                autoPlay
                muted
                playsInline
              />
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="flex size-24 items-center justify-center rounded-full bg-gradient-to-b from-white/[0.08] to-white/[0.04]">
                  <User className="size-11 text-white/30" />
                </div>
                <p className="text-xs font-medium text-white/30">
                  Camera is off
                </p>
              </div>
            )}

            {/* Mic / Video toggles overlay */}
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2.5 rounded-2xl border border-white/[0.10] bg-black/60 px-3 py-2 backdrop-blur-xl">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setIsMicOn(!isMicOn)}
                    className={cn(
                      "flex size-10 items-center justify-center rounded-xl transition-all",
                      isMicOn
                        ? "bg-white/10 text-white hover:bg-white/15"
                        : "bg-red-500 text-white hover:bg-red-600",
                    )}
                  >
                    {isMicOn ? (
                      <Mic className="size-[18px]" />
                    ) : (
                      <MicOff className="size-[18px]" />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent>{isMicOn ? "Mute" : "Unmute"}</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setIsVideoOn(!isVideoOn)}
                    className={cn(
                      "flex size-10 items-center justify-center rounded-xl transition-all",
                      isVideoOn
                        ? "bg-white/10 text-white hover:bg-white/15"
                        : "bg-red-500 text-white hover:bg-red-600",
                    )}
                  >
                    {isVideoOn ? (
                      <Video className="size-[18px]" />
                    ) : (
                      <VideoOff className="size-[18px]" />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  {isVideoOn ? "Turn off camera" : "Turn on camera"}
                </TooltipContent>
              </Tooltip>

              <div className="mx-0.5 h-5 w-px bg-white/10" />

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className="flex size-10 items-center justify-center rounded-xl bg-white/[0.06] text-white/60 transition-all hover:bg-white/10 hover:text-white"
                    title="Settings"
                  >
                    <Settings className="size-[18px]" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Device settings</TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Device info */}
          <div className="flex flex-col gap-2.5 rounded-xl border border-border/50 bg-card p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Devices
            </h3>
            {[
              {
                label: "Microphone",
                value: isMicOn ? "Default Mic" : "Off",
                active: isMicOn,
              },
              {
                label: "Camera",
                value: isVideoOn ? "Default Camera" : "Off",
                active: isVideoOn,
              },
              {
                label: "Speaker",
                value: "Default Speaker",
                active: true,
              },
            ].map((device) => (
              <div
                key={device.label}
                className="flex items-center justify-between"
              >
                <span className="text-xs text-muted-foreground">{device.label}</span>
                <span
                  className={cn(
                    "flex items-center gap-1.5 text-xs",
                    device.active ? "text-foreground" : "text-destructive",
                  )}
                >
                  <span
                    className={cn(
                      "inline-block size-1.5 rounded-full",
                      device.active ? "bg-emerald-500" : "bg-destructive",
                    )}
                  />
                  {device.value}
                </span>
              </div>
            ))}
          </div>

          {/* Join button */}
          <Button
            onClick={onJoin}
            size="lg"
            className="w-full rounded-xl py-6 text-sm font-semibold shadow-lg transition-all hover:shadow-xl hover:shadow-primary/20 active:scale-[0.99]"
          >
            Start Connecting
          </Button>

          <p className="text-center text-[10px] text-muted-foreground">
            By joining, you agree to our community guidelines
          </p>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// Meet Control Button
// ═══════════════════════════════════════
function MeetControlButton({
  icon,
  onClick,
  isActive = false,
  isHighlighted = false,
  tooltip,
  variant = "default",
}: {
  icon: React.ReactNode;
  onClick: () => void;
  isActive?: boolean;
  isHighlighted?: boolean;
  tooltip: string;
  variant?: "default" | "ghost";
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onClick}
          className={cn(
            "flex size-11 items-center justify-center rounded-full transition-all",
            variant === "ghost"
              ? "text-white/60 hover:bg-white/10 hover:text-white"
              : isHighlighted
                ? "bg-amber-500 text-white hover:bg-amber-600"
                : isActive
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-white/10 text-white hover:bg-white/20",
          )}
        >
          {icon}
        </button>
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
}
