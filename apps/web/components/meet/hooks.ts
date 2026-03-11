"use client";

import { useHelixque } from "@workspace/state";

export function useMediaState(audioOn?: boolean, videoOn?: boolean) {
  const { micOn, camOn, screenShareOn, setMicOn, setCamOn, setScreenShareOn } =
    useHelixque();

  return {
    micOn,
    setMicOn,
    camOn,
    setCamOn,
    screenShareOn,
    setScreenShareOn,
  };
}

export function usePeerState() {
  const {
    peerMicOn,
    peerCamOn,
    peerScreenShareOn,
    setPeerMicOn,
    setPeerCamOn,
    setPeerScreenShareOn,
  } = useHelixque();

  return {
    peerMicOn,
    setPeerMicOn,
    peerCamOn,
    setPeerCamOn,
    peerScreenShareOn,
    setPeerScreenShareOn,
  };
}

export function useRoomState() {
  const {
    showChat,
    roomId,
    mySocketId,
    lobby,
    status,
    showTimeoutAlert,
    timeoutMessage,
    setShowChat,
    setRoomId,
    setMySocketId,
    setLobby,
    setStatus,
    setShowTimeoutAlert,
    setTimeoutMessage,
  } = useHelixque();

  return {
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
  };
}
