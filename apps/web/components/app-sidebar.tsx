"use client";

import * as React from "react";
import Image from "next/image";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  Map,
  MessageCircle,
  Users,
  Heart,
  Handshake,
  Award,
  PieChart,
  Settings2,
  SquareTerminal,
  Zap,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProFeatures } from "@/components/nav-pro-features";
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
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
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
  proFeatures: [
    {
      title: "Upgrade Plan",
      url: "#",
      icon: Zap,
    },
    {
      title: "Advanced Settings",
      url: "#",
      icon: Settings2,
    },
    {
      title: "AI Assistant",
      url: "#",
      icon: Zap,
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
      title: "Anonymous Connect",
      url: "#",
      icon: Heart,
      badge: 0,
    },
    {
      title: "Professional Connect",
      url: "#",
      icon: Handshake,
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
        <NavProFeatures features={data.proFeatures} />
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
