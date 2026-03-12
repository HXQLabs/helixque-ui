"use client";

import * as React from "react";
import { useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import Script from "next/script";
import { User, PhoneOff } from "lucide-react";
import { useCall } from "@/contexts/call-context";

// Since client components get prerendered on server as well hence importing
// the excalidraw stuff dynamically with ssr false
const ExcalidrawWithClientOnly = dynamic(
  async () => (await import("@/components/excalidraw-wrapper")).default,
  {
    ssr: false,
  },
);

export default function WhiteboardPage() {
  const { isInCall, callVideoOn, setIsInCall } = useCall();

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
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      {/* Excalidraw canvas in a rounded container */}
      <div className="relative flex min-h-0 flex-1 overflow-hidden rounded-xl border border-border">
        <div className="custom-styles flex w-full h-full absolute inset-0 [&>div]:w-full! [&>div]:h-full!">
          <Script id="load-excalidraw-env" strategy="beforeInteractive">
            {`window["EXCALIDRAW_ASSET_PATH"] = window.origin;`}
          </Script>
          <ExcalidrawWithClientOnly />
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
    </div>
  );
}
