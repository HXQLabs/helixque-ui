"use client";

import * as React from "react";
import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  PenTool,
  Share2,
  Users,
  Layers,
  MousePointer2,
  Square,
  Circle,
  Type,
  Minus,
  ArrowRight,
  Eraser,
  Download,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Hand,
  ImageIcon,
  User,
  PhoneOff,
} from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { useCall } from "@/contexts/call-context";

const TOOLS = [
  { icon: MousePointer2, label: "Select", shortcut: "V" },
  { icon: Hand, label: "Pan", shortcut: "H" },
  { icon: Square, label: "Rectangle", shortcut: "R" },
  { icon: Circle, label: "Ellipse", shortcut: "O" },
  { icon: Minus, label: "Line", shortcut: "L" },
  { icon: ArrowRight, label: "Arrow", shortcut: "A" },
  { icon: PenTool, label: "Draw", shortcut: "P" },
  { icon: Type, label: "Text", shortcut: "T" },
  { icon: ImageIcon, label: "Image", shortcut: "I" },
  { icon: Eraser, label: "Eraser", shortcut: "E" },
];

export default function WhiteboardPage() {
  const [activeTool, setActiveTool] = React.useState("Select");
  const { isInCall, callVideoOn, setIsInCall } = useCall();
  const router = useRouter();

  // ── Webcam for PiP ──
  const pipVideoRef = useRef<HTMLVideoElement>(null);
  const pipStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!isInCall || !callVideoOn) {
      if (pipStreamRef.current) {
        pipStreamRef.current.getTracks().forEach((t) => t.stop());
        pipStreamRef.current = null;
      }
      if (pipVideoRef.current) {
        pipVideoRef.current.srcObject = null;
      }
      return;
    }

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        pipStreamRef.current = stream;
        if (pipVideoRef.current) {
          pipVideoRef.current.srcObject = stream;
        }
      })
      .catch(() => {});

    return () => {
      if (pipStreamRef.current) {
        pipStreamRef.current.getTracks().forEach((t) => t.stop());
        pipStreamRef.current = null;
      }
    };
  }, [isInCall, callVideoOn]);

  const handleLeaveCall = () => {
    if (pipStreamRef.current) {
      pipStreamRef.current.getTracks().forEach((t) => t.stop());
      pipStreamRef.current = null;
    }
    setIsInCall(false);
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-[#0a0a12]">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-white/[0.08] bg-white/[0.02] px-4 py-2.5">
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-lg bg-blue-500/15">
            <PenTool className="size-4 text-blue-400" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-white">
              Excalidraw Whiteboard
            </h1>
            <p className="text-[10px] text-white/40">
              Collaborative canvas — draw, sketch & brainstorm together
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/60 transition-all hover:bg-white/[0.08] hover:text-white">
            <Users className="size-3.5" />
            Invite
          </button>
          <button className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/60 transition-all hover:bg-white/[0.08] hover:text-white">
            <Share2 className="size-3.5" />
            Share
          </button>
          <button className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/60 transition-all hover:bg-white/[0.08] hover:text-white">
            <Download className="size-3.5" />
            Export
          </button>
        </div>
      </div>

      <div className="relative flex flex-1 overflow-hidden">
        {/* Left toolbar */}
        <div className="flex flex-col items-center gap-1 border-r border-white/[0.08] bg-white/[0.02] px-2 py-3">
          {TOOLS.map((tool) => (
            <button
              key={tool.label}
              onClick={() => setActiveTool(tool.label)}
              title={`${tool.label} (${tool.shortcut})`}
              className={cn(
                "flex size-9 items-center justify-center rounded-lg transition-all",
                activeTool === tool.label
                  ? "bg-blue-500/20 text-blue-400"
                  : "text-white/40 hover:bg-white/[0.08] hover:text-white/70",
              )}
            >
              <tool.icon className="size-4" />
            </button>
          ))}

          <div className="my-2 h-px w-6 bg-white/[0.08]" />

          <button
            title="Undo"
            className="flex size-9 items-center justify-center rounded-lg text-white/40 transition-all hover:bg-white/[0.08] hover:text-white/70"
          >
            <Undo2 className="size-4" />
          </button>
          <button
            title="Redo"
            className="flex size-9 items-center justify-center rounded-lg text-white/40 transition-all hover:bg-white/[0.08] hover:text-white/70"
          >
            <Redo2 className="size-4" />
          </button>
        </div>

        {/* Canvas area */}
        <div className="flex flex-1 flex-col items-center justify-center">
          {/* Dotted grid background */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          {/* Placeholder content */}
          <div className="relative z-10 flex flex-col items-center gap-4">
            <div className="flex size-20 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.03]">
              <PenTool className="size-9 text-white/20" />
            </div>
            <div className="text-center">
              <h2 className="text-lg font-semibold text-white/70">
                Start Drawing
              </h2>
              <p className="mt-1 max-w-sm text-xs leading-relaxed text-white/35">
                Use the tools on the left to draw shapes, lines, and text.
                Collaborate in real-time with your peers on a shared canvas.
              </p>
            </div>
            <div className="mt-2 flex items-center gap-3">
              <div className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5">
                <Layers className="size-3.5 text-white/40" />
                <span className="text-[11px] text-white/40">
                  Infinite Canvas
                </span>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5">
                <Users className="size-3.5 text-white/40" />
                <span className="text-[11px] text-white/40">
                  Real-time Collab
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── PiP video panels when in a call ── */}
        {isInCall && (
          <div className="absolute bottom-4 right-4 z-30 flex flex-col gap-2">
            {/* Your video */}
            <div className="relative h-28 w-44 overflow-hidden rounded-xl border border-white/15 bg-neutral-900 shadow-2xl">
              {callVideoOn ? (
                <video
                  ref={pipVideoRef}
                  className="size-full scale-x-[-1] object-cover"
                  autoPlay
                  muted
                  playsInline
                />
              ) : (
                <div className="flex size-full items-center justify-center">
                  <User className="size-6 text-white/30" />
                </div>
              )}
              <span className="absolute bottom-1.5 left-1.5 rounded bg-black/70 px-1.5 py-0.5 text-[9px] font-medium text-white/80">
                You
              </span>
            </div>
            {/* Peer video */}
            <div className="relative h-28 w-44 overflow-hidden rounded-xl border border-white/15 bg-neutral-900 shadow-2xl">
              <div className="flex size-full items-center justify-center">
                <User className="size-6 text-white/30" />
              </div>
              <span className="absolute bottom-1.5 left-1.5 rounded bg-black/70 px-1.5 py-0.5 text-[9px] font-medium text-white/80">
                Stranger
              </span>
            </div>
            {/* Leave call button */}
            <button
              onClick={handleLeaveCall}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-red-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-700"
            >
              <PhoneOff className="size-3.5" />
              Leave Call
            </button>
          </div>
        )}

        {/* Bottom zoom controls */}
        <div className="absolute bottom-4 left-16 flex items-center gap-1 rounded-lg border border-white/[0.08] bg-black/60 px-1.5 py-1 backdrop-blur-md">
          <button className="flex size-7 items-center justify-center rounded text-white/40 hover:bg-white/[0.08] hover:text-white/70">
            <ZoomOut className="size-3.5" />
          </button>
          <span className="px-2 text-[11px] text-white/50">100%</span>
          <button className="flex size-7 items-center justify-center rounded text-white/40 hover:bg-white/[0.08] hover:text-white/70">
            <ZoomIn className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
