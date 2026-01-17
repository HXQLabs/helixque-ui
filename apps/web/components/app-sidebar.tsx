"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
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
  UserPen,
  Sparkles,
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
  SidebarGroup,
  SidebarGroupLabel,
} from "@workspace/ui/components/sidebar";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "https://github.com/evilrabbit.png",
  },
  connect: [
    {
      title: "Professional Connect",
      url: "/dashboard/professional",
      icon: Handshake,
      badge: 0,
    },
    {
      title: "AI Assistant",
      url: "/dashboard/ai-assistant",
      icon: Bot, 
    },
    {
      title: "Join as a Mentor",
      url: "/dashboard/join-mentor",
      icon: Award,
      badge: 0,
    },
    {
      title: "Random Connect",
      url: "/meet",
      icon: Sparkles,
    },
  ],
  community: [
    {
      title: "Events",
      url: "/dashboard/events",
      icon: Zap, // Using Zap for now, potentially generic
    },
    {
      title: "Discussions",
      url: "/dashboard/community",
      icon: MessageCircle,
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
  resources: [
     {
        title: "Blogs",
        url: "/dashboard/blogs",
        icon: BookOpen,
     },
     {
        title: "Changelog",
        url: "/dashboard/changelog",
        icon: Settings2, // Generic icon
     },
     {
        title: "Help Center",
        url: "/dashboard/help",
        icon: Heart,
     },
  ],
  proFeatures: [
    {
      title: "Upgrade Plan",
      url: "/dashboard/upgrade",
      icon: Zap,
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
              <Link href="/dashboard">
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
              </Link>
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
        <SidebarGroup>
           <SidebarGroupLabel>Platform</SidebarGroupLabel>
           <SidebarMenu>
              {data.connect.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link href={item.url}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
           </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup id="sidebar-community">
           <SidebarGroupLabel>Community</SidebarGroupLabel>
           <SidebarMenu>
              {data.community.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link href={item.url}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {data.socials.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link href={item.url}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                       {item.badge && <span className="ml-auto text-xs">{item.badge}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
           </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup id="sidebar-resources">
           <SidebarGroupLabel>Resources</SidebarGroupLabel>
           <SidebarMenu>
              {data.resources.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link href={item.url}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
           </SidebarMenu>
        </SidebarGroup>

        <NavProFeatures features={data.proFeatures} />
        
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Edit Profile">
                <Link href="/dashboard/edit-profile">
                  <UserPen />
                  <span>Edit Profile</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter id="sidebar-user">
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
