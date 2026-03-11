"use client";

import type { RefObject } from "react";
import { toast } from "sonner";

type MediaTrackRef = RefObject<MediaStreamTrack | null>;
type MediaStreamRef = RefObject<MediaStream | null>;
type VideoRef = RefObject<HTMLVideoElement | null>;
type AudioRef = RefObject<HTMLAudioElement | null>;

type TearDownSetters = {
  setShowChat: (value: boolean) => void;
  setPeerMicOn: (value: boolean) => void;
  setPeerCamOn: (value: boolean) => void;
  setScreenShareOn: (value: boolean) => void;
  setPeerScreenShareOn: (value: boolean) => void;
  setLobby: (value: boolean) => void;
  setStatus: (value: string) => void;
};

export function ensureRemoteStream(
  remoteStreamRef: MediaStreamRef,
  remoteVideoRef: VideoRef,
  remoteAudioRef: AudioRef,
  remoteScreenShareRef: VideoRef,
  peerScreenShareOn: boolean,
) {
  if (!remoteStreamRef.current) {
    remoteStreamRef.current = new MediaStream();
  }

  const remoteVideo = remoteVideoRef.current;
  if (remoteVideo && remoteVideo.srcObject !== remoteStreamRef.current) {
    remoteVideo.srcObject = remoteStreamRef.current;
    remoteVideo.playsInline = true;
    remoteVideo.play().catch(() => {});
  }

  const remoteScreenVideo = remoteScreenShareRef.current;
  if (
    peerScreenShareOn &&
    remoteScreenVideo &&
    remoteScreenVideo.srcObject !== remoteStreamRef.current
  ) {
    remoteScreenVideo.srcObject = remoteStreamRef.current;
    remoteScreenVideo.playsInline = true;
    remoteScreenVideo.play().catch(() => {});
  }

  const remoteAudio = remoteAudioRef.current;
  if (remoteAudio && remoteAudio.srcObject !== remoteStreamRef.current) {
    remoteAudio.srcObject = remoteStreamRef.current;
    remoteAudio.autoplay = true;
    remoteAudio.muted = false;
    remoteAudio.play().catch(() => {});
  }
}

export function detachLocalPreview(localVideoRef: VideoRef) {
  const localStream = localVideoRef.current?.srcObject as MediaStream | null;
  if (localStream) {
    localStream.getTracks().forEach((track) => {
      try {
        track.stop();
      } catch {}
    });
  }

  if (localVideoRef.current) {
    try {
      localVideoRef.current.pause();
    } catch {}
    localVideoRef.current.srcObject = null;
  }
}

export function stopProvidedTracks(
  localVideoTrack: MediaStreamTrack | null,
  localAudioTrack: MediaStreamTrack | null,
  currentVideoTrackRef: MediaTrackRef,
) {
  if (localVideoTrack) {
    try {
      localVideoTrack.stop();
    } catch {}
  }

  if (localAudioTrack) {
    try {
      localAudioTrack.stop();
    } catch {}
  }

  const currentTrack = currentVideoTrackRef.current;
  if (currentTrack) {
    try {
      currentTrack.stop();
    } catch {}
    currentVideoTrackRef.current = null;
  }
}

export function teardownPeers(
  reason: string,
  sendingPcRef: RefObject<RTCPeerConnection | null>,
  receivingPcRef: RefObject<RTCPeerConnection | null>,
  remoteStreamRef: MediaStreamRef,
  remoteVideoRef: VideoRef,
  remoteAudioRef: AudioRef,
  videoSenderRef: RefObject<RTCRtpSender | null>,
  localScreenShareStreamRef: MediaStreamRef,
  currentScreenShareTrackRef: MediaTrackRef,
  localScreenShareRef: VideoRef,
  setters: TearDownSetters,
) {
  try {
    sendingPcRef.current?.getSenders().forEach((sender) => {
      try {
        sendingPcRef.current?.removeTrack(sender);
      } catch {}
    });
    sendingPcRef.current?.close();
  } catch {}

  try {
    receivingPcRef.current?.getSenders().forEach((sender) => {
      try {
        receivingPcRef.current?.removeTrack(sender);
      } catch {}
    });
    receivingPcRef.current?.close();
  } catch {}

  sendingPcRef.current = null;
  receivingPcRef.current = null;

  if (remoteStreamRef.current) {
    try {
      remoteStreamRef.current.getTracks().forEach((track) => track.stop());
    } catch {}
  }
  remoteStreamRef.current = new MediaStream();

  if (remoteVideoRef.current) {
    remoteVideoRef.current.srcObject = null;
    try {
      remoteVideoRef.current.load();
    } catch {}
  }

  if (remoteAudioRef.current) {
    remoteAudioRef.current.srcObject = null;
    try {
      remoteAudioRef.current.load();
    } catch {}
  }

  setters.setShowChat(false);
  setters.setPeerMicOn(true);
  setters.setPeerCamOn(true);
  setters.setScreenShareOn(false);
  setters.setPeerScreenShareOn(false);

  videoSenderRef.current = null;

  if (localScreenShareStreamRef.current) {
    localScreenShareStreamRef.current
      .getTracks()
      .forEach((track) => track.stop());
    localScreenShareStreamRef.current = null;
  }

  if (currentScreenShareTrackRef.current) {
    try {
      currentScreenShareTrackRef.current.stop();
    } catch {}
    currentScreenShareTrackRef.current = null;
  }

  if (localScreenShareRef.current) {
    localScreenShareRef.current.srcObject = null;
  }

  setters.setLobby(true);
  if (reason === "partner-left") {
    setters.setStatus("Partner left. Finding a new match…");
  } else if (reason === "next") {
    setters.setStatus("Searching for your next match…");
  } else {
    setters.setStatus("Waiting to connect you to someone…");
  }
}

export async function toggleCameraTrack(
  camOn: boolean,
  setCamOn: (value: boolean) => void,
  currentVideoTrackRef: MediaTrackRef,
  localVideoRef: VideoRef,
  videoSenderRef: RefObject<RTCRtpSender | null>,
  sendingPcRef: RefObject<RTCPeerConnection | null>,
  receivingPcRef: RefObject<RTCPeerConnection | null>,
  roomId: string | null,
  socketRef: RefObject<any>,
  localVideoTrack: MediaStreamTrack | null,
) {
  const turningOn = !camOn;
  setCamOn(turningOn);

  try {
    const pc = sendingPcRef.current || receivingPcRef.current;

    if (turningOn) {
      let track = currentVideoTrackRef.current;
      if (!track || track.readyState === "ended") {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        const video = stream.getVideoTracks()[0] ?? null;
        track = video;
        currentVideoTrackRef.current = video;
      }

      if (track && localVideoRef.current) {
        const mediaStream =
          (localVideoRef.current.srcObject as MediaStream) || new MediaStream();
        if (!localVideoRef.current.srcObject) {
          localVideoRef.current.srcObject = mediaStream;
        }
        mediaStream
          .getVideoTracks()
          .forEach((existingTrack) => mediaStream.removeTrack(existingTrack));
        if (track) {
          mediaStream.addTrack(track);
        }
        await localVideoRef.current.play().catch(() => {});
      }

      if (videoSenderRef.current && track) {
        await videoSenderRef.current.replaceTrack(track);
      } else if (pc && track) {
        const sender = pc.addTrack(track);
        videoSenderRef.current = sender;
        if (sendingPcRef.current === pc) {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          socketRef.current?.emit("renegotiate-offer", {
            roomId,
            sdp: offer,
            role: "caller",
          });
        }
      }
    } else {
      if (videoSenderRef.current) {
        await videoSenderRef.current.replaceTrack(null);
      }

      const track = currentVideoTrackRef.current;
      if (track) {
        try {
          track.stop();
        } catch {}
        currentVideoTrackRef.current = null;
      }

      if (localVideoRef.current && localVideoRef.current.srcObject) {
        const mediaStream = localVideoRef.current.srcObject as MediaStream;
        mediaStream.getVideoTracks().forEach((existingTrack) => {
          try {
            existingTrack.stop();
            mediaStream.removeTrack(existingTrack);
          } catch {}
        });
      }

      if (localVideoTrack) {
        try {
          localVideoTrack.stop();
        } catch {}
      }
    }
  } catch (error: any) {
    toast.error("Camera Error", {
      description: error?.message || "Failed to toggle camera",
    });
    setCamOn(camOn);
  }
}
