"use client";

import * as React from "react";
import {
  Camera,
  MapPin,
  Mail,
  Briefcase,
  Globe,
  Calendar,
  Clock,
  Edit2,
  Plus,
  Award,
  BadgeCheck,
  X,
  GraduationCap,
  Check,
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
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";

export default function ProfilePage() {
  const [isEditingAbout, setIsEditingAbout] = React.useState(false);
  const [isEditingBasicInfo, setIsEditingBasicInfo] = React.useState(false);
  const [isEditingAvailability, setIsEditingAvailability] =
    React.useState(false);
  const [avatarUrl, setAvatarUrl] = React.useState(
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  );
  const [coverImageUrl, setCoverImageUrl] = React.useState(
    "https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=400&fit=crop",
  );

  const [about, setAbout] = React.useState(
    "Passionate frontend engineer with over 5 years of experience building scalable web applications. I love working with React, TypeScript, and modern CSS tools. Currently focused on building accessible and performant user interfaces. Open to mentorship opportunities and technical discussions.",
  );

  const [basicInfo, setBasicInfo] = React.useState({
    name: "Alex Morgan",
    title: "Senior Frontend Engineer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    website: "alexmorgan.dev",
    email: "alex@helixque.com",
    joinDate: "December 2023",
  });

  const [availability, setAvailability] = React.useState({
    timezone: "PST (UTC-8)",
    workingHours: "9am - 5pm",
    status: "Available",
  });

  const [skills, setSkills] = React.useState([
    "React",
    "TypeScript",
    "Node.js",
    "Design Systems",
    "UI/UX",
    "WebRTC",
    "Next.js",
    "Tailwind CSS",
  ]);

  const [newSkill, setNewSkill] = React.useState("");
  const [skillDialogOpen, setSkillDialogOpen] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const coverInputRef = React.useRef<HTMLInputElement>(null);

  const achievements = [
    { title: "Early Adopter", icon: "🚀", description: "Joined in beta" },
    { title: "Super Host", icon: "⭐", description: "50+ meetings" },
    { title: "Connector", icon: "🤝", description: "1000+ connections" },
    { title: "Mentor", icon: "🎓", description: "10+ mentorships" },
    { title: "Reliable", icon: "✅", description: "98% attendance" },
    { title: "Active", icon: "🔥", description: "30-day streak" },
  ];

  const experience = [
    {
      company: "TechCorp Inc.",
      role: "Senior Frontend Engineer",
      period: "2021 - Present",
      description: "Leading frontend development for enterprise applications",
    },
    {
      company: "StartupXYZ",
      role: "Frontend Developer",
      period: "2019 - 2021",
      description:
        "Built responsive web applications using React and TypeScript",
    },
    {
      company: "WebDev Agency",
      role: "Junior Developer",
      period: "2018 - 2019",
      description: "Developed client websites and maintained legacy codebases",
    },
  ];

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
      setSkillDialogOpen(false);
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveBasicInfo = () => {
    setIsEditingBasicInfo(false);
  };

  const handleSaveAvailability = () => {
    setIsEditingAvailability(false);
  };

  const handleSaveAbout = () => {
    setIsEditingAbout(false);
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      {/* Cover & Profile Section */}
      <div className="relative mb-20">
        {/* Cover Image */}
        <div className="h-56 bg-gradient-to-br from-primary/20 via-primary/10 to-background rounded-2xl overflow-hidden border border-border/50 relative group cursor-pointer">
          <img
            src={coverImageUrl}
            alt="Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            onChange={handleCoverChange}
            className="hidden"
          />
          <Button
            variant="secondary"
            size="sm"
            className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 cursor-pointer"
            onClick={() => coverInputRef.current?.click()}
          >
            <Camera className="h-4 w-4 mr-2" />
            Edit Cover
          </Button>
        </div>

        {/* Profile Picture */}
        <div className="absolute -bottom-16 left-8 flex items-end gap-6">
          <div className="relative group cursor-pointer">
            <Avatar className="h-32 w-32 border-4 border-background shadow-xl ring-2 ring-border/50 transition-transform duration-300 group-hover:scale-105">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback>AM</AvatarFallback>
            </Avatar>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
            <Button
              size="icon"
              variant="secondary"
              className="absolute bottom-2 right-2 h-9 w-9 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer bg-background hover:bg-background/90"
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Personal & Professional Info */}
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-card border border-border/50 rounded-xl p-6 space-y-4 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold tracking-tight">
                    {basicInfo.name}
                  </h1>
                  <BadgeCheck className="h-5 w-5 text-blue-500 shrink-0" />
                </div>
                <p className="text-muted-foreground">{basicInfo.title}</p>
              </div>
              {!isEditingBasicInfo && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0 cursor-pointer transition-all duration-200 hover:bg-muted"
                  onClick={() => setIsEditingBasicInfo(true)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            <Separator />

            {!isEditingBasicInfo ? (
              <div className="space-y-3 transition-opacity duration-300">
                <div className="flex items-center gap-3 text-sm">
                  <Briefcase className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span>{basicInfo.company}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span>{basicInfo.location}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                  <a
                    href="#"
                    className="text-primary hover:underline truncate cursor-pointer"
                  >
                    {basicInfo.website}
                  </a>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="truncate">{basicInfo.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span>Joined {basicInfo.joinDate}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-4 transition-opacity duration-300">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={basicInfo.name}
                    onChange={(e) =>
                      setBasicInfo({ ...basicInfo, name: e.target.value })
                    }
                    className="cursor-text"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    value={basicInfo.title}
                    onChange={(e) =>
                      setBasicInfo({ ...basicInfo, title: e.target.value })
                    }
                    className="cursor-text"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={basicInfo.company}
                    onChange={(e) =>
                      setBasicInfo({ ...basicInfo, company: e.target.value })
                    }
                    className="cursor-text"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={basicInfo.location}
                    onChange={(e) =>
                      setBasicInfo({ ...basicInfo, location: e.target.value })
                    }
                    className="cursor-text"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={basicInfo.website}
                    onChange={(e) =>
                      setBasicInfo({ ...basicInfo, website: e.target.value })
                    }
                    className="cursor-text"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={basicInfo.email}
                    onChange={(e) =>
                      setBasicInfo({ ...basicInfo, email: e.target.value })
                    }
                    className="cursor-text"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingBasicInfo(false)}
                    className="cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveBasicInfo}
                    className="cursor-pointer"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Availability */}
          <div className="bg-card border border-border/50 rounded-xl p-6 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Availability
              </h3>
              {!isEditingAvailability && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 cursor-pointer transition-all duration-200 hover:bg-muted"
                  onClick={() => setIsEditingAvailability(true)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            {!isEditingAvailability ? (
              <div className="space-y-3 transition-opacity duration-300">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Timezone</span>
                  <span className="font-medium">{availability.timezone}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Working Hours</span>
                  <span className="font-medium">
                    {availability.workingHours}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <Badge
                    variant="default"
                    className="bg-green-500/10 text-green-500 hover:bg-green-500/20 cursor-default"
                  >
                    {availability.status}
                  </Badge>
                </div>
              </div>
            ) : (
              <div className="space-y-4 transition-opacity duration-300">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input
                    id="timezone"
                    value={availability.timezone}
                    onChange={(e) =>
                      setAvailability({
                        ...availability,
                        timezone: e.target.value,
                      })
                    }
                    className="cursor-text"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hours">Working Hours</Label>
                  <Input
                    id="hours"
                    value={availability.workingHours}
                    onChange={(e) =>
                      setAvailability({
                        ...availability,
                        workingHours: e.target.value,
                      })
                    }
                    className="cursor-text"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Input
                    id="status"
                    value={availability.status}
                    onChange={(e) =>
                      setAvailability({
                        ...availability,
                        status: e.target.value,
                      })
                    }
                    className="cursor-text"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingAvailability(false)}
                    className="cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveAvailability}
                    className="cursor-pointer"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Skills */}
          <div className="bg-card border border-border/50 rounded-xl p-6 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Skills & Expertise</h3>
              <Dialog open={skillDialogOpen} onOpenChange={setSkillDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 cursor-pointer transition-all duration-200 hover:bg-muted"
                  >
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
                      <Input
                        id="skill"
                        placeholder="e.g., React"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleAddSkill();
                          }
                        }}
                        className="cursor-text"
                      />
                    </div>
                    <Button
                      className="w-full cursor-pointer"
                      onClick={handleAddSkill}
                    >
                      Add Skill
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="px-3 py-1 flex items-center gap-1.5 group transition-all duration-200 hover:scale-105"
                >
                  {skill}
                  <button
                    onClick={() => handleRemoveSkill(skill)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 hover:bg-secondary/80 rounded-full p-0.5 cursor-pointer"
                    aria-label={`Remove ${skill}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: About, Experience & Achievements */}
        <div className="lg:col-span-2 space-y-6">
          {/* About Section */}
          <div className="bg-card border border-border/50 rounded-xl p-6 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">About</h3>
              {!isEditingAbout && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 cursor-pointer transition-all duration-200 hover:bg-muted"
                  onClick={() => setIsEditingAbout(true)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            {isEditingAbout ? (
              <div className="space-y-4 transition-opacity duration-300">
                <textarea
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  className="w-full min-h-[120px] p-3 bg-background border border-border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-text"
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingAbout(false)}
                    className="cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveAbout}
                    className="cursor-pointer"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground leading-relaxed transition-opacity duration-300">
                {about}
              </p>
            )}
          </div>

          {/* Experience Section */}
          <div className="bg-card border border-border/50 rounded-xl p-6 transition-all duration-300">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold">Experience</h3>
            </div>
            <div className="space-y-4">
              {experience.map((exp, index) => (
                <div
                  key={index}
                  className="pb-4 last:pb-0 border-b last:border-0 border-border/50 last:border-b-0 transition-all duration-200 hover:bg-muted/30 rounded-lg p-3 -m-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{exp.role}</h4>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {exp.company}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {exp.period}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        {exp.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-card border border-border/50 rounded-xl p-6 transition-all duration-300">
            <div className="flex items-center gap-2 mb-4">
              <Award className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold">Achievements</h3>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement) => (
                <div
                  key={achievement.title}
                  className="bg-muted/30 rounded-xl p-4 text-center hover:bg-muted/50 transition-all duration-300 border border-border/50 cursor-default hover:scale-105 hover:shadow-md"
                >
                  <div className="text-3xl mb-2">{achievement.icon}</div>
                  <p className="text-sm font-semibold mb-1">
                    {achievement.title}
                  </p>
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
