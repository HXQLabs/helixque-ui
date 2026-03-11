"use client";

import { useEffect, useRef } from "react";
import type { Socket } from "socket.io-client";
import { toast } from "sonner";
import EmojiPicker, { Theme, type EmojiClickData } from "emoji-picker-react";
import { IconMoodSmile } from "@tabler/icons-react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { useHelixque } from "@workspace/state";

type ChatMessage = {
  text: string;
  from: string;
  clientId: string;
  ts: number;
  kind?: "user" | "system";
};

type ChatPanelProps = {
  socket: Socket | null;
  roomId: string | null;
  name: string;
  mySocketId: string | null;
  collapsed?: boolean;
  isOpen?: boolean;
};

const MAX_LENGTH = 1000;
const MAX_BUFFER = 300;
const TYPING_DEBOUNCE_MS = 350;

export default function ChatPanel({
  socket,
  roomId,
  name,
  mySocketId,
  collapsed = false,
  isOpen = false,
}: ChatPanelProps) {
  const {
    cursorPosition,
    emojiPickerOpen,
    input,
    peerTyping,
    messages,
    setCursorPosition,
    setEmojiPickerOpen,
    setInput,
    setPeerTyping,
    setMessages,
  } = useHelixque();

  const scrollerRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typingDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sidRef = useRef<string | null>(mySocketId ?? null);
  const emojiRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const didJoinRef = useRef<Record<string, string>>({});

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        emojiRef.current &&
        !emojiRef.current.contains(event.target as Node)
      ) {
        if (emojiPickerOpen) {
          setEmojiPickerOpen(false);
          setTimeout(() => {
            inputRef.current?.focus();
          }, 5);
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [emojiPickerOpen]);

  useEffect(() => {
    if (!socket) return;
    const setSocketId = () => {
      sidRef.current = socket.id || sidRef.current || null;
    };
    setSocketId();
    socket.on("connect", setSocketId);
    return () => {
      socket.off("connect", setSocketId);
    };
  }, [socket]);

  const canSend = Boolean(
    socket &&
      socket.connected &&
      roomId &&
      name &&
      (sidRef.current || mySocketId),
  );

  useEffect(() => {
    if (isOpen) {
      toast.dismiss();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!socket || !roomId) return;

    const joinRoom = () => socket.emit("chat:join", { roomId, name });
    const joinOnce = () => {
      const sid = socket.id ?? null;
      const key = `${roomId}`;
      if (sid && didJoinRef.current[key] === sid) return;
      if (sid) didJoinRef.current[key] = sid;
      joinRoom();
    };

    const onConnect = () => {
      sidRef.current = socket.id ?? null;
      joinOnce();
    };

    const onMessage = (message: ChatMessage) => {
      const myId = mySocketId || sidRef.current;
      if (message.clientId === myId) return;
      setMessages((prev) => {
        const next = [...prev, { ...message, kind: "user" as const }];
        return next.length > MAX_BUFFER ? next.slice(-MAX_BUFFER) : next;
      });
      if (!isOpen) {
        toast.success(
          `Peer: ${message.text.length > 80 ? `${message.text.slice(0, 77)}...` : message.text}`,
          {
            duration: 3500,
            position: "bottom-right",
            style: {
              bottom: "100px",
              right: "20px",
            },
          },
        );
      }
    };

    const onSystem = ({ text, ts }: { text: string; ts?: number }) => {
      const normalised = (() => {
        try {
          const match = text.match(/^(.*)\s+(joined|left) the chat.*$/);
          if (match) {
            const who = (match[1] || "").trim();
            const action = match[2];
            const isSelf =
              who.length > 0 &&
              who.toLowerCase() === (name || "").toLowerCase();
            return `${isSelf ? name : "Peer"} ${action} the chat`;
          }
        } catch {}
        return text;
      })();

      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.kind === "system" && last.text === normalised) return prev;
        const next = [
          ...prev,
          {
            text: normalised,
            from: "system",
            clientId: "system",
            ts: ts ?? Date.now(),
            kind: "system" as const,
          },
        ];
        return next.length > MAX_BUFFER ? next.slice(-MAX_BUFFER) : next;
      });
    };

    const onTyping = ({ typing }: { from: string; typing: boolean }) => {
      setPeerTyping(typing ? "Peer is typing…" : null);
      if (typing) {
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => setPeerTyping(null), 3000);
      }
    };

    const onHistory = ({
      roomId: rid,
      messages: incoming,
    }: {
      roomId: string;
      messages: ChatMessage[];
    }) => {
      if (rid !== roomId) return;
      if (!Array.isArray(incoming) || incoming.length === 0) return;
      setMessages((prev) => {
        const keyOf = (item: ChatMessage) =>
          `${item.kind || "user"}|${item.ts}|${item.clientId}|${item.text}`;
        const seen = new Set(prev.map(keyOf));
        const add = incoming.filter((item) => !seen.has(keyOf(item)));
        if (add.length === 0) return prev;
        const merged = [...prev, ...add];
        return merged.length > MAX_BUFFER ? merged.slice(-MAX_BUFFER) : merged;
      });
    };

    socket.on("connect", onConnect);
    socket.on("chat:message", onMessage);
    socket.on("chat:system", onSystem);
    socket.on("chat:typing", onTyping);
    socket.on("chat:history", onHistory);

    if (socket.connected) {
      onConnect();
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("chat:message", onMessage);
      socket.off("chat:system", onSystem);
      socket.off("chat:typing", onTyping);
      socket.off("chat:history", onHistory);
      socket.emit("chat:typing", { roomId, from: name, typing: false });
      socket.emit("chat:leave", { roomId, name });
    };
  }, [socket, roomId, name, isOpen, mySocketId]);

  const sendMessage = () => {
    if (!canSend || !input.trim()) return;
    const myId = mySocketId || sidRef.current!;
    const payload = {
      roomId: roomId!,
      text: input.trim().slice(0, MAX_LENGTH),
      from: name,
      clientId: myId,
      ts: Date.now(),
    };

    setMessages((prev) => {
      const next = [...prev, { ...payload, kind: "user" as const }];
      return next.length > MAX_BUFFER ? next.slice(-MAX_BUFFER) : next;
    });

    toast.success("Message sent", { duration: 1200 });
    socket!.emit("chat:message", payload);
    setInput("");
    socket!.emit("chat:typing", { roomId, from: name, typing: false });
  };

  const handleAddEmoji = (emoji: EmojiClickData) => {
    const start = cursorPosition;
    const newMessage = input.slice(0, start) + emoji.emoji + input.slice(start);
    setInput(newMessage);
    const newCursor = start + emoji.emoji.length;
    setCursorPosition(newCursor);

    if (!socket || !roomId) return;
    if (typingDebounceRef.current) clearTimeout(typingDebounceRef.current);
    typingDebounceRef.current = setTimeout(() => {
      socket.emit("chat:typing", {
        roomId,
        from: name,
        typing: Boolean(newMessage),
      });
    }, TYPING_DEBOUNCE_MS);
  };

  const handleTyping = (value: string) => {
    setInput(value);
    setCursorPosition(inputRef.current?.selectionStart || value.length);
    if (!socket || !roomId) return;

    if (typingDebounceRef.current) clearTimeout(typingDebounceRef.current);
    typingDebounceRef.current = setTimeout(() => {
      socket.emit("chat:typing", {
        roomId,
        from: name,
        typing: Boolean(value),
      });
    }, TYPING_DEBOUNCE_MS);
  };

  if (collapsed) return null;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-l-2xl bg-neutral-950">
      <div
        ref={scrollerRef}
        className="flex-1 space-y-2 overflow-y-auto px-3 py-3"
      >
        {messages.map((message, index) => {
          const myId = mySocketId || sidRef.current;
          const mine = message.clientId === myId;
          const isSystem = message.kind === "system";
          return (
            <div
              key={`${message.ts}-${index}`}
              className={`flex ${isSystem ? "justify-center" : mine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={
                  isSystem
                    ? "text-xs italic text-white/50"
                    : `max-w-[75%] rounded-2xl px-3 py-2 text-sm ${
                        mine
                          ? "bg-indigo-600 text-white"
                          : "bg-white/10 text-white/90"
                      }`
                }
                title={new Date(message.ts).toLocaleTimeString()}
              >
                {isSystem ? (
                  <span>{message.text}</span>
                ) : (
                  <>
                    {!mine && (
                      <div className="mb-1 text-[10px] text-white/60">Peer</div>
                    )}
                    <div>{message.text}</div>
                  </>
                )}
              </div>
            </div>
          );
        })}
        {peerTyping && (
          <div className="text-xs italic text-white/60">{peerTyping}</div>
        )}
      </div>

      <div className="border-t border-white/10 p-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Input
              ref={inputRef}
              className="h-12 rounded-xl border-white/10 bg-white/5 text-sm text-white placeholder:text-neutral-500"
              placeholder={canSend ? "Type a message…" : "Connecting chat…"}
              value={input}
              onChange={(event) => handleTyping(event.target.value)}
              onClick={(event) =>
                setCursorPosition(
                  event.currentTarget.selectionStart || input.length,
                )
              }
              onKeyUp={(event) =>
                setCursorPosition(
                  event.currentTarget.selectionStart || input.length,
                )
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  sendMessage();
                }
              }}
              disabled={!canSend}
              maxLength={MAX_LENGTH}
            />
            <div className="absolute bottom-1.5 right-2" ref={emojiRef}>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={(event) => {
                  event.stopPropagation();
                  if (canSend) setEmojiPickerOpen(true);
                }}
                className="rounded-full text-neutral-400 hover:text-white"
                disabled={!canSend}
              >
                <IconMoodSmile className="h-5 w-5" />
              </Button>
              <div className="absolute bottom-12 right-0 z-50">
                <EmojiPicker
                  theme={Theme.DARK}
                  open={emojiPickerOpen}
                  onEmojiClick={handleAddEmoji}
                  autoFocusSearch={false}
                />
              </div>
            </div>
          </div>
          <Button
            type="button"
            onClick={sendMessage}
            disabled={!canSend || !input.trim()}
            className="h-11 rounded-xl px-5"
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
