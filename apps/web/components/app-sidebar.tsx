"use client";


import * as React from "react";
import Image from "next/image";
import {
  AudioWaveform,
  Blocks,
  BookOpen,
  Command,
  Frame,
  Map,
  MessageCircle,
  Users,
  Heart,
  Link as LinkIcon,
  Award,
  PieChart,
  Settings2,
  Trophy,
  Zap,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavSocials } from "@/components/nav-socials";
import { NavConnect } from "@/components/nav-connect";
import { NavUser } from "@/components/nav-user";
// import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@workspace/ui/components/sidebar";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "https://github.com/evilrabbit.png",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: "https://www.helixque.com/logo.svg",
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Collaboration",
      url: "#",
      icon: Blocks,
      isActive: true,
      items: [
        {
          title: "Whiteboard",
          url: "/dashboard/whiteboard",
        },
        {
          title: "Brainstorm Room",
          url: "#",
        },
        {
          title: "History",
          url: "#",
        },
      ],
    },
    {
      title: "Achievements",
      url: "#",
      icon: Trophy,
      items: [
        {
          title: "Helix Points",
          url: "#",
        },
        {
          title: "Badges",
          url: "#",
        },
        {
          title: "Streaks",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],

  socials: [
    {
      title: "Friends",
      url: "/dashboard/friends",
      icon: Users,
      badge: 0,
    },
    {
      title: "Chats",
      url: "/dashboard/chats",
      icon: MessageCircle,
      badge: 3,
    },
  ],
  connect: [
    {
      title: "Connect",
      url: "/dashboard/anonymous-connect",
      icon: LinkIcon,
      badge: 0,
    },
    {
      title: "Join as a Mentor",
      url: "#",
      icon: Award,
      badge: 0,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          {/* Single Profile Display - Future: Will replace with ProfileSwitcher for multiple profiles */}
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <a href="#">
                  <div className="bg-sidebar text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    {/* <GalleryVerticalEnd className="size-4" /> */}
                    <Image
                      src="https://www.helixque.com/logo.svg"
                      alt="Helixque Logo"
                      width={32}
                      height={32}
                    />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-semibold">Helixque</span>
                    <span className="text-xs">Company</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          {/* TODO: Implement ProfileSwitcher component for multiple profile/organization switching
          <ProfileSwitcher profiles={data.profiles} currentProfile={data.currentProfile} />
          */}

          {/* Original TeamSwitcher implementation - Keep for reference
          <TeamSwitcher teams={data.teams} />
          */}
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={data.navMain} />
          {/* <NavProjects projects={data.projects} /> */}
          <NavSocials items={data.socials} />
          <NavConnect items={data.connect} />

        </SidebarContent>
        <SidebarFooter>
          <NavUser user={data.user} />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
  );
}
