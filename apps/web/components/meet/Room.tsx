"use client";

import { useEffect, useRef } from "react";
import { io, type Socket } from "socket.io-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import ChatPanel from "./chat/ChatPanel";
import ControlBar from "./ControlBar";
import TimeoutAlert from "./TimeoutAlert";
import VideoGrid from "./VideoGrid";
import { useMediaState, usePeerState, useRoomState } from "./hooks";
import {
  detachLocalPreview,
  ensureRemoteStream,
  stopProvidedTracks,
  teardownPeers,
  toggleCameraTrack,
} from "./webrtc-utils";

const URL = process.env.NEXT_PUBLIC_BACKEND_URI || "http://localhost:5001";

type RoomProps = {
  name: string;
  localAudioTrack: MediaStreamTrack | null;
  localVideoTrack: MediaStreamTrack | null;
  audioOn?: boolean;
  videoOn?: boolean;
  onLeave?: () => void;
};

export default function Room({
  name,
  localAudioTrack,
  localVideoTrack,
  audioOn,
  videoOn,
  onLeave,
}: RoomProps) {
  const router = useRouter();

  const mediaState = useMediaState(audioOn, videoOn);
  const peerState = usePeerState();
  const roomState = useRoomState();

  const { micOn, setMicOn, camOn, setCamOn, screenShareOn, setScreenShareOn } =
    mediaState;
  const {
    peerMicOn,
    setPeerMicOn,
    peerCamOn,
    setPeerCamOn,
    peerScreenShareOn,
    setPeerScreenShareOn,
  } = peerState;
  const {
    showChat,
    setShowChat,
    roomId,
    setRoomId,
    mySocketId,
    setMySocketId,
    lobby,
    setLobby,
    status,
    setStatus,
    showTimeoutAlert,
    setShowTimeoutAlert,
    timeoutMessage,
    setTimeoutMessage,
  } = roomState;

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const localScreenShareRef = useRef<HTMLVideoElement>(null);
  const remoteScreenShareRef = useRef<HTMLVideoElement>(null);

  const socketRef = useRef<Socket | null>(null);
  const peerIdRef = useRef<string | null>(null);
  const sendingPcRef = useRef<RTCPeerConnection | null>(null);
  const receivingPcRef = useRef<RTCPeerConnection | null>(null);
  const joinedRef = useRef(false);

  const videoSenderRef = useRef<RTCRtpSender | null>(null);
  const currentVideoTrackRef = useRef<MediaStreamTrack | null>(localVideoTrack);
  const currentScreenShareTrackRef = useRef<MediaStreamTrack | null>(null);
  const localScreenShareStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);

  const senderIceCandidatesQueue = useRef<RTCIceCandidate[]>([]);
  const receiverIceCandidatesQueue = useRef<RTCIceCandidate[]>([]);

  const ensureRemoteStreamLocal = () => {
    ensureRemoteStream(
      remoteStreamRef,
      remoteVideoRef,
      remoteAudioRef,
      remoteScreenShareRef,
      peerScreenShareOn,
    );
  };

  const processQueuedIceCandidates = async (
    pc: RTCPeerConnection,
    queue: RTCIceCandidate[],
  ) => {
    while (queue.length > 0) {
      const candidate = queue.shift();
      if (candidate) {
        try {
          await pc.addIceCandidate(candidate);
        } catch {}
      }
    }
  };

  const setupPeerConnection = async (
    pc: RTCPeerConnection,
    isOffer: boolean,
    rid: string,
    socket: Socket,
  ) => {
    videoSenderRef.current = null;

    if (localAudioTrack && localAudioTrack.readyState === "live" && micOn) {
      pc.addTrack(localAudioTrack);
    }

    let videoTrack = currentVideoTrackRef.current;
    if (!videoTrack || videoTrack.readyState === "ended") {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        const track = stream.getVideoTracks()[0] ?? null;
        if (track) {
          videoTrack = track;
          currentVideoTrackRef.current = track;
        } else {
          videoTrack = null;
        }
      } catch (error) {
        console.error("Error creating video track", error);
        videoTrack = null;
      }
    }

    if (videoTrack && videoTrack.readyState === "live") {
      const sender = pc.addTrack(videoTrack);
      videoSenderRef.current = sender;
    }

    ensureRemoteStreamLocal();

    pc.ontrack = (event) => {
      if (!remoteStreamRef.current) {
        remoteStreamRef.current = new MediaStream();
      }

      if (event.track.kind === "video") {
        remoteStreamRef.current
          .getVideoTracks()
          .forEach((track) => remoteStreamRef.current?.removeTrack(track));
      }

      remoteStreamRef.current.addTrack(event.track);
      ensureRemoteStreamLocal();
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("add-ice-candidate", {
          candidate: event.candidate,
          type: isOffer ? "sender" : "receiver",
          roomId: rid,
        });
      }
    };
  };

  const handleRetryMatchmaking = () => {
    if (socketRef.current) {
      socketRef.current.emit("queue:retry");
      setShowTimeoutAlert(false);
      setStatus("Searching for the best match…");
    }
  };

  const handleCancelTimeout = () => {
    if (socketRef.current) {
      socketRef.current.emit("queue:leave");
    }
    setShowTimeoutAlert(false);
    setLobby(false);
    window.location.reload();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      handleCancelTimeout();
    }
  };

  const toggleMic = () => {
    const next = !micOn;
    setMicOn(next);
    try {
      if (localAudioTrack) localAudioTrack.enabled = next;
    } catch {}
  };

  const toggleCam = async () => {
    await toggleCameraTrack(
      camOn,
      setCamOn,
      currentVideoTrackRef,
      localVideoRef,
      videoSenderRef,
      sendingPcRef,
      receivingPcRef,
      roomId,
      socketRef,
      localVideoTrack,
    );
  };

  const toggleScreenShare = async () => {
    const turningOn = !screenShareOn;
    setScreenShareOn(turningOn);

    try {
      const socket = socketRef.current;

      if (turningOn) {
        try {
          const screenStream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: true,
          });

          const screenTrack = screenStream.getVideoTracks()[0] ?? null;
          if (!screenTrack) {
            toast.error("Screen share error", {
              description: "Could not access screen share stream",
            });
            setScreenShareOn(false);
            return;
          }
          currentScreenShareTrackRef.current = screenTrack;
          localScreenShareStreamRef.current = screenStream;

          if (localScreenShareRef.current) {
            localScreenShareRef.current.srcObject = screenStream;
            await localScreenShareRef.current.play().catch(() => {});
          }

          if (videoSenderRef.current && screenTrack) {
            await videoSenderRef.current.replaceTrack(screenTrack);
            toast.success("Screen share started", {
              description: "You are now sharing your screen",
            });
          }

          if (socket && roomId) {
            socket.emit("media-state-change", {
              isScreenSharing: true,
              micOn,
              camOn: false,
            });
          }

          screenTrack.onended = async () => {
            setScreenShareOn(false);

            let cameraTrack = currentVideoTrackRef.current;
            if (!cameraTrack || cameraTrack.readyState === "ended") {
              if (camOn) {
                try {
                  const cameraStream =
                    await navigator.mediaDevices.getUserMedia({ video: true });
                  cameraTrack = cameraStream.getVideoTracks()[0] ?? null;
                  currentVideoTrackRef.current = cameraTrack;
                } catch (error) {
                  console.error(
                    "Error getting camera after screen share",
                    error,
                  );
                  cameraTrack = null;
                }
              }
            }

            if (videoSenderRef.current) {
              await videoSenderRef.current.replaceTrack(
                camOn ? cameraTrack : null,
              );
            }

            if (localScreenShareRef.current) {
              localScreenShareRef.current.srcObject = null;
            }
            currentScreenShareTrackRef.current = null;
            localScreenShareStreamRef.current = null;

            toast.success("Screen share stopped", {
              description: "You have stopped sharing your screen",
            });

            if (socket && roomId) {
              socket.emit("media-state-change", {
                isScreenSharing: false,
                micOn,
                camOn,
              });
            }
          };
        } catch (error: any) {
          toast.error("Screen share error", {
            description: error?.message || "Failed to start screen sharing",
          });
          setScreenShareOn(false);
        }
      } else {
        if (currentScreenShareTrackRef.current) {
          currentScreenShareTrackRef.current.stop();
        }
        if (localScreenShareStreamRef.current) {
          localScreenShareStreamRef.current
            .getTracks()
            .forEach((track) => track.stop());
          localScreenShareStreamRef.current = null;
        }
        if (localScreenShareRef.current) {
          localScreenShareRef.current.srcObject = null;
        }

        let cameraTrack = currentVideoTrackRef.current;
        if (!cameraTrack || cameraTrack.readyState === "ended") {
          if (camOn) {
            try {
              const cameraStream = await navigator.mediaDevices.getUserMedia({
                video: true,
              });
              cameraTrack = cameraStream.getVideoTracks()[0] ?? null;
              currentVideoTrackRef.current = cameraTrack;

              if (localVideoRef.current) {
                const mediaStream =
                  (localVideoRef.current.srcObject as MediaStream) ||
                  new MediaStream();
                mediaStream
                  .getVideoTracks()
                  .forEach((track) => mediaStream.removeTrack(track));
                if (cameraTrack) {
                  mediaStream.addTrack(cameraTrack);
                }
                if (!localVideoRef.current.srcObject)
                  localVideoRef.current.srcObject = mediaStream;
                await localVideoRef.current.play().catch(() => {});
              }
            } catch (error: any) {
              toast.error("Camera error", {
                description:
                  "Failed to restore camera after stopping screen share",
              });
              cameraTrack = null;
            }
          }
        }

        if (videoSenderRef.current) {
          await videoSenderRef.current.replaceTrack(camOn ? cameraTrack : null);
        }

        if (socket && roomId) {
          socket.emit("media-state-change", {
            isScreenSharing: false,
            micOn,
            camOn,
          });
        }

        currentScreenShareTrackRef.current = null;
      }
    } catch (error: any) {
      toast.error("Screen share error", {
        description: error?.message || "Failed to toggle screen sharing",
      });
      setScreenShareOn(false);
    }
  };

  const handleNext = () => {
    const socket = socketRef.current;
    if (!socket) return;

    const actualCamState = Boolean(
      currentVideoTrackRef.current &&
        currentVideoTrackRef.current.readyState === "live" &&
        camOn,
    );
    const actualMicState = Boolean(
      localAudioTrack && localAudioTrack.readyState === "live" && micOn,
    );

    try {
      remoteStreamRef.current?.getTracks().forEach((track) => track.stop());
    } catch {}
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    if (remoteAudioRef.current) remoteAudioRef.current.srcObject = null;

    socket.emit("queue:next");
    handleNextConnection(actualCamState, actualMicState, "next");
  };

  const handleLeave = () => {
    const socket = socketRef.current;

    try {
      socket?.emit("queue:leave");
    } catch {}

    if (screenShareOn) {
      if (currentScreenShareTrackRef.current) {
        try {
          currentScreenShareTrackRef.current.stop();
        } catch {}
      }
      if (localScreenShareStreamRef.current) {
        try {
          localScreenShareStreamRef.current
            .getTracks()
            .forEach((track) => track.stop());
        } catch {}
      }
    }

    teardownPeers(
      "teardown",
      sendingPcRef,
      receivingPcRef,
      remoteStreamRef,
      remoteVideoRef,
      remoteAudioRef,
      videoSenderRef,
      localScreenShareStreamRef,
      currentScreenShareTrackRef,
      localScreenShareRef,
      {
        setShowChat,
        setPeerMicOn,
        setPeerCamOn,
        setScreenShareOn,
        setPeerScreenShareOn,
        setLobby,
        setStatus,
      },
    );
    stopProvidedTracks(localVideoTrack, localAudioTrack, currentVideoTrackRef);
    detachLocalPreview(localVideoRef);

    try {
      socket?.disconnect();
    } catch {}
    socketRef.current = null;

    try {
      router.replace("/");
    } catch (error) {
      console.error("Failed to navigate after leaving", error);
    }

    try {
      onLeave?.();
    } catch {}
  };

  const handleRecheck = () => {
    setLobby(true);
    setStatus("Rechecking…");
  };

  const handleReport = (reason?: string) => {
    const socket = socketRef.current;
    const reporter = mySocketId || socket?.id || null;
    const reported = peerIdRef.current || null;
    try {
      if (socket && reporter) {
        socket.emit("report", {
          reporterId: reporter,
          reportedId: reported,
          roomId,
          reason,
        });
        toast.success("Report submitted", {
          description: "Thank you. We received your report.",
        });
      } else {
        toast.error("Report failed", {
          description: "Could not submit report (no socket).",
        });
      }
    } catch (error) {
      console.error("Report emit error", error);
      toast.error("Report failed", { description: "An error occurred." });
    }
  };

  function handleNextConnection(
    currentCamState: boolean,
    _currentMicState: boolean,
    reason: "next" | "partner-left" = "next",
  ) {
    senderIceCandidatesQueue.current = [];
    receiverIceCandidatesQueue.current = [];

    teardownPeers(
      reason,
      sendingPcRef,
      receivingPcRef,
      remoteStreamRef,
      remoteVideoRef,
      remoteAudioRef,
      videoSenderRef,
      localScreenShareStreamRef,
      currentScreenShareTrackRef,
      localScreenShareRef,
      {
        setShowChat,
        setPeerMicOn,
        setPeerCamOn,
        setScreenShareOn: (_value: boolean) => {},
        setPeerScreenShareOn,
        setLobby,
        setStatus,
      },
    );

    if (!currentCamState) {
      if (currentVideoTrackRef.current) {
        try {
          currentVideoTrackRef.current.stop();
          currentVideoTrackRef.current = null;
        } catch {}
      }

      if (localVideoRef.current && localVideoRef.current.srcObject) {
        const mediaStream = localVideoRef.current.srcObject as MediaStream;
        mediaStream.getVideoTracks().forEach((track) => {
          try {
            track.stop();
            mediaStream.removeTrack(track);
          } catch {}
        });
      }
    }
  }

  useEffect(() => {
    if (localVideoTrack) {
      currentVideoTrackRef.current = localVideoTrack;
    }
  }, [localVideoTrack]);

  useEffect(() => {
    const element = localVideoRef.current;
    if (!element) return;
    if (!localVideoTrack && !localAudioTrack) return;

    const stream = new MediaStream([
      ...(localVideoTrack ? [localVideoTrack] : []),
      ...(localAudioTrack ? [localAudioTrack] : []),
    ]);

    element.srcObject = stream;
    element.muted = true;
    element.playsInline = true;

    const tryPlay = () => element.play().catch(() => {});
    tryPlay();

    const onceClick = () => {
      tryPlay();
      window.removeEventListener("click", onceClick);
    };

    window.addEventListener("click", onceClick, { once: true });
    return () => window.removeEventListener("click", onceClick);
  }, [localAudioTrack, localVideoTrack]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!roomId || !socketRef.current) return;
    socketRef.current.emit("media:state", { roomId, state: { micOn, camOn } });
  }, [micOn, camOn, roomId]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (socketRef.current) return;

    const socket = io(URL, {
      transports: ["websocket"],
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      auth: { name },
    });

    socketRef.current = socket;
    socket.connect();

    socket.on("connect", () => {
      setMySocketId(socket.id ?? null);
      if (!joinedRef.current) {
        joinedRef.current = true;
      }
    });

    socket.on("send-offer", async ({ roomId: rid }) => {
      setRoomId(rid);
      setLobby(false);
      setStatus("Connecting…");

      setTimeout(() => {
        toast.success("Connected!", {
          id: `connected-toast-${rid}`,
          description: "You've been connected to someone",
        });
        setTimeout(() => {
          socket.emit("chat:join", { roomId: rid, name });
        }, 100);
      }, 100);

      const pc = new RTCPeerConnection();
      sendingPcRef.current = pc;
      peerIdRef.current = rid;

      await setupPeerConnection(pc, true, rid, socket);

      const offer = await pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });
      await pc.setLocalDescription(offer);
      socket.emit("offer", { sdp: offer, roomId: rid });
    });

    socket.on("offer", async ({ roomId: rid, sdp: remoteSdp }) => {
      setRoomId(rid);
      setLobby(false);
      setStatus("Connecting…");

      setTimeout(() => {
        toast.success("Connected!", {
          id: `connected-toast-${rid}`,
          description: "You've been connected to someone",
        });
        setTimeout(() => {
          socket.emit("chat:join", { roomId: rid, name });
        }, 100);
      }, 100);

      const pc = new RTCPeerConnection();
      receivingPcRef.current = pc;
      peerIdRef.current = rid;

      await setupPeerConnection(pc, false, rid, socket);
      await pc.setRemoteDescription(new RTCSessionDescription(remoteSdp));
      await processQueuedIceCandidates(pc, receiverIceCandidatesQueue.current);

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("answer", { roomId: rid, sdp: answer });
    });

    socket.on("answer", async ({ sdp: remoteSdp }) => {
      const pc = sendingPcRef.current;
      if (!pc) return;
      await pc.setRemoteDescription(new RTCSessionDescription(remoteSdp));
      await processQueuedIceCandidates(pc, senderIceCandidatesQueue.current);
    });

    socket.on("add-ice-candidate", async ({ candidate, type }) => {
      try {
        const ice = new RTCIceCandidate(candidate);
        if (type === "sender") {
          const pc = receivingPcRef.current;
          if (pc && pc.remoteDescription) {
            await pc.addIceCandidate(ice);
          } else {
            receiverIceCandidatesQueue.current.push(ice);
          }
        } else {
          const pc = sendingPcRef.current;
          if (pc && pc.remoteDescription) {
            await pc.addIceCandidate(ice);
          } else {
            senderIceCandidatesQueue.current.push(ice);
          }
        }
      } catch (error) {
        console.error("addIceCandidate error", error);
      }
    });

    socket.on("renegotiate-offer", async ({ sdp }) => {
      const pc = receivingPcRef.current;
      if (pc) {
        await pc.setRemoteDescription(new RTCSessionDescription(sdp));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit("renegotiate-answer", {
          roomId,
          sdp: answer,
          role: "answerer",
        });
      }
    });

    socket.on("renegotiate-answer", async ({ sdp }) => {
      const pc = sendingPcRef.current;
      if (pc) {
        await pc.setRemoteDescription(new RTCSessionDescription(sdp));
      }
    });

    socket.on("lobby", () => {
      setLobby(true);
      setStatus("Waiting to connect you to someone…");
    });

    socket.on("queue:waiting", () => {
      setLobby(true);
      setStatus("Searching for the best match…");
    });

    socket.on("queue:timeout", ({ message }: { message: string }) => {
      setTimeoutMessage(message);
      setShowTimeoutAlert(true);
      setLobby(true);
      setStatus("No match found. Try again?");
    });

    socket.on("partner:left", () => {
      toast.warning("Partner left", {
        id: `partner-left-toast-${Date.now()}`,
        description: "Your partner has left the call",
      });
      const actualCamState = Boolean(
        currentVideoTrackRef.current &&
          currentVideoTrackRef.current.readyState === "live" &&
          camOn,
      );
      const actualMicState = Boolean(
        localAudioTrack && localAudioTrack.readyState === "live" && micOn,
      );
      handleNextConnection(actualCamState, actualMicState, "partner-left");
    });

    socket.on(
      "peer:media-state",
      ({ state }: { state: { micOn?: boolean; camOn?: boolean } }) => {
        if (typeof state?.micOn === "boolean") setPeerMicOn(state.micOn);
        if (typeof state?.camOn === "boolean") setPeerCamOn(state.camOn);
      },
    );

    socket.on(
      "peer-media-state-change",
      ({
        isScreenSharing,
        micOn: peerMic,
        camOn: peerCam,
      }: {
        isScreenSharing?: boolean;
        micOn?: boolean;
        camOn?: boolean;
      }) => {
        if (typeof isScreenSharing === "boolean") {
          setPeerScreenShareOn(isScreenSharing);
        }
        if (typeof peerMic === "boolean") {
          setPeerMicOn(peerMic);
        }
        if (typeof peerCam === "boolean") {
          setPeerCamOn(peerCam);
        }
      },
    );

    const onBeforeUnload = () => {
      try {
        socket.emit("queue:leave");
      } catch {}
      stopProvidedTracks(
        localVideoTrack,
        localAudioTrack,
        currentVideoTrackRef,
      );
      detachLocalPreview(localVideoRef);
    };

    window.addEventListener("beforeunload", onBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      socket.disconnect();
      socketRef.current = null;
      detachLocalPreview(localVideoRef);
    };
  }, [
    name,
    localAudioTrack,
    localVideoTrack,
    camOn,
    micOn,
    setPeerCamOn,
    setPeerMicOn,
    setPeerScreenShareOn,
    setShowChat,
    setStatus,
  ]);

  return (
    <div className="relative flex min-h-screen flex-col bg-neutral-950 text-white">
      <main className="relative flex-1">
        <div
          className={`relative mx-auto h-[calc(100vh-80px)] max-w-[1400px] pt-4 transition-all duration-300 ${
            showChat
              ? "px-2 pr-[500px] sm:pr-[500px] md:pr-[540px] lg:pr-[600px]"
              : "px-4"
          }`}
        >
          <VideoGrid
            localVideoRef={localVideoRef}
            remoteVideoRef={remoteVideoRef}
            localScreenShareRef={localScreenShareRef}
            remoteScreenShareRef={remoteScreenShareRef}
            showChat={showChat}
            lobby={lobby}
            status={status}
            name={name}
            mediaState={mediaState}
            peerState={peerState}
          />

          <audio ref={remoteAudioRef} className="hidden" />
        </div>

        <div
          className={`fixed bottom-20 right-0 top-4 w-full transform border border-white/10 border-r-0 bg-neutral-950 backdrop-blur transition-transform duration-300 sm:w-[500px] md:w-[540px] lg:w-[600px] ${
            showChat ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="h-full rounded-l-2xl">
            <ChatPanel
              socket={socketRef.current}
              roomId={roomId}
              name={name}
              mySocketId={mySocketId}
              collapsed={false}
              isOpen={showChat}
            />
          </div>
        </div>
      </main>

      <ControlBar
        mediaState={mediaState}
        showChat={showChat}
        onToggleMic={toggleMic}
        onToggleCam={toggleCam}
        onToggleScreenShare={toggleScreenShare}
        onToggleChat={() => setShowChat((value) => !value)}
        onRecheck={handleRecheck}
        onNext={handleNext}
        onLeave={handleLeave}
        onReport={() => handleReport()}
      />

      <TimeoutAlert
        show={showTimeoutAlert}
        message={timeoutMessage}
        onRetry={handleRetryMatchmaking}
        onCancel={handleCancelTimeout}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
