"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { useSession } from "next-auth/react";
import ChatPanel from "@/components/meet/RTC/Chat/chat";
import { Button } from "@workspace/ui/components/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Card } from "@workspace/ui/components/card";

const BACKEND_URI =
  process.env.NEXT_PUBLIC_BACKEND_URI || "http://localhost:5001";

export default function ChatPage() {
  const { friendshipId } = useParams();
  const { data: session, status } = useSession();
  const router = useRouter();

  const socketRef = useRef<Socket | null>(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [friendDetails, setFriendDetails] = useState<any>(null);

  const roomId = Array.isArray(friendshipId) ? friendshipId[0] : friendshipId;
  const userName = session?.user?.name || "User";

  // Fetch friend details for header
  useEffect(() => {
    if (!roomId || !session?.user?.id) return;
    const fetchFriend = async () => {
      try {
        const res = await fetch(
          `${BACKEND_URI}/socials/friends?userId=${session.user.id}`,
        );
        const friends = await res.json();
        const currentRel = friends.find((f: any) => f.friendshipId === roomId);
        if (currentRel) setFriendDetails(currentRel.friend);
      } catch (e) {
        console.error(e);
      }
    };
    fetchFriend();
  }, [roomId, session?.user?.id]);

  // Socket Connection
  useEffect(() => {
    if (status !== "authenticated" || !roomId || socketRef.current) return;

    const s = io(BACKEND_URI, {
      transports: ["websocket"],
      autoConnect: false,
      reconnection: true,
      auth: { name: userName, fromSocials: true }, // Add flag if backend needs it
    });

    socketRef.current = s;
    s.connect();

    s.on("connect", () => {
      console.log("Chat Socket connected:", s.id);
      setSocketConnected(true);
    });

    s.on("disconnect", () => {
      console.log("Chat Socket disconnected");
      setSocketConnected(false);
    });

    return () => {
      s.disconnect();
      socketRef.current = null;
    };
  }, [status, roomId, userName]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] p-4 max-w-4xl mx-auto w-full">
      <div className="flex items-center gap-4 mb-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            Chat
            {friendDetails && (
              <span className="text-primary">
                with {friendDetails.username}
              </span>
            )}
          </h1>
          <p className="text-xs text-muted-foreground">
            {socketConnected ? "Connected" : "Connecting..."}
          </p>
        </div>
      </div>

      <Card className="flex-1 overflow-hidden border-0 shadow-lg flex flex-col bg-neutral-950">
        <ChatPanel
          socket={socketRef.current}
          roomId={roomId || null}
          name={userName}
          mySocketId={socketRef.current?.id || null}
          isOpen={true}
        />
      </Card>
    </div>
  );
}
