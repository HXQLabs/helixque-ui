"use client";

import { useState } from "react";
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

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { activeSection, activeSubSection } = useNavigation();
  const [tourOpen, setTourOpen] = useState(false);

  return (
    <>
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
          <Button
            variant="outline"
            size="sm"
            className="ml-auto mr-4"
            onClick={() => setTourOpen(true)}
          >
            Start Tour
          </Button>
        </header>
        <div
          className="flex flex-1 flex-col gap-4 p-4 pt-0 overflow-auto"
          id="dashboard-content"
        >
          {children}
        </div>
      </SidebarInset>
    </>
  );
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
