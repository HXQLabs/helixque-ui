"use client";

import { useNavigation } from "@/contexts/navigation-context";
import { useEffect } from "react";
import { Sparkles, Construction } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import Link from "next/link";

export default function ProfessionalConnectPage() {
  const { setActiveSection, setActiveSubSection } = useNavigation();

  useEffect(() => {
    setActiveSection("Connect");
    setActiveSubSection("Professional Connect");
  }, [setActiveSection, setActiveSubSection]);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header Section */}
      <div className="border-b border-border bg-background px-6 py-6 space-y-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="space-y-1 text-center sm:text-left">
            <h1 className="text-3xl font-bold tracking-tight">
              Professional Connect
            </h1>
            <p className="text-muted-foreground text-lg">
              Instantly connect with top industry mentors.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content: Coming Soon */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-6">
          <div className="relative mx-auto w-24 h-24 flex items-center justify-center bg-muted/30 rounded-full">
            <Sparkles className="h-12 w-12 text-primary absolute animate-pulse" />
            <Construction className="h-6 w-6 text-muted-foreground/50 absolute bottom-4 right-4" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">Coming Soon!</h2>
            <p className="text-muted-foreground">
              We are building a world-class mentorship platform where you can
              connect with industry leaders. Stay tuned for updates!
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <Button variant="outline" asChild>
              <Link href="/dashboard">Return to Dashboard</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard/join-mentor">Apply as Mentor</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
