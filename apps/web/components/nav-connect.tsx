"use client";

import {
  type LucideIcon,
} from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar";
import Link from "next/link";

export function NavConnect({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
    badge?: number;
  }[];
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Connect</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild tooltip={item.title}>
              <Link href={item.url}>
                <item.icon />
                <span>{item.title}</span>
                {item.badge != undefined && item.badge > 0 && <span className="ml-auto text-xs">{item.badge}</span>}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
