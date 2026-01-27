import { Card, CardContent } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { ThumbsUp, MessageSquare, Bookmark } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

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
  reactions: any[];
  isSaved?: boolean;
  savedBy?: any[];
}

interface DiscussionCardProps {
  post: Discussion;
  onUpdate?: (updatedPost: Discussion) => void;
  onSaveToggle?: (postId: string, isSaved: boolean) => void;
}

export function DiscussionCard({
  post,
  onUpdate,
  onSaveToggle,
}: DiscussionCardProps) {
  const { data: session } = useSession();
  const [isSaved, setIsSaved] = useState(
    post.isSaved || (post.savedBy && post.savedBy.length > 0) || false,
  );
  const [reactionsCount, setReactionsCount] = useState(post._count.reactions);
  const [hasReacted, setHasReacted] = useState(
    post.reactions && post.reactions.length > 0,
  );
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URI || "http://localhost:4001";

  const handleReaction = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return toast.error("Please login first");

    const newHasReacted = !hasReacted;
    setHasReacted(newHasReacted);
    setReactionsCount((prev) => (newHasReacted ? prev + 1 : prev - 1));

    try {
      await fetch(`${backendUrl}/discussions/reactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.user.id,
          targetId: post.id,
          targetType: "DISCUSSION",
          type: "LIKE",
        }),
      });
    } catch (e) {
      setHasReacted(!newHasReacted);
      setReactionsCount((prev) => (newHasReacted ? prev - 1 : prev + 1));
    }
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return toast.error("Please login first");

    const newIsSaved = !isSaved;
    setIsSaved(newIsSaved);

    // Call parent callback for optimistic update cleanup (e.g. removing from saved list)
    if (onSaveToggle) {
      onSaveToggle(post.id, newIsSaved);
    }

    try {
      const res = await fetch(`${backendUrl}/discussions/${post.id}/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.id }),
      });
      if (!res.ok) throw new Error("Failed");

      toast.success(
        newIsSaved ? "Discussion saved" : "Discussion removed from saved",
      );
    } catch (e) {
      setIsSaved(!newIsSaved);
      if (onSaveToggle) onSaveToggle(post.id, !newIsSaved); // Revert parent
      toast.error("Failed to update save status");
    }
  };

  return (
    <Link href={`/dashboard/community/${post.id}`}>
      <Card className="hover:border-primary/40 transition-colors cursor-pointer group relative">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex flex-col items-center gap-1 text-muted-foreground min-w-[3rem]">
              <Button
                variant="ghost"
                size="icon"
                className={`h-9 w-9 ${hasReacted ? "text-blue-500 bg-blue-500/10" : "group-hover:text-foreground"}`}
                onClick={handleReaction}
              >
                <ThumbsUp
                  className={`h-4 w-4 ${hasReacted ? "fill-current" : ""}`}
                />
              </Button>
              <span className="text-sm font-medium">{reactionsCount}</span>
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 mb-1 text-xs text-muted-foreground">
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={post.author.imageUrl || undefined} />
                    <AvatarFallback>
                      {post.author.username?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span>{post.author.username || "Anonymous"}</span>
                  <span>•</span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-8 w-8 ${isSaved ? "text-primary" : "text-muted-foreground opacity-0 group-hover:opacity-100"}`}
                  onClick={handleSave}
                >
                  <Bookmark
                    className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`}
                  />
                </Button>
              </div>

              <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                {post.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {post.content}
              </p>

              <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1 group-hover:text-foreground transition-colors">
                  <MessageSquare className="h-3.5 w-3.5" />{" "}
                  {post._count.comments} comments
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
