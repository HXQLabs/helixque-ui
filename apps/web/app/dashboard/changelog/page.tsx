"use client";

import { useNavigation } from "@/contexts/navigation-context";
import { useEffect } from "react";
import { Badge } from "@workspace/ui/components/badge";
import { Separator } from "@workspace/ui/components/separator";

const CHANGELOG = [
  {
    version: "v2.1.0",
    date: "January 15, 2026",
    title: "AI Assistant & Professional Connect",
    changes: [
      {
        type: "New",
        description:
          "Launched AI Assistant with intelligent context awareness.",
      },
      {
        type: "New",
        description: "Professional Connect marketplace for finding mentors.",
      },
      {
        type: "New",
        description: "Integrated video calling for mentor sessions.",
      },
      {
        type: "Improvement",
        description: "Enhanced sidebar navigation and mobile responsiveness.",
      },
    ],
  },
  {
    version: "v2.0.5",
    date: "December 28, 2025",
    title: "Performance & UI Polish",
    changes: [
      { type: "Improvement", description: "Reduced initial load time by 40%." },
      {
        type: "Fix",
        description: "Fixed hydration issues on dashboard charts.",
      },
      {
        type: "Improvement",
        description: "Updated color palette for better accessibility.",
      },
    ],
  },
  {
    version: "v2.0.0",
    date: "December 10, 2025",
    title: "The Rebrand: Helixque",
    changes: [
      {
        type: "New",
        description:
          "Complete rebranding from 'Instant Connect' to 'Helixque'.",
      },
      { type: "New", description: "Dark mode is now the default experience." },
      {
        type: "New",
        description: "Launched new landing page and marketing assets.",
      },
    ],
  },
];

export default function ChangelogPage() {
  const { setActiveSection, setActiveSubSection } = useNavigation();

  useEffect(() => {
    setActiveSection("Resources");
    setActiveSubSection("Changelog");
  }, [setActiveSection, setActiveSubSection]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "New":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "Improvement":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "Fix":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      default:
        return "";
    }
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto p-6">
      <div className="max-w-3xl mx-auto w-full space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Changelog</h1>
          <p className="text-xl text-muted-foreground">
            Latest updates and improvements to Helixque.
          </p>
        </div>

        <div className="relative border-l border-border ml-4 md:ml-0 space-y-12 pb-12">
          {CHANGELOG.map((release, index) => (
            <div key={release.version} className="relative pl-8 md:pl-12">
              {/* Timeline Dot */}
              <div className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-background" />

              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <h2 className="text-2xl font-semibold bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                    {release.version}
                  </h2>
                  <span className="text-sm text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                    {release.date}
                  </span>
                </div>

                <div className="bg-card/40 border rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-medium mb-6">{release.title}</h3>
                  <ul className="space-y-4">
                    {release.changes.map((change, i) => (
                      <li key={i} className="flex gap-4 items-start">
                        <Badge
                          variant="outline"
                          className={`${getTypeColor(change.type)} shrink-0 mt-0.5`}
                        >
                          {change.type}
                        </Badge>
                        <span className="text-muted-foreground leading-relaxed">
                          {change.description}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
