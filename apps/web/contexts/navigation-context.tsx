"use client";

import * as React from "react";

interface NavigationContextType {
  activeSection: string;
  activeSubSection: string | null;
  setActiveSection: (section: string, subSection?: string | null) => void;
}

const NavigationContext = React.createContext<
  NavigationContextType | undefined
>(undefined);

export function NavigationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeSection, setActiveSectionState] = React.useState("Playground");
  const [activeSubSection, setActiveSubSection] = React.useState<string | null>(
    "History",
  );

  const setActiveSection = React.useCallback(
    (section: string, subSection?: string | null) => {
      setActiveSectionState(section);
      setActiveSubSection(subSection !== undefined ? subSection : null);
    },
    [],
  );

  return (
    <NavigationContext.Provider
      value={{ activeSection, activeSubSection, setActiveSection }}
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
