"use client";

import * as React from "react";
import {
  Camera,
  MapPin,
  Link as LinkIcon,
  Mail,
  Briefcase,
  Globe,
  Calendar,
  Users,
  Video,
  Clock,
  Edit2,
  Plus,
  Star,
  TrendingUp,
  Award,
  BadgeCheck,
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Separator } from "@workspace/ui/components/separator";
import { Badge } from "@workspace/ui/components/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";

export default function ProfilePage() {
  const [isEditingAbout, setIsEditingAbout] = React.useState(false);
  const [about, setAbout] = React.useState(
    "Passionate frontend engineer with over 5 years of experience building scalable web applications. I love working with React, TypeScript, and modern CSS tools. Currently focused on building accessible and performant user interfaces. Open to mentorship opportunities and technical discussions."
  );

  const skills = [
    "React",
    "TypeScript",
    "Node.js",
    "Design Systems",
    "UI/UX",
    "WebRTC",
    "Next.js",
    "Tailwind CSS",
  ];

  const stats = [
    { label: "Connections", value: "1,284", icon: Users, trend: "+12%" },
    { label: "Meetings", value: "42", icon: Video, trend: "+5%" },
    { label: "Hours", value: "38.5", icon: Clock, trend: "-2%" },
    { label: "Rating", value: "4.9", icon: Star, trend: "+0.2" },
  ];

  return (
    <div className="max-w-6xl mx-auto pb-12">
      {/* Cover & Profile Section */}
      <div className="relative mb-20">
        {/* Cover Image */}
        <div className="h-56 bg-gradient-to-br from-primary/20 via-primary/10 to-background rounded-2xl overflow-hidden border border-border/50 relative group">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,hsl(var(--primary)/0.1),transparent)] opacity-60" />
          <Button
            variant="secondary"
            size="sm"
            className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Camera className="h-4 w-4 mr-2" />
            Edit Cover
          </Button>
        </div>

        {/* Profile Picture */}
        <div className="absolute -bottom-16 left-8 flex items-end gap-6">
          <div className="relative group">
            <Avatar className="h-32 w-32 border-4 border-background shadow-xl ring-2 ring-border/50">
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" />
              <AvatarFallback>AM</AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              variant="secondary"
              className="absolute bottom-2 right-2 h-8 w-8 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Camera className="h-4 w-4" />
            </Button>
            <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 ring-4 ring-background">
              <BadgeCheck className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="absolute bottom-4 right-8 flex gap-2">
          <Button variant="outline" size="sm">
            <Edit2 className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
          <Button size="sm">Share Profile</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Info & Stats */}
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-card border border-border/50 rounded-xl p-6 space-y-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight mb-1">Alex Morgan</h1>
              <p className="text-muted-foreground">Senior Frontend Engineer</p>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span>TechCorp Inc.</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>San Francisco, CA</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <a href="#" className="text-primary hover:underline">
                  alexmorgan.dev
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>alex@helixque.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Joined December 2023</span>
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="bg-card border border-border/50 rounded-xl p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Availability
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Timezone</span>
                <span className="font-medium">PST (UTC-8)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Working Hours</span>
                <span className="font-medium">9am - 5pm</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <Badge variant="default" className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
                  Available
                </Badge>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="bg-card border border-border/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Skills & Expertise</h3>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon-sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Skill</DialogTitle>
                    <DialogDescription>
                      Add a new skill to your profile
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="skill">Skill Name</Label>
                      <Input id="skill" placeholder="e.g., React" />
                    </div>
                    <Button className="w-full">Add Skill</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="px-3 py-1">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-card border border-border/50 rounded-xl p-4 hover:border-primary/50 transition-colors group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                    <stat.icon className="h-4 w-4" />
                  </div>
                  <div className="flex items-center gap-1 text-xs font-medium">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-green-500">{stat.trend}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* About Section */}
          <div className="bg-card border border-border/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">About</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditingAbout(!isEditingAbout)}
              >
                <Edit2 className="h-4 w-4 mr-2" />
                {isEditingAbout ? "Cancel" : "Edit"}
              </Button>
            </div>
            {isEditingAbout ? (
              <div className="space-y-4">
                <textarea
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  className="w-full min-h-[120px] p-3 bg-background border border-border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingAbout(false)}
                  >
                    Cancel
                  </Button>
                  <Button size="sm" onClick={() => setIsEditingAbout(false)}>
                    Save Changes
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground leading-relaxed">{about}</p>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-card border border-border/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {[
                {
                  action: "Completed meeting",
                  detail: "Product Design Review with Sarah Chen",
                  time: "2 hours ago",
                  icon: Video,
                },
                {
                  action: "New connection",
                  detail: "Connected with Mike Ross",
                  time: "Yesterday",
                  icon: Users,
                },
                {
                  action: "Achievement unlocked",
                  detail: "Hosted 50 successful meetings",
                  time: "2 days ago",
                  icon: Award,
                },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 pb-4 last:pb-0 border-b last:border-0 border-border/50"
                >
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <activity.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {activity.detail}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-card border border-border/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Achievements</h3>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: "Early Adopter", icon: "🚀", description: "Joined in beta" },
                { title: "Super Host", icon: "⭐", description: "50+ meetings" },
                { title: "Connector", icon: "🤝", description: "1000+ connections" },
                { title: "Mentor", icon: "🎓", description: "10+ mentorships" },
                { title: "Reliable", icon: "✅", description: "98% attendance" },
                { title: "Active", icon: "🔥", description: "30-day streak" },
              ].map((achievement) => (
                <div
                  key={achievement.title}
                  className="bg-muted/30 rounded-xl p-4 text-center hover:bg-muted/50 transition-colors border border-border/50"
                >
                  <div className="text-3xl mb-2">{achievement.icon}</div>
                  <p className="text-sm font-semibold mb-1">{achievement.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {achievement.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
