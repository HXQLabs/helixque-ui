"use client";

import { useNavigation } from "@/contexts/navigation-context";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { ThumbsUp, MessageSquare, Plus, Loader2 } from "lucide-react";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@workspace/ui/components/dialog";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import Link from "next/link";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { DiscussionCard } from "@/components/discussion-card";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

interface Discussion {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    username: string | null;
    imageUrl: string | null;
  };
  _count: {
    comments: number;
    reactions: number;
  };
  reactions: any[]; // Reactions by current user
}

export default function CommunityPage() {
  const { setActiveSection, setActiveSubSection } = useNavigation();
  const { data: session } = useSession();

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URI || "http://localhost:4001";
  const {
    data: discussions,
    error,
    isLoading,
    mutate,
  } = useSWR<Discussion[]>(
    `${backendUrl}/discussions?userId=${session?.user?.id || ""}`,
    fetcher,
  );

  // Create Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setActiveSection("Community");
    setActiveSubSection("Discussions");
  }, [setActiveSection, setActiveSubSection]);

  const handleCreate = async () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`${backendUrl}/discussions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          content: newContent,
          authorId: session?.user?.id,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        // Zod errors come as an array of objects
        if (Array.isArray(errorData.error)) {
          const messages = errorData.error
            .map((e: any) => e.message)
            .join(", ");
          throw new Error(messages);
        }
        throw new Error(errorData.error || "Failed to create discussion");
      }

      const createdDiscussion = await res.json();

      // Optimistic update with SWR mutation
      mutate([createdDiscussion, ...(discussions || [])], false);

      toast.success("Discussion started!", {
        description: "Your topic is now live.",
      });
      setNewTitle("");
      setNewContent("");
      setIsCreateOpen(false);
    } catch (e: any) {
      toast.error(e.message || "Failed to create discussion");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Community Discussions
          </h1>
          <p className="text-muted-foreground mt-1">
            Connect, ask questions, and share knowledge with peers.
          </p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> New Discussion
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Start a Discussion</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  placeholder="What's on your mind?"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Content</label>
                <Textarea
                  placeholder="Elaborate your thoughts..."
                  className="min-h-[150px]"
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                disabled={isSubmitting || !newTitle || !newContent}
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Post Discussion"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : !discussions || discussions.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          <p>No discussions yet. Be the first to start one!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {discussions.map((post) => (
            <DiscussionCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
