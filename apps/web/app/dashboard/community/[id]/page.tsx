"use client";

import { useNavigation } from "@/contexts/navigation-context";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import {
  MessageSquare,
  ThumbsUp,
  Share2,
  Send,
  CornerDownRight,
  Loader2,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { ChangeEvent } from "react";
import { useSession } from "next-auth/react";
import { Textarea } from "@workspace/ui/components/textarea";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

interface CommentType {
  id: string;
  discussionId: string;
  content: string;
  createdAt: string;
  author: { id: string; username: string; imageUrl: string };
  replies: CommentType[];
  reactions: any[];
  _count?: { reactions: number };
}

interface DiscussionType {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: { id: string; username: string; imageUrl: string };
  comments: CommentType[];
  reactions: any[];
  _count: { reactions: number; comments: number };
}

// Recursive Comment Component
const CommentItem = ({
  comment,
  level = 0,
  onReply,
  onRefresh,
  currentUserId,
}: {
  comment: CommentType;
  level?: number;
  onReply: (parentId: string) => void;
  onRefresh: () => void;
  currentUserId?: string;
}) => {
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URI || "http://localhost:4001";
  const hasReacted = comment.reactions?.some(
    (r: any) => r.userId === currentUserId,
  );
  const [likes, setLikes] = useState(comment.reactions?.length || 0);
  const [liked, setLiked] = useState(hasReacted);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const handleEdit = async () => {
    if (!editContent.trim()) return;
    try {
      await fetch(
        `${backendUrl}/discussions/${comment.discussionId}/comments/${comment.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: currentUserId, content: editContent }),
        },
      );
      setIsEditing(false);
      onRefresh();
      toast.success("Updated");
    } catch (e) {
      toast.error("Failed to update");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete comment?")) return;
    try {
      await fetch(
        `${backendUrl}/discussions/${comment.discussionId}/comments/${comment.id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: currentUserId }),
        },
      );
      onRefresh();
      toast.success("Deleted");
    } catch (e) {
      toast.error("Failed to delete");
    }
  };

  const handleLike = async () => {
    if (!currentUserId) return toast.error("Login to react");
    const newLiked = !liked;
    setLiked(newLiked);
    setLikes((prev) => (newLiked ? prev + 1 : prev - 1));

    try {
      await fetch(`${backendUrl}/discussions/reactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUserId,
          targetId: comment.id,
          targetType: "COMMENT",
          type: "LIKE",
        }),
      });
    } catch (e) {
      /* silent fail */
    }
  };

  return (
    <div
      className={`space-y-4 ${level > 0 ? "ml-8 border-l pl-4 border-border/50" : ""}`}
    >
      <div className="flex gap-4">
        <Avatar className="h-8 w-8 mt-1">
          <AvatarImage src={comment.author.imageUrl} />
          <AvatarFallback>{comment.author.username?.[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">
                {comment.author.username}
              </span>
              <span className="text-xs text-muted-foreground">
                •{" "}
                {new Date(comment.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
          {isEditing ? (
            <div className="space-y-2">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[60px]"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleEdit}>
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
              {comment.content}
            </p>
          )}
          <div className="flex items-center gap-4 pt-1">
            <button
              onClick={handleLike}
              className={`text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer ${liked ? "text-blue-500" : "text-muted-foreground hover:text-primary"}`}
            >
              <ThumbsUp className={`h-3 w-3 ${liked ? "fill-current" : ""}`} />{" "}
              {likes}
            </button>
            <button
              onClick={() => onReply(comment.id)}
              className="text-xs font-medium text-muted-foreground hover:text-primary cursor-pointer"
            >
              Reply
            </button>
            {currentUserId === comment.author.id && (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-xs font-medium text-muted-foreground hover:text-primary cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="text-xs font-medium text-destructive hover:text-destructive/80 cursor-pointer"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Render Replies Recursively */}
      {comment.replies?.map((reply) => (
        <CommentItem
          key={reply.id}
          comment={reply}
          level={level + 1}
          onReply={onReply}
          onRefresh={onRefresh}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
};

export default function DiscussionDetailsPage() {
  const { id } = useParams();
  const { setActiveSection, setActiveSubSection } = useNavigation();
  const { data: session } = useSession();
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URI || "http://localhost:4001";

  const {
    data: discussion,
    error,
    isLoading,
    mutate,
  } = useSWR<DiscussionType>(
    id ? `${backendUrl}/discussions/${id}` : null,
    fetcher,
  );

  const [commentText, setCommentText] = useState("");
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [isEditingDiscussion, setIsEditingDiscussion] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    setActiveSection("Community");
    setActiveSubSection("Discussions");
  }, [id, setActiveSection, setActiveSubSection]);

  useEffect(() => {
    if (discussion) {
      setEditTitle(discussion.title);
      setEditContent(discussion.content);
    }
  }, [discussion]);

  const [isPostingComment, setIsPostingComment] = useState(false);

  const handlePostComment = async () => {
    if (!commentText.trim()) return;
    setIsPostingComment(true);

    try {
      const res = await fetch(`${backendUrl}/discussions/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: commentText,
          authorId: session?.user?.id,
          parentId: replyToId,
        }),
      });

      if (!res.ok) throw new Error("Failed");

      const newComment = await res.json();

      // Optimistic Update
      if (discussion) {
        if (replyToId) {
          // If reply, revalidate fully for simplicity
          mutate();
        } else {
          // Top level, append easily
          mutate(
            {
              ...discussion,
              comments: [
                ...discussion.comments,
                { ...newComment, replies: [], reactions: [] },
              ],
              _count: {
                ...discussion._count,
                comments: discussion._count.comments + 1,
                reactions: discussion._count.reactions,
              },
            },
            false,
          );
        }
      } else {
        mutate();
      }

      setCommentText("");
      setReplyToId(null);
      toast.success("Comment posted");
    } catch (e) {
      toast.error("Failed to post comment");
    } finally {
      setIsPostingComment(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure? This cannot be undone.")) return;
    try {
      await fetch(`${backendUrl}/discussions/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session?.user?.id }),
      });
      toast.success("Deleted");
      window.location.href = "/dashboard/community";
    } catch (e) {
      toast.error("Failed to delete");
    }
  };

  const handleUpdateDiscussion = async () => {
    if (!editTitle.trim() || !editContent.trim() || !discussion) return;
    try {
      const res = await fetch(`${backendUrl}/discussions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session?.user?.id,
          title: editTitle,
          content: editContent,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setIsEditingDiscussion(false);
      mutate(); // Revalidate
      toast.success("Discussion updated");
    } catch (e) {
      toast.error("Failed to update discussion");
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard");
  };

  const handleLikeDiscussion = async () => {
    if (!discussion || !session?.user?.id) return;

    const hasReacted = discussion.reactions?.some(
      (r: any) => r.userId === session.user.id,
    );

    // Optimistic
    mutate(
      {
        ...discussion,
        _count: {
          ...discussion._count,
          reactions: hasReacted
            ? discussion._count.reactions - 1
            : discussion._count.reactions + 1,
        },
        reactions: hasReacted ? [] : [{ userId: session.user.id }],
      },
      false,
    );

    try {
      await fetch(`${backendUrl}/discussions/reactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.user.id,
          targetId: discussion.id,
          targetType: "DISCUSSION",
          type: "LIKE",
        }),
      });
      mutate(); // Revalidate ensures sync
    } catch (e) {
      mutate(); // Revert on error
    }
  };

  if (isLoading)
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  if (error || !discussion)
    return <div className="p-6">Discussion not found</div>;

  const isAuthor = session?.user?.id === discussion.author.id;
  const hasReacted = discussion.reactions?.some(
    (r: any) => r.userId === session?.user?.id,
  );

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto p-6 max-w-4xl mx-auto w-full space-y-6">
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex justify-between items-start">
            <div className="flex gap-3">
              <Avatar>
                <AvatarImage src={discussion.author.imageUrl} />
                <AvatarFallback>
                  {discussion.author.username?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold">
                  {discussion.author.username}
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(discussion.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
            {isAuthor && !isEditingDiscussion && (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingDiscussion(true)}
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDelete}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          {isEditingDiscussion ? (
            <div className="space-y-4">
              <input
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-xl font-bold"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Discussion Title"
              />
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[200px]"
              />
              <div className="flex gap-2 justify-end">
                <Button onClick={handleUpdateDiscussion}>Save Changes</Button>
                <Button
                  variant="ghost"
                  onClick={() => setIsEditingDiscussion(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <CardTitle className="text-2xl">{discussion.title}</CardTitle>
          )}
        </CardHeader>
        {!isEditingDiscussion && (
          <CardContent>
            <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap text-muted-foreground leading-relaxed">
              {discussion.content}
            </div>
          </CardContent>
        )}
        <CardFooter className="flex justify-between border-t pt-4">
          <div className="flex gap-4">
            <Button
              variant="ghost"
              size="sm"
              className={`gap-2 ${hasReacted ? "text-blue-500 bg-blue-500/10" : ""}`}
              onClick={handleLikeDiscussion}
            >
              <ThumbsUp
                className={`h-4 w-4 ${hasReacted ? "fill-current" : ""}`}
              />{" "}
              {discussion._count.reactions} Likes
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <MessageSquare className="h-4 w-4" /> {discussion._count.comments}{" "}
              Comments
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" /> Share
          </Button>
        </CardFooter>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          Comments ({discussion._count.comments})
        </h3>

        <Card
          className={`border-2 ${replyToId ? "border-primary/20" : "border-transparent"}`}
        >
          <CardContent className="pt-6 space-y-4">
            {replyToId && (
              <div className="flex items-center justify-between bg-muted/30 p-2 rounded text-xs">
                <span className="flex items-center gap-1">
                  <CornerDownRight className="h-3 w-3" /> Replying to comment{" "}
                  {replyToId}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 text-muted-foreground"
                  onClick={() => setReplyToId(null)}
                >
                  Cancel
                </Button>
              </div>
            )}
            <Textarea
              placeholder={
                replyToId ? "Write a reply..." : "Write a comment..."
              }
              className="min-h-[100px]"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <div className="flex justify-end">
              <Button
                onClick={handlePostComment}
                disabled={!commentText.trim() || isPostingComment}
              >
                {isPostingComment ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}{" "}
                Post {replyToId ? "Reply" : "Comment"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {discussion.comments.map((comment) => (
            <Card key={comment.id} className="bg-muted/10 border shadow-sm">
              <CardContent className="pt-6">
                <CommentItem
                  comment={comment}
                  onReply={(id) => {
                    setReplyToId(id);
                    window.scrollTo({
                      top:
                        document
                          .querySelector("textarea")
                          ?.getBoundingClientRect().top! +
                        window.scrollY -
                        100,
                      behavior: "smooth",
                    });
                    document.querySelector("textarea")?.focus();
                  }}
                  onRefresh={() => mutate()}
                  currentUserId={session?.user?.id}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
