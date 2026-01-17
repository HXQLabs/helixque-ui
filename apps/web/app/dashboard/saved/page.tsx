"use client";

import * as React from "react";
import {
  Bookmark,
  Briefcase,
  User,
  BookOpen,
  Calendar,
  MoreHorizontal,
  ExternalLink,
} from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { toast } from "sonner";
import { Badge } from "@workspace/ui/components/badge";

// Mock Data
const SAVED_ITEMS = [
  {
    id: 1,
    category: "Jobs",
    title: "Senior Product Designer",
    source: "Airbnb",
    date: "Saved 2 days ago",
    content: "Remote • Full-time • $150k+",
  },
  {
    id: 2,
    category: "Mentors",
    title: "Sarah Connor",
    source: "Engineering Manager @ Cyberdyne",
    date: "Saved 1 week ago",
    content: "Expert in: Scaling efficient teams and security.",
    tags: ["Leadership", "Security"],
  },
  {
    id: 3,
    category: "Blogs",
    title: "The Future of React Server Components",
    source: "Vercel Blog",
    date: "Saved yesterday",
    content: "A deep dive into how RSCs are changing web development...",
  },
  {
    id: 4,
    category: "Jobs",
    title: "Frontend Developer",
    source: "Helixque",
    date: "Saved 3 days ago",
    content: "Remote • Contract • $60/hr",
  },
  {
    id: 5,
    category: "Events",
    title: "Global Tech Summit 2026",
    source: "TechCrunch",
    date: "Saved 5 hrs ago",
    content: "Feb 20th • San Francisco • Virtual Option",
  },
];

export default function SavedItemsPage() {
  const [items, setItems] = React.useState(SAVED_ITEMS);
  const [activeTab, setActiveTab] = React.useState("all");

  const handleUnsave = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
    toast.success("Item removed from saved.");
  };

  const getIcon = (category: string) => {
    switch (category) {
      case "Jobs": return <Briefcase className="h-4 w-4" />;
      case "Mentors": return <User className="h-4 w-4" />;
      case "Blogs": return <BookOpen className="h-4 w-4" />;
      case "Events": return <Calendar className="h-4 w-4" />;
      default: return <Bookmark className="h-4 w-4" />;
    }
  };

  const filteredItems = activeTab === "all" ? items : items.filter(item => item.category.toLowerCase().includes(activeTab) || (activeTab === "resources" && (item.category === "Blogs" || item.category === "Events")));

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Saved Items</h1>
        <p className="text-muted-foreground">
          Your personal collection of jobs, profiles, and resources.
        </p>
      </div>

      <div className="w-full">
        <div className="flex gap-2 mb-6 border-b pb-1">
             <Button variant={activeTab === "all" ? "default" : "ghost"} onClick={() => setActiveTab("all")} size="sm">All</Button>
             <Button variant={activeTab === "jobs" ? "default" : "ghost"} onClick={() => setActiveTab("jobs")} size="sm">Jobs</Button>
             <Button variant={activeTab === "mentors" ? "default" : "ghost"} onClick={() => setActiveTab("mentors")} size="sm">Mentors</Button>
             <Button variant={activeTab === "resources" ? "default" : "ghost"} onClick={() => setActiveTab("resources")} size="sm">Resources</Button>
        </div>
        
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredItems.length === 0 && (
                    <div className="col-span-full text-center py-20 text-muted-foreground">
                        No saved items yet.
                    </div>
                )}
                {filteredItems.map((item) => (
                    <Card key={item.id} className="relative group">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <Badge variant="outline" className="flex items-center gap-1 w-fit">
                                    {getIcon(item.category)} {item.category}
                                </Badge>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => handleUnsave(item.id)}
                                >
                                    <Bookmark className="h-4 w-4 fill-current" />
                                </Button>
                            </div>
                            <CardTitle className="leading-tight mt-2">{item.title}</CardTitle>
                            <CardDescription>{item.source}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">{item.content}</p>
                            {/* @ts-ignore */}
                            {item.tags && (
                                <div className="flex gap-2 mt-2">
                                    {/* @ts-ignore */}
                                    {item.tags.map(tag => (
                                        <Badge key={tag} variant="secondary" className="text-[10px] px-1 py-0">{tag}</Badge>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="text-xs text-muted-foreground flex justify-between">
                            <span>{item.date}</span>
                            <Button variant="link" size="sm" className="h-auto p-0 text-muted-foreground hover:text-primary">
                                View <ExternalLink className="ml-1 h-3 w-3" />
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
