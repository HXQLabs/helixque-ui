"use client";

import { useEffect, useRef, useState } from "react";
import {
  IconMicrophone,
  IconMicrophoneOff,
  IconRefresh,
  IconUser,
  IconVideo,
  IconVideoOff,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { Button } from "@workspace/ui/components/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";
import Room from "./RTC/Room";
import { useHelixque } from "@workspace/state";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import PreferenceSelector from "./PreferenceSelector";
import { UserCriteriaSchema } from "@/lib/schemas";
import * as z from "zod";

export default function DeviceCheck() {
  const {
    name,
    localAudioTrack,
    localVideoTrack,
    joined,
    videoOn,
    audioOn,
    setLocalAudioTrack,
    setLocalVideoTrack,
    setJoined,
    setVideoOn,
    setAudioOn,
  } = useHelixque();

  const [preferences, setPreferences] = useState<z.infer<
    typeof UserCriteriaSchema
  > | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const localAudioTrackRef = useRef<MediaStreamTrack | null>(null);
  const localVideoTrackRef = useRef<MediaStreamTrack | null>(null);
  const getCamRef = useRef<() => Promise<void>>(() => Promise.resolve());

  const releaseTracks = () => {
    try {
      localAudioTrackRef.current?.stop();
    } catch {
      // ignore stopping audio track errors
    }
    try {
      localVideoTrackRef.current?.stop();
    } catch {
      // ignore stopping video track errors
    }
  };

  const getCam = async () => {
    try {
      releaseTracks();

      let videoTrack: MediaStreamTrack | null = null;
      let audioTrack: MediaStreamTrack | null = null;

      if (videoOn) {
        try {
          const videoStream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
          videoTrack = videoStream.getVideoTracks()[0] || null;
        } catch (error) {
          console.warn("Camera access denied or unavailable", error);
          toast.error("Camera Error", {
            description: "Could not access camera",
          });
        }
      }

      if (audioOn) {
        try {
          const audioStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });
          audioTrack = audioStream.getAudioTracks()[0] || null;
        } catch (error) {
          console.warn("Microphone access denied or unavailable", error);
          toast.error("Microphone Error", {
            description: "Could not access microphone",
          });
        }
      }

      localVideoTrackRef.current = videoTrack;
      localAudioTrackRef.current = audioTrack;
      setLocalVideoTrack(videoTrack);
      setLocalAudioTrack(audioTrack);

      if (videoRef.current) {
        videoRef.current.srcObject = videoTrack
          ? new MediaStream([videoTrack])
          : null;
        if (videoTrack) {
          await videoRef.current.play().catch(() => {});
        }
      }

      if (!videoOn && !audioOn && videoRef.current) {
        videoRef.current.srcObject = null;
      }
    } catch (error: any) {
      toast.error("Device Access Error", {
        description: error?.message || "Could not access camera/microphone",
      });
    }
  };

  useEffect(() => {
    let permissionStatus: PermissionStatus | null = null;

    async function watchCameraPermission() {
      try {
        permissionStatus = await navigator.permissions.query({
          name: "camera" as PermissionName,
        });
        permissionStatus.onchange = () => {
          if (permissionStatus?.state === "granted") {
            getCamRef.current();
          }
        };
      } catch (error) {
        console.warn("Permissions API not supported", error);
      }
    }

    watchCameraPermission();
    return () => {
      if (permissionStatus) permissionStatus.onchange = null;
      releaseTracks();
    };
  }, []);

  useEffect(() => {
    getCam();
  }, [videoOn, audioOn]);

  useEffect(() => {
    getCamRef.current = getCam;
  });

  const { data: session } = useSession();

  const handleJoin = async (data: z.infer<typeof UserCriteriaSchema>) => {
    try {
      const userId = (session?.user as any)?.id;
      if (userId) {
        const backendUrl =
          process.env.NEXT_PUBLIC_BACKEND_URI || "http://localhost:4001";
        await fetch(`${backendUrl}/users/${userId}/preferences`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        toast.success("Preferences saved");
      }
    } catch (error) {
      console.error("Failed to save preferences:", error);
      toast.error("Failed to save preferences");
    }
    setPreferences(data);
    setJoined(true);
  };

  if (joined) {
    const handleOnLeave = () => {
      setJoined(false);
      releaseTracks();
      setLocalAudioTrack(null);
      setLocalVideoTrack(null);
      setPreferences(null);
    };

    return (
      <Room
        name={name}
        localAudioTrack={localAudioTrack}
        localVideoTrack={localVideoTrack}
        audioOn={audioOn}
        videoOn={videoOn}
        onLeave={handleOnLeave}
        lookingFor={preferences}
      />
    );
  }

  return (
    <div className="flex h-[90vh] overflow-hidden gap-3 relative">
      {/* Video Preview - Left Side */}
      <div className="flex-1 flex flex-col bg-card/80 backdrop-blur-xl overflow-hidden border border-border/50 rounded-xl shadow-sm relative z-10 transition-all duration-200">
        <div className="border-b border-border/50 p-5 flex-shrink-0 bg-background/95 backdrop-blur-sm">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold tracking-tight">
              Ready to connect?
            </h2>
            <p className="text-sm text-muted-foreground">
              Check your devices before joining
            </p>
          </div>
        </div>

        <div className="flex-1 flex flex-col p-5 gap-4">
          <div className="relative flex-1 overflow-hidden rounded-lg border border-border/50 bg-black shadow-sm group/video">
            <div className="relative w-full h-full">
              {videoOn ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-muted/30 backdrop-blur-sm p-8 rounded-lg">
                    <IconUser className="h-16 w-16 text-muted-foreground/40" />
                  </div>
                </div>
              )}

              {/* Video info overlay */}
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <span className="rounded-lg bg-black/60 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-white ring-1 ring-white/10">
                  {name || "You"}
                </span>
                {!audioOn && (
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-red-500/80 backdrop-blur-sm px-2.5 py-1.5 text-xs font-medium text-white ring-1 ring-red-400/20">
                    <IconMicrophoneOff className="h-3 w-3" />
                    Muted
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Control buttons */}
          <div className="flex items-center justify-center gap-3 pb-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  onClick={() => setAudioOn((value) => !value)}
                  variant="ghost"
                  size="icon-lg"
                  className={`h-12 w-12 rounded-full transition-all duration-200 ring-1 ${
                    audioOn
                      ? "bg-muted text-foreground hover:bg-muted/80 ring-border/50 hover:ring-border"
                      : "bg-red-500 text-white hover:bg-red-600 ring-red-400/20"
                  }`}
                >
                  {audioOn ? (
                    <IconMicrophone className="h-5 w-5" />
                  ) : (
                    <IconMicrophoneOff className="h-5 w-5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {audioOn ? "Turn off microphone" : "Turn on microphone"}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  onClick={() => setVideoOn((value) => !value)}
                  variant="ghost"
                  size="icon-lg"
                  className={`h-12 w-12 rounded-full transition-all duration-200 ring-1 ${
                    videoOn
                      ? "bg-muted text-foreground hover:bg-muted/80 ring-border/50 hover:ring-border"
                      : "bg-red-500 text-white hover:bg-red-600 ring-red-400/20"
                  }`}
                >
                  {videoOn ? (
                    <IconVideo className="h-5 w-5" />
                  ) : (
                    <IconVideoOff className="h-5 w-5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {videoOn ? "Turn off camera" : "Turn on camera"}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  onClick={getCam}
                  variant="ghost"
                  size="icon-lg"
                  className="h-12 w-12 rounded-full bg-muted text-foreground hover:bg-muted/80 ring-1 ring-border/50 hover:ring-border transition-all duration-200"
                >
                  <IconRefresh className="h-5 w-5 transition-transform hover:rotate-180 duration-500" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Refresh devices</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Preferences Panel - Right Side */}
      <div className="w-[360px] flex-shrink-0 relative z-10 bg-card/80 backdrop-blur-xl border border-border/50 rounded-xl shadow-2xl shadow-black/5 overflow-hidden">
        <PreferenceSelector onJoin={handleJoin} />
      </div>
    </div>
  );
}
