"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

/**
 * Maps URL path segments to human-readable section/subsection labels for breadcrumbs.
 * The navigation context derives active state from the current pathname.
 */
const ROUTE_MAP: Record<string, { section: string; subSection?: string }> = {
  "/dashboard": { section: "Dashboard" },
  "/dashboard/whiteboard": { section: "Collaboration", subSection: "Whiteboard" },
  "/dashboard/anonymous-connect": { section: "Connect", subSection: "Anonymous Connect" },
  "/dashboard/connect": { section: "Connect" },
  "/dashboard/friends": { section: "Socials", subSection: "Friends" },
  "/dashboard/chats": { section: "Socials", subSection: "Chats" },
  "/dashboard/upgrade": { section: "Upgrade Plan" },
  "/dashboard/billing": { section: "Settings", subSection: "Billing" },
  "/dashboard/settings": { section: "Settings", subSection: "General" },
  "/dashboard/edit-profile": { section: "Profile", subSection: "Edit Profile" },
  "/dashboard/blogs": { section: "Documentation", subSection: "Blogs" },
  "/dashboard/changelog": { section: "Documentation", subSection: "Changelog" },
  "/dashboard/calendar": { section: "Community", subSection: "Calendar" },
  "/dashboard/events": { section: "Community", subSection: "Events" },
  "/dashboard/community": { section: "Community" },
  "/dashboard/help": { section: "Help" },
  "/dashboard/ai-assistant": { section: "AI Assistant" },
  "/dashboard/professional": { section: "Connect", subSection: "Professional" },
  "/dashboard/join-mentor": { section: "Connect", subSection: "Join as Mentor" },
};

interface NavigationContextType {
  activeSection: string;
  activeSubSection: string | null;
  setActiveSection: (section: string, subSection?: string | null) => void;
  setActiveSubSection: (subSection: string | null) => void;
}

const NavigationContext = React.createContext<
  NavigationContextType | undefined
>(undefined);

export function NavigationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Derive section/subSection from the current route
  const derived = React.useMemo(() => {
    // Try exact match first, then progressively shorter paths
    if (ROUTE_MAP[pathname]) return ROUTE_MAP[pathname];

    // Try matching parent route (e.g. /dashboard/professional/[id] -> /dashboard/professional)
    const segments = pathname.split("/");
    while (segments.length > 2) {
      segments.pop();
      const parent = segments.join("/");
      if (ROUTE_MAP[parent]) return ROUTE_MAP[parent];
    }

    return { section: "Dashboard", subSection: undefined };
  }, [pathname]);

  const [activeSection, setActiveSectionState] = React.useState(derived.section);
  const [activeSubSection, setActiveSubSection] = React.useState<string | null>(
    derived.subSection ?? null,
  );

  // Sync with pathname changes
  React.useEffect(() => {
    setActiveSectionState(derived.section);
    setActiveSubSection(derived.subSection ?? null);
  }, [derived]);

  const setActiveSection = React.useCallback(
    (section: string, subSection?: string | null) => {
      setActiveSectionState(section);
      setActiveSubSection(subSection !== undefined ? subSection : null);
    },
    [],
  );

  return (
    <NavigationContext.Provider
      value={{ activeSection, activeSubSection, setActiveSection, setActiveSubSection }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = React.useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
}
