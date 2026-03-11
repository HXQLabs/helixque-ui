"use client";

import {
  IconFlag,
  IconMessage,
  IconMicrophone,
  IconMicrophoneOff,
  IconPhoneOff,
  IconRefresh,
  IconScreenShare,
  IconScreenShareOff,
  IconUserOff,
  IconVideo,
  IconVideoOff,
} from "@tabler/icons-react";
import { Button } from "@workspace/ui/components/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";

import type { MediaState } from "./VideoGrid";

type ControlBarProps = {
  mediaState: MediaState;
  showChat: boolean;
  onToggleMic: () => void;
  onToggleCam: () => void;
  onToggleScreenShare: () => void;
  onToggleChat: () => void;
  onRecheck: () => void;
  onNext: () => void;
  onLeave: () => void;
  onReport: () => void;
};

export default function ControlBar({
  mediaState,
  showChat,
  onToggleMic,
  onToggleCam,
  onToggleScreenShare,
  onToggleChat,
  onRecheck,
  onNext,
  onLeave,
  onReport,
}: ControlBarProps) {
  const { micOn, camOn, screenShareOn } = mediaState;

  const iconButtonClass = "rounded-full h-11 w-11";

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 h-20">
      <div className="relative flex h-full items-center justify-center">
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-2 py-1.5 backdrop-blur">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onRecheck}
                variant="ghost"
                size="icon-lg"
                className={`${iconButtonClass} bg-white/10 text-white hover:bg-white/20`}
              >
                <IconRefresh className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Recheck</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onToggleMic}
                variant="ghost"
                size="icon-lg"
                className={`${iconButtonClass} ${
                  micOn
                    ? "bg-white/10 text-white hover:bg-white/20"
                    : "bg-red-600 text-white hover:bg-red-500"
                }`}
              >
                {micOn ? (
                  <IconMicrophone className="h-5 w-5" />
                ) : (
                  <IconMicrophoneOff className="h-5 w-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {micOn ? "Turn off microphone" : "Turn on microphone"}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onToggleCam}
                variant="ghost"
                size="icon-lg"
                className={`${iconButtonClass} ${
                  camOn
                    ? "bg-white/10 text-white hover:bg-white/20"
                    : "bg-red-600 text-white hover:bg-red-500"
                }`}
              >
                {camOn ? (
                  <IconVideo className="h-5 w-5" />
                ) : (
                  <IconVideoOff className="h-5 w-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {camOn ? "Turn off camera" : "Turn on camera"}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onToggleScreenShare}
                variant="ghost"
                size="icon-lg"
                className={`${iconButtonClass} ${
                  screenShareOn
                    ? "bg-blue-600 text-white hover:bg-blue-500"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {screenShareOn ? (
                  <IconScreenShareOff className="h-5 w-5" />
                ) : (
                  <IconScreenShare className="h-5 w-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {screenShareOn ? "Stop screen share" : "Start screen share"}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onNext}
                variant="ghost"
                size="icon-lg"
                className={`${iconButtonClass} bg-white/10 text-white hover:bg-white/20`}
              >
                <IconUserOff className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Next match</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onLeave}
                variant="destructive"
                className="flex h-11 items-center gap-2 rounded-full px-6"
              >
                <IconPhoneOff className="h-5 w-5" />
                <span className="hidden text-sm font-medium sm:inline">
                  Leave
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Leave call</TooltipContent>
          </Tooltip>
        </div>

        <div className="absolute right-6">
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-2 py-1.5 backdrop-blur">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={onToggleChat}
                  variant="ghost"
                  size="icon-lg"
                  className={`${iconButtonClass} ${
                    showChat
                      ? "bg-indigo-600 text-white hover:bg-indigo-500"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  <IconMessage className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {showChat ? "Close chat" : "Open chat"}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={onReport}
                  variant="ghost"
                  size="icon-lg"
                  className={`${iconButtonClass} bg-white/10 text-white hover:bg-white/20`}
                >
                  <IconFlag className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Report user</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
}
