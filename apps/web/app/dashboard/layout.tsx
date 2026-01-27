"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { CommandMenu } from "@/components/command-menu";
import {
  NavigationProvider,
  useNavigation,
} from "@/contexts/navigation-context";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb";
import { Button } from "@workspace/ui/components/button";
import { Separator } from "@workspace/ui/components/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@workspace/ui/components/sidebar";
import * as Tour from "@workspace/ui/components/tour";
import { useHelixque } from "@workspace/state";
import { ThemeToggle } from "@/components/theme-toggle";

import { useSearchParams } from "next/navigation";
import * as React from "react";
import { useEffect } from "react";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { activeSection, activeSubSection } = useNavigation();
  const tourOpen = useHelixque((state) => state.tourOpen);
  const setTourOpen = useHelixque((state) => state.setTourOpen);
  /* Removed duplicate line */

  return (
    <>
      <React.Suspense fallback={null}>
        <TourInitializer setTourOpen={setTourOpen} />
      </React.Suspense>
      <Tour.Root open={tourOpen} onOpenChange={setTourOpen}>
        <Tour.Portal>
          <Tour.Spotlight />
          <Tour.SpotlightRing className="rounded-lg border-2 border-primary" />

          <Tour.Step
            target="#sidebar-trigger"
            side="bottom"
            sideOffset={8}
            alignOffset={0}
          >
            <Tour.Arrow />
            <Tour.Header>
              <Tour.Title>Navigation Toggle</Tour.Title>
              <Tour.Description>
                Click here to toggle the sidebar navigation.
              </Tour.Description>
            </Tour.Header>
            <Tour.Footer>
              <Tour.StepCounter />
              <div className="ml-auto flex gap-2">
                <Tour.Skip />
                <Tour.Next />
              </div>
            </Tour.Footer>
          </Tour.Step>

          <Tour.Step
            target="#breadcrumb"
            side="bottom"
            sideOffset={8}
            alignOffset={0}
          >
            <Tour.Arrow />
            <Tour.Header>
              <Tour.Title>Breadcrumb Navigation</Tour.Title>
              <Tour.Description>
                Track your current location within the dashboard.
              </Tour.Description>
            </Tour.Header>
            <Tour.Footer>
              <Tour.StepCounter />
              <div className="ml-auto flex gap-2">
                <Tour.Prev />
                <Tour.Next />
              </div>
            </Tour.Footer>
          </Tour.Step>

          <Tour.Step
            target="#sidebar-community"
            side="right"
            sideOffset={8}
            alignOffset={0}
          >
            <Tour.Arrow />
            <Tour.Header>
              <Tour.Title>Community Hub</Tour.Title>
              <Tour.Description>
                Join upcoming events, participate in discussions, and connect
                with peers.
              </Tour.Description>
            </Tour.Header>
            <Tour.Footer>
              <Tour.StepCounter />
              <div className="ml-auto flex gap-2">
                <Tour.Prev />
                <Tour.Next />
              </div>
            </Tour.Footer>
          </Tour.Step>

          <Tour.Step
            target="#sidebar-resources"
            side="right"
            sideOffset={8}
            alignOffset={0}
          >
            <Tour.Arrow />
            <Tour.Header>
              <Tour.Title>Resources & Learning</Tour.Title>
              <Tour.Description>
                Access curated blogs, changelogs, and our help center.
              </Tour.Description>
            </Tour.Header>
            <Tour.Footer>
              <Tour.StepCounter />
              <div className="ml-auto flex gap-2">
                <Tour.Prev />
                <Tour.Next />
              </div>
            </Tour.Footer>
          </Tour.Step>

          <Tour.Step
            target="#sidebar-user"
            side="right"
            sideOffset={8}
            alignOffset={0}
          >
            <Tour.Arrow />
            <Tour.Header>
              <Tour.Title>Your Profile</Tour.Title>
              <Tour.Description>
                Manage your account settings, billing, and subscription here.
              </Tour.Description>
            </Tour.Header>
            <Tour.Footer>
              <Tour.StepCounter />
              <div className="ml-auto flex gap-2">
                <Tour.Prev />
                <Tour.Next />
              </div>
            </Tour.Footer>
          </Tour.Step>
        </Tour.Portal>
      </Tour.Root>

      <SidebarInset>
        <header
          className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"
          id="dashboard-header"
        >
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" id="sidebar-trigger" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb id="breadcrumb">
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">{activeSection}</BreadcrumbLink>
                </BreadcrumbItem>
                {activeSubSection && (
                  <>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{activeSubSection}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto mr-4 flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTourOpen(true)}
            >
              Start Tour
            </Button>
          </div>
        </header>
        <div
          className="flex flex-1 flex-col gap-4 p-4 pt-0 overflow-hidden min-h-0"
          id="dashboard-content"
        >
          {children}
        </div>
      </SidebarInset>
    </>
  );
}

function TourInitializer({
  setTourOpen,
}: {
  setTourOpen: (open: boolean) => void;
}) {
  const searchParams = useSearchParams();
  useEffect(() => {
    if (searchParams.get("tour") === "true") {
      setTourOpen(true);
    }
  }, [searchParams, setTourOpen]);
  return null;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <NavigationProvider>
      <SidebarProvider>
        <AppSidebar />
        <DashboardLayout>{children}</DashboardLayout>
        <CommandMenu />
      </SidebarProvider>
    </NavigationProvider>
  );
}
