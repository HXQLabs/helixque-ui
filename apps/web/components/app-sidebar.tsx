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
  Briefcase,
  Trophy,
  Bell,
  Bookmark,
  TrendingUp,
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
      title: "Opportunities",
      url: "/dashboard/opportunities",
      icon: Briefcase,
      badge: "New",
    },
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
      title: "Leaderboard",
      url: "/dashboard/leaderboard",
      icon: Trophy,
    },
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
     {
      title: "Notifications",
      url: "/dashboard/notifications",
      icon: Bell,
      badge: 4,
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
        title: "Saved Items",
        url: "/dashboard/saved",
        icon: Bookmark,
     },
     {
        title: "Analytics",
        url: "/dashboard/analytics",
        icon: TrendingUp,
     },
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

import { useSession } from "next-auth/react";

// ... existing imports ...

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session, status } = useSession();
  
  console.log("AppSidebar Session:", { status, user: session?.user });

  const user = {
    name: session?.user?.name || "User",
    email: session?.user?.email || "user@example.com",
    avatar: session?.user?.image || "https://github.com/shadcn.png",
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center">
                  <Image src="/logo.svg" alt="Helixque" width={24} height={24} className="size-8" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Helixque</span>
                  <span className="truncate text-xs">Instant Connect</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavConnect items={data.connect} />
        
        <SidebarGroup id="sidebar-community">
           <SidebarGroupLabel>Community</SidebarGroupLabel>
           <SidebarMenu>
              {data.community.map((item) => (
                  <SidebarMenuItem key={item.title}>
                     <SidebarMenuButton asChild tooltip={item.title}>
                        <Link href={item.url}>
                           <item.icon />
                           <span>{item.title}</span>
                           {/* Badge logic if needed, data.community has badge for Notifications */}
                           {/* @ts-ignore - badge exists on some items */}
                           {item.badge ? <span className="ml-auto flex size-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-medium text-primary shadow-xs">{item.badge}</span> : null}
                        </Link>
                     </SidebarMenuButton>
                  </SidebarMenuItem>
               ))}
           </SidebarMenu>
        </SidebarGroup>

        <NavSocials items={data.socials} />

        <SidebarGroup id="sidebar-resources">
           <SidebarGroupLabel>Resources</SidebarGroupLabel>
           <SidebarMenu>
              {data.resources.map((item) => (
                  <SidebarMenuItem key={item.title}>
                     <SidebarMenuButton asChild tooltip={item.title}>
                        <Link href={item.url}>
                           <item.icon />
                           <span>{item.title}</span>
                        </Link>
                     </SidebarMenuButton>
                  </SidebarMenuItem>
               ))}
           </SidebarMenu>
        </SidebarGroup>

        <NavProFeatures features={data.proFeatures} />
      </SidebarContent>
      <SidebarFooter id="sidebar-user">
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
