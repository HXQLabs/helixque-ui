import DeviceCheck from "@/components/meet/DeviceCheck";
import React, { Suspense } from "react";

export default function MeetPage() {
  return (
    <Suspense
      fallback={<div className="p-6 text-center">Loading meeting…</div>}
    >
      <DeviceCheck />
    </Suspense>
  );
}
