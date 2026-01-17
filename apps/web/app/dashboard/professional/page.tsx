"use client";

import { useState, useEffect } from "react";
import { Search, SlidersHorizontal, Building2, Briefcase, Star, Clock, Bell, Circle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Badge } from "@workspace/ui/components/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@workspace/ui/components/card";
import { Separator } from "@workspace/ui/components/separator";
import { toast } from "sonner";
import Link from "next/link";

// Mock Data for Mentors
const MOCK_MENTORS = [
  {
    id: "1",
    name: "Sarah Chen",
    role: "Senior Product Designer",
    company: "Airbnb",
    avatar: "https://github.com/shadcn.png",
    headline: "Helping designers break into big tech. Ex-Google, Ex-Meta.",
    expertise: ["UX Design", "Career Guidance", "Portfolio Review"],
    rating: 4.9,
    reviews: 120,
    status: "online",
    services: [
      { id: "s1", title: "1:1 Career Chat", price: 500, duration: "30 min" },
      { id: "s2", title: "Portfolio Review", price: 1500, duration: "60 min" },
    ],
  },
  {
    id: "2",
    name: "David Kim",
    role: "Staff Software Engineer",
    company: "Netflix",
    avatar: "https://github.com/shadcn.png",
    headline: "Scaling systems and engineering leadership. Let's talk backend.",
    expertise: ["System Design", "Backend", "Leadership"],
    rating: 5.0,
    reviews: 85,
    status: "offline",
    services: [
      { id: "s3", title: "System Design Mock", price: 2000, duration: "60 min" },
    ],
  },
  {
    id: "3",
    name: "Emily Davis",
    role: "Product Manager",
    company: "Linear",
    avatar: "https://github.com/shadcn.png",
    headline: "Building products that users love. Product strategy & execution.",
    expertise: ["Product Management", "Strategy", "Interview Prep"],
    rating: 4.8,
    reviews: 200,
    status: "online",
    services: [
      { id: "s4", title: "PM Mock Interview", price: 1200, duration: "45 min" },
      { id: "s5", title: "Resume Review", price: 800, duration: "30 min" },
    ],
  },
   {
    id: "4",
    name: "James Wilson",
    role: "Tech Lead",
    company: "Vercel",
    avatar: "https://github.com/shadcn.png",
    headline: "Frontend architecture and Next.js expert.",
    expertise: ["Frontend", "Next.js", "React"],
    rating: 4.9,
    reviews: 95,
    status: "offline",
    services: [
      { id: "s6", title: "Code Review", price: 1500, duration: "60 min" },
       { id: "s7", title: "Tech Stack Consultation", price: 1000, duration: "45 min" },
    ],
  },
  {
    id: "5",
    name: "Jessica Lee",
    role: "Marketing Director",
    company: "Spotify",
    avatar: "https://github.com/shadcn.png",
    headline: "Growth marketing strategies for startups and scale-ups.",
    expertise: ["Marketing", "Growth", "Branding"],
    rating: 5.0,
    reviews: 150,
    status: "online",
     services: [
      { id: "s8", title: "Marketing Strategy", price: 3000, duration: "60 min" },
    ],
  },
    {
    id: "6",
    name: "Michael Brown",
    role: "Founder",
    company: "Stealth Startup",
    avatar: "https://github.com/shadcn.png",
    headline: "Zero to One. Fundraising and building early stage teams.",
    expertise: ["Startup", "Fundraising", "Founder Journey"],
    rating: 4.7,
    reviews: 40,
    status: "offline",
     services: [
      { id: "s9", title: "Founder Chat", price: 0, duration: "30 min" },
    ],
  },
];

const FILTER_TAGS = ["All", "Product Management", "Engineering", "Design", "Marketing", "Startup", "Leadership"];

import { useNavigation } from "@/contexts/navigation-context";

export default function ProfessionalConnectPage() {
  const { setActiveSection, setActiveSubSection } = useNavigation();

  useEffect(() => {
    setActiveSection("Connect");
    setActiveSubSection("Professional Connect");
  }, [setActiveSection, setActiveSubSection]);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredMentors = MOCK_MENTORS.filter((mentor) => {
    const matchesSearch =
      mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.expertise.some((e) => e.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = activeFilter === "All" || mentor.expertise.some(e => e.includes(activeFilter)) || mentor.role.includes(activeFilter); 

    return matchesSearch && matchesFilter;
  });

  const handleNotifyMe = (name: string) => {
    toast.success("Notification Set", {
      description: `We'll enable you via email when ${name} comes online.`,
    });
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header Section */}
      <div className="border-b border-border bg-background px-6 py-6 space-y-6">
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="space-y-1 text-center sm:text-left">
            <h1 className="text-3xl font-bold tracking-tight">Professional Connect</h1>
            <p className="text-muted-foreground text-lg">
                Find and book sessions with top industry mentors.
            </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                placeholder="Search by name, role, company, or skill..."
                className="pl-9 h-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <Button variant="outline" className="sm:w-auto w-full gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
            </Button>
            </div>

            {/* Scrollable Tags */}
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar mask-gradient-right">
            {FILTER_TAGS.map((tag) => (
                <button
                key={tag}
                onClick={() => setActiveFilter(tag)}
                className={`
                    px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors
                    ${activeFilter === tag 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted text-muted-foreground hover:bg-muted/80"}
                `}
                >
                {tag}
                </button>
            ))}
            </div>
        </div>
      </div>

      {/* Grid Section */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto">
            {filteredMentors.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                    <p>No mentors found matching your criteria.</p>
                    <Button 
                        variant="link" 
                        onClick={() => { setSearchQuery(""); setActiveFilter("All"); }}
                        className="mt-2"
                    >
                        Clear Filters
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredMentors.map((mentor) => (
                    <Card 
                      key={mentor.id} 
                      className={`
                        flex flex-col hover:shadow-md transition-all duration-200 border-border/60
                        ${mentor.status === 'offline' ? 'opacity-70 grayscale-[0.3]' : 'border-primary/20 bg-primary/5'}
                      `}
                    >
                    <CardHeader className="pb-3 space-y-4">
                        <div className="flex justify-between items-start">
                             <div className="flex gap-3 relative">
                                <div className="relative">
                                  <Avatar className="h-12 w-12 border">
                                      <AvatarImage src={mentor.avatar} alt={mentor.name} />
                                      <AvatarFallback>{mentor.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                                  </Avatar>
                                  {mentor.status === 'online' && (
                                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                                  )}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-base leading-none">{mentor.name}</h3>
                                    <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                                        <Briefcase className="h-3 w-3" /> {mentor.role}
                                    </p>
                                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                                        <Building2 className="h-3 w-3" /> {mentor.company}
                                    </p>
                                </div>
                             </div>
                             {/* Rating Badge */}
                             <div className="flex items-center gap-1 bg-secondary/30 px-2 py-1 rounded text-xs font-medium text-foreground">
                                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                <span>{mentor.rating}</span>
                                <span className="text-muted-foreground">({mentor.reviews})</span>
                             </div>
                        </div>
                        
                        <p className="text-sm line-clamp-2 text-foreground/90 font-medium">
                            {mentor.headline}
                        </p>

                        <div className="flex flex-wrap gap-1.5">
                            {mentor.expertise.slice(0, 3).map((skill) => (
                                <Badge key={skill} variant="secondary" className="px-1.5 py-0.5 text-[10px] font-normal text-muted-foreground bg-secondary/50">
                                    {skill}
                                </Badge>
                            ))}
                        </div>
                    </CardHeader>

                    <CardContent className="pb-3 flex-1">
                        <Separator className="mb-3" />
                        <div className="space-y-2">
                            {mentor.services.map((service) => (
                                <div key={service.id} className="flex justify-between items-center text-sm p-2 rounded hover:bg-muted/50 transition-colors cursor-pointer group">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                                        <span className="font-medium group-hover:text-primary transition-colors">{service.title}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                         <span className="text-xs text-muted-foreground">{service.duration}</span>
                                         <Badge variant="outline" className="text-xs bg-background border-border/80">
                                            {service.price === 0 ? "Free" : `₹${service.price}`}
                                         </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                    
                    <CardFooter className="pt-0 grid grid-cols-1 gap-2">
                        <Button className="w-full font-semibold bg-foreground text-background hover:bg-foreground/90 shadow-none" asChild>
                            <Link href={`/dashboard/professional/${mentor.id}`}>
                              View Profile
                            </Link>
                        </Button>
                        {mentor.status === 'offline' && (
                          <Button variant="ghost" size="sm" className="w-full text-muted-foreground" onClick={() => handleNotifyMe(mentor.name)}>
                             <Bell className="mr-2 h-4 w-4" /> Notify Me When Online
                          </Button>
                        )}
                    </CardFooter>
                    </Card>
                ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
