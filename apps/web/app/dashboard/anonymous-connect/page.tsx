"use client";

import * as React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  MonitorUp,
  Sparkles,
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
} from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
import { useFullscreen } from "@/contexts/fullscreen-context";
import { useCall } from "@/contexts/call-context";

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
    // Let the fade-out animation play, then switch view
    setTimeout(() => {
      if (chatStreamRef.current) {
        chatStreamRef.current.getTracks().forEach((t) => t.stop());
        chatStreamRef.current = null;
      }
      setFullscreen(false);
      setIsInCall(false);
      setConnectionStatus("disconnected");
      setIsChatOpen(false);
      setIsLeaving(false);
      setView("lobby");
    }, 500);
  };

  return (
    <div
      className={`relative flex h-full flex-col bg-black transition-all duration-500 ease-in-out ${
        isLeaving ? "scale-95 opacity-0" : "scale-100 opacity-100"
      }`}
    >
      {/* Video panels + Chat area */}
      <div className="flex flex-1 gap-3 p-3 overflow-hidden">
        {/* Video panels container */}
        <div
          className={`flex min-w-0 gap-3 transition-all duration-300 ease-in-out ${
            isChatOpen ? "w-[65%] flex-row" : "w-full flex-row"
          }`}
        >
          {/* Left panel - Your video */}
          <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-neutral-900">
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
                <div className="flex size-20 items-center justify-center rounded-full border-2 border-white/20">
                  <User className="size-10 text-white/40" />
                </div>
                <p className="text-xs font-medium text-white/25">
                  Camera is off
                </p>
              </div>
            )}

            {/* Status overlay */}
            {connectionStatus === "waiting" && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="size-8 animate-spin text-white/70" />
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
              <span className="rounded bg-black/60 px-2 py-1 text-xs font-medium text-white">
                You
              </span>
            </div>
          </div>

          {/* Right panel - Peer video */}
          <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-neutral-900">
            {connectionStatus === "connected" ? (
              <div className="flex size-full items-center justify-center">
                <video
                  className="size-full object-cover"
                  autoPlay
                  playsInline
                />
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="flex size-20 items-center justify-center rounded-full border-2 border-white/20">
                  <User className="size-10 text-white/40" />
                </div>
              </div>
            )}

            <div className="absolute bottom-3 left-3">
              <span className="rounded bg-black/60 px-2 py-1 text-xs font-medium text-white">
                {connectionStatus === "connected" ? "Stranger" : "Jack"}
              </span>
            </div>
          </div>
        </div>

        {/* Chat panel - slides in from right */}
        <div
          className={`flex flex-col overflow-hidden rounded-xl border border-white/10 bg-neutral-900/95 backdrop-blur-sm transition-all duration-300 ease-in-out ${
            isChatOpen ? "w-[35%] opacity-100" : "w-0 border-0 opacity-0"
          }`}
        >
          <div className="flex min-w-0 items-center justify-between border-b border-white/10 px-4 py-3">
            <h3 className="text-sm font-semibold text-white">Chat</h3>
            <Button
              variant="ghost"
              size="icon"
              className="size-7 shrink-0 text-white/60 hover:text-white"
              onClick={() => setIsChatOpen(false)}
            >
              ✕
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <p className="text-center text-xs text-white/40">
              Messages will appear here when connected
            </p>
          </div>
          <div className="border-t border-white/10 p-3">
            <input
              type="text"
              placeholder="Type a message..."
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-white/20 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Bottom controls bar */}
      <div className="relative z-30 flex items-center justify-center bg-black/80 px-4 py-4">
        <div className="flex items-center gap-2">
          <button
            onClick={handleNext}
            className="flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
          >
            <RefreshCw className="size-4" />
            Next
          </button>
          <ControlButton
            icon={
              isMicOn ? (
                <Mic className="size-5" />
              ) : (
                <MicOff className="size-5" />
              )
            }
            onClick={() => setIsMicOn(!isMicOn)}
            isActive={!isMicOn}
            tooltip={isMicOn ? "Mute" : "Unmute"}
          />
          <ControlButton
            icon={
              isVideoOn ? (
                <Video className="size-5" />
              ) : (
                <VideoOff className="size-5" />
              )
            }
            onClick={() => setIsVideoOn(!isVideoOn)}
            isActive={!isVideoOn}
            tooltip={isVideoOn ? "Turn off camera" : "Turn on camera"}
          />
          <ControlButton
            icon={<MonitorUp className="size-5" />}
            onClick={() => {}}
            tooltip="Share screen"
          />
          <ControlButton
            icon={<Sparkles className="size-5" />}
            onClick={() => {}}
            tooltip="Effects"
          />
          <button
            onClick={() => {
              setFullscreen(false);
              router.push("/dashboard/whiteboard");
            }}
            className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/20"
            title="Excalidraw Whiteboard"
          >
            <PenTool className="size-4" />
            Excalidraw
          </button>
          <button
            onClick={handleLeave}
            className="flex items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700"
          >
            <PhoneOff className="size-4" />
            Leave
          </button>
        </div>

        <div className="absolute right-4 flex items-center gap-2">
          <ControlButton
            icon={<MessageSquare className="size-5" />}
            onClick={() => setIsChatOpen(!isChatOpen)}
            tooltip="Chat"
            variant="ghost"
          />
          <ControlButton
            icon={<Flag className="size-5" />}
            onClick={() => {}}
            tooltip="Report"
            variant="ghost"
          />
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
    <div className="flex h-full overflow-auto bg-[#09090f]">
      <div className="m-auto flex w-full max-w-6xl flex-col gap-6 p-4 md:p-8 lg:flex-row lg:gap-8">
        {/* ─── Left side: Preferences ─── */}
        <div className="flex flex-1 flex-col gap-0 overflow-hidden rounded-2xl border border-white/[0.10] bg-gradient-to-b from-white/[0.04] to-white/[0.015] backdrop-blur-sm">
          {/* Header */}
          <div className="border-b border-white/[0.08] bg-white/[0.03] px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-blue-500/15">
                <Heart className="size-5 text-blue-400" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-white">
                  Anonymous Connect
                </h1>
                <p className="text-xs text-white/45">
                  Set your preferences before connecting
                </p>
              </div>
            </div>
          </div>

          {/* Scrollable content */}
          <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-6">
            {/* Display name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-white/35">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter a nickname (optional)"
                className="rounded-xl border border-white/[0.10] bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder:text-white/25 transition-all focus:border-blue-500/40 focus:bg-white/[0.06] focus:outline-none focus:ring-1 focus:ring-blue-500/20"
              />
            </div>

            {/* Connect with */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-white/35">
                Connect with
              </label>
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
                  <button
                    key={option.value}
                    onClick={() => setConnectWith(option.value)}
                    className={cn(
                      "group relative flex flex-col items-center gap-1 rounded-xl border px-3 py-3.5 text-center transition-all",
                      connectWith === option.value
                        ? "border-blue-500/40 bg-blue-500/10 shadow-[0_0_20px_-6px_rgba(59,130,246,0.3)]"
                        : "border-white/[0.09] bg-white/[0.03] hover:border-white/[0.14] hover:bg-white/[0.05]",
                    )}
                  >
                    <option.icon
                      className={cn(
                        "size-5 transition-colors",
                        connectWith === option.value
                          ? "text-blue-400"
                          : "text-white/40 group-hover:text-white/55",
                      )}
                    />
                    <span
                      className={cn(
                        "text-xs font-medium",
                        connectWith === option.value
                          ? "text-blue-300"
                          : "text-white/55",
                      )}
                    >
                      {option.label}
                    </span>
                    <span
                      className={cn(
                        "text-[10px]",
                        connectWith === option.value
                          ? "text-blue-400/50"
                          : "text-white/25",
                      )}
                    >
                      {option.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Student Year — only visible when "Students" is selected */}
            {connectWith === "students" && (
              <div className="flex animate-in fade-in slide-in-from-top-2 flex-col gap-2 duration-200">
                <label className="text-[11px] font-semibold uppercase tracking-widest text-white/35">
                  Year of Study
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {STUDENT_YEARS.map((year) => (
                    <button
                      key={year}
                      onClick={() =>
                        setStudentYear(studentYear === year ? "" : year)
                      }
                      className={cn(
                        "rounded-lg border px-3 py-2 text-xs font-medium transition-all",
                        studentYear === year
                          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                          : "border-white/[0.09] bg-white/[0.03] text-white/45 hover:border-white/[0.14] hover:text-white/65",
                      )}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Language + Interests row */}
            <div className="flex flex-col gap-5">
              {/* Language */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-widest text-white/35">
                  Preferred Language
                </label>
                <div className="relative">
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-white/[0.10] bg-white/[0.04] px-4 py-2.5 pr-10 text-sm text-white transition-all focus:border-blue-500/40 focus:bg-white/[0.06] focus:outline-none focus:ring-1 focus:ring-blue-500/20"
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
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-white/30" />
                </div>
              </div>

              {/* Interests */}
              <div className="flex flex-col gap-2">
                <div className="flex items-baseline justify-between">
                  <label className="text-[11px] font-semibold uppercase tracking-widest text-white/35">
                    Topics &amp; Interests
                  </label>
                  <span className="text-[10px] text-white/25">
                    {selectedInterests.length}/5 selected
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {TECH_INTERESTS.map((interest) => {
                    const selected = selectedInterests.includes(interest.label);
                    return (
                      <button
                        key={interest.label}
                        onClick={() => toggleInterest(interest.label)}
                        className={cn(
                          "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-medium transition-all",
                          selected
                            ? "border-blue-500/40 bg-blue-500/10 text-blue-300 shadow-[0_0_12px_-4px_rgba(59,130,246,0.4)]"
                            : "border-white/[0.09] bg-white/[0.03] text-white/40 hover:border-white/[0.14] hover:text-white/60",
                        )}
                      >
                        <interest.icon className="size-3" />
                        {interest.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Safety note */}
            <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/15 bg-emerald-500/[0.05] px-4 py-3">
              <Shield className="mt-0.5 size-4 shrink-0 text-emerald-400/70" />
              <p className="text-[11px] leading-relaxed text-emerald-200/50">
                All conversations are anonymous and end-to-end encrypted. You
                can leave or report at any time. Be respectful to others.
              </p>
            </div>
          </div>
        </div>

        {/* ─── Right side: Camera / Mic preview ─── */}
        <div className="flex w-full flex-col gap-4 lg:w-[400px]">
          {/* Camera preview */}
          <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-2xl border border-white/[0.10] bg-neutral-900">
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
                  <User className="size-11 text-white/35" />
                </div>
                <p className="text-xs font-medium text-white/30">
                  Camera is off
                </p>
              </div>
            )}

            {/* Mic / Video toggles overlay */}
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2.5 rounded-2xl border border-white/[0.10] bg-black/60 px-3 py-2 backdrop-blur-md">
              <button
                onClick={() => setIsMicOn(!isMicOn)}
                className={cn(
                  "flex size-10 items-center justify-center rounded-xl transition-all",
                  isMicOn
                    ? "bg-white/10 text-white hover:bg-white/15"
                    : "bg-red-500/90 text-white hover:bg-red-600",
                )}
                title={isMicOn ? "Mute" : "Unmute"}
              >
                {isMicOn ? (
                  <Mic className="size-[18px]" />
                ) : (
                  <MicOff className="size-[18px]" />
                )}
              </button>

              <button
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={cn(
                  "flex size-10 items-center justify-center rounded-xl transition-all",
                  isVideoOn
                    ? "bg-white/10 text-white hover:bg-white/15"
                    : "bg-red-500/90 text-white hover:bg-red-600",
                )}
                title={isVideoOn ? "Turn off camera" : "Turn on camera"}
              >
                {isVideoOn ? (
                  <Video className="size-[18px]" />
                ) : (
                  <VideoOff className="size-[18px]" />
                )}
              </button>

              <div className="mx-0.5 h-5 w-px bg-white/10" />

              <button
                className="flex size-10 items-center justify-center rounded-xl bg-white/[0.06] text-white/60 transition-all hover:bg-white/10 hover:text-white"
                title="Settings"
              >
                <Settings className="size-[18px]" />
              </button>
            </div>
          </div>

          {/* Device info */}
          <div className="flex flex-col gap-2.5 rounded-xl border border-white/[0.10] bg-white/[0.03] p-4">
            <h3 className="text-[11px] font-semibold uppercase tracking-widest text-white/30">
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
                <span className="text-xs text-white/35">{device.label}</span>
                <span
                  className={cn(
                    "flex items-center gap-1.5 text-xs",
                    device.active ? "text-white/60" : "text-red-400/60",
                  )}
                >
                  <span
                    className={cn(
                      "inline-block size-1.5 rounded-full",
                      device.active ? "bg-emerald-400" : "bg-red-400",
                    )}
                  />
                  {device.value}
                </span>
              </div>
            ))}
          </div>

          {/* Join button */}
          <button
            onClick={onJoin}
            className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 text-sm font-semibold text-white transition-all hover:from-blue-500 hover:to-indigo-500 hover:shadow-[0_0_28px_-4px_rgba(99,102,241,0.5)] active:scale-[0.99]"
          >
            <span className="relative z-10">Start Connecting</span>
          </button>

          <p className="text-center text-[10px] text-white/20">
            By joining, you agree to our community guidelines
          </p>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// Control Button (video chat)
// ═══════════════════════════════════════
function ControlButton({
  icon,
  onClick,
  isActive = false,
  tooltip,
  variant = "default",
}: {
  icon: React.ReactNode;
  onClick: () => void;
  isActive?: boolean;
  tooltip: string;
  variant?: "default" | "ghost";
}) {
  return (
    <button
      onClick={onClick}
      title={tooltip}
      className={cn(
        "flex size-11 items-center justify-center rounded-full transition-colors",
        variant === "ghost"
          ? "text-white/60 hover:bg-white/10 hover:text-white"
          : isActive
            ? "bg-red-600 text-white hover:bg-red-700"
            : "bg-white/10 text-white hover:bg-white/20",
      )}
    >
      {icon}
    </button>
  );
}
