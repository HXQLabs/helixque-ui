"use client";

import { useEffect, useRef } from "react";
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
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";
import Room from "./Room";
import { useHelixque } from "@workspace/state";

export default function DeviceCheck() {
  const {
    name,
    localAudioTrack,
    localVideoTrack,
    joined,
    videoOn,
    audioOn,
    setName,
    setLocalAudioTrack,
    setLocalVideoTrack,
    setJoined,
    setVideoOn,
    setAudioOn,
  } = useHelixque();

  const videoRef = useRef<HTMLVideoElement>(null);
  const localAudioTrackRef = useRef<MediaStreamTrack | null>(null);
  const localVideoTrackRef = useRef<MediaStreamTrack | null>(null);
  const getCamRef = useRef<() => Promise<void>>(() => Promise.resolve());

  const releaseTracks = () => {
    try {
      localAudioTrackRef.current?.stop();
    } catch {}
    try {
      localVideoTrackRef.current?.stop();
    } catch {}
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getCam();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoOn, audioOn]);

  useEffect(() => {
    getCamRef.current = getCam;
  });

  if (joined) {
    const handleOnLeave = () => {
      setJoined(false);
      releaseTracks();
      setLocalAudioTrack(null);
      setLocalVideoTrack(null);
    };

    return (
      <Room
        name={name}
        localAudioTrack={localAudioTrack}
        localVideoTrack={localVideoTrack}
        audioOn={audioOn}
        videoOn={videoOn}
        onLeave={handleOnLeave}
      />
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-6 py-8">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-12 space-y-1 text-center">
          <h1 className="text-4xl font-bold text-white">Ready to connect?</h1>
          <p className="text-sm text-neutral-400">
            Check your camera and microphone before joining
          </p>
        </div>

        <div className="grid items-stretch gap-8 lg:grid-cols-2">
          <div className="flex h-full flex-col space-y-4">
            <div className="relative flex-1 overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
              <div className="relative aspect-video w-full bg-black">
                {videoOn ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-black">
                    <IconUser className="h-16 w-16 text-white/70" />
                  </div>
                )}

                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                  <span className="rounded-md bg-black/60 px-2 py-1 text-xs text-white">
                    {name || "You"}
                  </span>
                  {!audioOn && (
                    <span className="inline-flex items-center gap-1 rounded bg-red-600/80 px-1.5 py-0.5 text-xs text-white">
                      <IconMicrophoneOff className="h-3 w-3" />
                      muted
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    onClick={() => setAudioOn((value) => !value)}
                    variant="ghost"
                    size="icon-lg"
                    className={`h-11 w-11 rounded-full ${
                      audioOn
                        ? "bg-white/10 text-white hover:bg-white/20"
                        : "bg-red-600 text-white hover:bg-red-500"
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
                    className={`h-11 w-11 rounded-full ${
                      videoOn
                        ? "bg-white/10 text-white hover:bg-white/20"
                        : "bg-red-600 text-white hover:bg-red-500"
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
                    className="h-11 w-11 rounded-full bg-white/10 text-white hover:bg-white/20"
                  >
                    <IconRefresh className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Refresh devices</TooltipContent>
              </Tooltip>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-neutral-900/50 p-8 shadow-[0_10px_40px_rgba(0,0,0,0.5)] backdrop-blur">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-white">
                    Join the conversation
                  </h2>
                  <div className="space-y-2">
                    <Label
                      htmlFor="display-name"
                      className="text-sm text-gray-300"
                    >
                      What should we call you?
                    </Label>
                    <Input
                      id="display-name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Enter your name"
                      className="h-12 rounded-xl border-white/10 bg-neutral-800/50 text-white placeholder:text-neutral-500"
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={() => setJoined(true)}
                    disabled={!name.trim()}
                    className="h-12 w-full rounded-xl bg-white text-black hover:bg-white/90 disabled:opacity-50"
                  >
                    Join Meeting
                  </Button>
                  <p className="text-center text-xs text-neutral-500">
                    By joining, you agree to our terms of service and privacy
                    policy
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
