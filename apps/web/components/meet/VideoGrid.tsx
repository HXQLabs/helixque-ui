"use client";

import type { RefObject } from "react";
import dynamic from "next/dynamic";
import Script from "next/script";
import {
  IconLoader2,
  IconMicrophoneOff,
  IconScreenShare,
  IconUser,
} from "@tabler/icons-react";
import { PenTool } from "lucide-react";

const ExcalidrawWithClientOnly = dynamic(
  async () => (await import("@/components/excalidraw-wrapper")).default,
  { ssr: false },
);

interface MediaState {
  micOn: boolean;
  camOn: boolean;
  screenShareOn: boolean;
}

interface PeerState {
  peerMicOn: boolean;
  peerCamOn: boolean;
  peerScreenShareOn: boolean;
}

interface VideoGridProps {
  localVideoRef: RefObject<HTMLVideoElement | null>;
  remoteVideoRef: RefObject<HTMLVideoElement | null>;
  localScreenShareRef: RefObject<HTMLVideoElement | null>;
  remoteScreenShareRef: RefObject<HTMLVideoElement | null>;
  showChat: boolean;
  showExcalidraw?: boolean;
  lobby: boolean;
  status: string;
  name: string;
  mediaState: MediaState;
  peerState: PeerState;
}

/* ── Small participant thumbnail ── */
function VideoTile({
  videoRef,
  name,
  isCamOn,
  isMuted,
  isMirrored,
}: {
  videoRef?: RefObject<HTMLVideoElement | null>;
  name: string;
  isCamOn: boolean;
  isMuted?: boolean;
  isMirrored?: boolean;
}) {
  return (
    <div className="relative aspect-video w-56 shrink-0 overflow-hidden rounded-xl border border-white/[0.08] bg-neutral-900 shadow-lg transition-all duration-200 hover:border-white/[0.14]">
      {videoRef && (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isMirrored}
          className={`absolute inset-0 h-full w-full object-cover ${
            isMirrored ? "scale-x-[-1]" : ""
          }`}
        />
      )}
      {!isCamOn && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-900">
          <div className="flex size-14 items-center justify-center rounded-full bg-gradient-to-b from-white/[0.08] to-white/[0.03]">
            <IconUser className="h-7 w-7 text-white/30" />
          </div>
        </div>
      )}
      <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
        <span className="rounded-md bg-black/60 backdrop-blur-sm px-2 py-0.5 text-[10px] font-medium text-white/80">
          {name}
        </span>
        {isMuted && (
          <span className="rounded-md bg-red-600/80 backdrop-blur-sm p-0.5">
            <IconMicrophoneOff className="h-3 w-3 text-white" />
          </span>
        )}
      </div>
    </div>
  );
}

/* ── Full-size video panel ── */
function FullVideoPanel({
  videoRef,
  name,
  isCamOn,
  isMuted,
  isSharing,
  isMirrored,
  isLobby,
  lobbyStatus,
}: {
  videoRef: RefObject<HTMLVideoElement | null>;
  name: string;
  isCamOn: boolean;
  isMuted?: boolean;
  isSharing?: boolean;
  isMirrored?: boolean;
  isLobby?: boolean;
  lobbyStatus?: string;
}) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-neutral-900 shadow-lg">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isMirrored}
        className={`absolute inset-0 h-full w-full object-cover ${
          isMirrored ? "scale-x-[-1]" : ""
        }`}
      />

      {isLobby && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-neutral-900">
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full border-2 border-primary/30" />
            <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
              <IconLoader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          </div>
          <span className="text-sm font-medium text-white/60">
            {lobbyStatus}
          </span>
        </div>
      )}

      {!isCamOn && !isLobby && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-900">
          <div className="flex size-20 items-center justify-center rounded-full bg-gradient-to-b from-white/[0.08] to-white/[0.03]">
            <IconUser className="h-10 w-10 text-white/30" />
          </div>
        </div>
      )}

      <div className="absolute bottom-3 left-3 flex items-center gap-2">
        <span className="rounded-lg bg-black/60 backdrop-blur-sm px-2.5 py-1 text-xs font-medium text-white ring-1 ring-white/10">
          {name}
        </span>
        {isMuted && (
          <span className="inline-flex items-center gap-1 rounded-lg bg-red-600/80 backdrop-blur-sm px-2 py-1 text-xs font-medium text-white ring-1 ring-red-400/20">
            <IconMicrophoneOff className="h-3 w-3" />
            muted
          </span>
        )}
        {isSharing && (
          <span className="inline-flex items-center gap-1 rounded-lg bg-blue-600/80 backdrop-blur-sm px-2 py-1 text-xs font-medium text-white ring-1 ring-blue-400/20">
            <IconScreenShare className="h-3 w-3" />
            sharing
          </span>
        )}
      </div>
    </div>
  );
}

export default function VideoGrid({
  localVideoRef,
  remoteVideoRef,
  localScreenShareRef,
  remoteScreenShareRef,
  showChat,
  showExcalidraw = false,
  lobby,
  status,
  name,
  mediaState,
  peerState,
}: VideoGridProps) {
  const { micOn, camOn, screenShareOn } = mediaState;
  const { peerMicOn, peerCamOn, peerScreenShareOn } = peerState;

  const hasCenterContent = peerScreenShareOn || screenShareOn || showExcalidraw;

  // ── Center Stage Layout (screen share / excalidraw) ──
  // Small video tiles on top, main content in center — just like Zoom/Teams/Meet
  if (hasCenterContent) {
    return (
      <div className="flex h-full flex-col gap-3">
        {/* Top strip: small participant thumbnails */}
        <div className="flex justify-center gap-3 flex-shrink-0">
          <VideoTile
            videoRef={localVideoRef}
            name={name || "You"}
            isCamOn={camOn}
            isMirrored
          />
          <VideoTile
            videoRef={remoteVideoRef}
            name={lobby ? "—" : "Peer"}
            isCamOn={peerCamOn && !lobby}
            isMuted={!lobby && !peerMicOn}
          />
        </div>

        {/* Center: main content area */}
        <div className="relative flex-1 overflow-hidden rounded-2xl border border-white/[0.08] bg-neutral-900 shadow-xl">
          {/* Screen Share: own */}
          {screenShareOn && (
            <>
              <video
                ref={localScreenShareRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 h-full w-full object-contain"
              />
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
                <div className="flex items-center gap-2 rounded-full bg-blue-600/90 backdrop-blur-sm px-4 py-1.5 text-xs font-medium text-white shadow-lg">
                  <span className="size-2 rounded-full bg-white animate-pulse" />
                  You are sharing your screen
                </div>
              </div>
            </>
          )}

          {/* Screen Share: peer */}
          {peerScreenShareOn && !screenShareOn && !showExcalidraw && (
            <video
              ref={remoteScreenShareRef}
              autoPlay
              playsInline
              className="absolute inset-0 h-full w-full object-contain"
            />
          )}

          {/* Excalidraw canvas (takes over center stage when active) */}
          {showExcalidraw && !screenShareOn && (
            <div className="absolute inset-0 z-10">
              <div className="custom-styles flex w-full h-full absolute inset-0 [&>div]:w-full! [&>div]:h-full!">
                <Script id="load-excalidraw-env-grid" strategy="beforeInteractive">
                  {`window["EXCALIDRAW_ASSET_PATH"] = window.origin;`}
                </Script>
                <ExcalidrawWithClientOnly />
              </div>
            </div>
          )}

          {/* Bottom label for screen share */}
          {(screenShareOn || (peerScreenShareOn && !showExcalidraw)) && (
            <div className="absolute bottom-4 left-4 z-20 rounded-lg bg-black/60 backdrop-blur-sm px-3 py-2 text-sm ring-1 ring-white/10">
              <span className="flex items-center gap-2 text-white/90">
                <IconScreenShare className="h-4 w-4" />
                {screenShareOn ? "Your Screen Share" : "Peer's Screen Share"}
              </span>
            </div>
          )}

          {/* Bottom label for Excalidraw */}
          {showExcalidraw && !screenShareOn && (
            <div className="absolute bottom-4 left-4 z-20 rounded-lg bg-black/60 backdrop-blur-sm px-3 py-2 text-sm ring-1 ring-white/10">
              <span className="flex items-center gap-2 text-white/90">
                <PenTool className="h-4 w-4" />
                Whiteboard
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Normal 2-up Video Grid ──
  const sidePanel = showChat;

  return (
    <div
      className={`grid h-full gap-3 transition-all duration-300 ${
        sidePanel
          ? "grid-cols-1 grid-rows-2 max-w-none"
          : "grid-cols-1 sm:grid-cols-2 grid-rows-1"
      }`}
    >
      {/* Remote/Peer Video */}
      <FullVideoPanel
        videoRef={remoteVideoRef}
        name={lobby ? "—" : "Peer"}
        isCamOn={peerCamOn}
        isMuted={!lobby && !peerMicOn}
        isSharing={peerScreenShareOn}
        isLobby={lobby}
        lobbyStatus={status}
      />

      {/* Local/Your Video */}
      <FullVideoPanel
        videoRef={localVideoRef}
        name={name || "You"}
        isCamOn={camOn}
        isSharing={screenShareOn}
        isMirrored
      />
    </div>
  );
}

export type { MediaState, PeerState };
