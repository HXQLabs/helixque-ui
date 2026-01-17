"use client";
import * as React from "react";
import Link from "next/link";
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Settings,
  Sparkles,
  UserIcon,
} from "lucide-react";
import { SettingsDialog } from "./settings-dialog";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@workspace/ui/components/sidebar";
import { useHelixque } from "@workspace/state";

import { signOut, useSession } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// ... existing imports ...

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const { isMobile } = useSidebar();
  const { settingsOpen, setSettingsOpen } = useHelixque();
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/upgrade" className="w-full cursor-pointer">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Upgrade to Pro
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup> 
              <DropdownMenuItem asChild>
                <Link href="/dashboard/edit-profile" className="w-full cursor-pointer">
                  <UserIcon className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
               <DropdownMenuItem asChild>
                 <Link href="/dashboard/settings?tab=account" className="w-full cursor-pointer">
                  <BadgeCheck className="mr-2 h-4 w-4" />
                  Account Settings
                 </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                 <Link href="/dashboard/billing" className="w-full cursor-pointer">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Billing
                 </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                 <Link href="/dashboard/settings?tab=notifications" className="w-full cursor-pointer">
                  <Bell className="mr-2 h-4 w-4" />
                  Notification Prefs
                 </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                 <Link href="/dashboard/settings" className="w-full cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  General Settings
                 </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </SidebarMenu>
  );
}
