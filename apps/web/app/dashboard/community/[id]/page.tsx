"use client";

import { useNavigation } from "@/contexts/navigation-context";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { MessageSquare, ThumbsUp, Share2, MoreHorizontal, Send } from "lucide-react";
import { Separator } from "@workspace/ui/components/separator";
import { toast } from "sonner";
import { ChangeEvent } from "react";

// Mock data - in a real app this would fetch based on ID
const MOCK_DISCUSSION = {
  id: 1,
  title: "Best resources for learning System Design in 2026?",
  author: "Alex Rivers",
  avatar: "https://github.com/shadcn.png",
  category: "Career Advice",
  likes: 45,
  views: 1205,
  time: "2 hours ago",
  content: `
    I'm preparing for senior engineering interviews and looking for updated resources for System Design.
    
    Most of the classic books (DDIA, Alex Xu) are great but I'm looking for something that covers newer patterns like:
    - AI/LLM Infra scaling
    - Server Components at scale
    - Edge Computing patterns
    
    Any recommendations for courses, blogs, or newsletters? Thanks!
  `,
  comments: [
    {
      id: 101,
      author: "Sarah Chen",
      avatar: "https://github.com/shadcn.png",
      time: "1 hour ago",
      content: "Highly recommend the 'System Design for AI' course on Coursera. It covers vector DBs and inference scaling really well.",
      likes: 12,
    },
    {
      id: 102,
      author: "Mike Johnson",
      avatar: "https://github.com/shadcn.png",
      time: "30 mins ago",
      content: "Don't ignore the classics though! DDIA is still the bible for distributed systems fundamentals which haven't changed that much.",
      likes: 8,
    }
  ]
};

export default function DiscussionDetailsPage() {
  const { id } = useParams();
  const { setActiveSection, setActiveSubSection } = useNavigation();
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(MOCK_DISCUSSION.comments);

  useEffect(() => {
    setActiveSection("Community");
    setActiveSubSection("Discussions");
  }, [setActiveSection, setActiveSubSection]);

  const handlePostComment = () => {
    if (!commentText.trim()) return;
    
    const newComment = {
      id: Date.now(),
      author: "You", // Mock current user
      avatar: "https://github.com/shadcn.png",
      time: "Just now",
      content: commentText,
      likes: 0,
    };
    
    setComments([...comments, newComment]);
    setCommentText("");
    toast.success("Comment posted successfully!");
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto p-6 max-w-4xl mx-auto w-full space-y-6">
      
      {/* Main Post */}
      <Card>
        <CardHeader className="space-y-4">
           <div className="flex justify-between items-start">
              <div className="flex gap-3">
                 <Avatar>
                    <AvatarImage src={MOCK_DISCUSSION.avatar} />
                    <AvatarFallback>AR</AvatarFallback>
                 </Avatar>
                 <div>
                    <div className="font-semibold">{MOCK_DISCUSSION.author}</div>
                    <div className="text-sm text-muted-foreground">{MOCK_DISCUSSION.time}</div>
                 </div>
              </div>
              <Badge variant="outline">{MOCK_DISCUSSION.category}</Badge>
           </div>
           <CardTitle className="text-2xl">{MOCK_DISCUSSION.title}</CardTitle>
        </CardHeader>
        <CardContent>
           <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap text-muted-foreground leading-relaxed">
              {MOCK_DISCUSSION.content}
           </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4">
            <div className="flex gap-4">
               <Button variant="ghost" size="sm" className="gap-2">
                  <ThumbsUp className="h-4 w-4" /> {MOCK_DISCUSSION.likes} Likes
               </Button>
               <Button variant="ghost" size="sm" className="gap-2">
                  <MessageSquare className="h-4 w-4" /> {comments.length} Comments
               </Button>
            </div>
            <Button variant="ghost" size="sm" className="gap-2">
               <Share2 className="h-4 w-4" /> Share
            </Button>
        </CardFooter>
      </Card>

      {/* Comment Section */}
      <div className="space-y-4">
         <h3 className="text-lg font-semibold">Comments ({comments.length})</h3>
         
         {/* Comment Input */}
         <Card>
            <CardContent className="pt-6 space-y-4">
               <textarea 
                 placeholder="What are your thoughts?" 
                 className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                 value={commentText}
                 onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setCommentText(e.target.value)}
               />
               <div className="flex justify-end">
                  <Button onClick={handlePostComment} disabled={!commentText.trim()}>
                     <Send className="mr-2 h-4 w-4" /> Post Comment
                  </Button>
               </div>
            </CardContent>
         </Card>

         {/* Comment List */}
         <div className="space-y-4">
            {comments.map((comment) => (
              <Card key={comment.id} className="bg-muted/20 border-none shadow-none">
                 <CardContent className="pt-6 flex gap-4">
                    <Avatar className="h-8 w-8">
                       <AvatarImage src={comment.avatar} />
                       <AvatarFallback>User</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                             <span className="font-semibold text-sm">{comment.author}</span>
                             <span className="text-xs text-muted-foreground">• {comment.time}</span>
                          </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{comment.content}</p>
                      <div className="flex items-center gap-4 pt-2">
                         <button className="text-xs font-medium text-muted-foreground hover:text-primary flex items-center gap-1">
                            <ThumbsUp className="h-3 w-3" /> {comment.likes}
                         </button>
                         <button className="text-xs font-medium text-muted-foreground hover:text-primary">
                            Reply
                         </button>
                      </div>
                    </div>
                 </CardContent>
              </Card>
            ))}
         </div>
      </div>
    </div>
  );
}
