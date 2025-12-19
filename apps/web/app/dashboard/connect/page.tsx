"use client";

import * as React from "react";
import {
  Zap,
  Briefcase,
  Video,
  MessageSquare,
  Search,
  Loader2,
  Check,
  User,
  Globe,
  X,
  Shield,
  Clock,
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Badge } from "@workspace/ui/components/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { Separator } from "@workspace/ui/components/separator";
import { useRouter } from "next/navigation";

type MatchMode = "loose" | "strict";
type ConnectionType = "anonymous" | "professional";

export default function ConnectPage() {
  const router = useRouter();
  const [mode, setMode] = React.useState<MatchMode>("loose");
  const [connectionType, setConnectionType] = React.useState<ConnectionType>("professional");
  const [isSearching, setIsSearching] = React.useState(false);
  const [matchFound, setMatchFound] = React.useState(false);
  const [industry, setIndustry] = React.useState("");
  const [expertise, setExpertise] = React.useState("");

  const handleSearch = () => {
    setIsSearching(true);
    setMatchFound(false);
    // Simulate matching
    setTimeout(() => {
      setIsSearching(false);
      setMatchFound(true);
    }, 2500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-primary" />
          <Badge variant="outline" className="text-xs">
            End-to-end Encrypted
          </Badge>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">
          Find Your Next Connection
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Connect instantly with professionals worldwide. Choose your matching style
          and start networking in seconds.
        </p>
      </div>

      {/* Connection Type Toggle */}
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-2 bg-muted p-1 rounded-xl">
          <Button
            variant={connectionType === "professional" ? "default" : "ghost"}
            size="sm"
            onClick={() => setConnectionType("professional")}
            className="gap-2"
          >
            <Briefcase className="h-4 w-4" />
            Professional
          </Button>
          <Button
            variant={connectionType === "anonymous" ? "default" : "ghost"}
            size="sm"
            onClick={() => setConnectionType("anonymous")}
            className="gap-2"
          >
            <Shield className="h-4 w-4" />
            Anonymous
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel - Preferences */}
        <div className="bg-card border border-border/50 rounded-2xl p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Match Preferences</h3>
            <p className="text-sm text-muted-foreground mb-6">
              {connectionType === "anonymous"
                ? "Your identity will remain hidden during this session"
                : "Your profile will be visible to matched connections"}
            </p>
          </div>

          <Separator />

          {/* Mode Selection */}
          <div className="space-y-3">
            <Label>Matching Mode</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={mode === "loose" ? "default" : "outline"}
                className="h-auto flex-col items-start p-4 gap-2"
                onClick={() => setMode("loose")}
              >
                <div className="flex items-center gap-2 w-full">
                  <Zap className="h-4 w-4" />
                  <span className="font-semibold">Loose</span>
                  {mode === "loose" && <Check className="h-4 w-4 ml-auto" />}
                </div>
                <span className="text-xs text-left opacity-80">
                  Quick, flexible matching
                </span>
              </Button>
              <Button
                variant={mode === "strict" ? "default" : "outline"}
                className="h-auto flex-col items-start p-4 gap-2"
                onClick={() => setMode("strict")}
              >
                <div className="flex items-center gap-2 w-full">
                  <Briefcase className="h-4 w-4" />
                  <span className="font-semibold">Strict</span>
                  {mode === "strict" && <Check className="h-4 w-4 ml-auto" />}
                </div>
                <span className="text-xs text-left opacity-80">
                  Exact criteria matching
                </span>
              </Button>
            </div>
          </div>

          {/* Looking For */}
          <div className="space-y-3">
            <Label>Looking for</Label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Mentorship", icon: User },
                { label: "Casual Chat", icon: MessageSquare },
                { label: "Hiring", icon: Briefcase },
                { label: "Networking", icon: Globe },
              ].map((option) => (
                <Button
                  key={option.label}
                  variant="outline"
                  size="sm"
                  className="justify-start gap-2"
                >
                  <option.icon className="h-4 w-4" />
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {mode === "strict" && (
            <>
              <Separator />
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <select
                    id="industry"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm"
                  >
                    <option value="">Select industry</option>
                    <option value="tech">Technology & Software</option>
                    <option value="design">Design & Creative</option>
                    <option value="finance">Finance & Business</option>
                    <option value="marketing">Marketing & Sales</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expertise">Expertise / Topics</Label>
                  <Input
                    id="expertise"
                    value={expertise}
                    onChange={(e) => setExpertise(e.target.value)}
                    placeholder="e.g., React, Product Design"
                  />
                </div>
              </div>
            </>
          )}

          <Button
            onClick={handleSearch}
            disabled={isSearching || matchFound}
            className="w-full h-12 text-base font-semibold gap-2"
            size="lg"
          >
            {isSearching ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Finding Match...
              </>
            ) : (
              <>
                <Search className="h-5 w-5" />
                Find Connection
              </>
            )}
          </Button>
        </div>

        {/* Right Panel - Results */}
        <div className="bg-card border border-border/50 rounded-2xl p-6 min-h-[500px] flex items-center justify-center">
          {!isSearching && !matchFound && (
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto">
                <Search className="h-10 w-10 text-muted-foreground/50" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Ready to Connect?</h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                  Set your preferences and click "Find Connection" to start matching
                  with professionals.
                </p>
              </div>
            </div>
          )}

          {isSearching && (
            <div className="text-center space-y-6 animate-in fade-in duration-500">
              <div className="relative w-32 h-32 mx-auto">
                <div className="absolute inset-0 border-4 border-primary/30 rounded-full animate-ping" />
                <div className="absolute inset-0 border-4 border-primary/50 rounded-full animate-pulse" />
                <Avatar className="absolute inset-4 w-24 h-24">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Match" />
                  <AvatarFallback>?</AvatarFallback>
                </Avatar>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Searching for a match...</h3>
                <p className="text-sm text-muted-foreground">
                  Looking for professionals in your criteria
                </p>
              </div>
            </div>
          )}

          {matchFound && (
            <div className="w-full space-y-6 animate-in slide-in-from-bottom-4 duration-500">
              <div className="text-center space-y-4">
                <div className="relative w-24 h-24 mx-auto">
                  <Avatar className="w-24 h-24 border-4 border-primary/20">
                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" />
                    <AvatarFallback>SC</AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-0 right-0 w-7 h-7 bg-green-500 rounded-full border-4 border-background flex items-center justify-center">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-1">Sarah Chen</h2>
                  <p className="text-sm text-muted-foreground mb-3">
                    Senior Product Designer @ TechCorp
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 mb-4">
                    <Badge variant="secondary">UX Design</Badge>
                    <Badge variant="secondary">React</Badge>
                    <Badge variant="secondary">Mentorship</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground italic max-w-md mx-auto">
                    "Passionate about building accessible interfaces and mentoring
                    junior designers."
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => setMatchFound(false)}
                >
                  <X className="h-4 w-4" />
                  Skip
                </Button>
                <Button
                  className="gap-2"
                  onClick={() =>
                    router.push(
                      `/meet?identity=${connectionType === "anonymous" ? "anonymous" : "exposed"}`
                    )
                  }
                >
                  <Video className="h-4 w-4" />
                  Start Call
                </Button>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="w-full gap-2"
                onClick={() => router.push("/dashboard/chats")}
              >
                <MessageSquare className="h-4 w-4" />
                Send Message
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8">
        {[
          {
            icon: Shield,
            title: "Secure & Private",
            description: "End-to-end encrypted connections",
          },
          {
            icon: Zap,
            title: "Instant Matching",
            description: "Connect in seconds with AI-powered matching",
          },
          {
            icon: Globe,
            title: "Global Network",
            description: "Connect with professionals worldwide",
          },
        ].map((feature) => (
          <div
            key={feature.title}
            className="bg-muted/30 rounded-xl p-6 text-center border border-border/50"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <feature.icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
