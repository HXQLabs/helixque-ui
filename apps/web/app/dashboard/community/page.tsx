"use client";

import { useNavigation } from "@/contexts/navigation-context";
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { MessageSquare, ThumbsUp, Eye, Search, Plus } from "lucide-react";
import { Input } from "@workspace/ui/components/input";
import Link from "next/link";

const DISCUSSIONS = [
  {
    id: 1,
    title: "Best resources for learning System Design in 2026?",
    author: "Alex Rivers",
    avatar: "https://github.com/shadcn.png",
    category: "Career Advice",
    likes: 45,
    replies: 12,
    views: 1205,
    time: "2 hours ago",
    content: "I'm preparing for senior engineering interviews and looking for updated resources...",
  },
  {
    id: 2,
    title: "How to handle imposter syndrome as a new mentor?",
    author: "Sarah Chen",
    avatar: "https://github.com/shadcn.png",
    category: "Mentorship",
    likes: 89,
    replies: 34,
    views: 3400,
    time: "5 hours ago",
    content: "I just started mentoring but I feel like I don't know enough to help others...",
  },
  {
    id: 3,
    title: "Remote work trends: Is hybrid the new normal?",
    author: "Mike Johnson",
    avatar: "https://github.com/shadcn.png",
    category: "General",
    likes: 23,
    replies: 8,
    views: 890,
    time: "1 day ago",
    content: "With many companies calling employees back to office, what's your experience?",
  },
  {
    id: 4,
    title: "Next.js 15 vs Remix: What are you using for new projects?",
    author: "Dev Pro",
    avatar: "https://github.com/shadcn.png",
    category: "Tech Stack",
    likes: 156,
    replies: 89,
    views: 12000,
    time: "2 days ago",
    content: "I'm starting a new SaaS and torn between the two...",
  },
];

export default function CommunityPage() {
  const { setActiveSection, setActiveSubSection } = useNavigation();

  useEffect(() => {
    setActiveSection("Community");
    setActiveSubSection("Discussions");
  }, [setActiveSection, setActiveSubSection]);

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto p-6 space-y-6">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-3xl font-bold tracking-tight">Community Discussions</h1>
           <p className="text-muted-foreground mt-1">Connect, ask questions, and share knowledge with peers.</p>
        </div>
        <Button>
           <Plus className="mr-2 h-4 w-4" /> New Discussion
        </Button>
      </div>

      <div className="flex gap-4 items-center bg-muted/30 p-1 rounded-lg w-full md:w-fit">
         <Button variant="secondary" size="sm" className="shadow-none bg-background text-foreground">Latest</Button>
         <Button variant="ghost" size="sm" className="text-muted-foreground">Top</Button>
         <Button variant="ghost" size="sm" className="text-muted-foreground">Unanswered</Button>
      </div>

      <div className="grid gap-4">
        {DISCUSSIONS.map((post) => (
          <Link href={`/dashboard/community/${post.id}`} key={post.id}>
            <Card className="hover:border-primary/40 transition-colors cursor-pointer">
              <CardContent className="p-6">
                 <div className="flex gap-4">
                    <div className="flex flex-col items-center gap-1 text-muted-foreground min-w-[3rem]">
                       <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary">
                          <ThumbsUp className="h-4 w-4" />
                       </Button>
                       <span className="text-sm font-medium">{post.likes}</span>
                    </div>
                    
                    <div className="flex-1 space-y-2">
                       <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs font-normal">{post.category}</Badge>
                          <span className="text-xs text-muted-foreground">• Posted by {post.author} • {post.time}</span>
                       </div>
                       <h3 className="text-lg font-semibold hover:text-primary transition-colors">{post.title}</h3>
                       <p className="text-sm text-muted-foreground line-clamp-2">{post.content}</p>
                       
                       <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1 hover:text-foreground transition-colors"><MessageSquare className="h-3.5 w-3.5" /> {post.replies} replies</span>
                          <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {post.views} views</span>
                       </div>
                    </div>
                 </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
