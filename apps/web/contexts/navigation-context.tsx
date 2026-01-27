"use client";

import { useHelixque } from "@workspace/state";
import * as React from "react";

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
  const activeSubSection = useHelixque((state) => state.activeSubSection);
  const activeSection = useHelixque((state) => state.activeSection);
  const setActiveSubSection = useHelixque((state) => state.setActiveSubSection);
  const setActiveSectionState = useHelixque(
    (state) => state.setActiveSectionState,
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
      value={{
        activeSection,
        activeSubSection,
        setActiveSection,
        setActiveSubSection,
      }}
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
