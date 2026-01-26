"use client";

import { useNavigation } from "@/contexts/navigation-context";

export default function Page() {
  const { activeSection, activeSubSection } = useNavigation();

  // Set default navigation on mount
  useNavigation; // eslint-disable-line no-unused-expressions

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
        {activeSubSection || activeSection}
      </h1>
      <p className="text-muted-foreground mt-2 text-sm md:text-base">
        {activeSubSection
          ? `Explore ${activeSubSection} in ${activeSection}`
          : `Welcome to ${activeSection}`}
      </p>
      <div className="bg-muted/50 mt-6 rounded-xl overflow-auto h-96" />
    </div>
  );
}
