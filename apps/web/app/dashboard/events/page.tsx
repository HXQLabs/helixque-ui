"use client";

import { useNavigation } from "@/contexts/navigation-context";
import React, { useEffect } from "react";
import { Button } from "@workspace/ui/components/button";
import { CalendarClock, ArrowLeft } from "lucide-react";
import Link from "next/link";

function EventsPageContent() {
  const { setActiveSection, setActiveSubSection } = useNavigation();

  useEffect(() => {
    setActiveSection("Community");
    setActiveSubSection("Events");
  }, [setActiveSection, setActiveSubSection]);

  return (
    <div className="flex flex-col h-full bg-background items-center justify-center p-6 text-center space-y-6">
      <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <CalendarClock className="h-12 w-12 text-primary" />
      </div>

      <div className="space-y-2 max-w-md">
        <h1 className="text-3xl font-bold tracking-tight">
          Events Coming Soon
        </h1>
        <p className="text-muted-foreground text-lg">
          We are planning some exciting webinars, workshops, and meetups. Stay
          tuned for updates!
        </p>
      </div>

      <div className="pt-4">
        <Button asChild variant="outline">
          <Link href="/dashboard/community">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Community
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default function EventsPage() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <EventsPageContent />
    </React.Suspense>
  );
}
